# land-ledge

Go backend for listening to Ethereum land registry contract events.

## Backend

The module uses:

- `github.com/gin-gonic/gin` for the HTTP API
- `github.com/ethereum/go-ethereum` for live Ethereum event subscriptions

The listener monitors these contract events:

- `LandRegistered(uint256 indexed landId, address indexed owner, string titleDeedHash, string location)`
- `OwnershipTransferred(uint256 indexed landId, address indexed from, address indexed to)`

## Run

```sh
RPC_URL=wss://your-ethereum-rpc \
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000 \
go run ./cmd/listener
```

Optional:

```sh
HTTP_ADDR=:8080
```

Endpoints:

- `GET /healthz`
- `GET /lands/:landID/history`
