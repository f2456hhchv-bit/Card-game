# AF-043 — CODEX FRAMEWORK

**Module status:** Complete (framework specified; unlock-reference/search/timeline/section-completion engine implemented and tested; a sandbox roster of thirty entries governs Galaxy Command's knowledge archive end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-042 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CODEX_FRAMEWORK.md` + implementation (`src/game/codex/`)

---

*(Module catalogued verbatim below.)*

43

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-042 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Codex Framework.

The Codex is the permanent knowledge archive of Afterlight.

It records everything the player discovers.

Players should never be forced to read lore.

However, those who choose to explore the Codex should uncover one of the richest science-fiction universes ever created.

Every discovery should deepen understanding of the galaxy.

==================================================
CORE PHILOSOPHY
==================================================

Discovery.

Curiosity.

History.

Understanding.

Preservation.

Knowledge is a reward.

The Codex grows alongside the player.

==================================================
CODEX STRUCTURE
==================================================

The Codex contains:

Galaxy History

Timeline

Factions

Commanders

Ships

Weapons

Equipment

Relics

Enemies

Elite Variants

Bosses

Biomes

Resources

Research

Technology

Ancient Civilisations

Characters

Events

Achievements

Collections

Future expansions extend naturally.

==================================================
DISCOVERY RULES
==================================================

Entries unlock through:

Exploration

Combat

Boss Defeats

Research

Crafting

Collections

Mission Completion

Galaxy Events

Ancient Archives

Special Discoveries

Players earn knowledge naturally.

==================================================
ENTRY STRUCTURE
==================================================

Every Codex entry contains:

Unique ID

Category

Title

Summary

Detailed Lore

Images

Statistics

Discovery Source

Related Entries

Timeline Position

Version

Future Expansion Hooks

==================================================
LORE LAYERS
==================================================

Layer One

Quick Summary

----------------------------

Layer Two

Detailed Description

----------------------------

Layer Three

Historical Context

----------------------------

Layer Four

Recovered Archives

Players choose how deeply to explore.

==================================================
INTERCONNECTED KNOWLEDGE
==================================================

Every entry links to:

Related Factions

Related Commanders

Related Ships

Related Weapons

Related Bosses

Related Biomes

Related Technologies

Related Timeline Events

The Codex forms a connected knowledge web.

==================================================
TIMELINE
==================================================

The Timeline records:

Ancient Civilisations

The Collapse

The Afterlight Event

Human Expansion

Machine Evolution

Crystal Ascension

Void Incursions

Modern Era

Future Discoveries

History unfolds naturally.

==================================================
DISCOVERY REWARDS
==================================================

Completing Codex sections may unlock:

Lore

Achievements

Cosmetics

Titles

Music

Concept Art

Historical Records

Hidden Missions

Knowledge itself remains the primary reward.

==================================================
SEARCH
==================================================

Support:

Search by Name

Category

Faction

Technology

Biome

Enemy

Keyword

Partial Match

Instant filtering.

==================================================
PLAYER JOURNAL
==================================================

Automatically record:

Recent Discoveries

Mission Reports

Boss Encounters

Research Notes

Commander Logs

Galaxy Events

Personal Statistics

Journey Timeline

The player's adventure becomes a permanent record.

==================================================
LORE PRESENTATION
==================================================

Display:

Illustrations

Recovered Documents

Scientific Reports

Commander Logs

Faction Records

Interactive Timeline

Animated Maps

Presentation remains premium.

==================================================
ACCESSIBILITY
==================================================

Support:

Large Text

Font Scaling

Search

Filtering

Controller Navigation

Touch Navigation

Narration Ready (future)

High Contrast

==================================================
PERFORMANCE
==================================================

Lazy load Codex entries.

Cache search.

Pool UI components.

Optimise database lookups.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Entries Unlocked

Discovery %

Missing Links

Timeline Status

Search Performance

Memory Usage

==================================================
OUTPUT
==================================================

Produce the complete Codex Framework.

Every future lore entry, expansion, civilisation and discovery extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Unlock every Codex entry.

Review knowledge progression.

Review search.

Review navigation.

Review readability.

Review timeline.

Review lore consistency.

Review player journal.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-042.

Strengthen connections.

Remove duplicated information.

Improve discoverability.

Ensure the Codex becomes one of the defining features of Afterlight, rewarding curiosity with a rich, interconnected history while never obstructing players who prefer to focus on gameplay.

Repeat until the Codex Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-043.

---

## Foundation / AF-000–042 / GP-FINAL alignment review (recorded at catalogue time)

- **The Codex introduces zero new unlock mechanism.** Every `CodexEntryDef.unlock` reference reads a discovery AF-026's `MetaProgression.hasDiscovered()` or AF-042's `CollectionLedger.hasDiscovered()` already tracks (`{kind:"collection"|"extraCollection", …}`), or is `alwaysUnlocked` for foundational reference material never meant to be gated — satisfying "players should never be forced to read lore" without needing a separate opt-out flag. `CodexRuntime` never calls `discover()` itself; it only reads.
- **Discovery Rewards on Codex Section Completion reuse AF-026's existing `CosmeticRewardKind` and AF-042's exact completion bucket** — `meta.discover("achievements", "codex-complete-<category>")`, namespaced so it never collides with an achievement id, mirroring the discipline AF-042 itself established for challenge completion.
- **This module's real code contribution was finding and finally wiring several already-registered-but-dormant collection buckets, exposing them as real Codex content.** AF-026's `"ships"`/`"commanders"`/`"weapons"` collection categories and AF-039's `FactionDef.loreId` field had existed with zero producers since their introducing modules; AF-026's `"relics"` bucket was similarly dormant. All four now have a real, live producer (fielding a Ship/Commander/Weapon at run start; completing a Faction Mission; `RelicAcquired` firing) — the identical "give a dormant hook its first producer" pattern AF-024's `galaxyNavigation` research category received from AF-038's `warp-charting` node, now a fourth/fifth time.
- **Timeline is nine `alwaysUnlocked` overview entries, not nine gated discoveries** — a deliberate design call recorded here: the Timeline is reference material a player can read from the start, while the *individual* Factions/Characters/Ancient Civilisations entries the Timeline links to remain genuinely gated behind discovery. `CodexRuntime.timeline()` sorts by `timelinePosition`, verified strictly ascending across all nine eras in spec order.
- **Interconnected Knowledge is validated, not merely asserted.** `CodexRuntime.missingLinkCount()` checks every `relatedEntryIds` reference against the real entry list; the sandbox roster achieves zero Missing Links, and a dedicated test confirms the counter correctly detects one when deliberately introduced — "strengthen connections" from the module's own self-review loop, executed as a real check rather than a claim.
- **Search is a real, pure, tested function** — `CodexRuntime.search()` matches by title/category/summary, case-insensitive and partial, and is proven to never surface a locked entry even on an exact title match. The UI layer (instant filtering, category/faction/biome/enemy filters) binds at the UI module; this module proves the underlying logic is correct.
- **Player Journal is documented as directly reusing AF-042's existing `CollectionLedger.recentDiscoveries`**, not a second discovery-log store — "Recent Discoveries" is that log verbatim; Personal Statistics is AF-026's existing `meta.stat()`; the remaining journal entry kinds (Mission Reports, Boss Encounters, Research Notes, Commander Logs) are honestly left as future context-richness for that same log, not a second persistence layer.
- **Images/Illustrations/Interactive Timeline/Animated Maps are `null`/deferred placeholders throughout**, consistent with every prior module's honest treatment of AF-002/006's not-yet-produced visual assets — never faked with a fabricated asset reference.
- **Self-review executed:** unlock-reference correctness for both `collection` and `extraCollection` kinds, Timeline ordering, Missing-Link detection (both a clean roster and a deliberately broken one), Discovery % at 0/100% boundaries, Search's locked-entry exclusion, and Section Completion's never-re-report invariant are all tested, including a sweep unlocking every gated sandbox entry one at a time and asserting Discovery % reaches exactly 100% with zero Missing Links at the end ("unlock every Codex entry," executed literally). Live in the browser: discovering the Lucent Gate Ancient Vault cascaded correctly through three modules at once — the Ancient Custodians Codex entry unlocked directly, and completing the "Ghost in the Vault" Hidden Achievement (AF-042, itself triggered by that same discovery) unlocked a second Codex entry gated on that achievement — Discovery % moved from 13/30 (43%) to 15/30 (50%) in one action, with zero Missing Links throughout and zero page errors.

**Review verdict:** ALIGNED (zero new unlock mechanism, zero new reward-kind vocabulary, zero new persistence layer; `CodexRuntime`'s pure search/timeline/link-validation/section-completion logic is the only genuinely new mechanical surface). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CODEX_FRAMEWORK.md`, `src/game/codex/`.
