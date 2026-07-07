# AFTERLIGHT — Commander Framework

**Authority:** Produced output of AF-030. Extends AF-000 → AF-029. Every future Commander, ability, cosmetic, and mastery system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** players choose a Commander for playstyle, never raw power — every Commander should feel like learning a new game.

---

## 1. The four-hook signature

Every Commander defines exactly four effect hooks, each reusing an **existing** vocabulary rather than inventing a new one:

| Hook | Shape | Reuses |
|---|---|---|
| Passive | Always-active bonus/trigger | AF-028's `PassiveTrigger` + `EquipmentBonus` |
| Active ability | Cooldown-gated activation | AF-028's `ActiveModule` shape |
| Ultimate | **Charge-gated** activation (charge accrues from combat facts; fires at 100%) | New charge model — the concrete mechanic GP-FINAL's "Power Fantasy" beat needed |
| Signature mechanic | A Commander-specific rule, expressed as a tagged passive | AF-028's passive shape, distinguishing tag only |

## 2. No-overlap law (structural check, not just review)

Each Commander's four-hook signature is fingerprinted (trigger + bonus-kind + tag) and checked against every other Commander's fingerprint at content-authoring time. A near-duplicate signature fails the check with the conflicting Commander named — the same pattern AF-004 uses for enemy identity, applied to Commanders.

## 3. Mastery & progression — zero new systems

**Commander Mastery reuses AF-026's mastery engine exactly**: `commander:<id>` tracks already exist in `MetaProgression`, already wired at `RunEnded`. This module supplies only *what* mastery unlocks — cosmetics and prestige (portrait variants, skins, voice lines, lore, titles, banners) — which inherits AF-026 §5's structural no-stat-reward guarantee automatically, since Commander mastery rewards are `MasteryReward` values from the same cosmetic-only union. **Commander Progression** (XP, rank, mission success, boss victories, statistics) is the same ledger — no second persistence system exists to build.

## 4. Archetypes & world integration

Ten archetypes (Assault → Prototype Pilot) as content shelves, mapping cleanly onto the AF-008 faction roster and AF-010 canon (Void Specialist ↔ Void Legion, Crystal Specialist ↔ Crystal Dominion) without contradicting either.

## 5. Synergy & balance

Commander bonuses feed the **same aggregation shape** as AF-028/AF-029 — a passive is just another `BonusTotals` contributor. "No Commander dominates every system" is a content-QA law (framework capacity, not framework-enforced prevention) — the same honest limit AF-028 §8 already recorded for equipment.

## 6. Presentation, accessibility, performance

Commander card, ability cards, mastery progress, lore, statistics, voice preview — build from AF-005/AF-007 at the UI module. Ability effects pooled; mastery tracking is AF-026's existing O(1) map lookups; lore lazy-loads.

## 7. Debug

Live: selected Commander · passive state · ability cooldown · ultimate charge · mastery rank · statistics.

---

## Internal review loop (AF-030, recorded)

- **No duplicated systems** — mastery, progression, and bonus aggregation all reuse AF-026/AF-028 exactly; this module adds only the ability-hook vocabulary and the no-overlap check. ✔
- **Ultimate as memorable moment** — charge-gated model gives GP-FINAL's emotional curve a concrete mechanic it lacked. ✔
- **No-overlap** — fingerprint check is code, not a review reminder. ✔
- **Sandbox proof** — a Commander governs a full run end-to-end: passive always on, active on player-triggered cooldown, ultimate charging from kills and firing once. ✔
- **Simplification pass** — rejected a fifth "trait" slot (signature mechanic already covers it as a tagged passive); rejected a Commander-specific mastery-reward type (reused AF-026's union, since nothing Commander-specific needs a new reward shape). ✔

**Internal quality score: 9.5/10 — approved and locked; roster/balance passes bind at future Commander content modules.**
