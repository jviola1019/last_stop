# V8 Masterworks

Local 73-unit-test/type-check/build verification passed. V8 workshop, rank and next-grade features implemented; art and model evidence in V8_RELEASE_AUDIT.md. Corrected V7 CI passed website and Windows, but V8 requires its own remote run.

# V7 Grand Journey — current release candidate

See [V7_RELEASE_AUDIT.md](V7_RELEASE_AUDIT.md) for the latest executed results and unresolved gates. Historical results below are not evidence of the current build.

# V6 release candidate

See [V6_GAUNTLET.md](V6_GAUNTLET.md) for current implementation, local verification and outstanding work. The older status below is historical. Do not infer physical-device or deployment verification from local Chromium emulation.

# LAST STOP: THE EVERLINE — v5 implementation and verification

## Completed in the current implementation

- Versioned v4/v3 → v5 save migration; preserves all existing ownership/crew/collectibles; three rotating backups; explicit manual export/import/reset.
- Passenger manifest per carriage with deterministic boarding/alighting **only on station arrival**; queued residents start bonuses after boarding.
- Journey speed derived from the **same station timer** as arrivals (16s approach, 7s dwell, 12s departure); wheel/foreground motion scale with speed.
- Eight region portraits: original painted sunset plus seven locally authored SVG panoramas; new unique cutaway visuals for Library, Diner and Workshop; all Shop groups use actual item preview images.
- Scenic autopilot changes to a different unlocked regional backdrop after six station arrivals; manual stay-on-route mode; transition crossfade on departure.
- Eight long-term service medals (1–8,760 credited hours), five furnishing grades and 20-level rooms with high-tier coin costs.
- Separate seeded passenger and rare-event RNG streams and fractional-cent income accounting; reproducible economy across tick frequencies.
- Branded poster/railway display typography with local fallback stacks; universal interface font pairing, consistent spacing and tactile tap targets.
- Updated Pages static build, self-contained offline file, service-worker cache asset list and project docs.

## Verification commands

```
npm run verify
node scripts/balance.mjs
node scripts/balance.mjs --long
python tests/browser_art_smoke.py
python tests/browser_station_smoke.py
```

Final local verification: 39/39 Node unit tests, TypeScript check, production static build, four Chromium viewport interaction tests, and two Chromium approach/dwell/departure checks. A deterministic 365-day balance simulation was executed. GitHub CI and physical-device verification must be stated separately.

## Important known constraints

- The original heartland world is painterly image artwork; new regional panoramas are intricate vector illustrations. They are visibly distinct but not the same hand-painted medium; dedicated painterly concept-to-runtime asset production is a future art task.
- Pre-existing room imagery includes painted figures. Dynamic Canvas rider sprites and real passenger numbers are overlaid; the original painted silhouettes cannot magically be removed at station changes. V5 tracks *actual gameplay rider state*, but individual background silhouettes are still decorative.
- Maximum cars: 25, maximum room level: 20. Beyond-the-Last-Bridge requires 23,000 cumulative stops. New Service Ledger takes 8,760 credited hours at maximum. There is no punitive login streak.
- Income and service time continue with a **single 8-hour cap per absence**; station movement and boarding do not advance offline.
- Local save integrity is not cheat prevention. Legacy imports are whitelisted and checksum-verified when wrapped. There is no authentication/backend/cloud sync.
- Direct localhost browser navigation is blocked in this runtime, so Playwright tests use exact production ES modules with their image bytes embedded into a local HTML page. Live GitHub Pages and actual Safari hardware are separate checks.
- Tauri Windows scaffold exists, but no native executable is built.
