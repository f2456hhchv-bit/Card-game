# equipment — Equipment Framework (AF-028, game layer)

**Purpose:** The slot vocabulary and stat maths for builds. Resolves AF-027's deferred loadout shape; routes every bonus into an existing system — no new stat pipeline.

**Responsibilities:** Slot vocabulary + slot-type acceptance table, bonus aggregation (additive across items), set-bonus layering (additive on top, never subtractive), build validation with named failure reasons, passive-trigger and active-module data shapes.

**Dependencies:** none beyond its own data — this module computes; the composition root writes `AggregateResult.bonuses` into AF-020's `MovementProfile`, AF-021's `OffensiveModifiers`/`DefenceState`, AF-022's XP/magnet tuning, AF-025's yield multipliers.

**Events:** none owned — passive triggers consume existing bus facts (`EnemyKilled`, `PlayerDamaged`, `ShieldBroken`, `DamageDealt`).

**Data structures:** `EquipmentSlot`/`SLOT_ACCEPTS`, `EquipmentItemDef`, `SetDef`, `AggregateResult`, `ValidationResult` (discriminated by `reason`).

**Extension points:** new bonus kinds extend `BonusKind` when their consuming system exists (drone/orbital effectiveness await those systems); new passive triggers extend `PassiveTrigger` when their consuming system exists (boss/mission-modifier); loadout storage stays AF-027's — this module supplies vocabulary and math only.

**Known limitations:** droneEffectiveness/orbitalPower and onBossPresent/onMissionModifier are registered but have no consumer yet; equipment screen (grid/comparison/synergy indicators) builds from AF-005 at the UI module.
