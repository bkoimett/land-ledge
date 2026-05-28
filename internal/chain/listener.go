package chain

import (
	"context"
	"fmt"
	"log/slog"
	"math/big"
	"strings"
	"time"

	"land-ledge/backend/internal/land"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

const LandRegistryABI = `[
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"landId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"location","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"LandRegistered","type":"event"},
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"landId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"OwnershipTransferred","type":"event"}
]`

// ETHClient defines the subset of ethclient.Client methods used by the listener
type ETHClient interface {
	SubscribeFilterLogs(ctx context.Context, q ethereum.FilterQuery, ch chan<- types.Log) (ethereum.Subscription, error)
	FilterLogs(ctx context.Context, q ethereum.FilterQuery) ([]types.Log, error)
	Close()
}

type Listener struct {
	client     ETHClient
	contract   common.Address
	parsedABI  abi.ABI
	history    *land.HistoryRecorder
	logger     *slog.Logger
	startBlock *uint64
}

func NewListener(client ETHClient, contract common.Address, history *land.HistoryRecorder, logger *slog.Logger, startBlock *uint64) (*Listener, error) {
	if client == nil {
		return nil, fmt.Errorf("ethereum client is required")
	}
	if contract == (common.Address{}) {
		return nil, fmt.Errorf("contract address is required")
	}
	if history == nil {
		return nil, fmt.Errorf("history recorder is required")
	}

	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	if err != nil {
		return nil, fmt.Errorf("parse land registry ABI: %w", err)
	}
	if logger == nil {
		logger = slog.Default()
	}

	return &Listener{
		client:     client,
		contract:   contract,
		parsedABI:  parsedABI,
		history:    history,
		logger:     logger,
		startBlock: startBlock,
	}, nil
}

func Dial(ctx context.Context, rpcURL string) (*ethclient.Client, error) {
	client, err := ethclient.DialContext(ctx, rpcURL)
	if err != nil {
		return nil, fmt.Errorf("connect ethereum rpc: %w", err)
	}
	return client, nil
}

func (l *Listener) Run(ctx context.Context) error {
	// Backfill past events if startBlock is configured
	if l.startBlock != nil {
		if err := l.backfillPastEvents(ctx); err != nil {
			return fmt.Errorf("backfill past events: %w", err)
		}
	}

	registered := l.parsedABI.Events["LandRegistered"]
	transferred := l.parsedABI.Events["OwnershipTransferred"]

	query := ethereum.FilterQuery{
		Addresses: []common.Address{l.contract},
		Topics: [][]common.Hash{{
			registered.ID,
			transferred.ID,
		}},
	}

SubscriptionLoop:
	for {
		// Subscribe to new logs with retry/backoff
		logs := make(chan types.Log)
		sub, err := l.client.SubscribeFilterLogs(ctx, query, logs)
		if err != nil {
			l.logger.Error("failed to subscribe to logs, retrying in 5s", "error", err)
			select {
			case <-time.After(5 * time.Second):
				continue SubscriptionLoop
			case <-ctx.Done():
				return ctx.Err()
			}
		}

		l.logger.Info("listening for land registry events", "contract", l.contract.Hex())

		for {
			select {
			case err := <-sub.Err():
				l.logger.Warn("event subscription failed, reconnecting", "error", err)
				sub.Unsubscribe()
				continue SubscriptionLoop
			case entry, ok := <-logs:
				if !ok {
					l.logger.Warn("event log channel closed, reconnecting")
					sub.Unsubscribe()
					continue SubscriptionLoop
				}
				event, err := l.decodeLog(entry)
				if err != nil {
					l.logger.Warn("skipping unrecognized land event", "error", err, "tx", entry.TxHash.Hex())
					continue
				}
				l.history.Record(event)
				history, err := l.history.Format(event.LandID)
				if err != nil {
					l.logger.Warn("event recorded but history could not be formatted", "error", err, "landId", event.LandID)
					continue
				}
				l.logger.Info(
					"formatted ownership history",
					"type", event.Type,
					"landId", history.LandID,
					"currentOwner", history.CurrentOwner,
					"steps", len(history.Steps),
					"tx", event.TransactionHash,
				)
			case <-ctx.Done():
				sub.Unsubscribe()
				return ctx.Err()
			}
		}
	}
}

// backfillPastEvents processes historical logs from startBlock to the current block
func (l *Listener) backfillPastEvents(ctx context.Context) error {
	l.logger.Info("backfilling past events", "startBlock", *l.startBlock)

	registered := l.parsedABI.Events["LandRegistered"]
	transferred := l.parsedABI.Events["OwnershipTransferred"]

	query := ethereum.FilterQuery{
		Addresses: []common.Address{l.contract},
		FromBlock: new(big.Int).SetUint64(*l.startBlock),
		Topics: [][]common.Hash{{
			registered.ID,
			transferred.ID,
		}},
	}

	logs, err := l.client.FilterLogs(ctx, query)
	if err != nil {
		return fmt.Errorf("filter logs: %w", err)
	}

	for _, log := range logs {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			event, err := l.decodeLog(log)
			if err != nil {
				l.logger.Warn("skipping unrecognized land event during backfill", "error", err, "tx", log.TxHash.Hex())
				continue
			}
			l.history.Record(event)
			// No need to format history for each event during backfill
		}
	}

	l.logger.Info("backfill completed", "eventsProcessed", len(logs))
	return nil
}

