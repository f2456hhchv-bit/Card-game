/**
 * Dev-build debug overlay (AF-016 §10). Toggled with the backquote key.
 * Displays the state machine, run, seed, and performance numbers the module
 * requires. Excluded from production by the DEV guard at the call site.
 */
export interface DebugSnapshot {
  gameState: string;
  overlays: readonly string[];
  runPhase: string | null;
  missionSeed: number | null;
  difficulty: string | null;
  build: string | null;
  sessionSeconds: number;
  fps: number;
  lastTransitionMs: number;
  droppedTimeMs: number;
  /** Enemy Director summary: phase, threat, budget, enemy/elite counts (AF-017 §10). */
  director: string | null;
  /** Input summary: context, movement vector, last action (AF-019 §10). */
  input: string | null;
  /** Movement summary: state, speed, boost, contacts (AF-020 §10). */
  movement: string | null;
  /** Combat summary: entities, projectiles, crit rate, defence (AF-021 §10). */
  combat: string | null;
  /** XP summary: level, progress, gems, build bonuses (AF-022 §8). */
  xp: string | null;
  /** Loot summary: ground count vs cap, collected, banked (AF-023 §8). */
  loot: string | null;
  /** Research summary: points, unlocked, live bonuses (AF-024 §7). */
  research: string | null;
  /** Meta ledger: account level, runs, kills, challenges (AF-026 §9). */
  meta: string | null;
  /** Inventory summary: size, storage usage, loadouts (AF-027 §DEBUG). */
  inventory: string | null;
  /** Equipment summary: bonuses, set count, power rating (AF-028 §10). */
  equipment: string | null;
  /** Relic summary: active relics, synergies (AF-029 §9). */
  relics: string | null;
  /** Commander summary: callsign, ability cooldown, ultimate charge (AF-030 §7). */
  commander: string | null;
  /** Ship summary: name, class, energy, ability cooldown (AF-031 §11). */
  ships: string | null;
  /** Weapon summary: name, category/pattern, shots fired, live projectiles, crit rate (AF-032 §DEBUG). */
  weapons: string | null;
  /** Enemy summary: active/elite count, nearest enemy's AI state + telegraph + hull (AF-033 §DEBUG). */
  enemies: string | null;
  /** Boss summary: state, phase, hull, shield, weak points destroyed (AF-035 §DEBUG). */
  boss: string | null;
  /** Biome summary: name, weather, hazard count, events triggered (AF-036 §DEBUG). */
  biome: string | null;
  /** Mission summary: name, RunPhase, objective progress, active modifiers (AF-037 §DEBUG). */
  mission: string | null;
  /** Galaxy summary: current system, region, exploration%, events triggered (AF-038 §DEBUG). */
  galaxy: string | null;
  /** Faction summary: dominant faction, reputation + level, a relationship, events triggered (AF-039 §DEBUG). */
  factions: string | null;
  /** Economy summary: currency balances, active merchant offer count, active Special Economic Event (AF-040 §DEBUG). */
  economy: string | null;
  /** Galaxy Event summary: last World Event, the World State value it touched, events triggered (AF-041 §DEBUG). */
  worldEvents: string | null;
  /** Achievement/Collection summary: achievements completed, extra collection counts, Discovery Log length (AF-042 §DEBUG). */
  achievements: string | null;
  /** Codex summary: entries unlocked, Discovery %, Missing Links, Timeline status (AF-043 §DEBUG). */
  codex: string | null;
  /** Save Framework summary: slice version, Autosave Status, Cloud Status, Backup Count, active profile (AF-044 §DEBUG). */
  saveFramework: string | null;
  /** Audio summary: Music State, active voice count, master mixer level (AF-045 §DEBUG). */
  audio: string | null;
  /** Outlaw summary: squad state, command order, captain status, live mines (AF-046 §DEBUG). */
  outlaws: string | null;
  /** Machine summary: network state, core status, live services, adaptation counts (AF-047 §DEBUG). */
  machines: string | null;
  /** Crystal summary: ecosystem count, resonance strength, live growth zones (AF-048 §DEBUG). */
  crystals: string | null;
  /** Void summary: swarm count, corruption level, live corruption zones (AF-049 §DEBUG). */
  voidSwarm: string | null;
  /** Ancient summary: site count, security stage, alert %, ceiling %, node count (AF-050 §DEBUG). */
  ancientSecurity: string | null;
  /** Xeno summary: hive count, evolution stage, biomass %, link state, acid pools (AF-051 §DEBUG). */
  xenoHive: string | null;
  /** Nomad summary: fleet count, scrap level, command ship state, crew/escort counts (AF-052 §DEBUG). */
  nomadFleets: string | null;
  /** Paragon summary: protocol count, reactor stability %, collapse state, unit/sentinel counts (AF-053 §DEBUG). */
  paragonProtocols: string | null;
  /** Celestial summary: constellation count, per-entity link counts, gravity well count (AF-054 §DEBUG). */
  celestialConstellations: string | null;
  /** Eclipsed summary: expedition count, per-member corruption stages, warden state, mirror %, echoes (AF-055 §DEBUG). */
  eclipsed: string | null;
  /** Conductor summary: pressure, recovery window + trigger, spawn queue, struggle score (AF-056 §DEBUG). */
  conductor: string | null;
  /** Boss Director summary: encounter beat, attack hold, summon/ceremony queues, cinematics (AF-057 §DEBUG). */
  bossDirector: string | null;
  /** Campaign summary: stage, chapter, objectives, story flags, world evolution (AF-068 §DEBUG). */
  campaign: string | null;
  /** Endgame summary: ascension level, milestones, expeditions, research, evolution, legacy (AF-069 §DEBUG). */
  endgame: string | null;
  /** Live-ops summary: live version, content packs, season state, compatibility (AF-070 §DEBUG). */
  liveOps: string | null;
  /** Commander Bond Network summary: total/discovered/maxed bonds, dual ultimates unlocked (AF-130 §DEBUG). */
  bonds: string | null;
  /** Living Expedition Ship summary: name, upgrade totals, rooms, companions, memorial entries (AF-131 §DEBUG). */
  ship: string | null;
  /** Living Galaxy summary: environmental averages, reputation total, chronicle length, current festival, unresolved crime (AF-132 §DEBUG). */
  livingGalaxy: string | null;
  /** Legacy Engine summary: total legacy XP, top category, galactic records set, journal/gift/photo counts (AF-133 §DEBUG). */
  legacy: string | null;
  /** Living Museum summary: quality, restoration projects, donations, visitors, theater/library/audio counts (AF-134 §DEBUG). */
  livingMuseum: string | null;
  /** Chronicle of Humanity summary: planet entries, oral history, books, writable entries, final chronicle preview (AF-135 §DEBUG). */
  chronicle: string | null;
  /** Dynamic Story Engine summary: dominant pillars, pacing bias, campaign theme, reputation title, callbacks (AF-136 §DEBUG). */
  storyEngine: string | null;
  /** Galactic Event Engine summary: tier weights, logged events, mining-boom chain progress (AF-137 §DEBUG). */
  eventEngine: string | null;
  /** Civilisation Engine summary: sample settlement's stage/attributes, megaproject/landmark/immigration counts, social event, government lean, public opinion (AF-138 §DEBUG). */
  civilisationEngine: string | null;
  /** Evolution Engine summary: technology era, transport tier, architecture layers, commander maturity, player rank, equipment stage, species/companion/language tracking, unified Great Projects progress (AF-139 §DEBUG). */
  evolutionEngine: string | null;
  /** Infinite Endgame Engine summary: gated on AF-069's real endgame unlock; frontier expeditions, council lean, commander legacy successors, mega discoveries, galactic museum expansion, megacities, emergent industries, annual event, infinite-research knowledge sample (AF-140 §DEBUG). */
  endgameEngine: string | null;
  /** Galactic Creator Engine summary: photo albums, curated exhibitions, expedition flags, garden/observatory design elements, playlists, commander creative contributions, community project progress, creation heritage stage (AF-141 §DEBUG). */
  galacticCreator: string | null;
  /** Modular Universe Engine summary: registered module count, computed system compatibility, QA pass/fail, loaded count, dependency load-order resolution, content discovery count (AF-142 §DEBUG). */
  moduleUniverse: string | null;
  /** Atlas Development Framework summary: design score gate, commander/world completeness checklist coverage, post-launch tracking count, knowledge base size (AF-143 §DEBUG). */
  atlasFramework: string | null;
  /** Afterlight Operating System summary: responsibilities count, bus event telemetry, world-state stability, synchronised clocks, priority tier, decision routing, prediction, performance throttle recommendations, recovery count, dialogue context (AF-144 §DEBUG). */
  aos: string | null;
  /** Afterlight Design Constitution summary: features evaluated, content-test pass count, latest feature's test scores, dominant pillar, reinforcement count (AF-146 §DEBUG). */
  designConstitution: string | null;
  /** Atlas Core summary: principle/hierarchy counts, features validated, latest feature's principle reinforcement count, dominant principle (AF-145 §DEBUG). */
  atlasCore: string | null;
  /** Afterlight Franchise Bible summary: current Era, canon tier count and authoritative statement, franchise-project compliance (AF-147 §DEBUG). */
  franchiseBible: string | null;
  /** Atlas Canon Engine summary: canon event count, knowledge-state divergence, lore validation pass rate, commander continuity facts, artifact authenticity records (AF-148 §DEBUG). */
  canonEngine: string | null;
  /** Atlas Protocol summary: current Seven-Stages position, system impact report, red/green flag assessment, Atlas Score, iteration cycle count, final validation (AF-149 §DEBUG). */
  atlasProtocol: string | null;
  /** Afterlight Universe Master Index summary: registered entry count, dependency-order resolution, relationship/dependency/version-history counts, quality score for a sample entry (AF-150 §DEBUG). */
  masterIndex: string | null;
  /** Atlas Knowledge Graph summary: edge count, isolation check, neighbour count, shared-neighbour connection suggestions, chronology violations for a sample node (AF-151 §DEBUG). */
  knowledgeGraph: string | null;
  /** Atlas World Model summary: entity count, entities needing help, top goal, spatial location, memory count, importance, and reused AF-144 prediction/priority values for a sample entity (AF-152 §DEBUG). */
  worldModel: string | null;
  /** Atlas Simulation Director summary: simulation tier, attention score and budget share, emotional-pacing imbalance, narrative guardrail status, emergence opportunities surfaced, reused AF-144 throttle recommendations (AF-153 §DEBUG). */
  simulationDirector: string | null;
  /** Atlas Orchestrator summary: pacing-cycle stage and stall status, latest player-experience wonder factor, discovery-curve dry-period status, content-rotation recommendation, longest-term-memory milestone, engagement-map recommendation, reused AF-144 System Negotiation winner, reused AF-149 Expansion Readiness impact, emotional-tone rebalancing status, failsafe priority, player-journey tier, and reused AF-153 Surprise Engine count (AF-154 §DEBUG). */
  atlasOrchestrator: string | null;
  /** Atlas Intelligence Engine summary: current Intelligence Layer and Learning Loop stage (each with its cyclic next stage), a sample rankOptions decision with confidence and uncertainty response, composed knowledge-richness score, collaborative-problem count, and reused AF-151 Discovery Suggestion count (AF-155 §DEBUG). */
  atlasIntelligence: string | null;
  /** Atlas Decision Engine summary: current Decision Pyramid level (with cyclic next level), a sample explainDecision outcome with confidence and rejected alternatives, repetitive-choice status, faction ethical-alignment score, capped player-influence share, and long-term-planning horizon rank, reusing AF-155's rankOptions/CyclicStageTracker throughout (AF-156 §DEBUG). */
  atlasDecision: string | null;
  /** Atlas Planning Engine summary: a sample plan's id/horizon, contingency coverage, dependency-satisfaction status, adaptation and memory counts, and a reused AF-156 explainDecision Plan Negotiation winner (AF-157 §DEBUG). */
  atlasPlanning: string | null;
  /** Atlas Future Engine summary: a reused AF-144 PredictionEngine numeric forecast with confidence, the most-likely branching Future State, latest flagged risk severity, and Opportunity/Future-Memory counts (AF-158 §DEBUG). */
  atlasFuture: string | null;
  /** Atlas Possibility Engine summary: registered possibility count and sample discovery category, player-inspiration and serendipity counts (the latter composable from reused AF-151 suggestConnections), unsolved/total mystery counts, cultural-trend adopter count, and innovation-memory count (AF-159 §DEBUG). */
  atlasPossibility: string | null;
  /** Atlas Wisdom Engine summary: current Reflection Loop stage (reused AF-155 CyclicStageTracker, with cyclic next stage), a sample Commander's overall/Patience wisdom scores, mentorship assignment, Scientific/Ethical Deliberation all-must-pass review status, Generational Transfer rank, and Wisdom Memory count (AF-160 §DEBUG). */
  atlasWisdom: string | null;
  /** Atlas Philosophy Engine summary: a sample Commander's current belief, an entity's current Academic School adherence, an observed (never labelled) Player Philosophy tally, scheduled philosophical-event count, and reused AF-159 Cultural Reflection / AF-135 Historical Reinterpretation counts (AF-161 §DEBUG). */
  atlasPhilosophy: string | null;
  /** Atlas Purpose Engine summary: a sample citizen's/Commander's discovered purpose, the player's revealed dominant Player Purpose, real Long-term Mission progress, the Purpose Evolution rank, reused AF-155 Shared Purpose contributor count, reused AF-151 Purpose Network neighbour count, and Purpose Memory count (AF-162 §DEBUG). */
  atlasPurpose: string | null;
  /** Atlas Meaning Engine summary: a sample Commander's curated Personal Meaning entry, the player's curated Player Meaning entry, a civilisation's curated Collective Memory entry (all via the shared MeaningCurator), a Symbol's accumulated significance weight, a place's attached Community Meaning, and the Quiet Moment count (AF-163 §DEBUG). */
  atlasMeaning: string | null;
  /** Atlas Experience Engine summary: reused AF-154 Experience Rhythm stage, reused AF-162 Player Expression dominant purpose, reused AF-153 Surprise Management count, First-Time Moment protection status, a sample Experience State snapshot, an Atmospheric Design level, reused AF-155 Shared Experience contributor count, and the Long-Term Experience rank (AF-164 §DEBUG). */
  atlasExperience: string | null;
  /** Atlas Memory Engine summary: a sample memory's untouched objective description alongside its drifted subjective version, the player's most-visited planet/visit count/photo count, an institution's memory count, a sample Commander's real AF-133 personal-memory count, and a reused AF-151 Memory Network neighbour count (AF-165 §DEBUG). */
  atlasMemory: string | null;
  /** Atlas Consciousness Engine summary: a sample Commander's current professional identity and self-image/reputation gap status, reused AF-160 Reflection Loop stage composed with a reused AF-163 curated reflection topic, a capped-delta Value Priority, a Personal Growth area score and overall average, a bounded Emotional-Continuity hope level, a reused AF-155 Moral Reasoning choice, and the Life Stage rank (AF-166 §DEBUG). */
  atlasConsciousness: string | null;
  /** Atlas Identity Engine summary: a sample Commander's curated Personal Identity signature (via a reused AF-163 generic MeaningCurator), most-recognised external Reputation quality and count, an Earned Title count, and reused AF-159 Cultural Identity / AF-163 Symbolism significance counts (AF-167 §DEBUG). */
  atlasIdentity: string | null;
  /** Atlas Soul Engine summary: the emergent (never assigned) dominant Collective Character trait, a Ritual count, a Moments-of-Humanity count, the averaged Beauty Index, a reused AF-167 Galactic Reputation quality at civilisation scale, and a reused AF-166 civilisation-scale hope level (AF-168 §DEBUG). */
  atlasSoul: string | null;
  /** Atlas Legacy of Tomorrow summary (capstone): a reused AF-162 Legacy Project's progress/completion, whether the Horizon Principle opened the next reused AF-159 mystery and the unsolved count, a reused AF-160 mentee count, the reused AF-167 Galactic Maturity quality, and the Next-Generation witness count (AF-169 §DEBUG). */
  atlasLegacyOfTomorrow: string | null;
}

