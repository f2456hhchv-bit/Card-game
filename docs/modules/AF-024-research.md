# AF-024 — RESEARCH FRAMEWORK

**Module status:** Complete (framework specified; save system + research tree engine implemented and tested; live persistent research in the sandbox; tree content passes bind as the real research tree lands)
**Lock status:** LOCKED — extends AF-000 → AF-023 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RESEARCH_FRAMEWORK.md` + implementation (`src/core/save/`, `src/game/research/`) + persistent sandbox research

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-023 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Research Framework.

Research is the permanent progression system of Afterlight.

Every completed expedition should permanently strengthen the player's understanding of the galaxy.

Research should reward dedication.

Not repetitive grinding.

Players should constantly unlock new possibilities rather than simply increasing numbers.

==================================================
CORE PHILOSOPHY
==================================================

Knowledge is power.

Discovery creates progression.

Choice creates identity.

Research should encourage experimentation.

Every unlocked technology should expand future gameplay.

==================================================
RESEARCH LOOP
==================================================

Complete Mission
↓
Collect Research Samples
↓
Return to Galaxy Command
↓
Unlock Research
↓
Improve Future Runs
↓
Discover New Technologies
↓
Launch Next Mission

Every research decision influences future gameplay.

==================================================
RESEARCH CATEGORIES
==================================================

Commander Development

Ship Engineering

Weapon Technology

Energy Systems

Shield Technology

Drone Engineering

Orbital Technology

Crafting

Exploration

Galaxy Navigation

Ancient Technology

Void Research

Crystal Resonance

Automation

Quality of Life

Future categories extend this framework.

==================================================
RESEARCH NODE TYPES
==================================================

Passive Bonus

Feature Unlock

New Mechanic

Crafting Unlock

Blueprint Unlock

Commander Unlock

Ship Unlock

Mission Unlock

Biome Unlock

Galaxy Unlock

Ancient Discovery

Every node has purpose.

==================================================
RESEARCH STRUCTURE
==================================================

Nodes connect logically.

Support:

Linear paths

Branching paths

Cross-links

Prerequisites

Mutually exclusive paths (future)

Hidden discoveries

Research remains readable.

==================================================
RESEARCH COSTS
==================================================

Every node defines:

Research Cost

Prerequisites

Category

Tier

Completion Time

Unlock Type

Future Dependencies

Costs remain data-driven.

==================================================
PLAYER CHOICE
==================================================

Research should create:

Specialisation.

Experimentation.

Long-term planning.

No single research path should dominate.

==================================================
ACCOUNT-WIDE PROGRESSION
==================================================

Research persists across:

Runs

Characters

Commanders

Ships

Devices

Cloud Saves

Research is never lost.

==================================================
DISCOVERY SYSTEM
==================================================

Hidden technologies may unlock through:

Boss Defeats

Ancient Artifacts

Galaxy Discoveries

Mission Chains

Rare Events

Research Combinations

Encourage exploration.

==================================================
VISUAL PRESENTATION
==================================================

Research displays:

Technology Network

Category Colours

Progress Lines

Unlock Animation

Completion Effects

Prerequisite Indicators

Research should feel exciting.

==================================================
BALANCE PRINCIPLES
==================================================

Early research unlocks options.

Mid research deepens builds.

Late research enables mastery.

Avoid mandatory progression paths.

==================================================
RESET SUPPORT
==================================================

Support:

Research Preview

Partial Refund (future)

Full Reset (optional)

Confirmation Prompts

Statistics remain preserved.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Nodes

Font Scaling

Colour-blind Support

Controller Navigation

Touch Navigation

Search

Filtering

High Contrast

==================================================
PERFORMANCE
==================================================

Lazy load research branches.

Cache unlocked nodes.

Pool UI elements.

Optimise dependency calculations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Research Points

Unlocked Nodes

Locked Nodes

Dependencies

Research Queue

Unlock Events

Performance

==================================================
OUTPUT
==================================================

Produce the complete Research Framework.

Every future technology, progression system, unlock and permanent upgrade extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Unlock every research branch.

Review progression pacing.

Review player choice.

Review technology diversity.

Review dependency clarity.

Review hidden discoveries.

Review balance.

Review replayability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-023.

Adjust research costs.

Adjust prerequisites.

Adjust unlock pacing.

Remove mandatory paths.

Ensure every research decision feels meaningful and permanently expands future gameplay possibilities.

Repeat until the Research Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-024.

---

## Foundation / AF-016–023 alignment review (recorded at catalogue time)

- Research is the permanent half of the Constitution's Progression Philosophy; the research loop implements AF-016 §1's Galaxy Command arc. Research samples arrive through the AF-023 loot category (`researchSample`) — the loop closes: kill → drop → collect → unlock → stronger next run.
- **Save system debt paid (AF-001 §8, first real consumer):** `src/core/save/` implements versioned slices `{version, checksum, data}` with pure migration chains, checksum validation, **corruption quarantine + backup fallback + per-slice minimal reset** (a corrupted settings file can never cost the research tree), and a storage interface — localStorage adapter now, IndexedDB behind the same contract when the full save module lands. "Research is never lost" is architecture, not aspiration; cloud/device sync attaches to the same slice contract later (AF-001 §12).
- Research tree engine: prerequisites, branching, cross-links, **cycle + unknown-prerequisite validation** at load (a malformed tree fails loudly in dev, per AF-001 §9), hidden discoveries (revealed by trigger facts — boss defeats, artifacts, rare events — via the bus), tier/cost/category as node data, mutually-exclusive groups registered future. "No mandatory paths" recorded as a content-QA law for the real tree (framework enforces nothing *is* structural about order beyond prerequisites).
- Node effects feed existing systems: passive bonuses enter the **damage pipeline's research stage** (AF-021 — its first live input), loot research bonuses feed AF-023's ladder shift, unlock types gate future content (Commanders, ships, biomes, galaxies — shelves registered).
- Reset support: full reset refunds all spent points, preserves statistics and revealed discoveries, and warns first (AF-003 §8 destructive-action law — "resetting research" was already on its warn list). Partial refund registered future.
- Fifteen categories + eleven node types registered as shelves; the sandbox tree (12 placeholder nodes incl. one hidden discovery) proves the engine; the real tree is content for later modules.
- Sandbox live: research cores collected in runs bank as points, Galaxy Command shows the tree with unlockable nodes, unlocks persist across page reloads (real save slice), and unlocked passives measurably buff the next run through the pipeline's research stage.
- Visual presentation (network view, category colours, progress lines) binds to the UI implementation module (AF-005 components); accessibility items inherit the locked floors; search/filter registered for the research screen build.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; tree content and research-screen passes bind at their modules. Produced outputs: `docs/RESEARCH_FRAMEWORK.md`, `src/core/save/`, `src/game/research/`.
