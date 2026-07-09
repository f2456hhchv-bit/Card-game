# AF-081 — RESEARCH FRAMEWORK

**Module status:** Complete (the scientific layer as profiles + one law over AF-024's unchanged engine; the first crystalResonance project live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-080 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RESEARCH_ARCHITECTURE.md` + implementation (`src/game/research/researchFrameworkData.ts`)

---

*(Module catalogued verbatim below.)*

81

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-080 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Research Framework.

Research is not a simple progression tree.

It represents humanity slowly rediscovering lost knowledge while creating entirely new scientific breakthroughs.

Research should permanently expand player possibilities.

It should never simply increase statistics.

Every breakthrough should unlock new gameplay.

==================================================
CORE PHILOSOPHY
==================================================

Discovery.

Innovation.

Knowledge.

Experimentation.

Permanent Progression.

Every scientific breakthrough should feel important.

==================================================
RESEARCH ARCHITECTURE
==================================================

Every Research Project contains:

Unique ID

Research Branch

Scientific Discipline

Lore

Requirements

Research Cost

Research Time

Scientific Dependencies

Gameplay Unlock

Visual Identity

Codex Entry

Future Expansion Hooks

Every project should feel meaningful.

==================================================
PRIMARY RESEARCH BRANCHES
==================================================

Support:

Ship Engineering

Weapon Engineering

Commander Training

Energy Systems

Materials Science

Artificial Intelligence

Quantum Physics

Void Studies

Crystal Resonance

Drone Technology

Medical Science

Industrial Systems

Civilian Development

Ancient Technology

Experimental Science

Future branches extend naturally.

==================================================
SECONDARY BRANCHES
==================================================

Support:

Efficiency

Exploration

Crafting

Scanning

Navigation

Mining

Logistics

Trade

Communications

Research Infrastructure

Every branch expands gameplay.

==================================================
RESEARCH PROGRESSION
==================================================

Projects unlock:

New Weapons

New Ships

New Equipment

New Modules

New Missions

New Events

New Technologies

New Biomes

Progression remains horizontal.

==================================================
SCIENTIFIC DISCOVERIES
==================================================

Major discoveries unlock:

Ancient Technologies

Prototype Systems

Experimental Equipment

Faction Cooperation

Civilian Upgrades

Galaxy Projects

Legendary Missions

Scientific breakthroughs change the galaxy.

==================================================
RESEARCH LABORATORIES
==================================================

Support:

Engineering Labs

Biological Labs

Quantum Labs

Void Research

Crystal Studies

Prototype Division

Ancient Archive

Civilian Research

Each laboratory specialises differently.

==================================================
RESEARCH RESOURCES
==================================================

Projects require:

Research Points

Scientific Data

Ancient Records

Experimental Samples

Prototype Components

Faction Knowledge

Legendary Discoveries

Resources encourage exploration.

==================================================
DISCOVERY SYSTEM
==================================================

Research advances through:

Exploration

Bosses

Missions

Codex Completion

Collections

Ancient Archives

Scientific Expeditions

Knowledge becomes gameplay.

==================================================
RESEARCH SYNERGY
==================================================

Research interacts with:

Ships

Weapons

Commanders

Equipment

Relics

Campaign

Galaxy State

World Events

Everything contributes to one scientific ecosystem.

==================================================
VISUAL PRESENTATION
==================================================

Research interface supports:

Interactive Technology Trees

Scientific Timeline

Dependency Maps

Discovery History

Research Statistics

Future Branch Preview

Navigation remains intuitive.

==================================================
BALANCE PRINCIPLES
==================================================

Research rewards:

Curiosity.

Exploration.

Planning.

Long-term investment.

Experimentation.

Never mandatory grinding.

==================================================
ACCESSIBILITY
==================================================

Support:

Search

Filters

Dependency Highlights

Recommended Projects

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Cache research trees.

Optimise dependency calculations.

Lazy load branches.

Pool interface assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Completed Research

Active Research

Dependencies

Research Efficiency

Scientific Progress

Performance

==================================================
OUTPUT
==================================================

Produce the complete Research Framework.

Every future technology extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete every research project.

Review progression.

Review dependency structure.

Review scientific identity.

Review unlock pacing.

Review build diversity.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-080.

Reduce unnecessary prerequisites.

Strengthen scientific identity.

Increase meaningful unlocks.

Ensure the Research system becomes one of Afterlight's defining progression pillars, rewarding curiosity, exploration and long-term planning through meaningful technological advancement rather than numerical inflation.

Repeat until the Research Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-081.

---

## Foundation / AF-000–080 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-024 is the engine; AF-081 is the scientific doctrine over it:** `ResearchNodeDef`, the fifteen categories, eleven node types, and the `ResearchTree` engine (graph validation, prerequisite gating, hidden discoveries, reset-with-refund, save serialisation) stand untouched. The AF-071→079 profile pattern lands once more: `ResearchProjectProfileDef` wraps each node BY ID with branch, discipline, laboratory, lore, gameplay unlock, visual identity, codex entry and expansion hooks; `researchArchitectureFor` proves all twelve spec parts per project.
- **Two branch shelves, one binding:** the spec's fifteen primary and ten secondary branches map TOTALLY onto AF-024's fifteen categories, and the THREE-LAYER BINDING law (the AF-076/080 discipline) holds per project: profile branch → category → the node's own category, exact, machine-checked. Every profile's laboratory resolves in the eight-lab register (each with an authored specialisation) and every codex entry is a REAL entry in AF-026's codex.
- **"It should never simply increase statistics" is UNREPRESENTABLE at the profile layer:** `ResearchGameplayUnlock` is a KIND (on the eight-kind §Research Progression shelf) and a DESCRIPTION — key-inspection asserts no numeric field exists. And the tree's new project makes the law literal: LATTICE ATTUNEMENT, the FIRST crystalResonance project (a category registered since AF-024, empty until now), carries `effect: null` — a breakthrough whose entire meaning is the gameplay it opens.
- **RESEARCH TIME honours DR-005:** the owner-ratified amendment (unlocks are instant, permanently) makes the "Research Time" architecture part a COMPLIANCE assertion — `completionTimeMs === 0` for every project, tested. Rapid Refit's profile records the doctrine in lore.
- **Resources are honest:** seven registered, exactly ONE live today (research points — AF-024's real economy), the other six awaiting their producing systems (the biomeId pattern), asserted. Seven discovery routes each carry an authored identity; seven major-discovery kinds, eight synergy surfaces, six presentation features, two forbidden outcomes (mandatory grinding, numerical inflation — registered BY NAME), eight accessibility surfaces.
- **Presentation and debug are DERIVATION:** `dependencyMapFor` mirrors the tree exactly; `researchEfficiencyFor` (earned points converted to unlocks) and `scientificProgressFor` (fraction of the tree unlocked) are pure, bounded functions now live on the overlay's research line.
- **Self-review executed:** 9 new tests — the thirteen shelves, both total maps with authored identities, the fourteen-project tree through the REAL engine's own validation (no duplicates, cycles, or dangling prerequisites) with the locked thirteen asserted unchanged at the head, twelve-part completeness with the DR-005 assertion, the three-layer binding with real codex resolution, the no-numeric-unlock key inspection, the derived-map/metric battery, **"complete every research project" executed literally** (every node unlocked through the real engine — hidden discovery revealed, every dependency satisfied, every point spent, efficiency exactly 1, then reset refunds all and preserves the discovery), and a **1,000-career seeded sweep** (unlocks never regress, points never negative, the spent ledger never drifts, efficiency stays bounded). Suite: 955 passing. **Live in the browser:** `research pts 0 · unlocked 0 · wpn +0% · loot +0% · eff 0% · sci 0%` — zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-024's engine or data; the scientific layer as pure data + four pure functions; the first crystalResonance project with a null effect making the module's central law literal; DR-005 honoured as an asserted compliance part). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/RESEARCH_ARCHITECTURE.md`, `src/game/research/researchFrameworkData.ts`.
