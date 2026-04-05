# Deploy Checklist

## Required Before Deploy

- Fund an EVM wallet with Etherlink testnet XTZ
- Copy `.env.example` to `.env`
- Set `PRIVATE_KEY`
- Optionally set `OPENAI_API_KEY`

## Commands

```bash
npm install
npm run compile
npm run deploy:etherlink:testnet
npm run export:abi
npm start
```

## After Deploy

Check:

- `deployments/etherlinkTestnet.json`
- contract address
- explorer URL

## Submission Artifacts

- public GitHub repo
- README
- demo video
- wallet address
- Etherlink contract address
