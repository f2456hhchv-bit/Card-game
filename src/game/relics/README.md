# relics — Relic Framework (AF-029, game layer)

**Purpose:** In-run discoveries that fundamentally alter builds. Applies on pickup; every definition must carry a non-numeric clause.

**Responsibilities:** Schema validation (non-numeric-clause law), stacking rules (unique/stackable/mutuallyExclusive/evolving) with exclusion-group conflict detection, symmetric deterministic synergy detection, evolution (base + requirements → evolved form, fires once), numeric aggregation into the shared `BonusTotals` shape (`RelicSystem`); data shapes + sandbox content (`relicData`).

**Dependencies:** `game/equipment` (`BonusKind`, `PassiveTrigger`, `BonusTotals` — reused, not duplicated), `game/loot` (`Rarity` — restricted to 7 tiers).

**Events:** the composition root emits `RelicAcquired`/`RelicEvolved`; acquisition sources (elites, bosses, vaults, events) are bus-fact subscriptions like AF-023's loot sources.

**Data structures:** `RelicDef` (effects + behaviours + stacking + synergy + evolution), `RelicAggregate`, `AcquireResult` (discriminated by `reason`).

**Extension points:** new relics are data; new relic-specific triggers extend the shared `PassiveTrigger` union when their consuming system exists (onStatusApplied, onBossMechanic — registered future); the six unbuilt relic events (Transformation, Fusion, Awakening, Corruption, Purification, Ancient Activation) share Evolution's vocabulary and await their own mechanics.

**Known limitations:** relic screen/inspection card build from AF-005/AF-007 at the UI module; a persisted relic (kept past a run) hands off to AF-027/AF-028's inventory/loadout system, not implemented here.
