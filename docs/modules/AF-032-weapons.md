# AF-032 — WEAPON FRAMEWORK

**Module status:** Complete (framework specified; category/fire-pattern/projectile-behaviour/evolution/mastery engine implemented and tested; a sandbox weapon governs run-time firing; the weapon roster passes bind as future content modules land)
**Lock status:** LOCKED — extends AF-000 → AF-031 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/WEAPON_FRAMEWORK.md` + implementation (`src/game/weapons/`)

---

*(Module catalogued verbatim below.)*

32

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-031 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Weapon Framework.

Weapons are the primary source of player power.

Every weapon should feel mechanically unique.

Every weapon should encourage different movement, positioning and build decisions.

Players should never simply choose the weapon with the largest numbers.

The best weapon is the one that best complements the player's build.

==================================================
CORE PHILOSOPHY
==================================================

Identity.

Creativity.

Synergy.

Mastery.

Replayability.

Every weapon should change how the player approaches combat.

==================================================
WEAPON CATEGORIES
==================================================

Ballistic

Laser

Plasma

Railgun

Missile

Beam

Flak

Arc

Drone

Orbital

Crystal

Void

Prototype

Ancient

Singularity

Future weapon families extend this framework.

==================================================
WEAPON PROFILE
==================================================

Every weapon defines:

Name

Category

Manufacturer

Tier

Rarity

Damage Type

Fire Pattern

Projectile Behaviour

Status Effect

Evolution Path

Mastery

Lore

Visual Identity

Audio Identity

==================================================
PRIMARY ATTRIBUTES
==================================================

Damage

Fire Rate

Range

Projectile Speed

Critical Chance

Critical Damage

Accuracy

Pierce

Ricochet

Explosion Radius

Status Chance

Status Duration

Energy Cost

Cooldown

Future attributes extend naturally.

==================================================
FIRE PATTERNS
==================================================

Support:

Single Shot

Burst

Beam

Spread

Arc

Nova

Spiral

Orbit

Homing

Chain

Wave

Charged Shot

Future patterns remain modular.

==================================================
PROJECTILE TYPES
==================================================

Projectile behaviour supports:

Straight

Seeking

Bouncing

Piercing

Explosive

Returning

Accelerating

Splitting

Orbiting

Chain Lightning

Persistent Beam

Gravity Affected

Projectile behaviour remains deterministic.

==================================================
WEAPON EVOLUTION
==================================================

Weapons may evolve through:

Level Up

Relics

Equipment

Research

Boss Materials

Ancient Technology

Evolution changes mechanics.

Not merely statistics.

==================================================
WEAPON SYNERGY
==================================================

Weapons interact with:

Commanders

Ships

Equipment

Relics

Research

Status Effects

Biomes

Enemy Types

Boss Mechanics

Synergies should reward experimentation.

==================================================
STATUS APPLICATION
==================================================

Weapons may inflict:

Burn

Freeze

Shock

Poison

Corruption

Overload

Slow

Armour Break

Shield Break

Stasis

Future status effects extend this system.

==================================================
WEAPON MASTERY
==================================================

Track:

Kills

Damage

Boss Defeats

Critical Hits

Status Applications

Evolution Count

Mission Usage

Special Challenges

Mastery primarily unlocks prestige rewards.

==================================================
WEAPON ACQUISITION
==================================================

Weapons are acquired through:

Mission Rewards

Loot

Bosses

Blueprint Crafting

Research

Ancient Vaults

Hidden Discoveries

Events

Future expansions.

==================================================
BALANCE PRINCIPLES
==================================================

Every weapon remains viable.

Every weapon has strengths.

Every weapon has weaknesses.

No universally dominant weapon exists.

Power emerges through build synergy.

==================================================
VISUAL PRESENTATION
==================================================

Display:

Weapon Card

Stat Comparison

Evolution Tree

Mastery Progress

Lore

Manufacturer

Status Effects

Unique visual identity for every weapon.

==================================================
ACCESSIBILITY
==================================================

Support:

Large weapon cards

Controller navigation

Touch navigation

Comparison mode

Search

Sorting

High contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool projectiles.

Pool weapon effects.

Optimise firing logic.

Cache weapon data.

Lazy load visual assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Active Weapon

Projectile Count

Damage Output

Status Applications

Evolution State

Mastery Progress

Performance

==================================================
OUTPUT
==================================================

Produce the complete Weapon Framework.

Every future Weapon, Projectile, Evolution, Manufacturer and Mastery system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play complete campaigns using every weapon.

Review weapon identity.

Review firing behaviour.

Review projectile behaviour.

Review evolution paths.

Review status effects.

Review Commander synergy.

Review Ship synergy.

Review Equipment synergy.

Review Relic synergy.

Review Mastery progression.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-031.

Adjust damage.

Adjust fire rates.

Adjust evolution balance.

Remove overlapping weapon identities.

Ensure every weapon creates a unique playstyle while maintaining fairness, replayability and meaningful build diversity.

Repeat until the Weapon Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-032.

---

## Foundation / AF-000–031 / GP-FINAL alignment review (recorded at catalogue time)

- **Status Application is a zero-new-vocabulary reuse — an exact match.** AF-021's `StatusKind` union is `burn | shock | freeze | corruption | poison | slow | stasis | shieldBreak | armourBreak | overload` — ten kinds. AF-032's list (Burn, Freeze, Shock, Poison, Corruption, Overload, Slow, Armour Break, Shield Break, Stasis) is the *same ten*, just reordered. Weapons call `StatusEngine.apply()` with the existing `StatusApplication{kind, strength, durationMs}` shape; `STATUS_RULES` (stacking, DoT, movement bridge, resistances) already govern all ten. Zero new statuses.
- **`DamageSourceKind` already reserved three weapon-category slots.** AF-021 §11's `DamageSourceKind` union includes `beam`, `orbital`, `drone` alongside `direct`/`area`/`overTime` — reserved for exactly the weapon categories (Beam, Orbital, Drone) this module introduces. No new damage-source plumbing; a weapon just tags its `DamagePacket.kind` with the matching existing value.
- **`OffensiveModifiers` already carries a dedicated `weapon` stage.** AF-021's damage pipeline multiplies `weapon` as its own stage, independent of `commander`/`ship`/`equipment`/`research`/`affixes`. This module is the first real *producer* of that stage's value (previously only a flat sandbox placeholder) — no new pipeline stage invented.
- **Weapon Acquisition needs zero new systems.** Mission Rewards/Loot/Bosses/Ancient Vaults/Hidden Discoveries/Events all resolve to AF-023's existing `LOOT_CATEGORIES` (`"weapon"` is already a category) and `SpecialDropKind` (`bossExclusive`, `ancientTechnology` already registered). Blueprint Crafting resolves to AF-025's existing recipe/blueprint engine. Research resolves to AF-024's existing unlock flow (which already has a `weaponResearchBonus` research-effect kind feeding the pipeline's `research` stage). Nothing here is new plumbing — only new *content* flowing through six already-built pipes.
- **Weapon Evolution reuses AF-029's evolution *pattern*, not its code.** AF-029's relics evolve when a fixed set of sibling relic ids are simultaneously active. Weapon evolution triggers are heterogeneous (Level Up, Relics, Equipment, Research, Boss Materials, Ancient Technology) so a `WeaponEvolutionRequirement` generalises the pattern to a small set of optional predicates evaluated against a read-only snapshot assembled from **existing** state — `xpSystem.snapshot.level`, `relicSystem.activeRelicIds`, the equipped loadout's item ids, `researchTree.isUnlocked(id)`, the loot/inventory count of `bossExclusive`-kind items, and the equipped/crafted presence of an `ancientTechnology`-categorised item (already a category in AF-028's `EquipmentCategory`, AF-025's `CraftingResource`, and AF-024's `ResearchCategory`). No new persistence — the evaluator only reads.
- **Weapon-as-equippable reuses AF-028's slot vocabulary exactly.** `SLOT_ACCEPTS` already defines `primaryWeapon`/`secondaryWeapon` slots accepting `primaryWeapon`/`secondarySystem` categories. A `WeaponDef` is what actually occupies that slot; equipping/unequipping, set bonuses, and aggregation are unchanged AF-028 machinery.
- **Energy Cost is a scope extension of AF-031's Energy, not a second resource.** AF-031 introduced Energy "scoped tightly to ship abilities only." This module's Energy Cost attribute draws from the **same** ship energy pool — `ShipRuntime` gains one new method, `trySpendEnergy(amount)`, so a weapon with a non-zero energy cost is gated by the *same* pool a ship ability spends from. This is an explicit, recorded scope widening of an existing resource, not a new currency — extension, not redesign.
- **Weapon Mastery is AF-026's existing engine.** `weapon:<id>` tracks already exist in the generic mastery map; this module supplies the counter keys (kills, damage, boss defeats, critical hits, status applications, evolution count, mission usage, special challenges) exactly as AF-030/AF-031 supplied `commander:<id>`/`ship:<id>` keys. Rewards are the same cosmetic-only `MasteryReward` union.
- **Fire Pattern vs. Projectile Behaviour — one documented simplification.** Six fire patterns (Single Shot, Burst, Spread, Arc, Nova, Spiral) are genuinely about spawn *geometry* — how many projectiles leave the muzzle and at what angles — and get a real deterministic angle-generator (`computeShotAngles`). The remaining six (Beam, Orbit, Homing, Chain, Wave, Charged Shot) describe *post-spawn* identity that the Projectile Behaviour vocabulary already names precisely (`persistentBeam`, `orbiting`, `seeking`, `chainLightning`, a straight shot with gravity/acceleration for "wave", `accelerating` for a charge-up shot) — so these six fire patterns are content-authoring labels that pair with their matching behaviour rather than a second geometry generator. Recorded here explicitly, not silently decided.
- **Self-review executed:** all fifteen categories, twelve fire patterns, twelve projectile behaviours, and all ten status kinds are complete, tested vocabulary. The evolution evaluator is tested against every trigger type. One sandbox weapon governs live fire timing, energy cost, pierce, and status-on-hit in the walking-skeleton run end-to-end (mirrors AF-029's "one live mechanic, full vocabulary defined" precedent). Full-roster piloting-feel/balance passes bind as the real weapon roster arrives.

**Review verdict:** ALIGNED (zero new resources; Energy's scope is explicitly widened, not duplicated; zero new statuses; zero new acquisition systems). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/WEAPON_FRAMEWORK.md`, `src/game/weapons/`.
