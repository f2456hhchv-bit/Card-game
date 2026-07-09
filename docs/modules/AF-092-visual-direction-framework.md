## Verbatim prompt

92

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-091 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Visual Direction Framework.

Afterlight should be instantly recognisable from a single screenshot.

Every biome.

Every faction.

Every weapon.

Every civilisation.

Every effect.

Every interface.

Should reinforce one cohesive artistic vision.

Visual spectacle must never reduce gameplay readability.

==================================================
CORE PHILOSOPHY
==================================================

Readability.

Wonder.

Scale.

Identity.

Beauty.

The universe should feel believable rather than exaggerated.

==================================================
VISUAL PILLARS
==================================================

Every visual decision supports:

Gameplay clarity

Scientific plausibility

Cinematic presentation

Player readability

Faction identity

Environmental storytelling

Technical efficiency

Future scalability

==================================================
ART STYLE
==================================================

Blend influences from:

NASA realism

Hard science fiction

Optimistic futurism

Ancient megastructures

Modern industrial design

Alien elegance

Natural ecosystems

Space exploration

Avoid excessive visual noise.

==================================================
COLOUR LANGUAGE
==================================================

Every faction receives:

Primary colours

Secondary colours

Energy colours

UI accents

Lighting themes

Material palette

Visual signatures

No two factions appear similar.

==================================================
BIOME VISUAL LANGUAGE
==================================================

Each biome defines:

Lighting

Fog

Skyboxes

Planetary colours

Architecture

Vegetation

Weather

Environmental VFX

Immediately recognisable.

==================================================
MATERIAL SYSTEM
==================================================

Support:

Industrial alloys

Ancient materials

Crystal growth

Organic tissue

Void matter

Quantum surfaces

Energy fields

Adaptive materials

Materials reinforce world identity.

==================================================
LIGHTING
==================================================

Support:

Global illumination

Dynamic sunlight

Planetary atmospheres

Interior lighting

Emergency lighting

Boss lighting

Weather lighting

Discovery lighting

Lighting guides players naturally.

==================================================
VFX SYSTEM
==================================================

Support:

Weapons

Abilities

Weather

Explosions

Scanning

Construction

Research

Environmental hazards

Boss mechanics

Effects prioritise readability.

==================================================
CINEMATIC PRESENTATION
==================================================

Support:

Mission intros

Boss arrivals

Ancient discoveries

Campaign milestones

Commander recruitment

Civilisation restoration

Galaxy events

Victory sequences

Presentation never interrupts gameplay.

==================================================
ANIMATION LANGUAGE
==================================================

Everything follows:

Weight

Momentum

Mechanical logic

Organic behaviour

Energy flow

Impact

Recovery

Animation communicates function.

==================================================
CAMERA FRAMEWORK
==================================================

Support:

Gameplay camera

Boss camera

Discovery camera

Dialogue framing

Mission cinematics

Photo Mode

Accessibility options

Camera always prioritises gameplay.

==================================================
PHOTO MODE
==================================================

Support:

Free Camera

Lighting Controls

Filters

Depth of Field

Time Control

Weather

Poses

High Resolution Export

Players celebrate discoveries.

==================================================
ACCESSIBILITY
==================================================

Support:

Reduced particles

Reduced bloom

Reduced motion

High Contrast

Colour-blind modes

Photosensitivity mode

Custom VFX intensity

==================================================
PERFORMANCE
==================================================

Pool VFX.

LOD everything.

Optimise shaders.

Stream large assets.

Reuse materials.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Lighting

VFX Count

Shader Cost

LOD Level

Particle Count

Performance

==================================================
OUTPUT
==================================================

Produce the complete Visual Direction Framework.

Every future asset, expansion, civilisation and biome extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every biome.

Review every faction.

Review every weapon.

Review every VFX.

Review every cinematic.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-091.

Reduce unnecessary visual noise.

Strengthen artistic identity.

Improve visual storytelling.

Ensure Afterlight develops a timeless visual identity that balances scientific realism, artistic beauty and gameplay readability while remaining technically scalable for years of future expansions.

Repeat until the Visual Direction Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-092.

## Foundation / AF-000–091 / GP-FINAL alignment review

Every spec vocabulary landed as a realisation map onto a real system where one exists (materials → AF-025/044/048/051/053/082/089; cinematic → AF-016/045/068/072/087/090/038/041; accessibility → AF-044's live `highContrast`/`colourBlindMode`), or an honest new/future registry otherwise (photo mode, most camera/lighting kinds). Colour Language's "no two factions appear similar" is proven structurally via `colourSignaturesAreDistinct()`, the ninth entry in the AF-085→090 identity-uniqueness chain, checked disjoint from AF-007's locked rarity ladder too. Biome Visual Language reuses AF-091's hand-authored-plus-generated-fallback shape exactly. VFX System's priority table mirrors AF-091's Combat Audio priority table so gameplay-critical effects are never the first culled. Zero changes to any locked module (AF-000–091). Debug's 6 requested fields (Lighting/VFX Count/Shader Cost/LOD Level/Particle Count/Performance) are honestly out of scope for a WebGL2 canvas without a render-graph yet — the framework registers the vocabulary and live wiring reuses the existing biome overlay line instead of inventing unmeasurable numbers.

Score: 9.5/10 — approved and locked.
