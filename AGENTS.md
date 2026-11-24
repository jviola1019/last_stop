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

## v5 architecture and release gates

10. Do not add additional generic UI panels. Keep the original painted scene as the hero and use image-led regional artwork, illustrated miniature rooms, a brass ticket inspector, and the Baskerville/Avenir Next system fallback pair.
11. `src/economy.js` owns **all** boarding, passenger occupancy, fare calculation, seeded event RNG, wall-time accounting, long-term service medals, and station phase timing. `src/art.js` may only read these states for painting; neither animation nor button rendering should mint coins or people.
12. Staffing is reserved immediately but physically boards at the following stop. Never mutate rider counts outside `arrive` (except initial population and validated imports). Test this at the economy layer and in an independent browser station scenario.
13. Use `src/data.js` caps of 25 cars and 20 levels; resist extending an unrealistic cost curve without a 30/90/365-day simulation and buyback/pacing review.
14. Never remove old `everline-save-v3`/`everline-save-v4` migration support; preserve region permits, staff identity, Stamps, postcard collections, cosmetics and balances when changing schema. The product is browser-local and must not claim automatic device sync.
15. Required gates: `npm run verify`, both deterministic economic policies (30-day, optionally 365-day), four Chromium viewport interaction checks, two timed arrival/departure Chromium tests, visual screenshot inspection, then GitHub Actions PR verification before merge. Document excluded physical devices and deployment check separately.

## V6 release gates
Run `npm run verify`, all three Playwright smoke scripts and `node scripts/policy-stress.mjs`; preserve actual JSON evidence. Treat emulated viewports and synthetic policies as such. Never claim hardware performance, real retention, or Pages deployment without independent evidence. V6 saves must migrate v3–5, retain progression, and preserve queued refits. Keep the offline build functional.
