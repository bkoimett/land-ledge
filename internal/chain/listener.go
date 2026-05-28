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
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"landId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"titleDeedHash","type":"string"},{"indexed":false,"internalType":"string","name":"location","type":"string"}],"name":"LandRegistered","type":"event"},
	{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"landId","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"}
]`

type Listener struct {
	client    *ethclient.Client
	contract  common.Address
	parsedABI abi.ABI
	history   *land.HistoryRecorder
	logger    *slog.Logger
}

func NewListener(client *ethclient.Client, contract common.Address, history *land.HistoryRecorder, logger *slog.Logger) (*Listener, error) {
	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	if err != nil {
		return nil, fmt.Errorf("parse land registry ABI: %w", err)
	}
	if logger == nil {
		logger = slog.Default()
	}

	return &Listener{
		client:    client,
		contract:  contract,
		parsedABI: parsedABI,
		history:   history,
		logger:    logger,
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
	registered := l.parsedABI.Events[string(land.EventLandRegistered)]
	transferred := l.parsedABI.Events[string(land.EventOwnershipTransferred)]

	query := ethereum.FilterQuery{
		Addresses: []common.Address{l.contract},
		Topics: [][]common.Hash{{
			registered.ID,
			transferred.ID,
		}},
	}

	logs := make(chan types.Log)
	sub, err := l.client.SubscribeFilterLogs(ctx, query, logs)
	if err != nil {
		return fmt.Errorf("subscribe contract logs: %w", err)
	}
	defer sub.Unsubscribe()

	l.logger.Info("listening for land registry events", "contract", l.contract.Hex())

	for {
		select {
		case err := <-sub.Err():
			return fmt.Errorf("event subscription failed: %w", err)
		case entry := <-logs:
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
			return ctx.Err()
		}
	}
}

func (l *Listener) decodeLog(entry types.Log) (land.Event, error) {
	if len(entry.Topics) == 0 {
		return land.Event{}, fmt.Errorf("missing event topic")
	}

	switch entry.Topics[0] {
	case l.parsedABI.Events[string(land.EventLandRegistered)].ID:
		return l.decodeLandRegistered(entry)
	case l.parsedABI.Events[string(land.EventOwnershipTransferred)].ID:
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
		TitleDeedHash string
		Location      string
	}{}
	if err := l.parsedABI.UnpackIntoInterface(&values, string(land.EventLandRegistered), entry.Data); err != nil {
		return land.Event{}, fmt.Errorf("unpack LandRegistered: %w", err)
	}

	return land.Event{
		Type:            land.EventLandRegistered,
		LandID:          topicUint(entry.Topics[1]).String(),
		Owner:           topicAddress(entry.Topics[2]).Hex(),
		TitleDeedHash:   values.TitleDeedHash,
		Location:        values.Location,
		TransactionHash: entry.TxHash.Hex(),
		BlockNumber:     entry.BlockNumber,
		LogIndex:        entry.Index,
		ObservedAt:      time.Now().UTC(),
	}, nil
}

func (l *Listener) decodeOwnershipTransferred(entry types.Log) (land.Event, error) {
	if len(entry.Topics) < 4 {
		return land.Event{}, fmt.Errorf("OwnershipTransferred expects 3 indexed topics")
	}

	return land.Event{
		Type:            land.EventOwnershipTransferred,
		LandID:          topicUint(entry.Topics[1]).String(),
		From:            topicAddress(entry.Topics[2]).Hex(),
		To:              topicAddress(entry.Topics[3]).Hex(),
		TransactionHash: entry.TxHash.Hex(),
		BlockNumber:     entry.BlockNumber,
		LogIndex:        entry.Index,
		ObservedAt:      time.Now().UTC(),
	}, nil
}

func topicUint(topic common.Hash) *big.Int {
	return new(big.Int).SetBytes(topic.Bytes())
}

func topicAddress(topic common.Hash) common.Address {
	return common.BytesToAddress(topic.Bytes()[12:])
}
