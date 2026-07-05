# AF-010 — WORLD BUILDING & CANON FRAMEWORK

**Module status:** Complete (specification produced; canon review binds every future story, faction, biome, and expansion)
**Lock status:** LOCKED — extends AF-000 → AF-009 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/WORLD_CANON.md` (the binding world building and canon framework of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-009 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete World Building and Canon Framework.

This document defines the laws of the Afterlight universe.

Everything that exists within the game must obey these rules.

Every story.

Every weapon.

Every ship.

Every Commander.

Every faction.

Every biome.

Every technology.

Every expansion.

If something contradicts this document, it does not belong in Afterlight.

==================================================
CORE PHILOSOPHY
==================================================

Grounded Science Fiction.

Hope through discovery.

Ancient mysteries.

Technological evolution.

Exploration over conquest.

The universe feels believable.

Wonder comes from uncovering truth.

Never from unexplained magic.

==================================================
THE UNIVERSE
==================================================

Humanity once spanned the galaxy.

A catastrophic event fractured civilisation.

Ancient technologies were abandoned.

Entire systems vanished.

Knowledge became fragmented.

Now only isolated colonies remain.

The player represents humanity's effort to reconnect the stars.

==================================================
THE AFTERLIGHT
==================================================

The "Afterlight" is not merely a title.

It is a phenomenon.

It represents the lingering energy left behind after the collapse of an advanced civilisation.

It influences:

Technology

Navigation

Research

Biomes

Artifacts

Ancient Machines

Living Structures

Its true nature is gradually revealed throughout the game.

==================================================
UNIVERSAL LAWS
==================================================

Technology always has an explanation.

Energy obeys consistent rules.

Space phenomena have observable behaviour.

Ancient technology appears impossible until researched.

Nothing exists simply because it is "magical."

Every phenomenon should have discoverable scientific principles.

==================================================
THEMES
==================================================

Hope.

Curiosity.

Discovery.

Perseverance.

Sacrifice.

Legacy.

Reconstruction.

Exploration.

The unknown should inspire curiosity before fear.

==================================================
FACTIONS
==================================================

Every faction possesses:

History

Motivation

Technology

Visual identity

Military doctrine

Scientific philosophy

Territory

Relationships

Internal conflicts

No faction is purely good or evil.

Each believes it is acting rationally.

==================================================
TECHNOLOGY
==================================================

Technology progresses logically.

Examples include:

Fusion Energy

Quantum Drives

Void Manipulation

Crystal Resonance

Gravitational Engineering

Nanotechnology

Autonomous Intelligence

Ancient Relics

Future discoveries extend existing science.

Never invalidate previous discoveries.

==================================================
THE GALAXY
==================================================

The galaxy contains:

Core Worlds

Frontier Systems

Dead Civilisations

Ancient Megastructures

Research Stations

Trade Routes

Nebulae

Void Regions

Crystal Systems

Machine Sectors

Every location contributes to the history of the universe.

==================================================
BIOLOGY
==================================================

Alien life evolves according to its environment.

Species possess:

Evolutionary history

Adaptations

Ecological roles

Behavioural patterns

Weaknesses

Strengths

No creature exists solely to become an enemy.

==================================================
ANCIENT CIVILISATIONS
==================================================

Ancient societies should feel:

Powerful.

Advanced.

Elegant.

Mysterious.

Understandable.

Players gradually reconstruct their history through exploration.

==================================================
PLAYER PLACE IN HISTORY
==================================================

The player is important.

The player is not the centre of the universe.

Civilisations existed long before them.

Their actions influence the future.

Not the past.

==================================================
LORE DELIVERY
==================================================

Lore is discovered.

Never force-fed.

Deliver through:

Codex

Recovered Logs

Research

Artifacts

Environmental Storytelling

Boss Encounters

Ancient Archives

Commander Conversations (future)

==================================================
EXPANSION RULES
==================================================

Every future expansion must:

Respect existing canon.

Expand logically.

Answer previous mysteries.

Create new mysteries.

Never rewrite established history without explicit narrative justification.

==================================================
QUALITY CONTROL
==================================================

Every new idea must answer:

Does it fit the universe?

Does it respect established science?

Does it strengthen the mystery?

Does it create future storytelling opportunities?

Does it align with the Afterlight themes?

If any answer is "No"

Redesign it.

==================================================
PERFORMANCE
==================================================

Lore systems remain data-driven.

Environmental storytelling uses reusable assets.

Codex entries lazy-load.

Narrative systems remain modular.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Canon References

Lore Dependencies

Faction Relationships

Timeline Status

Codex Completion

Narrative Consistency

==================================================
OUTPUT
==================================================

Produce the complete World Building and Canon Framework.

Every future story, expansion, biome, faction and character extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every faction.

Review every biome.

Review every Commander.

Review every Boss.

Review every technology.

Review every Codex entry.

Review every environmental story.

Review every expansion concept.

Review scientific consistency.

Review thematic consistency.

Review narrative opportunities.

Review future scalability.

Remove contradictions.

Strengthen internal logic.

Ensure every mystery has a purpose, every discovery expands the universe, and every future addition naturally belongs within the Afterlight canon.

Repeat until the entire universe feels coherent, believable and capable of supporting decades of future storytelling.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-009 alignment review (recorded at catalogue time)

- Grounded sci-fi, no magic, hope through discovery: restates the Constitution's World Philosophy and AF-009 §4's voice verbatim. Player fantasy (reconnecting the stars / rebuilding civilisation) matches AF-000. No contradictions.
- **The Afterlight phenomenon canonised** — lingering energy of a collapsed advanced civilisation, influencing technology/navigation/research/biomes/artifacts/ancient machines/living structures. Its true nature is a *deliberately open mystery*: the output document records what is established vs. what is reserved for gradual revelation, so no future module accidentally over-explains it.
- Light-is-hope (AF-002 §4) now has its in-universe justification: the Afterlight *is* the light the player carries and restores — visual language and canon reinforce each other.
- Faction requirements (nine attributes, no pure good/evil) bind the eight AF-008 factions; **full nine-attribute profiles are recorded as content debt** for each faction's introducing module. Colour/silhouette identities already exist (AF-002/AF-008).
- Technology ladder maps cleanly onto faction identities (Crystal Resonance → Crystal Dominion; Void Manipulation → Void Legion; Autonomous Intelligence → Machine Collective; Ancient Relics → Ancient Civilisation) and onto AF-000's research/crafting loop.
- Biology rules ("no creature exists solely to become an enemy") extend the Constitution's content philosophy to fauna; enemy design modules must give species ecological reality.
- Lore delivery channels match AF-009 §6's four layers; "Commander Conversations" catalogued as future-flag. Galaxy contents list pre-seeds the Galaxy System (AF-001) and biome modules.
- Debug requirements (canon references, timeline status, narrative consistency) are realised as the **canon ledger** (`docs/WORLD_CANON.md` §10) now, and as data-driven codex tooling when narrative systems are implemented.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved. Produced output: `docs/WORLD_CANON.md`.
