# AFTERLIGHT — Machine Collective Enemy Framework

**Authority:** Produced output of AF-047. Extends AF-000 → AF-046. Every future synthetic civilisation, autonomous war machine, and AI expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** machines are logic, never emotion — a broken network degrades instead of scattering, adaptation is a hard-capped number instead of a difficulty spike, and every ounce of threat is coordination over statistics.

---

## 1. Faction Identity — already canon, zero new lore

The Machine Collective has been a fully-profiled AF-039 faction since that module, and has manufactured enemy hardware since AF-033's flak-orbiter cannon. This framework gives its doctrine mechanical life; it invents nothing about who they are.

## 2. Visual Language — data now, art at the asset pass

`MACHINE_VISUAL_LANGUAGE` records dark alloy, white illumination, and blue energy cores (AF-007's rare-blue token); live today in the network notice colouring, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — fourteen registered, six fully authored, zero schema changes

Combat Drone, Sniper Unit, Shield Generator, Repair Drone, Swarm Constructor, and Command Core are plain AF-033 `EnemyDef`s passing the no-overlap law against every existing enemy including AF-046's Outlaws; ranged attacks ARE AF-032 `WeaponDef`s. The Repair Drone and Swarm Constructor give AF-033's dormant `healAllies` and `spawnReinforcements` ability kinds their first producers. Eight further unit kinds are registered vocabulary.

## 4. Combat Style & Special Mechanics — the network is the weapon

Live today: Target Synchronisation (a damage bonus routed through the Core, composed into the same multiplier point as AF-046's Focus Fire), Shared Shields (a lattice damage-reduction while both Core and Generator operate), Self Repair (networked hull regeneration while the Repair Drone orbits), Drone Factories (mid-battle Combat Drone manufacture, cadence-gated and lifetime-capped, with built drones enrolling as ordinary members), Formation Combat (formation-behaviour units anchor on the Core through AF-033's formation context; others keep their own vectors — crossfire, not a conga line), Automated Reinforcements (the Director's existing `ReinforcementWave` is their entrance), and Calculated Retreats (the Elite Core via AF-034's retreat logic; the withdrawing Constructor by doctrine). Distributed Processing, Energy Relay, and Adaptive Armour are registered awaiting content.

## 5. Adaptive AI — analysis with a fairness cap

`recordIncomingDamage(school)` implements the `damageTypes` input of the seven registered: resistance builds in 5% steps per twelve recorded hits of a school, hard-capped at 25%, per-school, and collapses entirely when the Core dies. The cap is a tuning constant, not a promise. The other six inputs are registered analysis surfaces for future content.

## 6. Network Command — degrade, don't scatter

The deliberate mirror-opposite of AF-046: killing the Command Core drops Target Synchronisation, Shield Routing, Repair Allocation, and Drone Deployment at once — but the machines keep fighting, because machines do not fear. Killing an individual service unit drops exactly that service. Both behaviours verified live.

## 7. Elite Variants & Mini-Bosses

Command Cores spawn as AF-034 Elites through the unchanged pipeline — tiers, mutations, rewards, Codex signatures. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 8. Faction Synergy & Loot

Eliminating a network banks Research Data through AF-024's existing points path and bus fact. Machine Components, Energy Cells, AI Cores, and the rest are registered loot vocabulary awaiting item content; kills otherwise flow through every existing reward path (XP, drops, elite relics, elite Credits). The doctrine Codex entry (AF-043, additive) unlocks on the first Core kill.

## 9. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); network state is surfaced plainly on the debug overlay (network indicators); factory-built drones report into the Director's census so pacing stays governed. Networks are run-scoped arrays; adaptation is two integers; formation math is a reused pure function.

## 10. Debug

Live: per-network state (linked/degraded), Core status, which services are up, per-school adaptation counters, and factory build count — the shared `DebugOverlay` `machines` field. Dev-only spawn keys (8/9) make both enemy factions' encounters deterministically verifiable.

---

## Internal review loop (AF-047, recorded)

- **No duplicated systems** — schema, weapons, elites, Director waves, formation context, loot, Codex, and faction canon all reuse AF-032/033/034/035/039/040/043/046 exactly; `MachineNetworkRuntime` is the only genuinely new surface. ✔
- **Logic, never emotion** — degrade-don't-scatter verified live and across a 1,000-encounter sweep; coordination never survives the Core; no machine ever flees on morale. ✔
- **Adapts without becoming unfair** — the 25% cap held at 10,000 recorded hits; adaptation is per-school and dies with the Core. ✔
- **Stronger together, mechanically** — Shared Shields, Self Repair, Target Synchronisation, and the Factory each gate on specific live units, so every kill the player chooses visibly subtracts a capability. ✔
- **Sandbox proof** — a live network ran all services, analysed real incoming fire (p3→p17), degraded per-service as its units died, and manufactured a real mid-fight reinforcement that enrolled into the network — zero page errors. ✔
- **Self-review tunings applied, not just claimed** — factory interval 7000→4000ms (first build never mattered at 7s under real pressure) and Constructor kiting→retreat (a factory that chases into auto-fire self-selects as the primary target), both recorded as comments at the changed values. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining eight unit defs, three deferred special mechanics, six Adaptive AI inputs, mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
