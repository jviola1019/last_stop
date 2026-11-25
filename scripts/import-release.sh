#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?Usage: bash scripts/import-release.sh /path/to/last_stop-checkout}"
DEST="$(cd "$DEST" && pwd)"
[[ "$DEST" != "$ROOT" ]] || { echo 'Source and destination are identical'; exit 1; }
git -C "$DEST" rev-parse --is-inside-work-tree >/dev/null
[[ -z "$(git -C "$DEST" status --porcelain)" ]] || { echo 'Refusing to overwrite a dirty checkout.'; exit 1; }
[[ "$(git -C "$DEST" branch --show-current)" != main ]] || { echo 'Use a feature branch, not main.'; exit 1; }
for f in .github .gitignore AGENTS.md README.md assets docs index.html manifest.webmanifest package.json package-lock.json scripts src src-tauri sw.js tests tsconfig.json; do cp -a "$ROOT/$f" "$DEST/"; done
(cd "$DEST" && npm ci && npm run verify)
git -C "$DEST" status --short
printf '\nReview changes and rerun browser and balance checks before committing/pushing. No commit, merge or push was performed.\n'
