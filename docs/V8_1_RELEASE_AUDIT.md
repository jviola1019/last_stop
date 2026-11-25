# Everline 8.1 — Heritage Roundel release audit

## Baseline and rationale
V8 commit bd855bffedf3401315f8d7dd5a761c523cadb976 independently passed the GitHub website workflow 45339137487 (unit/build, all five Chromium suites, Chromium/Firefox/WebKit real-origin suite, seeded policy loop) and Windows unsigned installer workflow 45339137468 (artifact 14895687624). V8 still had generic application branding and an incorrect Tauri dev URL (128.0.0.1). V8.1 changes branding and install UX, not economy, simulation or game assets. Release plan was written before editing.

## Deliverables
- Original front-facing locomotive roundel, brass/ivory rim, midnight-blue engine and dusk mountain landscape. Large silhouettes, no small lettering, reproducible from `scripts/make_app_icons.py` (CairoSVG/Pillow dev tools only). The original game art is untouched.
- Web SVG and PNG 32, 192, 512; full-bleed maskable 512 and Apple 180; same native 512 PNG, multi-size ICO 16/24/32/48/64/128/256. Maskable image is fully opaque: all pixels outside the radius-204.8 safe circle equal background. Source is passive SVG with no scripts or network resources.
- Manifest identity (`./`), scope (`./`), start URL (`./`), Tauri identifier and save key remain unchanged. Consistent theme colors and current document title. App icon assets ship in `dist` and are precached. The cache revision changed; cache population requests reload to avoid stale HTTP-cache assets. Scope-specific old-cache cleanup preserved. Standalone contains exactly one embedded favicon, no external link.
- Settings contains app emblem, context-sensitive installation guidance, and an explicit browser-provided installation button only when `beforeinstallprompt` is available; `appinstalled` and standalone/native window checks update the panel. No installation success claim from mere page load. Native development URL fixed; native bundle version advanced to 8.1.0.

## Executed local checks
`npm run verify`: 76/76 unit tests, TypeScript and production/standalone build succeeded. All five PNG variants decoded and have exact dimensions; maskable pixels checked geometrically; all seven ICO entries decoded. Standalone Chromium test passed with original CSP, installation help and icon displayed, single data favicon, zero network requests, no page errors. Direct actual-origin localhost navigation returned `ERR_BLOCKED_BY_ADMINISTRATOR`; this is not a product or installability failure, but an environment limitation. A new real-origin `/last_stop/` CI suite checks browser manifest parsing, Chromium installability diagnostics, icon decode/paths, Apple icon, service worker control, offline icon fetch and save reload. It must run in GitHub Actions before production merge. Additional regression evidence is recorded in the CI run and final package.

## Independent acceptance and handover
- Remote V8.1 website and Windows compile must pass before merge; Pages deployment is separately verified after merge. No claims of desktop shortcut creation, real iPhone/Android, Mac Dock, signed installer, sustained hardware performance, screen-reader certification or human retention until those checks actually run.
- Existing installed icons may remain cached at OS/browser level. Open site online to update; if removal/reinstallation is necessary, export the train first. Never clear site data just to refresh an icon. No cloud sync. Unsigned installer only; actual Windows installer use and signing require independent testing and signing credentials.
- Browser regression and synthetic economic results remain distinct from real player experience. See V8/V7 audit for original art consistency, performance, independent accessibility/security and usability acceptance criteria.

## Research
MDN installability https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
MDN icons https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons
MDN install prompt https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt
web.dev maskable safe zone https://web.dev/articles/maskable-icon
Tauri app icons https://v2.tauri.app/develop/icons/
Chrome DevTools Protocol Page domain https://chromedevtools.github.io/devtools-protocol/tot/Page/
