# AF-042 — ACHIEVEMENT AND COLLECTION FRAMEWORK

**Module status:** Complete (framework specified; achievement-completion/collection-ledger/discovery-log engine implemented and tested; a sandbox achievement roster governs Galaxy Command's mastery layer end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-041 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ACHIEVEMENT_COLLECTION_FRAMEWORK.md` + implementation (`src/game/achievements/`)

---

*(Module catalogued verbatim below.)*

42

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-041 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Achievement and Collection Framework.

Achievements are permanent records of player mastery.

Collections are permanent records of discovery.

Neither system should encourage repetitive grinding.

Instead, they should celebrate exploration, experimentation, skill and dedication.

Completion should feel rewarding rather than compulsory.

==================================================
CORE PHILOSOPHY
==================================================

Celebrate mastery.

Reward curiosity.

Encourage experimentation.

Track history.

Preserve accomplishments.

Every achievement should represent a memorable moment.

==================================================
FRAMEWORK STRUCTURE
==================================================

The framework consists of:

Achievements

Challenges

Collections

Discovery Logs

Mastery Records

Statistics

Titles

Prestige Rewards

Future Expansion Collections

Everything contributes to long-term progression.

==================================================
ACHIEVEMENT CATEGORIES
==================================================

Story

Combat

Bosses

Weapons

Ships

Commanders

Research

Crafting

Exploration

Collections

Galaxy Restoration

Faction Reputation

Challenge Modes

Hidden Achievements

Developer Challenges

Future categories extend naturally.

==================================================
ACHIEVEMENT STRUCTURE
==================================================

Every achievement defines:

Unique ID

Name

Description

Category

Difficulty

Completion Criteria

Progress Tracking

Reward

Lore (optional)

Visibility

Future Expansion Hook

==================================================
CHALLENGE SYSTEM
==================================================

Support:

Daily Challenges (optional)

Weekly Challenges (optional)

Permanent Challenges

Commander Challenges

Ship Challenges

Weapon Challenges

Biome Challenges

Boss Challenges

Galaxy Challenges

Seasonal Challenges (future)

Challenge systems remain optional.

==================================================
COLLECTIONS
==================================================

Track permanent discovery of:

Weapons

Ships

Commanders

Relics

Equipment

Enemies

Elite Variants

Bosses

Biomes

Research Nodes

Blueprints

Resources

Ancient Artefacts

Lore Entries

Galaxy Discoveries

Future collections extend naturally.

==================================================
DISCOVERY LOG
==================================================

Every discovery records:

Discovery Date

Mission

Biome

Galaxy Sector

Commander

Ship

Statistics

Lore

Collection Status

Players build a permanent history.

==================================================
PRESTIGE SYSTEM
==================================================

Completion unlocks:

Titles

Portrait Frames

Ship Paints

Commander Skins

Engine Trails

Banner Elements

Music

Codex Entries

Prestige rewards remain cosmetic.

==================================================
PROGRESS TRACKING
==================================================

Every objective tracks:

Current Progress

Completion %

Milestones

Remaining Tasks

Completion History

Future Extensions

Progress remains transparent.

==================================================
HIDDEN ACHIEVEMENTS
==================================================

Support:

Secret Bosses

Ancient Discoveries

Lore Mysteries

Rare Events

Prototype Recovery

Special Builds

Hidden achievements reward exploration.

==================================================
PLAYER PROFILE
==================================================

Display:

Completion %

Achievements

Collections

Statistics

Mastery

Favourite Builds

Recent Milestones

Prestige Level

Profile grows throughout the game.

==================================================
LONG-TERM GOALS
==================================================

Support:

100% Collections

100% Research

Maximum Mastery

Complete Codex

All Bosses

Galaxy Restoration

Hidden Discoveries

Legendary Completion

Players always have meaningful objectives.

==================================================
BALANCE PRINCIPLES
==================================================

Achievements celebrate gameplay.

Never dictate gameplay.

Collections encourage exploration.

Never create excessive grind.

Prestige remains meaningful.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Achievement Cards

Search

Sorting

Filtering

Controller Navigation

Touch Navigation

Colour-blind Support

High Contrast

==================================================
PERFORMANCE
==================================================

Cache achievement progress.

Update asynchronously.

Pool collection UI.

Lazy load large databases.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Achievement Count

Completion %

Collection %

Hidden Discoveries

Challenge Status

Profile Statistics

Performance

==================================================
OUTPUT
==================================================

Produce the complete Achievement, Challenge and Collection Framework.

Every future expansion, achievement, collectible and prestige system extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete every achievement.

Complete every collection.

Review challenge diversity.

Review progression pacing.

Review prestige rewards.

Review hidden discoveries.

Review completion balance.

Review player motivation.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-041.

Adjust achievement criteria.

Adjust reward pacing.

Adjust collection requirements.

Remove repetitive objectives.

Ensure achievements celebrate mastery, collections reward discovery and completion remains motivating without becoming tedious.

Repeat until the Achievement and Collection Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-042.

---

## Foundation / AF-000–041 / GP-FINAL alignment review (recorded at catalogue time)

- **Prestige System is exactly AF-026's existing nine-value `CosmeticRewardKind` — zero new reward kinds.** Titles, Portrait Frames, Ship Paints, Commander Skins, Engine Trails, Banner Elements (`bannerCustomisation`), Music, and Codex Entries all already existed since AF-026; `visualEffect` (also already registered) rounds out the set. Every sandbox achievement's `reward` is a real `CosmeticRewardKind` value, verified directly in tests.
- **Mastery Records and Statistics are AF-026's existing mastery tracks and `recordStat`/`stat()` — read, never edited.** `AchievementRuntime` depends only on a small structural `AchievementProgressReader` interface (`stat`, `collectionCount`, `isCompleted`) that `MetaProgression`'s already-public methods satisfy without any change to that locked class.
- **Achievement completion persists for free through AF-026's existing `meta.discover("achievements", id)` — the identical bucket its own Challenge engine's `grantReward` already writes into.** No second completion-tracking store was built.
- **Ten of the fifteen Collections categories this module names are AF-026's existing `CollectionCategory` values, read directly.** Elite Variants is already a live AF-034 producer under the existing `"enemies"` bucket (elites discover via `codexId`, unchanged). Blueprints is AF-025's existing blueprint `Set` (`CraftingSystem.knowsBlueprint`/`knownRecipes`), read as its own source. Galaxy Discoveries is a derived view over AF-038's point-of-interest ids intersected against the player's `"lore"`/`"biomes"` discovered sets — no new storage for any of these three.
- **Resources and Ancient Artefacts are the two categories with no existing AF-026 bucket, and are the one deliberately new persistence surface this module adds — a `CollectionLedger`, its own small save slice, scoped to exactly those two categories plus the Discovery Log.** `CollectionLedger.discover()`/`hasDiscovered()` deliberately mirror `MetaProgression`'s own idempotent shape rather than inventing a different one.
- **Challenge System is Daily/Weekly/Permanent/Commander/Ship/Weapon/Biome/Boss/Galaxy/Seasonal — almost a 1:1 restating of AF-026's existing `ChallengeCategory` (general/commander/ship/weapon/boss/biome/galaxy/seasonal), with Daily/Weekly as the two genuinely new concepts.** Since a challenge's *category* (what it's about) and its *cadence* (when it resets) are orthogonal, `CHALLENGE_CADENCE_KINDS` is registered as new, additive vocabulary rather than editing AF-026's locked `ChallengeCategory` union. No clock-based reset mechanic was built — the spec's own text hedges both as "(optional)," and this offline-first project has no existing wall-clock reset system to hook into safely yet.
- **Achievement Categories (15) are a genuinely wider, new union**, since AF-026's `ChallengeCategory` (8 values) can't be edited and doesn't cover Story/Research/Crafting/Exploration/Collections/Faction Reputation/Challenge Modes/Hidden Achievements/Developer Challenges. `AchievementDef` is a new, richer sibling shape to AF-026's `ChallengeDef` — not a replacement for it; `SANDBOX_CHALLENGES` keeps running exactly as before, untouched, on the Statistics screen alongside the new Achievements line.
- **Discovery Log captures the context AF-026's plain `discover(category, id)` never could** (date, mission, biome, galaxy sector, commander, ship) — wired today at the Ancient Vault point-of-interest discovery and boss-defeat call sites, with the remaining `meta.discover` call sites across the codebase honestly left as content debt rather than a claimed-but-fake completeness.
- **Player Profile ("Completion %, Achievements, Collections, Statistics, Mastery, Recent Milestones") extends the existing AF-026 Statistics screen with two new lines (Achievements, Resources/Ancient Artefacts/Recent discovery) rather than building a new screen** — the same "extend the existing screen" discipline AF-038/039/040/041 already established for Galaxy Command.
- **Self-review executed:** Completion Criteria evaluation (both `statThreshold` and `collectionCount` kinds), progress clamping at target, the never-return-an-already-completed-achievement invariant, `CollectionLedger`'s idempotence/cap/round-trip, and Challenge Cadence registration are all tested, including a 2,000-cycle sweep driving every sandbox achievement's criteria past target and asserting each fires its completion exactly once (`SELF REVIEW LOOP`'s literal "complete every achievement," executed as a real test). Live in the browser: discovering the Lucent Gate Ancient Vault immediately completed the hidden "Ghost in the Vault" achievement (revealing its name on the Statistics screen, "???" no longer shown) and populated the Ancient Artefacts collection and Discovery Log with real context; discovering a second Lore Entry at Hollow Drift then completed "Curator" — both observed with zero errors.

**Review verdict:** ALIGNED (zero new reward-kind vocabulary, zero new collection storage beyond the two genuinely uncovered categories, zero edits to any locked class or union; `AchievementRuntime`'s pure completion-check and `CollectionLedger`'s small, honestly-scoped persistence are the only genuinely new mechanical surfaces). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ACHIEVEMENT_COLLECTION_FRAMEWORK.md`, `src/game/achievements/`.
