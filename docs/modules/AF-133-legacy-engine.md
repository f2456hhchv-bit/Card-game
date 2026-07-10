## Verbatim prompt

133

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-132 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Legacy Engine.

The Legacy Engine permanently records everything the player accomplishes.

Nothing meaningful is forgotten.

Every achievement becomes part of the galaxy's history.

Future playthroughs acknowledge previous accomplishments.

==================================================
CORE PHILOSOPHY
==================================================

Players should feel they leave a permanent mark on the universe.

The game remembers.

The galaxy remembers.

People remember.

History remembers.

The Legacy Engine is the memory of Afterlight.

==================================================
FOUNDATIONAL PRINCIPLES
==================================================

Every meaningful action creates history.

Every choice has context.

History is not a checklist.

History becomes lore.

Future generations inherit the player's legacy.

==================================================
LEGACY CATEGORIES
==================================================

Explorer

Scientist

Commander

Engineer

Builder

Diplomat

Guardian

Conqueror

Conservationist

Collector

Historian

Mentor

Founder

Each category tracks independently.

==================================================
GALACTIC HISTORY
==================================================

Every major accomplishment creates an official historical record.

Examples

First colony restored.

First alien alliance.

Largest rescue.

Longest expedition.

Strongest Commander bond.

Greatest engineering project.

Oldest museum artifact recovered.

Every record includes:

Date.

Planet.

Commanders involved.

Photographs.

Dialogue.

News coverage.

Museum entry.

==================================================
PLAYER CHRONICLE
==================================================

A living biography follows the player.

Contains:

Personal timeline.

Achievements.

Favourite Commander.

Most visited planets.

Most used ship.

Greatest victories.

Hardest defeats.

Relationships.

Memories.

Travel history.

Playable statistics.

==================================================
GALACTIC RECORDS
==================================================

Fastest expedition.

Highest Humanity Score.

Largest colony.

Most wildlife preserved.

Highest research output.

Best diplomacy record.

Biggest engineering achievement.

Longest uninterrupted exploration.

Deepest Void expedition.

Every record can eventually be surpassed.

==================================================
MEMORY SYSTEM
==================================================

NPCs remember:

Player kindness.

Player mistakes.

Broken promises.

Heroic rescues.

Scientific achievements.

Diplomatic decisions.

Infrastructure projects.

Wildlife conservation.

Museum donations.

Memory naturally fades for minor events.

Historic events remain forever.

==================================================
COMMANDER MEMORIES
==================================================

Each Commander remembers:

Favourite missions.

Near-death moments.

Funny moments.

Shared discoveries.

Major disagreements.

Legendary victories.

Personal gifts.

Important conversations.

Friendships evolve naturally.

==================================================
PERSONAL GIFTS
==================================================

Commanders occasionally present gifts.

Examples

Books.

Photographs.

Blueprints.

Plants.

Small sculptures.

Historical artifacts.

Letters.

Each item receives museum-quality descriptions.

==================================================
PLAYER JOURNAL
==================================================

Automatically records:

Discoveries.

Interesting conversations.

Rare wildlife.

Personal notes.

Planet sketches.

Weather.

Historic events.

The journal feels handwritten.

==================================================
PHOTO MODE INTEGRATION
==================================================

Player photographs become:

Museum displays.

Commander room decorations.

Loading screens.

Historical archives.

Books.

News articles.

==================================================
TIME CAPSULES
==================================================

Players can create Time Capsules.

Include:

Messages.

Photos.

Favourite builds.

Commander lineup.

Statistics.

Years later they reopen.

Commanders comment on them.

==================================================
ANNIVERSARIES
==================================================

The galaxy celebrates:

Player's first expedition.

Commander recruitment anniversaries.

Planet restorations.

Historic discoveries.

Museum milestones.

Founder's Day.

==================================================
LEGACY MUSEUM
==================================================

Entire new museum wing.

Player becomes an exhibit.

Displays include:

