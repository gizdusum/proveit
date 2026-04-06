# ⚰️ DeadDrop

> AI-powered onchain inheritance protocol on Etherlink (Tezos EVM)

**Built for the [Tezos EVM AI Hackathon](https://tezosevm.nowmedia.co) · April 2026**

---

## The Problem

Over **$140 billion** in crypto is permanently inaccessible because wallet owners pass away without a recovery plan. Web3 gives people self-custody, but it still has no native inheritance rail.

## The Solution

DeadDrop lets a user write an inheritance plan in plain English. AI parses that plan into structured beneficiary data, the plan is registered on Etherlink, and a monitoring agent checks for long-term inactivity. If the wallet remains inactive for **300 days**, the smart contract can execute the distribution exactly as defined.

This makes inheritance:

- understandable for normal users
- enforceable onchain
- independent from trusted custodians

---

## How It Works

1. **Connect wallet** on Etherlink Shadownet
2. **Write your plan** in natural language:
   `Send 70% to my wife and 30% to charity`
3. **AI parses it** into structured beneficiaries using OpenAI GPT-4o-mini
4. **Create vault** onchain with Etherlink smart contract rules + initial XTZ deposit
5. **Agent monitors** all vaults every 24 hours
6. **Day 293** — warning email is sent and recorded onchain through `markWarningIssued()`
7. **Day 300** — `executeInheritance()` can distribute vault funds automatically
8. **Owner can ping activity** at any time using `pingActivity()` to reset the timer

---

## Live Deployment

- **Contract Address:** `0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e`
- **Explorer:** [shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e](https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e)
- **Network:** Etherlink Shadownet
- **Chain ID:** `127823`
- **Demo wallet:** `0xb61C1007506d31620895dfd118fa2b12CF3A2484`

Verified onchain transactions:

- **createVault:** [0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc](https://shadownet.explorer.etherlink.com/tx/0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc)
- **pingActivity:** [0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354](https://shadownet.explorer.etherlink.com/tx/0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Etherlink (Tezos EVM), Chain ID `127823` |
| Smart Contract | Solidity `^0.8.20` |
| AI Parsing | OpenAI GPT-4o-mini |
| Monitoring Agent | Node.js + `node-cron` + `ethers` |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Wallet Connection | wagmi v2 + injected wallets (MetaMask / Rabby) |
| Email | Nodemailer (Gmail SMTP) |

---

## Project Structure

```text
deaddrop/
├── contracts/
│   └── DeadDrop.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── DeadDrop.test.js
├── agent/
│   ├── index.js
│   ├── monitor.js
│   ├── parser.js
│   ├── emailer.js
│   └── executor.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/abi/
└── DEMO_SCRIPT.md
```

---

## Smart Contract

**DeadDrop.sol** manages vault creation, inactivity tracking, beneficiary distribution, and AI-agent execution.

### Core Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `createVault()` | public | Store inheritance rules + deposit XTZ |
| `pingActivity()` | vault owner | Reset the 300-day inactivity counter |
| `depositToVault()` | vault owner | Add more XTZ to an existing vault |
| `markWarningIssued()` | authorized AI agent | Record day-293 warning onchain |
| `executeInheritance()` | authorized AI agent | Distribute funds after threshold |
| `getVaultStatus()` | public view | Read vault health, balance, countdown |
| `getBeneficiaries()` | public view | Read vault beneficiary configuration |

### Key Design Choice

DeadDrop does **not** claim to detect literal death.  
It implements a **dead man’s switch**:

- long inactivity
- warning grace period
- automated execution if there is no response

That keeps the product honest, demoable, and enforceable onchain.

---

## AI Agent

The DeadDrop agent runs as a Node.js service and performs four jobs:

1. Poll all registered vaults every 24 hours
2. Check inactivity thresholds
3. Trigger `markWarningIssued()` when warning threshold is reached
4. Trigger `executeInheritance()` after the final threshold

### NLP Parser

The same agent stack also exposes natural-language parsing logic:

- input: plain-English inheritance plan
- output: structured JSON beneficiaries
- validation: addresses, percentages, total sum = `10000` basis points

This is what bridges human intent to smart contract inputs.

---

## Frontend

The frontend provides two clear states:

### Landing

- explains the problem
- explains the Etherlink deployment
- explains the 300-day inactivity model

### Dashboard

- wallet connection
- natural-language inheritance form
- AI parsed preview
- vault creation flow
- live vault status from chain
- `I’m Alive` ping action

---

## Setup

### Prerequisites

- Node.js 18+
- funded Etherlink Shadownet wallet
- OpenAI API key
- Gmail App Password for warning emails

### Root Install

```bash
cd deaddrop
npm install
```

### Contract

```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network etherlink
```

### Agent

```bash
node agent/index.js --test
node agent/index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

---

## Environment Variables

### Root `.env`

```bash
ETHERLINK_RPC_URL=https://node.shadownet.etherlink.com
DEADDROP_CONTRACT_ADDRESS=0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e
AGENT_ADDRESS=0xb61C1007506d31620895dfd118fa2b12CF3A2484
AGENT_PRIVATE_KEY=0x...
OPENAI_API_KEY=sk-...
EMAIL_USER=your@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend `.env.local`

```bash
NEXT_PUBLIC_DEADDROP_ADDRESS=0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e
NEXT_PUBLIC_ETHERLINK_CHAIN_ID=127823
NEXT_PUBLIC_ETHERLINK_RPC_URL=https://node.shadownet.etherlink.com
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
```

---

## Hackathon Fit

DeadDrop maps directly to the Tezos EVM AI Hackathon criteria:

- ✅ **AI agents interacting with smart contracts**
  - AI parses natural language into contract-ready inputs
  - AI monitoring agent calls contract functions autonomously

- ✅ **Creative application**
  - onchain inheritance is a real, painful, unsolved Web3 problem

- ✅ **Ecosystem impact**
  - proves Etherlink can host long-lived, low-cost AI-triggered automation

- ✅ **Tezos EVM deployment**
  - deployed on Etherlink Shadownet with real verified transactions

---

## Why Etherlink?

DeadDrop depends on low-cost, frequent agent monitoring.

Etherlink matters because it gives us:

- **low gas fees** for repeated monitoring actions
- **fast finality** for reliable warning and execution transactions
- **full EVM compatibility** so Solidity and standard tooling work immediately

This type of always-on AI + contract workflow is much harder to justify economically on Ethereum mainnet.

---

## Demo Notes

The complete demo script is in [DEMO_SCRIPT.md](/Users/denizalagoz/Documents/New%20project/deaddrop/DEMO_SCRIPT.md).

Recommended live demo sequence:

1. Open landing page
2. Connect wallet
3. Parse natural-language inheritance plan
4. Show beneficiary preview
5. Create vault
6. Show onchain vault status
7. Trigger `I’m Alive` ping
8. Show explorer transaction
9. Show monitoring agent terminal output

---

## GitHub

Repository path for this hackathon branch:

- [github.com/gizdusum/proveit/tree/codex/deaddrop/deaddrop](https://github.com/gizdusum/proveit/tree/codex/deaddrop/deaddrop)

---

## Disclaimer

This is a hackathon prototype built for Etherlink Shadownet.  
Do **not** use with real mainnet funds.
