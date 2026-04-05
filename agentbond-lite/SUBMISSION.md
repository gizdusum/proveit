# AgentBond Lite Submission Draft

## Project Name

AgentBond Lite

## One-line Description

AgentBond Lite is an accountable AI research rail on Etherlink.

## Full Description

AgentBond Lite turns governance and token-risk review into a verifiable onchain accountability flow.

A user submits a research prompt, receives a structured AI report with a summary, findings, recommendation, and confidence score, and then anchors the verdict on Etherlink. The requester can optionally fund a lightweight settlement and mark the report as accepted or disputed onchain.

The goal is to move beyond AI apps that stop at text output. AgentBond Lite gives Web3 decision-making a verifiable AI layer:

- report verdicts are hash-verifiable
- the exact reviewed result gets an onchain commitment
- settlement creates an accept / dispute trail
- Etherlink provides a low-cost EVM environment for live usage and demos

This MVP is intentionally compact and demoable. It focuses on one polished accountable AI flow instead of a large protocol surface.

## How It Uses AI

The product includes an AI report-generation layer that converts a prompt into:

- short summary
- findings
- recommendation: `GO / REVISE / AVOID`
- confidence score
- deterministic structured verdict JSON

That verdict is canonicalized and hashed before being anchored onchain.

## How It Uses Etherlink

AgentBond Lite is deployed on Etherlink and uses smart contracts for:

- report commitment storage
- settlement funding
- accept / dispute recording
- transparent accountability events

## Why It Matters

AI outputs are increasingly shaping governance and launch decisions in Web3, but those outputs are usually unverifiable after the fact.

AgentBond Lite explores a simple but important primitive: accountable AI reports with onchain commitments and settlement history.

## Suggested Categories

- On-chain AI Governance
- AI Agents / Accountable AI Workflows
- AI-powered DeFi
- Wild Card

## Submission Fields

### Wallet Address

Use the wallet that deployed the contract or represents the team.

### Contract Address (Etherlink)

Paste:

- `ReportRegistry`: `0x93763CA47CEF242F1f64C942e5ebeDC503f7438c`
- `SettlementEscrow`: `0x8DD158865844bBd9c0Fb066F7837F0B0611Feb71`

### Project Link

Use the public GitHub repository URL.
