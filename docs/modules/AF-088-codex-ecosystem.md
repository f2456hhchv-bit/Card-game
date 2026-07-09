# AF-088 — CODEX ECOSYSTEM

**Module status:** Complete (the eight-tier archive ladder, permanent scientific/expedition ledgers, the knowledge web, and the player-notebook extension — all over AF-043/087's unchanged engine; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-087 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CODEX_ECOSYSTEM.md` + implementation (`src/game/codex/codexEcosystemData.ts`, `src/game/codex/CodexEcosystemRuntime.ts`)

---

*(Module catalogued verbatim below.)*

88

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-087 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Codex Ecosystem.

The objective is not simply to store information.

The objective is to transform every discovery into a meaningful part of the player's personal journey through the Afterlight universe.

The Codex should become one of the largest interconnected knowledge systems ever created for a science-fiction game.

Knowledge itself becomes progression.

==================================================
CORE PHILOSOPHY
==================================================

Curiosity.

Exploration.

Preservation.

Connection.

Legacy.

Every discovery should encourage another expedition.

==================================================
KNOWLEDGE WEB
==================================================

Every Codex Entry dynamically connects to:

Civilisations

Species

Commanders

Ships

Weapons

Equipment

Relics

Research

Enemies

Bosses

Biomes

Planets

Star Systems

Historical Events

Ancient Technology

The Afterlight Network

Timeline Events

Future discoveries extend naturally.

Knowledge becomes a living network.

==================================================
DISCOVERY TIERS
==================================================

Every entry progresses through:

Unknown

↓

Detected

↓

Observed

↓

Scanned

↓

Analysed

↓

Understood

↓

Mastered

↓

Archived

Knowledge evolves through gameplay.

==================================================
SCIENTIFIC ARCHIVE
==================================================

Support:

Recovered Research

Scientific Papers

Commander Reports

Field Journals

Laboratory Records

Expedition Logs

Recovered AI Files

Ancient Data

The archive expands naturally.

==================================================
GALACTIC MUSEUM
==================================================

Players unlock:

3D Models

Animated Displays

Recovered Artefacts

Ship Galleries

Weapon Galleries

Ancient Relics

Recovered Fossils

Commander Memorabilia

Museum collections celebrate exploration.

==================================================
TIMELINE ARCHIVE
==================================================

Interactive timeline records:

Precursor Era

The Collapse

Human Expansion

The Great Silence

First Contact

Faction Formation

Scientific Breakthroughs

Campaign Progress

Galaxy Restoration

Player Discoveries

History becomes explorable.

==================================================
DISCOVERY REWARDS
==================================================

Completion unlocks:

Museum Wings

Lore Chapters

Commander Dialogue

Hidden Missions

Research

Cosmetics

Titles

Historical Records

Knowledge always rewards curiosity.

==================================================
EXPEDITION JOURNAL
==================================================

Automatically record:

Mission History

Discoveries

Bosses

Research

Photographs

Scans

Commander Notes

Scientific Observations

Every player creates a unique journal.

==================================================
PLAYER NOTEBOOK
==================================================

Support:

Bookmarks

Pinned Entries

Personal Notes

Favourite Entries

Comparison Notes

Research Goals

Expedition Plans

Notebook encourages investigation.

==================================================
SEARCH SYSTEM
==================================================

Support:

Keyword Search

Category Search

Timeline Search

Faction Search

Discovery Status

Biome Search

Recent Discoveries

Unread Entries

Navigation remains effortless.

==================================================
COLLECTION TRACKING
==================================================

Track completion of:

Species

Civilisations

Ships

Weapons

Relics

Equipment

Research

Bosses

Biomes

Timeline

Museum

Overall Galaxy Completion

Collections motivate exploration.

==================================================
COMMUNITY SUPPORT
==================================================

Future architecture supports:

Shared Discoveries

Museum Showcases

Lore Discussions

Community Research

Global Statistics

World Discoveries

Framework remains expandable.

==================================================
ACCESSIBILITY
==================================================

Support:

Narration Ready

Large Fonts

Text Scaling

Search Suggestions

Controller Navigation

Touch Navigation

High Contrast

Colour-blind Support

Reading Mode

==================================================
PERFORMANCE
==================================================

Cache search.

Lazy load galleries.

Pool museum assets.

Optimise cross references.

Stream multimedia asynchronously.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Knowledge Graph

Discovery %

Museum Completion

Timeline Completion

Search Performance

Memory Usage

Performance

==================================================
OUTPUT
==================================================

Produce the complete Codex Ecosystem.

Every future discovery, expansion and civilisation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete the Codex thousands of times.

Review discovery pacing.

Review museum presentation.

Review knowledge connections.

Review search.

Review collection rewards.

Review timeline.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-087.

Reduce duplicate information.

Strengthen interconnected lore.

Increase curiosity-driven exploration.

Ensure the Codex evolves into one of Afterlight's defining systems—a living galactic archive, museum and scientific encyclopedia that continually rewards exploration while making every discovery feel historically significant.

Repeat until the Codex Ecosystem consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-088.

---

## Foundation / AF-000–087 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-076→086 "ecosystem" move applied to the Codex a second time:** AF-043's engine and AF-087's profile/progression/journal layer stand completely untouched — `CodexEntryDef`, `CodexRuntime`, `CodexEntryProfileDef`, `CodexDiscoveryRuntime`, `CodexJournalRuntime`. AF-088 adds one wrapping runtime, two new permanent ledgers, one notebook extension, and a set of pure query/derivation functions — composition throughout, modification nowhere.
- **THE KNOWLEDGE WEB reaches further than AF-087 ever needed to, with zero new category system:** seventeen web nodes realise fifteen directly onto AF-087's own primary-category register, and reach two layers further into AF-043's real `"timeline"`/`"events"` codex shelves for Timeline Events and Historical Events — shelves AF-087's seventeen categories never touched. `knowledgeWebFor` turns the one flat `relatedEntryIds` mechanism into a genuine seventeen-bucket graph view, asserted against the real forty-entry roster: every bucketed related entry's actual category matches its node's realisation, exactly.
- **THE EIGHT-TIER DISCOVERY LADDER is composition, never modification, proven structurally:** `CodexArchiveRuntime` wraps an `CodexDiscoveryRuntime` INSTANCE and layers Detected (before Observed) and Archived (after Mastered — a permanent parallel mark requiring Mastered first, the AF-077 "evolved" pattern again) around it. The six shared tiers are asserted to preserve AF-087's own internal order exactly (Analysed is a RELABEL of the identical "studied" ordinal slot — the wrapped runtime's own vocabulary is asserted unchanged and readable through its own API in the same test). Archiving without mastering first is asserted to fail; the six-tier sub-sequence is asserted to sit at strictly increasing indices inside the eight-tier superset.
- **TWO MORE PERMANENT LEDGERS, the seventh and eighth appearances of the append-only pattern:** `ScientificArchiveRuntime` and `ExpeditionJournalRuntime` are both sequence-monotone, no-removal (asserted by the same prototype-inspection regex used since AF-084), and — critically — the Expedition Journal is AUTOMATICALLY fed at three REAL composition-root seams (the codex-unlock check, the real `endRun`, and the real research-unlock callback), never player-curated; that distinction from the Player Notebook is the spec's own §Expedition Journal vs §Player Notebook split, honoured exactly.
- **THE PLAYER NOTEBOOK is completed, not duplicated:** AF-087's locked `CodexJournalRuntime` already ships four of the spec's seven surfaces (bookmarks, pins, notes, favourites) — verified by name in a test. AF-088 registers and implements exactly the three NEW ones (Comparison Notes, Research Goals, Expedition Plans) in its own small extension runtime, never touching the locked journal.
- **Eight Search System kinds are REAL functions, not just names:** `searchByCategory`, `searchByFaction`, `searchByBiome`, `searchByDiscoveryStatus`, `searchByTimelineEra`, `recentDiscoveries`, and `unreadEntries` all run against the real sandbox roster and the real AF-087/088 runtimes in tests — "unread" is defined precisely as unlocked-but-pre-Observed on the AF-088 ladder, and is asserted to shrink the instant an entry is Observed.
- **Collection Tracking's twelfth tracker is an IDENTITY CHECK on AF-043's own arithmetic:** `collectionCompletionFor`'s `overallGalaxyCompletion` is asserted to equal `CodexRuntime.discoveryPercent` exactly — the aggregate never drifts from the engine's own number. The Museum tracker is a genuine live/total ratio over `MUSEUM_EXHIBIT_KINDS`' honesty flags.
- **COMMUNITY SUPPORT IS HONESTLY DEFERRED, matching AF-000's own Master Constitution** — online/community features are an explicit later, optional layer over the offline-first core; the six spec items are a registered list of strings and nothing else, asserted to contain no networking code by the simple fact that the file contains none.
- **LIVE in the composition root:** the Discoveries/Scientific Papers auto-feed fires on the exact same per-frame unlock-check seam AF-087 introduced; Mission History and Bosses feed at the real `endRun`; Recovered Research feeds at the real research-unlock callback; the Statistics screen gained a second real button, "Set/Clear Research Goal," alongside AF-087's Pin — browser-verified end to end (`Journal: … Featured: The Archive (not pinned, goal)`); the overlay's codex line now reads `archived 0 · museum 83% · sci-archive 13 · expo-journal 13 · goals 0` at boot, both ledgers already non-empty from the very first frame's real unlocks.
- **Self-review executed:** 16 new tests — the thirteen shelves, the knowledge-web realisation battery with a real-roster bucketing proof, the timeline-archive total map with the honest dynamic exception, the eight-tier structural-containment proof, the Player-Notebook completion-not-duplication assertion, the composition proofs for `CodexArchiveRuntime` (detected-before-observed, archived-requires-mastered, the studied/analysed relabel), all eight search functions against the real roster, the collection-completion identity check, both new ledgers' append-only/no-removal battery, the notebook extension's three new surfaces, and a **500-seed shuffled-order sweep driving every one of the forty real entries from Unknown to Archived** through both runtimes together without ever regressing — "complete the Codex thousands of times," scaled to the ecosystem's own two-layer ladder. Suite: 1035 passing. **Live in the browser:** zero page errors.

**Review verdict:** ALIGNED (zero changes to AF-043/087; the ecosystem as one wrapping runtime + two ledgers + one notebook extension + pure query functions; the Knowledge Web reaching two categories deeper than AF-087 without inventing one; Community Support honestly deferred per the Constitution itself). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CODEX_ECOSYSTEM.md`, `src/game/codex/codexEcosystemData.ts`, `src/game/codex/CodexEcosystemRuntime.ts`.
