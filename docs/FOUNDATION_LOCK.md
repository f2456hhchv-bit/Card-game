# AFTERLIGHT — Master Foundation Lock

**Authority:** Produced output of AF-015. The production contract for the remainder of the project. AF-000 → AF-015 are the canonical, immutable foundation; every future module extends them and never replaces them. Unlocking any part requires explicit Project Owner approval.
**Phase status: FOUNDATION PHASE COMPLETE AND LOCKED — 2026-07-06.**

---

## 1. The locked foundation (fifteen systems, sixteen modules)

| Foundation system | Module | Output of record |
|---|---|---|
| Project Philosophy | AF-000 | `docs/modules/AF-000-foundation.md` (+ `docs/CONSTITUTION.md`, supreme) |
| Technical Architecture | AF-001 | `docs/ARCHITECTURE.md` |
| Visual Language | AF-002 | `docs/VISUAL_LANGUAGE.md` |
| UX Framework | AF-003 | `docs/UX_HUD_ARCHITECTURE.md` |
| Gameplay Readability | AF-004 | `docs/READABILITY_FRAMEWORK.md` |
| UI Component Library | AF-005 | `docs/UI_COMPONENT_LIBRARY.md` |
| Asset Pipeline | AF-006 | `docs/ASSET_PRODUCTION.md` |
| Iconography | AF-007 | `docs/ICONOGRAPHY.md` |
| Colour Language | AF-008 | `docs/COLOUR_SYSTEM.md` |
| Typography & Writing | AF-009 | `docs/TYPOGRAPHY_WRITING.md` |
| World Building | AF-010 | `docs/WORLD_CANON.md` |
| Game Design Pillars | AF-011 | `docs/DESIGN_PILLARS.md` |
| Development Workflow | AF-012 | `docs/PRODUCTION_GOVERNANCE.md` (+ `docs/modules/STATUS.md`) |
| Content Governance | AF-013 | `docs/CONTENT_GOVERNANCE.md` |
| Creative Constitution | AF-014 | `docs/MASTER_DESIGN_CONSTITUTION.md` |
| **Foundation Lock** | **AF-015** | **this document** |

Plus the standing technology decision: `docs/TECHNOLOGY_DECISION.md` (TypeScript + WebGL web game, GitHub Pages, PWA offline, optional online layer).

## 2. Implementation standard for AF-016+ (binding template)

Every future AF module contains, in order — no exceptions: **Module Title · Objective · Design Philosophy · Core System · Rules · Architecture · Gameplay Rules · Visual Rules · Audio Rules (where applicable) · Accessibility · Performance · Debug Requirements · Output · Integrated Self Review Loop · Module Status · Lock Status.** (Extends AF-012 §2's template; this sixteen-section form governs from AF-016 onward. Modules are catalogued verbatim under `docs/modules/` with an alignment review, exactly as the Foundation Phase established.)

## 3. Module numbering & locking

- **Foundation:** AF-000 → AF-015 (closed). **Core Gameplay:** AF-016 →. **Future expansion:** sequential, forever. Numbers are never reused; retired modules are archived (AF-013 §5), never deleted.
- **Locking on approval:** version assigned → documentation archived (git tag `af-XXX-vN` from first code module; STATUS registry row always) → dependencies verified → locked. Extension only; unlocking is an explicit Project Owner act, recorded in the amendments log (procedure and precedents: AF-012 §8 / AF-014 §7).

## 4. Dependency rules for every future module

Reference the locked modules it builds on (by number, in its alignment review) · extend existing systems through documented extension points · never duplicate (validators + review enforce) · never contradict (canon ledger + Gate enforce) · preserve architectural integrity (layer law, event-only communication, data-driven content — AF-001).

## 5. Quality standard (ten gates, 9.5/10 floor)

Every future module satisfies: **Gameplay Quality · Visual Quality · Technical Quality · Performance · Accessibility · Replayability · Scalability · Documentation · Lore Consistency · Integration** — with an overall internal score of **≥ 9.5/10** or it returns for redesign. (Gates map to the AF-012 §4 owning frameworks; Integration is verified by the dependency rules above.)

## 6. The Afterlight Loop (the reinforcement test)

**Combat → Loot → Crafting → Research → Collection → Galaxy Expansion → Experimentation → Mastery → Next Run.**

A faithful compression of AF-000's core loop (exploration, XP, and level-ups live inside Combat→Loot; missions live inside Galaxy Expansion). From AF-016 onward, every proposed system names **which loop stages it strengthens** as part of its concept — a feature that strengthens no stage has no home in Afterlight.

## 7. Design protection, principles, and identity (the permanent tests)

**Reject on sight** (AF-014 §4's automatic rejections, plus): anything that encourages unhealthy engagement or introduces pay-to-win. **Players always feel:** curious, powerful, rewarded, hopeful, motivated — never manipulated, overwhelmed, or forced. **Every feature is:** modular, data-driven, reusable, documented, testable, expandable, future-proof. **The master review questions** are the Unified Feature Gate (AF-011 §5) — one gate, every feature, forever. **Afterlight is always recognised for:** elegant UI · readable combat · meaningful progression · exceptional build diversity · premium presentation · deep replayability · respect for players · strong world building · technical excellence · long-term maintainability.

## 8. Transition protocol — AF-016 onward

The Foundation Phase is complete. From AF-016: every module builds **gameplay systems, content, and progression** on the locked foundation. **No further foundational systems may be introduced unless explicitly authorised by the Project Owner.** If an implementation module discovers a genuine foundational gap, it stops, documents the gap, and requests owner authorisation — it does not quietly found things.

**Scheduled debts carried into the implementation phase** (assigned, not forgotten):
- First **code** module: project skeleton per AF-001 §4, validation tooling + CI (AF-006/AF-008/AF-009), DR seed records (AF-014 §8), git LFS + tagging setup (AF-012 §3).
- First **playable** build: AF-003 §12 playtest obligations; AF-004 two-second-rule verification.
- First **content** module: canon ledger instantiation (`docs/canon/`, AF-010 §10).
- **UI implementation** module: concrete font family selection + licensing (AF-009 §1).
- **Faction-introducing** modules: silhouette grammars for Solar Empire, Abyssal Swarm, Celestial Order (AF-008 §3 debt).

## 9. Debug & instruments (foundation state, observable)

Now: `docs/modules/STATUS.md` (locked modules, versions, amendments log — the registry of record) + per-module alignment reviews (the dependency record). With the first code module: build-info debug panel reading the same data — foundation status, current module, dependency graph (from documentation octets), quality scores, production readiness, architecture health (validator suite summary).

---

## Internal review loop (AF-015, recorded)

The full sixteen-module review is recorded in `docs/modules/AF-015-foundation-lock.md`. Summary: **no unresolved contradictions** (every phase tension was resolved in writing at the time, four by owner ruling); one architecture gap found and closed during the phase (compact ID-set saves, AF-013); overlap removed as it appeared (checklist unification AF-011, gate containment AF-012, taxonomy mapping AF-014, master questions delegated here); extension points verified sufficient for gameplay modules to build with **zero foundational additions**; scheduled debts each have an assigned owner module (§8). All sixteen modules at 9.5/10.

**Internal quality score: 9.5/10 — approved. The Foundation Phase (AF-000 → AF-015) is LOCKED, immutable except by explicit Project Owner unlock. Afterlight now builds gameplay.**