func (l *Listener) decodeLog(entry types.Log) (land.Event, error) {
	if len(entry.Topics) == 0 {
		return land.Event{}, fmt.Errorf("missing event topic")
	}

	switch entry.Topics[0] {
	case l.parsedABI.Events["LandRegistered"].ID:
		return l.decodeLandRegistered(entry)
	case l.parsedABI.Events["OwnershipTransferred"].ID:
		return l.decodeOwnershipTransferred(entry)
	default:
		return land.Event{}, fmt.Errorf("unknown topic %s", entry.Topics[0])
	}
}

func (l *Listener) decodeLandRegistered(entry types.Log) (land.Event, error) {
	if len(entry.Topics) < 3 {
		return land.Event{}, fmt.Errorf("LandRegistered expects 2 indexed topics")
	}

	values := struct {
		Location  string
		Timestamp *big.Int
	}{}
	if err := l.parsedABI.UnpackIntoInterface(&values, "LandRegistered", entry.Data); err != nil {
		return land.Event{}, fmt.Errorf("unpack LandRegistered: %w", err)
	}

	return land.Event{
		Type:            land.EventLandRegistered,
		LandID:          entry.Topics[1].Hex(),
		Owner:           topicAddress(entry.Topics[2]).Hex(),
		Location:        values.Location,
		TransactionHash: entry.TxHash.Hex(),
		BlockNumber:     entry.BlockNumber,
		LogIndex:        entry.Index,
		ObservedAt:      time.Unix(values.Timestamp.Int64(), 0).UTC(),
	}, nil
}

func (l *Listener) decodeOwnershipTransferred(entry types.Log) (land.Event, error) {
	if len(entry.Topics) < 4 {
		return land.Event{}, fmt.Errorf("OwnershipTransferred expects 3 indexed topics")
	}

	values := struct {
		Timestamp *big.Int
	}{}
	if err := l.parsedABI.UnpackIntoInterface(&values, "OwnershipTransferred", entry.Data); err != nil {
		return land.Event{}, fmt.Errorf("unpack OwnershipTransferred: %w", err)
	}

	return land.Event{
		Type:            land.EventOwnershipTransferred,
		LandID:          entry.Topics[1].Hex(),
		From:            topicAddress(entry.Topics[2]).Hex(),
		To:              topicAddress(entry.Topics[3]).Hex(),
		TransactionHash: entry.TxHash.Hex(),
		BlockNumber:     entry.BlockNumber,
		LogIndex:        entry.Index,
		ObservedAt:      time.Unix(values.Timestamp.Int64(), 0).UTC(),
	}, nil
}

func topicUint(topic common.Hash) *big.Int {
	return new(big.Int).SetBytes(topic.Bytes())
}

func topicAddress(topic common.Hash) common.Address {
	return common.BytesToAddress(topic.Bytes()[12:])
}
