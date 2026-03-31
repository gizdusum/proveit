# BaseScore Publish Flow

This is the minimum-friction path to get BaseScore live as your app.

## What I can do for you

1. Prepare the files and commit them.
2. Push the branch to your GitHub repo.
3. Move the app into the production path you want.
4. Update share metadata and app assets.

## What still requires you

1. Sign in to Base.dev with your Base App account.
2. Create or select the BaseScore project.
3. Set the primary URL to `https://www.proveit.today/basescore/`.
4. Upload or confirm the metadata from `base.dev.project.json`.
5. If you decide to use a manifest flow, generate the `accountAssociation` values and place them into `/.well-known/farcaster.json` on the final app domain.

## Recommended publishing model

Use `https://www.proveit.today/basescore/` first.

Why:

- It does not overwrite the current ProveIt root app.
- It gives you a real public URL quickly.
- It lets us test Base App sharing and discovery before changing the main site.

## Important note about manifests

The root domain already has a `/.well-known/farcaster.json` for `ProveIt`.

That means:

- do not overwrite the root manifest unless you want BaseScore to replace ProveIt as the main registered mini app for that domain
- if you want BaseScore to have its own manifest-based identity later, use a dedicated domain or subdomain

## Suggested next production steps

1. Publish `basescore/` to the repo so it is available at `/basescore/`.
2. Register the URL on Base.dev.
3. Share the URL once inside Base App to trigger indexing.
4. Later, move BaseScore to a dedicated domain if you want separate manifest ownership.
