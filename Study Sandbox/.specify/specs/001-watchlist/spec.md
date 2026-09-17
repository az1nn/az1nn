# 001 — Watchlist Vertical Slice

## User story

As an authenticated user, I want to save content to **Minha Lista** so I can find it later.

## Acceptance criteria

1. A user can add a content id to their watchlist.
2. Repeating the same add operation does not create a duplicate.
3. A user can list only their own items.
4. A user can remove an item.
5. Repeating a removal is safe and leaves the same final state.
6. Invalid input returns a stable client-facing error contract.
7. Internal exception details are not exposed to the caller.

## Core invariant

For a given `(userId, contentId)`, at most one active watchlist item exists.

## Study-only identity

Until the auth exercise, the API accepts a valid UUID in `X-Study-User`. This is intentionally **not production authentication**; it makes the authorization boundary visible while keeping the first exercises small.

## Edge cases

- empty content id;
- two simultaneous adds;
- repeated delete;
- missing/invalid study user id;
- database unavailable.

## Out of scope for 001

- recommendations;
- playback;
- social sharing;
- notifications;
- production identity provider;
- distributed event publication.
