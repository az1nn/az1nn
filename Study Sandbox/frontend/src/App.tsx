import { FormEvent, useEffect, useState } from "react";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  type WatchlistItem,
} from "./api/watchlist";

export function App() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [contentId, setContentId] = useState("globo-content-001");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getWatchlist(controller.signal)
      .then(setItems)
      .catch((err) => {
        if (err.name !== "AbortError") setError("Could not load watchlist.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!contentId.trim() || pending) return;

    setPending(true);
    setError(null);

    try {
      const item = await addToWatchlist(contentId.trim());
      setItems((current) =>
        current.some((x) => x.contentId === item.contentId)
          ? current
          : [item, ...current],
      );
    } catch {
      setError("Could not add item.");
    } finally {
      setPending(false);
    }
  }

  async function handleRemove(id: string) {
    setPending(true);
    setError(null);

    try {
      await removeFromWatchlist(id);
      setItems((current) => current.filter((x) => x.contentId !== id));
    } catch {
      setError("Could not remove item.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="shell">
      <p className="eyebrow">NTT-G HANDBOOK · STUDY SANDBOX</p>
      <h1>Minha Lista</h1>
      <p className="lead">One vertical slice. Contract to production thinking.</p>

      <form onSubmit={handleAdd} className="card form">
        <label htmlFor="content-id">Content id</label>
        <div className="row">
          <input
            id="content-id"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
          />
          <button disabled={pending}>{pending ? "Working…" : "Add"}</button>
        </div>
      </form>

      {error && <p role="alert" className="error">{error}</p>}

      <section className="card">
        <div className="section-heading">
          <h2>Saved items</h2>
          <span>{items.length}</span>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p className="muted">Nothing saved yet.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.contentId}>
                <div>
                  <strong>{item.contentId}</strong>
                  <small>{new Date(item.addedAt).toLocaleString()}</small>
                </div>
                <button
                  className="ghost"
                  disabled={pending}
                  onClick={() => handleRemove(item.contentId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
