# AFTERLIGHT — Bug Tracker

**Last updated:** 2026-06-28

Active and resolved bugs. Severity: 🔴 blocker · 🟠 major · 🟡 minor · ⚪ trivial.

## Open
_(none known — see `docs/KnownIssues.md` for non-bug limitations)_

## Resolved

### ✅ BUG-002 🔴 Single-file build stuck on infinite boot spinner (some browsers)
- **Found:** 2026-06-28 (user report: "spinning wheel of death")
- **Symptom:** Opening the single-file `AFTERLIGHT.html` from `file://` showed
  the boot splash forever with no error — in some browsers (Firefox/Safari).
- **Cause:** The single-file build inlined the bundle as `<script type=
  "module">`. Browsers refuse to execute ES modules loaded over `file://`
  (module CORS), so the script never ran. Because the app's error handling lived
  *inside* that module, nothing surfaced — hence a silent eternal spinner. Not
  caught earlier because the headless smoke test used Chromium, which is more
  permissive.
- **Fix (defence in depth):**
  1. Single build now bundles as a classic **IIFE** and strips `type="module"`
     so it runs from `file://` in every browser (`vite.config.ts`).
  2. `main.ts` waits for `DOMContentLoaded` before booting (classic scripts
     aren't deferred, so they can run before the body is parsed).
  3. Added a **classic, non-module watchdog** in `index.html` that shows a
     readable error if boot fails or stalls >7s — no more silent spinner.
  4. Lowered build target to `es2019` for broader compatibility.
- **Verified:** single-file build boots + plays from `file://` in headless
  Chromium with the script tag confirmed non-module.

### ✅ BUG-001 🟡 SpawnDirector cap test gave a false failure
- **Found:** 2026-06-28 (M1 test pass)
- **Symptom:** `suppresses fodder spawns at the enemy cap` failed (expected 0
  fodder, got 5).
- **Cause:** The *test* passed a stale `enemyCap(0)` while the director's cap
  grows with elapsed time, so live-count briefly dipped below the rising cap and
  spawns were (correctly) allowed. Production code was correct.
- **Fix:** Test now reports a live count far above any reachable cap. Verified
  the director suppresses all fodder at/above cap.

## How to file
Add an entry with: id, severity, date found, build, repro steps, expected vs
actual, and suspected cause. Move to **Resolved** with the fix and verification
when closed. Prefer adding a regression test alongside any non-trivial fix.
