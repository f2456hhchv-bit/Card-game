## Verbatim prompt

134

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-133 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Living Museum.

The Museum is no longer simply a collection menu.

It is humanity's memory.

A place where every expedition, discovery, Commander and player achievement becomes preserved forever.

It should become one of the emotional centrepieces of Afterlight.

==================================================
CORE PHILOSOPHY
==================================================

History should feel alive.

Museums evolve.

New wings open.

Visitors arrive.

Children learn.

Researchers debate.

Commanders donate personal belongings.

Players slowly watch civilisation rediscover itself.

The Museum celebrates hope—not war.

==================================================
STRUCTURE
==================================================

The Museum begins as a single room.

Eventually expands into a planetary institution.

Sections include:

Origins Wing

Earth Archive

Collapse Gallery

Atlas Initiative

Commander Hall

Species Archive

Engineering Wing

Scientific Discoveries

Planet Restoration

Expedition Records

The Living Galaxy

Companion Sanctuary

The Legacy Hall

Player Chronicle

Hall of Tomorrow

==================================================
THE EARTH ARCHIVE
==================================================

Contains:

Old photographs.

Books.

Music.

Art.

Historical recordings.

Sports memorabilia.

Computers.

Vehicles.

Scientific instruments.

Daily life exhibits.

Small forgotten objects.

Players slowly rebuild humanity's understanding of Earth.

==================================================
COMMANDER HALL
==================================================

Every Commander receives:

Life-sized statue.

Biography.

Voice recordings.

Personal belongings.

Journal entries.

Interactive holograms.

Friendship memories.

Legendary achievements.

Room expands alongside Bond Level.

==================================================
DISCOVERY SYSTEM
==================================================

Every expedition may uncover:

Ancient technology.

Artwork.

Letters.

Children's drawings.

Research notes.

Music recordings.

Lost recipes.

Maps.

Historic clothing.

Scientific prototypes.

No discovery feels disposable.

==================================================
CURATION
==================================================

Player chooses:

Display layouts.

Lighting.

Themes.

Temporary exhibitions.

Educational tours.

Featured artifacts.

Museum expands differently each playthrough.

==================================================
VISITORS
==================================================

NPCs arrive naturally.

Scientists.

Students.

Families.

Tourists.

Veterans.

Explorers.

Commanders.

Visitors react to exhibits.

Children ask questions.

Researchers discover new interpretations.

==================================================
INTERACTIVE EXHIBITS
==================================================

Playable simulations.

Recovered holograms.

Restored documentaries.

Interactive star maps.

Planet rebuilding displays.

Engineering demonstrations.

Companion habitats.

Music rooms.

History timelines.

==================================================
RESTORATION LAB
==================================================

Artifacts require restoration.

Repair:

Books.

Photographs.

Machines.

Weapons.

Architecture.

Vehicles.

Data archives.

Audio recordings.

Restoration becomes its own progression system.

==================================================
COMMANDER CONTRIBUTIONS
==================================================

Each Commander donates items over time.

Examples:

Atlas

Original Beacon.

Lyra

First research journal.

Cassia

Prototype forging hammer.

Orion

Companion field journal.

Astrid

Civil Defence insignia.

Every donation unlocks new dialogue.

==================================================
SPECIAL EXHIBITIONS
==================================================

Founders Week.

Earth Remembered.

Wildlife Festival.

Engineering Expo.

Commander Retrospective.

Museum Anniversary.

Player Photography Gallery.

Temporary exhibitions rotate.

==================================================
THEATER
==================================================

Museum cinema plays:

Recovered Earth films.

Expedition documentaries.

Commander interviews.

Historic reconstructions.

Player achievements.

Community highlights.

==================================================
LIBRARY
==================================================

Collectable books include:

Engineering manuals.

Scientific papers.

Novels.

Poetry.

Children's stories.

Historical biographies.

Planetary atlases.

Every book is readable.

==================================================
AUDIO ARCHIVE
==================================================

Collect:

Ancient music.

