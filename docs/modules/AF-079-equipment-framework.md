# AF-079 — EQUIPMENT FRAMEWORK

**Module status:** Complete (the engineering layer as profiles + one law over AF-028's unchanged engine; the first active-bearing module live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-078 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/EQUIPMENT_ARCHITECTURE.md` + implementation (`src/game/equipment/equipmentFrameworkData.ts`, `src/game/equipment/EquipmentCollectionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

79

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-078 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Equipment Framework.

Equipment is the engineering layer that connects Ships, Weapons, Commanders and Relics into complete builds.

Unlike Relics, Equipment represents physical technology installed aboard the player's ship.

Equipment should reward engineering, optimisation and experimentation.

Every module should feel like meaningful engineering rather than a simple stat increase.

==================================================
CORE PHILOSOPHY
==================================================

Engineering.

Customisation.

Experimentation.

Optimisation.

Meaningful choice.

Equipment transforms good builds into exceptional builds.

==================================================
EQUIPMENT ARCHITECTURE
==================================================

Every Equipment Module contains:

Unique ID

Manufacturer

Category

Visual Identity

Lore

Passive Effect

Active Effect (optional)

Energy Requirement

Heat Output

Weight

Rarity

Synergy Tags

Upgrade Path

Evolution Path

Statistics

Collection Status

Future Expansion Hooks

Every module feels handcrafted.

==================================================
MODULE CATEGORIES
==================================================

Support:

Reactors

Shield Generators

Engine Systems

Cooling Systems

Targeting Computers

Sensor Arrays

Drone Bays

Power Converters

Missile Systems

Armour Plating

Repair Systems

Navigation Systems

Cargo Modules

Experimental Modules

Ancient Modules

Prototype Modules

Future categories extend naturally.

==================================================
ENGINEERING PHILOSOPHY
==================================================

Every module changes:

Combat behaviour

Resource economy

Mobility

Survivability

Energy management

Heat management

Build synergy

No module exists only to increase numbers.

==================================================
RESOURCE MANAGEMENT
==================================================

Equipment interacts with:

Energy

Heat

Power

Cooldowns

Shield Capacity

Hull Integrity

Repair Rate

Resource management becomes a core gameplay system.

==================================================
MODULE SYNERGY
==================================================

Equipment interacts with:

Ships

Weapons

Relics

Commanders

Research

Talents

Ascension

Biome Modifiers

Every system becomes interconnected.

==================================================
INSTALLATION RULES
==================================================

Support:

Standard Slots

Specialist Slots

Experimental Slots

Ancient Slots

Prototype Slots

Unique Slots

Slot restrictions encourage build diversity.

==================================================
UPGRADE SYSTEM
==================================================

Equipment upgrades through:

Engineering

Blueprints

Research

Mastery

Legendary Components

Ancient Technology

Upgrades reinforce identity.

==================================================
EVOLUTION
==================================================

Certain modules evolve through:

Combat

Exploration

Research

Bosses

Ascension

Legendary Discoveries

Evolution introduces new mechanics.

==================================================
COLLECTION
==================================================

Track:

Discovered

Crafted

Mastered

Evolved

Prototype Variants

Ancient Variants

Statistics

Collection supports completionists.

==================================================
CUSTOMISATION
==================================================

Support:

Manufacturer Themes

Module Visuals

Installation Animations

Inspection

Engineering Displays

Blueprint Galleries

Visuals reinforce engineering identity.

==================================================
BALANCE PRINCIPLES
==================================================

Modules reward:

Engineering.

Planning.

Experimentation.

Efficiency.

Adaptation.

Never mandatory optimisation.

==================================================
ACCESSIBILITY
==================================================

Support:

Comparison Mode

Recommended Modules

Detailed Tooltips

Search

Filters

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache module calculations.

Optimise passive evaluation.

Pool module effects.

Reuse shared engineering systems.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Installed Modules

Energy Usage

Heat

Power Balance

Synergies

Performance

==================================================
OUTPUT
==================================================

Produce the complete Equipment Framework.

Every future Equipment Module extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of engineering combinations.

Review module identity.

Review energy economy.

Review heat management.

Review upgrade paths.

Review evolution.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-078.

Reduce redundant modules.

Strengthen engineering depth.

Increase build diversity.

Ensure Equipment becomes the engineering backbone of Afterlight, allowing players to create endlessly varied builds through meaningful technological choices rather than simple numerical upgrades.

Repeat until the Equipment Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-079.
---

## Foundation / AF-000–078 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-028 is the engine; AF-079 is the engineering doctrine over it:** `EquipmentItemDef`, the sixteen slots, twelve categories, `SLOT_ACCEPTS`, `validateLoadout`, `aggregateLoadout`, and sets stand untouched. The AF-071→077 profile-wrapper pattern lands one more time: `EquipmentProfileDef` wraps a module BY ID with manufacturer (AF-074's REAL ship-manufacturer register — equipment is ship-installed technology), visual identity, lore, energy requirement, heat output, weight, rarity, synergy tags, upgrade/evolution routes, statistics and expansion hooks; `equipmentArchitectureFor` proves all seventeen spec parts per module.
- **ONE engineering vocabulary, three shelves deep:** the spec's sixteen module categories map TOTALLY onto AF-028's twelve equipment categories, and AF-073's eight ship-module kinds map TOTALLY onto the sixteen — ships and equipment now speak the same engineering language, with no shelf renamed and no second slot system: the spec's six slot kinds (standard through unique) are each realised by an EXISTING AF-028 mechanism (general slots, category-restricted slots, category gates, the uniqueExclusive flag), asserted as a total map.
- **"No module exists only to increase numbers" is a FUNCTION:** `engineeringDimensionsFor` counts a module's non-numeric dimensions (passives, active, set membership, uniqueness, category requirement) and every profiled module must score ≥ 1 — asserted. The refit cannon scores 0 and is deliberately NOT profiled: it is weapon-category content whose home is AF-032/075, the counterexample proving the law has teeth.
- **Actives draw REAL energy; heat and weight join the dormant registers:** the CRYO MANIFOLD is the first equipment item with an ACTIVE module through AF-028's unchanged shape (Emergency Vent, 15 s), and the architecture law makes its energy requirement mandatory (actives draw AF-031's real energy resource; passive-only modules owe none — asserted both ways). heatOutput and weight are registered dormant numerics — the AF-073/075 biomeId pattern — awaiting the heat and mass systems as first consumers.
- **The workshop lattice:** `EquipmentCollectionRuntime` is AF-077's monotone lattice with crafting in owning's seat (unseen → discovered → crafted → mastered, evolved as a permanent parallel mark); no-removal API asserted by prototype inspection. Seven collection states, six upgrade routes, six evolution routes, seven resource surfaces, eight synergy surfaces, six customisation kinds — all registered shelves.
- **Live in the composition root:** the sandbox loadout gained `equipment4: cryo-manifold` (validated and aggregated by AF-028's REAL engine — vanguard 2pc + the manifold's own boost stack to +16% boost efficiency), the item map upgraded from the sandbox five to the workshop six, and the overlay's equipment line now shows §Debug's energy usage, heat, and mass: `draw 20 · heat 12 · mass 40 · workshop 4/5 crafted`.
- **Self-review executed:** 10 new tests — the nine shelves, the three total maps, seventeen-part completeness for all five profiles against AF-074's real manufacturer register, the engineering law with its counterexample, the honest energy rule, the manifold through AF-028's REAL validator/aggregator (set bonuses, active module, boost stacking exact), `engineeringLoadFor` summation, the full lattice battery with the no-removal prototype assertion, and a **1,000-career seeded engineering sweep** (lattice never regresses; crafted ≤ discovered; mastered ≤ crafted; load never negative). Suite: 933 passing. **Live in the browser:** `equipment wpn +10% · shield +40 · sets 1 · pwr 4044 · draw 20 · heat 12 · mass 40 · workshop 4/5 crafted` — zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-028/031/073/074; the engineering layer as pure data + two pure functions + one monotone runtime; the first active-bearing module live; the law made unrepresentable-to-violate for profiled content). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/EQUIPMENT_ARCHITECTURE.md`, `src/game/equipment/equipmentFrameworkData.ts`, `src/game/equipment/EquipmentCollectionRuntime.ts`.
