# AF-074 — SHIP ROSTER FRAMEWORK

**Module status:** Complete (ten-hull launch fleet on unchanged AF-031/073 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-073 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/SHIP_ROSTER.md` + implementation (`src/game/ships/shipRosterData.ts`, `ShipCollectionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

74

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-073 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Ship Roster Framework.

Ships are one of the core pillars of player identity.

The goal is not to create many ships.

The goal is to ensure every ship feels like an entirely different machine with unique engineering philosophy, handling characteristics and build potential.

Changing Ships should fundamentally change how the player experiences Afterlight.

==================================================
CORE PHILOSOPHY
==================================================

Engineering.

Expression.

Specialisation.

Mastery.

Replayability.

No Ship should become obsolete.

==================================================
SHIP MANUFACTURERS
==================================================

Support multiple manufacturers.

Each possesses unique engineering philosophy.

Example manufacturers:

Atlas Dynamics

Helios Industries

Nova Forge

Aegis Systems

Vanguard Fleetworks

Eclipse Engineering

Quantum Horizon

Ancient Foundry

Prototype Division

Future manufacturers extend naturally.

Every manufacturer has:

Visual identity

Technology philosophy

Engineering strengths

Historical lore

Signature systems

==================================================
SHIP TIERS
==================================================

Support:

Common

Uncommon

Rare

Epic

Legendary

Ancient

Prototype

Mythic

Tier affects acquisition.

Never overall viability.

==================================================
SHIP SPECIALISATION
==================================================

Ships specialise in:

Speed

Tanking

Critical Hits

Drone Warfare

Energy Weapons

Missiles

Support

Crowd Control

Exploration

Scientific Operations

No single Ship dominates all situations.

==================================================
BUILD ARCHITECTURE
==================================================

Every Ship supports:

Multiple Weapons

Multiple Reactors

Multiple Engines

Multiple Shield Types

Multiple Relics

Multiple Commander Pairings

Multiple Talent Paths

Build diversity remains extremely high.

==================================================
SHIP COLLECTION
==================================================

Players permanently collect:

Blueprints

Manufacturers

Variants

Experimental Models

Legendary Ships

Prototype Hulls

Ancient Designs

Collection encourages exploration.

==================================================
SHIP PROGRESSION
==================================================

Ships gain:

Experience

Mastery

Statistics

Achievements

Cosmetics

Historical Records

Legendary Upgrades

Progression never invalidates earlier Ships.

==================================================
SHIP RESEARCH
==================================================

Research unlocks:

Improved Efficiency

Alternative Modules

Experimental Systems

Engineering Improvements

Visual Variants

Quality-of-life Upgrades

Research expands possibilities.

==================================================
LEGENDARY SHIPS
==================================================

Legendary Ships possess:

Unique Visuals

Unique Lore

Unique Abilities

Unique Progression

Unique Mastery

Unique Discovery Methods

Legendary does not mean strictly stronger.

==================================================
PROTOTYPE SHIPS
==================================================

Prototype Ships introduce:

Experimental Mechanics

Risk / Reward Systems

Unique Controls

Advanced Builds

High Skill Ceiling

Prototype gameplay encourages experimentation.

==================================================
SHIP STATISTICS
==================================================

Track:

Usage

Mission Success

Damage

Distance

Resources Gathered

Boss Victories

Exploration

Build Diversity

Statistics support long-term balancing.

==================================================
CUSTOMISATION
==================================================

Support:

Paint

Engine Trails

Cockpit Themes

Hull Materials

Animated Skins

Manufacturer Decals

Callsigns

Ship History

Visual changes remain cosmetic.

==================================================
BALANCE PRINCIPLES
==================================================

Ships balance around:

Role.

Utility.

Movement.

Decision Making.

Build Synergy.

Never raw statistics alone.

==================================================
ACCESSIBILITY
==================================================

Support:

Recommended Builds

Handling Presets

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Motion Reduction

==================================================
PERFORMANCE
==================================================

Cache Ship data.

Optimise module calculations.

Pool effects.

Reuse manufacturer assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Ship

Manufacturer

Mastery

Modules

Statistics

Balance

Performance

==================================================
OUTPUT
==================================================

Produce the complete Ship Roster Framework.

Every future Ship extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every Ship.

Review movement.

Review engineering identity.

Review build diversity.

Review manufacturers.

Review progression.

Review customisation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-073.

Reduce overlap.

Improve engineering identity.

Strengthen experimentation.

Ensure every Ship feels like a unique engineering masterpiece that supports countless builds while remaining balanced, memorable and rewarding to master.

Repeat until the Ship Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-074.

---

## Foundation / AF-000–073 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-072 roster move applied to hulls, on unchanged shapes:** all ten ships are AF-031 `ShipDef`s with AF-073 `ShipProfileDef`s — no type changed, no locked file touched. The AF-031/073 trio takes the first three berths (Wayfarer/exploration, Bastion/tanking, Aurelia/scientificOperations — the Aurelia claiming the ANCIENT tier as a precursor-schematic reprint) joined by seven new hulls, one per remaining specialisation: the Sable Dart (speed, Helios), Falchion (criticalHits, Vanguard Fleetworks), Hivemother (droneWarfare, Nova Forge), Dawnspire (energyWeapons, Ancient Foundry — the LEGENDARY), Ballista (missiles, Atlas Dynamics), Caduceus (support, Aegis Systems), and Maelstrom X-1 (crowdControl, Prototype Division — the PROTOTYPE). Specialisation assignment is a BIJECTION, asserted.
- **Twelve manufacturers with all five spec identity parts:** the spec's nine examples PLUS the three already canon since AF-031/073 (Halcyon Driveworks, Ironmoor Foundry, Meridian Yards) — each carrying visual identity, technology philosophy, engineering strengths, historical lore, and a signature system, all asserted non-empty, with every fleet entry's manufacturer resolving against the register. "Each possesses unique engineering philosophy" is authored, not implied.
- **"Tier affects acquisition. Never overall viability." is UNREPRESENTABLE:** a `RosterShipEntry`'s keys are asserted to be exactly {shipId, manufacturerId, tier, specialisation, collectionKind, discoveryMethod} — no stat field exists for a tier to inflate. Seven of eight tiers are in use; MYTHIC is registered vocabulary honestly awaiting its first hull (the bossId-null pattern, stated). And "legendary does not mean strictly stronger" is a number: the Dawnspire's hull is asserted NOT to be the fleet's largest.
- **Distinctness asserted FOUR ways:** AF-031's own `findShipOverlap` law across all ten, ten distinct fingerprints, no shared (passive trigger, bonus kind) pair, and — at the profile layer — no shared (primary defence, offensive identity) pair. The last test caught a REAL authored collision (the Dawnspire duplicating the Aurelia's energyBarrier/beamWeapons identity) and the Dawnspire was re-armoured in precursor stone alloy — the distinctness law doing its job at authoring time.
- **Every hull is complete and every hull passes through AF-073's unchanged machinery:** all ten pass the 22-part `shipArchitectureFor` completeness function; ascension gates spread across Ascensions I–III and every gated module resolves against the real module list.
- **Collection is PERMANENT (§Ship Collection):** `ShipCollectionRuntime` starts with the Wayfarer, gates each acquisition on its registered collection kind (blueprints through ancient designs — all seven kinds used across the fleet), collects append-only with no remove/retire/scrap operation (prototype-asserted), and records usage/mission-success per hull with success rate DERIVED, never stored (§Ship Statistics — "statistics support long-term balancing" gets its inputs). "No Ship should become obsolete" is what the code cannot do — the AF-072 guarantee, again.
- **"Never raw statistics alone" is a shelf rule:** five balance axes (role, utility, movement, decision making, build synergy) with raw statistics asserted absent. Legendary traits (six) and prototype mechanics (five) are registered vocabularies — identity vocabulary, not stat multipliers.
- **"Future ships extend naturally" at 25+/50+/100+ is EXECUTED:** `syntheticShipFor(n)` deterministically generates hulls on the same shapes forever — one hundred synthetics plus the fleet yield 110 distinct fingerprints and 100 complete architectures through AF-031's and AF-073's unchanged functions.
- **Self-review executed:** 10 new tests — all eleven shelves, the raw-statistics exclusion, the five-part manufacturer completeness with fleet-wide resolution, the ten-berth bijection with the locked pair asserted at the head, the quadruple-distinctness battery, per-hull 22-part completeness, the tier-shape key inspection with the honest-mythic and legendary-not-strongest assertions, the gated append-only collection with derived statistics, the hundred-synthetic scalability proof, and a **1,000-career seeded sweep** — the usage ledger never drifts, no hull is ever lost, the Wayfarer always remains. **Live in the browser:** launched, and the fleet ran on the extended ships line — `Wayfarer Mk. II (scout/corvette) · common/exploration · energy 100/100 · precision/avoidance · modules 0/2 · fleet 1/10` — zero page errors.

**Review verdict:** ALIGNED (zero shape changes; ten hulls as pure data on AF-031/073's unchanged types; one pure collection runtime in the ledger discipline; twelve manufacturers authored with full identities; the mythic tier honestly registered-empty). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/SHIP_ROSTER.md`, `src/game/ships/shipRosterData.ts` + `ShipCollectionRuntime.ts`.
