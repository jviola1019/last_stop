# V7 artwork update

The original approved reference remains immutable. `scripts/refine_heartland.py` reconstructs a HUD-free scenery plate and transparent `brand.png` using the source and a deterministic pixel-scale forest layer; no old nav is painted beneath scenic mode. Seven region, seven room, seven engine and sixteen station SVG assets have an authored pixel-texture finishing pass (`scripts/finish_pixel_art.py`), retaining the original five room PNGs and steam locomotive. 43 runtime scene images were decoded and inspected for visible pixels by Chromium. Procedural vector/raster art is not equivalent to a professionally commissioned full painterly asset set; inherited flattened-source approximations, baked decorative figures and visual style differences remain, disclosed in V7 audit.

# Art Direction — From screenshot-like dashboard to living diorama

## Reference matching

The approved reference is `assets/source-reference.png`, the original "Sunset Journey on the Everline" image. The application preserves its warm dusk color script, mountain peaks, waterfall, viaduct, station, pink cloud bank, reflective river, miniature interior scenes, brass/navy locomotive and dark-gold carved HUD.

## Actual game artwork

Carriage textures are independent PNG assets with transparency. The player can rearrange carriages, add new carriages, hire residents and see upgrades, pan across the train, and watch overlaid motion (wheels, smoke, indoor lights, weather). The artwork is used in the running game; there is no unrelated mockup or static hero-image replacement.

The original reference contained a completed train and UI. `scripts/make_art.py` extracts sprites; `scripts/clean_world.py` composites a clean scenic plate from the same source, removes embedded UI and replaces the train footprint. Important limitation: because we started from **one flattened image** rather than source PSD/transparent layers, some scenery repainting and sprite silhouettes are approximations; additional carriage interiors not present in the reference reuse a hand-picked existing texture with a corrected type-specific sign and animated gameplay details. A professional production pass would author distinct rooms from layered PSDs or dedicated sprite sheets.

## Contrast with previous implementation

Previous: pale flat backgrounds; separate inspector/sidebar; geometry-only train; navigation visually dominating scenery. New: landscape fills screen; illustrated compartments at playfield scale; floating inspector matched to the reference; dark framing; brass highlights; mobile camera revealing a full room above the bottom controls.

## Visual fidelity limitations

- User reference depicts five rooms. New-game progression correctly starts with two owned carriages plus the engine; the scene expands as the user buys others.
- Camera crops the panorama on narrow devices; it intentionally does not shrink a 1672-pixel scene until its rooms become unreadably tiny.
- Additional biomes share the initial painted valley as the base. Weather/light variations are dynamic; fully distinct painted backgrounds for all eight destinations would need more authored source assets.
- Individual sampled character sprites are partly static; additional hirelings and effects are animated overlays.
