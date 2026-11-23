> **Visual refresh · v3.0** — The art-driven railway interface now has a defined serif/sans typography system, original railway iconography, 44px interaction minimums, a compact responsive carriage ticket, and measured four-viewport layout checks. See [`docs/TYPOGRAPHY_QA.md`](docs/TYPOGRAPHY_QA.md).

# LAST STOP: THE EVERLINE — Illustrated Railway Edition

**Version 2.0 · Illustrated, functional idle train game**

A dramatic art-led rebuild based on the original *Sunset Journey on the Everline* reference scene. The train is a series of **individual illustrated room sprites**, not a pre-rendered picture with fake buttons. An independent clock advances the idle economy, while Canvas 2D renders locomotive movement, changing lights, weather, wheel spokes, smoke, resident movement and room decorations.

## Run it

Requirements: Node.js 20+ (no runtime dependencies and no third-party npm installs).

```bash
npm run dev
# Open http://127.0.0.1:4173
```

To build files for any static website:

```bash
npm run verify
# Copy dist/ to a web host, including GitHub Pages.
```

The ZIP also includes a **single-file, self-contained desktop browser edition** (`THE_EVERLINE_PLAY_OFFLINE.html`) with all game images and scripts embedded. Double-click it in a modern browser; save-file export is available if local storage is restricted by the `file://` origin.

## The actual controls

- **Collect:** press `+` beside the coin balance to transfer pending earnings.
- **Upgrade:** press the gold Upgrade button for the active room.
- **Explore:** drag / swipe the train or focus the canvas and press left/right arrow keys to select a room. Clicking any room changes its inspector.
- **Build:** open Shop > Carriages. The new carriage appears as an individual painted wagon in the moving scene.
- **Hire:** the secondary resident button adds an animated person and increases earnings.
- **Rearrange:** the inspector arrows change a room's physical position and neighbor bonuses.
- **Decorate:** purchase window planters, amber lanterns and pennants. The scene reflects ownership.
- **Collect memories:** reach stations, earn stamps, discover postcards, earn achievements and tap rare sightings.
- **Personalize:** use Settings to reduce animation, export/import validated saves or intentionally reset progress.

## Technical structure

- `src/art.js`: illustrated canvas world, train textures, responsive camera, touch and keyboard selection, weather, decorated carriages and animation
- `src/economy.js`: bounded state transitions, atomic purchases, income, arrivals, seeded random events and offline credit
- `src/main.js`: DOM controls and accessibility, modal menus, real-time HUD, save import/export and renderer wiring
- `src/data.js`: independently owned train and travel content
- `assets/source-reference.png`: user's reference illustration, retained for reproducible sprite extraction
- `scripts/make_art.py` and `scripts/clean_world.py`: deterministic sprite extraction and compositing from reference
- `tests/economy.test.mjs` and `tests/browser_art_smoke.py`: economy and real Chromium interaction tests
- `src-tauri/`: **optional, unbuilt Windows wrapper scaffold**, not a compiled `.exe`
- `.github/workflows/pages.yml`: GitHub Actions build, test and Pages deployment workflow

## Why it is not an `.exe` by default

The game is visual and cross-device. A Windows executable only changes the *distribution container*; it does not improve illustration quality. The main target is an installable Progressive Web App. The same frontend can later be packaged via Tauri v2 for Windows (`src-tauri` included) without maintaining a second game engine. Building a genuine Windows installer requires Windows/Rust/WebView2 prerequisites and has **not** been verified here.

See `docs/STATUS.md`, `docs/QA.md`, `docs/BALANCE.md`, and `docs/ART_DIRECTION.md` for evidence, constraints and art direction.

---

## v4 · Railway chapters, residents, and persistent saves

This release preserves the original illustrated train but makes its economy and exploration materially deeper. Eight railway regions contain sixteen destinations. Every region has a precise lifetime-stop, train-length, and Postcard Stamp unlock gate. Players can freely revisit unlocked lines. The Shop shows all room unlock gates, a new **Stamp Works** tab and three permanent souvenir projects. Named crew members have dream jobs that influence actual carriage earnings; satisfaction now changes rate and passenger fares. An optional **New Timetable** (20 carriages, three unlocked regions) resets the current train in exchange for a permanent +16% income bonus while keeping discoveries and collectibles.

**On-device save behavior:** the game automatically stores a validated version-4 save in the current browser's `localStorage` plus three rotating local recovery snapshots. Existing v3 saves are migrated rather than wiped. Saves are scoped to an origin and browser profile, not synchronized to other devices. Clearing browsing data can delete them; **Settings → Export Save** is the recommended portable backup, and Import Save can restore it on another device. Eight-hour offline earnings remain capped, and stations do not advance during offline credit. Opening multiple tabs triggers a warning to prevent a stale tab silently overwriting progress.

Production code has **no runtime package dependencies**. Run `npm run verify`, `node scripts/balance.mjs`, `python tests/browser_art_smoke.py`, and `node scripts/build-singlefile.mjs` after changing the economy. See `docs/MASTER_EXECUTION_PROMPT.md`, `docs/BALANCE.md`, `docs/STATUS.md`, and `AGENTS.md` for conventions, limitations, and the formal acceptance plan.
