# V8.1 — Heritage Roundel / desktop installation

A custom midnight-blue, brass and sunset locomotive emblem now identifies the web app, native Windows bundle and standalone edition. The existing manifest identity, origin-relative scope, desktop identifier and v6 local save namespace are unchanged. The corrected V8 website and Windows candidate workflows passed on commit `bd855bffedf3401315f8d7dd5a761c523cadb976`.

**Install from the hosted Pages site** (not the standalone file): Settings → The Everline app → Install the Everline when the browser supplies an install prompt. Otherwise, use the Chrome/Edge Install app menu, Safari Share → Add to Home Screen on iPhone/iPad, or supported Mac Safari File → Add to Dock. The new icon appears when the platform applies the manifest; existing installs may retain cached artwork. Export a save before removing an old installation or clearing site data. The standalone HTML remains fully playable without a PWA install. The native Windows build is separate and unsigned; a successful compile is not an actual installation test.

See [release plan](docs/V8_1_RELEASE_PLAN.md), [branding and release audit](docs/V8_1_RELEASE_AUDIT.md), and `tests/branding.test.mjs` / `tests/browser_install_smoke.py`. Earlier release sections below are historical.

# V8 — Masterworks

The V8 edition adds four optional, visible workshop commissions per carriage, exact next-grade batch restoration, ten lifetime service ranks, a refined engine artwork pipeline and responsive rank/room workshop interfaces. Existing saves remain compatible. Run `npm run verify` and `node scripts/policy-stress.mjs`; use `npm run build` for the standalone edition. See [V8 release audit](docs/V8_RELEASE_AUDIT.md) and [execution plan](docs/V8_PLAN.md). Earlier release sections are historical.

# V7 — Grand Journey (release candidate)

Start with `npm run verify` (Node 20+ and TypeScript 5.8.3), `npm run dev`, or open the built `THE_EVERLINE_PLAY_OFFLINE.html`. V7 preserves the V6 save key and adds eight engine classes, seasonal artwork, sixteen station illustrations, named passenger manifests, five stories, independent local fleet slots, three optional heritage projects, diversity incentives, volume controls, an independent brand and HUD-free scenic plate, and bounded raster caching. Current evidence and release gates are in [V7_RELEASE_AUDIT.md](docs/V7_RELEASE_AUDIT.md); all earlier sections below are historical. No public deployment or physical-device certification is implied by this source build.

# V6 — Living Railway

The V6 release candidate extends the verified V5 archive. Start with `npm run verify` (Node 20+ and TypeScript 5.8.3); `npm run dev` serves the game, and `npm run build` produces `dist/` and a self-contained offline HTML. See [the V6 gauntlet report](docs/V6_GAUNTLET.md) for actual evidence, limitations, and the outstanding roadmap. V5/V4 notes below are historical.

# LAST STOP: THE EVERLINE — The Longline Edition v5

An **illustrated, functioning, offline-first idle railway game**. The original painted sunset, individually illustrated cutaway carriages, brass-ticket inspector, and Tiny Tower-like collect → upgrade → explore loop are preserved. There is no login, advertising, real-money purchase, energy cap, or required daily streak.

## Play and install

**Browser / iPhone / tablet / desktop:** deploy the `dist/` folder to GitHub Pages (workflow included). Safari users can add the deployed site to the Home Screen where supported. This is **not** a compiled iOS app. The self-contained `THE_EVERLINE_PLAY_OFFLINE.html` can be opened as a file on a computer; for reliable offline caching and local saves, the HTTPS website is preferred. File-URL browser storage varies by platform.

```bash
node --version   # Node.js 20+
npm run dev      # http://127.0.0.1:4173 in a normal local environment
npm run verify   # TypeScript checkJs + unit tests + static build + offline HTML
node scripts/balance.mjs
node scripts/balance.mjs --long
python tests/browser_art_smoke.py
python tests/browser_station_smoke.py
```

No third-party production runtime dependencies, no API keys. A separate optional Tauri scaffold is present; a Windows `.exe` has **not** been compiled.

## What is new in v5

### The long-distance economy

