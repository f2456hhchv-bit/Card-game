# AFTERLIGHT — Game Design Pillar Framework (The Creative Compass)

**Authority:** Produced output of AF-011. Extends AF-000 → AF-010 and the Master Constitution. Every future design decision is evaluated through this framework; it is extended, never replaced.
**Binding rule of the whole document:** the player always feels *"I survived because of my decisions"* — never *"I survived because the game was generous."* Any feature that shifts credit from the player to the game fails.

---

## 1. Core vision

Afterlight is a premium top-down space roguelite built on: **skill · discovery · replayability · build experimentation · meaningful progression.** Generosity is not a design tool — fairness is. The game may be kind in structure (fair telegraphs, honest information, meaningful failure) but never kind in outcome (no pity wins, no invisible hands on the scales).

## 2. The pillars (how ten become five-plus-gates)

The Constitution's ten pillars remain permanent. AF-011 organises them operationally:

**Design by the five primary pillars** — every feature is *shaped* by these:

1. **Gameplay First** — every decision improves gameplay; realism never wins over play.
2. **Readability** — every object communicates; danger is instantly understood (AF-004 enforces).
3. **Meaningful Choice** — every decision changes gameplay; no fake choices, no filler upgrades. A choice whose options are interchangeable is a defect.
4. **Replayability** — every run differs: builds, events, discoveries.
5. **Mastery** — improvement through knowledge, not memorisation, not grinding.

**Pass the remaining five as gates** — every feature is *checked* against these (§6): Player Respect, Accessibility, Performance, Scalability, Maintainability.

## 3. The player journey

**Curiosity → Exploration → Discovery → Experimentation → Mastery → Optimisation → Legendary Moments.** Every system should be locatable on this arc, and the arc repeats at every scale — within a run, within a sector, within the whole game. Every run contributes to long-term progression (failure included, §4). A feature that serves no stage of the journey serves no one.

## 4. The philosophies (operational rules)

**Difficulty** — fair, consistent, understandable. Banned: cheap deaths, hidden information, unavoidable damage, **artificial health inflation** (difficulty comes from new demands on skill and knowledge, not bigger numbers on the same enemy). The player can always identify why they failed (AF-004 narratable-hit law, extended to whole-run post-mortems).

**Reward** — a full spectrum in every session: small victories regularly, medium victories often, major victories memorably, legendary discoveries rarely — but *always possible* (no legendary content locked behind anything except play).

**Progression** — flows through skill, knowledge, research, crafting, collections, mastery, discovery. Never through repetitive grinding alone: if the optimal path is repetition without decisions, the design has failed and gets rebuilt.

**Build diversity (quantified canon)** — no mandatory weapon, Commander, ship, relic, or strategy. **Thousands of combinations remain competitive.** Balance modules inherit this as their acceptance test: a dominant mandatory pick is a balance bug of the highest severity.

**Failure** — losing a run always pays: knowledge, research progress, collections, statistics, experience. Players lose the run, never the motivation. The post-run screen is a harvest, not a funeral.

**Content** — quality over quantity (Constitution). Every weapon has purpose, every boss is memorable, every biome has identity, every discovery teaches. Repetitive content is removed, not diluted.

**Long-term engagement** — players stay because new builds emerge, discoveries appear, mastery deepens, collections expand, the galaxy evolves. Artificial retention (dailies, FOMO, streaks) is constitutionally banned and stays banned.

## 5. The Unified Feature Gate (one checklist, all sources)

The project's evaluation questions — Constitution Design Decision Matrix, Afterlight Test, AF-004 readability questions, AF-010 canon questions, AF-011 decision framework — merged into **one canonical gate**. Sources stay locked and authoritative; this is the single operational instrument every future module runs. Any "No" → redesign or reject.

