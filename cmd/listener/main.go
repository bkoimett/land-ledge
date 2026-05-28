package main

import (
	"context"
	"errors"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"land-ledge/backend/internal/api"
	"land-ledge/backend/internal/chain"
	"land-ledge/backend/internal/config"
	"land-ledge/backend/internal/land"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	client, err := chain.Dial(ctx, cfg.RPCURL)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	history := land.NewHistoryRecorder()
	listener, err := chain.NewListener(client, cfg.ContractAddress, history, slog.Default(), cfg.StartBlock)
	if err != nil {
		log.Fatal(err)
	}

	server := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           api.NewRouter(history),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	errs := make(chan error, 2)
	go func() {
		errs <- listener.Run(ctx)
	}()
	go func() {
		slog.Info("starting HTTP API", "addr", cfg.HTTPAddr)
		errs <- server.ListenAndServe()
	}()

	select {
	case err := <-errs:
		if err != nil && !errors.Is(err, context.Canceled) && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	case <-ctx.Done():
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatal(err)
	}
}
