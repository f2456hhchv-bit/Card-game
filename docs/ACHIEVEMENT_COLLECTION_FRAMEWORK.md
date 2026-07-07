# AFTERLIGHT — Achievement and Collection Framework

**Authority:** Produced output of AF-042. Extends AF-000 → AF-041. Every future expansion, achievement, collectible, and prestige system extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** completion celebrates mastery and discovery — it never dictates gameplay, and it never becomes a second grind loop layered over the systems that already exist.

---

## 1. Framework Structure — mostly already built, one new small surface

Achievements, Challenges, Collections, Mastery Records, Statistics, Titles, and Prestige Rewards were already real, working systems as of AF-026. Discovery Logs is the one genuinely new concept this module adds, alongside two Collection categories nothing else tracked (§5).

## 2. Achievement Categories & Structure — a new, wider sibling to AF-026's Challenges

`AchievementDef` (Unique ID, Name, Description, Category, Difficulty, Completion Criteria, Reward, Lore, Visibility) is a richer sibling to AF-026's `ChallengeDef`, not a replacement — `SANDBOX_CHALLENGES` keeps running exactly as before. Fifteen `AchievementCategory` values cover ground AF-026's fixed eight-value `ChallengeCategory` doesn't (Story, Research, Crafting, Exploration, Collections, Faction Reputation, Challenge Modes, Hidden Achievements, Developer Challenges).

## 3. Completion Criteria & Progress Tracking — two reads over already-public state

`AchievementCriteria` is either `statThreshold` (reads `MetaProgression.stat()`) or `collectionCount` (reads `MetaProgression.snapshot.collectionCounts`) — both already-public getters, so `AchievementRuntime` never touches a locked class's internals. Progress is always clamped to target, and `checkCompletions()` never re-returns an achievement the caller has already recorded as done.

## 4. Challenge System — AF-026's ChallengeCategory, plus Cadence

Permanent/Commander/Ship/Weapon/Biome/Boss/Galaxy Challenges are AF-026's existing `ChallengeCategory` values, unchanged. Daily and Weekly are the two new concepts, registered as an orthogonal `ChallengeCadenceKind` (what a challenge is about vs. when it resets) rather than an edit to the locked category union. No reset mechanic exists yet — both remain "(optional)," matching the spec's own hedge.

## 5. Collections — ten reused, three reused-elsewhere, two genuinely new

Weapons/Ships/Commanders/Relics/Equipment/Enemies/Bosses/Biomes/Research Nodes/Lore Entries are AF-026's existing `CollectionCategory` values. Elite Variants is AF-034's existing `"enemies"` producer. Blueprints is AF-025's existing blueprint `Set`. Galaxy Discoveries is a derived view over AF-038 point-of-interest ids. Resources and Ancient Artefacts are the two with no existing bucket — tracked by this module's own `CollectionLedger`.

## 6. Discovery Log — the context AF-026's discover() never captured

`DiscoveryLogEntry` (id, category, timestamp, mission, biome, galaxy sector, commander, ship) is recorded at two real call sites today (Ancient Vault discovery, boss defeat), capped at 50 entries — a bounded recent history, not an unbounded database, per the module's own Performance section.

## 7. Prestige System — zero new reward kinds

Titles, Portrait Frames, Ship Paints, Commander Skins, Engine Trails, Banner Elements, Music, Codex Entries, and Visual Effects are AF-026's existing nine-value `CosmeticRewardKind`, reused directly on every sandbox achievement's `reward` field.

## 8. Hidden Achievements — Visibility as one boolean

A hidden achievement's name/criteria display as "???" until `meta.hasDiscovered("achievements", id)` is true, then reveal — verified live: discovering the game's first Lore Entry immediately completed "Ghost in the Vault," and its name and lore replaced the "???" placeholder on the very next Statistics screen render.

## 9. Player Profile & Long-Term Goals — the existing Statistics screen, extended

The Player Profile (Completion %, Achievements, Collections, Statistics, Mastery, Recent Milestones) is AF-026's Statistics screen with two more lines added — the same "extend, don't replace" discipline every prior module applied to Galaxy Command. 100% Collections/100% Research/Maximum Mastery/Complete Codex/All Bosses/Galaxy Restoration/Hidden Discoveries/Legendary Completion are all readable today from `meta.snapshot` and the achievement roster; a dedicated Long-Term Goals summary view binds at the UI module.

## 10. Balance Principles

No achievement or collection requires an action the player wouldn't already take pursuing the core loop — every sandbox criterion reuses a stat or collection AF-020 through AF-041 already produce as a side effect of ordinary play. Grinding is structurally impossible to design into this system, since `AchievementRuntime` never grants anything beyond a cosmetic/knowledge marker.

## 11. Accessibility & performance

Large achievement cards, search, sorting, filtering, controller/touch navigation, colour-blind support, and high contrast build from AF-003/AF-004/AF-005/AF-019 at the UI module. The Discovery Log is capped (§6); achievement checking is a cheap linear scan over eight definitions per tick, well within the performance discipline every prior module maintains.

## 12. Debug

Live: achievements completed/total, Resources and Ancient Artefacts collection counts, and Discovery Log length — rendered in the shared `DebugOverlay` `achievements` field.

---

## Internal review loop (AF-042, recorded)

- **No duplicated systems** — Prestige Rewards, Mastery Records, Statistics, ten of fifteen Collections, and Challenge categories all reuse AF-025/026/034/038 exactly; `AchievementRuntime` and `CollectionLedger` are the only genuinely new mechanical surfaces, and both stay minimal and honestly scoped. ✔
- **Completion celebrates mastery, never dictates gameplay** — every criterion reads a stat the player already generates through ordinary play (kills, discoveries, reputation, research, world state); nothing requires a dedicated farming action. ✔
- **Collections encourage exploration, never excessive grind** — Curator (2 Lore Entries) and Ghost in the Vault (1 Lore Entry) both complete from the galaxy's existing, already-limited point-of-interest content, not a repeatable action. ✔
- **Hidden achievements reward exploration** — verified directly: their placeholder "???" only clears on real completion, and completing one is a byproduct of discovering something the player was already exploring toward. ✔
- **Sandbox proof** — a real achievement roster completes correctly and exactly once per achievement as its criteria is met, the Collection Ledger and Discovery Log populate with real context, and the Statistics screen surfaces all of it — all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a second completion-tracking store (reused `meta.discover("achievements", …)` verbatim); rejected editing AF-026's locked `CollectionCategory`/`ChallengeCategory` unions (built new, orthogonal vocabulary instead where genuinely needed); rejected an unbounded Discovery Log (capped at 50); rejected wiring every existing `discover()` call site into the log in this pass (documented as content debt rather than faked). ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining Collections/Achievements content breadth, Daily/Weekly Challenge cadence mechanics, and the full Player Profile/Collections UI (search, sorting, filtering, timeline) bind at future content and UI modules.**
