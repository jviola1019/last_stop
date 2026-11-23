# Everline v3 · Typography and spacing audit

This release uses the original *Sunset Journey on the Everline* illustrated game scene as its art and composition reference. The world remains the dominant surface, with compact ticket-like controls.

## Type scale

| Element | Display family / font stack | Desktop | Mobile |
|---|---|---:|---:|
| Carriage name | Iowan Old Style → Palatino Linotype → Baskerville → Noto Serif → Georgia | 32px | 25px, 22px on compact |
| Menu headings | Same railway serif | up to 42px | 28px |
| Bottom navigation | Same railway serif | 20–28px | 13–15px |
| HUD currency | Same serif, tabular numerals | 23–32px | 15–17px |
| Action labels | Inter → Segoe UI → native sans → Arial | 11–14px | 11–13px |
| Metadata | Same sans, tracked small capitals | 10–11px | 9–11px |

No external fonts, license-bound font assets, remote requests, or API keys are required. Native fallbacks preserve offline rendering.

## Spacing and tap geometry

- Spatial scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 CSS pixels.
- All interactive targets tested at **at least 44×44 CSS pixels**, including collect, settings, rearrange, upgrade, hire and navigation.
- Desktop selected carriage panel ≤382px wide; portrait inspector stays above bottom navigation.
- Portrait navigation 82–84px high, accounting for safe-area bottom inset; desktop navigation 124px high.
- Handheld tutorial moved above the scene's train so it no longer overlaps the carriage inspector.
- Explicit rules at viewport thresholds 900, 520, and 350 pixels and on short portrait/landscape screens.

## Executed Chromium computed-layout checks

The game was loaded in Chromium with the exact game scripts and image bytes in an in-memory harness. Tests read actual `getBoundingClientRect()`, computed fonts, and element scroll dimensions; CSS alone was not treated as proof.

| Viewport | Min hit target | Carriage inspector / bottom nav gap | Result |
|---|---|---|---|
| Desktop 1440×900 | 44×44px | 301.8px | PASS |
| Tablet 820×1180 | 44×44px | 4px | PASS |
| iPhone-sized 390×844 | 44×44px | 4px | PASS |
| Compact 320×650 | 44×44px | 4px | PASS |

Checks include no clipped primary text, no unintended document horizontal overflow, tutorial/inspector separation, navigation/inspector separation, and correct display-serif family. The 15 gameplay/security/economy unit tests also passed after the change.

## Visual findings

**Fixed:** placeholder icons, mixed fonts, inconsistent 44px targets, cramped price strings, overly tall desktop inspector, portrait tutorial overlap, Shop catalogue spacing, and disabled-action contrast.

**Still different from the original image:** the reference represents a train with five carriages; a new game starts with two. Backgrounds are partly flattened; the camera and composition adapt per viewport. This is a playable recreation rather than literal pixel matching.

## Validation boundaries

Physical iPhone Safari and cross-browser typography are not independently tested. The testing sandbox blocks direct `file://` and `localhost` Chromium navigation. Browser smoke tests therefore use same-source modules/assets inline and demonstrate gameplay/layout under that constraint. Screenshots and full evidence are included in the downloadable v3 archive.
