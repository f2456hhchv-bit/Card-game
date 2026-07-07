# commanders — Commander Framework (AF-030, game layer)

**Purpose:** Playstyle identity, not raw power. A Commander's four-hook signature (passive, active, ultimate, signature mechanic) reuses existing ability/bonus vocabularies; mastery and progression reuse AF-026's engine entirely.

**Responsibilities:** Data shapes for the four-hook signature (`commanderData`), the no-overlap fingerprint check, active-ability cooldown and ultimate charge tracking (`CommanderRuntime`).

**Dependencies:** `game/equipment` (`ActiveModule`, `EquipmentBonus`, `PassiveTrigger`, `BonusTotals` — reused, not duplicated). Mastery/progression are `game/meta`'s existing `commander:<id>` tracks — this module adds no persistence.

**Events:** the composition root emits `CommanderAbilityUsed`/`CommanderUltimateFired`; ultimate charge consumes existing `EnemyKilled`/`DamageDealt` facts.

**Data structures:** `CommanderDef`, `CommanderPassive`, `CommanderUltimate` (the one new model — charge-gated activation), `CommanderSignatureMechanic`, `CommanderSnapshot`.

**Extension points:** new Commanders are data, checked against `findOverlap` before shipping; new archetypes extend the union; Commander-specific cosmetics use AF-026's existing `MasteryReward` union (no new reward shape needed).

**Known limitations:** Commander selection screen builds from AF-005/AF-007 at the UI module; only one sandbox Commander governs the walking-skeleton run at a time (roster switching is a Galaxy Command UI concern, not this module's).
