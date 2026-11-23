# QA evidence and test scope

From the packaged root:

```bash
npm run verify
python tests/browser_art_smoke.py
node scripts/balance.mjs
```

Executed locally:

| Check | Result |
|---|---|
| JavaScript `tsc --checkJs` | Pass |
| Node built-in economy unit suite | 15/15 pass |
| Static dependency-free build | Pass |
| Chromium source-inlined interaction checks: 1440×900 | Pass |
| Chromium source-inlined interaction checks: 820×1180 | Pass |
| Chromium source-inlined interaction checks: 390×844 | Pass |
| Chromium source-inlined interaction checks: 320×650 | Pass |
| Save serialization / rehydration (new runtime) | Pass |
| Build greenhouse, hire resident, install window planters | Pass |
| Keyboard room selection and focus | Pass |
| Network-served navigation / deployed Pages | Not run: blocked |
| Physical device / WebKit | Not run |
| Windows/Tauri installer compilation | Not run |

The browser harness transparently replaces relative module and asset URLs with base64 data URLs. **Source JavaScript logic is unmodified** except that the resolver points to the same exact locally extracted image bytes. The tests therefore confirm real Chromium rendering and interactions, but they do not prove that GitHub Pages configured the correct MIME types and paths. Sample screenshots are in `docs/*-scene.png` and `docs/*-expanded.png`.

### Security review

- No auth, backend, outbound API calls, tracking, client secrets, runtime remote assets or downloadable code.
- Save imports are limited to 200 KB and parsed as strict JSON; the versioned validator whitelists all mutable state, rejects negative/non-finite balances, duplicate carriage IDs, invalid types and excessive levels/staff.
- Purchases and upgrades validate funds, costs and progression in one state transition. A repeated click after spending is rejected.
- UI labels from stored logs are entity-escaped prior to HTML insertion; fixed data is locally authored.
- Local save data can be edited with developer tools. Without a server, user tampering is unavoidable. There is no financial exposure or competitive leaderboard.
- The service worker only caches same-origin GET requests. No elevated Tauri permissions are requested.
- HTTP request smuggling, login brute force, server-side injection, JWT, CORS and SQL attacks are inapplicable: this release has no server, database or authentication paths.
