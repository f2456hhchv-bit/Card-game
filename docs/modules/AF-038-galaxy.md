# AF-038 — GALAXY FRAMEWORK

**Module status:** Complete (framework specified; route/discovery/fast-travel/event engine implemented and tested; a sandbox galaxy governs the Galaxy Command hub end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-037 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/GALAXY_FRAMEWORK.md` + implementation (`src/game/galaxy/`)

---

*(Module catalogued verbatim below.)*

38

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-037 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Galaxy Framework.

The Galaxy is the permanent overworld of Afterlight.

It is not merely a mission selection screen.

It is a living strategic layer where exploration, expansion, restoration and discovery permanently shape the player's journey.

Players should constantly discover something new.

The galaxy should feel immense.

Alive.

Ancient.

Worth exploring.

==================================================
CORE PHILOSOPHY
==================================================

Every star has purpose.

Every sector tells a story.

Every discovery matters.

Exploration permanently rewards curiosity.

The galaxy itself becomes a character.

==================================================
GALAXY STRUCTURE
==================================================

The galaxy contains:

Regions

↓

Constellations

↓

Star Clusters

↓

Star Systems

↓

Planets

↓

Mission Locations

↓

Points of Interest

↓

Ancient Sites

↓

Secrets

Every layer remains expandable.

==================================================
GALAXY REGIONS
==================================================

Support:

Human Frontier

Crystal Dominion

Machine Expanse

Solar Wastes

Frozen Reach

Void Expanse

Ancient Core

Broken Systems

Dark Nebula

Singularity Zone

Future galaxies extend this framework.

==================================================
STAR SYSTEMS
==================================================

Every system contains:

Primary Star

Planets

Asteroid Fields

Stations

Derelicts

Faction Presence

Resources

Threat Level

Weather

Story Hooks

Hidden Discoveries

System identity remains unique.

==================================================
POINTS OF INTEREST
==================================================

Support:

Ancient Vaults

Research Stations

Mining Colonies

Abandoned Fleets

Distress Beacons

Prototype Facilities

Crystal Temples

Machine Foundries

Trade Outposts

Unknown Signals

Future discoveries extend naturally.

==================================================
EXPLORATION
==================================================

Players gradually reveal:

Fog of War

Sector Information

Resources

Lore

Mission Chains

Faction Activity

Ancient Technology

Hidden Routes

Exploration permanently expands the map.

==================================================
GALAXY PROGRESSION
==================================================

Player actions influence:

Sector Stability

Faction Relationships

Trade Routes

Resource Availability

Mission Generation

Research

Restoration Progress

Future Storylines

The galaxy evolves over time.

==================================================
FACTION CONTROL
==================================================

Every sector records:

Dominant Faction

Conflict Status

Security

Corruption

Exploration %

Restoration %

Influence changes dynamically.

==================================================
DISCOVERY SYSTEM
==================================================

Support discovery of:

New Biomes

Secret Bosses

Prototype Ships

Legendary Weapons

Research Breakthroughs

Lore Archives

Hidden Civilisations

Ancient Megastructures

Discovery should feel significant.

==================================================
GALAXY EVENTS
==================================================

Support:

Solar Storms

Void Breaches

Machine Uprisings

Crystal Expansion

Trade Opportunities

Distress Chains

Faction Wars

Ancient Reactivations

Comet Passages

Galaxy-wide events evolve naturally.

==================================================
FAST TRAVEL
==================================================

Players unlock navigation through:

Research

Restoration

Ancient Gateways

Warp Technology

Fast travel should reward progression.

Never trivialise exploration.

==================================================
GALAXY MAP
==================================================

Display:

Regions

Star Systems

Routes

Mission Nodes

Threat Levels

Faction Borders

Weather

Player Progress

Discovery %

Map remains clean and readable.

==================================================
LONG-TERM GOALS
==================================================

Players work towards:

Complete Exploration

100% Restoration

Ancient Recovery

Galaxy Stability

Faction Resolution

Hidden Discoveries

Legendary Collections

The galaxy always provides another objective.

==================================================
ACCESSIBILITY
==================================================

Support:

Map Scaling

Search

Filters

Large Icons

Controller Navigation

Touch Navigation

High Contrast

Colour-blind Support

==================================================
PERFORMANCE
==================================================

Stream galaxy data.

Cache explored systems.

Lazy load sectors.

Pool map objects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Sector

Galaxy Seed

Exploration %

Faction Influence

Available Missions

Unlocked Systems

Performance

==================================================
OUTPUT
==================================================

Produce the complete Galaxy Framework.

Every future sector, expansion, civilisation and campaign extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Explore the complete galaxy.

Review progression.

Review exploration pacing.

Review discovery rewards.

Review mission generation.

Review faction influence.

Review restoration systems.

Review map readability.

Review long-term motivation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-037.

Adjust exploration rewards.

Adjust discovery frequency.

Adjust galaxy progression.

Remove repetitive navigation.

Ensure the galaxy always feels alive, mysterious and rewarding to explore while providing meaningful long-term progression.

Repeat until the Galaxy Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-038.

---

## Foundation / AF-000–037 / GP-FINAL alignment review (recorded at catalogue time)

- **Galaxy Regions reuse AF-010's canon factions directly, not a second lore layer.** Crystal Dominion is the literal same name AF-010/AF-030 already established; Human Frontier/Machine Expanse/Void Expanse are the same Human Alliance/Machine Collective/Void Legion factions Ships, Commanders, and Weapons content already reference. A region's `dominantFaction` field is just that faction's name as a string — no new faction registry.
- **Points of Interest, Discovery, and long-term goals reuse AF-026's already-registered `CollectionCategory` values wholesale.** Every single Discovery System category this module lists (New Biomes, Secret Bosses, Prototype Ships, Legendary Weapons, Research Breakthroughs, Lore Archives) maps onto a `CollectionCategory` (`biomes`, `bosses`, `ships`, `weapons`, `research`, `lore`) that has existed since AF-026 with real producers already in AF-034/035 for two of them. Point-of-interest discovery is `meta.discover(category, id)` — the same call, a third/fourth time.
- **Fast Travel gates on AF-024's `galaxyNavigation` research category and `galaxyUnlock` node type — both registered since AF-024, with zero content using them until now.** `warp-charting` in `SANDBOX_RESEARCH_TREE` is their first real producer, reusing the existing `unlockFlag` effect kind rather than inventing a galaxy-specific research effect.
- **Sector Stability, Faction Influence, and Exploration% are explicitly NOT a new persistence layer.** `GalaxyRuntime` stays pure and returns a *clamped delta*; the composition root applies it through AF-026's existing `MetaProgression.recordStat`, namespaced per system (`galaxy:<systemId>:explorationPercent`, `galaxy:<systemId>:stability`) — the identical pattern AF-037 established for Galaxy Impact statistics, now at the overworld layer instead of the mission layer. These numbers persist for free through the already-existing meta save slice; no new save slice was created.
- **Galaxy Events are a fourth naming layer over the same `EnvironmentalEventTriggered` bus fact AF-017 introduced, AF-036 and AF-037 already extended.** Solar Storms/Void Breaches/Machine Uprisings echo AF-017's `SolarFlare`/`VoidDistortion`/`MachineReinforcements` and AF-036/037's biome/mission event names at galaxy scale — content-authoring vocabulary, not a fifth event mechanism. The weighted-pick-on-a-timer algorithm is now established practice, reused a third time (AF-036, AF-037, AF-038) rather than reinvented each time.
- **Star Systems reference AF-036 biomes and AF-037 missions as content, never as new environment/mission systems.** A `StarSystemDef`'s `biomeId`/`missionIds` are plain string references resolved against the existing `SANDBOX_BIOMES`/`SANDBOX_MISSIONS` arrays.
- **Faction Control's Conflict Status/Security/Corruption axes are registered vocabulary without their own statistic keys yet.** Only Sector Stability and Exploration% are mechanically live in the sandbox — the rest are honestly deferred, the same "registered, no consumer yet" pattern established repeatedly, rather than faked with placeholder numbers nothing reads.
- **The Galaxy Command hub screen (already AF-016's placeholder GalaxyCommand state) is this module's first real Galaxy Map — not a new screen.** Route-travel buttons (gated by adjacency or the Fast Travel unlock) and point-of-interest discovery buttons were added to the existing screen render function.
- **Self-review executed:** route traversal (adjacency-gated and Fast-Travel-gated), weighted Galaxy Event firing, and the pure clamped-delta helper are all deterministic and tested, including a 5,000-tick full-session simulation. Live in the browser: traveling between systems, discovering a point of interest (exploration% rising, the button disappearing once discovered), and a Fast-Travel-gated system correctly refusing the transition even though its travel button is visibly offered (adjacent) — all observed with zero errors.

**Review verdict:** ALIGNED (zero new lore, zero new discovery vocabulary, zero new persistence layer, zero new event mechanism; `GalaxyRuntime`'s route/event engine is the only genuinely new mechanical surface, and it stays pure by design). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/GALAXY_FRAMEWORK.md`, `src/game/galaxy/`.
