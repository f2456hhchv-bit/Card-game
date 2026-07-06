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
| AF-018 | Camera Framework | v1 *(Photo Mode registered as future flag)* | Complete — spec + implementation (`src/engine/camera/`), deterministic headless tests | Aligned | 54 tests green; on-screen feel review binds AF-020+ | Approved 9.5/10 | **LOCKED** |
| AF-019 | Input Framework | v1 *(targeting law binds AF-021; QuickPing/PhotoMode/one-handed registered)* | Complete — spec + implementation (`src/engine/input/`): action core, kb/mouse + gamepad adapters, touch joystick; pause wired via actions | Aligned | 74 tests green; per-device hardware passes bind at platform QA | Approved 9.5/10 | **LOCKED** |
| AF-020 | Player Movement | v1 *(reserved handling attributes for ship profiles; broad-phase slot registered)* | Complete — spec + implementation (`src/game/movement/`) + playable canvas sandbox (input→movement→camera), browser-verified via Playwright | Aligned | 88 tests green; per-ship/biome feel passes bind at content QA | Approved 9.5/10 | **LOCKED** |
| AF-021 | Combat Framework | v1 *(chain reactions registered as weapon-module extension points; self-damage future)* | Complete — spec + implementation (`src/game/combat/`): 9-stage pipeline w/ breakdown, status engine w/ AF-020 bridge, layered defence, selectors; live sandbox combat (drones, cannon, death), browser-verified | Aligned | 107 tests green incl. 200-fight simulation; weapon/enemy/boss passes bind at content QA | Approved 9.5/10 | **LOCKED** |
| AF-022 | XP & Level Progression | v1 *(12 upgrade categories registered; reroll/lock/wider offers await content buyers; narrated upgrades future)* | Complete — spec + implementation (`src/game/progression/`): anti-grind curve, 7-tier pooled pickups w/ magnetism + coalescing, weighted seeded upgrade pool; live in sandbox (gems, bar, level-up overlay w/ real choices), browser-verified | Aligned | 121 tests green; pacing/balance passes bind at content QA | Approved 9.5/10 | **LOCKED** |
| AF-023 | Loot Framework | v1 *(13 categories + 8 special kinds registered; placeholder affixes; pity timers rejected)* | Complete — spec + implementation (`src/game/loot/`): 8-roll deterministic generator w/ per-drop seeds, AF-007 rarity ladder, clamped smart loot, bank-don't-delete ground cap (Legendary+ exempt); live beams + notices in sandbox, browser-verified | Aligned | 131 tests green incl. 500k-drop distribution; item content passes bind at equipment/weapon/relic QA | Approved 9.5/10 | **LOCKED** |
| AF-024 | Research Framework | v1 *(save system implemented — AF-001 §8 debt paid; 15 categories + 11 node types registered; DR-005: instant unlocks, owner-ratified)* | Complete — spec + implementation (`src/core/save/`, `src/game/research/`): versioned slices w/ checksum/migration/quarantine/backup, tree engine w/ graph validation + hidden discoveries + refund reset; persistent research live in sandbox, reload-survival browser-verified | Aligned | 148 tests green; tree content + research screen bind at their modules | Approved 9.5/10 | **LOCKED** |
| AF-025 | Crafting Framework | v1 *(12 categories + 10 resources + 6 stations registered; evolution hook awaits content inputs; instant crafts per DR-005 reasoning)* | Complete — spec + implementation (`src/game/crafting/`): persistent materials/blueprints/hangar, gated deterministic crafting producing AF-023-shaped items, floor-guaranteed salvage w/ tested anti-exploit invariant, escalating-cost reforge; Lightforge live at Galaxy Command, craft→reload→salvage browser-verified | Aligned | 157 tests green; recipe/evolution content binds at equipment modules | Approved 9.5/10 | **LOCKED** |
| AF-026 | Meta Progression | v1 *(reward union is cosmetic/knowledge only — no stat field exists; account level reuses AF-022 engine; collections use AF-013 compact ID sets)* | Complete — spec + implementation (`src/game/meta/`): account level, generic mastery tracks, idempotent collections, permanent statistics, once-only challenge engine; third save slice; Statistics screen is a live profile; defeat-pays + reload-survival browser-verified | Aligned | 167 tests green incl. 300-expedition career sim; reward pacing binds at cosmetic/content modules | Approved 9.5/10 | **LOCKED** |

**AF-016 §8 integration list COMPLETE: all ten planned systems (AF-017 → AF-026) implemented on the locked foundation with zero foundational additions.**

**Authorised amendments log:**
- 2026-07-05 — AF-002 output: palette extended with `vitality.green`, `shield.blue` (owner ruling via AF-004 review).
- 2026-07-05 — AF-002 output: rarity ramp superseded by AF-007's nine-tier ladder (owner authority via AF-007).
- 2026-07-05 — AF-002 output: secondary display face permitted, titles only (owner authority via AF-009).
- 2026-07-05 — AF-008 output: Plasma Blue → `shield.blue`; Poison → `toxin.green`; Slow → `neutral.grey` (three calls ratified by owner).
- 2026-07-06 — DR-005: research unlocks instant permanently (owner ratified Option A); extends to crafting time by the same reasoning.
