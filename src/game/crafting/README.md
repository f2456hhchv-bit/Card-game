# crafting — Crafting Framework / the Lightforge (AF-025, game layer)

**Purpose:** The bridge between temporary runs and permanent progression: materials into equipment, planning into power. Nothing wasted.

**Responsibilities:** Persistent material inventory, permanent blueprint set, deterministic crafting producing AF-023-shaped items, floor-guaranteed salvage (never punitive; anti-exploit invariant tested), escalating-cost reforge with no guaranteed outcomes, hangar demo storage, save-slice serialisation (`CraftingSystem`); category/resource/station shelves + sandbox recipes (`craftingData`).

**Dependencies:** `core` (Rng), `game/loot` shapes (crafted items ARE loot items), `core/save` via the composition root. The research gate is an injected predicate — crafting never imports the tree.

**Events:** the composition root emits `BlueprintUnlocked`, `ItemCrafted`, `ItemSalvaged`; blueprint acquisition subscribes to bus facts (boss defeats, research, discoveries).

**Data structures:** `RecipeDef` (materials/research gate/quality range; `craftingTimeMs` reserved at 0 per DR-005 reasoning), `CraftedItem`, `CraftingSaveData`, `CraftingTuning`, twelve categories + ten resources + six stations.

**Extension points:** real recipes/blueprints as data with equipment modules; the evolution hook (boss materials → new base items) awaits its content inputs; sockets/visual customisation/consumables registered future; auto-salvage policies would follow the AF-023 explicit-player-policy precedent.

**Known limitations:** hangar is a demo store (real inventory at equipment modules); crafting UI builds from AF-005 components at its module; salvage of *equipped* gear waits for equipment to exist.
