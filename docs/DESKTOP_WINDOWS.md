# Windows `.exe` — optional build target (unverified in this environment)

The browser/PWA is the canonical game because it runs on iPhone, Mac, Windows, Android and static GitHub Pages with one codebase. The desktop wrapper is **not a different graphics engine**: Tauri hosts the exact same illustrated game in Windows WebView2.

A valid Tauri v2 source scaffold is in `src-tauri/`. It was not compiled in this Linux container (Rust/Cargo and Windows build tools were unavailable). Do not treat this as an existing `.exe` download.

On a Windows PC with [official Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) installed:

```powershell
npm ci
npm install --save-dev @tauri-apps/cli@^2
npx tauri build
```

The Windows NSIS installer should be generated under `src-tauri/target/release/bundle/nsis/` if compilation succeeds. Verify Windows icon, save persistence, asset paths and install/uninstall on a real Windows machine before distributing the executable. The extra CLI package will update the local `package-lock.json`; commit those changes separately for a reproducible desktop release.

This scaffold deliberately omits filesystem, shell and outbound network permissions. The browser version does not require these capabilities.
