# LAST STOP: THE EVERLINE — V7 Grand Journey release audit

**Assessment:** locally verified release candidate; public production readiness remains conditional on remote CI, real device and human acceptance. Audit date: 2026-11-24 UTC. Implementation began from the exact V6 archive and GitHub PR #6 (43a46508edd495aeb1d90e102f7fe489a768488b). See V7_PLAN.md, V6_GAUNTLET.md, MASTER_EXECUTION_PROMPT.md and AGENTS.md for provenance and plan.

## Before editing
- Reproduced 51/51 V6 tests and production build. Inspected GitHub run 45329884552: unit/build passed, browser installation failed because ubuntu-latest moved to 26.04 while pinned Playwright did not support it. Browser regressions did not run. Pinned Ubuntu 24.04 in remote commit 57d13f40da6a586ae450fd641eaeaa0d7b55594f, then built local V7 against the V6 source.
- Prior requirements: original sunset pixel-painted scene, 25 carriages, 20 levels, 5 visual grades, room economics based on actual model, station-only boarding, no required paid or streak mechanics, touch/keyboard, migration from older saves. Kept these as hard constraints. The original numbered 92-threat document was not recoverable in full; threat review below is architecture-specific and does not claim equivalence to every original item.

## Implementation / regression matrix
| Requirement | Actual implementation | Evidence / disposition |
|---|---|---|
| 12 carriage types, 20 levels, five visual grades | Preserved; richer type-specific furnishings and animation; level/crew retained at station refit | Existing V5/V6 suite and max-train browser scenario |
| 8 locomotives and historical eras | 8 gated cosmetic models with independent silhouettes (1890–2040), original steam asset retained | Engine unit tests and shop/selection browser test |
| Station-specific art and postcard | 16 individually authored station assets, station-timer placement, illustrations in journal | Unit asset checks, art decoding, timed stop tests |
| Pixel-art consistency | 37 vector assets pixel-finished; original painting and cutaways kept; separate HUD/logo and reconstructed forest/river plate | All 43 scene assets decoded and nontransparent; screenshot inspection. Art remains partly procedural; not commissioned painterly fidelity |
| Character simulation | Named bounded passenger manifests; deterministic station-only transitions; walking, sitting/resting, reading and working visuals | 150 arrivals tested; manifest count and IDs exact. Original decorative figures remain in some PNGs, not simulated passengers |
| Seasons | Spring/summer/autumn/winter; auto by credited service or manual | Unit and browser tests; does not change income |
| Stories | Five three-chapter stories and one-time final rewards | Deterministic arrival/reward and UI tests |
| Fleet | Three independent local slots unlock at 20 cars / 3 regions; isolated primary/backup/reset | Unit tests; real-origin reload route in CI, not locally proven |
| Economy | Positive diversity and specialty multipliers; new Stamp projects; three heritage sinks; existing level cap and cost curve | 365-day active/casual plus seeded annual scenarios |
| Scenic mode | Hide real HUD/nav, independent branding, zoom, PNG postcard; reconstructed HUD-free background | Browser interaction; screenshot inspection |
| Audio | Optional synthesized rail and station chimes, persistent volume, background suspension | Functional code and volume control; no commissioned soundtrack or physical audio review |
| Responsive layout | Retains original Baskerville/Avenir system fallback, 44px key controls and safe area; keyboard and focus restoration; reduced motion | Four Chromium viewport tests. Not universal typeface licensing/device certification |
| Performance | Scaled raster cache, offscreen culling, room-cache, O(n) income context; 4M-pixel canvas and 12M cached-pixel budgets | 25-car browser fixtures; repeated short samples in living-browser-results.json. Sustained 60 FPS/battery/input latency not certified |
| Save integrity | Retain v6 storage key, v3–5 migration, additive V7 fields, three backups, invalid manifest recovery, cross-tab warning, fleet isolation | 65-test suite, hostile name and detached diagnostics in browser |
| Static/PWA | Actual runtime CSP, offline edition with separate CSP, scoped cache, 192/512/maskable icons, static build | Standalone HTML executes with intact CSP/zero external requests; actual-origin CI required |
| Windows | Native Tauri config aligned to V7 and optional unsigned NSIS CI candidate | No local Rust/Windows environment or signed installer; build gate pending |

## Actual local tests
- `npm run verify`: TypeScript 5.8.3 check, 65/65 Node unit tests, static `dist/` and standalone HTML build. Includes HTTP preview tests, passive artwork, malicious imports, detached manifest identity, existing transaction/reward regressions.
- `node scripts/balance.mjs --long`: two deterministic profiles at eight time horizons. Active upper bound: 25 cars, max level 19, 8 regions after 365 days. Casual: 25 cars, max level 17, 6 regions. See balance-365-results.json.
- `node scripts/policy-stress.mjs`: 4 profiles × 6 seeds × 365 days = 8,760 validated day-end states; zero rejected purchases. Regular, collector and income optimizer reached 8 types (V6 regular 3, optimizer 2); short visits 8–9. Peak room level 18/19/19/20. Policies and model changed, so comparison is illustrative, not causal inference or user telemetry. See policy-stress-results.json.
- Browser source harnesses use identical module bytes and images in Chromium via data URLs; the browser administrator blocks direct localhost navigation. Four screen sizes (1440×900, 820×1180, 390×844, 320×650), two real-timed arrival/departure checks, two expanded feature/art decode checks, two 25-car checks. Screenshot files and JSON results in docs/. Harness CSP is removed only for source injection; standalone browser test executes actual standalone HTML **with CSP intact**. Browser origin, service worker and other engines are separate CI gates.
- Standalone HTML: actual HTML execution in Chromium via set_content, collection and shop, no page errors and no external HTTP(S) requests. This is not a physical file://, PWA installation or app-store test.
- Performance: earlier V6 34.6 FPS desktop, 56.6 phone viewport; isolated V7 pre-plate-refinement 59.6/56.9 FPS, 29.4/29.9 low-power; brief headless runs. The final run is recorded independently in `living-browser-results.json`. Do not certify real-device sustained 60 FPS. Rendering load varies under concurrent jobs.

