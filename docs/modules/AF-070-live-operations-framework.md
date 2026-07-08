# AF-070 — LIVE OPERATIONS FRAMEWORK

**Module status:** Complete (framework + core-game pack + Season 1 implemented on locked engines; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-069 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/LIVE_OPERATIONS_FRAMEWORK.md` + implementation (`src/game/liveops/`)

---

*(Module catalogued verbatim below.)*

70

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-069 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Live Operations Framework.

Afterlight is designed to remain relevant for many years.

Every future update should extend the existing universe.

Never invalidate previous content.

Never create power creep.

Every season, expansion and update should make the galaxy feel larger rather than replacing what already exists.

==================================================
CORE PHILOSOPHY
==================================================

Longevity.

Respect player time.

Horizontal expansion.

Community.

Discovery.

Evolution without fragmentation.

==================================================
LIVE CONTENT STRUCTURE
==================================================

Core Game

↓

Season Updates

↓

Galaxy Events

↓

Major Expansions

↓

New Factions

↓

New Campaigns

↓

New Biomes

↓

Legendary Expeditions

↓

Community Features

↓

Future Decade Roadmap

Everything builds upon existing systems.

==================================================
SEASONAL MODEL
==================================================

Every season introduces:

Galaxy Events

New Missions

New Relics

New Cosmetics

New Lore

Temporary Challenges

Permanent Discoveries

Quality of Life Improvements

Core progression never resets.

==================================================
EXPANSION MODEL
==================================================

Major expansions may introduce:

New Galaxy Regions

New Biomes

New Factions

New Bosses

New Ships

New Commanders

New Research

New Campaign Chapters

Existing content remains valuable.

==================================================
CONTENT PHILOSOPHY
==================================================

New content expands horizontally.

Never replaces older systems.

Players may enjoy any content in any order once unlocked.

Older rewards remain meaningful.

==================================================
GALAXY EVOLUTION
==================================================

The universe grows through:

New Civilisations

Scientific Discoveries

Ancient Recoveries

Exploration

Political Change

Environmental Evolution

Void Activity

The galaxy feels alive across years.

==================================================
LIVE EVENTS
==================================================

Support:

Faction Wars

Galaxy Emergencies

Ancient Reactivations

Scientific Expeditions

Community Goals

Legendary Boss Hunts

Exploration Campaigns

Discovery Events

Events integrate naturally with the world.

==================================================
COMMUNITY OBJECTIVES
==================================================

Future support for:

Global Restoration

Research Projects

Exploration Goals

Faction Contributions

Galaxy Defence

World Milestones

Community rewards remain cosmetic or optional.

==================================================
SEASONAL REWARDS
==================================================

Support:

Commander Skins

Ship Paints

Portrait Frames

Titles

Engine Trails

Music Packs

Codex Entries

Lore

Gameplay power remains horizontal.

==================================================
ROADMAP SUPPORT
==================================================

Architecture must support:

Year 1

Year 2

Year 3

Year 5

Year 10

Without requiring architectural redesign.

==================================================
PLAYER RESPECT
==================================================

Avoid:

Mandatory Daily Logins

FOMO-exclusive gameplay

Power locked behind seasons

Artificial time gates

Exploitative monetisation

Player trust is a core design pillar.

==================================================
MONETISATION PRINCIPLES
==================================================

Support optional purchases such as:

Cosmetics

Soundtracks

Art Books

Expansion Packs

Supporter Packs

Convenience only where appropriate.

Never pay-to-win.

==================================================
QUALITY ASSURANCE
==================================================

Every live update must preserve:

Performance

Balance

Save Compatibility

Accessibility

Lore Consistency

Existing Progression

Regression testing becomes mandatory.

==================================================
ACCESSIBILITY
==================================================

Support:

Season Archive

Content Timeline

Story Recaps

Large UI

Controller Navigation

Touch Navigation

High Contrast

Colour-blind Support

Players should never feel lost returning after months away.

==================================================
PERFORMANCE
==================================================

Modular content loading.

Lazy load expansions.

Maintain backward compatibility.

Optimise seasonal assets.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Live Version

Content Packs

Expansion Status

Season State

Compatibility

Performance

==================================================
OUTPUT
==================================================

Produce the complete Live Operations Framework.

Every future season, expansion, DLC and major update extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate ten years of live development.

Review content cadence.

Review player retention.

Review progression.

Review expansion quality.

Review technical compatibility.

Review save migration.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-069.

Adjust content cadence.

Adjust reward philosophy.

Adjust update scope.

Remove unnecessary complexity.

Ensure Afterlight can evolve for a decade while preserving player trust, technical excellence and a coherent galaxy that grows naturally over time.

Repeat until the Live Operations Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-070.

---

## Foundation / AF-000–069 / GP-FINAL alignment review (recorded at catalogue time)

- **The third ledger module (AF-068 campaign → AF-069 endgame → AF-070 live ops), and the one that guards all the others:** `LiveOpsRegistry` is a validating CONTENT-PACK REGISTRY where the spec's promises are registration-time GATES, not guidelines. Validation is all-or-nothing — a rejected pack mutates NOTHING (snapshot-equality asserted).
- **"Never invalidate previous content / never replaces older systems" is a rejection, not a rule of thumb:** an addition whose id is already registered is a replacement attempt and the pack is refused. The gate protects the REAL game: `CORE_GAME_PACK` registers as pack zero carrying the actual shipped ids — all ten authored biomes (resolution-tested against the biome defs), the Hollow Sentinel (against `SANDBOX_BOSSES`), and AF-068's campaign chapters — and the test that tries to ship "Singularity Zone Remastered" over the real `singularity-zone` id is rejected with the exact reason. Packs have no removal field; removal is unrepresentable.
- **"Never create power creep / gameplay power remains horizontal" is unrepresentable, the AF-069 discipline continued:** a `ContentAdditionDef` is a kind + an id (+ a challenge-only temporary flag), asserted by inspecting its own keys — no stat field exists anywhere in the pack shape, and the eight seasonal-reward kinds are all cosmetic or lore.
- **"Regression testing becomes mandatory" is a gauntlet:** six QA gates (performance, balance, saveCompatibility, accessibility, loreConsistency, existingProgression), and a pack failing ANY single one is rejected — all six failure modes tested individually, each naming its gate in the rejection reason.
- **"Avoid FOMO-exclusive gameplay / core progression never resets" is the temporary-flag rule:** only `temporaryChallenges` additions may be temporary — a limited-time BIOME is rejected by name ("temporary gameplay content is FOMO"). Ending a season retires exactly its temporary challenges; permanent discoveries, cosmetics, lore, and the entire core game stay live (each asserted), retired challenges remain in the registry as history (the §Accessibility Season Archive), and the class exposes no remove/delete/revoke/reset/wipe operation (prototype-asserted, the AF-068/069 pattern).
- **"Year 1 → Year 10 without architectural redesign" is the sweep, run literally:** a simulated DECADE — 40 quarterly seasons plus 10 annual expansions through the same unmodified class — where content count grows monotonically every year, a year-one save remains compatible at year ten (`compatibilityFor` asserted every year), all 40 seasonal challenges retire while nothing else is ever removed, the core game's ids are still live after ten years, and `returningPlayerRecap` reconstructs the full decade for a player who left at year one ("players should never feel lost returning after months away").
- **Ten shelves registered** (content tiers, seasonal kinds, expansion kinds, evolution sources, live events, community objectives — a Constitution-compliant FUTURE slot, online remains optional — reward kinds, the five FORBIDDEN practices registered by name so tooling can assert against them, monetisation kinds, QA gates) — naming layers every future season/expansion/DLC binds against.
- **Self-review executed:** 9 new tests — all ten shelves, the cosmetic-only reward assertion + no-stat-field addition-shape assertion, core-pack resolution against real game content, the replacement-rejection with state-equality, the six-gate QA battery, the FOMO rejection, the season lifecycle (retire-only-challenges + archive + no-reset prototype assertion), compatibility + recap + timeline, and the **ten-year decade sweep**. **Live in the browser:** launched, and live ops ran beside the campaign and endgame on the overlay — `liveops v2 · packs 2 (19 additions) · season S1 "Embers of the Frontier" · retired 0 · compat ok` — zero page errors.

**Review verdict:** ALIGNED (zero engine changes; one pure registry in the AF-056/057/068/069 orchestration class; the core game registered as pack zero; one debug overlay line; ten shelves for a decade of content). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/LIVE_OPERATIONS_FRAMEWORK.md`, `src/game/liveops/`.
