# land-ledge

Go backend for listening to Ethereum land registry contract events.

## Backend

The module uses:

- `github.com/gin-gonic/gin` for the HTTP API
- `github.com/ethereum/go-ethereum` for live Ethereum event subscriptions

The listener monitors these contract events:

- `LandRegistered(bytes32 indexed landId, address indexed owner, string location, uint256 timestamp)`
- `OwnershipTransferred(bytes32 indexed landId, address indexed previousOwner, address indexed newOwner, uint256 timestamp)`

## Smart Contract Deployment

To generate a new contract address, you must deploy the contract to a network.

### 1. Start a local node
```sh
npx hardhat node
```

### 2. Deploy the contract
```sh
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script will output the new address to the console and save it to `deployments/contract.json`.

## Run

Prerequisites:

- Go 1.22+
- A WebSocket Ethereum RPC URL
- A deployed land registry contract address

Set the required environment variables and start the backend:

```sh
RPC_URL=ws://localhost:8545 \
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3 \
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
- `GET /lands/:landID/history` (landID can be decimal or hex hash)

Example checks:

```sh
curl http://localhost:8080/healthz
curl http://localhost:8080/lands/0x125728072aa19c247fdbec783aafbd2a7322071ae8a60c5f88953ca44f28eafa/history
```
