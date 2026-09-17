CREATE TABLE IF NOT EXISTS watchlist_items (
    user_id uuid NOT NULL,
    content_id varchar(120) NOT NULL,
    added_at timestamptz NOT NULL,
    CONSTRAINT pk_watchlist_items PRIMARY KEY (user_id, content_id)
);
