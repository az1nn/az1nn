#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

API_URL="${API_URL:-http://127.0.0.1:5080}"
STUDY_USER="${STUDY_USER:-11111111-1111-1111-1111-111111111111}"
CONTENT_ID="${CONTENT_ID:-globo-content-001}"
LOG_FILE="${TMPDIR:-/tmp}/ntt-g-study-api.log"

export ASPNETCORE_URLS="$API_URL"

dotnet run \
  --project backend/Watchlist.Api \
  --configuration Release \
  --no-build \
  >"$LOG_FILE" 2>&1 &
API_PID=$!

cleanup() {
  kill "$API_PID" 2>/dev/null || true
}
trap cleanup EXIT

ready=false
for _ in $(seq 1 30); do
  if curl -fsS "$API_URL/health" >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 1
done

if [[ "$ready" != "true" ]]; then
  echo "API did not become ready."
  cat "$LOG_FILE"
  exit 1
fi

post_item() {
  curl -fsS \
    -X POST \
    -H 'Content-Type: application/json' \
    -H "X-Study-User: $STUDY_USER" \
    -d "{\"contentId\":\"$CONTENT_ID\"}" \
    "$API_URL/api/v1/watchlist/items" \
    >/dev/null
}

post_item
post_item

WATCHLIST_JSON="$(curl -fsS \
  -H "X-Study-User: $STUDY_USER" \
  "$API_URL/api/v1/watchlist")"

WATCHLIST_JSON="$WATCHLIST_JSON" CONTENT_ID="$CONTENT_ID" python3 - <<'PY'
import json
import os

items = json.loads(os.environ["WATCHLIST_JSON"])
expected = os.environ["CONTENT_ID"]

assert len(items) == 1, f"expected one persisted item, got {items!r}"
assert items[0]["contentId"] == expected, items
PY

for _ in 1 2; do
  status="$(curl -sS \
    -o /dev/null \
    -w '%{http_code}' \
    -X DELETE \
    -H "X-Study-User: $STUDY_USER" \
    "$API_URL/api/v1/watchlist/items/$CONTENT_ID")"

  [[ "$status" == "204" ]] || {
    echo "expected DELETE 204, got $status"
    exit 1
  }
done

problem_file="${TMPDIR:-/tmp}/ntt-g-validation-problem.json"
validation_status="$(curl -sS \
  -o "$problem_file" \
  -w '%{http_code}' \
  -X POST \
  -H 'Content-Type: application/json' \
  -H "X-Study-User: $STUDY_USER" \
  -d '{"contentId":" "}' \
  "$API_URL/api/v1/watchlist/items")"

[[ "$validation_status" == "400" ]] || {
  echo "expected validation 400, got $validation_status"
  cat "$problem_file"
  exit 1
}

PROBLEM_FILE="$problem_file" python3 - <<'PY'
import json
import os

with open(os.environ["PROBLEM_FILE"], encoding="utf-8") as handle:
    problem = json.load(handle)

assert problem["status"] == 400, problem
assert "contentId" in problem["errors"], problem
assert problem.get("traceId"), problem
PY

echo "Day 1 smoke passed: duplicate add, idempotent delete and validation contract."
