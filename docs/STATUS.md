# Implementation ledger — v1

| Feature | Status | Evidence / notes |
| --- | --- | --- |
| Locomotive, sleeper, café and horizontal pan | Built | Canvas renderer `src/scene.js` |
| Custom illustrated interiors and animated characters | Built | Render primitives, room details and walking loops |
| Eight buildable carriage designs | Built | `src/data.js`, `src/economy.js` |
| Collect, 12 upgrades, carriage rearrangement, adjacency | Built | Atomic actions in economy module |
| Route of eight biomes, fare bonuses and postcards | Built | Destination sequence and station timer |
| Rare claimable sightings | Built | Seeded events and event UI |
| Achievements, Journal, stamps, locomotive liveries | Built | Static unlock tables and whitelisted rewards |
| Eight-hour offline earnings, save import/export | Built | Versioned/local validation, `offlineCredit()` |
| GitHub Pages via Actions | Configured | `.github/workflows/pages.yml` (not proof of deployment) |
| Sound effects | Optional | Browser WebAudio unlocked by interaction |
| Full accessibility audit | Partial | Keyboard, buttons, reduced motion; screen-reader canvas details limited |
| Browser-specific QA | Pending browser runs | Screenshots and results recorded after execution |
| Translation/localization | Not implemented | English UI only |
| Multiplayer/cloud saves | Not implemented by design | Completely offline, static website |

No Node dependencies are required for runtime; source is ES modules with JSDoc/TypeScript checking. The project intentionally uses Canvas 2D, not PixiJS, because there is no externally installed render package in the execution environment. The website runs directly from any static server.

## Local verification — 2026-11-23

- `npm test`: **13 of 13 passed** (including construction, atomic purchases, frame-independence, import validation, offline cap, and progression).
- `npm run check`: **passed** using global TypeScript 5.8.3 `checkJs`.
- `npm run build`: **passed**, outputs `dist/` with seven files and no third-party runtime dependencies.
- Chromium via Python Playwright: **passed desktop 1440×900, mobile 390×844, compact 320×650**. Interacted with collect, upgrade, tutorial, Shop, Journal, Route; checked local save contents. No page JavaScript exceptions, no horizontal overflow. Screenshots: `docs/{desktop,iphone,small}-{initial,played}.png`.
- Browser navigation to `file://` and `http://127.0.0.1` was blocked by this container's administrator. The verified browser harness therefore assembled same-source ECMAScript modules as `data:` imports in an `about:blank` page, with a localStorage shim. **A full HTTP-hosted, cross-reload E2E run is still pending**; CI build and unit tests are reproducible without browser dependencies.
