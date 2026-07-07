# inventory — Inventory Framework (AF-027, game layer)

**Purpose:** The command centre for items: fast, organised, readable at any scale. Items are AF-023 drops + instance metadata — the inventory organises, it never redefines.

**Responsibilities:** Instance storage with auto-stacking for stackable categories, cached sorting (ten keys), combinable filters, instant substring search, storage locations with configurable limits, item protection (locked = unsalvageable, favourite = confirm; batch ops exclude protected by construction), loadout save/rename/duplicate, derived power rating, save serialisation.

**Dependencies:** `game/loot` shapes only. Salvage/craft/reforge actions route to AF-025; equip effects to AF-028.

**Events:** none directly — the composition root wires collection→add and surfaces `RecentlyAcquired` at Results.

**Data structures:** `InventoryItem`, `Loadout` (slot vocabulary is AF-028's), `InventoryFilter`, `InventoryTuning` (stack/storage/loadout limits), `InventorySaveData` (fourth save slice).

**Extension points:** new categories inherit stack-or-instance behaviour from data; new sort keys/filters extend the unions; the inventory screen (grid/list/comparison/virtualised) builds on AF-005 at the UI module; shared storage is a future online-layer flag.

**Known limitations:** UI is the AF-005 build's job; equip effects require AF-028; search is linear scan (measured fine at 20k; an index is a registered optimisation if catalogues demand it).
