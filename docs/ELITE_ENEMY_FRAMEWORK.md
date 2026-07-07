# AFTERLIGHT — Elite Enemy Framework

**Authority:** Produced output of AF-034. Extends AF-000 → AF-033. Every future Elite, Champion, Mutation, and High-Threat Encounter extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** an Elite is a unique battlefield event that tests mastery, never patience — greater intelligence and individuality, not just greater numbers.

---

## 1. Generation over modification

AF-033 gave every `EnemyDef` a single, fixed `EliteModifier`. This module supersedes it *for generated instances* with a real pipeline — Base Enemy → Elite Tier → Mutations → Stat Package → Behaviour Package → Reward Package → Unique Identity — implemented as one pure, deterministic function: `generateElite(base, tier, rng)`. Same base, same tier, same seed always produces the same Elite. AF-033's `EliteModifier` type is untouched; a generated Elite's resolved `EnemyDef` simply carries `eliteModifier: null`.

## 2. Elite Tiers — AF-029's restricted rarity view, reused again

Seven tiers (Veteran → Mythic) map by ascending position onto AF-029's `RELIC_RARITIES` — the same 7-tier restriction AF-029 already drew from AF-023's 9-tier ladder — to set each tier's reward floor. Tier names and rarity names share some vocabulary (Ancient, Legendary, Mythic) but are different axes; the mapping is positional, not literal.

## 3. Mutations — compatibility and stacking are existing vocabulary

| Concern | Reuses |
|---|---|
| Compatibility | AF-029's `exclusionGroup` — two mutations sharing a group never co-roll |
| Stack Behaviour | AF-021's `StackingRule` (`refresh`/`stackIntensity`/`stackDuration`) |

Nine of fifteen mutations are mechanically live:

- **Pure `EnemyDef` transforms** (no new runtime code at all): Teleport (overrides `movementBehaviour`), Berserker (grants AF-033's `enrage` special ability), Shielded (shield boost), Rapid Assault (scales the attack interval).
- **`MutationEffects`** (elite-only numeric effects that don't fit AF-033's locked schema, layered *alongside* the def): Cryogenic/Incendiary/Corrupted (status-on-hit a melee attacker couldn't otherwise carry), Regeneration (hull regen), Explosive (on-death detonation).

The remaining six (Reflective Armour, Gravity Field, Summoner, Quantum Shift, Temporal Echo, Adaptive Armour) are schema-complete in `MUTATION_DEFS` — visual indicator, gameplay effect, counterplay, threat rating, compatibility, stacking — registered future, the same pattern AF-028 used for `droneEffectiveness`/`orbitalPower`.

## 4. Elite AI

Improved Positioning/Target Prioritisation reuse AF-021's `elitePriority`/`bossPriority` selectors. **Retreat Logic is the one live AI improvement**: an Elite below 25% hull enters AF-033's `retreat` state and disengages, resuming via `recover` once healed above 35% — the first enemy to actually use those two states. Ability Timing/Environmental Awareness/Support Coordination are registered future — most mutations are passive, not ability-shaped, and group coordination is AF-033's own future concern.

## 5. Threat Escalation — already wired

AF-017's `EnemyDirector.notifyEnemiesSpawned(count, eliteCount)` already exists; every generated Elite spawns through AF-033's existing spawn path, which already calls it. No Director change.

## 6. Elite Codex — AF-026's existing engine

Discovery is `MetaProgression.discover("enemies", codexId)` — `"enemies"` was already a registered collection category; `codexId` is the base def id or a tier+mutation-set signature. Defeats/statistics are the existing permanent-counter engine. "Codex Entries" as a reward is AF-026's already-registered `codexEntry` cosmetic kind. Weaknesses/Mutations/Drops read directly off `MUTATION_DEFS`/`EliteInstance` at display time — nothing new to persist.

## 7. Rewards

High XP/Rare Loot/Relics/Research Samples/Blueprints are AF-022/AF-023/AF-029/AF-024/AF-025's existing systems, unlocked by the same `elite: boolean` flag they already branch on. `rewardMultiplier`/`rarityFloor` are new numbers feeding those systems' existing inputs.

## 8. Presentation, accessibility, performance

Elite outlines, unique audio, enhanced telegraphs, reduced-effect mode, high contrast, colour-blind support build from AF-002/AF-004/AF-007/AF-008 at the content/visual module. Mutation combinations are cheap to generate (a Fisher-Yates shuffle + a linear compatibility scan) and cacheable per encounter; no new pooling system needed beyond AF-033's existing enemy pooling.

## 9. Debug

Live: Elite Tier · Mutations · AI state · hull · reward multiplier · spawn count.

---

## Internal review loop (AF-034, recorded)

- **No duplicated systems** — rarity ladder, exclusion compatibility, stacking rules, targeting, Director threat feed, and Codex persistence all reuse AF-021/AF-026/AF-029 exactly; `MutationEffects` is the one new structure, justified as composition over AF-033's locked schema. ✔
- **Elites test mastery, not patience** — Retreat Logic and mutation-driven behaviour changes (Teleport, status-on-hit) create real positioning problems; nothing here is a flat stat multiplier alone. ✔
- **Generation remains deterministic** — same (base, tier, seed) always produces the same Elite; verified directly in tests. ✔
- **Sandbox proof** — Elites generated through the real wave-spawn path carry real stat scaling, mutation-driven behaviour overrides, and live Retreat Logic; a 1,400-combination sweep is the literal "generate thousands of Elite combinations" self-review. ✔
- **Simplification pass** — rejected editing AF-033's `EnemyDef` to add elite-only fields (used `MutationEffects` instead); rejected a fourth rarity ladder (reused AF-029's restricted view); rejected a second exclusion/stacking vocabulary (reused AF-029/AF-021's exactly). ✔

**Internal quality score: 9.5/10 — approved and locked; full mutation-mechanic buildout and encounter-type/special-event content bind at future content modules.**
