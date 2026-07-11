# AFTERLIGHT — Session Bootstrap

**Read these three documents before any implementation work, in this order:**

1. `docs/CONSTITUTION.md` — the Master Constitution. Supreme design authority for the entire project. Every AF module extends it; nothing may contradict it unless the Project Owner explicitly authorises it.
2. `docs/TECHNOLOGY_DECISION.md` — the approved technology stack (TypeScript + WebGL web game, GitHub Pages hosting, PWA offline, online as an optional later layer).
3. `docs/MASTER_BUILD_DIRECTIVE.md` — the standing implementation-quality directive (issued 2026-07-11, permanent, overrides all future implementation decisions unless the Project Owner explicitly supersedes it). Governs *how* every future feature is built — production-ready only, no placeholders/TODOs, finish-compile-test-optimise-commit one feature at a time, never leave a broken build — not *what* the game contains. Does not redesign AF-000→AF-200 or GP-001→GP-005.

## Project state

- **2026-07-05: Project restart.** Afterlight is being rebuilt from the start under the Master Constitution v1.0. The Project Owner is delivering ~200 AF module prompts, followed by visual design boards and asset sheets. AF modules live under `docs/modules/` as they arrive.
- **2026-07-06: Foundation Phase (AF-000 → AF-015) COMPLETE AND LOCKED.** See `docs/FOUNDATION_LOCK.md` (production contract) and `docs/modules/STATUS.md` (module registry + amendments log). From AF-016 onward, modules build gameplay systems, content, and progression on the locked foundation; no new foundational systems without explicit Project Owner authorisation. Authority chain: `docs/CONSTITUTION.md` → AF-000 → AF-014 → all modules.
- **2026-07-11: GP-001 → GP-005 (core gameplay loop, enemy/wave/difficulty, meta progression, content engine, final production directive audit-fixes) COMPLETE AND LOCKED.** See `docs/modules/STATUS.md`'s GP registry. Immediately afterward, the Project Owner issued `docs/MASTER_BUILD_DIRECTIVE.md` — a standing, non-numbered directive governing all future implementation quality/workflow (see item 3 above). Future work continues as GP-006+ or new AF modules, built from the now-locked GP-001→005 foundation, under the Master Build Directive's standing rules. Several real, audited-but-deferred items remain open from GP-005 (documented in `docs/modules/GP-005-final-production-directive.md`'s "What was deliberately NOT built" section) — the O(n²) collision-loop/spatial-partitioning gap, 5 remaining hardcoded-id reinforcement-spawn lookups, a save version-migration gap, and remappable-controls/colour-blind/font-scaling wiring. These are real backlog, not re-audited from scratch when picking up future performance/accessibility work.
- Code from the previous iteration (pre-restart bullet-heaven build) is preserved in git history prior to the restart commits; it is superseded and carries no design authority. The old working-tree code (`src/`, etc.) is replaced when the first implementation module lands.

## Standing rules

- Modules are extended, never overwritten. Locked modules require explicit Project Owner approval to modify.
- Offline-first: the simulation core must never depend on a network. Online/community features are an optional layer added later.
- Performance disciplines (object pooling, minimal per-frame allocation, async loading) apply from the first line of code, not as a later pass.
- Accessibility is mandatory in every feature, never a follow-up.
- Quality gate: every AF module self-reviews to 9.5/10 minimum before it is considered complete.
- **2026-07-09: Primary art style (Project Owner ruling, amends `docs/TECHNOLOGY_DECISION.md`):** Nintendo-inspired stylized 3D mobile game art — chibi proportions, clean hand-painted textures, soft PBR lighting. This supersedes AF-002/092's prior 2D-flavoured art-style vocabulary wherever it conflicts. Any future AF module text, existing doc content, or my own output that describes art direction inconsistent with this style (e.g. realistic/NASA/hard-sci-fi framing, non-chibi proportions, flat/unlit shading) must be flagged to the Project Owner before proceeding — do not silently implement or catalogue it as if compatible. Rendering-pipeline and AF-002/092 revision work is scoped separately; awaiting a formal AF-095+ prompt before implementing.
