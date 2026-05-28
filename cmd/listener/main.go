package main

import (
	"context"
	"errors"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

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
	listener, err := chain.NewListener(client, cfg.ContractAddress, history, slog.Default())
	if err != nil {
		log.Fatal(err)
	}

	if err := listener.Run(ctx); err != nil && !errors.Is(err, context.Canceled) {
		log.Fatal(err)
	}
}
