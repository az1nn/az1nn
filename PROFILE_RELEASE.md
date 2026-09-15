# Az1nn profile delivery flow

This repository has two independent delivery stages for the profile itself: **Preview** and **Profile Release**.

## Preview

Every pull request that changes the interactive profile files receives an isolated GitHub Pages preview at:

```text
https://az1nn.github.io/az1nn/previews/pr-<PR_NUMBER>/
```

The preview deployment keeps the root Pages site populated from `main` and places the pull request candidate under its own `/previews/pr-N/` path. The workflow also posts or refreshes the preview URL in the pull request conversation.

Profile preview inputs:

```text
index.html
styles.css
app.js
assets/**
README.md   # triggers a preview when profile copy changes
```

A deployed preview contains `preview.json` with the pull request number and exact candidate commit SHA.

## Production Pages

The root profile stays at:

```text
https://az1nn.github.io/az1nn/
```

Production Pages continue to deploy from `main`. Preview and production deployments share one concurrency group so two Pages writes cannot race each other.

## Profile-only release channel

Profile releases use their own semantic version namespace:

```text
profile-vMAJOR.MINOR.PATCH
```

`PROFILE_VERSION` is the release gate. The initial value is deliberately:

```text
0.0.0-dev
```

That value never creates a GitHub Release.

When a reviewed profile is ready to ship, change `PROFILE_VERSION`, for example:

```text
0.1.0
```

and merge that dedicated release change into `main`. The `Release profile` workflow creates:

- GitHub tag `profile-v0.1.0`
- GitHub Release `Az1nn Profile v0.1.0`
- `az1nn-profile-0.1.0.zip`
- SHA-256 checksum for the bundle

The release bundle intentionally contains only the profile surface:

```text
README.md
index.html
styles.css
app.js
assets/
PROFILE_VERSION
```

Workflows, repository administration files, and unrelated engineering metadata are excluded from the release package.

Pre-release versions such as `0.2.0-rc.1` are automatically marked as GitHub pre-releases.

## Recommended promotion flow

```text
feature branch
  -> pull request
  -> GitHub Pages preview
  -> human smoke test
  -> merge
  -> dedicated PROFILE_VERSION bump
  -> profile-vX.Y.Z release
```

This keeps experimentation fast while making the public profile release an explicit, versioned event.
