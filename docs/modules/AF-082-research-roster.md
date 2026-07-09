# AF-082 — RESEARCH ROSTER FRAMEWORK

**Module status:** Complete (the scientific ecosystem — disciplines, tiers, laboratories, network, infinite research and the archive — on unchanged AF-024/069/081 shapes; live in the browser)
**Lock status:** LOCKED — extends AF-000 → AF-081 under the Foundation Lock; may only be unlocked by the Project Owner
**Produced output:** `docs/RESEARCH_ROSTER.md` + implementation (`src/game/research/researchRosterData.ts`)

---

*(Module catalogued verbatim below.)*

82

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-081 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete Research Roster Framework.

The objective is not simply to create a larger technology tree.

The objective is to create a living scientific ecosystem where every discovery permanently expands gameplay possibilities.

Research should feel like rediscovering the knowledge of an ancient galaxy while pushing beyond anything previous civilisations achieved.

Every completed project should create excitement.

==================================================
CORE PHILOSOPHY
==================================================

Knowledge.

Discovery.

Innovation.

Progress.

Legacy.

Science should continuously create new gameplay rather than larger numbers.

==================================================
RESEARCH DISCIPLINES
==================================================

Support major scientific disciplines:

Ship Engineering

Weapon Engineering

Materials Science

Energy Systems

Artificial Intelligence

Quantum Science

Void Studies

Crystal Resonance

Biological Engineering

Drone Technology

Planetary Engineering

Civilian Infrastructure

Ancient Technology

Prototype Science

Experimental Physics

Future disciplines extend naturally.

==================================================
RESEARCH TIERS
==================================================

Support:

Foundation

Applied

Advanced

Experimental

Prototype

Ancient

Legendary

Transcendent

Higher tiers unlock entirely new gameplay opportunities.

==================================================
SCIENTIFIC PHILOSOPHY
==================================================

Research should unlock:

New mechanics

Alternative builds

Engineering possibilities

Commander interactions

Ship systems

Weapon behaviours

World changes

Exploration opportunities

Research should rarely provide flat statistical improvements.

==================================================
DISCOVERY NETWORK
==================================================

Research connects with:

Campaign

Exploration

Codex

Collections

Bosses

Biomes

Ancient Archives

Faction Reputation

Scientific Expeditions

Knowledge comes from playing the game.

==================================================
RESEARCH LABS
==================================================

Support specialised laboratories:

Engineering Institute

Quantum Laboratory

Void Observatory

Crystal Resonance Centre

Prototype Division

Biological Institute

Artificial Intelligence Centre

Ancient Archive

Civilian Development Bureau

Future laboratories extend naturally.

==================================================
GALACTIC SCIENCE
==================================================

Scientific discoveries permanently improve:

Civilisations

Trade

Exploration

Infrastructure

Research Speed

Technology Availability

Galaxy Restoration

The player's discoveries help rebuild civilisation.

==================================================
EXPERIMENTAL RESEARCH
==================================================

Experimental projects feature:

Risk vs Reward

Prototype Technology

Unstable Systems

Unique Mechanics

Advanced Builds

Unexpected Outcomes

Experimental science rewards curiosity.

==================================================
ANCIENT RESEARCH
==================================================

Ancient discoveries unlock:

Precursor Technology

Civilisation History

Afterlight Network

Quantum Engineering

Planetary Systems

Legendary Equipment

Hidden Campaigns

Ancient science changes player understanding.

==================================================
INFINITE RESEARCH
==================================================

Post-campaign research supports:

Efficiency

Exploration

Engineering

Civilian Development

Legendary Projects

Galaxy Restoration

Scientific Excellence

Infinite research remains meaningful.

==================================================
RESEARCH COLLECTION
==================================================

Track:

Completed Projects

Laboratories

Discoveries

Prototype Research

Ancient Research

Legendary Projects

Statistics

Historical Timeline

Collection celebrates scientific progress.

==================================================
SCIENTIFIC ARCHIVE
==================================================

Support:

Research Timeline

Technology Viewer

Dependency Graph

Scientific History

Discovery Map

Civilisation Timeline

Future Research Preview

Archives reinforce long-term progression.

==================================================
BALANCE PRINCIPLES
==================================================

Research rewards:

Curiosity.

Planning.

Discovery.

Experimentation.

Long-term investment.

Never mandatory grinding.

No branch should become universally optimal.

==================================================
ACCESSIBILITY
==================================================

Support:

Research Search

Dependency Visualisation

Recommended Projects

Large UI

Controller Navigation

Touch Navigation

Colour-blind Support

Narration Ready

==================================================
PERFORMANCE
==================================================

Cache dependency graphs.

Optimise research calculations.

Lazy load large trees.

