# BaseScore

Prototype mini app for Base users who care about airdrops, reputation, and clean onchain behavior.

## Files

- `index.html`: main app shell
- `styles.css`: visual system and layout
- `app.js`: wallet connection, Base chain handling, demo scoring logic
- `icon.svg` + `icon.png`: app icon source and publish-ready raster export
- `cover.svg`: social/share preview
- `base.dev.project.json`: publish-ready project metadata
- `.well-known.farcaster.template.json`: optional manifest template for a dedicated BaseScore domain or subdomain
- `PUBLISH.md`: exact publish flow and constraints

## Current state

- English-only experience
- Base wallet connect flow
- Base chain switch prompt
- Deterministic demo score from wallet address
- Signal cards, missions, leaderboard, and sharing

## Next build steps

1. Replace demo scoring with real onchain reads.
2. Register the current `/basescore/` deployment on Base.dev.
3. Move to a dedicated subdomain before claiming separate domain-level ownership.
4. Add generated share cards and saved-state persistence.
