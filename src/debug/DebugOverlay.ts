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
  /** Atlas Prime Directive summary (permanent governing intelligence, never itself a gameplay system): the highest-priority active Prime Directive and Conflict Resolution priority, a Design Arbiter score/gate status mirroring AF-143/149's real scoring-rubric shape, Future Compatibility/Quality Lock/Final Test all-must-pass statuses, the in-fiction-only System Priority rank, and a live detectOverlap reading confirming AF-162/161's real domain-list overlap (AF-170 §DEBUG). */
  atlasPrimeDirective: string | null;
  /** Atlas Creative Intelligence summary: a sample Commander's creative-contribution count (via the new CreativeContributionLog), a Creative Heritage outcome count, reused AF-159 Cultural Creativity/AF-155 Collaborative Creation/AF-168 Beauty Principle/AF-165 Photography/AF-159 Discovery-Through-Creation/AF-151 idea-propagation readings, and a live detectOverlap reading confirming a new absolute domain-overlap record against AF-169's real LEGACY_DOMAINS (AF-171 §DEBUG). */
  atlasCreativeIntelligence: string | null;
  /** Atlas Imagination Engine summary: a sample Commander's evolving Vision (via the reused AF-161 CommanderBeliefTracker), the new HypothesisTracker's grounded status for a sample speculative idea, a reused AF-162 Engineering Imagination project's progress, the reused AF-155 CyclicStageTracker's current Dream Network stage, the reused AF-159 mystery-unsolved count for Historical Imagination, and a live detectOverlap reading confirming IMAGINATION_DOMAINS ties AF-171's real CREATIVE_DOMAINS overlap record (AF-172 §DEBUG). */
  atlasImagination: string | null;
  /** Atlas Possibility Space summary: the reused AF-159 Possibility Network's registered-possibility count, the reused AF-158 Multiple-Futures forecast's current highest-confidence branch, the reused AF-172 HypothesisTracker's evidence-grounded status for a sample Scientific Possibility, the new SandboxScenarioRegistry's commitment status for a sample scenario, the reused AF-159 InnovationMemoryArchive's Failed-Possibility outcome count, the new InnovationFilterScoreCard's score/gate status mirroring AF-143/149/170's real scoring-rubric shape, and a live detectOverlap reading confirming POSSIBILITY_CATEGORIES ties the 8/12 overlap record against the real DISCOVERY_CATEGORIES (AF-173 §DEBUG). */
  atlasPossibilitySpace: string | null;
  /** Atlas Horizon Engine summary: a sample Commander's evolving Horizon (via the reused AF-161 CommanderBeliefTracker), the reused AF-159 MysteryLog's unsolved count for Living Frontiers/The Unknown Index, the reused AF-151 KnowledgeGraph's neighbour count for the Horizon Network, the reused AF-155 CyclicStageTracker's current Civilisation Horizon stage, the new HorizonEffectTracker's unknown index/knowledge count for The Horizon Effect, and a live detectOverlap reading confirming HORIZON_CATEGORIES ties the codebase's 8/12 overlap record against AF-173's real POSSIBILITY_CATEGORIES (AF-174 §DEBUG). */
  atlasHorizon: string | null;
  /** Atlas Infinity Engine summary (the highest layer of the in-fiction Atlas chain only — never above the real docs/CONSTITUTION.md, see atlasInfinityData.ts's CRITICAL SCOPE NOTE): the reused AF-155 CyclicStageTracker's current/next Evolution Cycle stage, the new GenerationalHandoffLedger's inherited starting baseline and cumulative contribution count for Generational Handoff, the reused AF-160 MentorshipLedger's mentee count and AF-166 EmotionalContinuityTracker's civilisation-scale hope level for The Expanding Heart, and a live detectOverlap reading confirming INFINITY_DOMAINS sets a new absolute 10/12 overlap record against AF-172's real IMAGINATION_DOMAINS (AF-175 §DEBUG). */
  atlasInfinity: string | null;
  /** Atlas Continuum summary: the reused AF-155 CyclicStageTracker's current/next stage across the module's own 8-stage Continuum cycle, the reused AF-175 GenerationalHandoffLedger's inherited baseline for a later generation (the same ledger spanning generations and campaigns for Generational/Player Continuity), the new ThreadRegistry's marked-thread count and the new allThreadsConnected's structural "nothing exists in isolation" check against the reused AF-151 KnowledgeGraph, and a live detectOverlap reading confirming CONTINUUM_DOMAINS ties the codebase's 10/12 overlap record against AF-175's real INFINITY_DOMAINS (AF-176 §DEBUG). */
  atlasContinuum: string | null;
  /** Atlas Genesis Engine summary: the new GenesisRegistry's write-once founder for a sample institution's First Moment, the reused AF-172 HypothesisTracker's grounded status for Scientific Origins, the reused AF-165 InstitutionalMemoryTracker's memory count for Institution Foundations, the reused AF-151 KnowledgeGraph's Inspired-edge neighbour count for The Spark Network, the reused AF-155 CyclicStageTracker's current Beginning-to-Legacy stage, the reused AF-167 EarnedTitleTracker's title count for The Founders, and a live detectOverlap reading confirming GENESIS_DOMAINS ties the codebase's 10/12 overlap record against AF-174's real HORIZON_CATEGORIES (AF-177 §DEBUG). */
  atlasGenesis: string | null;
  /** Atlas Renaissance Engine summary: the new RenaissanceTracker's golden-age status and distinct-trigger count (compounding, never from a single repeated trigger), the reused AF-168 BeautyIndexTracker's Architecture level for Architectural Renaissance, the reused AF-159 CulturalTrendTracker's adopter count for Cultural Renaissance, the reused AF-151 KnowledgeGraph's Inspired-edge neighbour count for The Renaissance Network, and a live detectOverlap reading confirming RENAISSANCE_DOMAINS sets a new absolute 11/12 overlap record against AF-171's real CREATIVE_DOMAINS (AF-178 §DEBUG). */
  atlasRenaissance: string | null;
  /** Atlas Ascension Engine summary (a civilisation-wide maturity ladder, unrelated to AF-069/070's per-run endgame "ascensionLevel" — see atlasAscensionData.ts's NAMING SCOPE NOTE): the module's own ascensionTierRank for the highest Ascension Tier, the reused AF-160 MentorshipLedger's mentee count for Commander Ascension, the reused AF-168 BeautyIndexTracker/AF-159 CulturalTrendTracker readings for Cultural Ascension, the reused AF-151 KnowledgeGraph's Influenced-edge neighbour count for the Ascension Network, the new AscensionIndexScoreCard's score/gate status mirroring AF-143/149/170/173's real scoring-rubric shape, and a live detectOverlap reading against AF-168's real SOUL_DIMENSIONS (AF-179 §DEBUG). */
  atlasAscension: string | null;
  /** Atlas Transcendence Engine summary (the highest layer of the in-fiction Atlas chain only — never above the real docs/CONSTITUTION.md, see atlasTranscendenceData.ts's CRITICAL SCOPE NOTE): the module's own civilisationalShiftRank for the highest shift stage, the reused AF-155 CyclicStageTracker's current/next Stewardship Loop stage, the reused AF-163 QuietMomentLog's count for The Quiet Victory, the reused AF-167 EarnedTitleTracker's title count for Commander Transcendence, the new UniversalLibrary's preserved status/category for The Universal Library, the new TranscendenceIndexScoreCard's score/gate status mirroring AF-143/149/170/173/179's real scoring-rubric shape, and a live detectOverlap reading against AF-179's real ASCENSION_PILLARS (AF-180 §DEBUG). */
  atlasTranscendence: string | null;
  /** Atlas Eternity Engine summary: the reused AF-135 PlanetaryChronicle's version count for The Eternal Library, the reused AF-165 InstitutionalMemoryTracker's memory count for The Eternal Museum, the reused AF-159 CulturalTrendTracker's adopter count for Cultural Preservation, the reused AF-163 SignificanceTracker's reading for Planetary Heritage, the reused AF-151 KnowledgeGraph's neighbour count for The Memory Constellation, the reused AF-155 CyclicStageTracker's current Preservation Cycle stage, the new EternalArchive's preserved status/category, the reused AF-175 GenerationalHandoffLedger's inherited baseline for The Future Curators, and a live detectOverlap reading against AF-176's real CONTINUUM_DOMAINS (AF-181 §DEBUG). */
  atlasEternity: string | null;
  /** Atlas Harmony Engine summary: the new HarmonyTracker's emergent most-dominant/most-neglected domain and balanced status (capped-delta-per-update, never assigned directly), the reused AF-151 KnowledgeGraph's Influenced-edge neighbour count for System Relationships, the reused AF-159 CulturalTrendTracker's adopter count for Cultural Harmony, the reused AF-168 BeautyIndexTracker's Public-spaces level for Urban Harmony, the new HarmonyIndexScoreCard's score/gate status mirroring AF-143/149/170/173/179/180's real scoring-rubric shape, and a live detectOverlap reading against AF-171's real CREATIVE_DOMAINS (AF-182 §DEBUG). */
  atlasHarmony: string | null;
  /** Atlas Symphony Engine summary (orchestration, not invention — almost entirely direct reuse): the reused AF-151 KnowledgeGraph's Inspired-edge neighbour count for Institutional/Cultural Symphony and The Resonance Model, the reused AF-155 CyclicStageTracker's current/next Civilisation Rhythm stage, the reused AF-163 QuietMomentLog's count for The Silence Principle, the new CampaignJourneyTracker's dominant journey and unified-story status for The Grand Performance, the new thematicConsistencyMet's ANY-of-N gate result for Thematic Consistency, the reused AF-175 GenerationalHandoffLedger's inherited baseline, and a live detectOverlap reading against AF-182's real HARMONY_DOMAINS (AF-183 §DEBUG). */
  atlasSymphony: string | null;
  /** Atlas Unity Engine summary: the reused AF-151 KnowledgeGraph's neighbour count for The Unity Network/The Civilisation Web/The Knowledge Commons, the reused AF-159 CulturalTrendTracker's adopter count for Unity Through Diversity, the reused AF-176 ThreadRegistry/allThreadsConnected's connected status for Shared Achievements, the new UnityIndexScoreCard's score/gate status mirroring AF-143/149/170/173/179/180/182's real scoring-rubric shape, and a live detectOverlap reading against AF-183's real SYMPHONY_DOMAINS (AF-184 §DEBUG). */
  atlasUnity: string | null;
  /** Atlas Living Universe Engine summary (unrelated to AF-132's locked Living Galaxy module — see atlasLivingUniverseData.ts's NAMING NOTE): the new LivingPresentTracker's current activity for a sample Commander (the only overwriting tracker in this codebase, by design), the reused AF-135 PlanetaryChronicle's version count for Living Cities/Planets, the reused AF-172 HypothesisTracker's grounded status for Living Knowledge, the reused AF-159 MysteryLog's unsolved count for Living Science/The Living Future, the reused AF-174 HorizonEffectTracker's unknown index, and a live detectOverlap reading against AF-176's real CONTINUUM_DOMAINS (AF-185 §DEBUG). */
  atlasLivingUniverse: string | null;
  /** Atlas Evolution Engine summary (distinct from AF-139's own locked "Evolution Engine" — see atlasEvolutionData.ts's NAMING SCOPE NOTE): the reused AF-139 SpeciesAdaptationRegistry/HistoricalArchitectureLedger/LanguageEvolutionLog readings for Species/City/Cultural Evolution, the reused AF-155 CyclicStageTracker's current/next Evolution Chain stage, the new EvolutionRecord's current state for a sample reversible practice (the first tracker in this codebase whose state can legitimately regress), and a live detectOverlap reading confirming EVOLUTION_DOMAINS shares zero exact members with AF-139's real EVOLUTION_PILLARS despite conceptual overlap (AF-186 §DEBUG). */
  atlasEvolution: string | null;
  /** Atlas Emergence Engine summary: the reused AF-167 ReputationTracker's revealed (never assigned) most-recognised quality for Commander Emergence, the reused AF-151 KnowledgeGraph's neighbour count for Scientific/Cultural Emergence, the reused AF-178 RenaissanceTracker's golden-age status for Positive Cascades' culmination, the new CascadeTracker's all-tiers-reached status for The Butterfly Network, the new emergenceValidationMet's all-must-pass result for Emergence Validation, and a live detectOverlap reading against AF-186's real EVOLUTION_DOMAINS (AF-187 §DEBUG). */
  atlasEmergence: string | null;
  /** Atlas Possibility Realisation Engine summary (distinct from AF-159's locked "Atlas Possibility Engine" and AF-173's locked "Atlas Possibility Space" — see atlasRealisationData.ts's NAMING SCOPE NOTE): the new RealisationTracker's current stage and reached-Wonder status for a sample idea (the first tracker in this codebase to structurally reject out-of-order or skipped-ahead advancement), the reused AF-172 HypothesisTracker's grounded status for Scientific Realisation, the reused AF-160 MentorshipLedger's mentee count for Commander Realisation, the reused AF-177 GenesisRegistry's founder lookup for Institutional Realisation, the new QualityGateScoreCard's score/gate status (the ninth mirrored scoring-rubric shape), and a live detectOverlap reading against AF-178's real RENAISSANCE_DOMAINS (AF-188 §DEBUG). */
  atlasRealisation: string | null;
  /** Atlas Civilisation Operating System summary — the third "operating system"-shaped module in this codebase, after AF-144's locked "Afterlight Operating System" (foundation layer) and AF-154's locked "Atlas Orchestrator" (player-experience layer); this one coordinates the Atlas-enrichment modules (see atlasCivilisationOSData.ts's NAMING SCOPE NOTE): the reused AF-144 WorldStateStore's current Population reading for State Management, the reused AF-144 PriorityEngine's registered tier for Priority Management, the reused AF-144 TelemetryCollector's total event count for Civilisation Telemetry, the new CivilisationHealthTracker's weakest domain for Continuous Diagnostics, the new ResourcePoolCoordinator's available Researchers for Resource Coordination, the reused AF-151 KnowledgeGraph's neighbour count for Service Dependencies, the new resolveByCivilisationFailsafePriority's resolved concern for Failsafe Services, the new adaptiveCoordinationTierRank for Adaptive Coordination, and the new CivilisationHeartbeat's latest answer for The Civilisation Heartbeat (AF-189 §DEBUG). */
  atlasCivilisationOS: string | null;
  /** Atlas Meta Evolution Engine summary — governs how the Afterlight PROJECT itself evolves across real-world development, never any in-fiction mechanic (distinct from AF-139's and AF-186's own locked "Evolution Engine" modules — see atlasMetaEvolutionData.ts's NAMING SCOPE NOTE): the new UpdateLifecycleTracker's current stage for a sample feature (mirroring AF-149's real FeatureLifecycleTracker shape a second time), the reused AF-149 IterationCycleTracker's ready-to-ship status, the new DesignHistoryLedger's latest recorded technical complexity, the new TechnicalDebtLog's record count, the reused AF-144 TelemetryCollector's total event count for Player Evolution, the reused AF-159 CulturalTrendTracker's adopter count for Community Evolution, the new updateQualityAssessment's reject/improvement result (mirroring AF-149's real featureFlagAssessment shape a second time), the new AtlasScorecardCard's score/gate status (the tenth mirrored scoring-rubric shape), and a live detectOverlap reading against AF-149's real SYSTEM_IMPACT_CATEGORIES (AF-190 §DEBUG). */
  atlasMetaEvolution: string | null;
  /** Atlas Creator Engine summary — governs every act of creation within the Afterlight universe, distinct from AF-141's locked "Galactic Creator Engine" (player decoration tooling) and AF-171's locked "Atlas Creative Intelligence" (an exact 12/12 domain match, reused directly rather than duplicated — see atlasCreatorData.ts's NAMING SCOPE NOTE): the new CyclicStageTracker instantiation's current/next Creation Cycle stage, the reused AF-155 CollaborativeProblemLog's participant count for Collaborative Creation, the reused AF-171 CreativeContributionLog's per-domain counts for Commander/Scientific/Engineering/Educational/Artistic/Architectural Creation, the reused AF-151 KnowledgeGraph's neighbour count for The Creator Network, the reused AF-168 BeautyIndexTracker's level for Beauty Through Purpose, the reused AF-171 CreativeHeritageArchive's outcome count for The Creation Archive, and the new purposefulBeautyMet's all-must-pass result (AF-191 §DEBUG). */
  atlasCreator: string | null;
  /** Atlas Craftsmanship Engine summary — AF-191's direct sibling, governing the pursuit of excellence rather than the act of creation itself (unrelated to `src/game/crafting/`'s item-recipe Crafting System and `src/game/masterIndex/`'s module dependency registry — see atlasCraftsmanshipData.ts's NAMING NOTE): the reused AF-166 ReputationTracker's revealed (never assigned) most-recognised quality for Master Craftsmen, the reused AF-149 IterationCycleTracker's ready-to-ship status for Quality Without Perfection, the reused AF-151 KnowledgeGraph's neighbour count for The Maker's Mark, the reused AF-160 MentorshipLedger's mentee count for The Craft Guilds, the new craftCycleRank's ordered (non-cyclic) rank for The Craft Cycle, the new standardOfExcellenceAssessment's continue-refining result for The Standard of Excellence, and live detectOverlap readings against AF-191's real CREATIVE_DOMAINS and CREATION_CYCLE_STAGES (AF-192 §DEBUG). */
  atlasCraftsmanship: string | null;
  /** Atlas Excellence Engine summary — the third module in the Creator (AF-191) -> Craftsmanship (AF-192) -> Excellence (AF-193) trilogy: the new CyclicStageTracker instantiation's current/next Excellence Cycle stage (an explicit closed loop, unlike AF-192's non-cyclic Craft Cycle), the reused AF-160 MentorshipLedger's mentee count for Personal Excellence, the reused AF-166 ReputationTracker's revealed quality for Commander Excellence, the reused AF-159 CulturalTrendTracker's adopter count for Cultural Excellence, the reused AF-149 IterationCycleTracker's ready status for Institutional Excellence, the new ImprovementNetworkLedger's record count for The Improvement Network, the new excellenceStandardAssessment's continue-refining result (the second instance of AF-192's own ANY-of-N shape), the new ExcellenceIndexScoreCard's score/gate status (the eleventh mirrored scoring-rubric shape), and a live detectOverlap reading against AF-191's real CREATIVE_DOMAINS (AF-193 §DEBUG). */
  atlasExcellence: string | null;
  /** Atlas Possibility Engine (AF-194) summary — CRITICAL: a verbatim title duplicate of AF-159's own real, already-locked "Atlas Possibility Engine" (see atlasOpenPossibilityData.ts's prominent NAMING COLLISION note; disambiguated here as "(AF-194)"): the reused AF-159 possibilityRegistry's required-people count for The Possibility Web, the reused AF-159 mysteryLog's unsolved count for The Unknown Reserve, the reused AF-159 playerInspiration's surfaced count for Player Possibility, the reused AF-155 collaborativeProblems' participant count for Possibility Through Cooperation, the reused AF-151 knowledgeGraph's neighbour count for Civilisational Possibility, the new possibilityCycleRank's ordered (non-cyclic) rank for The Possibility Cycle, the new PossibilityIndexScoreCard's score/gate status (the twelfth mirrored scoring-rubric shape), and a live detectOverlap reading against AF-193's real EXCELLENCE_DOMAINS (AF-194 §DEBUG). */
  atlasOpenPossibility: string | null;
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
      `primeDir   ${snapshot.atlasPrimeDirective ?? "—"}`,
      `creative   ${snapshot.atlasCreativeIntelligence ?? "—"}`,
      `imagination ${snapshot.atlasImagination ?? "—"}`,
      `possibility ${snapshot.atlasPossibilitySpace ?? "—"}`,
      `horizon    ${snapshot.atlasHorizon ?? "—"}`,
      `infinity   ${snapshot.atlasInfinity ?? "—"}`,
      `continuum  ${snapshot.atlasContinuum ?? "—"}`,
      `genesis    ${snapshot.atlasGenesis ?? "—"}`,
      `renaissance ${snapshot.atlasRenaissance ?? "—"}`,
      `ascension  ${snapshot.atlasAscension ?? "—"}`,
      `transcendence ${snapshot.atlasTranscendence ?? "—"}`,
      `eternity   ${snapshot.atlasEternity ?? "—"}`,
      `harmony    ${snapshot.atlasHarmony ?? "—"}`,
      `symphony   ${snapshot.atlasSymphony ?? "—"}`,
      `unity      ${snapshot.atlasUnity ?? "—"}`,
      `living     ${snapshot.atlasLivingUniverse ?? "—"}`,
      `atlasEvo   ${snapshot.atlasEvolution ?? "—"}`,
      `emergence  ${snapshot.atlasEmergence ?? "—"}`,
      `realisation ${snapshot.atlasRealisation ?? "—"}`,
      `civOS      ${snapshot.atlasCivilisationOS ?? "—"}`,
      `metaEvo    ${snapshot.atlasMetaEvolution ?? "—"}`,
      `creatorEng ${snapshot.atlasCreator ?? "—"}`,
      `craftsman  ${snapshot.atlasCraftsmanship ?? "—"}`,
      `excellence ${snapshot.atlasExcellence ?? "—"}`,
      `openDoor   ${snapshot.atlasOpenPossibility ?? "—"}`,
      `session    ${snapshot.sessionSeconds.toFixed(1)}s`,
      `fps        ${snapshot.fps.toFixed(0)}`,
      `transition ${snapshot.lastTransitionMs.toFixed(2)}ms (budget 250)`,
      `dropped    ${snapshot.droppedTimeMs.toFixed(1)}ms`,
    ].join("\n");
  }
}
