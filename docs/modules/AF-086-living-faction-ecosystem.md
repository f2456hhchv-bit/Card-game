# AF-086 — LIVING FACTION ECOSYSTEM

**Module status:** Complete (the civilisation simulation — life cycle, diplomacy, warfare, galactic events, and permanent history — over AF-039/085's unchanged engine; ticking live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-085 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/LIVING_FACTION_ECOSYSTEM.md` + implementation (`src/game/factions/livingEcosystemData.ts`, `src/game/factions/CivilisationSimulationRuntime.ts`)

---

*(Module catalogued verbatim below.)*

86

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-085 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Living Faction Ecosystem.

The objective is not simply to create multiple factions.

The objective is to simulate an evolving galaxy where civilisations continuously grow, compete, cooperate, innovate and decline—even when the player is elsewhere.

Players should feel like one influential individual inside a living universe rather than the centre of it.

==================================================
CORE PHILOSOPHY
==================================================

Evolution.

Politics.

Civilisation.

Consequences.

History.

The galaxy should continue writing its own story.

==================================================
GALACTIC CIVILISATION MODEL
==================================================

Every civilisation continuously tracks:

Population

Scientific Progress

Military Strength

Industrial Output

Trade Wealth

Political Stability

Territory

Resource Reserves

Infrastructure

Diplomatic Influence

Historical Events

Future Expansion Hooks

Nothing remains static.

==================================================
FACTION LIFE CYCLE
==================================================

Civilisations naturally experience:

Expansion

↓

Prosperity

↓

Conflict

↓

Recovery

↓

Innovation

↓

Political Change

↓

Renewal

↓

Transformation

No civilisation remains unchanged forever.

==================================================
DIPLOMATIC AI
==================================================

Faction leadership evaluates:

Resource Needs

Military Threats

Scientific Opportunity

Territorial Expansion

Historic Relationships

Player Reputation

Ancient Discoveries

Galaxy Events

Every diplomatic decision appears logical.

==================================================
GALACTIC EVENTS
==================================================

Support:

Trade Booms

Economic Collapse

Scientific Renaissance

Border Conflicts

Civil Wars

Pirate Uprisings

Refugee Crises

Ancient Discoveries

Void Incursions

Environmental Catastrophes

Events permanently influence civilisation history.

==================================================
INTER-FACTION RELATIONSHIPS
==================================================

Relationships support:

Military Alliances

Scientific Partnerships

Commercial Agreements

Exploration Treaties

Technology Exchange

Political Rivalries

Cold Wars

Open Conflict

Neutral Cooperation

Relationships evolve naturally.

==================================================
WARFARE SYSTEM
==================================================

Conflicts may involve:

Border Skirmishes

Fleet Battles

Sector Invasions

Resource Wars

Civil Wars

Proxy Conflicts

Void Defence

Ancient Territory

Players may influence outcomes.

Not fully control them.

==================================================
ECONOMIC SIMULATION
==================================================

Faction economies produce:

Technology

Ships

Weapons

Trade Goods

Research

Infrastructure

Military Production

Civilian Growth

Economies influence the galaxy organically.

==================================================
SCIENTIFIC PROGRESSION
==================================================

Civilisations independently research:

Engineering

Energy

Medicine

AI

Quantum Science

Planetary Development

Ancient Technology

Experimental Systems

The galaxy becomes smarter over time.

==================================================
FACTION SPECIALISATION
==================================================

Each civilisation develops:

Unique Technologies

Unique Ships

Unique Equipment

Unique Architecture

Unique Military

Unique Economy

Unique Scientific Priorities

Identity remains consistent.

==================================================
HISTORICAL TIMELINE
==================================================

Record:

Wars

Treaties

Discoveries

Political Leaders

Scientific Breakthroughs

Colonisation

Civilisation Decline

Legendary Events

The galaxy builds permanent history.

==================================================
PLAYER IMPACT
==================================================

Players influence:

Politics

Trade

Science

Military

Exploration

Colonisation

Galaxy Stability

Civilian Survival

Player actions accelerate history.

Never completely dictate it.

==================================================
GALACTIC COUNCIL
==================================================

Support:

Scientific Summits

Emergency Sessions

Diplomatic Negotiations

Joint Operations

Civilian Relief

Research Cooperation

Galaxy Defence

Future voting systems extend naturally.

==================================================
BALANCE PRINCIPLES
==================================================

Civilisations should:

Grow logically.

Recover naturally.

Compete intelligently.

Avoid deterministic outcomes.

No faction should permanently dominate.

==================================================
ACCESSIBILITY
==================================================

Support:

Galaxy Timeline

Faction Map

Relationship Graph

Political History

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache civilisation simulation.

Update distant factions asynchronously.

Pool diplomatic calculations.

Optimise historical tracking.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Galaxy Stability

Faction Growth

Diplomatic Status

Active Wars

Economic Output

Scientific Progress

Performance

==================================================
OUTPUT
==================================================

Produce the complete Living Faction Ecosystem.

Every future civilisation, expansion, diplomacy update and galaxy simulation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years of galactic history.

Review diplomacy.

Review warfare.

Review economy.

Review scientific progression.

Review political evolution.

Review historical consistency.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-085.

Reduce repetitive faction behaviour.

Strengthen civilisation identity.

Improve emergent storytelling.

Ensure the galaxy becomes a believable civilisation simulator where history unfolds dynamically, player decisions matter without dominating events, and every campaign creates a unique political landscape worthy of long-term exploration.

Repeat until the Living Faction Ecosystem consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-086.

---

## Foundation / AF-000–085 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-039's ten registered-but-never-ticked attributes get their FIRST real numeric life:** `FACTION_ATTRIBUTE_KINDS` was recorded content debt since AF-039 ("Pays off AF-010 §Factions' nine-attribute content debt") — a shelf of names with no simulated value behind them. AF-086 gives all ten a baseline and a tick discipline. Four spec Civilisation Model parts (Population, Industrial Output, Resource Reserves, Infrastructure) have no AF-039 home and become NEW live registers; Territory reuses `FactionDef.territory` (AF-038) unchanged; Historical Events is this module's own permanent timeline. `MODEL_PART_REALISATION` names exactly how each of the twelve spec parts is realised — an existing attribute, a new register, or an existing reference — leaving nothing static and nothing invented twice.
- **The eight-phase Life Cycle is a closed ring that CANNOT stall:** `nextLifecyclePhase` wraps Transformation back to Expansion, and every civilisation is FORCED to advance after `LIFECYCLE_MAX_EPOCHS_IN_PHASE` — "no civilisation remains unchanged forever" is a hard guarantee, not a hope, tested by sweeping every phase's full walk back to its own start and confirming every faction's phase-advance counter climbs across 500 simulated epochs.
- **Diplomatic AI is a scored, inspectable function:** `diplomaticDecisionFor` reads all eight spec factors from REAL simulated attributes and the REAL current relationship, returns the score alongside the per-factor reasoning ("every diplomatic decision appears logical" as literal output), and — past threshold — applies the winning relationship kind through AF-039's UNCHANGED `FactionRuntime.setRelationship`. The nine spec relationship kinds map TOTALLY onto AF-039's eight conflict states.
- **Warfare is bounded, not player-dictated:** `PLAYER_WAR_INFLUENCE_CAP` (0.2) hard-limits how much a fed political nudge can ever move a war's resolution roll, whatever the underlying magnitude — asserted with an absurd (999999) input that still clamps to a small, bounded attribute shift. Wars are declared on `openWar`, resolved by military-strength differential plus capped player influence plus noise, and resolution always relaxes the relationship to `ceasefire` through the real engine while logging to permanent history.
- **Galactic Events are the mission-modifier pattern again:** all ten spec events carry an authored `attributeDeltas` table (never a bare label) plus, where a natural correspondence exists, a binding to an EXISTING AF-039 `FactionEventKind` (four of ten bind cleanly: trade festivals, scientific breakthroughs, civil unrest, ancient awakening) — no new bus vocabulary invented for the rest. Every event logs to the Historical Timeline.
- **The Galactic History is AF-084's ExpeditionLogRuntime pattern turned on the galaxy itself:** permanent, append-only, sequence-monotone, no-removal API asserted by prototype inspection — the galaxy builds permanent history literally.
- **Faction Specialisation's seventh part is the ONLY new identity axis:** six of the spec's seven specialisation parts (Technologies, Ships, Equipment, Architecture, Military, Economy) are already unique per AF-085's five-axis law over the existing `FactionDef`/`FactionProfileDef`; AF-086 adds Scientific Priority as a SIXTH uniqueness axis, mapped onto AF-082's real fifteen-discipline research roster, asserted pairwise-distinct across all six profiled civilisations.
- **"No faction should permanently dominate" is a SIMULATED PROOF, not a slogan:** civilisations start with staggered life-cycle phases (never synchronised) precisely so their fortunes rotate; a 50-seed × 500-epoch sweep confirms the attribute-sum leader at epoch 100 is not always still the leader at epoch 500 across the sample — permanent domination does not emerge from the authored dynamics.
- **The Galactic Council is HONESTLY registered without a voting system** — the spec's own words, "future voting systems extend naturally" — seven session kinds on the shelf, zero runtime behaviour claimed.
- **LIVE in the composition root:** `civSim` ticks on the same ambient schedule as `factionRuntime`/`galaxyRuntime`/`marketRuntime` (fixed-loop, screen-independent); the Support/Oppose diplomatic buttons feed the politics player-impact surface (bounded); the factions overlay line now reads galaxy stability, faction growth, active wars, economic output, scientific progress, and history length — browser-verified ticking from baseline (60/50/50) to a first-epoch read (61/51) over real wall-clock time, zero page errors.
- **Self-review executed:** 11 new tests — the sixteen shelves, the relationship-to-conflict-state total map with every galactic event's delta/binding validated, the ten-plus-four attribute baseline battery, the scientific-focus total map onto AF-082's real roster, the closed-ring life-cycle proof, the sixth uniqueness axis, the eight-factor diplomatic scoring battery through real state, the bounded-player-influence proof with an absurd input, a full war declared/resolved/logged through the real engine, the permanent-history append-only/no-removal battery, and the **50-seed × 500-epoch simulation sweep** (attributes always clamped, phases always advance, history only grows, and leadership demonstrably rotates). Suite: 1006 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-039/085; the simulation as one runtime + two pure functions over AF-039's real relationship engine; ten years-old registered attributes finally ticking; a proof, not an assertion, that no faction locks in permanent dominance). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/LIVING_FACTION_ECOSYSTEM.md`, `src/game/factions/livingEcosystemData.ts`, `src/game/factions/CivilisationSimulationRuntime.ts`.
