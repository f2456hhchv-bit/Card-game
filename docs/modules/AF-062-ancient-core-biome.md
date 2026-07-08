# AF-062 — ANCIENT CORE BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-061 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ANCIENT_CORE_BIOME.md` + implementation (`src/game/biomes/ancientCoreBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

62

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-061 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Ancient Core Biome.

The Ancient Core is the birthplace of the civilisation that created the Afterlight Network.

It is not a ruined city.

It is an entire stellar civilisation preserved across multiple worlds and megastructures.

Everything here should communicate unimaginable technological achievement.

Players should constantly feel they have entered somewhere no modern civilisation truly understands.

==================================================
CORE PHILOSOPHY
==================================================

Wonder.

Discovery.

Scale.

Legacy.

Transcendence.

Every structure should make humanity feel insignificant.

==================================================
BIOME IDENTITY
==================================================

Theme:

Precursor civilisation.

Dyson infrastructure.

Planetary archives.

Orbital rings.

Stellar elevators.

Quantum libraries.

Artificial worlds.

Impossible engineering.

The Ancient Core represents civilisation at its absolute peak.

==================================================
VISUAL LANGUAGE
==================================================

White stone alloys.

Gold architecture.

Blue energy.

Floating platforms.

Impossible symmetry.

Living light.

Ancient glyphs.

Planet-sized structures.

Every environment should appear timeless.

==================================================
ENVIRONMENT
==================================================

Support:

Orbital Rings

Dyson Fragments

Planetary Archives

Quantum Libraries

Ancient Cities

Artificial Moons

Stellar Elevators

Guardian Temples

Knowledge Vaults

Afterlight Relays

Future structures extend naturally.

==================================================
WEATHER
==================================================

Support:

Solar Streams

Energy Rain

Quantum Resonance

Gravity Harmony

Light Bloom

Stellar Winds

Ancient Energy Pulses

Weather reinforces technological perfection.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Security Fields

Energy Bridges

Quantum Gates

Gravity Wells

Guardian Arrays

Defence Lasers

Collapsing Platforms

Temporal Locks

Hazards feel intentional.

Not natural.

==================================================
MISSION TYPES
==================================================

Support:

Recover Archives

Activate Relays

Restore Systems

Decode Ancient Language

Escort Scientists

Secure Knowledge Vaults

Protect Researchers

Unlock Civilization Records

The biome emphasises discovery.

==================================================
ENEMY PRESENCE
==================================================

Primary:

Ancient Custodians

Celestial Conclave

Rare Void Corruption

Paragon Protocol

Occasional Eclipsed

Every battle protects ancient knowledge.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Ancient Alloys

Quantum Crystals

Knowledge Fragments

Civilisation Records

Prototype Components

Guardian Technology

Afterlight Keys

Legendary Research Materials

Resources accelerate endgame progression.

==================================================
POINTS OF INTEREST
==================================================

Support:

Planetary Libraries

Stellar Observatories

Ancient Councils

Knowledge Wells

Guardian Temples

Quantum Bridges

Memory Archives

Civilisation Monuments

Exploration constantly rewards curiosity.

==================================================
BIOME EVENTS
==================================================

Support:

Archive Activation

Guardian Awakening

Knowledge Recovery

Energy Alignment

Stellar Synchronisation

Ancient Broadcast

Quantum Cascade

Relay Restoration

Events reveal civilisation history.

==================================================
EXPLORATION
==================================================

Players may discover:

Civilisation History

Afterlight Origins

Ancient Language

Precursor Technology

Hidden Archives

Legendary Blueprints

Lost Commanders

Planetary Records

Every discovery answers questions while creating new mysteries.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Archive Intelligence

Guardian Prime

Ancient Architect

Planetary Custodian

Afterlight Overseer

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Ancient Core teaches:

Who built Afterlight.

Why civilisation disappeared.

The true scale of precursor technology.

Their relationship with the Void.

Their greatest achievements.

Their greatest mistakes.

This biome fundamentally changes player understanding of the universe.

==================================================
ACCESSIBILITY
==================================================

Support:

Readable glyphs

Reduced bloom

Hazard indicators

High Contrast

Colour-blind support

Reduced environmental motion

Clear navigation paths

==================================================
PERFORMANCE
==================================================

Stream megastructures.

Pool guardian effects.

Reuse architectural assets.

Optimise lighting.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Archive Status

Guardian Activity

Knowledge Recovery

Ancient Systems

Discovery %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Ancient Core Biome.

Every future precursor world, megastructure and civilisation expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Ancient Core missions.

Review exploration.

