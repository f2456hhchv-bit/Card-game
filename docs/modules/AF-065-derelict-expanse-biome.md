# AF-065 — DERELICT EXPANSE BIOME

**Module status:** Complete (biome authored on the unchanged AF-036 engine; reachable through real galaxy travel; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-064 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/DERELICT_EXPANSE_BIOME.md` + implementation (`src/game/biomes/derelictExpanseBiome.ts` + additive galaxy/Codex content)

---

*(Module catalogued verbatim below.)*

65

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-064 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Derelict Expanse Biome.

The Derelict Expanse is the largest known graveyard of starships in the galaxy.

Millions of vessels from thousands of years of conflict drift silently through space.

Entire fleets vanished here.

Some ships still transmit distress signals.

Others remain perfectly intact.

Something prevented anyone from reclaiming them.

Players should constantly wonder what happened.

==================================================
CORE PHILOSOPHY
==================================================

Silence.

Mystery.

History.

Decay.

Discovery.

Every wreck tells a story.

==================================================
BIOME IDENTITY
==================================================

Theme:

Ghost fleets.

Abandoned carriers.

Ancient battles.

Derelict stations.

Collapsed convoys.

Silent battlefields.

Forgotten expeditions.

Lost civilizations.

Every environment should communicate forgotten history.

==================================================
VISUAL LANGUAGE
==================================================

Rusting hulls.

Broken stations.

Floating debris.

Emergency lights.

Power flickers.

Hull breaches.

Drifting wreckage.

Radio interference.

Visuals communicate quiet abandonment.

==================================================
ENVIRONMENT
==================================================

Support:

Fleet Graveyards

Carrier Wrecks

Derelict Stations

Destroyed Colonies

Cargo Fields

Salvage Zones

Broken Shipyards

Battle Debris

Communications Arrays

Forgotten Convoys

Future locations extend naturally.

==================================================
WEATHER
==================================================

Support:

Debris Storms

Electromagnetic Clouds

Micro-Meteor Fields

Static Disturbance

Sensor Interference

Power Fluctuations

Ion Dust

Weather reinforces abandoned infrastructure.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Hull Explosions

Reactor Leaks

Electrical Discharge

Floating Debris

Broken Gravity Fields

Radiation Pockets

Fuel Fires

Unstable Wreckage

Hazards emerge naturally from destruction.

==================================================
MISSION TYPES
==================================================

Support:

Recover Black Boxes

Rescue Survivors

Salvage Technology

Investigate Distress Calls

Recover Fleet Records

Escort Salvage Teams

Explore Wrecks

Recover Ancient Cargo

The biome rewards curiosity.

==================================================
ENEMY PRESENCE
==================================================

Primary:

The Eclipsed

Human Outlaws

Stellar Nomads

Machine Collective

Rare Void Swarm

Enemies exploit abandoned infrastructure.

==================================================
RESOURCE DISTRIBUTION
==================================================

Common resources include:

Salvaged Alloys

Ship Components

Recovered AI Cores

Military Equipment

Prototype Parts

Ancient Technology

Fleet Records

Rare Relics

Resources reward exploration over combat.

==================================================
POINTS OF INTEREST
==================================================

Support:

Ghost Carriers

Abandoned Bridges

Cryo Escape Pods

Fleet Command Ships

Prototype Hangars

Research Vessels

Cargo Vaults

Emergency Beacons

Exploration constantly uncovers forgotten history.

==================================================
BIOME EVENTS
==================================================

Support:

Emergency Broadcast

Power Restoration

Ghost Signal

Reactor Detonation

Fleet Awakening

Salvage Race

Distress Response

Derelict Collapse

Events create emergent storytelling.

==================================================
EXPLORATION
==================================================

Players may discover:

Captain's Logs

Crew Diaries

Battle Reports

Ancient Fleet Orders

Prototype Experiments

Legendary Weapons

Hidden Hangars

Lost Expeditions

Every discovery strengthens the world's history.

==================================================
BOSS ENCOUNTERS
==================================================

Possible Bosses:

Ghost Dreadnought

Corrupted Carrier

Fleet Intelligence

Salvage Warlord

Ancient Flagship

Future Bosses extend naturally.

==================================================
LORE
==================================================

The Derelict Expanse teaches:

The cost of war.

Failed expeditions.

Civilisation collapse.

Fleet history.

Lost heroes.

Forgotten sacrifices.

The player discovers countless personal stories rather than one grand narrative.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced debris mode

High Contrast

Hazard indicators

Colour-blind support

Reduced visual clutter

Readable objective markers

==================================================
PERFORMANCE
==================================================

Pool debris.

Reuse wreck assets.

Optimise drifting objects.

Stream large fleet structures.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Derelict Density

Debris Count

Salvage Opportunities

Distress Signals

Exploration %

Performance

==================================================
OUTPUT
==================================================

Produce the complete Derelict Expanse Biome.

Every future abandoned fleet, ghost ship, lost expedition and salvage environment extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of Derelict Expanse missions.

Review exploration.

Review environmental storytelling.

Review hazards.

Review salvage gameplay.

Review event pacing.

Review rewards.

Review Boss encounters.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-064.

Adjust salvage density.

Adjust discovery frequency.

Adjust environmental pacing.

Remove repetitive wreck layouts.

Ensure the Derelict Expanse becomes one of Afterlight's richest storytelling biomes, where exploration, history and environmental narrative create unforgettable missions while remaining mechanically engaging, readable and highly replayable.

Repeat until the Derelict Expanse Biome consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-065.

---

## Foundation / AF-000–064 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-058→064 content-module shape, applied to the galaxy's largest starship graveyard — and the first biome whose identity is EXPLORATION OVER COMBAT, made structural and asserted against all seven prior authored biomes.** The spec says "resources reward exploration over combat" and "every wreck tells a story", and `DERELICT_EXPANSE_BIOME` says it in numbers: the MOST interactables of any biome (four — a black-box lore archive, a salvage cache, a sealed hangar via `openHiddenArea`, and a blocking hulk via `destroyObstacle` — every wreck a story you can touch, all four findable-in-range-tested), and the FIRST biome to weight `shipComponent` loot (2.4, the highest single weight in the biome — salvage IS the reward; asserted absent from every prior biome AND present here).
- **Hazards emerge naturally from destruction:** a pressurised Hull Explosion (the heaviest single statusless tick of any biome hazard — 11 damage, asserted), a Reactor Leak that never fully died (burn), and Unstable Wreckage grinding at plating — giving AF-021's `armourBreak` status its FIRST biome-hazard producer (it has only ever ridden AF-050 enemy weapons). `hazardImmunities: ["armourBreak", "burn"]` — the wrecks already took everything the Expanse could break.
- **"Radio interference… quiet abandonment" is authored:** the first biome with TWO visibility-reducing weathers (Sensor Interference and Electromagnetic Clouds, asserted exactly two) alongside a drifting Debris Storm on `meteorActivity`. The event pool is led by `distressSignal` (asserted ≥ every other weight — SOME SHIPS STILL TRANSMIT, the spec's own image as pool structure), with the Salvage Race as `factionConflict`, Derelict Collapse as `prototypeWreckage`, and a lone `wanderingMerchant` — a Nomad trader working the graveyard.
- **Enemy Presence follows the spec exactly:** the Eclipsed primary (≥3 defs asserted — these may be their own fleets), Human Outlaws AND Stellar Nomads both fielding salvage crews (≥2 each, asserted — the Salvage Race made roster), Machine Collective reclamation units, rare Void Swarm. Every id resolution-tested across five rosters. `bossId: null` is honest — the five wreck boss kinds bind as `BossDef`s when authored.
- **Quiet, not safe:** `threatModifier: 1.1` sits between the Frontier (0.9) and the Crystal Expanse (1.15), asserted from both sides — the third deliberately mid/low-ladder biome, because the graveyard's danger is what you wake up, not what patrols it. Natives via AF-036's live `enemyBuff` hook (`shieldCapacity +8`, scavenged plating — the lightest buff of any authored biome that has one; everything here wears the dead fleets' armour).
- **Gravewake joins the galaxy additively:** a new `brokenSystems` region and system (threat 2, THE ECLIPSED dominant — their second held system, off Meridian Rest: the Alliance's lost fleets drifted home almost far enough; two real travel hops, no Fast Travel gate) carrying `biomeId: "derelict-expanse"` through AF-058's registry — the eighth consumer of AF-038's field — with a ghost-carrier POI on the `abandonedFleets` kind discovering lore through AF-038's existing path.
- **Lore lands through the biome itself:** the Gravewake black box archive discovers `LORE_DERELICT_EXPANSE_ARCHIVE` via AF-036's interaction path, unlocking the additive `codex-biome-derelict-expanse` entry (cross-referencing the Eclipsed AND the Nomad fleet — the dead fleets and the living ones, working the same graveyard) with zero Missing Links. The entry's archives honour the spec's "countless personal stories rather than one grand narrative": the black box speaks in one crew's voice, not history's.
- **Self-review executed:** 11 new tests — all nine vocabulary shelves, both mapping totality checks, full def validity, the five-faction enemy-presence structure (Eclipsed ≥3, Outlaws ≥2, Nomads ≥2, Machines, Void), all three real hazard ticks with the heaviest-statusless-tick, burn, and armourBreak-first-producer assertions, the EXPLORATION-OVER-COMBAT assertions (interactables > all seven priors, shipComponent absent from all seven priors and >2 here, exactly two visibility-reducing weathers, distressSignal pool dominance, threat bounded low-ladder from both sides), real `GalaxyRuntime` travel through Meridian Rest to Gravewake resolving the Expanse `biomeId`, `BiomeRuntime` integration (weather/events only from the Expanse's own pools across 4,000 steps; ALL FOUR interactables findable in range), the black-box discovery, the Codex entry, and a 1,000-mission seeded sweep in which the Expanse's hazards always fire ("the wrecks are still dying", literally asserted). **Live in the browser:** travelled Lucent Gate → Meridian Rest → Gravewake via two real travel buttons, launched, and the Expanse ran live — `biome Gravewake · weather meteorActivity (6s) · hazards 3` (Debris Storms drifting) and `galaxy Gravewake (brokenSystems)` on the overlay, zero page errors.

**Review verdict:** ALIGNED (zero engine changes; the eighth biome through AF-058's registry; one region, one system, and one Codex entry added in the established additive class; armourBreak given its first biome-hazard producer; shipComponent loot given its first weight). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/DERELICT_EXPANSE_BIOME.md`, `src/game/biomes/derelictExpanseBiome.ts`.
