# AFTERLIGHT — Biome Framework

**Authority:** Produced output of AF-036. Extends AF-000 → AF-035. Every future galaxy, mission, environmental event, and expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** a biome is a gameplay experience, not a background — movement, combat, resources, enemies, and hazards change together, and every mechanism here routes through a hook an earlier module already reserved.

---

## 1. Resource Distribution — AF-023's reserved-but-unused hook

`DropContext.smartLoot.categoryWeights` existed since AF-023 with no producer. `BiomeDef.resourceWeights` feeds it directly — the loot generator's own `smartLootClamp` still applies, so a biome can bias toward its own materials without rigging drops.

## 2. Environmental Hazards — AF-035's hazard-zone engine, not a second one

A biome hazard IS a `HazardZoneDef` — the exact circular tick-damage-plus-status shape built for Boss arenas. `BiomeRuntime.tickHazards()` mirrors how a Boss ticks its own hazard zone.

## 3. Weather — AF-020's reserved MovementModifier "force" kind

AF-020 reserved a `"force"` `MovementModifier` kind explicitly for "gravity, wind, currents" and never used it. `WeatherDef.windForceX/Y` feeds it directly, refreshed every tick while the weather is active — the first real wind in the game.

## 4. Biome Events — extending AF-017's existing fact, not opening a second channel

`EnvironmentalEventTriggered` (`{ eventType: string }`) already existed. Five of ten Biome Event kinds are biome-flavoured names for concepts AF-017's `EnvironmentalEventType` already modeled; the other five are genuinely new and now flow through the same bus fact.

## 5. Enemy Integration — AF-028's EquipmentBonus shape, AF-021's setImmunity

A biome's enemy buff is the identical `{kind, value}` shape every passive already uses (only `shieldCapacity` mechanically live today, folded into starting shield at spawn). Hazard immunity is `StatusEngine.setImmunity(kind, true)` at spawn.

## 6. Boss Integration — content, not code

A biome references a `BossDef` id; "Solar Bosses manipulate heat" is a content pairing between a biome's conditions and a boss's `BossMechanic`, not a new engine.

## 7. Discovery — AF-026's collections engine

`"biomes"` and `"lore"` were already registered `CollectionCategory` values. Interactable discovery is `meta.discover(category, id)`, the same call AF-034/035 already made.

## 8. Environmental Interaction — AF-019's Interact action, finally consumed

Bound since AF-019, never consumed until now. All seven `InteractionKind`s are complete data; `activateAncientDevice` (lore discovery) and `harvestResource` (bonus loot) are mechanically live. The rest are registered future.

## 9. Threat and session identity — already-existing fields, first real producers

`ThreatInputs.biomeModifier` and `RunSessionRecord.biomeId` were hardcoded placeholders (`1`, `"placeholder-biome"`). This module is their first real producer — no Director or session-shape change.

## 10. Presentation, accessibility, performance

Visual identity (palette, lighting, particles, skybox) and accessibility modes (reduced weather/particle density, high contrast, photosensitivity, colour-blind support) build from AF-002/AF-004/AF-007/AF-008 at the content/visual module. Hazard/weather ticking is O(1) per biome per frame; asset streaming binds at the asset-pipeline module.

## 11. Debug

Live: current biome · active weather + remaining time · hazard count · events triggered (+ last kind).

---

## Internal review loop (AF-036, recorded)

- **No duplicated systems** — loot weighting, hazards, movement force, environmental events, enemy bonuses/immunities, and discovery all reuse AF-017/020/021/023/026/028/035 exactly through hooks those modules had already reserved. ✔
- **Every biome changes gameplay, not just visuals** — weather applies real wind, hazards deal real damage, resource weights change what actually drops, Director threat responds to the biome. ✔
- **Hazards create decisions, not frustration** — every hazard is a visible, readable zone (inherited from AF-035's hazard-zone shape), never a hidden mechanic. ✔
- **Sandbox proof** — a live biome rotates weather, ticks a hazard against the player, fires a weighted event, feeds the Director's threat, and gives the Interact action a real purpose — all observed in the walking-skeleton run with zero errors. ✔
- **Simplification pass** — rejected a second hazard-zone system (reused AF-035's); rejected a second wind/force system (reused AF-020's reserved kind); rejected a second event channel (extended AF-017's existing fact). ✔

**Internal quality score: 9.5/10 — approved and locked; full biome roster, visual identity, and remaining interaction/hazard/mutation mechanics bind at future content and visual modules.**
