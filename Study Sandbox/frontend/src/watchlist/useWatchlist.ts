import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../api/watchlist";

export const watchlistKey = ["watchlist"] as const;

export function useWatchlist() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: watchlistKey,
    queryFn: ({ signal }) => getWatchlist(signal),
  });

  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKey }),
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKey }),
  });

  return {
    items: query.data ?? [],
    query,
    addMutation,
    removeMutation,
  };
}
