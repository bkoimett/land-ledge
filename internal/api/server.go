package api

import (
	"errors"
	"log/slog"
	"math/big"
	"net/http"
	"time"

	"land-ledge/backend/internal/land"

	"github.com/gin-gonic/gin"
)

func NewRouter(history *land.HistoryRecorder) http.Handler {
	router := gin.New()
	router.Use(gin.Recovery())
	// Request logging middleware
	router.Use(func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method
		c.Next()
		latency := time.Since(start)
		status := c.Writer.Status()
		slog.Info("HTTP request",
			"method", method,
			"path", path,
			"status", status,
			"latency", latency,
		)
	})

	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.GET("/lands/:landID/history", func(c *gin.Context) {
		landID := c.Param("landID")
		if landID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "landID is required"})
			return
		}

		// Validate that landID is a non-negative integer (supporting full uint256)
		if bi, ok := new(big.Int).SetString(landID, 10); !ok || bi.Sign() < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "landID must be a non-negative integer"})
			return
		}

		ownershipHistory, err := history.Format(landID)
		if errors.Is(err, land.ErrHistoryNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ownership history not found"})
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ownership history unavailable"})
			return
		}

		c.JSON(http.StatusOK, ownershipHistory)
	})

	return router
}