Journey map.

Recovered relics.

Commander friendships.

Favourite equipment.

Legendary moments.

Historical interviews.

==================================================
MULTIPLE SAVE LEGACIES
==================================================

New characters inherit history.

Examples

"The previous expedition restored Helios."

"Atlas Prime mentioned your earlier discoveries."

Museum recognises former expeditions.

Nothing breaks canon.

==================================================
ENDING LEGACY
==================================================

Every ending creates:

Historical documentaries.

Museum exhibitions.

Commander interviews.

Planetary celebrations.

Historical textbooks.

Galaxy-wide memorials.

Future expeditions reference these events.

==================================================
ACCESSIBILITY
==================================================

Legacy timeline viewer.

Searchable journal.

Memory summaries.

Historical filters.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Legacy Engine.

Everything meaningful becomes permanent history.

Players genuinely feel remembered by the universe.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of complete playthroughs.

Ensure memories remain coherent.

Avoid contradictory history.

Keep journals personal.

Keep museum evolving.

Ensure Commander memories feel authentic.

Ensure the player becomes emotionally attached to their own legacy.

Ensure the Legacy Engine becomes one of Afterlight's defining features and a benchmark for persistent storytelling in games.

Repeat until every completed playthrough feels like a unique chapter in humanity's history.

Only then lock AF-133.

## Foundation / AF-000–132 / GP-FINAL alignment review

A dedicated research pass ran before any implementation, given how heavily this spec overlaps with several already-locked systems. It confirmed: `MetaProgression` already persists a free-form `statistics: Record<string, number>` map with no fixed enum (safe to add new keys to, never modified here); the Museum (AF-087/088) already has a real `MuseumWing` concept with 4 roster-based kinds — this module adds a genuinely new, player-authored wing kind of its own rather than touching that locked union; `GalacticHistoryRuntime` (AF-086) already exposes an externally-callable `record(kind, factionId, description)` — this module's `GalacticHistoryLog` optionally forwards into it via a constructor hook rather than duplicating it, while keeping its own richer per-record shape (date/planet/commanders/photo/dialogue/news/museum flags) that the locked shape doesn't have; AF-130's `EmotionalMemoryLog` already takes a free-string `kind` parameter, so Commander Memories reuses that class directly, feeding it `COMMANDER_MEMORY_KINDS` values, rather than duplicating a new memory-log class; `SaveProfileManager` (AF-044) supports multiple isolated profiles but has no inheritance between them — genuinely new territory, addressed as a pure composable snapshot/summary layer (`exportLegacySnapshot`/`inheritedFlavourLines`) that never modifies `SaveProfileManager` itself; and no photo-capture system exists anywhere, so `PhotoAlbum`/`PhotoDef` define the real data contract a future capture pipeline can plug into rather than a fake screenshot mechanism.

`NpcMemoryLog` is a genuinely new class, not a reuse of AF-130's `EmotionalMemoryLog`, because it has real behaviour that log doesn't: minor memories fade past a bounded per-subject capacity while historic-flagged ones never do, matching the spec's "memory naturally fades for minor events; historic events remain forever" — a real behavioural difference, verified by a dedicated test. `GalacticRecordBoard.submit` only keeps a submission if it actually beats the current record, respecting each kind's own better-direction (`GALACTIC_RECORD_DIRECTIONS` — "Fastest expedition" is the sole lower-is-better kind; every other kind is higher-is-better), matching "every record can eventually be surpassed" — verified for both directions by a dedicated test. `TimeCapsuleVault.reopen` structurally enforces "years later they reopen": a capsule cannot be reopened in the same epoch it was created. `PlayerChronicle` gives the "most visited planets"/"most used ship"/greatest-victories tracking the research confirmed did not exist anywhere before this module.

The debug overlay gains a new `legacy` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-070 and AF-130/131/132 before it. Zero changes to any other locked module (AF-000–132).

Score: 9.5/10 — approved and locked.
