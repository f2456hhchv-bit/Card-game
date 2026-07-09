# AF-090 — CIVILISATION FRAMEWORK

**Module status:** Complete (six named settlements at real galaxy systems, developing through a linear ladder toward Legendary Status; nine galaxy-wide megastructures; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-089 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CIVILISATION_FRAMEWORK.md` + implementation (`src/game/civilisation/civilisationFrameworkData.ts`, `src/game/civilisation/CivilisationFrameworkRuntime.ts`)

---

*(Module catalogued verbatim below.)*

90

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-089 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Civilisation Framework.

The player is not simply defeating enemies.

The player is rebuilding an entire galaxy.

Every restored colony, repaired station and completed megastructure should permanently change the universe.

Civilisation itself becomes a major progression system.

Players should eventually look across the galaxy and recognise that their actions transformed it.

==================================================
CORE PHILOSOPHY
==================================================

Hope.

Growth.

Restoration.

Expansion.

Legacy.

Civilisation should feel alive.

==================================================
CIVILISATION ARCHITECTURE
==================================================

Every civilisation project contains:

Unique ID

Name

Location

Faction

Population

Infrastructure

Technology Level

Economic Output

Scientific Output

Military Presence

Construction Progress

Historical Timeline

Future Expansion Hooks

Nothing remains undefined.

==================================================
SETTLEMENT TYPES
==================================================

Support:

Research Outposts

Mining Colonies

Trade Stations

Industrial Cities

Orbital Habitats

Agricultural Worlds

Military Bases

Shipyards

Scientific Academies

Ancient Restoration Sites

Future settlements extend naturally.

==================================================
POPULATION SYSTEM
==================================================

Track:

Population

Growth

Employment

Education

Health

Security

Scientific Workforce

Industrial Workforce

Military Personnel

Civilian Happiness

Population evolves naturally.

==================================================
INFRASTRUCTURE
==================================================

Support:

Power Networks

Communication Arrays

Transportation

Orbital Elevators

Spaceports

Hospitals

Research Centres

Manufacturing

Defence Systems

Housing

Infrastructure permanently upgrades settlements.

==================================================
GALAXY RESTORATION
==================================================

Players contribute through:

Resources

Research

Construction

Exploration

Technology Recovery

Defence

Trade

Scientific Cooperation

Every contribution is visible.

==================================================
MEGASTRUCTURES
==================================================

Support:

Dyson Arrays

Orbital Rings

Quantum Gates

Planetary Shields

Ancient Archives

Solar Harvesters

Research Megalabs

Interstellar Highways

Afterlight Relays

Megastructures redefine sectors.

==================================================
COLONY DEVELOPMENT
==================================================

Colonies naturally evolve through:

Founding

↓

Expansion

↓

Industrialisation

↓

Scientific Growth

↓

Prosperity

↓

Specialisation

↓

Legendary Status

Growth remains organic.

==================================================
PLAYER INVESTMENT
==================================================

Players may:

Fund Projects

Assign Resources

Deliver Technology

Recruit Scientists

Restore Ancient Systems

Upgrade Infrastructure

Protect Construction

Influence Priorities

Player choices shape civilisation.

==================================================
CIVILISATION SPECIALISATION
==================================================

Settlements specialise in:

Science

Industry

Trade

Military

Exploration

Engineering

Agriculture

Ancient Research

Energy

Diplomacy

Specialisation changes gameplay.

==================================================
WORLD EVOLUTION
==================================================

Construction visibly changes:

Stations

Cities

Planet Surfaces

Trade Routes

Civilian Traffic

Defences

Research

Architecture

The galaxy visibly grows.

==================================================
GALACTIC PROJECTS
==================================================

Support:

Interstellar Gateways

Civilian Fleets

Planetary Restoration

Ancient Reactivation

Research Networks

Fleet Construction

Galaxy Defence Grid

The largest projects require long-term effort.

==================================================
REWARDS
==================================================

Development unlocks:

New Missions

Commanders

Ships

Research

Blueprints

Trade Bonuses

Rare Resources

Legendary Technologies

Civilisation rewards long-term planning.

==================================================
BALANCE PRINCIPLES
==================================================

Civilisation rewards:

Planning.

Investment.

Exploration.

Protection.

Scientific Progress.

Never repetitive grinding.

Never mandatory micromanagement.

==================================================
ACCESSIBILITY
==================================================

Support:

Development Overview

Construction Timeline

Population Viewer

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Narration Ready

==================================================
PERFORMANCE
==================================================

Cache civilisation state.

Optimise construction simulation.

Update distant colonies asynchronously.

Reuse infrastructure assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Population

Infrastructure

Construction

Development Level

Civilisation Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Civilisation Framework.

Every future colony, megastructure, settlement and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of years of civilisation development.

Review settlement growth.

Review construction pacing.

Review player investment.

Review megastructures.

Review rewards.

Review galaxy evolution.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-089.

Reduce unnecessary micromanagement.

Strengthen visible world progression.

Improve civilisation identity.

Ensure the Civilisation Framework becomes one of Afterlight's defining long-term systems, allowing players to visibly rebuild humanity and its allies into a thriving galactic civilisation whose growth is reflected across every sector of the universe.

Repeat until the Civilisation Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-090.

---

## Foundation / AF-000–089 / GP-FINAL alignment review (recorded at catalogue time)

- **The player's rebuilding effort gets a visible, NAMED face:** six settlements — Lucent Gate Resonance Mines, Forge Primus Foundries, Meridian Rest Shipyards, Gravewake Garrison, First Light Restoration Site, Verdance Habitat Ring — each sited at a REAL AF-038 system whose region matches that faction's own AF-039 territory EXACTLY (asserted), one per AF-085/086/089-profiled civilisation, each settlement type pairwise-distinct — the EIGHTH identity-uniqueness axis (AF-085's five + AF-086's sixth + AF-089's seventh + this one).
- **A LINEAR ladder, deliberately never a ring:** every prior AF-086/089 growth mechanic was a closed ring (Life Cycle, Production Chains); Colony Development is the first LINEAR monotone lattice in this chain — Legendary Status is a true ceiling, asserted to have no successor and an Infinity threshold that is never even evaluated (the runtime bails out of further construction-progress tracking the moment a settlement arrives, so the ceiling is structural, not just a very large number). Thresholds are asserted strictly ascending; a 400-epoch run is asserted to advance AT MOST one stage per epoch, never skipping.
- **Historical Timeline needed no fifth ledger class:** every milestone — a stage crossed, a megastructure completed — is logged directly to AF-086's REAL `CivilisationSimulationRuntime.history`, the exact same permanent, append-only `GalacticHistoryRuntime` AF-086 already shipped. Reuse over reinvention, a discipline this deep into the chain paying for itself again.
- **Settlement types, population stats, and infrastructure upgrades are all realised onto EXISTING shelves, never a duplicate register:** ten settlement types resolve onto AF-089's real infrastructure kinds, AF-089's real industries, or AF-087's primary categories; three of ten population stats reuse AF-086/089's own simulated registers (population, growth, employment) with seven honest new settlement-scoped stats for the rest; four of ten settlement-infrastructure upgrades share an id with AF-089's real `InfrastructureKindDef` shelf (asserted by equality) while six are genuinely new — AF-089 tracked infrastructure per FACTION (colony-wide), AF-090 tracks it per NAMED settlement, a finer scope, never a duplicate meaning.
- **Player Investment is bounded, and HALF of it delegates rather than reimplements:** `INVESTMENT_MAX_DELTA` caps every one of the eight actions (a third appearance of the AF-086 "accelerate, never dictate" law); four actions (Fund Projects, Assign Resources, Deliver Technology, Upgrade Infrastructure) call AF-089's own real, bounded economy methods directly rather than shipping a second implementation of the same cap, proven capped by BOTH modules' ceilings at once with an absurd (999999) input; Influence Priorities is asserted to succeed only once a settlement reaches Specialisation, and only ONCE — permanent, never switchable, "player choices SHAPE civilisation."
- **Megastructures are galaxy-wide, deliberate, and genuinely research-gated:** nine defs, each sited at a REAL AF-038 region; Afterlight Relay Prime and the Axiom Quantum Gate require real AF-024/082 research nodes UNLOCKED before accepting a single point of investment — proven by attempting investment before and after walking the real research tree's prerequisite chain through the actual engine (the AF-081/082 "complete every path" pattern, reused for a test). Completion is monotone and permanent, logged to the same real history.
- **Civilisation Specialisation changes gameplay, not just numbers:** each of the ten specialisations names a favoured population stat (verified to resolve onto the real ten-stat shelf), and a specialised settlement's favoured stat is proven to grow measurably faster than an unfavoured one over real epochs.
- **LIVE in the composition root:** settlements and megastructures tick on the same ambient fixed-loop schedule as `civSim`/`galacticEconomy`; a victorious expedition now funds BOTH the mission's present faction's AF-089 colony AND that faction's own AF-090 settlement — "every restored colony... should permanently change the universe," literally, at the same real `endRun` seam AF-089 already used; the overlay's galaxy line now reads settlements, population, upgrades, construction%, development level, civilisation rating, and megastructures complete, browser-verified ticking over real wall-clock time (`construction 0% → 1%`, `pop 60 → 61`), zero page errors.
- **Self-review executed:** 18 new tests — the fifteen shelves, the settlement-type/population-stat/infrastructure-upgrade realisation splits with exact counts, the eighth uniqueness axis with real-territory location matching, the linear-ladder proof (no skip, no regression, a true ceiling), the historical-timeline reuse proof, the specialisation permanence/favoured-growth battery, all four delegating investment actions proven double-capped, the megastructure research-gate proven both ways through the real engine, and a **30-galaxy × 500-epoch simulation sweep** ("simulate thousands of years") — construction progress never regresses, development stays on the real ladder, and the composite civilisation rating stays within [0, 100] throughout. Suite: 1070 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-024/038/039/085/086/087/089; the framework as one runtime reading two real collaborators plus pure functions; the first linear ladder in the chain, deliberately distinct from every prior ring; historical timeline and half of player investment both reused rather than reinvented). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CIVILISATION_FRAMEWORK.md`, `src/game/civilisation/civilisationFrameworkData.ts`, `src/game/civilisation/CivilisationFrameworkRuntime.ts`.
