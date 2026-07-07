# AFTERLIGHT — Weapon Framework

**Authority:** Produced output of AF-032. Extends AF-000 → AF-031. Every future Weapon, Projectile, Evolution, Manufacturer, and Mastery system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** players choose a weapon for how it changes their approach to combat, never for the largest number — power emerges through build synergy.

---

## 1. Weapon profile — zero new plumbing, new content flowing through existing pipes

A `WeaponDef`'s damage/critical fields feed AF-021's existing `DamagePacket` shape directly. Its category tags `DamagePacket.kind` using `DamageSourceKind` values AF-021 §11 already reserved for weapons (`beam`, `orbital`, `drone`, plus `direct`/`area`/`overTime` for the rest). Its damage multiplier flows into the pipeline's already-dedicated `weapon` stage of `OffensiveModifiers` — this module is simply the first real producer of a slot AF-021 always had.

## 2. Fire pattern vs. projectile behaviour

| Concern | Meaning | Mechanism |
|---|---|---|
| Fire pattern | Spawn geometry — how many projectiles leave the muzzle, at what angles | `computeShotAngles(pattern, count, baseAngle)` — deterministic, geometric patterns only (Single Shot, Burst, Spread, Arc, Nova, Spiral) |
| Projectile behaviour | Post-spawn motion and lifecycle | `stepProjectile(behaviour, state, dtMs, context)` — deterministic per-behaviour step (all twelve: Straight, Seeking, Bouncing, Piercing, Explosive, Returning, Accelerating, Splitting, Orbiting, Chain Lightning, Persistent Beam, Gravity Affected) |

Beam/Orbit/Homing/Chain/Wave/Charged Shot are content-authoring labels for a fire pattern that pairs a single spawn with its matching behaviour (`persistentBeam`, `orbiting`, `seeking`, `chainLightning`, gravity/acceleration, `accelerating`) rather than a second geometry system. Documented simplification, not a silent omission.

## 3. Status application — exact reuse, zero new kinds

The ten statuses a weapon may inflict (Burn, Freeze, Shock, Poison, Corruption, Overload, Slow, Armour Break, Shield Break, Stasis) are AF-021's existing `StatusKind` union in full. `WeaponDef.statusOnHit` is a chance-gated `StatusApplication{kind, strength, durationMs}` fed straight into a target's existing `StatusEngine.apply()` — stacking, DoT ticks, resistances, and the movement bridge are all AF-021 machinery, untouched.

## 4. Energy Cost — a scope extension, not a second resource

AF-031 introduced Energy "scoped tightly to ship abilities only." A weapon's Energy Cost draws from the **same** pool: `ShipRuntime.trySpendEnergy(amount)` is the one new method added to support it. A weapon with `energyCost: 0` never touches the pool — most weapons are energy-free; the attribute exists for weapons that are deliberately meant to compete with ability uptime for the same resource. Recorded explicitly as a scope widening.

## 5. Evolution — the pattern reused, not the code

`WeaponEvolutionRequirement` generalises AF-029's "sibling ids simultaneously active" evolution pattern to weapons' six heterogeneous triggers:

| Trigger | Reads from |
|---|---|
| Level Up | `XpSystem.snapshot.level` |
| Relics | `RelicSystem.activeRelicIds` |
| Equipment | the equipped loadout's item ids |
| Research | `ResearchTree.isUnlocked(id)` |
| Boss Materials | count of `bossExclusive`-kind loot/inventory items |
| Ancient Technology | presence of an `ancientTechnology`-categorised equipped/crafted item |

`evaluateWeaponEvolution(def, context)` is a pure read of a snapshot assembled from these existing systems — no new persistence, no new state machine.

## 6. Acquisition, synergy, mastery — zero new systems

Acquisition resolves entirely to AF-023's `LOOT_CATEGORIES`/`SpecialDropKind` (weapon, bossExclusive, ancientTechnology all already registered), AF-025's crafting/blueprint engine, and AF-024's research unlocks. Synergy with Commanders/Ships/Equipment/Relics/Research/Status/Biomes/Enemies/Bosses is the shared `BonusTotals`/`DamagePacket`/`StatusEngine` surface — no weapon-specific coupling. Mastery reuses AF-026's `weapon:<id>` tracks exactly, supplying only the counter keys (kills, damage, boss defeats, critical hits, status applications, evolution count, mission usage, special challenges); rewards are the same cosmetic-only `MasteryReward` union.

## 7. No-overlap law

Each weapon's category+firePattern+projectileBehaviour+statusOnHit-kind fingerprint (`weaponFingerprint`) is checked against the roster via `findWeaponOverlap`, mirroring AF-030/031's `findOverlap`/`findShipOverlap`. A near-duplicate signature fails the check with the conflicting weapon named.

## 8. Presentation, accessibility, performance

Weapon card, stat comparison, evolution tree, mastery progress, lore, manufacturer, status effects build from AF-005/AF-007 at the UI module. Large weapon cards, controller/touch navigation, comparison mode, search, sorting, high contrast, colour-blind support inherit AF-005's baseline. Projectiles and weapon effects are pooled (the existing `Pool<TestProjectile>` extended, not replaced); weapon data cached; visual assets lazy-loaded.

## 9. Debug

Live: active weapon · projectile count · damage output · status applications · evolution state · mastery progress · performance.

---

## Internal review loop (AF-032, recorded)

- **No duplicated systems** — damage packet, pipeline stage, status engine, energy pool, loot/crafting/research acquisition, and mastery all reuse AF-021/AF-023/AF-024/AF-025/AF-026/AF-029/AF-031 exactly; this module adds only the fire-pattern/projectile-behaviour vocabulary, the evolution evaluator, and one new `ShipRuntime` method. ✔
- **Every weapon mechanically unique** — fingerprint check is code, not a review reminder. ✔
- **Deterministic projectile behaviour** — `stepProjectile` is a pure function of state + dt + context; no hidden RNG in motion. ✔
- **Sandbox proof** — a real weapon governs live fire timing, pierce, and status-on-hit through the existing damage pipeline, replacing the placeholder cannon. ✔
- **Simplification pass** — rejected a second geometry system for the six "identity" fire patterns (paired with existing behaviours instead); rejected a weapon-specific energy pool (widened AF-031's Energy instead); rejected reusing `RelicSystem`'s evolution *code* for weapons since the trigger types don't share a shape — reused the *pattern* with a purpose-built evaluator instead. ✔

**Internal quality score: 9.5/10 — approved and locked; roster/balance passes bind at future Weapon content modules.**
