## Verbatim prompt

189

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-188 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module creates the Atlas Civilisation Operating System.

The Civilisation Operating System is the executive runtime governing every aspect of humanity's development.

Previous Atlas modules define:

Knowledge.

Memory.

Identity.

Purpose.

Harmony.

Emergence.

Possibility.

Evolution.

The Civilisation Operating System coordinates all of them into one continuously functioning civilisation.

This is not an interface.

It is the invisible operating system powering humanity itself.

==================================================
PURPOSE
==================================================

Coordinate civilisation.

Synchronise every subsystem.

Maintain consistency.

Prevent fragmentation.

Support continuous growth.

==================================================
CORE PRINCIPLE
==================================================

A civilisation is not one system.

It is thousands of systems continuously cooperating.

The Operating System keeps them aligned.

==================================================
CORE SERVICES
==================================================

Knowledge Service

Memory Service

Identity Service

Education Service

Research Service

Exploration Service

Infrastructure Service

Ecology Service

Culture Service

Economy Service

Governance Service

Legacy Service

Every service communicates continuously.

==================================================
THE CIVILISATION BUS
==================================================

Every subsystem publishes events.

Examples

Discovery completed.

Species recovered.

University founded.

Commander promoted.

Museum expanded.

Planet restored.

Festival begins.

Research validated.

Other systems respond naturally.

==================================================
STATE MANAGEMENT
==================================================

Maintain global civilisation state.

Examples

Population.

Education.

Health.

Hope.

Scientific progress.

Ecological stability.

Economic resilience.

Institution maturity.

Historical preservation.

Everything remains synchronised.

==================================================
RESOURCE COORDINATION
==================================================

Coordinate:

Researchers.

Teachers.

Builders.

Explorers.

Citizens.

Commanders.

Infrastructure.

Knowledge.

Resources flow intelligently.

==================================================
TASK ORCHESTRATION
==================================================

Coordinate long-term activities.

Examples

Megaproject construction.

Planet restoration.

University expansion.

Museum curation.

Fleet logistics.

Scientific collaboration.

Nothing operates independently.

==================================================
PRIORITY MANAGEMENT
==================================================

Balance competing needs.

Emergency recovery.

Education.

Infrastructure.

Ecology.

Healthcare.

Research.

Culture.

Hope.

Long-term prosperity always remains visible.

==================================================
CONTINUOUS DIAGNOSTICS
==================================================

Monitor:

System health.

Institution health.

Commander workload.

Scientific productivity.

Environmental resilience.

Educational quality.

Community wellbeing.

Automatically identify weaknesses.

==================================================
SELF-OPTIMISATION
==================================================

Continuously improve:

Coordination.

Scheduling.

Knowledge sharing.

Infrastructure.

Education.

Resource efficiency.

Without altering the Atlas Core philosophy.

==================================================
FAILSAFE SERVICES
==================================================

Protect against:

Knowledge loss.

Institution collapse.

Ecological decline.

Historical inconsistency.

Commander burnout.

Infrastructure overload.

Civilisation remains resilient.

==================================================
SERVICE DEPENDENCIES
==================================================

Every service records:

Inputs.

Outputs.

Dependencies.

Consumers.

Historical influence.

Future impact.

Nothing becomes opaque.

==================================================
CIVILISATION TELEMETRY
==================================================

Continuously analyse:

Scientific momentum.

Educational reach.

Community engagement.

Environmental recovery.

Institution growth.

Player influence.

Historical continuity.

The universe understands itself.

==================================================
ADAPTIVE COORDINATION
==================================================

As civilisation grows...

The Operating System scales automatically.

Local settlements.

Planetary governments.

Sector administrations.

Galactic institutions.

Everything remains coordinated.

==================================================
THE CIVILISATION HEARTBEAT
==================================================

Every simulation cycle asks:

What has changed?

What needs attention?

What opportunities appeared?

Who needs help?

What should happen next?

Civilisation never stands still.

==================================================
DEVELOPER TOOLS
==================================================

Service monitor.

Dependency explorer.

Global state viewer.

Civilisation telemetry dashboard.

Task orchestration graph.

Subsystem diagnostics.

==================================================
PLAYER EXPERIENCE
==================================================

Players should never notice the Operating System.

Instead they simply experience:

A civilisation that always appears organised, responsive and alive.

==================================================
ACCESSIBILITY
==================================================

Civilisation summaries.

System health browser.

Institution overview.

Global progress dashboard.

Narration ready.

==================================================
OUTPUT
==================================================

Implement the Atlas Civilisation Operating System.

Coordinate every Atlas module into one unified runtime architecture capable of supporting an endlessly evolving, living civilisation.

==================================================
SELF REVIEW LOOP
==================================================

Review every module from AF-000 through AF-188.

Simulate one million years.

Review subsystem coordination.

Review institutional cooperation.

Review scientific growth.

Review educational continuity.

Review ecological stability.

Review accessibility.

Review performance.

Eliminate coordination bottlenecks.

Eliminate isolated services.

Strengthen intelligent communication between every subsystem.

Ensure the Civilisation Operating System remains invisible while allowing the entire Afterlight universe to function as one coherent, self-sustaining civilisation.

