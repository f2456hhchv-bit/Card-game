# ships — Ship Framework (AF-031, game layer)

**Purpose:** Battlefield behaviour, not raw power. A ship IS an AF-020 `MovementProfile` producer plus an AF-021 `DefenceState` seed — movement and handling matter as much as firepower.

**Responsibilities:** Data shapes for hull/shield/energy/movement/passive/ability (`shipData`), the no-overlap fingerprint check (`findShipOverlap`, mirroring AF-030's `findOverlap`), energy tracking and ability cooldown/cost gating (`ShipRuntime`).

**Dependencies:** `game/movement` (`MovementProfile` — the ship's movement profile IS this type, finally populating AF-020's reserved handling fields). `game/equipment` (`ActiveModule`, `EquipmentBonus`, `PassiveTrigger`, `BonusTotals` — reused, not duplicated). Mastery/progression are `game/meta`'s existing `ship:<id>` tracks — this module adds no persistence beyond the one new resource below.

**New resource — Energy:** the first genuinely new numeric resource added to the game (AF-031), scoped tightly to ability activation cost. Regenerates continuously; abilities are gated on both cooldown *and* available energy.

**Data structures:** `ShipDef`, `ShipPassive`, `ShipAbility` (an `ActiveModule` plus `energyCost`), `ShipSnapshot`.

**Extension points:** new ships are data, checked against `findShipOverlap` before shipping; new classes extend the `ShipClass` union; ship cosmetics use AF-026's existing `MasteryReward` union (no new reward shape needed) — customisation is structurally gameplay-neutral.

**Known limitations:** the Hangar (inspect/compare/cosmetics/select/preview/loadouts) builds from AF-005/AF-027-pattern UI at the UI implementation module; only one sandbox ship governs the walking-skeleton run at a time (roster switching is a Galaxy Command UI concern, not this module's).
