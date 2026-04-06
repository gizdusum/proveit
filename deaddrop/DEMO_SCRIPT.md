# DeadDrop Demo Script — 3 Minutes

## 0:00 - 0:20 — Problem

“Over 140 billion dollars in crypto is effectively lost because Web3 has no native inheritance mechanism.
DeadDrop solves that with AI-powered onchain inheritance on Etherlink.”

## 0:20 - 0:40 — Landing + Wallet

- Open the DeadDrop site
- Show the landing hero
- Explain:
  - plain-English inheritance
  - 300-day inactivity rule
  - Etherlink deployment
- Connect wallet

Use demo wallet if needed:

`0xb61C1007506d31620895dfd118fa2b12CF3A2484`

## 0:40 - 1:15 — AI Parsing

- Paste this prompt:

`Send 70% to my wife at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 and 30% to charity at 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

- Add warning email
- Keep `0.01 XTZ` as initial deposit
- Click **Parse with AI**
- Show the beneficiary preview:
  - wife → 70%
  - charity → 30%

Explain:

“OpenAI parses human intent into exact smart contract parameters. The user does not need to handcraft arrays, percentages, or basis points.”

## 1:15 - 1:45 — Create Vault

- Click **Create DeadDrop Vault**
- Approve transaction in wallet
- Show success toast

Reference confirmed create tx:

- [0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc](https://shadownet.explorer.etherlink.com/tx/0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc)

## 1:45 - 2:10 — Vault Status

- Show vault dashboard
- Highlight:
  - active vault
  - 0 days inactive
  - 300 days until execution
  - 2 beneficiaries
  - locked balance

Explain:

“Everything critical is now onchain: the vault exists, the beneficiaries exist, and the inactivity state is publicly readable.”

## 2:10 - 2:35 — I’m Alive Ping

- Click **I’m Alive — Reset 300-Day Timer**
- Approve transaction
- Show success state
- Open explorer link

Reference confirmed ping tx:

- [0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354](https://shadownet.explorer.etherlink.com/tx/0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354)

Explain:

“The owner can always prove life onchain. That resets the timer and prevents execution.”

## 2:35 - 2:55 — Agent Loop

- Switch to terminal
- Run:

```bash
node agent/index.js --test
```

- Show:
  - agent online
  - contract address
  - vault scan
  - inactivity counters

Explain:

“In production, this agent checks vaults every 24 hours, sends warning emails at day 293, and can trigger execution at day 300.”

## 2:55 - 3:00 — Close

“DeadDrop brings inheritance to Web3 by combining what AI does best and what blockchains do best:
AI understands intent, and Etherlink enforces it onchain.” 
