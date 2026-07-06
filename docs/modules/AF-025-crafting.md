# AF-025 — CRAFTING FRAMEWORK

**Module status:** Complete (framework specified; material economy, blueprints, crafting, salvage, and reforge implemented and tested with persistence; live Lightforge demo in the sandbox; recipe/evolution content passes bind as equipment modules land)
**Lock status:** LOCKED — extends AF-000 → AF-024 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CRAFTING_FRAMEWORK.md` + implementation (`src/game/crafting/`) + persistent sandbox crafting

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-024 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Crafting Framework.

Crafting is the bridge between temporary runs and permanent progression.

Players should feel that every expedition contributes towards building something greater.

Every collected resource should have value.

Every crafting decision should create meaningful long-term progression.

Crafting should reward planning.

Not repetitive grinding.

==================================================
CORE PHILOSOPHY
==================================================

Nothing is wasted.

Everything has purpose.

Crafting expands player options.

Experimentation is encouraged.

Progress is always visible.

==================================================
CRAFTING LOOP
==================================================

Complete Mission
↓
Collect Resources
↓
Return to Galaxy Command
↓
Salvage Equipment
↓
Unlock Blueprints
↓
Craft Equipment
↓
Upgrade Build
↓
Launch Next Expedition

Every expedition contributes towards future crafting opportunities.

==================================================
CRAFTING CATEGORIES
==================================================

Weapons

Ship Components

Equipment

Relics

Drone Modules

Orbital Modules

Consumables (Future)

Commander Modules

Research Catalysts

Cosmetics

Ancient Technology

Prototype Technology

Future systems extend this framework.

==================================================
RESOURCE TYPES
==================================================

Common Materials

Rare Alloys

Crystal Fragments

Void Essence

Ancient Components

Quantum Cores

Energy Cells

Research Samples

Mythic Materials

Singularity Matter

Resources remain meaningful throughout the game.

==================================================
BLUEPRINT SYSTEM
==================================================

Blueprints unlock through:

Boss Defeats

Mission Rewards

Research

Galaxy Discoveries

Ancient Vaults

Elite Enemies

Events

Community Content (Future)

Blueprints permanently expand crafting options.

==================================================
CRAFTING RECIPES
==================================================

Every recipe defines:

Blueprint

Required Materials

Crafting Cost

Research Requirement

Crafting Time

Output Quality

Upgrade Potential

Recipes remain data-driven.

==================================================
ITEM QUALITY
==================================================

Crafted items inherit:

Item Level

Rarity

Affixes

Craft Quality

Special Properties

Crafting never guarantees perfection.

Player decisions influence outcomes.

==================================================
SALVAGING
==================================================

Players may salvage unwanted items.

Salvaging returns:

Materials

Research Samples

Rare Components

Blueprint Fragments

Resource recovery depends upon:

Item Quality

Rarity

Crafting Research

Salvaging should never feel punitive.

==================================================
REFORGING
==================================================

Support:

Affix Rerolls

Quality Improvement

Stat Optimisation

Trait Replacement

Socket Modification (Future)

Visual Customisation (Future)

Reforging has increasing costs.

No guaranteed perfect outcomes.

==================================================
EVOLUTION SYSTEM
==================================================

Certain equipment may evolve through:

Boss Materials

Ancient Components

Research

Commander Mastery

Galaxy Discoveries

Evolution creates new gameplay opportunities.

Not simple statistical increases.

==================================================
CRAFTING STATIONS
==================================================

Galaxy Command contains:

Forge

Research Lab

Prototype Facility

Salvage Bay

Blueprint Archive

Ancient Fabricator

Future stations extend this framework.

==================================================
PLAYER DECISIONS
==================================================

Every crafting interaction should create choices:

Craft

Upgrade

Salvage

Store

Reforge

Wait

Experiment

No automatic crafting.

==================================================
BALANCE PRINCIPLES
==================================================

Crafting accelerates experimentation.

Never mandatory.

Loot remains valuable.

Crafting complements loot.

It never replaces it.

==================================================
ACCESSIBILITY
==================================================

Support:

Large recipe cards

Material filtering

Search

Sorting

Controller navigation

Touch navigation

Colour-blind indicators

Crafting queue readability

==================================================
PERFORMANCE
==================================================

Cache recipes.

Pool crafting UI.

Lazy load blueprint data.

Optimise inventory lookups.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Known Blueprints

Recipe Database

Material Inventory

Craft Queue

Salvage Output

Reforge Rolls

Performance

==================================================
OUTPUT
==================================================

Produce the complete Crafting Framework.

Every future Equipment, Weapon, Blueprint, Resource and Evolution system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Unlock every blueprint.

Craft every item category.

Review material economy.

Review crafting progression.

Review salvage rewards.

Review reforging balance.

Review evolution paths.

Review blueprint acquisition.

Review player choice.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-024.

Adjust recipe costs.

Adjust resource rarity.

Adjust salvage values.

Adjust reforge probabilities.

Ensure crafting complements exploration and loot while providing meaningful long-term progression without replacing the excitement of finding powerful equipment.

Repeat until the Crafting Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-025.

---

## Foundation / AF-016–024 alignment review (recorded at catalogue time)

- Crafting bridges AF-022's temporary and AF-024's permanent progression exactly as AF-016 §1's Galaxy Command arc planned; the **Lightforge** brand (AF-002 §12) is its identity. Materials arrive through AF-023 loot categories; blueprints unlock through bus facts (boss defeats, research nodes, discoveries); nothing knows crafting exists until it subscribes.
- **Crafted items are AF-023 items:** same shape (item level, rarity, affixes, quality, seed), same affix rolls, same rarity ladder — crafting *complements* loot structurally because it produces the same currency of excitement through a different decision (planning vs. discovery). "Never guarantees perfection": quality and affixes roll from the deterministic stream; player decisions (recipe choice, reforging, material investment) shape distributions, never outcomes.
- **Crafting Time: DR-005's reasoning applied** — crafts are instant; `craftingTimeMs` reserved at zero for data-format stability. Owner may overrule separately, but artificial waiting stays banned by default.
- **Salvage is never punitive by construction:** returns have per-rarity floors (minimum yield guaranteed), scale with quality/rarity/crafting research, and salvaging favourites warns (AF-003 §8, already law). Salvage feeds the loop: every drop has value even when it isn't an upgrade — "nothing is wasted" is arithmetic.
- **Reforge:** affix rerolls with escalating cost (per-item reforge count → cost multiplier, data-tuned) and no pity — the "no guaranteed perfect outcomes" law; quality improvement/trait replacement as framework operations; sockets and visual customisation registered future.
- **Anti-exploit invariant tested:** expected salvage return of a crafted item is strictly less than its crafting cost across seeds (no craft→salvage material printing); the material economy sim runs in CI.
- **Evolution registered, not stubbed:** the evolution hook (item + evolution materials → new base item, "new gameplay opportunities, not stat increases") is an extension point awaiting boss-material/mastery content — building it before its inputs exist would be dead scaffolding (AF-014 commandment 9).
- Twelve categories, ten resource types, six stations (Forge, Research Lab, Prototype Facility, Salvage Bay, Blueprint Archive, Ancient Fabricator) registered as shelves. Persistence via a `crafting` save slice on the AF-024 save system (materials, blueprints, hangar). No automatic crafting anywhere (player-decision law).
- Sandbox live: crafting materials collected in runs bank persistently, Galaxy Command's Lightforge crafts a prototype from a starting blueprint, output lands in a persistent hangar, salvaging from the hangar returns materials. Recipe/evolution content passes bind at equipment modules.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; content passes bind equipment/weapon/relic modules. Produced outputs: `docs/CRAFTING_FRAMEWORK.md`, `src/game/crafting/`.
