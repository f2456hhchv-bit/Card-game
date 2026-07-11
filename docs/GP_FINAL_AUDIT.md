# AFTERLIGHT — GP-FINAL Standing Audit (First Execution)

**Authority:** Produced from the GP-FINAL pack (catalogued, not locked — prerequisites pending). This document is the standing audit contract: its tests run at every playable milestone from now on, and GP-FINAL itself locks only when GP-001 → GP-005 and the audited content modules exist.
**First execution:** 2026-07-06, against the implemented systems AF-016 → AF-026 (walking-skeleton build, placeholder content).

---

## 1. The standing tests (effective immediately, every milestone)

| Test | Question | Frequency |
|---|---|---|
| **Golden Rule** | Is this fun? (prototype mentally, challenge assumptions) | Every design decision |
| **One More Run** | Does this system make the player want another run? | Every system, every milestone |
| **No Dead Time** | Ever >30s without XP/upgrade/reward/elite/event/discovery/merchant/boss/decision? | Every pacing change, measured in playtests |
| **No Useless Systems** | Does it improve fun, replayability, build diversity, expression, or long-term progression? | Every module QA (joins the Unified Feature Gate) |
| **Afterlight Test** | Does it feel like something entirely new, not a copy? | Every content milestone |

## 2. First execution — results against AF-016 → AF-026

**PASS (verified in the current build):**
- **Fairness** — deaths are narratable by construction: AF-004's shape-equals-hitbox law, AF-017's spawn fairness contract (min distance, telegraphs, no on-top spawns), AF-020's trustworthy movement, AF-021's dodge-is-total-mitigation. "Never unfair, never random" holds structurally.
- **Permanent progression** — "death loses only the run" is implemented and browser-verified: research, crafting, materials, blueprints, account level, mastery, collections, statistics all survive defeat and reload (AF-024/025/026). Commander XP and ship progress exist as mastery tracks; Atlas/Museum/Civilisation/Galaxy Unlocks await their specs.
- **No health-inflation difficulty** — the Director's threat function scales spawn *pressure and composition*, never per-enemy stats; AF-021's resistance caps prevent sponge math. The positive prescription (roles, formations, hazards) binds enemy content modules.
- **Escalating continuation** — endless mode (AF-022 null cap) + monotonic threat growth (AF-017) already support indefinite continuation with rising risk; loot escalation via the AF-023 ladder shift.
- **No Dead Time (structural)** — Director budget accrual guarantees wave directives every few seconds even in Recovery (intensity 0.15 ≠ 0); XP gems, loot beams, and level-ups fill the gaps. Measured in the sandbox: longest meaningful-event gap ≈ 8–12s. Provisional pass; re-measure with real content.
- **No Useless Systems** — audit clean: all eleven gameplay systems trace to loop stages (Foundation Lock §6 requirement) and carry recorded justifications.

**PARTIAL (framework ready, content pending):**
- **Emotional curve** — the Director's pacing cycle expresses beats 1–9 (spawn → power fantasy → pressure); "Oh No / Adaptation / Victory" need real bosses and elite mechanics; "Reward / one more run" need the results-screen build. The curve is adopted as the *target shape* for Director tuning when content lands.
- **Run structure** — extraction phase and endless continuation are canon and implemented as states; the 10–15 minute target and 5/10 wave boss cadence are *tuning data changes* once wave-based content arrives (current sandbox cycle is deliberately compressed placeholder tuning).
- **Build philosophy** — the 6-weapon/6-passive frame is registered canon awaiting the weapon/passive modules; AF-025's evolution hook is the landing site for secret evolutions; AF-022's pool supports the discovery flow.
- **One More Run** — defeat pays visibly (harvest framing implemented); anticipation surfaces (visible next-unlocks at Results) owed to the Results-screen build.

