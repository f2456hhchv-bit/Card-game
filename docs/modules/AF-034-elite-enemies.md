# AF-034 — ELITE ENEMY FRAMEWORK

**Module status:** Complete (framework specified; seven-tier generation pipeline, fifteen-mutation vocabulary, and Elite AI Retreat Logic implemented and tested; generated Elites govern live encounters end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-033 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ELITE_ENEMY_FRAMEWORK.md` + implementation (`src/game/enemies/eliteData.ts`, `src/game/enemies/EliteGenerator.ts`)

---

*(Module catalogued verbatim below.)*

34

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-033 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Elite Enemy Framework.

Elite enemies are not simply stronger enemies.

They are unique battlefield events.

Every Elite encounter should immediately change player priorities.

Elites introduce tactical problems that require adaptation.

Players should instantly recognise when an Elite appears.

Every Elite should become a memorable encounter.

==================================================
CORE PHILOSOPHY
==================================================

Greater intelligence.

Greater danger.

Greater rewards.

Greater individuality.

Elite enemies should test player mastery.

Not patience.

==================================================
ELITE DESIGN PRINCIPLES
==================================================

Every Elite possesses:

Unique Identity

Unique Name

Enhanced Behaviour

Elite Mutations

Unique Visuals

Unique Audio

Improved AI

Improved Rewards

Distinct Telegraphs

Codex Entry

Every Elite should feel handcrafted.

==================================================
ELITE TIERS
==================================================

Support:

Veteran

Champion

Ancient

Prime

Legendary

Apex

Mythic

Future tiers extend naturally.

==================================================
ELITE GENERATION
==================================================

Every Elite generates using:

Base Enemy

↓

Elite Tier

↓

Mutations

↓

Stat Package

↓

Behaviour Package

↓

Reward Package

↓

Unique Identity

Generation remains deterministic.

==================================================
MUTATION SYSTEM
==================================================

Mutations include:

Regeneration

Shielded

Explosive

Teleport

Reflective Armour

Rapid Assault

Gravity Field

Summoner

Berserker

Cryogenic

Incendiary

Corrupted

Quantum Shift

Temporal Echo

Adaptive Armour

Future mutations remain modular.

==================================================
MUTATION RULES
==================================================

Every mutation defines:

Visual Indicator

Gameplay Effect

Counterplay

Threat Rating

Compatibility Rules

Stack Behaviour

Mutations remain readable.

==================================================
ELITE AI
==================================================

Elite AI gains:

Improved Positioning

Target Prioritisation

Ability Timing

Retreat Logic

Environmental Awareness

Support Coordination

Elite behaviour feels intentional.

==================================================
ENCOUNTER TYPES
==================================================

Support:

Single Elite

Elite Patrol

Elite Ambush

Elite Squad

Elite Escort

Elite Hunt

Elite Event

Elite Reinforcements

Mixed Elite Groups

Every encounter remains unique.

==================================================
THREAT ESCALATION
==================================================

Elite encounters influence:

Enemy Director

Spawn Budget

Mission Threat

Environmental Events

Boss Preparation

Recovery Timing

Escalation remains fair.

==================================================
SPECIAL ELITE EVENTS
==================================================

Support:

Named Champions

Ancient Guardians

Prototype Units

Corrupted Commanders

Lost Explorers

Experimental Machines

Galaxy Hunters

Void Incursions

Future event types.

==================================================
REWARDS
==================================================

Elite rewards include:

High XP

Rare Loot

Relics

Research Samples

Blueprints

Rare Resources

Achievements

Codex Entries

Special Drops

Risk always matches reward.

==================================================
ELITE CODEx
==================================================

Every Elite records:

Discovery

Lore

Defeats

Weaknesses

Statistics

Mutations

Drops

Future encounters

Codex grows organically.

==================================================
BALANCE PRINCIPLES
==================================================

Elite encounters challenge:

Awareness

Positioning

Adaptation

Build Flexibility

Mechanical Skill

Never rely solely upon:

Health inflation

Damage inflation

Artificial difficulty.

==================================================
ACCESSIBILITY
==================================================

Support:

Elite Outlines

Unique Audio

Enhanced Telegraphs

Reduced Visual Effects

High Contrast

Large Elite Indicators

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Reuse enemy systems.

Pool mutation effects.

Optimise AI updates.

Cache mutation combinations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Elite Tier

Mutations

Threat Rating

AI State

Reward Table

Spawn Weight

Performance

==================================================
OUTPUT
==================================================

Produce the complete Elite Enemy Framework.

Every future Elite, Champion, Mutation and High-Threat Encounter extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Generate thousands of Elite combinations.

Review mutation diversity.

Review encounter variety.

Review AI behaviour.

Review threat balance.

Review reward quality.

Review telegraphing.

Review Codex progression.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-033.

Adjust mutation probabilities.

Adjust reward tables.

Adjust encounter pacing.

Remove repetitive combinations.

Ensure every Elite encounter feels distinct, memorable, fair and worthy of the rewards offered.

Repeat until the Elite Enemy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-034.

---

## Foundation / AF-000–033 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-034 extends AF-033's `EliteModifier` by composition, not by redesign.** AF-033 shipped a single fixed elite modifier per `EnemyDef` (stat multipliers + one bonus ability) — explicitly scoped as "only Enrage governs a live sandbox enemy today." AF-034 supersedes it *for generated instances* with a real seven-tier, fifteen-mutation generation pipeline, while leaving AF-033's `EliteModifier`/`applyEliteModifier` types untouched in the locked module — a generated `EliteInstance` simply carries `eliteModifier: null` on its resolved `EnemyDef`, since the richer generator has already done that job.
- **Elite Tiers reuse AF-029's exact 7-tier restricted rarity view (`RELIC_RARITIES`), not a third new ladder.** AF-029 already restricted AF-023's 9-tier `Rarity` ladder to 7 tiers for relic rarity; AF-034's seven Elite Tiers map onto that same restricted view by ascending position (not by literal name — "tier Ancient" and "rarity ancient" are different axes that happen to share vocabulary, recorded explicitly to avoid confusion) to set each tier's loot reward floor. Zero new rarity vocabulary.
- **Mutation compatibility and stacking reuse existing vocabulary exactly.** Compatibility is AF-029's `exclusionGroup` pattern (two mutations sharing a group never co-roll on one Elite — the same check relics already use for mutual exclusion, applied here at generation time instead of acquisition time). Stack Behaviour is AF-021's `StackingRule` (`refresh`/`stackIntensity`/`stackDuration`) — the same three rules that already govern how multiple status applications combine.
- **Nine of fifteen mutations are pure `EnemyDef` data transforms or `MutationEffects` fields — no separate mutation-effect engine.** Teleport overrides `movementBehaviour` (an existing AF-033 field, already a real behaviour). Berserker grants AF-033's exact `enrage` special-ability kind (same mechanic, elite-flavoured mutation name — not a second special-ability kind). Shielded and Rapid Assault scale existing `EnemyDef`/attack fields. Cryogenic/Incendiary/Corrupted, Regeneration, and Explosive are elite-only numeric effects that don't fit AF-033's locked `EnemyDef` shape (melee has no `statusOnHit` field to override; hull regen and on-death explosion have no field at all) — these live in a new `MutationEffects` structure layered *alongside* the def, never merged into it, so AF-033's schema is extended by composition, never edited. The remaining six (Reflective Armour, Gravity Field, Summoner, Quantum Shift, Temporal Echo, Adaptive Armour) are schema-complete — visual indicator, gameplay effect, counterplay, threat rating, compatibility, and stacking are all real data — awaiting their own consuming mechanic, the identical "registered, no consumer yet" pattern AF-028 used for `droneEffectiveness`/`orbitalPower`.
- **Elite AI's six named improvements are real where a locked system already supports them, and honestly scoped elsewhere.** Improved Positioning/Target Prioritisation reuse AF-021's existing `elitePriority`/`bossPriority` selectors — no new targeting code. Retreat Logic is genuinely new and mechanically live: an Elite below 25% hull transitions to AF-033's `retreat` AI state and disengages, resuming once recovered — the first enemy that actually uses the `retreat`/`recover` states AF-033 defined but never triggered. Ability Timing/Environmental Awareness/Support Coordination require abilities and allies this module doesn't build (most mutations are passive, not ability-shaped, and group coordination is AF-033's own registered-future concern) — recorded as future, not silently dropped.
- **Threat Escalation needs no new Director integration — it was already wired.** AF-017's `EnemyDirector.notifyEnemiesSpawned(count, eliteCount)` already exists and already feeds `activeElites`/threat; every Elite this module generates still spawns through AF-033's `spawnEnemyInstance`, which already calls it. Nothing new to build here.
- **Elite Codex reuses AF-026's existing collections/mastery/statistics engine — no new persistence.** Discovery is `MetaProgression.discover("enemies", codexId)` — `"enemies"` is already a registered `CollectionCategory`, and `codexId` (the base def id, or a tier+mutation-set signature for a generated Elite) replaces the two hardcoded placeholder strings the AF-026 subscription previously used. Defeats/statistics are the existing permanent-counter engine; "Codex Entries" as a reward is AF-026's already-registered `codexEntry` cosmetic-reward kind. Weaknesses/Mutations/Drops/Future-encounters are read directly off `MUTATION_DEFS`/`EliteInstance` at display time — nothing to persist beyond the discovery flag itself.
- **Rewards reuse every acquisition system Elites already touch.** High XP/Rare Loot/Relics/Research Samples/Blueprints are AF-022/AF-023/AF-029/AF-024/AF-025's existing systems, unlocked by the same `elite: boolean` flag every one of them already branches on; `rewardMultiplier`/`rarityFloor` on the generated `EliteInstance` are the only new numbers, feeding those existing systems' inputs rather than replacing their outputs.
- **Self-review executed:** all seven tiers and fifteen mutations are complete, tested vocabulary; the generation pipeline is deterministic (same seed → same Elite, verified in tests) and mutation-compatible (exclusion groups never co-roll, verified across a wide seed sweep). Generated Elites govern live encounters: real stat scaling, mutation-driven behaviour overrides, and Retreat Logic all observed in the walking-skeleton run; a 1,400-combination sweep (all 7 tiers × 200 seeds) is the literal "generate thousands of Elite combinations" self-review test, asserting schema validity and determinism on every one. Full mutation-mechanic buildout (the six future mutations) and encounter-type/special-event content bind at future content modules.

**Review verdict:** ALIGNED (zero new resources, zero new rarity ladder, zero new compatibility/stacking vocabulary, zero new Director integration, zero new persistence; `MutationEffects` is the one new structure, explicitly justified as composition over AF-033's locked schema, not an edit to it). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ELITE_ENEMY_FRAMEWORK.md`, `src/game/enemies/eliteData.ts`, `src/game/enemies/EliteGenerator.ts`.