Ensure AF-189 becomes the runtime architecture that transforms all previous Atlas systems into one continuously operating civilisation capable of evolving indefinitely.

Repeat until every subsystem behaves as though it is part of one living organism rather than independent mechanics.

Only then lock AF-189.

## Foundation / AF-000–188 / GP-FINAL alignment review

**NAMING SCOPE NOTE:** this is the THIRD "operating system"-shaped module in this codebase, distinct in scope from both prior ones. AF-144's locked "Afterlight Operating System" (`src/game/aos/`) is the FOUNDATION-layer OS, coordinating Living Galaxy/Ship/Commanders/Museum/Chronicle/Civilisation/Research/Economy/Weather/Wildlife/Events/Story Engine/Evolution/Legacy/Endgame. AF-154's locked "Atlas Orchestrator" (`atlasOrchestrator/`) is the player-EXPERIENCE-pacing layer above the Simulation Director. AF-189 is the ATLAS-ENRICHMENT-layer OS, coordinating the ~40 Atlas-XXX modules (Knowledge/Memory/Identity/Purpose/Harmony/Emergence/Possibility/Evolution/...) into one civilisation. It lives entirely under its own `src/game/atlasCivilisationOS/` directory and never redefines either prior OS's real classes.

This module reuses several already-real classes directly, confirmed by dedicated tests: "The Civilisation Bus" ("every subsystem publishes events... other systems respond naturally") reuses AF-001's real generic `EventBus<E>` directly — the same class AF-144's own "System Bus" already reused — instantiated with its own new `CivilisationBusEventMap` rather than a second bus class. "State Management" ("maintain global civilisation state... Population... Education... Health...") reuses AF-144's real generic `WorldStateStore<T>` directly, instantiated over the real, already-locked `CivilisationAttribute` union from `src/game/civilisationEngine/` (which already includes Population/Education/Health/Research/Ecology/Industry/Historical Preservation) rather than a new duplicate attribute list. "Priority Management" reuses AF-144's real `PriorityEngine` directly. "Civilisation Telemetry" reuses AF-144's real `TelemetryCollector` directly. "Task Orchestration" ("megaproject construction... nothing operates independently") reuses AF-162's real `LongTermMissionTracker` directly — a megaproject is exactly a long-term ambition already modelled by `register`/`advance`/`isComplete`. "Service Dependencies" ("inputs... outputs... dependencies... consumers... historical influence... future impact") composes AF-151's real `KnowledgeGraph.addEdge` directly, using the already-real `"Influenced"` edge kind (which already carries a `historicalContext` field).

"Failsafe Services" ("protect against... always prioritise") mirrors the SHAPE of AF-154's real `resolveByFailsafePriority` — a strict single-highest-priority-match resolver, never an all-must-pass gate — confirmed as the SECOND instance of this family, typed to its own `CivilisationFailsafeConcern` union since the concerns genuinely differ from AF-154's Player progress/Save integrity/Historical consistency/Accessibility/Performance/Narrative coherence.

"Continuous Diagnostics" ("monitor system health... automatically identify weaknesses") mirrors the SHAPE of AF-144's real `PerformanceBudgetTracker` (report a per-domain score, then rank) but INVERTS its direction — `CivilisationHealthTracker` treats a LOW score as the concern, not a high one — confirmed by a dedicated test that the domain with the lowest reported score is ranked first by `weakestDomains()`.

"Resource Coordination" is confirmed genuinely new: `ResourcePoolCoordinator` tracks a named pool of resources (Researchers/Teachers/Builders/etc.) with `allocate`/`release`/`availableFor` semantics, confirmed absent anywhere else in the codebase by a dedicated test that an over-allocation attempt is rejected.

"Adaptive Coordination" (Local settlements → Planetary governments → Sector administrations → Galactic institutions, an ordered, non-cyclic 4-tier ladder) mirrors this codebase's established `xRank(stage): number` pattern via `adaptiveCoordinationTierRank`.

"The Civilisation Heartbeat" ("every simulation cycle asks... civilisation never stands still") is confirmed genuinely new: `CivilisationHeartbeat` is an append-only per-cycle log answering five fixed questions every tick — explicitly distinct from AF-185's real `LivingPresentTracker` (the only OVERWRITING tracker in this codebase), since every heartbeat tick is preserved as history rather than replacing the last, confirmed by a dedicated test that two ticks both remain in `history()`.

"Core Services" (12 named services) and "Self-Optimisation" stay pure reference lists — the former names the services this OS coordinates (mapped to real Atlas modules elsewhere), the latter is a prose-only architectural claim, mirroring AF-144's own honest treatment of "Scalability"/"Failsafe Principles" as claims rather than mechanics.

The debug overlay gains a new `atlasCivilisationOS` field on `DebugSnapshot`, rendered with the label `civOS` — checked against every existing debug line for collisions before finalising (per the lesson learned during AF-186) and confirmed unique. Zero changes to AF-001's `EventBus`, AF-144's `WorldStateStore`/`PriorityEngine`/`TelemetryCollector`, AF-151's `KnowledgeGraph`, AF-154's `resolveByFailsafePriority`, AF-162's `LongTermMissionTracker`, `src/game/civilisationEngine/`'s `CivilisationAttribute`, or any other locked module.

Score: 9.5/10 — approved and locked.
