package land

import (
	"errors"
	"testing"
	"time"
)

func TestHistoryRecorderFormatsOwnershipHistory(t *testing.T) {
	recorder := NewHistoryRecorder()
	registeredAt := time.Date(2026, 5, 28, 10, 0, 0, 0, time.UTC)
	transferredAt := registeredAt.Add(time.Minute)

	recorder.Record(Event{
		Type:            EventLandRegistered,
		LandID:          "1001",
		Owner:           "0x1111111111111111111111111111111111111111",
		TransactionHash: "0xregister",
		BlockNumber:     11,
		LogIndex:        0,
		ObservedAt:      registeredAt,
	})
	recorder.Record(Event{
		Type:            EventOwnershipTransferred,
		LandID:          "1001",
		From:            "0x1111111111111111111111111111111111111111",
		To:              "0x2222222222222222222222222222222222222222",
		TransactionHash: "0xtransfer",
		BlockNumber:     12,
		LogIndex:        0,
		ObservedAt:      transferredAt,
	})

	history, err := recorder.Format("1001")
	if err != nil {
		t.Fatalf("Format returned error: %v", err)
	}
	if history.CurrentOwner != "0x2222222222222222222222222222222222222222" {
		t.Fatalf("CurrentOwner = %q", history.CurrentOwner)
	}
	if len(history.Steps) != 2 {
		t.Fatalf("Steps length = %d", len(history.Steps))
	}
	if history.Steps[0].Event != EventLandRegistered {
		t.Fatalf("first step event = %q", history.Steps[0].Event)
	}
}

func TestHistoryRecorderReturnsNotFoundForUnknownLand(t *testing.T) {
	recorder := NewHistoryRecorder()

	_, err := recorder.Format("missing")
	if !errors.Is(err, ErrHistoryNotFound) {
		t.Fatalf("Format error = %v", err)
	}
}
