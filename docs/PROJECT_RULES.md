# Project conventions

1. Never make income depend on frame duration or animation speed. All economy mutations belong in `src/economy.js`.
2. A renderer draws the actual carriage list; avoid static screenshots masquerading as game state.
3. No third-party runtime scripts, remote textures, paid goods, premium currencies or secret keys.
4. Validation precedes every save import and every player purchase; never `eval` imported data.
5. All visible text is legible in the 320px layout. Buttons should be at least 44px high when interaction is essential.
6. Respect `prefers-reduced-motion` and the game's local animation setting.
7. Run `npm run verify`, the Chromium source harness, and visual screenshot inspection before proposing a release.
8. Never claim Windows `.exe`, Pages deployment, WebKit, iPhone hardware or PWA installation validation without actual evidence.
9. Treat the user's original reference illustration as project material; do not claim third-party stock photography.
