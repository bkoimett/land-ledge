package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"land-ledge/backend/internal/land"

	"github.com/stretchr/testify/require"
)

func TestGetLandHistoryNotFound(t *testing.T) {
	history := land.NewHistoryRecorder()
	router := NewRouter(history)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/lands/999/history", nil)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusNotFound, w.Code)
	require.Contains(t, w.Body.String(), "ownership history not found")
}

func TestGetLandHistoryInvalidID(t *testing.T) {
	history := land.NewHistoryRecorder()
	router := NewRouter(history)

	// Test empty landID
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/lands//history", nil)
	router.ServeHTTP(w, req)
	require.Equal(t, http.StatusBadRequest, w.Code)
	require.Contains(t, w.Body.String(), "landID is required")

	// Test non-numeric landID
	w = httptest.NewRecorder()
	req, _ = http.NewRequest(http.MethodGet, "/lands/abc/history", nil)
	router.ServeHTTP(w, req)
	require.Equal(t, http.StatusBadRequest, w.Code)
	require.Contains(t, w.Body.String(), "landID must be a non-negative integer")

	// Test negative landID
	w = httptest.NewRecorder()
	req, _ = http.NewRequest(http.MethodGet, "/lands/-1/history", nil)
	router.ServeHTTP(w, req)
	require.Equal(t, http.StatusBadRequest, w.Code)
	require.Contains(t, w.Body.String(), "landID must be a non-negative integer")
}

func TestGetLandHistorySuccess(t *testing.T) {
	history := land.NewHistoryRecorder()
	// Add a sample event
	history.Record(land.Event{
		Type:            land.EventLandRegistered,
		LandID:          "1001",
		Owner:           "0x1111111111111111111111111111111111111111",
		TransactionHash: "0xregister",
		BlockNumber:     11,
		LogIndex:        0,
		ObservedAt:      time.Now().UTC(),
	})

	router := NewRouter(history)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/lands/1001/history", nil)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
	require.Contains(t, w.Body.String(), `"landId":"1001"`)
	require.Contains(t, w.Body.String(), `"currentOwner":"0x1111111111111111111111111111111111111111"`)
}
