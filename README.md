# LAST STOP: THE EVERLINE

**A little world on rails.** An original illustrated, endless idle train game that runs in any modern browser. Works on iPhone, tablets and desktops. No accounts, ads, external requests, loot boxes, or microtransactions.

## Play locally

- `node scripts/serve.mjs` then open `http://127.0.0.1:4173`.
- `npm ci && npm run verify` validates economic tests and produces static `dist/` ready for hosting. `npm run dev` runs the local server.
- Open the deployed GitHub Pages URL when the Pages workflow has completed and Pages source is set to **GitHub Actions** in repository settings.

## Controls

- **Collect** deposits passenger earnings in your wallet; automatic income continues as the train runs.
- **Tap a carriage** to upgrade or move it; swipe / drag to see the rest of the train.
- **Shop** builds new rooms, unlocks station improvements and paints the locomotive.
- **Journal** has postcards, achievements, passengers' sightings, and journey history. Route shows the eight destinations.
- **Keyboard**: arrows select rooms, Space collects, keys 1–4 change navigation sections.
- **Settings** exports/imports JSON save, lets you opt into subtle audio, and offers reduced-motion or reset options.

## Gameplay

Starts with one locomotive, sleeper, café, 160 coins and 42 coins available to collect. Every carriage earns coins according to its level; most have visible improvements at levels 2, 3 and 6. The train automatically reaches a station around every 85 seconds before upgrades, awards fares, earns the first postcard for a destination, and may spot a rare visitor. Unvisited stations unlock new cars. Neighboring carriage combinations provide optional 12% revenue bonuses. Offline accrual is capped to eight hours per absence; accumulated earnings are collected at the player's convenience.

## Technical foundation

**No external packages at runtime.** ES2022 modules + a Canvas 2D layered illustration engine and accessible HTML controls. Node 20+ needed only for local preview / testing. No backend, no external images/fonts, and no client secrets. Content is wholly original generated from Canvas drawing operations. `src/economy.js` uses wall-clock time, bounded progress, seeded sightings, and independent testable pure-ish economic functions. Savings use a fixed-schema whitelist at import and a versioned localStorage key. Files can be served directly from `dist/`.

The user requested a Vite/TypeScript/PixiJS preference. Those packages were not installed in the available offline container. This build deliberately chooses zero-dependency ES modules and TypeScript's `checkJs` static checks to ensure the deliverable is runnable and testable instead of shipping unverified dependencies. Visuals are native procedural illustrations, not imported concept art.

## Files

- `src/data.js` — content catalog and unlocks
- `src/economy.js` — deterministic economics, saves, purchases
- `src/scene.js` — carriage artwork, scenery, animation, parallax, touch gestures
- `src/main.js` — UI, keyboard, local persistence
- `src/style.css` — responsive presentation
- `tests/*.test.mjs` — economic regression coverage
- `scripts/build.mjs` — static build
- `scripts/serve.mjs` — development server
- `.github/workflows/pages.yml` — GitHub Pages Actions deployment
- `docs/STATUS.md`, `docs/PROJECT_RULES.md` — evidence and conventions

## Security and privacy

Only localStorage; external HTTP requests are not used. All economic mutations check caps and funds; saves are serialized whitelists; import text is capped, JSON parsed, and validated. Never load arbitrary assets from saves. The game has no server-side secrets or third-party analytics.

## Deployment

Push the implementation branch and open a PR against `main`. After review and merge, GitHub Actions uploads `dist` and requests a Pages deployment. Set **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The published URL will normally be `https://jviola1019.github.io/last_stop/` after a successful workflow, but should not be treated as live until verified.
