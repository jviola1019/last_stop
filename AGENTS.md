# Everline engineering conventions

Scope: game simulation and pixel-painted interactive railway at `jviola1019/last_stop`.

1. Read `docs/MASTER_EXECUTION_PROMPT.md` and `docs/STATUS.md` before changing gameplay.
2. Preserve original assets and scene-driven layout. Do not substitute bootstrap dashboards or generic app UI for the train.
3. `src/data.js` owns authored world/balance constants; `src/economy.js` owns deterministic, immutable-in-output economic rules (state is intentionally mutable); `src/save.js` owns migration, validation and backup envelopes; `src/art.js` is presentation-only and never mints currency; `src/main.js` is the accessible interface.
4. Do not add external packages unless the same functionality cannot reasonably be implemented safely with browser APIs, and document license/security costs.
5. Every economy or save change requires a targeted regression test, `npm run verify`, `node scripts/balance.mjs` (document assumptions), `python tests/browser_art_smoke.py`, and screenshot inspection.
6. Maintain `src/data.js` v3 migration support until a user-approved retirement strategy exists. Do not reset old saves during upgrades.
7. Never claim cross-device automatic sync: `localStorage` is browser-local. Account sync needs a separate authenticated backend and privacy/security design.
8. Do not claim simulated estimates are real-user telemetry, or a successful source build is a successful deployment.
9. Commit changes to a feature branch, open a PR, and use GitHub Actions before merge. After merge, verify Pages deployment and report known limitations.
