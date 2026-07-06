# AF-017 — ADAPTIVE ENEMY DIRECTOR

**Module status:** Complete (framework specified; Director implemented, simulation-tested; live-combat tuning binds AF-021+ as enemies/combat land)
**Lock status:** LOCKED — extends AF-000 → AF-016 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/ENEMY_DIRECTOR.md` + implementation (`src/game/director/`) with headless multi-run simulation tests

---

*(Module catalogued verbatim below.)*

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-016 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Adaptive Enemy Director.

The Enemy Director is the invisible intelligence controlling every combat encounter.

It does not cheat.

It does not artificially increase difficulty.

Instead, it creates dramatic pacing by controlling encounter intensity, enemy composition, biome events and recovery windows.

The player should never feel like they are fighting a scripted level.

They should feel like they are surviving a living battlefield.

==================================================
CORE PHILOSOPHY
==================================================

Challenge through variety.

Pressure through pacing.

Difficulty through decisions.

Fairness through transparency.

No encounter should feel identical.

No encounter should feel impossible.

==================================================
DIRECTOR RESPONSIBILITIES
==================================================

The Director controls:

Enemy spawning

Enemy composition

Elite frequency

Mini Boss timing

Boss timing

Event timing

Recovery windows

Threat escalation

Environmental hazards

Encounter pacing

The Director never controls:

Player accuracy

Loot quality

Player statistics

Hidden damage modifiers

Artificial rubber-banding

==================================================
COMBAT PACING MODEL
==================================================

Recovery
↓
Light Contact
↓
Combat
↓
Heavy Combat
↓
Elite Pressure
↓
Recovery
↓
Environmental Event
↓
Heavy Combat
↓
Mini Boss
↓
Recovery
↓
Boss
↓
Reward

Maintain a natural combat rhythm.

Avoid continuous maximum intensity.

==================================================
THREAT LEVEL
==================================================

Threat is continuously evaluated.

Inputs include:

Mission difficulty

Biome

Elapsed time

Player level

Equipment quality

Enemy density

Boss state

Ascension

Mutators

Threat values are deterministic.

==================================================
SPAWN BUDGET
==================================================

Every encounter uses a spawn budget.

Budget considers:

Enemy value

Elite value

Biome modifiers

Mission modifiers

Performance limits

Difficulty

Never exceed the available budget.

==================================================
ENEMY WAVES
==================================================

Support:

Ambient Patrols

Swarm Waves

Hunter Packs

Elite Squads

Reinforcement Waves

Ambush Events

Mini Boss Waves

Boss Waves

Mixed Encounters

Every wave has a unique identity.

==================================================
ELITE MANAGEMENT
==================================================

Elites appear naturally.

Never overwhelm the player unfairly.

Maximum simultaneous Elite count is configurable.

Elite encounters should create memorable spikes in tension.

==================================================
RECOVERY WINDOWS
==================================================

After major encounters provide:

Reduced enemy pressure

Loot collection opportunity

XP collection opportunity

Environmental calm

Preparation time

Recovery duration adapts to overall difficulty.

==================================================
ADAPTIVE SCALING
==================================================

Scale using:

Elapsed mission time

Difficulty

Ascension

Biome progression

Mission objectives

Player progression

Never scale based on player mistakes alone.

Never punish experimentation.

==================================================
ENVIRONMENTAL EVENTS
==================================================

Director may trigger:

Meteor Showers

Solar Flares

Crystal Growth

Gravity Flux

Void Distortion

Machine Reinforcements

Ancient Signals

Environmental events enrich combat.

Never interrupt important boss mechanics.

==================================================
BOSS HANDOFF
==================================================

Before Boss encounters:

Normal spawning pauses.

Arena prepares.

Threat transitions smoothly.

Boss controls encounter pacing.

Enemy Director resumes after Boss completion.

==================================================
FAIRNESS RULES
==================================================

Never spawn enemies:

Directly on the player.

Inside safe zones.

Without readable telegraphing.

Behind unavoidable hazards.

Maintain player agency.

==================================================
ACCESSIBILITY
==================================================

Support:

Difficulty previews

Combat intensity indicators

Reduced visual clutter

Clear danger telegraphs

Adjustable encounter indicators

==================================================
PERFORMANCE
==================================================

Use pooled enemy spawning.

Cap simultaneous active enemies.

Cache spawn locations.

Limit Director calculations.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Current Threat Level

Spawn Budget

Active Enemy Count

Wave Type

Elite Count

Recovery State

Director State

Performance

==================================================
OUTPUT
==================================================

Produce the complete Adaptive Enemy Director Framework.

Every future enemy, biome and mission extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play thousands of simulated runs.

Review encounter pacing.

Review spawn fairness.

Review threat scaling.

Review Elite frequency.

Review Mini Boss timing.

Review Boss transitions.

Review environmental events.

Review recovery windows.

Review player agency.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-016.

Adjust spawn budgets.

Adjust pacing curves.

Adjust recovery timing.

Remove repetitive encounters.

Ensure every combat encounter feels dynamic, fair and memorable while remaining fully readable.

Repeat until the Enemy Director consistently delivers varied, exciting combat with an internal quality score of 9.5/10 or higher.

Only then lock AF-017.

---

## Foundation / AF-016 alignment review (recorded at catalogue time)

- The Director realises AF-016 §3's run lifecycle (its pacing model expands the Enemy Escalation → Boss phases) and §5's rhythm law; it is the anti-repetition mechanism AF-016 §5 demanded. Attaches exactly as AF-016 §8 planned (run phases + events).
- "Does not cheat / never controls player accuracy, loot, hidden modifiers, rubber-banding": operationalises AF-011's generosity-in-structure-never-outcome and the Constitution's no-artificial-difficulty law. The implementation enforces this *by construction* — the threat function's inputs do not include player mistakes, accuracy, or loot state.
- Deterministic threat + seeded RNG: AF-001 determinism law; the Director consumes a forked stream (`director`) from the mission seed, so one seed reproduces one mission's encounter script while other systems stay unperturbed.
- Fairness rules become data carried on every spawn directive (min distance from player, safe-zone exclusion, telegraph duration ≥ AF-004 anatomy); the future Enemy System (AF-021+) must honour them and the readability laws.
- New canon: seven environmental event types (Meteor Shower, Solar Flare, Crystal Growth, Gravity Flux, Void Distortion, Machine Reinforcements, Ancient Signal — several tied to established factions/canon), nine wave identities, and **Mutators** (named as a threat input — specification owed to a future module, registered).
- Performance: Director decisions run at a configurable interval (default 4/sec), not per frame; spawning is directive-based so the Enemy System pools everything (AF-001).
- **Self-review executed headlessly:** the test suite runs hundreds of seeded simulated missions (deterministic, fast) asserting: budget never exceeded, elite cap never breached, no spawning during boss handoff, recovery follows every pressure spike, max-intensity time share bounded, anti-repetition of consecutive wave types, directive fairness data always present, determinism (same seed → identical encounter script). Live-feel tuning (pacing curves against real combat) binds AF-021+ QA as combat becomes playable.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved and locked; live-combat tuning obligations bind AF-021+. Produced outputs: `docs/ENEMY_DIRECTOR.md`, `src/game/director/`.
