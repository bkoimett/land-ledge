package api

import (
	"errors"
	"net/http"

	"land-ledge/backend/internal/land"

	"github.com/gin-gonic/gin"
)

func NewRouter(history *land.HistoryRecorder) http.Handler {
	router := gin.New()
	router.Use(gin.Recovery())

	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.GET("/lands/:landID/history", func(c *gin.Context) {
		ownershipHistory, err := history.Format(c.Param("landID"))
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
