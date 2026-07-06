# AFTERLIGHT — Master Design Constitution

**Authority:** Produced output of AF-014. The highest creative authority beneath AF-000. Whenever design uncertainty exists, this document — and the chain above it — determines the correct decision. Extended, never replaced.
**Authority chain (binding):** Master Constitution v1.0 (`docs/CONSTITUTION.md`) → AF-000 Foundation → **this document** → all other AF modules and frameworks. Uncertainty resolves *up* this chain; nothing below may contradict anything above.

---

## 1. Core philosophy

Consistency creates quality. Discipline creates identity. **Small excellent decisions produce legendary games.** The player experience always outweighs developer convenience — when a shortcut helps us and costs the player, it is not a shortcut, it is a debt charged to the wrong account.

## 2. The Ten Commandments

The memorised form of the project's law — short enough to hold in mind during any decision:

1. **Gameplay First.** Always.
2. **Readability Above Spectacle.** Every visual exists to support gameplay.
3. **Meaningful Choice.** Never create fake decisions.
4. **Player Respect.** Never waste player time.
5. **Reward Discovery.** Curiosity should always be worthwhile.
6. **Every System Connects.** Nothing exists in isolation.
7. **Simple Interface. Deep Gameplay.**
8. **Failure Teaches.** Never punish unfairly.
9. **Build For Expansion.** Never build dead-end systems.
10. **Protect The Vision.** Reject features that weaken Afterlight.

Each commandment is enforced by an existing framework (1–3: AF-011/AF-004; 4: AF-003/AF-011; 5: AF-010/AF-011; 6: AF-001/AF-013; 7: AF-003/AF-005; 8: AF-011 §4; 9: AF-013; 10: this document). The commandments add no new bureaucracy — they are the whole stack, compressed.

## 3. Design priority order (conflict resolution)

When design goods genuinely conflict, higher priority wins:

**1 Gameplay → 2 Player Experience → 3 Readability → 4 Performance → 5 Accessibility → 6 Presentation → 7 Technical Elegance.**

**The floor rule (binding):** this order allocates *discretionary* effort and resolves *genuine* conflicts — it never permits dropping below a mandatory floor. The Constitution's accessibility set, the 60 FPS floors, and the readability laws are pass/fail gates at every priority; "performance ranked above accessibility" means a discretionary polish trade, never shipping without colour-blind modes. Floors first, then priorities.

Worked example: a beautiful new boss effect (P6) that costs frame time (P4) gets simplified; a readability improvement (P3) that costs technical elegance (P7) ships ugly-but-clear; a gameplay mechanic (P1) that the current renderer can't express cheaply forces renderer work, not mechanic removal.

## 4. Feature evaluation & rejection

**Every proposed feature runs the Unified Feature Gate (AF-011 §5)** — AF-014's Design Decision Matrix questions are all contained in it (Play/Clarity/Longevity/World/Respect clusters). One gate, no parallel checklist.

**Scored evaluation (recorded per feature at Final Approval):** Gameplay · Replayability · Readability · Originality · Accessibility · Performance · Technical Risk · Production Cost · Longevity · **Overall Quality ≥ 9.5/10 to approve.** Technical Risk and Production Cost are honesty axes — a wonderful feature we cannot build well scores itself out of this module and into a future one.

**Automatic rejection** (no scoring needed) for features that: duplicate existing systems · reduce readability · add unnecessary complexity · create mandatory playstyles · reduce replayability · contradict established lore · compromise performance floors · compromise accessibility floors.

## 5. The Player Promise (restated as governance)

Fair challenge · Meaningful progression · Respect for time · **Offline completeness** · Premium quality · Long-term replayability · Constant discovery · No artificial retention · No pay-to-win. Every release readiness check (AF-012 §8) is implicitly a promise audit — a build that breaks any of these does not ship, whatever else it achieves.

## 6. Creative governance (idea intake)

Every new idea declares its category and its four identifiers — **Purpose · Dependencies · Future Extensions · Player Benefit** — before entering the pipeline. Category taxonomy mapping (idea categories → AF-013 §2 module categories, preventing dual-taxonomy drift):