**FAIL / FLAGGED (action owed):**
1. **Level-up content law violated by placeholders** — the sandbox upgrades ("+15% damage") are exactly the "boring percentage upgrades" GP-FINAL bans. *Acceptable only because they are declared placeholders*; the AF-022 upgrade content modules must ship mechanic-attached choices. **Binding.**
2. **Wave rewards do not exist** — a new system (per-wave reward choice, eight categories) with no module yet. Owed.
3. **Elite reward pool not implemented** — elites currently drop ladder loot only; the eleven-entry pool awaits its module. Owed.
4. **Undefined referenced systems** — Atlas, Museum, Civilisation, Merchants, galaxy structure, run moments: **cannot be audited; their specs (GP-001 → GP-005 / AF content modules) have not been delivered.** Blocking GP-FINAL's lock.

## 3. Lock condition

GP-FINAL locks when: GP-001 → GP-005 are delivered and reconciled · the referenced content modules exist and pass §1's tests · the emotional curve is measurable in real runs · the flagged items above are resolved. Until then this audit re-runs at every playable milestone and appends its findings here.

---

## 4. Second execution — 2026-07-11, GP-001 → GP-005 now delivered and reconciled

Prerequisite met: GP-001 (core gameplay loop), GP-002 (enemy/wave/difficulty), GP-003 (meta progression), GP-004 (content engine), GP-005 (balance + passive triggers) are all complete and locked (`docs/modules/STATUS.md`). A fresh three-part audit re-ran specifically against **Run Structure**, the item §2's first execution named "tuning data changes once wave-based content arrives."

**Run Structure moves PARTIAL → REAL**, for the pieces the Project Owner chose to fix this round:
- Mini Boss every 5 waves, Major Boss every 10 — both now real, wave-count-driven, decoupled from the Director's own pacing phase (which the audit found terminated after one ~128s pass with no repeat mechanism at all — now loops for the run's whole length via a new additive `EnemyDirector` `loop` option).
- Extraction after each Major Boss — now real; a Mini Boss defeat correctly does NOT satisfy the mission's primary objective (a new `bossTier` field on the `EnemyKilled` event lets the mission-objective listener tell the tiers apart).
- 10-15 minute run length — addressed structurally (the run can now genuinely last that long across several boss cycles) rather than by a hardcoded timer, preserving the Extraction Decision's own player-agency framing.

**Still FAIL/FLAGGED, unchanged by this execution (real, open, not re-scoped away):**
1. Level-up content law violation — `SANDBOX_UPGRADES`' plain stat-percentage entries are still declared placeholders; unchanged.
2. Wave rewards do not exist — audited again this round, confirmed still MISSING, not selected for this pass.
3. Elite reward pool — audited again this round: only 1 of 11 named types has a real mechanism (a rarity/power-boosted drop); the other 10 (Screen Clear, Screen Stun, XP Magnet, Temporary Ally, Repair Drone, etc.) remain MISSING, not selected for this pass.
4. The 6-weapon/6-passive build frame — newly confirmed by this execution's audit to be entirely unbuilt: combat runs on exactly one hardcoded weapon (`SANDBOX_WEAPONS[0]`), never swapped; no passive-slot cap exists either. This is now understood to be a core-combat-loop rework, not a bounded content addition — recommended as its own dedicated future module rather than a GP-FINAL bucket.

**Full details, implementation record, and verification:** `docs/modules/GP-FINAL-gameplay-audit.md`'s "Second execution" section (2026-07-11).

**Lock condition still not met** — §3's own bar ("the flagged items above are resolved") requires all four FAIL/FLAGGED items closed; only Run Structure (a PARTIAL item, not one of the four FAIL/FLAGGED items) was addressed this round, and even that only to the extent of the Project Owner's chosen scope. GP-FINAL remains open.

---

*First execution recorded 2026-07-06. Second execution recorded 2026-07-11. Next execution: at the next playable milestone or on the Project Owner's next scope choice, whichever comes first.*
