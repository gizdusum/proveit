# AgentBond Lite

AgentBond Lite is an English-only AI x blockchain MVP built for the Tezos EVM (Etherlink) AI Hackathon.

It shows a simple but real onchain labor flow:

- a client opens a task and escrows a reward in XTZ
- an AI agent stakes capital to claim the task
- the agent generates a report and anchors its hash onchain
- the client accepts or rejects the result
- the contract releases the reward or slashes the stake

This is intentionally a compact hackathon scope. The goal is to prove that AI work can be settled on Etherlink with visible economic rules instead of trust alone.

## Why this fits the hackathon

The submission requirements call for:

- deployment on Tezos EVM (Etherlink)
- AI as a meaningful part of the product
- open-source code
- a deployed contract address
- a working demo flow

AgentBond Lite fits those requirements by combining:

- an Etherlink-native Solidity contract
- an AI report generation flow
- onchain escrow
- onchain agent staking
- onchain task resolution and reputation

## Product thesis

Most AI apps stop at output generation.

AgentBond Lite asks a stronger question:

> What if an AI agent had to post stake before it could get paid?

That creates a more legible marketplace for AI work:

- tasks become explicit onchain requests
- rewards are escrowed
- submissions are hash-verifiable
- quality is resolved through acceptance or rejection
- successful agents build a basic onchain record

## Core contract

`contracts/AgentBondLite.sol`

The contract handles:

- task creation with reward escrow
- task claiming with stake lock
- report hash submission
- client acceptance
- client rejection with stake slash
- basic agent reputation counters

## Stack

- Solidity `0.8.24`
- Hardhat
- Ethers.js
- vanilla HTML/CSS/JS frontend
- Node.js server for static hosting and AI API proxy

## Etherlink network

The project is configured for:

- `Etherlink Shadownet Testnet`
- Chain ID: `127823`
- RPC: `https://node.shadownet.etherlink.com`
- Explorer: `https://shadownet.explorer.etherlink.com`
- Native token: `XTZ`

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set:

- `PRIVATE_KEY` for deployment
- `OPENAI_API_KEY` if you want live AI report generation

### 3. Compile

```bash
npm run compile
npm run export:abi
```

### 4. Run locally

```bash
npm start
```

Open:

```bash
http://127.0.0.1:8788
```

## Deploy to Etherlink testnet

1. Fund your EVM wallet with Etherlink testnet XTZ.
2. Put the wallet private key in `.env`.
3. Deploy:

```bash
npm run deploy:etherlink:testnet
```

4. Export the ABI:

```bash
npm run export:abi
```

The deployment metadata is written to:

`deployments/etherlinkTestnet.json`

## Optional web deployment

The project can also be deployed to Vercel:

- static UI is served from `public/`
- API endpoints are served from `api/`
- set `OPENAI_API_KEY` in the Vercel project if you want live AI output

## Demo flow

1. Connect wallet and switch to Etherlink.
2. Create a task with reward escrow.
3. Generate an AI report.
4. Claim the task with agent stake.
5. Submit the report hash and URI.
6. Accept or reject the task.
7. Show the task state and explorer link.

## Hackathon submission checklist

- [ ] Contract deployed on Etherlink
- [ ] Repo pushed publicly
- [ ] README completed
- [ ] Demo video recorded
- [ ] Contract address pasted into the form
- [ ] Wallet address pasted into the form

## Notes

- This MVP uses client acceptance instead of decentralized dispute resolution.
- The AI report can run in live mode with an API key or fallback mode without one.
- The first version optimizes for a professional, demoable hackathon submission rather than full protocol depth.
