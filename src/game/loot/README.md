# loot — Loot Framework (AF-023, game layer)

**Purpose:** The primary reward system: deterministic drop generation, the canonical nine-tier rarity ladder, capped smart loot, and value-preserving ground drops — thousands of items without repetition.

**Responsibilities:** Eight-roll deterministic generation with per-drop child seeds (`LootGenerator`), rarity ladder-shift under difficulty/Ascension/mutator/research bonuses, hard-clamped smart-loot weighting, pooled ground drops with the bank-don't-delete overflow policy (`GroundLoot`), tuning data (`lootTuning` — rarity rows are AF-007 canon).

**Dependencies:** `core` (Pool, Rng). Sources are event subscribers wired at the composition root; combat never knows loot exists.

**Events:** the composition root emits `LootDropped` / `LootCollected`; consumers (inventory, crafting, collections) attach at their modules.

**Data structures:** `DropTableEntry`, `DropContext`, `LootDrop` (with seed), `RarityRow`/`RARITY_TABLE`, `PLAYER_DECISIONS`.

**Extension points:** content modules register drop tables and real affix pools; special-drop kinds extend the union; inspection cards and the decision UI arrive with equipment modules; missions supply context (item level, bonuses, smart-loot weights).

**Known limitations:** affix pool is a placeholder proving generation; inspection/inventory UI belongs to equipment modules; audio and enhanced Legendary presentation land with their modules.