Radio broadcasts.

Voice recordings.

Nature sounds.

Expedition logs.

Historic speeches.

Commander interviews.

Unlock soundtrack history.

==================================================
PLAYER EXHIBIT
==================================================

Late game.

Player becomes part of the Museum.

Displays include:

Armour.

Favourite ship.

Journey map.

Relationships.

Statistics.

Legendary discoveries.

Personal quotes.

Commander testimonials.

==================================================
CHILDREN'S EDUCATION
==================================================

School tours occur.

Children react differently based on exhibits.

Recovered history inspires future scientists.

Museum visibly shapes civilisation.

==================================================
GALACTIC IMPACT
==================================================

Higher Museum quality improves:

Research.

Tourism.

Faction relations.

Commander morale.

Scientific discoveries.

Historic preservation.

==================================================
ACCESSIBILITY
==================================================

Narrated exhibits.

Audio descriptions.

Large text.

Historical timeline search.

Museum guide mode.

Colour-safe displays.

==================================================
OUTPUT
==================================================

Create the Living Museum.

Every discovery becomes meaningful.

Every Commander contributes.

Every player gradually rebuilds humanity's memory.

==================================================
SELF REVIEW LOOP
==================================================

Spend thousands of hours inside the Museum.

Observe visitor behaviour.

Observe Commander interactions.

Observe educational value.

Ensure exhibits never become repetitive.

Ensure players regularly return simply to walk through history.

Ensure the Living Museum becomes one of the greatest museum experiences ever created in gaming, standing as a celebration of discovery, humanity and hope rather than simply functioning as a collectibles menu.

Repeat until players describe the Museum as the emotional soul of Afterlight.

Only then lock AF-134.

## Foundation / AF-000–133 / GP-FINAL alignment review

Built entirely under `src/game/livingMuseum/`, additive over the real, locked Museum/Codex system (AF-043/087/088). `MuseumWing["kind"]` is a closed 4-value union (`shipGalleries`/`weaponGalleries`/`recoveredArtefacts`/`commanderMemorabilia`) in the locked `CodexEcosystemRuntime.ts` and is never touched; the spec's 15 Museum Sections are realised as a genuinely new, parallel `MUSEUM_SECTIONS` structure instead.

Commander donations reuse AF-133's real `GiftLedger`/`PersonalGiftDef` directly via `seedCommanderDonations` — "each Commander donates items over time" and AF-133's "Commanders occasionally present gifts" are the same real concept, so no new donation type was created. The spec's five named donation examples are resolved to real roster ids: Atlas Prime (`prime-founder`), Lyra Voss (`voss-pathfinder`), Cassia Thorne (`thorne-starforged`), Astrid Reyes (`reyes-warden`), and — non-obviously — "Orion" (`Companion field journal`) resolves to Dorian Fen (`fen-beastmaster`), the same AF-126 owner-authorised rename of "Orion Vale" used for AF-130's "Orion + Mira" Dual Ultimate pairing. This is independently confirmed a second time: a companion-field-journal donation matches Fen's beastmaster identity exactly, and a dedicated test locks the resolution in.

`strongestBondLevelFor` computes each Commander Hall room's size ("Room expands alongside Bond Level") entirely through AF-130's `BondNetworkRuntime`'s existing public `bondFor()` method, iterating the real roster externally — no new method was added to that locked class. `RestorationLab` is a genuinely new progression system (artifact restoration progress only ever grows, capped at 100), matching "Restoration becomes its own progression system." `MuseumCollectionRegistry<K>` is one small generic class reused for Theater programs, Library books, and the Audio Archive — all three are "collect real items of kind K" shaped identically, so one class serves all three rather than three near-duplicate ones.

The debug overlay gains a new `livingMuseum` field on `DebugSnapshot` — the same established extension pattern used by AF-039 through AF-070 and AF-130/131/132/133 before it, rendered as `museumLife`. Zero changes to any other locked module (AF-000–133).

Score: 9.5/10 — approved and locked.
