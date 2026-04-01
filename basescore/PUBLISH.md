# BaseScore Publish Flow

Updated for the current Base.dev flow on April 1, 2026.

## Current recommendation

Publish BaseScore at `https://www.proveit.today/basescore/` first, then register that URL on Base.dev.

Why this is still the best next move:

- it does not disturb the existing `ProveIt` app at the root domain
- it gives BaseScore a real production URL immediately
- it lets you test Base App discovery, sharing, and retention before moving to a separate domain

## Repo assets already prepared

- publish metadata lives in `base.dev.project.json`
- a dedicated-domain manifest template lives in `.well-known.farcaster.template.json`
- a publish-safe icon export now exists at `icon.png`
- the current launch URL is `https://www.proveit.today/basescore/`

## What you still need to do in Base.dev

1. Sign in to [Base.dev](https://base.dev) with the Base account that should own the project.
2. Create or select the `BaseScore` project.
3. Set the primary URL to `https://www.proveit.today/basescore/`.
4. Copy the values from `base.dev.project.json` into the Base.dev project fields if the UI does not import them automatically.
5. Open the project preview and confirm the icon, preview, category, tags, and launch URL render correctly.
6. Publish and then open/share the production URL inside Base App once so indexing can catch it.

## Ownership constraint on the current URL

This is the key thing to keep straight:

- `proveit.today` already has a root manifest at `https://www.proveit.today/.well-known/farcaster.json`
- manifest ownership is domain-level, not path-level
- that means `https://www.proveit.today/basescore/` cannot safely claim a separate signed manifest while `ProveIt` owns the root domain manifest

So for the current deployment model:

- keep the root manifest pointed at `ProveIt`
- publish BaseScore on Base.dev using the `/basescore/` URL
- do not overwrite `/.well-known/farcaster.json` just to force BaseScore ownership on the same root domain

## When to do separate ownership

If you want BaseScore to have its own domain-level identity, move it to a dedicated host first, for example:

- `https://basescore.proveit.today/`
- or a separate standalone domain

Then:

1. Copy `.well-known.farcaster.template.json` to `/.well-known/farcaster.json` on that dedicated host.
2. Replace the placeholder domain values with the real production domain.
3. In Base.dev, open `Preview -> Account Association`.
4. Enter the dedicated domain, click `Verify`, and sign with the owning wallet.
5. Paste the generated `accountAssociation.header`, `payload`, and `signature` into the live manifest.
6. Redeploy and re-share the app URL so discovery re-indexes the updated ownership.

## Important date note

Base docs currently show a transition to the standard Base App web model on **April 9, 2026**.

As of **April 1, 2026**:

- the manifest and `accountAssociation` flow is still valid for ownership
- Base.dev project metadata is already the safer source of truth for publish setup

That means the lowest-risk path today is:

1. keep BaseScore live at `/basescore/`
2. register it on Base.dev now
3. move to a dedicated subdomain only when you are ready to claim separate ownership cleanly
