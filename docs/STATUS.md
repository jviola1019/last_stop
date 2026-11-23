# Verified status — Living Diorama v2.0

## Completed locally

- [x] Rebuilt UI hierarchy around the specific prior illustrative reference
- [x] Extracted real reusable rendered carriage artwork; no network image URLs at runtime
- [x] Train renders from actual owned-carriage state and resizes for desktop, tablet, phone
- [x] Purchase / upgrade / hire / rearrange / decorate / coin collection
- [x] Journals, postcard stamps, destination arrivals, 3-step optional tutorial
- [x] Version 3 save validation, import/export, eight-hour offline cap, recovery
- [x] Optional reduced motion; accessible button names; pointer and arrow-key selection
- [x] Original royalty-free reference artwork packaged with the user project
- [x] PWA manifest and service-worker source; cross-device static build
- [x] Zero third-party production dependencies
- [x] Type-check, 15 economic unit tests, build, four Chromium emulated viewports
- [x] Browser smoke: collect, upgrade, tutorial, shop, journal, settings, save reload, buy car, hire and buy decoration
- [x] Active-play progression simulation at 1m / 10m / 1h / 1d / 7d

## What was *not* verified

- Direct HTTP browser navigation or public GitHub Pages release: the environment blocks browser loopback navigation; the browser test harness uses the exact source modules and base64-embedded image bytes.
- Physical iPhone/Android devices, WebKit/Safari, Firefox or touch-inertia feel on hardware.
- A Windows `.exe`: a Tauri v2 scaffold is included, but no Rust/Cargo toolchain or Windows builder was available.
- PWA home-screen install on a physical iPhone or service-worker update under deployed HTTPS.
- Public GitHub Pages release must be checked after the v2 pull request is merged and its deployment workflow completes.

## Known limits

- 25-carriage cap and maximum room level 12 are deliberate performance / number-scale limits; "endless" means a recurring idle route, not infinite wagons in this release.
- The eight unique postcards will be discovered within the first several routes for active players; later collection depends on rare sightings, achievements and train expansion.
- Source art is painted into flattened layers. Other biomes use shared backdrop with atmospheric changes rather than eight fully illustrated environments.
- Offline income is locally computed. On a backend-free game, users can deliberately edit their system clock or source; this is not a competitive server-authoritative economy.
