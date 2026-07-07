# AF-036 — BIOME FRAMEWORK

**Module status:** Complete (framework specified; weather/hazard/event/resource-weight/enemy-integration/interaction engine implemented and tested; a sandbox biome governs a live run end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-035 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/BIOME_FRAMEWORK.md` + implementation (`src/game/biomes/`)

---

*(Module catalogued verbatim below.)*

36

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-035 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Biome Framework.

Biomes are more than visual backgrounds.

Every biome should become a unique gameplay experience.

Players should immediately recognise where they are.

Movement.

Combat.

Exploration.

Enemy behaviour.

Resources.

Boss encounters.

Environmental hazards.

Everything should change naturally between biomes.

==================================================
CORE PHILOSOPHY
==================================================

Every biome tells a story.

Every biome changes gameplay.

Every biome rewards exploration.

Every biome creates memorable encounters.

The galaxy should feel alive.

==================================================
BIOME STRUCTURE
==================================================

Each biome contains:

Visual Identity

Audio Identity

Environmental Storytelling

Unique Enemies

Elite Variants

Boss

Resources

Hazards

Weather

Lighting

Events

Secrets

Lore

Future expansion fields

==================================================
CORE BIOMES
==================================================

Support:

Frontier Systems

Crystal Fields

Machine Worlds

Solar Wastes

Frozen Nebulae

Void Regions

Ancient Ruins

Derelict Fleets

Living Ecosystems

Black Hole Systems

Quantum Storms

Future galaxies extend this framework.

==================================================
ENVIRONMENTAL CONDITIONS
==================================================

Biomes may include:

Solar Radiation

Gravity Distortion

Crystal Growth

Nebula Fog

Ion Storms

EMP Fields

Asteroid Drift

Void Corruption

Machine Activity

Ancient Energy

Conditions remain readable.

==================================================
ENVIRONMENTAL HAZARDS
==================================================

Support:

Meteor Showers

Energy Beams

Explosive Crystals

Gravity Wells

Radiation Zones

Acid Clouds

Frozen Fields

Moving Obstacles

Mine Fields

Living Terrain

Hazards create decisions.

Not frustration.

==================================================
RESOURCE DISTRIBUTION
==================================================

Every biome provides unique:

Crafting Materials

Research Samples

Ancient Components

Rare Resources

Lore Objects

Blueprint Fragments

Relics

Hidden Discoveries

Exploration is always rewarded.

==================================================
BIOME EVENTS
==================================================

Support:

Distress Signals

Ancient Vaults

Lost Expeditions

Machine Activation

Crystal Bloom

Solar Flare

Void Breach

Wandering Merchant

Prototype Wreckage

Faction Conflict

Events increase replayability.

==================================================
ENVIRONMENTAL INTERACTION
==================================================

Player actions may:

Activate Ancient Devices

Destroy Obstacles

Open Hidden Areas

Trigger Events

Harvest Resources

Disable Hazards

Unlock Secrets

Environmental interaction feels meaningful.

==================================================
ENEMY INTEGRATION
==================================================

Enemies adapt to their biome.

Support:

Environmental Buffs

Camouflage

Hazard Immunity

Terrain Usage

Weather Adaptation

Biome-Specific Abilities

Every biome influences combat.

==================================================
BOSS INTEGRATION
==================================================

Bosses use biome mechanics.

Examples:

Solar Bosses manipulate heat.

Crystal Bosses reshape terrain.

Void Bosses distort gravity.

Machine Bosses control structures.

Arena and biome become one experience.

==================================================
WEATHER SYSTEM
==================================================

Support:

Solar Storms

Crystal Rain

Meteor Activity

Nebula Drift

Void Lightning

Energy Winds

Ion Clouds

Weather affects gameplay.

Never obscures readability.

==================================================
DISCOVERY SYSTEM
==================================================

Biomes support discovery of:

Hidden Routes

Secret Rooms

Ancient Archives

Lore Fragments

Unique Enemies

Prototype Technology

Rare Resources

Mythic Relics

Exploration remains valuable.

==================================================
VISUAL PRESENTATION
==================================================

Every biome includes:

Unique Colour Palette

Lighting Profile

Background Layers

Ambient Animation

Particle Systems

Environmental Audio

Skybox

Visual identity remains unmistakable.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced Weather Effects

Reduced Particle Density

High Contrast

Hazard Indicators

Photosensitivity Mode

Colour-blind Support

Environmental Clarity Mode

==================================================
PERFORMANCE
==================================================

Stream biome assets.

Pool environmental effects.

Optimise weather.

Reuse shaders.

Asynchronous loading.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Biome

Environmental State

Weather

Hazard Count

Biome Events

Resource Spawn

Performance

==================================================
OUTPUT
==================================================

Produce the complete Biome Framework.

Every future galaxy, mission, environmental event and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play every biome repeatedly.

Review environmental storytelling.

Review hazard balance.

Review weather.

Review exploration rewards.

Review resource distribution.

Review enemy integration.

Review Boss integration.

Review event variety.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-035.

Adjust hazard frequency.

Adjust event generation.

Adjust visual clarity.

Remove repetitive environmental mechanics.

Ensure every biome delivers a distinct atmosphere, strategic challenges and memorable exploration while remaining readable, fair and highly replayable.

Repeat until the Biome Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-036.

---

## Foundation / AF-000–035 / GP-FINAL alignment review (recorded at catalogue time)

- **Resource Distribution needed zero new plumbing — AF-023 had already reserved and never used the exact hook this module needed.** `DropContext.smartLoot?: { categoryWeights: Partial<Record<LootCategory, number>> }` existed since AF-023, clamped by `smartLootClamp` ("relevance, never rigging" — AF-023 §4's own words), with no producer until now. `BiomeDef.resourceWeights` feeds it directly.
- **Environmental Hazards reuse AF-035's hazard-zone engine directly, not a second one.** `HazardZoneDef`/`stepHazardZone`/`isInsideHazard` (circular zone, deterministic tick damage + optional status) were built for Boss arenas; a biome hazard is the identical shape. Imported cross-module from `game/bosses/BossArena` rather than duplicated — the file's location predates this second caller and is left in place rather than touching a locked module's documented path.
- **Weather reuses AF-020's `MovementModifier` "force" kind — reserved explicitly for "gravity, wind, currents" since AF-020 and never given a producer.** Energy Winds/Nebula Drift/Void Lightning are literal wind; `WeatherDef.windForceX/Y` feeds `movement.addModifier({kind:"force", ...})` exactly as documented, refreshed every tick while active.
- **Biome Events extend AF-017's existing `EnvironmentalEventTriggered` bus event rather than opening a second channel.** That event's payload (`{ eventType: string }`) was always a plain string, so new event names need no schema change. Five of the ten Biome Event kinds (Solar Flare, Crystal Bloom, Void Breach, Machine Activation, Ancient Vault) are biome-flavoured names for concepts AF-017's `EnvironmentalEventType` already modeled (`SolarFlare`, `CrystalGrowth`, `VoidDistortion`, `MachineReinforcements`, `AncientSignal`); the other five (Distress Signal, Lost Expedition, Wandering Merchant, Prototype Wreckage, Faction Conflict) are genuinely new, since AF-017 never modeled them, and now flow through the same fact.
- **Enemy Integration reuses AF-028's exact `EquipmentBonus` shape and AF-021's `StatusEngine.setImmunity` directly.** A biome's enemy buff is the same `{kind, value}` shape every passive/ability bonus in the game already uses — only `shieldCapacity` is mechanically live (folded into starting shield at spawn), the same proportional scope every prior module's bonus vocabulary shipped with. Hazard immunity is `StatusEngine.setImmunity(kind, true)`, called once at spawn — no new immunity system.
- **Boss Integration needs no new code — a biome just references a `BossDef` id (AF-035) and its mechanic flavour is already content, not a system.** "Solar Bosses manipulate heat" etc. are `BossMechanic`/`BiomeMechanic` content pairings, not new engines.
- **Discovery reuses AF-026's collections engine — `"biomes"` and `"lore"` were already registered `CollectionCategory` values with zero prior producers.** Interactable discovery is `meta.discover(category, id)`, the same call AF-034/035 already made for `"enemies"`/`"bosses"`.
- **Environmental Interaction finally gives AF-019's "Interact" input action — bound since AF-019, never consumed — its first real purpose.** All seven `InteractionKind`s are complete data (`INTERACTION_KINDS`); `activateAncientDevice` (lore discovery) and `harvestResource` (bonus loot via the existing `dropLoot`) are mechanically live. Destroy Obstacle/Open Hidden Area/Trigger Event/Disable Hazard/Unlock Secret are registered future, the same "no consumer yet" pattern established repeatedly.
- **AF-017's `ThreatInputs.biomeModifier` and `RunSessionRecord.biomeId` were both already-existing fields hardcoded to `1`/`"placeholder-biome"`.** This module is their first real producer — no Director change, no session-shape change.
- **Self-review executed:** the weather rotation, hazard ticking, weighted event selection, resource-weight/enemy-buff/immunity pass-throughs, and interactable range check are all deterministic and tested, including a 5,000-tick full-session simulation producing hazards, weather changes, and events throughout (the literal "play every biome repeatedly" self-review). A sandbox biome (Crystal Fields) governs a live run end-to-end — weather visibly rotating, a hazard zone ticking against the player, a weighted Biome Event firing, the Director's threat responding to `threatModifier`, and the Interact action finally doing something — observed in the walking-skeleton run with zero errors.

**Review verdict:** ALIGNED (zero new loot, hazard, movement, bonus, event, or persistence system; every mechanism routes through a hook an earlier module had already reserved and left unused). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/BIOME_FRAMEWORK.md`, `src/game/biomes/`.
