# combat — Combat Framework (AF-021, game layer)

**Purpose:** The heart of Afterlight: one deterministic damage pipeline, data-ruled statuses, layered defence, and pure target selectors that every weapon, enemy, boss, Commander, and equipment system extends.

**Responsibilities:** Nine-stage damage resolution with per-stage breakdown (`DamagePipeline`), status effects with stacking/DoT/immunity/resistance rules and the AF-020 movement bridge (`StatusEngine`), barrier→shield→hull defence with capped DR and regen (`DefenceState`), target priority selectors (`targetPriority`), tuning data (`combatTuning`).

**Dependencies:** `core` (Rng) and `game/movement` types (the movement bridge). Never touches rendering or input.

**Events:** publishers at the integration layer emit `EnemyKilled`, `PlayerDamaged`, `DamageDealt`, `StatusApplied`, `ShieldBroken` on the shared bus; XP/loot/research consumers attach at AF-022+.

**Data structures:** `DamagePacket`, `OffensiveModifiers` (additive-within-stage), `DamageResult` (breakdown as return type), `StatusRule`/`STATUS_RULES`, `DefenceSnapshot`, `TargetCandidate`.

**Extension points:** chain reactions (explosions, chain lightning, pierce, ricochet, splitting, orbital/drone interactions) attach to hit/kill events in weapon modules; new statuses are `STATUS_RULES` rows; new damage kinds extend the union; enemy/boss modules supply `TargetResistances` and consume the same pipeline for damage *to* the player.

**Known limitations:** audio cues land with the audio module; manual target override is future (AF-019 law); per-content balance passes bind as weapons/enemies/bosses arrive.
