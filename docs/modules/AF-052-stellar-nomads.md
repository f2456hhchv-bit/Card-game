# AF-052 — STELLAR NOMAD ENEMY FRAMEWORK

**Module status:** Complete (framework specified; fleet-economy engine implemented and tested; a live Nomad fleet governs the Director's AmbientPatrol wave end-to-end)
**Lock status:** LOCKED — extends AF-000 → AF-051 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/STELLAR_NOMAD_FRAMEWORK.md` + implementation (`src/game/enemies/nomadData.ts`, `NomadFleet.ts`)

---

*(Module catalogued verbatim below.)*

52

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-051 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Stellar Nomad Enemy Framework.

The Stellar Nomads are neither heroes nor villains.

They are independent fleets surviving beyond the collapse of civilisation.

Some are explorers.

Some are scavengers.

Some are mercenaries.

Some are hunters.

Every encounter should feel like fighting experienced survivors who improvise, adapt and exploit every opportunity.

==================================================
CORE PHILOSOPHY
==================================================

Survival.

Freedom.

Improvisation.

Adaptability.

Resourcefulness.

Every Nomad fights to survive another day.

==================================================
FACTION IDENTITY
==================================================

Theme:

Independent fleets.

Generational starships.

Salvage technology.

Civilian conversions.

Improvised engineering.

Frontier survival.

Living convoys.

Every fleet has its own culture.

==================================================
VISUAL LANGUAGE
==================================================

Mixed hull plating.

Repaired armour.

Civilian modifications.

Industrial welding.

Colourful markings.

Visible cargo.

External equipment.

Improvised engines.

Every vessel should appear unique yet recognisable.

==================================================
CORE UNITS
==================================================

Support:

Scout Skiff

Salvager

Hunter

Escort Fighter

Junker Gunship

Drone Wrangler

Engineer

Shield Tender

Cargo Hauler

Missile Barge

Harpoon Vessel

Repair Frigate

Veteran Captain

Nomad Flagship

Future units extend naturally.

==================================================
COMBAT STYLE
==================================================

Nomads favour:

Mobility

Ambush

Hit-and-Run

Harpoon Weapons

Trap Deployment

Drone Assistance

Retreat

Repair

Improvised Coordination

Combat should feel opportunistic.

==================================================
SPECIAL MECHANICS
==================================================

Support:

Salvage Recovery

Deployable Turrets

Repair Fields

Magnetic Harpoons

Scrap Shields

Cargo Drops

Drone Repair

Emergency Escape

EMP Nets

Improvised Minefields

Nomads use whatever is available.

==================================================
FLEET COORDINATION
==================================================

Nomad fleets coordinate:

Target Priority

Resource Recovery

Emergency Repairs

Escort Protection

Retreat Routes

Salvage Collection

Destroying command ships disrupts fleet cohesion.

==================================================
ELITE VARIANTS
==================================================

Elite Nomads gain:

Prototype Salvage

Experimental Weapons

Unique Paint

Legendary Callsigns

Rare Equipment

Personal Combat Style

Exceptional Rewards

Every Elite represents a legendary survivor.

==================================================
MINI-BOSS SUPPORT
==================================================

Support:

Fleet Commander

Scrap Titan

Prototype Carrier

Mercenary Warlord

Nomad Dreadnought

Ancient Salvager

Future encounters extend naturally.

==================================================
FACTION SYNERGY
==================================================

Nomads interact with:

Derelict Fleets

Trade Routes

Asteroid Belts

Mining Colonies

Abandoned Stations

Faction Wars

Galaxy Events

Battlefields evolve around salvage opportunities.

==================================================
LOOT
==================================================

Possible rewards:

Ship Components

Rare Scrap

Prototype Parts

Credits

Blueprints

Repair Technology

Commander Logs

Nomad Equipment

==================================================
CODEX
==================================================

Record:

Fleet Clans

Ship Classes

Engineering Methods

Culture

Trade Routes

Famous Captains

History

Discovery Statistics

==================================================
ACCESSIBILITY
==================================================

Support:

Distinct silhouettes

Harpoon indicators

Repair field visuals

Unique audio

High Contrast

Colour-blind support

==================================================
PERFORMANCE
==================================================

Pool drones.

Optimise fleet AI.

Reuse repair effects.

Pool salvage objects.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Fleet Status

Repair State

Escort Behaviour

Salvage Priority

Command Vessel

Threat Rating

Performance

==================================================
OUTPUT
==================================================

Produce the complete Stellar Nomad Enemy Framework.

Every future independent fleet, mercenary organisation and frontier civilisation extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Simulate thousands of Stellar Nomad encounters.

Review fleet coordination.

Review salvage mechanics.

Review repair behaviour.

Review mobility.

Review Elite encounters.

Review rewards.

Review Codex progression.

Review readability.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-051.

Adjust fleet AI.

Adjust repair systems.

Adjust encounter pacing.

Remove repetitive behaviours.

Ensure the Stellar Nomads feel like experienced frontier survivors whose ingenuity, mobility and resourcefulness create dynamic and memorable encounters while remaining fair, readable and rewarding.

Repeat until the Stellar Nomad Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-052.

---

## Foundation / AF-000–051 / GP-FINAL alignment review (recorded at catalogue time)

- **Every Nomad unit is a plain AF-033 `EnemyDef` — zero schema changes, zero eighth enemy engine.** Six of the fourteen registered Core Unit kinds carry full sandbox defs (Scout Skiff, Hunter, Escort Fighter, Junker Gunship, Repair Frigate, Elite Nomad Flagship). Unlike AF-049/050/051's single-virgin-family trick, this module reuses several already-used families (`scout`, `fighter`, `heavyAssault`, `supportUnit`) exactly the way AF-046 first did — every fingerprint checked individually against the base roster and all six prior factions, plus the two genuinely virgin families `interceptor` and `destroyer` picked up along the way. Ranged attacks ARE real AF-032 `WeaponDef`s manufactured by "Stellar Nomads".
- **This is the seventh AF-039 `FactionId` to be profiled, paying off exactly the same content debt AF-046 paid off for the Mercenary Guild and AF-050 for the Ancient Custodians.** `nomadFleet` was a registered-but-unprofiled `FactionId` since AF-039; this module adds its full `FactionDef` (territory `darkNebula`, unique resource `commonMaterials`) to `SANDBOX_FACTION_ROSTER.factions`. A pre-emptive check against `codexData.ts` found no pre-existing "nomad" id, unlike AF-050's Ancient Custodians collision — the new `codex-nomad-fleet` entry needed no rename.
- **The Scrap economy is the deliberate seventh doctrine — the first that is actively spent, not passively shared.** Every prior faction computes a bonus continuously from one state (AF-046's scatter timer, AF-047's per-service flags, AF-048's living count, AF-049's decaying level, AF-050's escalating-and-capped stage, AF-051's monotonic ratchet). `NomadFleetRuntime.scrap` is earned passively (`update(dtMs)`, "Salvage Recovery") and then explicitly SPENT: `tryDeployTurret()`, `tryRaiseScrapShield()`, and `tryEmergencyRepair()` each check both affordability (`scrap >= cost`) and an independent cooldown before firing — the first faction whose tactical actions can be *unavailable due to poverty*, not just cooldown, a genuinely new gating shape.
- **Destroying the Command Ship throttles a rate, not a value — a shape none of the prior six doctrines used.** AF-046's captain death flips a behaviour state; AF-047's core death flips discrete flags; AF-048 has no leader-death effect at all (continuous recompute already covers it); AF-049's beacon death steps a value down; AF-050's node death shrinks and clamps a ceiling; AF-051's node death severs a link. The Nomad Flagship's death (`notifyDroneDestroyed` → `"commandShip"`) does none of these — it leaves `scrap` exactly where it was and only reduces `NOMAD_FLEET_TUNING.scrapPerSecond`'s effective rate going forward (`disruptedIncomeFactor`), matching "disrupts fleet cohesion" more precisely than "destroys" would have.
- **Escort Protection is deliberately NOT derived from Scrap at all** — `escortDamageReduction` scales purely with the count of living Escort Fighters (a `Set`, exactly like every prior faction's node-tracking sets, but counted for a defensive trait rather than gating a link). This gives the Nomads two fully independent live inputs (Scrap level for Target Priority, escort headcount for Escort Protection) where every prior faction derived all its live traits from one single number.
- **The Director gained one new wave-type claim, `AmbientPatrol`** — a convoy passing through fits a low-intensity, opportunistic encounter better than a combat-focused wave; `EnemyDirector.ts`/`directorTuning.ts` remain otherwise byte-for-byte unmodified, and `SwarmWave` remains the only fully unclaimed wave type left for future factions.
- **AF-021's dormant `stasis` status and AF-032's dormant `returning` projectile behaviour both gain their first producers**, via the Hunter's Harpoon Cannon — a literal magnetic harpoon that flies out, roots its target briefly, and returns, exactly matching "Magnetic Harpoons" and "Harpoon Weapons".
- **Self-review executed:** 18 new tests — vocabulary registration, AF-033-vocabulary conformance, the seven-faction no-overlap law, readable-telegraph floors, the `stasis`/`returning` first-producer assertions, the Elite pipeline for the Flagship, the full fleet-economy lifecycle (passive income, the fairness cap at 10,000 ticks, the Command-Ship-kill income-throttle without touching banked Scrap, escort-vs-member kill distinction, the two independent live traits, the cost-AND-cooldown gate on all three tactical actions), the `FactionDef` profile's presence, the Codex entry's zero-Missing-Links check, and a 1,000-encounter randomised kill-order sweep in which Scrap never exceeds its cap and every fleet reaches elimination. Live in the browser: a fleet spawned via the dev key, Scrap climbed from 1 to 8 at the tuned rate under real combat, and an Escort Fighter's death was tracked distinctly (`escorts 1→0`) from ordinary crew losses — zero page errors.

**Review verdict:** ALIGNED (zero enemy-schema changes, one new wave-type claim consistent with three prior factions' precedent, zero new loot/elite systems, and one genuine faction-profile debt paid off exactly as AF-046/050 modelled). `NomadFleetRuntime` is the only genuinely new mechanical surface, and an actively-spent, cost-and-cooldown-gated economy with two independent live inputs is meaningfully distinct from every prior doctrine's single-state passive multiplier. Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/STELLAR_NOMAD_FRAMEWORK.md`, `src/game/enemies/nomadData.ts` + `NomadFleet.ts`.