**A. Play** — Is it fun? · Does it create meaningful decisions? · Does it reward mastery? · Does it create memorable moments? · Would players miss it if removed? / would removing it make the game worse?
**B. Clarity** — Is it readable? · Can players identify it instantly? · Does it remain visible during intense combat? · Does it follow the visual language?
**C. Longevity** — Does it improve replayability? · Can it scale indefinitely? · Does it integrate naturally / respect existing systems? · Does it avoid duplicating an existing feature?
**D. World** — Does it fit the universe? · Does it respect established science? · Does it strengthen the mystery? · Does it create future storytelling opportunities? · Does it align with the themes?
**E. Respect** — Does it respect player time? · Does it remain performant? · Does it remain accessible in every mode?

## 6. Quality gates (the seven-gate release check)

Passed the Feature Gate at concept; every *implementation* then passes, in order: **Gameplay Quality → Technical Quality → Visual Quality → Accessibility → Performance → Replayability → Lore Consistency.** Each gate maps to an owning framework (AF-011/AF-004 · AF-001/AF-006 · AF-002/AF-008 · Constitution accessibility set · AF-001 §10 budgets · AF-011 §4 · AF-010 canon review). Any failure returns the feature for redesign — gates are pass/fail, never "ship now, fix later" (the Constitution's pipeline permits no skipped stages).

## 7. Design-for-iteration

Game design must support fast iteration and modular balancing — which the architecture already guarantees structurally: all balance in data tables (AF-001 §6), deterministic headless sim for automated balance runs (AF-001 §10/§11), event-driven systems that can be added/removed independently. The design-side law this adds: **every mechanic ships with its tuning surface exposed in data** — a mechanic whose feel can only be changed by editing code fails Technical Quality.

## 8. Monetisation principles

Premium game. Player ownership respected. No pay-to-win; no purchasable gameplay advantage of any kind; the offline game is permanently complete (Constitution + technology decision). **Cosmetics:** "cosmetics remain optional" is recorded as *permitted in principle, not planned* — any actual cosmetic monetisation is a future Project Owner decision, and would itself have to pass the Feature Gate (notably player-respect and offline-complete). Nothing in the current design assumes a store exists.

## 9. Design debug & review instruments

At module QA (now, as scored review instruments; later, as dashboard tooling over the data tables): **design validation** (Feature Gate + seven gates, recorded per feature) · **replayability score** (how many distinct build/decision paths touch this feature) · **complexity rating** (rules a player must learn vs. depth returned — flag high-complexity/low-depth) · **feature dependencies** (which systems it touches — event and data references, auditable from AF-001's registries) · **performance impact** (budget deltas) · **quality gate status** (per-gate pass/fail history). These six lines appear in every future module's QA sheet.

## 10. Standing review obligations (bind every future design decision)

Per AF-011's self-review loop — at every content/system module's QA stage and every playable milestone: run every new mechanic, progression system, boss, Commander, ship, weapon, biome, reward, and failure state through the Unified Feature Gate; challenge each with *"does this genuinely improve the player's experience?"*; remove unnecessary complexity; strengthen meaningful decisions; verify the five pillars are reinforced, never weakened. Repeat until every design decision serves the long-term vision.

---

## Internal review loop (AF-011, recorded)

- **Pillar reconciliation** — Constitution's ten preserved intact; organised into five design-by pillars + five check-against gates; no pillar demoted or weakened. ✔
- **Checklist unification** — five overlapping checklists merged into one gate with every unique question preserved and source-attributed; duplication eliminated without touching locked sources. ✔
- **Operational sharpness** — vague virtues converted to testable rules: interchangeable options = defect; optimal-path-is-repetition = failed design; dominant pick = highest-severity balance bug; code-only tuning = gate failure. ✔
- **Failure/reward** — post-run harvest framing; legendary always possible; generosity-in-structure vs generosity-in-outcome distinction guards the core vision. ✔
- **Monetisation** — cosmetics clarified as permitted-not-planned, owner-gated; no store assumed anywhere in the design. ✔
- **Simplification pass** — rejected a numeric "fun score" (false precision; the gate's qualitative questions with recorded answers beat a fake metric); rejected adding an eighth quality gate for "balance" (lives inside Gameplay Quality + §4's acceptance tests). ✔

**Internal quality score: 9.5/10 — approved; the Unified Feature Gate and §10 obligations bind all future modules.**
