# progression — XP & Level Progression (AF-022, game layer)

**Purpose:** The heartbeat of every run: XP flows in from facts on the bus, physical pickups make collection tactile, the curve makes every level anticipated, and the upgrade pool turns each level into a meaningful build decision.

**Responsibilities:** Level/XP state with cached anti-grind curve and multi-level queueing (`XpSystem`), pooled seven-tier pickups with magnetism and density coalescing (`XpPickups`), weighted seeded upgrade offers with stack exclusion and reroll/lock methods (`UpgradePool`), tuning data (`xpTuning`).

**Dependencies:** `core` (Pool, Rng types). XP sources are event subscribers wired at the composition root — combat never knows XP exists.

**Events:** consumes `EnemyKilled` (and future objective/discovery facts); the composition root emits `CommanderLevelUp` and `XpCollected`.

**Data structures:** `XpTuning` (curve, tiers, radii, offer size), `UpgradeDefinition` (id/category/weight/maxStacks), `XpSnapshot`, `UpgradeOffer`.

**Extension points:** new XP sources subscribe to bus facts; upgrade content registers `UpgradeDefinition`s into the twelve categories; collection relics/Commander bonuses modify radii; missions override curve/cap; four/five-choice offers, rerolls, and locks activate when their content buyers arrive.

**Known limitations:** sandbox upgrade definitions are placeholders (real content arrives with weapon/Commander/relic modules); narrated upgrades are a future accessibility flag; audio cues land with the audio module.
