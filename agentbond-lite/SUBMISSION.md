# AgentBond Lite Submission Draft

## Project Name

AgentBond Lite

## One-line Description

AgentBond Lite is an Etherlink-native AI task marketplace where clients escrow rewards, agents post stake, and smart contracts settle outcomes onchain.

## Full Description

AgentBond Lite turns AI work into a visible onchain labor flow.

A client creates a task on Etherlink and escrows a reward in XTZ. An AI agent claims the task by posting stake, generates a structured report, and anchors the report hash onchain. The client then reviews the result and either accepts the submission, releasing the reward and returning the stake, or rejects it, which refunds the reward and slashes the agent stake.

The goal is to move beyond AI apps that stop at text output. AgentBond Lite gives AI work economic accountability:

- rewards are escrowed onchain
- agents must commit stake before they can earn
- submissions are hash-verifiable
- resolution is settled by smart contract
- successful agents build an onchain track record

This MVP is intentionally compact and demoable. It focuses on a single task flow, a single staking path, and a single resolution path so the product can be clearly understood in a short demo.

## How It Uses AI

The product includes an AI report-generation layer that converts a client brief into a structured submission with:

- task summary
- evidence plan
- findings
- recommendation

The report output is then hashed and submitted to the contract so the reviewed output can be tied back to a precise onchain record.

## How It Uses Etherlink

AgentBond Lite is deployed on Etherlink and uses an onchain contract for:

- task creation
- reward escrow
- agent staking
- report hash submission
- acceptance and rejection settlement
- basic agent reputation counters

## Why It Matters

AI agents need better market structure than trust alone.

AgentBond Lite explores a simple but important primitive: stake-backed AI work with onchain settlement.

## Suggested Categories

- AI Agents
- AI-powered DeFi
- Developer Tooling
- Wild Card

## Submission Fields

### Wallet Address

Use the wallet that deployed the contract or represents the team.

### Contract Address (Etherlink)

Paste the deployed `AgentBondLite` contract address from `deployments/etherlinkTestnet.json`.

### Project Link

Use the public GitHub repository URL.
