# AF-080 — EQUIPMENT ROSTER FRAMEWORK

**Module status:** Complete (the engineering ecosystem — manufacturers, families, philosophies, sets, prototype/ancient engineering and the lab — on unchanged AF-028/079 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-079 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/EQUIPMENT_ROSTER.md` + implementation (`src/game/equipment/equipmentRosterData.ts`)

---

*(Module catalogued verbatim below.)*

80

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-079 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Equipment Roster Framework.

The objective is not to create hundreds of modules.

The objective is to build an engineering ecosystem where every module meaningfully changes gameplay, enabling limitless experimentation across Ships, Weapons, Commanders, Relics and Research.

Engineering should become one of the deepest systems in Afterlight.

==================================================
CORE PHILOSOPHY
==================================================

Engineering.

Creativity.

Optimisation.

Expression.

Mastery.

No module should exist simply as a larger number.

==================================================
MANUFACTURERS
==================================================

Support multiple engineering companies.

Each possesses its own philosophy.

Example manufacturers:

Atlas Dynamics

Helios Industries

Nova Forge

Vanguard Systems

Aegis Engineering

Quantum Horizon

Black Horizon

Frontier Salvage

Ancient Foundry

Paragon Laboratories

Void Recovery Initiative

Crystal Resonance Guild

Future manufacturers extend naturally.

Every manufacturer defines:

Engineering philosophy

Visual language

Lore

Technology specialisation

Audio identity

Signature mechanics

==================================================
MODULE FAMILIES
==================================================

Support:

Power Generation

Power Distribution

Shield Systems

Engine Systems

Cooling Arrays

Targeting Computers

Drone Control

Navigation

Scanning

Sensor Packages

Missile Guidance

Armour Systems

Repair Technology

Experimental Systems

Ancient Technology

Quantum Systems

Void Technology

Crystal Resonance

Future families extend naturally.

==================================================
ENGINEERING PHILOSOPHIES
==================================================

Modules specialise in:

Efficiency

Overclocking

Reliability

Risk vs Reward

Mobility

Defence

Automation

Energy Control

Heat Management

Support

Every philosophy creates different builds.

==================================================
ADVANCED SYNERGY
==================================================

Modules interact with:

Ships

Weapons

Commanders

Relics

Research

Ascension

Biome Effects

Faction Bonuses

Mission Modifiers

World Events

Everything contributes to one engineering ecosystem.

==================================================
MODULE SETS
==================================================

Support:

Manufacturer Sets

Technology Sets

Ancient Sets

Prototype Sets

Faction Sets

Experimental Sets

Hybrid Sets

Set bonuses alter gameplay.

Never only statistics.

==================================================
PROTOTYPE MODULES
==================================================

Prototype modules feature:

Experimental behaviour

Conditional bonuses

Instability

Adaptive systems

Unique mechanics

High skill ceiling

Prototype engineering rewards mastery.

==================================================
ANCIENT MODULES
==================================================

Ancient modules possess:

Unique visuals

Historical lore

Exclusive mechanics

Evolution paths

Rare discovery chains

Museum entries

Ancient engineering feels irreplaceable.

==================================================
ENGINEERING RESEARCH
==================================================

Research unlocks:

Alternative configurations

Efficiency

Experimental technologies

Manufacturer specialisations

Prototype compatibility

Ancient integration

Research expands engineering options.

==================================================
COLLECTION
==================================================

Players permanently collect:

Modules

Manufacturers

Prototype Systems

Ancient Systems

Set Collections

Engineering Blueprints

Statistics

Lore

Collections reward exploration.

==================================================
ENGINEERING LAB
==================================================

Support:

Blueprint Viewer

Module Testing

Damage Simulator

Power Simulator

Heat Simulator

Build Comparison

Theorycraft Sandbox

Engineering becomes approachable.

==================================================
BALANCE PRINCIPLES
==================================================

Modules reward:

Planning.

Engineering.

Experimentation.

Knowledge.

Synergy.

Never mandatory optimisation.

No module should dominate every build.

==================================================
ACCESSIBILITY
==================================================

Support:

Recommended Modules

Power Visualisation

Heat Visualisation

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Detailed Comparisons

==================================================
PERFORMANCE
==================================================

Cache engineering calculations.

Optimise passive evaluation.

Pool module effects.

Reuse shared engineering logic.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Engineering Loadout

Power Grid

Heat Balance

Module Sets

Engineering Efficiency

Performance

==================================================
OUTPUT
==================================================

Produce the complete Equipment Roster Framework.

Every future module extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate millions of engineering builds.

Review manufacturers.

Review module families.

Review set bonuses.

Review engineering depth.

Review build diversity.

Review research.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-079.

Reduce redundant modules.

Strengthen engineering identity.

Increase experimentation.

Ensure the Equipment ecosystem becomes one of Afterlight's deepest long-term progression systems, supporting virtually limitless engineering possibilities while remaining intuitive, balanced and rewarding to master.

Repeat until the Equipment Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-080.

---

## Foundation / AF-000–079 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-076/078 roster move applied to engineering, on unchanged shapes:** AF-028's `EquipmentItemDef` and AF-079's `EquipmentProfileDef` stand untouched — the ecosystem is data. FOURTEEN engineering manufacturers (the spec's twelve plus Ironmoor and Meridian, already shipped in AF-079 profiles) each carry all SIX identity parts (philosophy, visual language, lore, specialisation, audio identity, signature mechanic) plus a `shipwrightId` cross-binding to AF-074's register where the company also builds hulls — nine bind, five are engineering-only (Black Horizon through the Crystal Resonance Guild), so the register is provably not AF-074 renamed.
- **THREE-LAYER BINDING, the AF-076 discipline:** every roster entry's family maps through `FAMILY_TO_MODULE_CATEGORY` (eighteen families TOTAL onto AF-079's sixteen categories) to exactly its profile's `moduleCategory`, its engineering manufacturer resolves in the register, and — the new law — a module by a shipwright-bound maker must carry that shipwright's AF-074 id in its profile (entry→profile→AF-074, machine-checked). Entries are identity ONLY (maker, family, philosophy, set) with no stat field by key inspection.
- **Sets classified by kind with a GAMEPLAY clause:** the vanguard set turns out to be a HYBRID set (three manufacturers, one doctrine — asserted by profile-manufacturer count) and the new BASTION set is Aegis Engineering's manufacturer set (one maker, asserted), living through AF-028's UNCHANGED SetDef engine — validated, aggregated, threshold-exact in tests. Five set kinds honestly await content.
- **PROTOTYPE ENGINEERING PAYS — the AF-078 void law crosses into modules:** the Horizon Flux Capacitor carries instability as a REAL negative bonus clause, a conditional passive, uniqueness, a reactor gate (`requiresCategory: "energyModule"` — proven to REJECT installation without a reactor and accept it with one, through the real validator), and strictly the hottest heat register (the AF-076 prototype-heat discipline, now on equipment). The Nova Warden Hive is the first EQUIPMENT producer of AF-028's registered-future `droneEffectiveness` bonus kind (asserted first).
- **The ENGINEERING LAB is derivation, not a system:** `engineeringLabFor` assembles all seven features (blueprint viewer through theorycraft sandbox) from data every module already carries — asserted non-empty for all nine profiled modules. "No module should dominate every build" is a PARETO assertion: every module is beaten by another on at least one engineering axis (bonus total, heat, weight, dimensions). Ten philosophies, ten synergy surfaces, six research kinds, eight collection kinds, two forbidden outcomes, eight accessibility surfaces, four performance disciplines — registered shelves.
- **The roster went LIVE:** the composition root's item map upgraded to the full ten, both Bastion pieces installed (`equipment5/6`) so set detection has a real subject (`sets 2` on the overlay), the workshop lattice spans all nine profiles, and `engineeringLoadFor` reads the full installed grid. "Limitless" EXECUTED — one hundred deterministic synthetics plus the roster yield 110 distinct ids, all passing AF-079's unchanged architecture and engineering laws.
- **Self-review executed:** 13 new tests — all eleven shelves, six-part manufacturer identity with real AF-074 cross-bindings, the ten-module roster through both inherited laws with the locked arrays asserted unchanged at the head, the three-layer binding with identity-only key inspection, set classification with maker-count proofs, the Bastion set through the REAL engine, the prototype-pays battery with the reactor gate proven both ways, the first-producer assertion, the seven-feature lab for all nine modules, the Pareto no-dominance law, the 110-id synthetic proof, and a **1,000-build seeded sweep through AF-028's REAL validator/aggregator** — set bonuses match brute force exactly on every valid build. Suite: 946 passing. **Live in the browser:** `equipment wpn +10% · shield +52 · sets 2 · pwr 5944 · draw 20 · heat 17 · mass 57 · workshop 6/9 crafted` — zero page errors.

**Review verdict:** ALIGNED (zero shape changes; the ecosystem as pure data + two pure functions; the Bastion set and both new engineering laws live through the locked engine; prototype power paying a real price). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/EQUIPMENT_ROSTER.md`, `src/game/equipment/equipmentRosterData.ts`.
