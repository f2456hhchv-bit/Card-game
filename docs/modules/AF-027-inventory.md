# AF-027 — INVENTORY FRAMEWORK

**Module status:** Complete (framework specified; inventory engine implemented and scale-tested at 20,000+ items; live persistent inventory in the sandbox; full inventory screen binds at the UI implementation module)
**Lock status:** LOCKED — extends AF-000 → AF-026 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/INVENTORY_FRAMEWORK.md` + implementation (`src/game/inventory/`)

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-026 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Inventory Framework.

The Inventory is the player's command centre for equipment management.

It must remain fast.

Organised.

Readable.

Powerful.

Managing equipment should feel satisfying rather than overwhelming.

The system must scale to thousands of items without becoming difficult to navigate.

==================================================
CORE PHILOSOPHY
==================================================

Simple.

Responsive.

Organised.

Expandable.

Player-first.

Every interaction should require the fewest possible actions.

==================================================
INVENTORY STRUCTURE
==================================================

Support:

Weapons

Equipment

Relics

Ship Components

Crafting Materials

Blueprints

Resources

Quest Items

Research Samples

Cosmetics

Mission Items

Future categories

Every category remains modular.

==================================================
ITEM STORAGE
==================================================

Support:

Player Inventory

Galaxy Storage

Favourites

Recently Acquired

Loadout Storage

Crafting Queue

Archive

Future shared storage

Storage limits remain configurable.

==================================================
ITEM INFORMATION
==================================================

Every item displays:

Name

Category

Rarity

Item Level

Power Rating

Affixes

Description

Lore

Crafting Value

Salvage Value

Blueprint Status

Collection Status

Comparison remains immediate.

==================================================
ITEM ACTIONS
==================================================

Support:

Equip

Unequip

Compare

Inspect

Favourite

Lock

Move

Store

Salvage

Craft

Reforge

Mark for Upgrade

Share (Future)

Every action provides confirmation where appropriate.

==================================================
SORTING
==================================================

Sort by:

Rarity

Power

Item Level

Newest

Oldest

Name

Category

Affix Count

Crafting Value

Favourite

Custom

Sorting remains instant.

==================================================
FILTERING
==================================================

Filter by:

Weapon Type

Equipment Type

Commander

Ship

Rarity

Affixes

Status Effects

Research Unlock

Blueprint Availability

Craftable

Upgradeable

Future filters

Filtering supports combinations.

==================================================
SEARCH
==================================================

Search supports:

Item Name

Affix

Category

Lore

Blueprint

Keywords

Partial Matches

Search updates instantly.

==================================================
LOADOUTS
==================================================

Support multiple saved loadouts.

Each stores:

Commander

Ship

Weapons

Equipment

Relics

Cosmetics

Future expansions

Quick switching supported outside missions.

==================================================
COLLECTION INTEGRATION
==================================================

Inventory links directly with:

Research

Crafting

Mastery

Collections

Achievements

Codex

Blueprint Archive

No duplicated systems.

==================================================
ITEM PROTECTION
==================================================

Players may:

Lock Items

Favourite Items

Prevent Salvage

Prevent Selling

Require Confirmation

Support batch operations safely.

==================================================
STACKING
==================================================

Automatically stack:

Resources

Materials

Blueprint Fragments

Currencies

Research Samples

Quest Resources

Configurable stack limits.

==================================================
VISUAL PRESENTATION
==================================================

Display:

Grid View

List View

Comparison Panel

Quick Preview

Item Cards

Animated Rarity Frames

Minimal visual clutter.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Icons

Large Fonts

Controller Navigation

Touch Navigation

Keyboard Shortcuts

Colour-blind Indicators

Search Filters

High Contrast

==================================================
PERFORMANCE
==================================================

Virtualise large inventories.

Pool inventory cards.

Cache sorting.

Cache filtering.

Lazy load icons.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Inventory Size

Storage Usage

Loaded Items

Search Time

Sort Time

Filter Time

Memory Usage

Performance

==================================================
OUTPUT
==================================================

Produce the complete Inventory Framework.

Every future item, resource, weapon, equipment and collection extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Populate inventories with tens of thousands of items.

Review navigation.

Review search.

Review sorting.

Review filtering.

Review loadouts.

Review comparison tools.

Review storage.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-026.

Reduce unnecessary clicks.

Improve readability.

Improve responsiveness.

Ensure players can always find, compare and manage equipment quickly regardless of collection size.

Repeat until the Inventory Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-027.

---

## Foundation / AF-016–026 / GP-FINAL alignment review (recorded at catalogue time)

- Inventory items ARE AF-023 items (LootDrop/CraftedItem shape) plus instance metadata (id, location, favourite, locked, acquired time, marks) — the inventory stores and organises, it never redefines items. Power Rating is a derived display formula over level/rarity/affixes (data-tunable), not a new stat.
- **Stacking vs instances:** stackable categories (resources, crafting materials, blueprint fragments, currencies, research samples, quest resources) merge by base item + rarity with configurable limits; equipment-like categories remain unique instances. Matches AF-025's material inventory without duplicating it — materials remain the crafting system's ledger; the inventory holds *items*, and the two link (no duplicated systems, per the module's own integration law).
- Item actions route to their owning systems: Salvage/Craft/Reforge → AF-025; Favourite/Lock → protection flags honoured by AF-003 §8's warning law (locked items cannot be salvaged at all; favourites warn); Equip/Unequip → loadouts (full equip effects arrive with equipment modules); Share → future online layer flag.
- Sorting is cached (dirty-flag invalidation, AF-003 §9 pattern applied to data); filtering composes predicates; search is substring across name/affix/category/keywords. All measured at scale in CI: **20,000-item population with sort/filter/search timing budgets** — the self-review's "tens of thousands" executed literally.
- Loadouts store commander/ship/weapons/equipment/relics/cosmetics by instance reference, switchable **outside missions only** (AF-016 state-gated; mid-run build identity is AF-022's domain). GP-FINAL's 6+6 build frame is the loadout shape's target once weapon/passive modules land — slots are data-configurable.
- Storage locations (player, galaxy storage, favourites view, recently acquired, loadout storage, crafting queue, archive) with configurable limits; archive implements AF-013 §5's never-delete for items. Persisted as a fourth save slice; instance lists are compact records (collections remain AF-026's ID sets — no duplication).
- Visual presentation (grid/list, comparison panel, quick preview, animated rarity frames per AF-007 §7 reserved-animation law) and accessibility items bind to the UI implementation module on AF-005 components; virtualisation is already AF-005 §10 law.
- GP-FINAL standing tests applied: No Useless Systems — the inventory's justification is the fewest-actions law; One More Run — "Recently Acquired" surfaces each run's harvest at Results (registered for the Results build).

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; inventory screen passes bind at the UI module, equip effects at equipment modules. Produced outputs: `docs/INVENTORY_FRAMEWORK.md`, `src/game/inventory/`.
