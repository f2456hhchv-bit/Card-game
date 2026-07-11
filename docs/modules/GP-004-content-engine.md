## Verbatim prompt

```
4

# AFTERLIGHT PRODUCTION PACK GP-004

# CONTENT ENGINE — WEAPONS, SHIPS, COMMANDERS, EVENTS, GALAXIES & LOOT

Continue directly from GP-003.

Do NOT redesign previous systems.

Everything must integrate.

Everything must be modular.

Everything must compile.

==================================================
OBJECTIVE
==================================================

Create an endlessly expandable content framework.

The framework should allow thousands of future additions without requiring major rewrites.

Every system should be data driven.

Everything should be generated from reusable definitions.

Never hardcode content.

==================================================
CONTENT CATEGORIES
==================================================

Weapons

Passives

Artifacts

Ships

Commanders

Enemies

Bosses

Events

Galaxies

Systems

Missions

Loot

Resources

Blueprints

Cosmetics

Achievements

Museum Collectibles

==================================================
WEAPONS
==================================================

Support unlimited weapon definitions.

Each weapon contains

Name

Description

Rarity

Damage Type

Fire Rate

Projectile Behaviour

Evolution Path

Visual Effects

Audio

Status Effects

Scaling

Unlock Requirements

Weapon Categories

Laser

Ballistic

Missile

Plasma

Energy

Gravity

Drone

Summon

Explosive

Biological

Experimental

Every weapon should feel unique.

==================================================
WEAPON EVOLUTION
==================================================

Every weapon evolves.

Evolution changes

Appearance

Functionality

Behaviour

Strategy

Not simply damage.

==================================================
PASSIVES
==================================================

Unlimited passives.

Support

Defensive

Offensive

Utility

Movement

Economy

Cooldown

Critical

Summons

Shield

Healing

XP

Loot

Synergy

==================================================
ARTIFACTS
==================================================

Artifacts should completely change builds.

Examples

Duplicate projectiles.

Reverse gravity.

Orbiting satellites.

Ricochet beams.

Chain explosions.

Living ammunition.

Temporary black holes.

Every artifact should create memorable runs.

==================================================
SHIPS
==================================================

Support unlimited ships.

Each ship contains

Model

Lore

Starting Weapon

Starting Passive

Ultimate Ability

Movement Profile

Power Profile

Unlock Requirements

Upgradeable Statistics

Examples

Interceptor

Destroyer

Carrier

Research Vessel

Mining Ship

Living Ship

Prototype

Ancient Vessel

==================================================
COMMANDERS
==================================================

Support unlimited Commanders.

Each Commander contains

Portrait

Biography

Voice

Background

Passive

Ultimate

Starting Bonus

Relationship System

Level

XP

Unique Dialogue

Preferred Playstyle

Commanders should meaningfully affect runs.

==================================================
ENEMIES
==================================================

Every enemy contains

Role

Health

Movement

Abilities

Weaknesses

Resistances

Drops

Behaviour Tree

Spawn Rules

Scaling Rules

==================================================
BOSSES
==================================================

Bosses should be memorable.

Every boss contains

Unique arena.

Unique music.

Unique attacks.

Multiple phases.

Unique dialogue.

Unique rewards.

Museum unlock.

Lore.

Bosses should never reuse attack patterns excessively.

==================================================
EVENTS
==================================================

Dynamic event library.

Examples

Merchant

Distress Signal

Ancient Vault

Research Station

Lost Fleet

Alien Survivor

Black Hole

Civilian Rescue

Derelict Cruiser

Temporal Rift

Events should provide meaningful choices.

==================================================
GALAXIES
==================================================

Every Galaxy contains

Theme

Colour Palette

Music

Enemy Pool

Boss Pool

Mission Types

Environmental Hazards

Unique Resources

Unique Technology

Unique Lore

Unique Discoveries

No galaxy should feel identical.

==================================================
MISSIONS
==================================================

Mission templates include

Survival

Escort

Destroy

Rescue

Explore

Collect

Defend

Recover

Investigate

Hunt

Mission modifiers combine for replayability.

==================================================
LOOT
==================================================

Loot categories

Credits

Research

Resources

Artifacts

Blueprints

Ship Parts

Commander Equipment

Museum Relics

Legendary Drops

Atlas Data

Support

Common

Uncommon

Rare

Epic

Legendary

Mythic

==================================================
RESOURCE SYSTEM
==================================================

Every resource has multiple uses.

Avoid useless currencies.

Resources should support

Research

Crafting

Ship Upgrades

Atlas

Trading

Blueprints

Manufacturing

==================================================
BLUEPRINT SYSTEM
==================================================

Blueprints unlock

Weapons

Ships

Buildings

Artifacts

Modules

Commander Equipment

Blueprint fragments combine into completed blueprints.

==================================================
COSMETICS
==================================================

Unlock

Ship Skins

Trails

Engine Effects

Portrait Frames

Commander Skins

Titles

Museum Decorations

Home Base Decorations

Never affect gameplay.

==================================================
ACHIEVEMENTS
==================================================

Support hundreds of achievements.

Combat

Exploration

Collection

Atlas

Museum

Research

Bosses

Galaxies

Hidden

Challenge

==================================================
DATA ARCHITECTURE
==================================================

Everything content related should load from external data.

Never hardcode.

Allow designers to add content without modifying systems.

==================================================
MOD SUPPORT
==================================================

Design content architecture so future mod support becomes possible.

Content definitions should be easily extendable.

==================================================
SELF REVIEW
==================================================

Review every content category.

Review replayability.

Review variety.

Review progression.

Review scalability.

Ask

"Can this system still support new content ten years from now?"

If not...

Redesign it.

Repeat until the framework could comfortably support

1000+ weapons

500+ passives

500+ artifacts

100+ ships

500+ Commanders

1000+ enemies

500+ bosses

100 galaxies

10,000 missions

without requiring architectural changes.

Only then lock GP-004.
```

