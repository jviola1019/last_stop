# Everline v3 · Typography and spacing verification

The design target is the user's original **Sunset Journey on the Everline** composition, not an interchangeable admin interface. The illustration remains the main visual layer; controls are dark railway-enamel plaques, gold-edged tickets, and illustrated iconography.

## Type system

| Role | Stack | Desktop | Phone |
|---|---|---:|---:|
| Major room title | Iowan Old Style → Palatino Linotype → Baskerville → Noto Serif → Georgia | 32px | 25px (22px at 320px) |
| Heading in Shop / Journal | Same display serif | up to 42px | 28px |
| Primary navigation | Same display serif | 20–28px | 14px (13px at 320px) |
| HUD currency | Same display serif, tabular numerals | 23–32px | 15–17px |
| Instructional copy | Inter → Segoe UI → system UI → Arial | 13–14px | 12–13px |
| Metadata / ticket labels | Same interface sans, bold, tracked | 10–11px | 9–11px |

Font files are intentionally **not packaged**. These are system-font stacks with native fallbacks to keep the game completely playable offline and to avoid unexpected licensing and loading failures. The logo is part of the original illustration.

## Spatial rules

- Base spacing units: 4 / 8 / 12 / 16 / 20 / 24 / 32px.
- Primary touch targets: at least 44 × 44 CSS px, including move buttons, collect, settings, navigation, and upgrade.
- Railway cabinet desktop: ≤382px wide, positioned near the upper-center of the illustration; compact enough to avoid swallowing room sprites.
- Mobile cabinet: viewport width minus 22px, aligned above bottom navigation, with internal scroll if needed.
- Navigation: 124px high on desktop with 78px tall sections; 82–84px on phone/tablet with ≥59px tall sections.
- Type and margins adapt at 900px, 520px, 350px, and short-screen landscape breakpoints.
- `env(safe-area-inset-bottom)` is included for the fixed navigation and inspector.

## Executed layout audit

Measurements use real computed CSS and `getBoundingClientRect` in Chromium, not CSS-file inspection alone. The test asserts:

1. All primary interactive elements have a height and width of at least 43.5px (allowing fractional-pixel measurement).
2. Selected carriage inspector does not overlap bottom navigation.
3. Tutorial card does not overlap the selected-carriage inspector on mobile.
4. Room name, level subtitle, earnings, HUD counters, and navigation labels have no unexpected horizontal text overflow.
5. Room titles retain the serif display stack.
6. There is no unintentional document-wide horizontal overflow.
7. Actual gameplay interactions and save restoration still work.

| Viewport | Result | Min interactive size | Inspector / nav gap |
|---|---|---|---:|
| Desktop 1440×900 | PASS | 44 × 44 px | 301.8px |
| Tablet 820×1180 | PASS | 44 × 44 px | 4px |
| iPhone-sized 390×844 | PASS | 44 × 44 px | 4px |
| Compact 320×650 | PASS | 44 × 44 px | 4px |

All 15 game/economy/security tests passed unchanged. The generated desktop, tablet, iPhone, compact-phone, and Shop screenshots are stored in `docs/`.

## Visual review: reference → implementation

**Corrected:** Coin and arrival hierarchy, room card vertical compression, shop details, secondary text readability, disabled purchase contrast, bespoke railway navigation icons, card/button border geometry, and phone safe-area layout.

**Differences still present:** The original reference depicts five carriages at an advanced game stage; a new player's save intentionally begins with only two. The art assets were extracted from the scene rather than redrawn as independently articulated sprites. Background art remains partially flattened. The v3 pass does not claim exact pixel matching across device aspect ratios.

## Unverified

Safari/WebKit on a real iPhone, Android GPU performance, live GitHub Pages browsing, and direct `file://` document navigation are not independently verified. Chromium blocks file/local navigation in this environment, so visual browser tests use the exact source modules and images in an isolated in-memory harness.


### v5 visual unification

The v5 HUD, toast announcements, regional Journal, all four Shop categories, carriage inspector, and station status now share an old-style railway display-serif hierarchy with a separate readable humanist sans UI stack. Layout retains safe-area spacing and primary tap targets of at least 44 CSS pixels. See current `docs/desktop-scene.png`, `docs/iphone-scene.png`, `docs/desktop-shop.png`, and `docs/iphone-shop.png` for actual rendered visuals. Screen emulation does not replace physical Safari testing.
