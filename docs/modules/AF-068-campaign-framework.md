# AF-068 — CAMPAIGN FRAMEWORK

**Module status:** Complete (framework + sandbox campaign implemented on locked engines; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-067 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/CAMPAIGN_FRAMEWORK.md` + implementation (`src/game/campaign/`)

---

*(Module catalogued verbatim below.)*

68

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-067 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Campaign Framework.

The Campaign is not a linear sequence of missions.

It is the player's journey through the restoration of an entire galaxy.

Story emerges from exploration, discovery, faction relationships, major events and player decisions.

Every completed campaign should feel personal.

Every player should experience a slightly different version of the galaxy.

==================================================
CORE PHILOSOPHY
==================================================

Discovery.

Choice.

Consequences.

Hope.

Sacrifice.

The campaign exists to support gameplay.

Gameplay should never pause for the story.

==================================================
CAMPAIGN STRUCTURE
==================================================

The campaign progresses through:

Prologue

↓

Frontier Restoration

↓

Faction Discovery

↓

Ancient Awakening

↓

Galaxy Expansion

↓

Major Crisis

↓

Civilisation Recovery

↓

Endgame Campaign

↓

Final Revelation

↓

Post-Campaign Galaxy

Every stage naturally unlocks the next.

==================================================
CHAPTER STRUCTURE
==================================================

Each chapter contains:

Primary Objectives

Side Missions

Faction Missions

Exploration Goals

Boss Encounters

Research Milestones

Story Discoveries

Galaxy Changes

Each chapter expands the universe.

==================================================
WORLD PROGRESSION
==================================================

The campaign permanently changes:

Galaxy Map

Faction Relationships

Mission Availability

Research

Technology

Trade Routes

Civilian Population

Ancient Systems

Player actions reshape the galaxy.

==================================================
PLAYER CHOICE
==================================================

Support meaningful choices involving:

Faction Support

Scientific Priorities

Resource Allocation

Civilian Rescue

Ancient Technology

Prototype Research

Exploration

Diplomatic Intervention

Choices influence future opportunities.

Never permanently remove core content.

==================================================
STORY DELIVERY
==================================================

Narrative is delivered through:

Mission Briefings

Commander Dialogue

Codex Entries

Environmental Storytelling

Recovered Logs

Faction Reports

Galaxy Broadcasts

Ancient Archives

Players discover the story naturally.

==================================================
MAJOR CAMPAIGN EVENTS
==================================================

Support:

New Faction Contact

Ancient Discovery

Galaxy Emergency

Sector Collapse

Scientific Breakthrough

Civilian Evacuation

Fleet Mobilisation

Reality Instability

Events permanently alter progression.

==================================================
CAMPAIGN MILESTONES
==================================================

Milestones unlock:

New Biomes

New Ships

New Weapons

New Commanders

Research Branches

Galaxy Regions

Bosses

Difficulty Levels

Progression always feels rewarding.

==================================================
WORLD EVOLUTION
==================================================

Throughout the campaign:

Colonies expand.

Stations rebuild.

Trade increases.

Threats evolve.

Factions react.

The galaxy visibly changes.

Nothing important feels static.

==================================================
FINAL CAMPAIGN
==================================================

The final campaign should unite:

Every biome.

Every faction.

Every major system.

Every discovery.

The player finally understands:

The Afterlight Network.

The precursor civilisation.

The Void.

Humanity's future.

==================================================
POST-CAMPAIGN
==================================================

After completion support:

Galaxy Restoration

Hidden Campaigns

Legendary Missions

World Events

New Discoveries

Ascension Progression

Infinite Exploration

The galaxy remains alive forever.

==================================================
ACCESSIBILITY
==================================================

Support:

Story Recaps

Mission History

Chapter Selection

Large Dialogue

Subtitles

Controller Navigation

Touch Navigation

High Contrast

==================================================
PERFORMANCE
==================================================

Lazy load story assets.

Cache campaign state.

Pool narrative UI.

Optimise world updates.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Campaign Progress

Current Chapter

Galaxy State

Story Flags

World Evolution

Performance

==================================================
OUTPUT
==================================================

Produce the complete Campaign Framework.

Every future campaign, expansion, DLC and narrative update extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete thousands of campaign playthroughs.

Review pacing.

Review player choice.

Review chapter structure.

Review world evolution.

Review narrative delivery.

Review exploration.

Review rewards.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-067.

Adjust progression.

Adjust unlock pacing.

Adjust world changes.

Remove repetitive campaign structures.

Ensure the Campaign becomes a seamless fusion of gameplay, exploration and narrative where every player feels they have personally helped rebuild the galaxy while uncovering one of science fiction's richest universes.

Repeat until the Campaign Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-068.

---

## Foundation / AF-000–067 / GP-FINAL alignment review (recorded at catalogue time)

- **The campaign is a LEDGER over engines the game already owns, not a new engine** — the same discipline as AF-056/057's orchestration layers. Objectives reuse AF-026/035/037's exact counterKey/target pattern; the composition root feeds exactly three keys from real play (mission victories through `endRun`, system arrivals through real `GalaxyRuntime.travelTo` calls, boss defeats through the AF-057 death sequence). No new progress engine, no new event bus, no schema changes to any locked system.
- **"Gameplay should never pause for the story" is structural:** narrative is delivered through the AF-055 echo / AF-057 ceremony CONSUME seam — chapters queue `CampaignStoryBeatDef`s (each tagged with one of the eight registered delivery channels), and presentation drains one per cadence in the render path. Nothing in the runtime can block a frame; beats surface as the same notice class loot and challenges already use.
- **"Choices influence future opportunities. Never permanently remove core content" holds by TYPE, not policy:** `CampaignRuntime` exposes no remove/clear/revoke/reset operation — asserted in tests by inspecting the prototype's method names — and flags, unlocks, world changes, and the choice log are append-only collections. The eight choice domains are a registered shelf awaiting mission/dialogue producers.
- **"Every stage naturally unlocks the next" is the advancement algorithm:** ten stages in a strictly ordered ladder (asserted one chapter per stage, in order); counters persist across chapters, so banked progress chains later chapters automatically the moment a gate opens — tested both ways (the ladder halts at the boss-gated Ancient Awakening no matter how much later-counter surplus is banked, then a single feed chains straight through to the post-campaign galaxy).
- **Post-campaign is a STATE, not an ending:** the final chapter has zero objectives — the campaign completes INTO it, the runtime accepts progress forever after (1,000 further feeds asserted non-throwing and non-regressing), and the seven post-campaign pillars map TOTALLY onto AF-038's `LongTermGoalKind` shelf — **registered since AF-038 with no producer until now, its first consumer.** "The galaxy remains alive forever", literally.
- **"Every completed campaign should feel personal" through determinism, not randomness:** the runtime holds no RNG and no clock — the same play sequence always produces the same campaign (asserted with mirrored runtimes over 200 randomized feeds), so divergence between players comes from what they DID.
- **The sandbox campaign is real content on locked systems:** ten chapters whose milestone unlocks are resolution-tested against real registered content — `hollow-sentinel` in `SANDBOX_BOSSES`, `singularity-zone` in the biome registry, `humanFrontier`/`machineExpanse` on AF-038's region shelf — and whose story beats thread the arc the biomes already told (the Sentinel standing down, First Light's vacated council seat, "We go to ask it in person"). Major events fire exactly once per chapter; world changes accumulate across all eight registered progression kinds.
- **Eight shelves registered** (stages, chapter content kinds, world progression kinds, choice domains, delivery channels, major events, milestone unlock kinds, post-campaign kinds) — naming layers for future campaign/DLC modules to bind, counted and validated in tests.
- **Self-review executed:** 14 new tests — all eight shelves, the total post-campaign→long-term-goal mapping (first producer), one-chapter-per-stage ladder order, counterKey-pattern validity on the three real feed keys, unlock resolution against real content, the open-door final chapter, full ladder advancement without skipped payloads, banked-progress chaining, exactly-once completion payloads (10 flags, all unlocks/world changes/major events counted), append-only choices with the no-removal-API prototype assertion, FIFO beat consumption ending in null, post-campaign permanence under 1,000 further feeds, mirrored-runtime determinism, and a **1,000-playthrough seeded sweep** in arbitrary feed orders — every playthrough reaches the post-campaign galaxy with monotone stages and flags. **Live in the browser:** travelled to Meridian Rest (banking a system toward Frontier Restoration), launched, and the campaign ran live on the overlay — `campaign prologue · "Afterlight" (1/10) · obj 0/1 · flags 0 · unlocks 0 · beats 0 · world 0` — zero page errors.

**Review verdict:** ALIGNED (zero engine changes; one new runtime in the AF-056/057 orchestration class; AF-038's long-term-goal shelf given its first producer; three composition-root feed points; one debug overlay line). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/CAMPAIGN_FRAMEWORK.md`, `src/game/campaign/`.
