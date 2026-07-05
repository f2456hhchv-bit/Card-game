# AFTERLIGHT — Development Workflow & Production Governance

**Authority:** Produced output of AF-012. Extends AF-000 → AF-011 and the Master Constitution. Every feature — and every future AF module — moves through this lifecycle. No feature may bypass it. Extended, never replaced.
**Binding rule of the whole document:** quality is built into the process, never added afterwards. *Plan → Build → Review → Improve → Approve → Lock → Repeat.*

---

## 1. The production lifecycle (twelve stages, none skippable)

**Concept → Technical Design → Implementation Prompt → Visual Design Board → Asset Sheet → Prototype → Internal QA → Performance Testing → Accessibility Testing → Balance Testing → Final Approval → Module Lock.**

Extends the Constitution's pipeline by naming Technical Design and Balance Testing explicitly. Stage meanings in this project's practice:

- **Concept** passes the Unified Feature Gate (AF-011 §5) before anything is built.
- **Technical Design** places the feature in the AF-001 architecture: owning system, events published/consumed, data tables, pools, budgets.
- **Implementation Prompt** is the AF module (or module section) authorising the build.
- **Visual Design Board / Asset Sheet** follow AF-002–AF-008 laws and the AF-006 pipeline; for pure-code features these stages produce the debug/UI presentation spec instead of art.
- **Prototype** is playable/runnable and instrumented (debug overlay hooks in from birth).
- **Internal QA → Performance → Accessibility → Balance** run the standing obligations accumulated from AF-003 §12, AF-004 §12, AF-008 §12, AF-011 §10 plus this module's testing matrix (§5).
- **Final Approval** is the Project Owner's (or their delegated review's) sign-off; **Module Lock** per §8.

Current-phase note: during the specification phase (AF-000 onward, pre-first-code), modules that produce *frameworks* complete the documentation-applicable stages now and bind their build-applicable stages onto the first implementing module — recorded per module, never silently skipped.

## 2. Module structure (the template for every future AF module)

Every AF module record contains: **Objective · Design Philosophy · System Architecture · Implementation Rules · Performance Rules · Accessibility Rules · Debug Requirements · Output Requirements · Self Review Loop · Quality Score (≥9.5/10) · Module Status · Lock Status.** The cataloguing format in use since AF-000 (verbatim module + status/lock headers + alignment review + recorded self-review) is hereby the formal template. A module missing any section is incomplete by definition.

## 3. Version control workflow

Mapped to the project's real git model (consistent with AF-006 §4):

**Feature branch** (one per module/feature) → **Internal review** (code review §6 + design review §7 on the branch) → **QA approval** (CI green: tests, validators, budgets) → merge to **development mainline** → **Release branch** at milestones → **Production** (deploy = GitHub Pages build per the technology decision) → **Locked module** (annotated git tag `af-XXX-vN` archiving the approved version + docs).

Every approved version is archived by tag; locked module documentation is never edited except under owner-authorised amendment (which itself gets a new tag). *(Current phase: the designated session branch serves as the feature branch; tags begin at first code module.)*

## 4. Quality gates (eleven production gates)

AF-011 §6's seven design gates remain the feature-level core; production adds four. Full sequence, each with its owning framework:

**Gameplay** (AF-011) · **Visual** (AF-002/AF-008) · **Audio** (Constitution audio philosophy; audio module to come) · **Performance** (AF-001 §10 budgets) · **Accessibility** (Constitution set + all module extensions) · **UX** (AF-003/AF-005) · **Lore** (AF-010 canon review) · **Technical Stability** (no crashes, graceful failure per AF-001 §9) · **Memory Usage** (AF-006 §9 budgets, zero steady-state allocation) · **Documentation** (§6 docs complete) · **Regression** (full test suite green, saves migrate).

Gates are pass/fail. A failed gate returns the feature — "ship now, fix later" does not exist in this project.

## 5. Testing matrix (stack-native)

