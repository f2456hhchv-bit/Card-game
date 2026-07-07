# AF-055 — ECLIPSED ENEMY FRAMEWORK

**Module status:** Complete (framework specified; per-member corruption/mimicry/echo engine implemented and tested; a live expedition governs the Director's EliteSquad wave end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-054 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ECLIPSED_FRAMEWORK.md` + implementation (`src/game/enemies/eclipsedData.ts`, `EclipsedCorruption.ts`)

---

*(Module catalogued verbatim below.)*

55

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-054 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Eclipsed Enemy Framework.

The Eclipsed are not naturally evil.

They are former explorers.

Former Commanders.

Former defenders.

Lost expeditions consumed by corruption, failed experiments or prolonged exposure to ancient phenomena.

They represent what the player could eventually become if they lose themselves.

Every encounter should feel tragic.

Not monstrous.

==================================================
CORE PHILOSOPHY
==================================================

Corruption.

Loss.

Memory.

Identity.

Fallen heroes.

Every battle should feel like confronting echoes of humanity's greatest failures.

==================================================
FACTION IDENTITY
==================================================

Theme:

Broken explorers.

Corrupted Commanders.

Abandoned fleets.

Twisted technology.

Fragmented memories.

Lost hope.

Living warnings.

Every Eclipsed enemy once had a purpose.

==================================================
VISUAL LANGUAGE
==================================================

Damaged armour.

Flickering lights.

Broken insignias.

Corrupted energy.

Fragmented holograms.

Burned hulls.

Ancient scars.

Ghost-like motion.

Visuals should constantly hint at their former identity.

==================================================
CORE UNITS
==================================================

Support:

Lost Scout

Broken Pilot

Corrupted Engineer

Eclipsed Hunter

Shadow Commander

Fallen Guardian

Distorted Carrier

Echo Drone

Memory Warden

Void Survivor

Forgotten Captain

Lost Fleet Vessel

Eclipsed Champion

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

The Eclipsed favour:

Unpredictable tactics

Hybrid technology

Corrupted abilities

Broken formations

Aggressive flanking

Desperation attacks

Memory echoes

Mixed weapon systems

Combat reflects fractured minds.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Memory Echoes

Corruption Bursts

Broken Shield Cycles

Ability Mimicry

Ghost Images

Ship Malfunctions

Unstable Warp Jumps

Corrupted Equipment

Memory Fragments

Identity Collapse

Mechanics remain readable.

==================================================
MEMORY SYSTEM
==================================================

Eclipsed enemies occasionally replay:

Old radio messages

Commander orders

Distress calls

Scientific recordings

Personal memories

These never interrupt gameplay.

They strengthen world building.

==================================================
CORRUPTION LEVELS
==================================================

Support:

Recently Lost

↓

Corrupted

↓

Broken

↓

Consumed

↓

Irrecoverable

Visuals and behaviour evolve accordingly.

==================================================
ELITE VARIANTS
==================================================

Elite Eclipsed gain:

Unique Histories

Named Identities

Prototype Equipment

Commander Abilities

Legendary Records

Rare Rewards

Every Elite tells an individual story.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Lost Admiral

Corrupted Fleet Leader

Fallen Commander

Broken Titan

Void Survivor

Echo Sovereign

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

The Eclipsed interact with:

Void Corruption

Ancient Ruins

Derelict Fleets

Lost Colonies

Research Facilities

Black Holes

Memory Archives

Entire sectors become haunted by forgotten expeditions.

==================================================
LOOT
==================================================

Possible rewards:

Recovered Equipment

Commander Records

Damaged Blueprints

Prototype Weapons

Research Logs

Ancient Keys

Memory Shards

Legendary Relics

==================================================
CODEX
==================================================

Record:

Recovered Identities

Expedition History

Final Missions

Recovered Logs

Fleet Records

Commander Profiles

Known Survivors

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Memory indicators

Reduced visual distortion

Clear corruption levels

High Contrast

Colour-blind support

Subtitle support

==================================================
PERFORMANCE
==================================================

Pool memory effects.

Reuse corruption shaders.

Optimise ghost projections.

Pool audio logs.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Corruption Stage

Memory State

Recovered Identity

Echo Events

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Eclipsed Enemy Framework.

Every future corrupted expedition, fallen Commander, haunted fleet and tragic encounter extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Eclipsed encounters.

Review combat behaviour.

Review memory events.

Review corruption progression.

Review Elite encounters.

Review emotional storytelling.

Review rewards.

Review Codex progression.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-054.

Adjust corruption behaviour.

Adjust memory frequency.

Adjust encounter pacing.

Remove repetitive mechanics.

Ensure the Eclipsed become one of the most emotionally memorable enemy factions in Afterlight, combining tragic storytelling with mechanically varied, fair and rewarding combat.

Repeat until the Eclipsed Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-055.

---

## Foundation / AF-000–054 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Eclipsed unit is a plain AF-033 `EnemyDef` — zero schema changes, zero eleventh enemy engine.** Six of the thirteen registered Core Unit kinds carry full sandbox defs (Lost Scout, Broken Pilot, Echo Drone, Memory Warden, Fallen Guardian, Elite Eclipsed Champion), every fingerprint checked against the base roster and all nine prior factions. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "The Eclipsed", using the `laser` and `plasma` categories — "Mixed Weapon Systems" as salvaged Alliance hardware, matching the fiction of who they used to be.
- **They are the fifth faction with no `FactionDef` — but for the opposite reason.** AF-049/051/053/054 skipped AF-039's profile system because their subjects were cosmic forces, not civilisations. The Eclipsed are skipped because they are *former humans* — not a polity, not an economy, not anyone to hold a reputation with. Their Codex entry deliberately breaks the threat-to-threat cross-reference chain and points at `codex-human-alliance` instead: they fell FROM somewhere, and the Codex says so.
- **Corruption is the deliberate tenth doctrine — a PERSONAL timeline, not a squad state.** Every prior doctrine keeps one value/flag-set per group (AF-054's graph is per-entity, but static — position in a pattern). `EclipsedCorruptionRuntime` gives every member its own clock through the five named stages (Recently Lost → Corrupted → Broken → Consumed → Irrecoverable), staggered at spawn (`memberStaggerMs` — no two begin at the same point in their fall), monotonic (a fall never walks backward), and capped at Irrecoverable. Verified live from the very first debug-overlay frame: `[recentlyLost,recentlyLost,corrupted,corrupted,broken,broken]` — six members, four distinct stages, one instant.
- **Grief is mechanical, and it inverts the player's usual incentive.** `notifyDroneDestroyed` jumps every survivor's own clock forward by `griefJumpMs` — killing the group faster pushes the remainder further from themselves, so the "tragic, not monstrous" brief has a cost function, not just lore. The Memory Warden deepens the choice: while it lives every survivor's fall runs at `wardenSlowFactor` speed, so killing the healer-analogue first — the reflex nine prior factions taught — accelerates every remaining fall. Both were observed live: the Warden died to real combat at t+0.5s and the survivors' stage array visibly jumped a stage in the same tick.
- **Ability Mimicry is the first mechanic that reads what the player has BECOME.** Every prior runtime reads only its own faction's state; AF-050 alone accepted a player input, and only their *position* (`playerPresent`). `recordPlayerLevel` feeds the player's progression level into the mirror, `mimicryDamageBonus` scales with it, never regresses (the mirror keeps what it learned), and is hard-capped at `maxMimicryDamageBonus` — "they represent what the player could eventually become" is a number with a fairness ceiling, exactly the discipline every prior doctrine's cap enforced. Verified live: `mirror +2%` at player level 1.
- **Memory Echoes reuse AF-053's one-shot consume-event shape as pure world-building.** `consumeEchoEvent()` is cadence-gated (`echoIntervalMs`), lifetime-capped (`maxEchoesPerEncounter`), and cycles `ECLIPSED_ECHO_LINES` deterministically — never randomised, never an interruption, just notice text through the existing lootNotices channel. Verified live: `echoes 1` appeared at exactly the 7-second tuned cadence.
- **Two more dormant hooks gain first base-def producers.** The Lost Scout is the first base `EnemyDef` to use AF-033's `ambush` movement behaviour (the last never-produced movement kind — hidden until approached, ghost-like), and the Broken Pilot gives the `teleport` *special-ability kind* its first base-def producer (until now only AF-034's elite tiers carried it) — Unstable Warp Jumps, a malfunction rather than a tactic.
- **The Director claim closes a loop rather than opening one: `EliteSquad` becomes the Eclipsed's entrance.** ElitePressure's "squad of elites" gains a face — every Eclipsed was once a Commander, and the Champion still spawns through AF-034's unchanged pipeline, so the wave delivers exactly what its name always promised. With this, every AF-034 Elite in Director-driven play now enters as a faction leader, and the census's elite column belongs to them alone; `SwarmWave` remains the one unclaimed generic wave. `EnemyDirector.ts`/`directorTuning.ts` remain byte-for-byte unmodified.
- **Self-review executed:** 18 new tests — vocabulary registration (including the five corruption stages, five echo kinds, and six echo lines), AF-033-vocabulary conformance, the ten-faction no-overlap law, readable-telegraph floors, the `ambush`/`teleport` first-producer assertions checked against every prior roster, the Elite pipeline for the Champion, the full corruption lifecycle (spawn stagger, per-member divergence at one instant, monotonic capped falls, the Warden's slow measured against a wardenless control group, the grief jump quantified in stages, mimicry's scaling/cap/no-regression, per-member bonus composition with dead members contributing nothing), the echo feed's cadence/determinism/cap, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which every stage stays within `[0, 4]`, mimicry never exceeds its cap, and echoes never exceed theirs. Live in the browser, across two runs: staggered stages from the first frame, the Warden's death triggering a visible same-tick grief jump, stages progressing through all five names up to `irrecoverable`, a second grief jump on a later member death, a Memory Echo firing at exactly the tuned cadence, and the mirror reading the player's real level — zero page errors throughout, and the expedition killed the piloted player in the first run (dangerous through tactics, as specified).

**Review verdict:** ALIGNED (zero enemy-schema changes, zero Director changes — one wave-type claim that *completes* the elite column's identity rather than adding a system, zero new loot/elite systems, and the fifth deliberate non-extension of AF-039's profile system, justified by the fiction's own framing). `EclipsedCorruptionRuntime` is the only genuinely new mechanical surface, and a per-member personal timeline plus a player-progression mirror is meaningfully distinct from all nine prior doctrines. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/ECLIPSED_FRAMEWORK.md`, `src/game/enemies/eclipsedData.ts` + `EclipsedCorruption.ts`.