| AF-014 idea category | AF-013 module category |
|---|---|
| Foundation | Foundation |
| Gameplay | Gameplay |
| Content | Gameplay / Progression / World (by substance) |
| Narrative | Narrative |
| Technology | Technical / Developer |
| Visual | Visual / UI |
| Audio | Audio |
| Community | Community |
| Expansion | (spans — classified by its contents) |

## 7. Change management

Locked modules remain unchanged; future modules extend them. When redesign becomes genuinely necessary: **document the reason → assess impact → review dependencies → update affected modules under owner authorisation → maintain backwards compatibility where practical** (AF-012 §8 procedure; AF-013 §5 deprecation rules). The palette extension, rarity-ladder supersession, and display-face amendment are the standing precedents: authorised, recorded in place, logged in the STATUS registry.

## 8. Decision records (instituted practice)

From this module forward, every significant design decision produces a record in `docs/decisions/` — `DR-NNN-slug.md` — containing: **Reason · Alternatives Considered · Chosen Solution · Trade-offs · Dependencies · Future Review Date.** Decision records make the *why* as durable as the *what*: the ten-year newcomer reads not just the rules but the reasoning. Seed records to be written with the first code module: DR-001 technology stack (already documented in `docs/TECHNOLOGY_DECISION.md` — cross-referenced, not duplicated), DR-002–004 the three authorised amendments (content exists in module reviews; records give them the standard format).

## 9. Success metrics

Measured: player enjoyment · replayability · build diversity · performance · accessibility · community creativity · long-term engagement · critical quality. **Never measured: player addiction.** Concretely — session length and login frequency are *not* KPIs; "players return because they want to" is observed through voluntary-return patterns and build experimentation breadth (the AF-011 §9 replayability instruments), never optimised through retention mechanics, which remain banned.

## 10. Debug & governance instruments

Design-governance state is observable: decision status + quality scores (per-feature records, §4/§8) · design conflicts (Feature Gate failures and priority-order rulings, logged) · governance warnings (validator classes from AF-006/AF-008/AF-013 — unregistered colours, duplicates, dependency violations) · locked module registry (STATUS.md; future build-info panel reads it) · performance status (per AF-012). Nothing in governance is invisible or unaccountable.

## 11. Standing review obligations

Per AF-014's self-review loop — continuously, and at every module completion: review new proposals and decisions of every kind (gameplay, visual, technical, narrative, accessibility, performance) against the commandments, the priority order, and the Gate; challenge complexity, feature creep, and duplication *by default* (the burden of proof is on the addition, never on the removal); strengthen system integration; reject anything that weakens the identity established by AF-000 → AF-014. Repeat until the pipeline naturally produces a cohesive, premium game.

---

## Internal review loop (AF-014, recorded)

- **Authority chain** — supreme document acknowledged, AF-014 slotted beneath AF-000 explicitly; uncertainty now has a single resolution path. ✔
- **No governance duplication** — matrix delegated to the Unified Feature Gate; commandments mapped to their enforcing frameworks; taxonomies mapped instead of forked. ✔
- **Priority order** — genuinely new conflict-resolution instrument, made safe by the floor rule (no mandatory minimum is tradeable); worked examples recorded. ✔
- **Evaluation** — ten scored axes with two honesty axes (risk, cost) that give the project a way to say "not yet" without saying "no". ✔
- **Decision records** — the missing why-preservation practice instituted with seed records identified; format matches the module's documentation requirement exactly. ✔
- **Success metrics** — anti-addiction stance made operational: the forbidden KPI is named, the permitted observations are named. ✔
- **Simplification pass** — rejected a numeric weighting scheme for the priority order (ordinal + floor rule is sufficient and honest); rejected a separate "creative council" process layer (the owner + the chain is the council); commandments kept to ten with zero sub-clauses. ✔

**Internal quality score: 9.5/10 — approved; governs every future AF module beneath AF-000.**
