# EVERLINE project conventions

- **Source of truth**: `src/economy.js` owns deterministic game and economic state; `src/scene.js` never changes resources. Do not calculate income in animation ticks.
- **Game art**: original Canvas 2D primitives; no third-party asset licenses, external requests, image-only mockups, or asset pipeline surprises.
- **Save data**: version 3, validated by `validateState`, imported with an explicit whitelist. No merging untrusted object prototypes; no `eval`, dangerous HTML injection, analytics, or APIs.
- **Interaction**: all economic actions validate funds and caps. DOM `innerHTML` may contain ONLY program-authored constants or escaped whitelisted strings.
- **Accessibility**: semantic buttons, labels, keyboard alternatives, 44px mobile hit targets, system reduced-motion support.
- **Review checkpoints**: logic tests, browser functionality, visual screenshots, local reload, security review, balance projections, and GitHub Actions checks.
- **No fake work**: keep a factual `STATUS.md` log. Do not claim browser environments or remote deployments that were not observed.