Review environmental storytelling.

Review architecture.

Review hazards.

Review events.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-061.

Adjust archive pacing.

Adjust environmental storytelling.

Adjust discovery rewards.

Remove repetitive architectural layouts.

Ensure the Ancient Core becomes the single most awe-inspiring location in Afterlight, revealing the history of the galaxy through exploration while maintaining excellent gameplay, readability and replayability.

Repeat until the Ancient Core Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-062.

---

## Foundation / AF-000–061 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058→061 content-module shape, applied to the precursors' preserved civilisation.** `ANCIENT_CORE_BIOME` is a plain AF-036 `BiomeDef`: THREE AF-035 hazard zones that feel INTENTIONAL rather than natural, exactly as the spec demands — a Security Field stripping shields through AF-054's shieldBreak status (its first use as a biome hazard), a heavy statusless precision Defence Laser, and a Temporal Lock applying AF-052's stasis root (the archive freezes what it cannot identify). Three weathers with real AF-020 forces and — a deliberate authored statement — ZERO visibility reduction: technological perfection never obscures, readability was a precursor value too (asserted per-def). Four weighted events led by `ancientVault`, and AF-023 smart-loot weights that are the richest endgame spread of any biome (ancientArtifact/relic/researchSample highest yet, plus loreObject — knowledge as loot). Both vocabulary mappings (7 weather names, 8 event names) are total onto the locked shelves.
- **"Civilisation at its absolute peak" is numbers:** `threatModifier: 1.45` (asserted strictly above AF-061's 1.35 — the deepest authored biome, completing the five-biome ladder 0.9 → 1.15 → 1.25 → 1.35 → 1.45), precursor-maintained natives through AF-036's live `enemyBuff` hook (`shieldCapacity +16`), and `hazardImmunities: ["shieldBreak", "stasis"]` — the security recognises its keepers. All asserted, not intended.
- **A REAL boss, not a promise:** `bossId` resolves to the authored Hollow Sentinel — the ancient-guardian BossDef that watches Prismheart's temple guards its makers' home, `SANDBOX_BOSSES`-resolution-tested. The five Core boss kinds (Guardian Prime's class already playable through the Sentinel) are registered vocabulary binding as further `BossDef`s when authored.
- **Enemy Presence follows the spec exactly:** the full six-def AF-050 Custodian roster primary (every battle protects ancient knowledge — this is what the vigil guards), two Celestial Conclave entities (the cosmic order attends), rare Void corruption (their relationship with the Void, still leaking — the `voidBreach` event carries the same thread), a Paragon prototype (their experiments came home), one occasional Eclipsed. Every id resolution-tested across five rosters.
- **First Light joins the galaxy additively:** a new `ancientCore` region and system (threat 6 — the highest in the galaxy — Custodian dominant, reached past even Hollow Crown: FOUR real travel hops crossing everything the precursors left behind, no Fast Travel gate) carrying `biomeId: "ancient-core"` through AF-058's registry — the fifth consumer of AF-038's field — with an ancient-council POI (`ancientVaults` kind) discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the First Light knowledge vault discovers `LORE_ANCIENT_CORE_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-ancient-core` entry (cross-referencing the Custodian profile AND AF-050's security doctrine — who built Afterlight, who guards it, and why taught as one chain, answering questions while creating new mysteries) with zero Missing Links. A Collapsed Gate gives the `destroyObstacle` interaction kind its FIRST producer since AF-036 registered it — with AF-062, all seven locked interaction kinds now have producers.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity INCLUDING real-BossDef resolution, the five-faction enemy-presence structure (≥6 Custodian primary + all four guest presences), all three real hazard ticks including the shieldBreak and stasis status assertions, the peak-civilisation assertions (dual keeper immunity, live buff hook, threat strictly above AF-061's, zero visibility reduction), real `GalaxyRuntime` travel through Hollow Drift, Forge Primus and Hollow Crown to First Light resolving the Core `biomeId` at threat 6, `BiomeRuntime` integration (weather/events only from the Core's own pools across 4,000 steps), the knowledge-vault discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Core's hazards always fire ("the vigil never lapses", literally asserted). **Live in the browser:** travelled Lucent Gate → Hollow Drift → Forge Primus → Hollow Crown → First Light via four real travel buttons, launched, and the Core ran live — `biome First Light · weather crystalRain (8s) · hazards 3` and `galaxy First Light (ancientCore)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the fifth biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; the last dormant interaction kind given its first producer; a real boss bound). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ANCIENT_CORE_BIOME.md`, `src/game/biomes/ancientCoreBiome.ts`.