| Requirement | Realisation |
|---|---|
| Unit testing | Vitest — pure logic in `core`/`game` (deterministic by architecture) |
| Integration testing | Vitest — systems wired through the real Event Bus |
| Gameplay testing | Headless sim runs (AF-001 §10 determinism) + scripted play sessions |
| Stress testing | Headless sim at peak entity density; the AF-004 §1 degradation model verified here |
| Performance testing | Frame budgets on real targets (desktop + mid-range mobile), perf HUD numbers recorded |
| Regression testing | Full suite in CI on every merge; golden-run comparisons via deterministic sim |
| Accessibility testing | Every mode + combination smoke-tested; contrast validator (AF-008 §10) |
| Platform testing | Playwright matrix (Chromium now; wraps later); touch/gamepad input paths |
| Save compatibility | Round-trip + migration-chain tests for every slice version bump (AF-001 §8) |
| Future expansion testing | Extension-point tests: add a dummy content record end-to-end without touching code |

Tests land in the same commit as the feature — a feature without its tests fails the Documentation and Regression gates automatically.

## 6. Code review checklist

Every implementation reviewed for: **Readability · Maintainability · Naming** (AF-001 §5 full-words law) **· Architecture** (layer rules, event-only communication) **· Performance · Memory allocation** (no per-frame allocation in hot paths) **· Reuse** (no duplicated logic; library components only, AF-005) **· Documentation** (per-system README current — Purpose, Responsibilities, Dependencies, Events, Data Structures, Extension Points, + Known Limitations, Testing Results, Version/Review History per AF-012) **· Security** (save validation, no trust in client data across future net boundaries, AF-001 §11).

## 7. Design & content review

**Design review** (every gameplay feature): Fun · Replayability · Clarity · Balance · Visual identity · Audio identity · Player motivation · Long-term value — this is the Unified Feature Gate (AF-011 §5) plus the §9 instruments, run against the *built* feature rather than the concept.

**Content approval** (every asset): Afterlight identity · Readability · Naming · Organisation · Performance · Accessibility · Reuse · Consistency — this is AF-006 §10's six validations plus AF-002 §13 brand review, unchanged, referenced here as the asset half of the same governance.

## 8. Module locking & release readiness

**Locking:** assign version → archive documentation (git tag + STATUS registry entry) → set Lock Status. Locked modules are extended, never overwritten; unlocking requires explicit Project Owner approval, and every authorised amendment is recorded in place (the palette extension, rarity supersession, and display-face amendment are the precedents and the format).

**Release readiness (before any public build):** no critical bugs · no save corruption (migration chain green) · no broken progression · no missing assets (validator clean) · no blocking performance issues (budgets met on floor hardware) · no accessibility regressions (mode matrix green) · no canon conflicts (ledger review clean). Any failure blocks release — including a PWA update, which is a release.

## 9. Status registry (living instrument)

`docs/modules/STATUS.md` records for every AF module: version · pipeline stage · review status · QA status · performance status · regression status · approval status · lock status. Updated in the same commit as any status change; the future build-info debug panel reads its data from the same source. The registry is the single place to see the whole project's production state at a glance.

## 10. Standing obligations

Per AF-012's self-review loop — at every module completion and every milestone: re-verify the pipeline was followed stage-by-stage; audit gate results and documentation completeness; check testing coverage against §5; prune any workflow step that added ceremony without quality (workflow is also subject to the no-purposeless-existence law); confirm the same repeatable process still carries a feature from concept to production unchanged. The process serves the game, never the reverse.

---

## Internal review loop (AF-012, recorded)

- **Pipeline** — twelve stages reconciled with the Constitution's eleven (pure extension); spec-phase vs build-phase stage applicability made explicit so nothing is silently skipped during the current documentation phase. ✔
- **Gates** — eleven production gates containing AF-011's seven design gates; every gate has an owning framework; pass/fail with no deferral culture. ✔
- **Testing** — all ten required kinds mapped to concrete stack-native mechanisms, including expansion testing as an executable check; tests-with-feature rule closes the coverage hole. ✔
- **Version control** — real git workflow with tag-based archival of locked versions; amendment precedents formalised as the unlock procedure. ✔
- **Module consistency** — the de-facto cataloguing format promoted to the formal template; STATUS registry gives one-glance project state. ✔
- **Repeatability** — one process for frameworks, systems, and content alike, with the only variation (spec vs build stages) explicitly ruled. ✔
- **Simplification pass** — rejected a separate "hotfix pipeline" (a hotfix is the same pipeline at smaller scope); rejected per-stage sign-off documents (the module record + STATUS row carry it); folded "archive documentation" into git tags rather than a parallel archive system. ✔

**Internal quality score: 9.5/10 — approved; this lifecycle binds every future AF module.**