export class DebugOverlay {
  private readonly element: HTMLPreElement;
  private visible = true;

  constructor(parent: HTMLElement) {
    this.element = document.createElement("pre");
    this.element.style.cssText = [
      "position:fixed",
      "top:8px",
      "left:8px",
      "margin:0",
      "padding:8px 12px",
      "background:rgba(5,6,10,0.85)",
      "border:1px solid rgba(16,26,56,0.9)",
      "color:#3fd4f5",
      "font:12px/1.5 monospace",
      "z-index:9999",
      "pointer-events:none",
      "white-space:pre",
    ].join(";");
    parent.appendChild(this.element);
    window.addEventListener("keydown", (event) => {
      if (event.key === "`") {
        this.visible = !this.visible;
        this.element.style.display = this.visible ? "block" : "none";
      }
    });
  }

  update(snapshot: DebugSnapshot): void {
    if (!this.visible) return;
    const overlays = snapshot.overlays.length > 0 ? ` +[${snapshot.overlays.join(", ")}]` : "";
    this.element.textContent = [
      `state      ${snapshot.gameState}${overlays}`,
      `run phase  ${snapshot.runPhase ?? "—"}`,
      `seed       ${snapshot.missionSeed ?? "—"}`,
      `difficulty ${snapshot.difficulty ?? "—"}`,
      `build      ${snapshot.build ?? "—"}`,
      `director   ${snapshot.director ?? "—"}`,
      `input      ${snapshot.input ?? "—"}`,
      `movement   ${snapshot.movement ?? "—"}`,
      `combat     ${snapshot.combat ?? "—"}`,
      `xp         ${snapshot.xp ?? "—"}`,
      `loot       ${snapshot.loot ?? "—"}`,
      `research   ${snapshot.research ?? "—"}`,
      `meta       ${snapshot.meta ?? "—"}`,
      `inventory  ${snapshot.inventory ?? "—"}`,
      `equipment  ${snapshot.equipment ?? "—"}`,
      `relics     ${snapshot.relics ?? "—"}`,
      `commander  ${snapshot.commander ?? "—"}`,
      `ships      ${snapshot.ships ?? "—"}`,
      `weapons    ${snapshot.weapons ?? "—"}`,
      `enemies    ${snapshot.enemies ?? "—"}`,
      `boss       ${snapshot.boss ?? "—"}`,
      `biome      ${snapshot.biome ?? "—"}`,
      `mission    ${snapshot.mission ?? "—"}`,
      `galaxy     ${snapshot.galaxy ?? "—"}`,
      `factions   ${snapshot.factions ?? "—"}`,
      `economy    ${snapshot.economy ?? "—"}`,
      `worldEvent ${snapshot.worldEvents ?? "—"}`,
      `achieve    ${snapshot.achievements ?? "—"}`,
      `codex      ${snapshot.codex ?? "—"}`,
      `save       ${snapshot.saveFramework ?? "—"}`,
      `audio      ${snapshot.audio ?? "—"}`,
      `outlaws    ${snapshot.outlaws ?? "—"}`,
      `machines   ${snapshot.machines ?? "—"}`,
      `crystals   ${snapshot.crystals ?? "—"}`,
      `void       ${snapshot.voidSwarm ?? "—"}`,
      `ancient    ${snapshot.ancientSecurity ?? "—"}`,
      `xeno       ${snapshot.xenoHive ?? "—"}`,
      `nomads     ${snapshot.nomadFleets ?? "—"}`,
      `paragon    ${snapshot.paragonProtocols ?? "—"}`,
      `celestial  ${snapshot.celestialConstellations ?? "—"}`,
      `eclipsed   ${snapshot.eclipsed ?? "—"}`,
      `conductor  ${snapshot.conductor ?? "—"}`,
      `bossDir    ${snapshot.bossDirector ?? "—"}`,
      `campaign   ${snapshot.campaign ?? "—"}`,
      `endgame    ${snapshot.endgame ?? "—"}`,
      `liveops    ${snapshot.liveOps ?? "—"}`,
      `bonds      ${snapshot.bonds ?? "—"}`,
      `ship       ${snapshot.ship ?? "—"}`,
      `galaxyLife ${snapshot.livingGalaxy ?? "—"}`,
      `legacy     ${snapshot.legacy ?? "—"}`,
      `museumLife ${snapshot.livingMuseum ?? "—"}`,
      `chronicle  ${snapshot.chronicle ?? "—"}`,
      `story      ${snapshot.storyEngine ?? "—"}`,
      `events     ${snapshot.eventEngine ?? "—"}`,
      `civEngine  ${snapshot.civilisationEngine ?? "—"}`,
      `evolution  ${snapshot.evolutionEngine ?? "—"}`,
      `infEndgame ${snapshot.endgameEngine ?? "—"}`,
      `creator    ${snapshot.galacticCreator ?? "—"}`,
      `universe   ${snapshot.moduleUniverse ?? "—"}`,
      `atlas      ${snapshot.atlasFramework ?? "—"}`,
      `aos        ${snapshot.aos ?? "—"}`,
      `constitn   ${snapshot.designConstitution ?? "—"}`,
      `atlasCore  ${snapshot.atlasCore ?? "—"}`,
      `franchise  ${snapshot.franchiseBible ?? "—"}`,
      `canonEng   ${snapshot.canonEngine ?? "—"}`,
      `protocol   ${snapshot.atlasProtocol ?? "—"}`,
      `masterIdx  ${snapshot.masterIndex ?? "—"}`,
      `knowGraph  ${snapshot.knowledgeGraph ?? "—"}`,
      `worldModel ${snapshot.worldModel ?? "—"}`,
      `simDir     ${snapshot.simulationDirector ?? "—"}`,
      `orchestr   ${snapshot.atlasOrchestrator ?? "—"}`,
      `intel      ${snapshot.atlasIntelligence ?? "—"}`,
      `decision   ${snapshot.atlasDecision ?? "—"}`,
      `planning   ${snapshot.atlasPlanning ?? "—"}`,
      `future     ${snapshot.atlasFuture ?? "—"}`,
      `possible   ${snapshot.atlasPossibility ?? "—"}`,
      `wisdom     ${snapshot.atlasWisdom ?? "—"}`,
      `philosophy ${snapshot.atlasPhilosophy ?? "—"}`,
      `purpose    ${snapshot.atlasPurpose ?? "—"}`,
      `meaning    ${snapshot.atlasMeaning ?? "—"}`,
      `experience ${snapshot.atlasExperience ?? "—"}`,
      `memory     ${snapshot.atlasMemory ?? "—"}`,
      `conscious  ${snapshot.atlasConsciousness ?? "—"}`,
      `identity   ${snapshot.atlasIdentity ?? "—"}`,
      `soul       ${snapshot.atlasSoul ?? "—"}`,
      `legacyTmrw ${snapshot.atlasLegacyOfTomorrow ?? "—"}`,
      `session    ${snapshot.sessionSeconds.toFixed(1)}s`,
      `fps        ${snapshot.fps.toFixed(0)}`,
      `transition ${snapshot.lastTransitionMs.toFixed(2)}ms (budget 250)`,
      `dropped    ${snapshot.droppedTimeMs.toFixed(1)}ms`,
    ].join("\n");
  }
}
