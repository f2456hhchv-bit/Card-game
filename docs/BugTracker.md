# AFTERLIGHT — Bug Tracker

**Last updated:** 2026-06-28

Active and resolved bugs. Severity: 🔴 blocker · 🟠 major · 🟡 minor · ⚪ trivial.

## Open
_(none known — see `docs/KnownIssues.md` for non-bug limitations)_

## Resolved

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
