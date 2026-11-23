# Everline v4 — implemented vs validated

## Implemented
- Regional chapter progression: **8 regions**, **16 destinations/postcards**; stops + carriage-count + paid Stamp gates; repeat visits are free
- Slower eight-carriage-category unlock curve and explicit gate messages
- Economy: satisfaction affects revenue and fares, named residents/dream roles affect earnings, wall-time accrual with cent carry independent of tick cadence
- Stamp projects: Postcard Gallery, Concierge Academy, Souvenir Counter; permanent paid bonuses; milestone stamps every 18 station arrivals
- Optional new timetable: 20 cars + 3 regions, +16% permanent revenue/season (maximum 10), preserves progress categories documented in prompt
- Save version 4: migrates v3, validates imports, rotating 3-backup local snapshots with checksum, conflict warning for multiple tabs, export/import/reset/recover
- Region-driven painted atmospheric color/motifs, existing original illustrated room sprites and v3 typography preserved
- Self-contained offline HTML and GitHub Pages static build; no third-party production runtime packages

## Executed locally in the build session
- `npm run verify`: TypeScript check of JavaScript sources, **27 unit tests**, static build — passed
- `python tests/browser_art_smoke.py`: Chromium at desktop 1440×900, tablet 820×1180, phone 390×844, compact 320×650 — passed after testing actual route unlock, Stamp project, resident purchase, save reload, Shop, Journal and original tutorial
- `node scripts/balance.mjs`: 1m, 10m, 1h, 1d, 7d, 30d deterministic active/casual policy simulations — completed
- Source file sanitizer/validator: save import rejects invalid negative currencies, unknown residents/carriage identities, corrupted envelope checksums, duplicate IDs and unsupported schema versions

## Known limits — not hidden
- 25 carriages is a performance and economy cap, not an infinitely long physical consist. New timetables are voluntary; old progress is preserved by migration.
- Region scenery currently reuses the hand-painted world asset with distinct layered color and weather motifs, not 8 independent large art panoramas.
- Real-player long-term retention and enjoyment are not established by economic simulation.
- Browser saves remain local per origin+browser. No cloud account sync; clearing browser data can remove all backups. Users can manually export/import across devices.
- A checksum protects against accidental corruption, not player cheating. Browser clock manipulation remains possible in an offline-only economy.
- Physical iPhone/Safari, Android, Firefox and direct live Pages browser acceptance are not claimed without separate tests.
- No Windows executable compiled. The existing Tauri scaffold remains optional.
- Attempted direct HTTP navigation to local preview using Chromium: `net::ERR_BLOCKED_BY_ADMINISTRATOR`. The four-viewport browser tests therefore use production-source ES modules and bundled asset bytes injected into a local document, as disclosed in the browser test header. This is useful interaction evidence but not an independent network deployment test.
