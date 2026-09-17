export type WatchlistItem = {
  contentId: string;
  addedAt: string;
};

const STUDY_USER = "11111111-1111-1111-1111-111111111111";

const headers = {
  "Content-Type": "application/json",
  "X-Study-User": STUDY_USER,
};

export async function getWatchlist(signal?: AbortSignal): Promise<WatchlistItem[]> {
  const response = await fetch("/api/v1/watchlist", { headers, signal });
  if (!response.ok) throw new Error(`GET watchlist failed: ${response.status}`);
  return response.json();
}

export async function addToWatchlist(contentId: string): Promise<WatchlistItem> {
  const response = await fetch("/api/v1/watchlist/items", {
    method: "POST",
    headers,
    body: JSON.stringify({ contentId }),
  });

  if (!response.ok) throw new Error(`POST watchlist failed: ${response.status}`);
  return response.json();
}

export async function removeFromWatchlist(contentId: string): Promise<void> {
  const response = await fetch(`/api/v1/watchlist/items/${encodeURIComponent(contentId)}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) throw new Error(`DELETE watchlist failed: ${response.status}`);
}
