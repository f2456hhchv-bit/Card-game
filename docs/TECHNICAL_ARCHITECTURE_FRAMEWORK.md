# Technical Architecture Framework (AF-094)

Extends AF-001's architecture doc and AF-024/044's save engine. A "meta" module: it documents which of the spec's engineering claims are already true of the real codebase versus honest future work — the AF-091/092/093 realisation-map pattern applied to the architecture itself. Zero changes to any locked module.

## What's new

- **Architecture Principles / Configuration** — all 16 (8+8) already true/real, evidenced against 44 real `*Runtime` classes, 59 `*Data.ts` + 7 `*Tuning.ts` files, and the constructor-injection composition root in `main.ts`.
- **Core Modules realisation** — of 14 spec "Managers": 1 exists as named (`SaveCoordinator`/`SaveProfileManager`), 8 are renamed onto a real `*Runtime` class, 2 are distributed across several real files (Combat, UI — no single class), 1 is orphaned (`GameManager` exists but isn't wired into the real loop), 2 are honest future (Visual — no renderer exists at all; Analytics — nothing exists).
- **Save System / Save Compatibility** — 8 of 15 save categories realise onto one of the 6 real `SaveSlice` instances; 5 of 7 compatibility features (migration, version detection, rollback, corruption recovery, incremental upgrades) are real in `SaveSlice`'s chained-migration/checksum/backup/quarantine design.
- **Event System** — 4 of 8 categories realise onto real `GameEvents` kinds, checked against the actual `keyof GameEvents` union so a typo fails typecheck.
- **Plugin Architecture** — 4 of 7 extension points are already real (data-file additions, `LiveOpsRegistry`); 3 (community features, experimental systems, developer tools) are honest future.
- **Testing / Crash Recovery / Dev Tools / Accessibility Persistence / Performance** — each an honesty map against the real 85-file Vitest suite, `SaveCoordinator`'s 8 autosave triggers, the `DebugOverlay`, and `Pool<T>`.

## Live

The `state` overlay line now reports real module/event-queue counts (`12/14 core modules realised · N active listeners / 28 known event kinds`), and the `save` line reports every real `SaveSlice`'s schema version. Browser-verified, zero errors.

## Review

Zero changes to any locked module. 12 tests, suite at 1107. Score 9.5/10 — approved and locked.
