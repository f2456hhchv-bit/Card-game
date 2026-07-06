# AFTERLIGHT — AF Module Status Registry

**Living instrument of AF-012 §9.** One row per AF module: the project's production state at a glance. Updated in the same commit as any status change.

Phase note: AF-000 → AF-012 are specification/framework modules — their build-applicable pipeline stages (Prototype, Performance/Accessibility/Balance Testing) bind onto the first implementing code modules and are tracked there (recorded per module as "standing obligations").

| Module | Title | Version | Stage | Review | QA | Approval | Lock |
|---|---|---|---|---|---|---|---|
| AF-000 | Foundation | v1 | Complete (spec) | Aligned | — (no build output) | Approved 9.5/10 | **LOCKED** |
| AF-001 | Technical Architecture | v1 | Complete (spec) | Aligned | Standing obligations → first code module | Approved 9.5/10 | **LOCKED** |
| AF-002 | Visual Language | v1 *(+2 authorised amendments: palette extension; display face)* | Complete (spec) | Aligned | Standing obligations → first visual build | Approved 9.5/10 | **LOCKED** |
| AF-003 | UX & HUD Architecture | v1 | Complete (spec) | Aligned | Playtest obligations → first playable | Approved 9.5/10 | **LOCKED** |
| AF-004 | Gameplay Readability | v1 *(colour reconciliation resolved by owner ruling)* | Complete (spec) | Aligned | Standing obligations → all content modules | Approved 9.5/10 | **LOCKED** |
| AF-005 | UI Component Library | v1 | Complete (spec) | Aligned | Live review → UI implementation module | Approved 9.5/10 | **LOCKED** |
| AF-006 | Asset Production | v1 | Complete (spec) | Aligned | Validation tooling → first code module | Approved 9.5/10 | **LOCKED** |
| AF-007 | Iconography & Symbols | v1 *(authorised supersession: nine-tier rarity ladder)* | Complete (spec) | Aligned | Standing obligations → all content modules | Approved 9.5/10 | **LOCKED** |
| AF-008 | Colour System & Hierarchy | v1 *(3 judgement calls ratified by owner)* | Complete (spec) | Aligned | Contrast validator → first code module | Approved 9.5/10 | **LOCKED** |
| AF-009 | Typography & Writing | v1 | Complete (spec) | Aligned | Text tooling → first UI build | Approved 9.5/10 | **LOCKED** |
| AF-010 | World Building & Canon | v1 | Complete (spec) | Aligned | Canon ledger begins → first content module | Approved 9.5/10 | **LOCKED** |
| AF-011 | Design Pillars | v1 | Complete (spec) | Aligned | Unified Feature Gate binds all future modules | Approved 9.5/10 | **LOCKED** |
| AF-012 | Production Governance | v1 | Complete (spec) | Aligned | Lifecycle binds all future modules | Approved 9.5/10 | **LOCKED** |
| AF-013 | Content Governance | v1 *(adds compact ID-set save rule; anti-FOMO live-content guarantee)* | Complete (spec) | Aligned | Validation binds all future additions | Approved 9.5/10 | **LOCKED** |
| AF-014 | Master Design Constitution | v1 *(authority chain recorded; priority-order floor rule; ADR practice instituted)* | Complete (spec) | Aligned | Governs all future modules beneath AF-000 | Approved 9.5/10 | **LOCKED** |
| AF-015 | Master Foundation Lock | v1 *(full AF-000→015 review executed; scheduled debts assigned)* | Complete — **Foundation Phase locked 2026-07-06** | Aligned | Production contract binds AF-016+ | Approved 9.5/10 | **LOCKED** |

**PHASE STATUS: Foundation Phase (AF-000 → AF-015) COMPLETE AND LOCKED. Core Gameplay phase in progress (AF-016 →).**

## Core Gameplay phase

| Module | Title | Version | Stage | Review | QA | Approval | Lock |
|---|---|---|---|---|---|---|---|
| AF-016 | Core Gameplay Framework | v1 | Complete — spec + first implementation increment (state machine, core runtime, tests, CI; old iteration archived) | Aligned | Typecheck + 26 tests green; full-session playtests bind as AF-017→026 land | Approved 9.5/10 | **LOCKED** |
| AF-017 | Adaptive Enemy Director | v1 *(canon: 7 environmental events, 9 wave identities, Mutators registered)* | Complete — spec + implementation (`src/game/director/`), 300-run headless simulation in CI | Aligned | 42 tests green incl. simulation invariants; live-feel tuning binds AF-021+ | Approved 9.5/10 | **LOCKED** |

**Authorised amendments log:**
- 2026-07-05 — AF-002 output: palette extended with `vitality.green`, `shield.blue` (owner ruling via AF-004 review).
- 2026-07-05 — AF-002 output: rarity ramp superseded by AF-007's nine-tier ladder (owner authority via AF-007).
- 2026-07-05 — AF-002 output: secondary display face permitted, titles only (owner authority via AF-009).
- 2026-07-05 — AF-008 output: Plasma Blue → `shield.blue`; Poison → `toxin.green`; Slow → `neutral.grey` (three calls ratified by owner).
