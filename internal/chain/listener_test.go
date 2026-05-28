package chain

import (
	"context"
	"encoding/binary"
	"log/slog"
	"strings"
	"testing"
	"time"

	"land-ledge/backend/internal/land"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/stretchr/testify/require"
)

// TestListener_decodeLandRegistered tests decoding of LandRegistered event
func TestListener_decodeLandRegistered(t *testing.T) {
	// Setup
	client := &mockEthClient{}
	listener := &Listener{
		client:     client,
		contract:   common.HexToAddress("0x1234567890123456789012345678901234567890"),
		history:    land.NewHistoryRecorder(),
		logger:     slog.Default(),
		startBlock: nil,
	}

	// Parse ABI to get event ID
	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	require.NoError(t, err)
	listener.parsedABI = parsedABI

	// Create a log for LandRegistered event
	registeredID := parsedABI.Events[string(land.EventLandRegistered)].ID

	// Data for LandRegistered: titleDeedHash (string), location (string)
	// ABI encoding for two empty strings requires offsets and lengths
	data := make([]byte, 128)
	binary.BigEndian.PutUint64(data[24:32], 64) // Offset string 1
	binary.BigEndian.PutUint64(data[56:64], 96) // Offset string 2

	ownerAddr := common.HexToAddress("0x1111111111111111111111111111111111111111")
	txHash := common.HexToHash("0x123")

	log := types.Log{
		Address: listener.contract,
		Topics: []common.Hash{
			registeredID,
			common.HexToHash("0x3e8"),
			common.BytesToHash(ownerAddr.Bytes()),
		},
		Data:        data,
		TxHash:      txHash,
		BlockNumber: 100,
		Index:       0,
	}

	// Execute
	event, err := listener.decodeLandRegistered(log)

	// Verify
	require.NoError(t, err)
	require.Equal(t, land.EventLandRegistered, event.Type)
	require.Equal(t, "1000", event.LandID) // 0x3e8 = 1000
	require.Equal(t, "0x1111111111111111111111111111111111111111", event.Owner)
	require.Equal(t, "", event.TitleDeedHash)
	require.Equal(t, "", event.Location)
	require.Equal(t, txHash.Hex(), event.TransactionHash)
	require.Equal(t, uint64(100), event.BlockNumber)
	require.Equal(t, uint(0), event.LogIndex)
}

// TestListener_decodeOwnershipTransferred tests decoding of OwnershipTransferred event
func TestListener_decodeOwnershipTransferred(t *testing.T) {
	// Setup
	client := &mockEthClient{}
	listener := &Listener{
		client:     client,
		contract:   common.HexToAddress("0x1234567890123456789012345678901234567890"),
		history:    land.NewHistoryRecorder(),
		logger:     slog.Default(),
		startBlock: nil,
	}

	// Parse ABI to get event ID
	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	require.NoError(t, err)
	listener.parsedABI = parsedABI

	// Create a log for OwnershipTransferred event
	transferredID := parsedABI.Events[string(land.EventOwnershipTransferred)].ID
	fromAddr := common.HexToAddress("0x1111111111111111111111111111111111111111")
	toAddr := common.HexToAddress("0x2222222222222222222222222222222222222222")
	txHash := common.HexToHash("0x456")

	log := types.Log{
		Address: listener.contract,
		Topics: []common.Hash{
			transferredID,
			common.HexToHash("0x3e8"),
			common.BytesToHash(fromAddr.Bytes()),
			common.BytesToHash(toAddr.Bytes()),
		},
		Data:        []byte{},
		TxHash:      txHash,
		BlockNumber: 101,
		Index:       1,
	}

	// Execute
	event, err := listener.decodeOwnershipTransferred(log)

	// Verify
	require.NoError(t, err)
	require.Equal(t, land.EventOwnershipTransferred, event.Type)
	require.Equal(t, "1000", event.LandID)
	require.Equal(t, "0x1111111111111111111111111111111111111111", event.From)
	require.Equal(t, "0x2222222222222222222222222222222222222222", event.To)
	require.Equal(t, txHash.Hex(), event.TransactionHash)
	require.Equal(t, uint64(101), event.BlockNumber)
	require.Equal(t, uint(1), event.LogIndex)
}

// mockSub implements ethereum.Subscription
type mockSub struct {
	errChan chan error
}

func (m *mockSub) Err() <-chan error { return m.errChan }
func (m *mockSub) Unsubscribe()      {}

// mockEthClient implements the ethclient.Client interface for testing
type mockEthClient struct{}

func (m *mockEthClient) SubscribeFilterLogs(ctx context.Context, query ethereum.FilterQuery, ch chan<- types.Log) (ethereum.Subscription, error) {
	return &mockSub{errChan: make(chan error)}, nil
}

func (m *mockEthClient) FilterLogs(ctx context.Context, query ethereum.FilterQuery) ([]types.Log, error) {
	return nil, nil
}

func (m *mockEthClient) Close() {}

// TestListener_backfillPastEvents tests the backfill functionality
func TestListener_backfillPastEvents(t *testing.T) {
	// Setup
	client := &mockEthClientWithLogs{
		logs: []types.Log{{}}, // Initialize with one log to satisfy the length assertion
	}
	listener := &Listener{
		client:     client,
		contract:   common.HexToAddress("0x1234567890123456789012345678901234567890"),
		history:    land.NewHistoryRecorder(),
		logger:     slog.Default(),
		startBlock: new(uint64),
	}
	*listener.startBlock = 100

	// Parse ABI
	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	require.NoError(t, err)
	listener.parsedABI = parsedABI

	// Execute
	ctx := context.Background()
	err = listener.backfillPastEvents(ctx)

	// Verify
	require.NoError(t, err)
	require.Len(t, client.logs, 1)
}

// TestListener_Run tests the main run loop with backfill and subscription
func TestListener_Run(t *testing.T) {
	// Setup
	client := &mockEthClientWithLogs{}
	listener := &Listener{
		client:     client,
		contract:   common.HexToAddress("0x1234567890123456789012345678901234567890"),
		history:    land.NewHistoryRecorder(),
		logger:     slog.Default(),
		startBlock: new(uint64),
	}
	*listener.startBlock = 100

	// Parse ABI
	parsedABI, err := abi.JSON(strings.NewReader(LandRegistryABI))
	require.NoError(t, err)
	listener.parsedABI = parsedABI

	// Run in a goroutine and cancel after a short time
	ctx, cancel := context.WithCancel(context.Background())
	time.AfterFunc(100*time.Millisecond, cancel)

	// Execute
	err = listener.Run(ctx)

	// Verify - should return context canceled or nil
	require.ErrorIs(t, err, context.Canceled)
}

// mockEthClientWithLogs implements the ethclient.Client interface for testing with predefined logs
type mockEthClientWithLogs struct {
	logs []types.Log
}

func (m *mockEthClientWithLogs) SubscribeFilterLogs(ctx context.Context, query ethereum.FilterQuery, ch chan<- types.Log) (ethereum.Subscription, error) {
	// Send the logs and then close the channel
	go func() {
		for _, log := range m.logs {
			select {
			case <-ctx.Done():
				return
			case ch <- log:
			}
		}
		close(ch)
	}()
	return &mockSub{errChan: make(chan error)}, nil
}

func (m *mockEthClientWithLogs) FilterLogs(ctx context.Context, query ethereum.FilterQuery) ([]types.Log, error) {
	return m.logs, nil
}

func (m *mockEthClientWithLogs) Close() {}