## Scope decision (recorded via AskUserQuestion, genuine Project Owner input)

GP-004's own framing is architecturally distinct from GP-001/002/003: rather than asking "does mechanic X exist," it asks whether the codebase's DATA ARCHITECTURE can scale to 1000+ weapons, 500+ passives, 500+ artifacts, 500+ Commanders, 1000+ enemies without requiring architectural changes — and explicitly separates that question from mass content-authoring ("Never hardcode content... allow designers to add content without modifying systems").

A dedicated Explore-agent audit ran against this framing specifically — instructed to distinguish two different kinds of gap:

- **Architecture violation** — a place where adding the (N+1)th piece of content would require editing engine code (a `switch`/`.find()` keyed on a literal content id, or a whole content category with no data shape at all), which genuinely breaks the spec's "without requiring architectural changes" test.
- **Content-volume gap** — a place where the mechanism is already generic and data-driven, and the only thing missing is more authored data (the spec itself frames galaxy/mission/museum/cosmetic volume as future-authoring work, not a one-pass deliverable).

**The audit found, among others:**

1. Ten faction squad-spawning functions (`spawnOutlawSquad`, `spawnMachineNetwork`, `spawnCrystalEcosystem`, …) found each squad's leader/special member via `def.id === "<hardcoded-string>"` — a genuine architecture violation, since adding a new enemy to any faction roster required a matching `main.ts` code change, not just new data.
2. Several scattered `drone.def.id === "<literal>"` checks outside those ten functions (a constellation-destroyed handler, a mine-layer hazard-drop loop) — the same anti-pattern in miniature.
3. Commander Ultimate activation was presentation-only (camera shake + toast) for every Commander regardless of which one — no data field anywhere described what an ultimate actually *does*, so 500+ future Commanders would need 500+ bespoke `main.ts` branches to become mechanically real.
4. Passives existed only embedded per weapon/ship/commander/equipment (AF-028's `PassiveTrigger`+`EquipmentBonus`), with no independently addressable top-level Passive content category matching the spec's 14 named types.
5. Only `bossArtifacts.ts`'s five hand-authored, boss-kill-gated entries existed for "Artifacts" — no generic `ArtifactDef` array as its own top-level content category, and no acquisition point distinct from the Boss's own reward ceremony.
6. `WEAPON_CATEGORIES` (the real, engine-level enum) doesn't literally contain the spec's own named weapon-category list (Laser/Ballistic/Missile/Plasma/Energy/Gravity/Drone/Summon/Explosive/Biological/Experimental) — most map cleanly onto existing categories under different names, but two (Summon, Biological) had zero real weapon behind them anywhere in the shelf.

**Content-volume gaps explicitly out of scope** (Events/Galaxies/Blueprints/Cosmetics/Museum volume growth, JSON-based mod-infrastructure): these are exactly what the spec itself frames as future authoring, not a one-pass architectural fix — GP-003 already built the real, generic mechanisms behind most of these categories (galaxy clusters, blueprint categories, mission modifiers); authoring hundreds more instances of already-generic data is not an architecture change.

Given this split, the Project Owner was asked to choose between **"Fix the real architecture violations"** (the 6 items above, scoped tightly) and **"Everything the audit found"** (which would have also meant mass content-authoring and a JSON mod-loader neither the spec nor the codebase's own "extend, never overwrite" discipline calls for in one pass). **The Project Owner's explicit answer was "Fix the real architecture violations"** — the first GP module in this track where the answer was NOT "everything the audit found." This doc records that narrower, explicitly-scoped contract.

## What's implemented

1. **Faction squad-spawning: hardcoded-id lookups → generic role lookups.** All ten squad-spawning functions in `main.ts` (`spawnOutlawSquad`, `spawnMachineNetwork`, `spawnCrystalEcosystem`, `spawnVoidSwarm`, `spawnAncientSite`, `spawnHive`, `spawnFleet`, `spawnProtocol`, `spawnConstellation`, `spawnEclipsed`) now find each squad's leader and special-role member via `EnemyDef.roles.includes(...)` — a role that already existed on every roster from GP-002 — instead of `.find(d => d.id === "<hardcoded-string>")`. This only stays correct if the chosen role is unique within each faction's own small spawn roster, so a new `tests/factionSquadRoles.test.ts` guards that invariant directly (21 tests: one leader-role entry per faction, one special-role entry per faction, Machine's three distinct special roles, and an explicit lore-exception check). Writing that guard test caught a real bug before it shipped: `machine-command-core` carries neither `"elite"` nor `"commander"` (its own lore: "Not a leader — a router"), so the Machine-specific leader lookup uses its real, unique `"controller"` role instead of `"elite"`.
2. **Scattered `drone.def.id` checks fixed the same way.** A constellation-destroyed handler and a mine-layer hazard-drop loop switched from `def.id === "constellation-avatar"` / `"outlaw-mine-layer"` to `def.roles.includes("support")` / `"areaDenial"`. Several OTHER `.id === "<literal>"` occurrences were deliberately left unchanged after review — places where a mechanic's identity IS "always summons this specific unit" (e.g. a Swarm Constructor always building Machine combat drones), which is an intentional content choice, not an ambiguity or scalability violation.
3. **Commander Ultimates gained a real, generic effect interpreter.** `commanderData.ts` adds `CommanderUltimateEffectKind` (`novaDamage`/`barrierBurst`/`healBurst`) and an optional `effect?: CommanderUltimateEffect` field on `CommanderUltimate`; `main.ts`'s new `applyCommanderUltimateEffect()` is a single `switch(effect.kind)` dispatching to already-existing mechanisms (`dealAreaDamageToEnemies`, `DefenceState.addBarrier`, `DefenceState.healHull`) — no new state invented. The field is optional (defaulting to a modest generic nova) rather than required, since making it required would force editing 30+ roster-only commander files for disproportionate benefit; only the two playable sandbox Commanders (`reyes-longlight`, `vek-ironhull`) were given bespoke, mechanically-distinct effects, since GP-003's own audit already found they're the only two with full playable stat blocks.
4. **Standalone Passive registry.** New `src/game/passives/passiveData.ts`: `PASSIVE_CATEGORIES` (the spec's 14 named types) and `PassiveDef` (reusing AF-028's `PassiveTrigger`/`EquipmentBonus` vocabulary directly rather than inventing a parallel one), with `SANDBOX_PASSIVES` — one real entry per category. Wired into the real, already-tested level-up acquisition flow: `UpgradeDefinition` (xpTuning.ts) gains an optional `effect?: EquipmentBonus` field, `SANDBOX_UPGRADES` (main.ts) is extended with the full Passive roster (`category: "passive"`), and `applyUpgrade(id)` — previously a `switch(id)` on six literal upgrade-id strings, the exact same hardcoded-branching anti-pattern the audit flagged elsewhere, just in the core level-up system instead of the enemy-squad system — is now a generic `switch(effect.kind)` interpreter. Nine of the fourteen categories resolve to a `BonusKind` with a real, already-wired runtime consumer (damage/cooldownReduction/criticalChance/movementSpeed/shieldCapacity/pickupRadius/shieldRegeneration/resourceGain/experienceGain — the last two newly wired into `dropLoot`'s `researchBonus` and the XP-pickup callback respectively, both one-line additions at the exact same composition-root sites GP-003 already established); Support/Defensive/Utility deliberately reuse those same wired kinds under different flavour/trigger framing (a taxonomy tag, not a claim every category needs a bespoke mechanic); Summons/Synergy use `BonusKind`'s own pre-existing "registered future" kinds (`droneEffectiveness`/`orbitalPower`) honestly, since no drone or stacking-history system exists to back them yet.
5. **Standalone Artifact registry.** New `src/game/artifacts/artifactData.ts`: `ArtifactEffectKind` (`novaOnKill`/`barrierOnDamage`/`healOnShieldBreak`/`critOnLevelUp`) and `SANDBOX_ARTIFACTS` — four real, permanent, build-altering entries, distinct from `bossArtifacts.ts`'s five hand-authored boss-kill-gated rewards. The interpreter is bus-listener-based rather than touching the frame loop or combat internals: four new `bus.on(...)` registrations (`EnemyKilled`/`PlayerDamaged`/`ShieldBroken`/`CommanderLevelUp`) each iterate held Artifacts matching their effect kind and call an already-existing mechanism (`dealAreaDamageToEnemies`, `DefenceState.addBarrier`/`healHull`, `sandboxBuild.critBonus`) — mirroring the exact "gameplay systems never know meta exists" bus-listener discipline AF-001 §7 already established. Bought at the mid-run Travelling Merchant (`MidRunMerchant` screen) — a real acquisition point distinct from the Boss's own once-per-run reward ceremony — via a new `ArtifactRuntime` (mirrors `BossArtifactRuntime`'s own no-duplicate law).
6. **Weapon-category vocabulary gap resolved.** `WEAPON_CATEGORIES` (weaponData.ts) gains one new value, `"summon"`, additively — the audit's one genuine gap with no category, naming-layer entry (AF-075's `WEAPON_FRAMEWORK_CATEGORIES`), or weapon anywhere in the shelf. `WEAPON_FRAMEWORK_CATEGORIES` gains `"summonWeapons"` mapping onto it. Two new real weapons prove both gaps: `SWARM_TENDER` (category `"summon"`, reusing the existing `orbiting` projectile behaviour — no "persistent ally" engine invented) and `SPORE_LANCE` (`biologicalWeapons` naming-layer entry, mapped onto the pre-existing `"plasma"` `WeaponCategory`, using AF-021's existing `poison` status — a naming-layer entry that existed since AF-075 but had zero weapons using it until now). Both weapons get full `WeaponProfileDef`s, `WeaponFamilyDef`s, and `WeaponRosterEntry`s so every downstream AF-075/076 shelf (`FRAMEWORK_WEAPONS`, `LAUNCH_ARSENAL`, `ARSENAL_ENTRIES`) stays internally consistent. Every other spec category name (Laser/Ballistic/Missile/Plasma/Energy/Gravity/Drone/Explosive/Experimental) already maps onto AF-075's existing 17-category naming layer — documented explicitly in `weaponFrameworkData.ts`'s header comment rather than left implicit.

## Debug & verification

`DebugSnapshot` gains one combined `gpContentEngine` field (rendered `gpContent`), mirroring the `gpCoreLoop`/`gpEnemyWave`/`gpMetaProgression` convention: `passives <n>/<n> categories · artifacts [<held>]/<n> · weapon categories <n> (+summon) · framework categories <n>`.

Full suite: **2305 tests green, 208 files** (38 new this module: 21 in `factionSquadRoles.test.ts`, 4 in the new `CommanderUltimateEffect` describe block in `commanders.test.ts`, 5 in `passives.test.ts`, 7 in `artifacts.test.ts`, plus updated hardcoded-count assertions in `weaponFramework.test.ts`/`weaponRoster.test.ts` to reflect the two additive new weapons/categories/families). `tsc --noEmit -p .` clean. `vite build` clean. Browser-verified against a real automated run (Splash → MainMenu → GalaxyCommand → MissionSelect → Launch → Gameplay): the debug overlay rendered `gpContent  passives 14/14 categories · artifacts [none]/4 · weapon categories 16 (+summon) · framework categories 18` and `weapons  ... arsenal 1/12` live, zero page errors, only the pre-existing baseline 404.

## Self review loop

- Reviewed against the audit's own stated distinction: every item shipped is a genuine architecture violation (would break/require code changes as content scales), never a content-volume gap — the spec's own galaxy/mission/museum/cosmetic volume targets were left as future authoring, exactly as the spec itself frames them and as the Project Owner's scope answer directed.
- Reviewed against GP-002's own deliberate lore decisions: `machine-command-core`/`ancient-void-avatar` NOT being tagged `"commander"` was respected — the role-lookup strategy for Machine's leader uses its real, unique `"controller"` role rather than "fixing" the lore tags to make the refactor simpler.
- Reviewed against "never invent new state where one exists": Commander Ultimates, Passives, and Artifacts all dispatch through generic `kind`-based interpreters onto mechanisms that were ALL already real and tested before this module (`dealAreaDamageToEnemies`, `DefenceState.addBarrier`/`healHull`, `dropLoot`'s `researchBonus`, the XP-pickup callback, `sandboxBuild`'s existing fields) — zero new gameplay mechanics were invented to back new vocabulary.
- Reviewed for honest scope trims: Passives' Summons/Synergy categories and the pre-existing `droneEffectiveness`/`orbitalPower` `BonusKind`s are explicitly labelled "no consumer system yet" rather than backed by a fabricated mechanism; the same discipline BonusKind's own file comment already used for those two kinds before this module touched them.
- Rejected scope creep: did not build a JSON-based mod-loader (the spec's own "Mod Support" section asks the architecture to make one *possible* later, not to build one now — a data-driven `kind`+`value` interpreter pattern already satisfies that); did not hand-author additional Events/Galaxies/Blueprint/Cosmetic/Museum content, matching the Project Owner's explicit "fix the real architecture violations" scope choice over "everything the audit found."

Score: 9.5/10 — approved and locked.
