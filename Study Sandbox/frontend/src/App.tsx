import { type FormEvent, useState } from "react";
import { useWatchlist } from "./watchlist/useWatchlist";

export function App() {
  const [contentId, setContentId] = useState("globo-content-001");
  const { items, query, addMutation, removeMutation } = useWatchlist();

  const mutationError = addMutation.isError
    ? "Could not add item. The server remains the source of truth."
    : removeMutation.isError
      ? "Could not remove item. Refresh or retry without assuming local success."
      : null;

  const liveStatus = addMutation.isPending
    ? "Adding item."
    : removeMutation.isPending
      ? `Removing ${removeMutation.variables}.`
      : query.isFetching && !query.isPending
        ? "Refreshing watchlist."
        : "";

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = contentId.trim();
    if (!normalized || addMutation.isPending) return;

    addMutation.mutate(normalized);
  }

  return (
    <main className="shell">
      <p className="eyebrow">NTT-G HANDBOOK · STUDY SANDBOX</p>
      <h1>Minha Lista</h1>
      <p className="lead">
        One vertical slice. Contract to production thinking.
      </p>

      <form onSubmit={handleAdd} className="card form" aria-busy={addMutation.isPending}>
        <label htmlFor="content-id">Content id</label>
        <div className="row">
          <input
            id="content-id"
            value={contentId}
            onChange={(event) => setContentId(event.target.value)}
            aria-describedby="mutation-status"
          />
          <button
            type="submit"
            disabled={!contentId.trim() || addMutation.isPending}
          >
            {addMutation.isPending ? "Adding…" : "Add"}
          </button>
        </div>
      </form>

      <p
        id="mutation-status"
        className="status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveStatus}
      </p>

      {mutationError && (
        <p role="alert" className="error">
          {mutationError}
        </p>
      )}

      <section className="card" aria-busy={query.isFetching}>
        <div className="section-heading">
          <h2>Saved items</h2>
          <div className="count-group">
            {query.isFetching && !query.isPending && <small>Refreshing…</small>}
            <span aria-label={`${items.length} saved items`}>{items.length}</span>
          </div>
        </div>

        {query.isPending ? (
          <p role="status">Loading watchlist…</p>
        ) : query.isError ? (
          <div className="error-block" role="alert">
            <p className="error">Could not load watchlist.</p>
            <button className="ghost" type="button" onClick={() => query.refetch()}>
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="muted">Nothing saved yet.</p>
        ) : (
          <ul>
            {items.map((item) => {
              const removingThisItem =
                removeMutation.isPending && removeMutation.variables === item.contentId;

              return (
                <li key={item.contentId}>
                  <div>
                    <strong>{item.contentId}</strong>
                    <small>{new Date(item.addedAt).toLocaleString()}</small>
                  </div>
                  <button
                    type="button"
                    className="ghost"
                    disabled={removeMutation.isPending}
                    aria-label={`Remove ${item.contentId} from watchlist`}
                    onClick={() => removeMutation.mutate(item.contentId)}
                  >
                    {removingThisItem ? "Removing…" : "Remove"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="learning-note" aria-label="Day 2 learning note">
        <strong>Day 2 lens</strong>
        <span>
          Input text is UI state. Watchlist items are server state. Successful mutations
          invalidate the watchlist query so the API remains authoritative.
        </span>
      </aside>
    </main>
  );
}
