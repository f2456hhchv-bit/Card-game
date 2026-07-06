# meta — Meta Progression (AF-026, game layer)

**Purpose:** Permanent identity: account level, mastery, collections, statistics, challenges. Every run matters forever; rewards expand options, never power.

**Responsibilities:** Account level (reuses the AF-022 `XpSystem` — one curve engine in the game), generic mastery tracks with rank curves and named counters, idempotent compact-ID-set collections (AF-013 §6), permanent statistics with max-tracking, data-defined challenges completing exactly once with cosmetic-only rewards, save serialisation (`MetaProgression`); shelves + sandbox challenges (`metaData`).

**Dependencies:** `game/progression` (XpSystem reuse). Event ingestion is wired at the composition root — combat/loot/run systems never know meta exists.

**Events:** consumes `RunEnded`, `EnemyKilled`, `DamageDealt`, `LootCollected`, `ResearchUnlocked`, `CommanderLevelUp`… (subscriptions at the root); root emits `ChallengeCompleted` and account-level facts as UI needs them.

**Data structures:** `MetaSaveData` (third save slice), `ChallengeDef`, `MasteryReward` (cosmetic/knowledge union — **no stat field exists**), eleven collection categories, eight challenge categories.

**Extension points:** content modules add mastery tracks/counters, challenge definitions, and collection catalogues as data; the profile UI and cosmetic equipping arrive with their modules; the future online identity extends the profile snapshot (AF-001 §12).

**Known limitations:** sandbox challenges are placeholders; favourite/play-style derivation is presentation-layer (counters exist); hours-played tracking lands with the settings/session module.
