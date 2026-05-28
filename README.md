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

Prerequisites:

- Go 1.22+
- A WebSocket Ethereum RPC URL
- A deployed land registry contract address that emits the supported events

Set the required environment variables and start the backend:

```sh
RPC_URL=wss://your-ethereum-rpc \
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000 \
go run ./cmd/listener
```

The command starts both:

- a live Ethereum event listener for the configured contract
- a Gin HTTP API for health checks and in-memory ownership history

Optional environment variable:

```sh
HTTP_ADDR=:8080
```

If `HTTP_ADDR` is not set, the API listens on `:8080`.

Endpoints:

- `GET /healthz`
- `GET /lands/:landID/history`

Example checks:

```sh
curl http://localhost:8080/healthz
curl http://localhost:8080/lands/1001/history
```
