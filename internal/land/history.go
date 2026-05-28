package land

import (
	"errors"
	"sort"
	"sync"
	"time"
)

var ErrHistoryNotFound = errors.New("ownership history not found")

type EventType string

const (
	EventLandRegistered       EventType = "LandRegistered"
	EventOwnershipTransferred EventType = "OwnershipTransferred"
)

type Event struct {
	Type            EventType `json:"type"`
	LandID          string    `json:"landId"`
	Owner           string    `json:"owner,omitempty"`
	From            string    `json:"from,omitempty"`
	To              string    `json:"to,omitempty"`
	TitleDeedHash   string    `json:"titleDeedHash,omitempty"`
	Location        string    `json:"location,omitempty"`
	TransactionHash string    `json:"transactionHash"`
	BlockNumber     uint64    `json:"blockNumber"`
	LogIndex        uint      `json:"logIndex"`
	ObservedAt      time.Time `json:"observedAt"`
}

type OwnershipStep struct {
	Event           EventType `json:"event"`
	Owner           string    `json:"owner,omitempty"`
	From            string    `json:"from,omitempty"`
	To              string    `json:"to,omitempty"`
	TransactionHash string    `json:"transactionHash"`
	BlockNumber     uint64    `json:"blockNumber"`
	ObservedAt      time.Time `json:"observedAt"`
}

type OwnershipHistory struct {
	LandID       string          `json:"landId"`
	CurrentOwner string          `json:"currentOwner,omitempty"`
	Steps        []OwnershipStep `json:"steps"`
}

type HistoryRecorder struct {
	mu     sync.RWMutex
	events map[string][]Event
}

func NewHistoryRecorder() *HistoryRecorder {
	return &HistoryRecorder{events: make(map[string][]Event)}
}

func (r *HistoryRecorder) Record(event Event) {
	r.mu.Lock()
	defer r.mu.Unlock()

	events := append(r.events[event.LandID], event)
	sort.SliceStable(events, func(i, j int) bool {
		if events[i].BlockNumber == events[j].BlockNumber {
			return events[i].LogIndex < events[j].LogIndex
		}
		return events[i].BlockNumber < events[j].BlockNumber
	})
	r.events[event.LandID] = events
}

func (r *HistoryRecorder) Format(landID string) (OwnershipHistory, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	events, ok := r.events[landID]
	if !ok {
		return OwnershipHistory{}, ErrHistoryNotFound
	}

	history := OwnershipHistory{
		LandID: landID,
		Steps:  make([]OwnershipStep, 0, len(events)),
	}
	for _, event := range events {
		step := OwnershipStep{
			Event:           event.Type,
			TransactionHash: event.TransactionHash,
			BlockNumber:     event.BlockNumber,
			ObservedAt:      event.ObservedAt,
		}

		switch event.Type {
		case EventLandRegistered:
			step.Owner = event.Owner
			history.CurrentOwner = event.Owner
		case EventOwnershipTransferred:
			step.From = event.From
			step.To = event.To
			history.CurrentOwner = event.To
		}

		history.Steps = append(history.Steps, step)
	}

	return history, nil
}