## Security review, threat boundaries and tests
This offline-first single-player game has no authentication, backend, payments, public messages, user uploads to server, database, credentials, ads, financial value, cloud sync or native shell commands. These absent surfaces are out of scope, not universally secured. The local device owner can edit currency, saves, clocks or JavaScript; checksum is for corruption only, not authentication. No personal identifiers are requested by the product; user-entered names remain local. Local storage can be cleared by the browser/OS; explicit export is the backup path.

| Threat or control | Outcome |
|---|---|
| Script injection through names, saved state, story text | Name normalization, escaped templates, static allowlist, no executable JSON; hostile-name browser test |
| Prototype keys / malicious selections | Whitelisted type, engine, region, season and event IDs; import adversarial tests |
| Malformed JSON / oversized save | Bounded parsing, checksum, schema validation, oversized and malformed envelope regressions |
| Identity cross-car collision | Passenger ID/car consistency, regenerated invalid records; 150-stop manifest loop |
| Duplicate purchases/rewards / negative balances | Transaction checks, caps, single-award semantics; 24 policy runs with zero rejected purchases |
| Stale tab writes / corruption | Storage event pauses writer; three validated backups; slot-scoped data and recovery |
| Time manipulation / idle inflation | Bounded 8h offline credit, deterministic step and arrival boundaries; local cheat resistance explicitly not guaranteed |
| Path traversal / private source exposure | Preview HTTP loopback and public route allowlist; percent-encoding, private paths and methods tested |
| Cross-origin script/resource requests | Static CSP permits self scripts; standalone data module CSP distinct; no remote assets or analytics |
| SVG script/external links | All asset SVGs statically screened for script, event handlers, foreignObject and remote/JS href/src |
| Service worker cache poisoning / unrelated cache deletion | Scoped app cache prefix, exact allowlisted URL requests, GET only, isolated old-cache cleanup test |
| Cross-origin frame/clickjacking | Preview X-Frame-Options; Pages cannot set HTTP frame-ancestors via meta CSP, open deployment header limitation |
| MIME sniff / referrer / sensors | Preview headers nosniff, no-referrer and sensor Permissions-Policy; Pages header restrictions remain |
| Asset memory exhaustion | Bounded 25 carriages, 4M canvas pixels, 12M cached pixels, LRU; max-train browser check |
| Browser worker background CPU/audio | Hidden document stops render loop and suspends audio; no background network loop |
| Build dependency/supply chain | No production npm runtime dependencies; pinned TypeScript/Playwright/Windows CLI versions; GitHub actions tags and native transitive dependencies still require independent review/lockfile and successful build |
| Native permissions | No file/shell/network plugins; minimal default Tauri core permission config; uncompiled native target not security-certified |
| General accessibility | Keyboard, labels, focus, touch, motion controls and responsive checks; full WCAG conformance, screen-reader/contrast audit on physical devices outstanding |

## Independent release acceptance gates
1. All local deterministic, browser and build checks; verify package integrity and exact Git tree bytes.
2. On GitHub: verify PR unit/build, Chromium interactions, Firefox/WebKit real HTTP origin and actual worker offline reload, seeded policy run. Separately Windows unsigned candidate build. Do not merge while checks are unresolved or failing.
3. Real iPhone Safari, Android Chrome, desktop Edge/Chrome/Firefox/Safari: install/open, landscape/portrait, all screens, 25-car game, save/export/import, offline reload, update/migration, touch targets, audio and battery; record device/OS/browser and reproducible screenshots. Long sustained 60 FPS and input latency on target hardware are separate from headless samples.
4. Independent accessibility: screen-reader and keyboard navigation, focus order, contrast at all states, large text, reduced motion, portrait/landscape. No full conformance claim from automated fixtures.
5. Human art review: coherent painterly interiors, character and station art, no decorative figure confusion, no remaining reconstruction seams. Current assets are authored procedural art and original flattened reference derivations, not a completed commissioned art production.
6. Human play study (consent): observe initial 10 minutes, 24-hour return, week/month retention; record time-to-first collect/build, confusion, task failures, choice diversity, satisfaction and return rates. No evidence of empirical retention currently. Pre-register measures, report sample size and uncertainty, avoid coercive streaks/monetization.
7. Windows real installer smoke, signing if distributing widely, save preservation and uninstall, malware/permission review. No signed or locally tested .exe in this package.

## Research sources
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- MDN Canvas optimization: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
- MDN PWA installability: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- Playwright system requirements: https://playwright.dev/python/docs/intro#system-requirements
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/ (architecture-based control selection, no certified ASVS rating)
- Tauri installer guide: https://v2.tauri.app/distribute/windows-installer/ and GitHub pipeline: https://v2.tauri.app/distribute/pipelines/github/

**Do not confuse functional release-candidate evidence with completed production certification.** The delivered browser game has no observed blocking local regression, but the remaining independent gates are not all passed.
