package config

import (
	"errors"
	"os"

	"github.com/ethereum/go-ethereum/common"
)

type Config struct {
	HTTPAddr        string
	RPCURL          string
	ContractAddress common.Address
}

func Load() (Config, error) {
	cfg := Config{
		HTTPAddr: ":8080",
		RPCURL:   os.Getenv("RPC_URL"),
	}

	if value := os.Getenv("HTTP_ADDR"); value != "" {
		cfg.HTTPAddr = value
	}

	contract := os.Getenv("CONTRACT_ADDRESS")
	if contract == "" {
		return cfg, errors.New("CONTRACT_ADDRESS is required")
	}
	if !common.IsHexAddress(contract) {
		return cfg, errors.New("CONTRACT_ADDRESS must be a valid hex address")
	}
	cfg.ContractAddress = common.HexToAddress(contract)

	if cfg.RPCURL == "" {
		return cfg, errors.New("RPC_URL is required")
	}

	return cfg, nil
}
