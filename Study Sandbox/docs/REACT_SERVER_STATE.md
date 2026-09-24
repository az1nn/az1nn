# React Server State — Day 2

The Day 2 exercise evolves the same Watchlist UI from manually coordinated server state to an explicit query/mutation layer.

## Baseline: manual coordination

The first version used:

- `useEffect` + `AbortController` for the initial GET;
- local `items` state as a client copy of API data;
- a shared `pending` flag for add/remove;
- manual list mutation after POST/DELETE;
- manual error/loading state.

That baseline is useful because every lifecycle decision is visible. It also exposes the amount of behavior the component must coordinate itself.

## Evolved version: TanStack Query

The active implementation now uses:

```text
QueryClientProvider
      |
      v
useWatchlist()
  |       |
useQuery  useMutation
  |       |
  +--- invalidateQueries ---> refetch
```

`watchlistKey = ["watchlist"]` identifies the server-state resource in the client cache.

### Query

```tsx
const query = useQuery({
  queryKey: watchlistKey,
  queryFn: ({ signal }) => getWatchlist(signal),
});
```

The query layer now owns:

- loading/fetching state;
- cached server data;
- cancellation signal propagation;
- stale/fresh semantics;
- re-fetch after invalidation;
- retry policy configured by the QueryClient.

## Mutations

```tsx
const addMutation = useMutation({
  mutationFn: addToWatchlist,
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: watchlistKey }),
});
```

The same pattern is used for DELETE.

The important design choice is not the library name. It is that a successful write invalidates the server-state resource instead of making local array manipulation the long-term source of truth.

## What is still UI state?

The content-id text field remains local component state:

```tsx
const [contentId, setContentId] = useState("globo-content-001");
```

It does not need caching, invalidation or background synchronization.

A useful split is:

```text
contentId input       -> UI state
watchlist items       -> server state
item count            -> derived from server state
add/remove pending    -> mutation state
background refresh    -> query fetching state
```

## Why no optimistic update yet?

An optimistic update could make the UI feel faster, but it introduces another learning boundary:

- snapshot old cache;
- mutate cache optimistically;
- roll back on failure;
- reconcile with server result;
- reason about concurrent mutations.

For this sandbox, invalidation first keeps the API/database visibly authoritative. Add optimistic updates only when their UX value justifies the recovery complexity.

## Why `staleTime: 5_000`?

Five seconds is a study choice, not a general rule. It creates a visible window in which cached data is considered fresh while keeping experimentation quick.

In a real product, stale time comes from the data contract and UX tolerance, not from a framework default copied blindly.

## Accessibility improvements

The Day 2 UI distinguishes:

- initial loading;
- background refreshing;
- add pending;
- per-item remove pending;
- query failure with a Retry action;
- mutation failure.

It also uses:

- `role="status"` + `aria-live="polite"` for progress;
- `role="alert"` for failures;
- `aria-busy` on regions doing asynchronous work;
- explicit remove button labels containing the content id;
- visible focus outlines.

## Study experiment

Run the UI with DevTools open and explain these transitions:

1. First page load: no cache -> pending -> data.
2. Add item: mutation pending -> POST succeeds -> query invalidated -> GET refreshes.
3. Remove item: mutation pending -> DELETE succeeds -> query invalidated -> GET refreshes.
4. Trigger an API failure: mutation/query error appears without pretending the client succeeded.
5. Click Retry after a failed query: the query refetches without rebuilding the component state machine manually.

## Recall

Explain without notes:

1. What problem does a query key solve?
2. `isPending` vs `isFetching`: why distinguish them?
3. Why invalidate after a successful mutation?
4. Why is the text input not server state?
5. What additional failure/recovery work would an optimistic update require?

## Reference

The implementation follows the TanStack Query v5 model of queries, mutations and targeted invalidation. The sandbox pins its dependency version so the exercise stays reproducible during this study cycle.
