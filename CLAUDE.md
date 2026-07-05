# AFTERLIGHT — Session Bootstrap

**Read these two documents before any implementation work, in this order:**

1. `docs/CONSTITUTION.md` — the Master Constitution. Supreme design authority for the entire project. Every AF module extends it; nothing may contradict it unless the Project Owner explicitly authorises it.
2. `docs/TECHNOLOGY_DECISION.md` — the approved technology stack (TypeScript + WebGL web game, GitHub Pages hosting, PWA offline, online as an optional later layer).

## Project state

- **2026-07-05: Project restart.** Afterlight is being rebuilt from the start under the Master Constitution v1.0. The Project Owner is delivering ~200 AF module prompts, followed by visual design boards and asset sheets. AF modules live under `docs/modules/` as they arrive.
- Code from the previous iteration (pre-restart bullet-heaven build) is preserved in git history prior to the restart commits; it is superseded and carries no design authority.

## Standing rules

- Modules are extended, never overwritten. Locked modules require explicit Project Owner approval to modify.
- Offline-first: the simulation core must never depend on a network. Online/community features are an optional layer added later.
- Performance disciplines (object pooling, minimal per-frame allocation, async loading) apply from the first line of code, not as a later pass.
- Accessibility is mandatory in every feature, never a follow-up.
- Quality gate: every AF module self-reviews to 9.5/10 minimum before it is considered complete.
