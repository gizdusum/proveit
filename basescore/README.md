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
- `.well-known/farcaster.json`: live manifest file to fill after Base.dev generates account association values
- `PUBLISH.md`: exact publish flow and constraints

## Current state

- English-only experience
- Base wallet connect flow
- Base chain switch prompt
- Deterministic demo score from wallet address
- Signal cards, missions, leaderboard, and sharing

## Next build steps

1. Replace demo scoring with real onchain reads.
2. Deploy BaseScore to `basescore.proveit.today` as a standalone site.
3. Claim domain-level ownership from Base.dev after the dedicated host is live.
4. Add generated share cards and saved-state persistence.
