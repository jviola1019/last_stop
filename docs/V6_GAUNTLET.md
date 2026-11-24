# Living Railway V6 — release-candidate verification

## Provenance and scope
Base: V5 Longline archive, SHA-256 4043d7f3da11038af4a7eecd8b25ba4022c1b1c8e97d2fa5d4518d7024d115e3. Existing Canvas 2D / deterministic economy retained. A release candidate is not proof of production deployment or product-market fit.

## Implemented
- 12 carriage types, 20 upgrade levels and 5 visual grades; four original SVG cutaway assets; eight locomotive liveries (same engine silhouette), train naming, additional discovery events, matching shop previews.
- Scenic view, zoom, downloadable PNG postcard, optional synthesized ambience and station chime; safe-area/keyboard controls, reduced motion, lower frame cap; speed-coupled sway/parallax, station motion and cabin furnishing overlays.
- Eight-region route selector, station-based crew and passenger transitions, permanent upgrades, collectibles and optional restart preserved. New paid refit allows changing an unlocked carriage type at the next stop without losing level or crew, including at capacity. Upgrades pause while refitting.
- Save schema 6 with v3/v4/v5 migration, recovery from invalid legacy region stop count, valid locomotive selection, input/prototype guards, exact station-boundary regression, cache isolation.
- Existing original serif/system font stack retained, with compact spacing, forest/brass utility controls and repositioned inspector. No remote font requests. Full painterly consistency, unique station assets and character sprite sheets remain incomplete.

## Actual execution
- `npm run verify`: TypeScript check, 51/51 Node unit tests, static build and self-contained offline HTML passed.
- `python tests/browser_art_smoke.py`: four Chromium emulated layouts; tutorial, shop, journal, save reload, build/hire/decor, route/stamp UI, scenic capture, train name, keyboard and low-power preference. See browser-results.json. Runs used source module/data URLs with identical asset bytes because localhost navigation was blocked; not an actual origin/service-worker/device test.
- `python tests/browser_station_smoke.py`: desktop/phone emulation, approach → stopped at zero speed → departing, crew boarding only at station. See station-results.json.
- `python tests/browser_living_smoke.py`: 25-car fixture, real refit UI, deferred change, level/staff retained, no page errors. Headless 2-second paint samples desktop 34.6 FPS / 25.7 low-power; phone viewport 56.6 / 28.2. **60 FPS target not met in these samples.** See living-browser-results.json.
- `node scripts/balance.mjs --long`: two deterministic policies at eight time horizons including 365 days; both reached 25 cars, peak levels 19 active and 17 casual, 8 and 6 regions, respectively. Synthetic scenarios, not observations of real players. See balance-365-results.json.
- Seeded policy stress: 24 year-long synthetic scenarios across four profiles; 8,760 validated day-end states, zero rejected purchases. After refit, short-visit train diversity increased from 7–8 to 8–9 types and collector diversity from 7 to 8 types. See policy JSON files. This is not statistical evidence of retention.

## Research basis
- W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/ (target size, keyboard focus, accessible interaction); no full conformance claim.
- MDN Canvas optimization, https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas (profile before rewrites; reduce unnecessary rendering).
- MDN `prefers-reduced-motion`, https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion; Page Visibility API, https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API (motion and background behavior).

## Release gates / remaining
- Performance: 60 FPS modern hardware, input latency, sustained memory/battery, asset compression/atlases and profiling remain open. Low power is implemented; target not certified.
- Art: commissioned/cohesive painterly interiors, unique locomotive silhouettes, layered region scenes and landmark/station-specific architectures; detailed walking/sleeping/working sprite animations; seasonal changes; full UI icon and typography audit; original designed audio tracks.
- Gameplay: narrative passenger arcs, expanded collectible catalogue, optional multi-train ownership, distinct historical eras, endgame coin/stamp sinks. Requires product decisions, not all mandatory.
- Platform: physical iPhone/Android, real Safari/Firefox/Edge, true PWA install/offline/cache update on origin, native Windows build, real player usability and retention, accessibility audit, architecture-specific full security threat audit remain unverified. Current source checks cover selected local-save, data/input and cache risks, not all possible web threats. No analytics, multiplayer or cloud synchronization added.
- CI: workflow configuration adds browser and policy gates; only GitHub-run results can prove them. No direct main merge without passing checks and review. The local ZIP includes scripts/import-release.sh for a clean feature-branch import. Screenshots from historical archive may remain in docs; current evidence files carry the new living-browser results.
