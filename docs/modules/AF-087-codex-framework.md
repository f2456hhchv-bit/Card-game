# AF-087 — CODEX FRAMEWORK

**Module status:** Complete (the discovery-progression lattice + player journal over AF-043's unchanged binary unlock gate; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-086 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CODEX_ARCHITECTURE.md` + implementation (`src/game/codex/codexFrameworkData.ts`, `src/game/codex/CodexProgressionRuntime.ts`)

---

*(Module catalogued verbatim below.)*

87

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-086 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Codex Framework.

The Codex is not a menu.

It is the living memory of the Afterlight universe.

Everything the player discovers should permanently expand humanity's understanding of the galaxy.

The Codex should become one of the most rewarding progression systems in the game.

Players should genuinely want to complete it.

==================================================
CORE PHILOSOPHY
==================================================

Discovery.

Knowledge.

Wonder.

History.

Completion.

Every discovery should answer questions while creating new ones.

==================================================
CODEX ARCHITECTURE
==================================================

Every Codex Entry contains:

Unique ID

Category

Subcategory

Name

Description

Lore

Discovery Method

Discovery Progress

Images

Audio

Related Entries

Timeline Position

Statistics

Future Expansion Hooks

Nothing remains undefined.

==================================================
PRIMARY CATEGORIES
==================================================

Support:

Civilisations

Commanders

Ships

Weapons

Equipment

Relics

Research

Enemies

Bosses

Biomes

Species

Planets

Star Systems

Ancient Technology

Afterlight Network

Void Phenomena

Galaxy History

Future categories extend naturally.

==================================================
DISCOVERY SYSTEM
==================================================

Entries unlock through:

Exploration

Scanning

Combat

Research

Dialogue

Story

Bosses

Collections

Scientific Analysis

No entry should require random luck alone.

==================================================
ENTRY STRUCTURE
==================================================

Every entry supports:

Summary

Detailed Lore

Scientific Notes

Historical Context

Gameplay Information

Related Discoveries

Gallery

Statistics

Timeline

Cross References

The Codex becomes a knowledge web.

==================================================
DISCOVERY PROGRESSION
==================================================

Entries progress through:

Unknown

↓

Observed

↓

Scanned

↓

Studied

↓

Understood

↓

Mastered

Knowledge expands naturally.

==================================================
MULTIMEDIA
==================================================

Support:

Concept Art

3D Models

Audio Logs

Voice Recordings

Recovered Documents

Scientific Diagrams

Animated Displays

Music Themes

Presentation remains premium.

==================================================
TIMELINE
==================================================

Maintain a living historical timeline covering:

Ancient Civilisation

Collapse

Human Expansion

Faction Wars

Scientific Discoveries

Campaign Events

Player Discoveries

Galaxy Restoration

History becomes interactive.

==================================================
RELATED KNOWLEDGE
==================================================

Every entry links to:

Related Species

Related Technology

Related Planets

Related Factions

Related Bosses

Related Missions

Related Research

Related Timeline Events

Knowledge encourages exploration.

==================================================
COLLECTION REWARDS
==================================================

Completion unlocks:

Lore

Achievements

Cosmetics

Museum Displays

Commander Dialogue

Gallery Items

Historical Records

Legendary Discoveries

Rewards celebrate curiosity.

==================================================
PLAYER JOURNAL
==================================================

Support:

Personal Notes

Pinned Entries

Bookmarks

Discovery History

Favourite Entries

Search History

Players curate their own archive.

==================================================
ACCESSIBILITY
==================================================

Support:

Search

Filters

Text Scaling

Narration Ready

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Readable Fonts

==================================================
PERFORMANCE
==================================================

Lazy load entries.

Cache search.

Pool gallery assets.

Optimise cross references.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Discovery Count

Completion %

Missing Entries

Timeline Progress

Collection Status

Performance

==================================================
OUTPUT
==================================================

Produce the complete Codex Framework.

Every future discovery extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete the Codex repeatedly.

Review discovery pacing.

Review readability.

Review search.

Review cross references.

Review progression.

Review rewards.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-086.

Reduce repetitive entries.

Strengthen scientific storytelling.

Improve knowledge progression.

Ensure the Codex becomes one of Afterlight's defining features—a living encyclopaedia that rewards curiosity, encourages exploration and makes every expedition permanently expand the player's understanding of one of gaming's richest science-fiction universes.

Repeat until the Codex Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-087.

---

## Foundation / AF-000–086 / GP-FINAL alignment review (recorded at catalogue time)

- **AF-043 is the engine; AF-087 is the discovery doctrine over it:** `CodexEntryDef`, `CODEX_CATEGORIES`, `TIMELINE_ERAS`, `CodexUnlockRef`, and `CodexRuntime` (search, timeline, missing links, discovery %, section completion) stand untouched. `CodexEntryProfileDef` wraps each entry BY ID with subcategory, discovery method, the two new Entry Structure fields (gameplay information, scientific notes), an audio reference, and expansion hooks; `codexArchitectureFor` proves all fourteen spec parts — "nothing remains undefined" as a function, verified against EVERY entry in the real 40-entry sandbox roster, hand-authored or deterministically derived.
- **NO NEW CATEGORY INVENTED — seventeen primary categories, all REALISED:** twelve map directly onto AF-043's real category shelf (civilisations→factions, the AF-085 reading); five have no AF-043 home and realise onto EXISTING references instead of widening the locked union — Planets and Star Systems onto AF-038's real galaxy systems, Ancient Technology onto the ancientCivilisations shelf, Afterlight Network onto AF-082's REAL "afterlight-network" research node (the precursor loom, still running), and Void Phenomena onto AF-039's voidLegion faction plus AF-086's voidIncursions galactic event. Nine discovery routes and eight multimedia kinds each name their live binding with an honesty flag — Concept Art and Recovered Documents are already live through AF-043's own `image`/`recoveredArchives` fields; the rest honestly await production.
- **THE DISCOVERY PROGRESSION LADDER is the module's one genuinely new mechanical surface:** `CodexDiscoveryRuntime` is the sixth appearance of the monotone-lattice pattern (Unknown→Observed→Scanned→Studied→Understood→Mastered), riding ON TOP of AF-043's unchanged binary unlock gate rather than replacing it — the lattice doesn't know about `isUnlocked`; the composition root only ever advances an entry once it is genuinely unlocked, the same decoupling every prior collection runtime keeps. No-removal API asserted by prototype inspection; a 1,000-career sweep proves stage rank never regresses; a 200-seed shuffled-visiting-order sweep proves every one of the real 40 entries reaches Mastered regardless of visiting order — "complete the Codex repeatedly" executed literally.
- **THE PLAYER JOURNAL, real and distinct from the galaxy's own history:** `CodexJournalRuntime` gives pins, bookmarks, and favourites their own independent toggle sets (three separate curation surfaces, not one relabelled), free-text notes, and TWO histories — Discovery History (permanent, append-only, the player's own progression record) and Search History (deliberately BOUNDED at fifty entries, a personal convenience list, distinct in kind from AF-084/086's permanent galaxy-facing histories, which this module explicitly does not duplicate).
- **Related Knowledge is one relation mechanism, read eight ways:** `relatedKnowledgeKindFor` classifies an existing `relatedEntryIds` target by that target's own real category into one of the spec's eight kinds — no second relation system, and unclassifiable targets (Related Planets, Related Missions) honestly return null rather than being force-fit.
- **Collection Rewards realise onto AF-026's REAL `CosmeticRewardKind` union, existing systems, or honestly future** — Museum Displays point at AF-078's derivation pattern, Historical Records point at AF-086's `GalacticHistoryRuntime`, Commander Dialogue is registered future (no VO system yet) — zero new reward kinds invented.
- **LIVE in the composition root:** every newly-unlocked entry is auto-recorded "Observed" the instant AF-043's own unlock check goes true (checked on the existing per-frame section-completion seam); completing a whole Codex section now masters every entry inside it, turning the existing celebration notification into a real progression event; the Statistics screen gained a genuine "Pin Featured Discovery" button, browser-verified end to end (click → `Journal: 1 pinned … Featured: The Archive (pinned)`); the overlay's codex line now reads `13/50 entries (26%) · … · observed 13 · mastered 13 · journal 0pin/0bm/0fav` at boot — the always-unlocked single-entry sections complete (and therefore master) on the very first frame, exactly as designed.
- **Self-review executed:** 13 new tests — the thirteen shelves, the no-new-category realisation battery with an explicit existing-reference assertion, the timeline/discovery-route/multimedia/reward bindings, the related-knowledge classifier with an honest null, full fourteen-part-plus-ten-section completeness for all forty real sandbox entries, the derived-fallback battery, the monotone lattice with skip-ahead and no-removal proofs, a 1,000-career regression sweep, the full player-journal battery (toggles, notes, both histories, the search-history cap proven exactly), and the **200-seed shuffled-order "complete the Codex repeatedly" sweep**. Suite: 1019 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-043; the discovery doctrine as pure data + two small pure runtimes; the primary-category register realised with no union widening; a real player-facing action wired and browser-verified). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CODEX_ARCHITECTURE.md`, `src/game/codex/codexFrameworkData.ts`, `src/game/codex/CodexProgressionRuntime.ts`.