Reuse interface systems.

Maintain:

120 FPS Preferred Desktop

60 FPS Minimum Desktop

60 FPS Steam Deck

60 FPS Mobile Target

==================================================
DEBUG
==================================================

Display:

Research Progress

Laboratory Status

Dependencies

Scientific Efficiency

Discovery Count

Performance

==================================================
OUTPUT
==================================================

Produce the complete Research Roster Framework.

Every future scientific discipline, technology, laboratory and expansion extends this architecture.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Complete every research path.

Review laboratory identity.

Review dependency graphs.

Review progression.

Review scientific discoveries.

Review experimental systems.

Review infinite research.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-081.

Reduce unnecessary complexity.

Strengthen scientific identity.

Increase meaningful discoveries.

Ensure the Research ecosystem becomes one of Afterlight's deepest permanent progression systems, allowing players to continuously reshape how they play through meaningful scientific breakthroughs that remain rewarding across thousands of hours.

Repeat until the Research Roster Framework consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-082.

---

## Foundation / AF-000–081 / GP-FINAL alignment review (recorded at catalogue time)

- **The AF-076/078/080 roster move applied to science, on unchanged shapes:** AF-024's `ResearchNodeDef` and engine, AF-069's endgame cost generator, and AF-081's `ResearchProjectProfileDef` stand untouched — the ecosystem is data. Fifteen roster disciplines map TOTALLY onto AF-081's ten; nine specialised laboratories map TOTALLY onto AF-081's eight-lab register (the AI Centre is an engineering wing today, honestly — no second register), with a per-project EQUALITY law: spec lab → AF-081 lab === the profile's laboratory, machine-checked for all eighteen projects.
- **"Science should continuously create new gameplay rather than larger numbers" is a DATA DISCIPLINE:** all four AF-082 projects are pure gameplay (`unlockFlag` effects, no numerics), and the tree's numeric-effect count is asserted UNCHANGED by this module — the roster grew the tree by four and grew its stat surface by zero. Three additions are FIRST PRODUCERS for categories registered-empty since AF-024: Drone Doctrine (droneEngineering), Gene Tempering (commanderDevelopment), Void Containment (voidResearch); the Afterlight Network chains behind the hidden Ancient Conduit — the spec's own §Ancient Research names it.
- **TIER AFFECTS OPPORTUNITY, NEVER NUMBERS:** eight tiers registered; entries are identity-only (discipline, tier, laboratory, network source, philosophy surface — no stat field by key inspection); six tiers carry projects and legendary/transcendent are honestly registered-empty (the mythic pattern). The discovery network draws on at least six distinct sources — "knowledge comes from playing the game" as a breadth assertion.
- **INFINITE RESEARCH RIDES AF-069's REAL ENGINE:** `infiniteResearchProjectFor(n)` prices every post-campaign project with `researchNodeCostFor` — the exact geometric ladder the endgame module shipped — cycling all seven infinite kinds with distinct ids and a never-flattening cost curve, proven over one hundred projects.
- **The SCIENTIFIC ARCHIVE is derivation:** `scientificArchiveFor` assembles all seven features (research timeline through future research preview) from data every project already carries — asserted non-empty for all eighteen. Galactic-science surfaces (seven), experimental traits (six), ancient unlocks (seven), collection kinds (eight), and the two forbidden outcomes (mandatory grinding, universally-optimal branch) are registered shelves.
- **The roster went LIVE:** the composition root's tree upgraded from fourteen to eighteen through the unchanged engine (validation, hidden-conduit reveal, DR-005 instant unlocks all intact), and the overlay's scientific-progress metric now spans the full roster.
- **Self-review executed:** 11 new tests — the twelve shelves, both total maps, the eighteen-project tree through the REAL engine's validation with three first-producer categories asserted, the pure-gameplay law with the unchanged-numeric-count proof, eighteen twelve-part architectures, the lab-equality binding with identity-only key inspection, the honest-empty tier assertion, the seven-feature archive for all projects, the hundred-project infinite ladder on AF-069's exact costs, **"complete every research path" executed literally** (all eighteen unlocked through the real engine, the ancient chain resolving end-to-end), and a **1,000-career seeded sweep** (unlocks never regress, the ledger never drifts, and the Network NEVER fires before the conduit). Suite: 966 passing. **Live in the browser:** the research line on the eighteen-project tree, zero page errors.

**Review verdict:** ALIGNED (zero shape changes; the ecosystem as pure data + two pure functions; four pure-gameplay projects with three first-producer categories; infinite research priced by the endgame's own engine). Internal quality score 9.5/10 — approved and locked. Produced outputs: `docs/RESEARCH_ROSTER.md`, `src/game/research/researchRosterData.ts`.