- **20 carriage levels**, with five visibly distinct furnishing grades: Heritage (level 1), Refined (5), Grand (9), Royal (13), Legendary (17). Every level adds a visible brass trim detail and boosts actual revenue. Costs beyond level 5 rise faster; the final upgrade on a Sleeper exceeds 1 billion Coins. Rooms remain useful before completion.
- **Service Ledger:** eight automatic, non-streak medals from 1 hour to **8,760 hours** of credited service, with optional Stamp rewards. No claiming chores. Offline service and earnings are bounded to eight hours per absence.
- **Passengers really change at stops**, not on animation frames. The simulated manifest tracks rider counts per room. Paying to hire crew reserves them; they board and start their income bonus at the following station. Station fares reflect passenger turnover.
- **Determinism:** economy advances using elapsed wall time with fractional-cent carry. Arrival and sighting random streams are separate; station receipts, rider counts, and earnings match across 1-second or 600-second simulation steps.

### Illustrated journeys and stations

- Preserve `assets/world.webp` as the original painterly starting valley. Seven additional **self-contained original SVG panoramas** provide actual distinct backgrounds for coast, highlands, desert, metropolis, frontier, archipelago, and beyond. They are illustrations, not photographs or new hand-painted image-generation outputs.
- **Scenic Autopilot** is on by default after more regions are unlocked. The train spends six stops within each region, then changes scenery. The Journal lets you travel to a selected route and stay there, or restart roaming.
- Over the final **16 seconds** before a scheduled arrival, wheel and foreground movement ease down. The train remains stopped for seven seconds while passengers and crew board/alight, then accelerates during the next twelve seconds. Station nameplates appear in the painted scene.
- Original cutaway car sprites continue to show rooms and staff, while three formerly duplicated room skins (Library, Dining Car, Workshop) now have separate authored illustrations.
- Every Shop category has visual image previews for items; the Journal offers eight scenic regional image previews.

### Save compatibility

**Existing v3 and v4 trains are migrated to v5 automatically.** Previous rooms, levels, purchases, decorations, region permits, Stamps, and named crew are retained. V5 introduces passengers, pending crew, service hours, a separate sighting RNG, and scenic-autopilot mode. New saves use `everline-save-v5`, checksum envelopes, three rolling local backups, explicit import/export, and cross-tab warnings. Saved progress remains **per browser profile and website origin**, not cloud-synced between devices. Clearing site data can erase all local backups. Use Settings → Export Save to carry progress to another device.

## Technical modules

- `src/data.js`: progression limits, 8 regions, 16 destinations, 8 Service Ledger milestones.
- `src/economy.js`: deterministic simulation, 20-level prices, passengers/station changes, region cycling, upgrades, crew and medals.
- `src/save.js`: strict JSON migration/validation, checked local backups and imports.
- `src/art.js`: original illustrated train, multi-layer scenery, speed-dependent animation, stop signboards, rendered occupants, visual upgrades.
- `src/main.js`: accessible HUD, Shop (including item photos), Journal, menus, saves and viewport adaptation.
- `assets/car-*.png`, `assets/car-*.svg`, `assets/region-*.svg`: runtime visual assets. The original reference artwork remains included for provenance.
- `scripts/paint_regions.py`, `scripts/paint_rooms.py`: reproducible authoring of region/room SVGs.
- `tests/longline.test.mjs`: deterministic passenger, economy, migration, motion, and upgrade safety tests.
- `tests/browser_art_smoke.py`, `tests/browser_station_smoke.py`: Chromium interaction and timed station-screen regression including screenshot artifacts.

## Scope and known limits

- This version has a **25-carriage** performance cap and **20 levels per carriage**. “Endless” means repeatable routes, long-term mastery, and voluntary timetables—not unlimited browser canvas sprites. The final service medal alone requires 8,760 credited hours and is optional. It is not evidence of retention.
- The starting scene is the original painted reference; new regions are detailed SVG illustrations with a different media texture. Human art direction and physical iPhone/Safari review remain outstanding.
- V5 is static/browser-local, with **no authoritative server or cross-device sync**. Browser clocks and local saves can be edited. No game currency has financial value.
- Local automated Chromium tests run with exact source and embedded assets because this environment's browser blocks direct localhost navigation (`net::ERR_BLOCKED_BY_ADMINISTRATOR`). They do not validate a physically installed app or live GitHub Pages network response.

See `docs/STATUS.md`, `docs/BALANCE.md`, `docs/QA.md`, `docs/ART_DIRECTION.md`, and `AGENTS.md` for precise tests, evidence, and future improvement priorities.
