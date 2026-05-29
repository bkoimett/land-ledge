# ArdhiChain - Blockchain Land Registry Demo

A demo-ready land registry application that simulates blockchain interactions using mock data. No real blockchain or backend server required.

## Features

- **Register Land** - Add new land records to the mock blockchain
- **Transfer Ownership** - Transfer land to new wallet addresses
- **Verify Ownership** - Search and verify land ownership details
- **View History** - See complete ownership timeline for any land ID

## Demo Credentials

Try these pre-seeded land IDs:
- **KE-001** - James Omondi, Kisumu, Kondele Ward, Plot 45B
- **KE-002** - Mary Wanjiku, Nairobi, Kilimani Area, Plot 12A
- **KE-003** - John Mwangi, Mombasa, Nyali Beach, Plot 78B

## How to Run Locally

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

All data is stored in browser memory (JavaScript objects) and persists during the session. Data resets when the page is refreshed.

### Mock Blockchain Functions

- `mockConnectWallet()` - Simulates wallet connection (1.5s delay)
- `mockRegisterLand(data)` - Registers new land (2s delay)
- `mockTransferOwnership(landId, newOwner)` - Transfers ownership (2s delay)
- `mockGetOwner(landId)` - Fetches land record (1s delay)
- `mockGetHistory(landId)` - Fetches ownership history (1s delay)

## Deployment

See [DEPLOY.md](./DEPLOY.md) for Vercel deployment instructions.

## Tech Stack

- Next.js 16 (Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- lucide-react (icons)
