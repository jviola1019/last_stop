# v5 test plan and evidence

Run `npm run verify`, `node scripts/balance.mjs`, `node scripts/balance.mjs --long`, `python tests/browser_art_smoke.py`, and `python tests/browser_station_smoke.py` against the final sources. Results are recorded in `docs/browser-results.json` and `docs/station-results.json`. Screenshots are in `docs/desktop-scene.png`, `docs/iphone-scene.png`, `docs/desktop-regions.png`, `docs/iphone-regions.png`, and the new approach/stop/departure frames.

### Scope

- Unit tests cover pricing, 20-level cap, five visual tiers, purchases, income accrual, offline 8h bound, passenger count changes on stops only, deterministic seeded arrivals and rare events, upgrades, Stamp projects, optional prestige, service medals, and v3/v4→v5 save validation.
- Chromium tests cover responsive layout at **1440×900**, **820×1180**, **390×844**, **320×650**; Shop previews and purchases, route and Journal navigation, collect/hire/decorate actions, export/settings, keyboard selection, and same-origin save restoration.
- Station checks on desktop and iPhone-sized viewports approach a station at measured speed < 0.1, stop at zero speed for boarding, and depart with increasing speed while a queued crew member joins exactly at the stop.
- Build includes seven local SVG regional panorama files and three room interior SVG files; these ship in static and offline editions. Service worker precaches all game-critical source/assets.

### Honest limitations

The browser administrator blocks direct localhost requests from Chromium even though Python HTTP requests succeed. Browser tests therefore embed the exact locally built source modules and images into data URLs; this is a real Chromium rendering and interaction check but not proof that Pages web hosting is reachable. An independent public URL load, WebKit/Safari, Android and physical-phone touch/scroll review are still required.

### Security review

- Client-only economy: no accounts, external APIs, server endpoints, credit cards, purchases or secrets.
- JSON import limited to 200 KB, strict whitelisted state and version, checksum-checked envelope/backups, safe resetting/recovery, and no executable save parsing.
- No unsanitized user string may enter HTML unescaped; SVG assets are authored locally and contain no scripts or external references.
- Typed and bounded coin, staff, level, rider, seed and region values; spending is single-action validated; repeated purchases cannot duplicate rewards.
- `document.hidden` stops time accrual in a backgrounded tab. Returning credits at most eight hours once; offline time cannot advance stops or board people. Existing browser-clock manipulation remains possible without a backend.
- Multi-tab stale-save warning listens to both current v5 and legacy v4 writes; the current tab pauses saving rather than silently overriding an external update.
