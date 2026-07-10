/**
 * Composition root (AF-001 §4). Builds the Event Bus, state machine, game
 * loop, and debug overlay, then walks the AF-016 primary loop with
 * placeholder screens. Rendering, input, and combat arrive with
 * AF-017 → AF-021; this skeleton proves the state flow they attach to.
 */
import { EventBus } from "./core/events/EventBus";
import type { GameEvents } from "./core/events/GameEvents";
import { GameLoop } from "./core/time/GameLoop";
import { Log } from "./core/log/Log";
import { Rng } from "./core/rng/Rng";
import { StateMachine } from "./core/state/StateMachine";
import {
  GAME_TRANSITIONS,
  OVERLAY_HOSTS,
  type GameStateId,
} from "./game/states/GameStates";
import {
  advancePhase,
  createRunSession,
  type RunPhase,
  type RunSessionRecord,
} from "./game/session/RunSession";
import { EnemyDirector } from "./game/director/EnemyDirector";
import { DEFAULT_DIRECTOR_TUNING } from "./game/director/directorTuning";
import { ActionInput } from "./engine/input/ActionInput";
import { KeyboardMouseAdapter } from "./engine/input/KeyboardMouseAdapter";
import { GamepadAdapter } from "./engine/input/GamepadAdapter";
import { DEFAULT_BINDINGS, DEFAULT_INPUT_TUNING } from "./engine/input/inputTuning";
import { Camera } from "./engine/camera/Camera";
import { DEFAULT_CAMERA_TUNING, type CameraMode } from "./engine/camera/cameraTuning";
import { PlayerMovement, type Obstacle } from "./game/movement/PlayerMovement";
import { resolveDamage, NEUTRAL_MODIFIERS } from "./game/combat/DamagePipeline";
import { DefenceState } from "./game/combat/DefenceState";
import { TARGET_SELECTORS, type TargetCandidate } from "./game/combat/targetPriority";
import { DEFAULT_COMBAT_TUNING } from "./game/combat/combatTuning";
import type { SpawnDirective } from "./game/director/EnemyDirector";
import { Pool } from "./core/pool/Pool";
import { XpSystem } from "./game/progression/XpSystem";
import { XpPickups } from "./game/progression/XpPickups";
import { UpgradePool } from "./game/progression/UpgradePool";
import { DEFAULT_XP_TUNING, type UpgradeDefinition } from "./game/progression/xpTuning";
import { generateDrop, type DropTableEntry, type LootDrop } from "./game/loot/LootGenerator";
import { GroundLoot } from "./game/loot/GroundLoot";
import { DEFAULT_LOOT_TUNING, RARITY_LADDER, RARITY_TABLE } from "./game/loot/lootTuning";
import { SaveSlice } from "./core/save/SaveSlice";
import { LocalStorageAdapter } from "./core/save/SaveStorage";
import { ResearchTree, type ResearchSaveData } from "./game/research/ResearchTree";
import { researchEfficiencyFor, scientificProgressFor } from "./game/research/researchFrameworkData";
import { ROSTER_RESEARCH_TREE, infiniteResearchProjectFor } from "./game/research/researchRosterData";
import { CraftingSystem, type CraftingSaveData } from "./game/crafting/CraftingSystem";
import {
  DEFAULT_CRAFTING_TUNING,
  SANDBOX_RECIPES,
  STARTING_BLUEPRINTS,
} from "./game/crafting/craftingData";
import { MetaProgression, type MetaSaveData } from "./game/meta/MetaProgression";
import { ACCOUNT_XP_AWARDS, SANDBOX_CHALLENGES } from "./game/meta/metaData";
import { Inventory, type InventorySaveData } from "./game/inventory/Inventory";
import { DEFAULT_INVENTORY_TUNING } from "./game/inventory/inventoryData";
import { validateLoadout, aggregateLoadout } from "./game/equipment/EquipmentAggregate";
import { engineeringLoadFor } from "./game/equipment/equipmentFrameworkData";
import { ROSTER_EQUIPMENT, ROSTER_EQUIPMENT_PROFILES, ROSTER_EQUIPMENT_SETS } from "./game/equipment/equipmentRosterData";
import { EquipmentCollectionRuntime } from "./game/equipment/EquipmentCollectionRuntime";
import { RelicSystem } from "./game/relics/RelicSystem";
import { CommanderRuntime } from "./game/commanders/CommanderRuntime";
import { SANDBOX_COMMANDERS } from "./game/commanders/commanderData";
import { FRAMEWORK_PROFILES } from "./game/commanders/commanderFrameworkData";
import { CommanderProgressionRuntime } from "./game/commanders/CommanderProgressionRuntime";
import { RosterRuntime } from "./game/commanders/RosterRuntime";
import { STARTING_COMMANDER_IDS, philosophyFor } from "./game/commanders/rosterData";
import { LYRA_VOSS_CODEX_ENTRY } from "./game/commanders/cmd001LyraVoss";
import { KANE_VANGUARD_CODEX_ENTRY } from "./game/commanders/cmd002AdrianKane";
import { RYKER_ENGINEER_CODEX_ENTRY } from "./game/commanders/cmd003EliasRyker";
import { CAEL_WEAVER_CODEX_ENTRY } from "./game/commanders/cmd004SeraphinaCael";
import { DRAKE_HUNTER_CODEX_ENTRY } from "./game/commanders/cmd005KaelDrake";
import { SOL_RESONANT_CODEX_ENTRY } from "./game/commanders/cmd006AriaSol";
import { VALE_VOIDRUNNER_CODEX_ENTRY } from "./game/commanders/cmd007OrionVale";
import { ISKANDER_SWARMMASTER_CODEX_ENTRY } from "./game/commanders/cmd008NovaIskander";
import { THORNE_STARFORGED_CODEX_ENTRY } from "./game/commanders/cmd009CassiaThorne";
import { VEX_CHRONOMANCER_CODEX_ENTRY } from "./game/commanders/cmd010AurelionVex";
import { ASH_TEMPEST_CODEX_ENTRY } from "./game/commanders/cmd011ValenAsh";
import { KORVEN_PHANTOM_CODEX_ENTRY } from "./game/commanders/cmd012NyxKorven";
import { SYN_BIOFORGE_CODEX_ENTRY } from "./game/commanders/cmd013MiraSyn";
import { SOLARI_PHOTON_CODEX_ENTRY } from "./game/commanders/cmd014RheaSolari";
import { KAIN_SINGULARITY_CODEX_ENTRY } from "./game/commanders/cmd015ZephyrKain";
import { REYES_WARDEN_CODEX_ENTRY } from "./game/commanders/cmd016AstridReyes";
import { ORION_STARLANCER_CODEX_ENTRY } from "./game/commanders/cmd017LucienOrion";
import { VOLKOV_TITAN_CODEX_ENTRY } from "./game/commanders/cmd018IvanVolkov";
import { MYRR_ORACLE_CODEX_ENTRY } from "./game/commanders/cmd019SeleneMyrr";
import { NOVA_ARCHITECT_CODEX_ENTRY } from "./game/commanders/cmd020CaelusNova";
import { VEGA_ECHO_CODEX_ENTRY } from "./game/commanders/cmd021TaliaVega";
import { RHEM_CATALYST_CODEX_ENTRY } from "./game/commanders/cmd022DariusRhem";
import { ROSS_HORIZON_CODEX_ENTRY } from "./game/commanders/cmd023ElianaRoss";
import { SOLACE_DIPLOMAT_CODEX_ENTRY } from "./game/commanders/cmd024KieranSolace";
import { ORIS_NANOFORGE_CODEX_ENTRY } from "./game/commanders/cmd025XantheOris";
import { DRAKE_SENTINEL_CODEX_ENTRY } from "./game/commanders/cmd026RonanDrake";
import { HELIX_ALCHEMIST_CODEX_ENTRY } from "./game/commanders/cmd027SoraHelix";
import { FEN_BEASTMASTER_CODEX_ENTRY } from "./game/commanders/cmd028DorianFen";
import { NOCTIS_VOIDWALKER_CODEX_ENTRY } from "./game/commanders/cmd029VegaNoctis";
import { AETHER_CELESTIAL_CODEX_ENTRY } from "./game/commanders/cmd030LysandraAether";
import { FULL_PROFILES_WITH_FOUNDER, FULL_RECRUITMENT_WITH_FOUNDER, FULL_ROSTER_WITH_FOUNDER, PRIME_FOUNDER_CODEX_ENTRY } from "./game/commanders/cmd031AtlasPrime";
import { DUAL_ULTIMATES, seedBondGraph } from "./game/commanders/bondNetworkData";
import { BondNetworkRuntime, EmotionalMemoryLog } from "./game/commanders/BondNetworkRuntime";
import { INITIAL_SHIP_UPGRADES, commanderRoomsFor } from "./game/livingShip/livingShipData";
import { CompanionHabitatRuntime, LivingShipRuntime, MemorialGardenLog } from "./game/livingShip/LivingShipRuntime";
import { seedEnvironmentalStates } from "./game/livingGalaxy/livingGalaxyData";
import { CrimeLedger, EnvironmentalRuntime, FestivalCalendar, LivingGalaxyChronicle, PlayerReputationLedger } from "./game/livingGalaxy/LivingGalaxyRuntime";
import { GalacticHistoryLog, GalacticRecordBoard, GiftLedger, LegacyProgressTracker, PhotoAlbum, PlayerChronicle, PlayerJournalRuntime } from "./game/legacy/LegacyEngineRuntime";
import { AUDIO_ARCHIVE_KINDS, COMMANDER_DONATION_EXAMPLES, LIBRARY_BOOK_KINDS, THEATER_PROGRAM_KINDS } from "./game/livingMuseum/livingMuseumData";
import { MuseumCollectionRegistry, MuseumQualityTracker, RestorationLab, VisitorLog, seedCommanderDonations } from "./game/livingMuseum/LivingMuseumRuntime";
import { ORAL_HISTORY_TOPICS, PLAYER_WRITABLE_ENTRY_KINDS, PUBLISHER_VOICES } from "./game/chronicle/chronicleData";
import { PlanetaryChronicle, generateFinalChronicle } from "./game/chronicle/ChronicleRuntime";
import { CommanderStorylineLog, NarrativeCallbackLog, StoryBranchTracker, StoryDirector, StoryPillarTracker, deriveCampaignTheme, reputationTitleFor } from "./game/storyEngine/StoryEngineRuntime";
import { EVENT_CHAIN_EXAMPLE, EVENT_TIERS, EVENT_TIER_EXAMPLES, tierWeightsFor } from "./game/eventEngine/eventEngineData";
import { EventChainRuntime, GalacticEventLog, rollTier } from "./game/eventEngine/EventEngineRuntime";
import { CIVILISATION_LANDMARK_KINDS, CIVILISATION_MEGAPROJECTS } from "./game/civilisationEngine/civilisationEngineData";
import {
  CareerPipeline,
  CivilisationAttributeExtension,
  GovernmentPriorityTracker,
  ImmigrationLedger,
  MegaprojectTracker,
  PublicOpinionTracker,
  SocialEventCalendar,
  civilisationAttributeSummaryFor,
} from "./game/civilisationEngine/CivilisationEngineRuntime";
import { architecturalStageFor, commanderMaturityScore, commanderMaturityStageFor, playerEvolutionRankFor, technologyEraFor, transportTierFor } from "./game/evolutionEngine/evolutionEngineData";
import {
  CompanionEvolutionTracker,
  EquipmentEvolutionTracker,
  HistoricalArchitectureLedger,
  LanguageEvolutionLog,
  SpeciesAdaptationRegistry,
  greatProjectsProgressSummary,
} from "./game/evolutionEngine/EvolutionEngineRuntime";
import { GREAT_EXPEDITION_DESTINATIONS, industryEmergenceEligible, megacityThresholdMet, temporaryExhibitionThemeFor } from "./game/endgameEngine/endgameEngineData";
import {
  AnnualEndgameCalendar,
  CommanderLegacyRuntime,
  EmergentIndustryLedger,
  ExpeditionCouncilTracker,
  FrontierExpeditionRegistry,
  GalacticMuseumExpansionTracker,
  MegaDiscoveryLog,
  MegacityLedger,
} from "./game/endgameEngine/EndgameEngineRuntime";
import { COMMUNITY_PROJECT_EXAMPLES, CREATOR_COMMANDER_DOMAINS, GARDEN_ELEMENT_KINDS, OBSERVATORY_ELEMENT_KINDS, contributionEligible, heritageStageFor } from "./game/galacticCreator/galacticCreatorData";
import {
  CommanderCreativeContributionLog,
  CommunityProjectTracker,
  CreationElementStudio,
  CreationHeritageLedger,
  ExhibitionCuratorRuntime,
  ExpeditionFlagRegistry,
  PhotoAlbumCurator,
  SoundtrackPlaylistRegistry,
} from "./game/galacticCreator/GalacticCreatorRuntime";
import { CONTENT_DISCOVERY_KINDS, MODULE_CATEGORIES } from "./game/moduleUniverse/moduleUniverseData";
import { ContentDiscoveryFeed, ModuleRegistry, moduleQaReport } from "./game/moduleUniverse/ModuleUniverseRuntime";
import { COMMANDER_VALIDATION_CHECKLIST, DESIGN_SCORE_CATEGORIES, WORLD_VALIDATION_CHECKLIST } from "./game/atlasFramework/atlasFrameworkData";
import { DesignScoreCard, KnowledgeBaseRegistry, PostLaunchSupportTracker, commanderCompletenessFor, worldCompletenessFor } from "./game/atlasFramework/AtlasFrameworkRuntime";
import { AOS_RESPONSIBILITIES, type AosEventMap } from "./game/aos/aosData";
import {
  DecisionRouter,
  PerformanceBudgetTracker,
  PredictionEngine,
  PriorityEngine,
  RecoveryLog,
  SimulationClockRegistry,
  TelemetryCollector,
  WorldStateStore,
  buildDialogueContext,
} from "./game/aos/AosRuntime";
import { CONTENT_TEST_QUESTIONS, EXPANSION_TEST_REQUIREMENTS } from "./game/designConstitution/designConstitutionData";
import { FeatureComplianceRegistry, PillarReinforcementLedger } from "./game/designConstitution/DesignConstitutionRuntime";
import { ATLAS_PRINCIPLES, ATLAS_SYSTEM_HIERARCHY, DESIGN_VALIDATION_QUESTIONS } from "./game/atlasCore/atlasCoreData";
import { AtlasCoreComplianceRegistry, AtlasPrincipleReinforcementLedger } from "./game/atlasCore/AtlasCoreRuntime";
import { CANON_TIERS, FRANCHISE_TEST_QUESTIONS, eraFor } from "./game/franchiseBible/franchiseBibleData";
import { CanonAuthorityResolver, CanonRecordLedger, FranchiseComplianceRegistry } from "./game/franchiseBible/FranchiseBibleRuntime";
import { LORE_VALIDATION_CHECK_KINDS, loreValidationReport } from "./game/canonEngine/canonEngineData";
import { ArtifactAuthenticityRegistry, CanonEventLedger, CommanderContinuityLedger, KnowledgeStateTracker, recordPlanetContinuityFact } from "./game/canonEngine/CanonEngineRuntime";
import { ATLAS_SCORE_CATEGORIES, FINAL_VALIDATION_QUESTIONS, GREEN_FLAGS, featureFlagAssessment, finalValidationPassed, systemImpactReportFor } from "./game/atlasProtocol/atlasProtocolData";
import { AtlasScoreCard, FeatureLifecycleTracker, IterationCycleTracker } from "./game/atlasProtocol/AtlasProtocolRuntime";
import { MASTER_CATALOGUE_CATEGORIES } from "./game/masterIndex/masterIndexData";
import { DependencyMap, MasterIndexRegistry, QualityTracker, RelationshipGraph, VersionHistoryLedger } from "./game/masterIndex/MasterIndexRuntime";
import { ShipRuntime } from "./game/ships/ShipRuntime";
import { SANDBOX_SHIPS } from "./game/ships/shipData";
import { ROSTER_RELICS, ROSTER_RELIC_PROFILES, activeSetBonusesFor } from "./game/relics/relicRosterData";
import { RelicCollectionRuntime } from "./game/relics/RelicCollectionRuntime";
import { WEAPON_PROFILES } from "./game/weapons/weaponFrameworkData";
import { WeaponMasteryRuntime } from "./game/weapons/WeaponMasteryRuntime";
import { ARSENAL_ENTRIES, STARTING_WEAPON_IDS } from "./game/weapons/weaponRosterData";
import { WeaponCollectionRuntime } from "./game/weapons/WeaponCollectionRuntime";
import { SANDBOX_SHIP_MODULES, SHIP_PROFILES } from "./game/ships/shipFrameworkData";
import { ShipOutfittingRuntime } from "./game/ships/ShipOutfittingRuntime";
import { FLEET_ENTRIES, STARTING_SHIP_IDS } from "./game/ships/shipRosterData";
import { ShipCollectionRuntime } from "./game/ships/ShipCollectionRuntime";
import { WeaponRuntime } from "./game/weapons/WeaponRuntime";
import { SANDBOX_WEAPONS, type StatusOnHit } from "./game/weapons/weaponData";
import { stepProjectile } from "./game/weapons/ProjectileBehaviour";
import { computeShotAngles } from "./game/weapons/FirePattern";
import { StatusEngine } from "./game/combat/StatusEngine";
import type { DamageSchool, DamageSourceKind } from "./game/combat/combatTuning";
import { SANDBOX_ENEMIES, type EnemyDef } from "./game/enemies/enemyData";
import { EnemyRuntime } from "./game/enemies/EnemyRuntime";
import { stepEnemyMovement } from "./game/enemies/EnemyMovement";
import { hasDeathEvent } from "./game/enemies/DeathEvents";
import { generateElite } from "./game/enemies/EliteGenerator";
import { ELITE_TIERS, EMPTY_MUTATION_EFFECTS, type MutationEffects } from "./game/enemies/eliteData";
import { LORE_MERCENARY_GUILD_CODEX, OUTLAW_CALLSIGNS, OUTLAW_ENEMIES, OUTLAW_MINE_TUNING, createOutlawMine } from "./game/enemies/outlawData";
import { OutlawSquadRuntime } from "./game/enemies/OutlawSquad";
import { LORE_MACHINE_NETWORK_DOCTRINE, MACHINE_ENEMIES, MACHINE_NETWORK_TUNING } from "./game/enemies/machineData";
import { MachineNetworkRuntime } from "./game/enemies/MachineNetwork";
import { CRYSTAL_ENEMIES, CRYSTAL_GROWTH_TUNING, LORE_CRYSTAL_RESONANCE_ARCHIVE, createCrystalGrowth, growCrystalZone } from "./game/enemies/crystalData";
import { CrystalResonanceRuntime } from "./game/enemies/CrystalResonance";
import { LORE_VOID_CORRUPTION_ARCHIVE, VOID_ENEMIES, VOID_ZONE_TUNING, createCorruptionZone } from "./game/enemies/voidData";
import { VoidCorruptionRuntime } from "./game/enemies/VoidCorruption";
import { ANCIENT_ENEMIES, ANCIENT_SECURITY_TUNING, LORE_ANCIENT_CUSTODIANS_CODEX } from "./game/enemies/ancientData";
import { AncientSecurityRuntime } from "./game/enemies/AncientSecurity";
import { LORE_XENOMORPH_HIVE_CODEX, XENO_ENEMIES, createAcidPool } from "./game/enemies/xenoData";
import { HiveEvolutionRuntime } from "./game/enemies/HiveEvolution";
import { LORE_NOMAD_FLEET_CODEX, NOMAD_ENEMIES, NOMAD_FLEET_TUNING } from "./game/enemies/nomadData";
import { NomadFleetRuntime } from "./game/enemies/NomadFleet";
import { LORE_PARAGON_PROTOCOL_CODEX, PARAGON_ENEMIES, createSingularityCharge } from "./game/enemies/paragonData";
import { ParagonInstabilityRuntime } from "./game/enemies/ParagonInstability";
import { CELESTIAL_ENEMIES, GRAVITY_WELL_TUNING, LORE_CELESTIAL_CONCLAVE_CODEX, createGravityWell } from "./game/enemies/celestialData";
import { CelestialConstellationRuntime } from "./game/enemies/CelestialConstellation";
import { ECLIPSED_ENEMIES, LORE_ECLIPSED_CODEX } from "./game/enemies/eclipsedData";
import { EclipsedCorruptionRuntime } from "./game/enemies/EclipsedCorruption";
import { DirectorConductor } from "./game/director/DirectorConductor";
import { WAVE_TYPE_TO_ENCOUNTER_TYPE, pressureFor } from "./game/director/conductorData";
import { BossDirectorRuntime } from "./game/bosses/BossDirector";
import { SANDBOX_BOSS_SUMMON_PLAN, beatFor } from "./game/bosses/bossDirectorData";
import { SANDBOX_BOSSES } from "./game/bosses/bossData";
import { BossRuntime } from "./game/bosses/BossRuntime";
import { isInsideHazard, stepHazardZone, type HazardZoneDef, type HazardZoneState } from "./game/bosses/BossArena";
import { SANDBOX_BIOMES, type BiomeDef } from "./game/biomes/biomeData";
import { HUMAN_FRONTIER_BIOME } from "./game/biomes/frontierBiome";
import { CRYSTAL_EXPANSE_BIOME } from "./game/biomes/crystalExpanseBiome";
import { MACHINE_EXPANSE_BIOME } from "./game/biomes/machineExpanseBiome";
import { VOID_EXPANSE_BIOME } from "./game/biomes/voidExpanseBiome";
import { ANCIENT_CORE_BIOME } from "./game/biomes/ancientCoreBiome";
import { SOLAR_WASTES_BIOME } from "./game/biomes/solarWastesBiome";
import { FROZEN_REACH_BIOME } from "./game/biomes/frozenReachBiome";
import { DERELICT_EXPANSE_BIOME } from "./game/biomes/derelictExpanseBiome";
import { LIVING_ECOSPHERES_BIOME } from "./game/biomes/livingEcospheresBiome";
import { SINGULARITY_ZONE_BIOME } from "./game/biomes/singularityZoneBiome";
import { BiomeRuntime } from "./game/biomes/BiomeRuntime";
import { CampaignRuntime } from "./game/campaign/CampaignRuntime";
import {
  CAMPAIGN_COUNTER_BOSSES,
  CAMPAIGN_COUNTER_MISSIONS,
  CAMPAIGN_COUNTER_SYSTEMS,
  SANDBOX_CAMPAIGN,
} from "./game/campaign/campaignData";
import { EndgameRuntime } from "./game/endgame/EndgameRuntime";
import { SANDBOX_ASCENSIONS } from "./game/endgame/endgameData";
import { LiveOpsRegistry } from "./game/liveops/LiveOpsRegistry";
import { CORE_GAME_PACK, SEASON_ONE, SEASON_ONE_PACK } from "./game/liveops/liveOpsData";
import { MISSION_EVENT_TO_ENVIRONMENTAL_EVENT } from "./game/missions/missionData";
import { FRAMEWORK_MISSIONS, MISSION_PROFILES } from "./game/missions/missionFrameworkData";
import { ExpeditionLogRuntime, MISSION_ROSTER_ENTRIES } from "./game/missions/missionRosterData";
import { CIVILISATION_REGISTER, FACTION_PROFILES } from "./game/factions/factionFrameworkData";
import { CivilisationSimulationRuntime } from "./game/factions/CivilisationSimulationRuntime";
import { profileFor as codexProfileFor } from "./game/codex/codexFrameworkData";
import { CodexDiscoveryRuntime, CodexJournalRuntime } from "./game/codex/CodexProgressionRuntime";
import {
  CodexArchiveRuntime,
  ExpeditionJournalRuntime,
  PlayerNotebookExtensionRuntime,
  ScientificArchiveRuntime,
  collectionCompletionFor,
} from "./game/codex/CodexEcosystemRuntime";
import { MUSEUM_EXHIBIT_KINDS } from "./game/codex/codexEcosystemData";
import { generateMission } from "./game/missions/MissionGenerator";
import { MissionRuntime } from "./game/missions/MissionRuntime";
import { SANDBOX_GALAXY } from "./game/galaxy/galaxyData";
import { GalaxyRuntime } from "./game/galaxy/GalaxyRuntime";
import { SANDBOX_FACTION_ROSTER, PLAYER_CHOICE_REPUTATION_DELTA, REPUTATION_MIN, REPUTATION_MAX, type PlayerChoiceKind } from "./game/factions/factionData";
import { FactionRuntime } from "./game/factions/FactionRuntime";
import { SANDBOX_GALAXY_ECONOMY, CREDIT_AWARDS } from "./game/economy/economyData";
import { MarketRuntime } from "./game/economy/MarketRuntime";
import { GalacticEconomyRuntime } from "./game/economy/GalacticEconomyRuntime";
import { SEEDED_SETTLEMENTS } from "./game/civilisation/civilisationFrameworkData";
import { CivilisationFrameworkRuntime } from "./game/civilisation/CivilisationFrameworkRuntime";
import { SANDBOX_WORLD_EVENTS, WORLD_STATE_MIN, WORLD_STATE_MAX, PLAYER_PARTICIPATION_WORLD_STATE_DELTA, type PlayerParticipationKind } from "./game/worldEvents/worldEventData";
import { WorldEventRuntime } from "./game/worldEvents/WorldEventRuntime";
import { SANDBOX_ACHIEVEMENTS } from "./game/achievements/achievementData";
import { AchievementRuntime, type AchievementProgressReader } from "./game/achievements/AchievementRuntime";
import { CollectionLedger, type CollectionLedgerSaveData } from "./game/achievements/CollectionLedger";
import { SANDBOX_CODEX_ENTRIES, CODEX_SECTION_REWARDS, TIMELINE_ERAS } from "./game/codex/codexData";
import { CodexRuntime, type CodexUnlockReader } from "./game/codex/CodexRuntime";
import { DEFAULT_SETTINGS, type SettingsData } from "./core/save/settingsData";
import { SaveProfileManager } from "./core/save/SaveProfileManager";
import { SaveCoordinator } from "./core/save/SaveCoordinator";
import { AudioMixer } from "./game/audio/AudioMixer";
import { AudioEngine, NullAudioBackend, createSandboxAudioEngine } from "./game/audio/AudioEngine";
import { resolveMusicState } from "./game/audio/MusicState";
import { adaptiveMusicLayersFor } from "./game/audio/audioFrameworkData";
import { biomeVisualIdentityFor } from "./game/visual/visualDirectionData";
import { buildManagementLiveSummary, hudLiveSummary, inputLatencyProxyMs, navigationRealisationSummary } from "./game/ux/uxFrameworkData";
import { eventQueueSummary, moduleStatusSummary, saveVersionSummary } from "./game/technical/technicalArchitectureData";
import { accessibilityStatusSummary, qaStatusSummary, regressionCoverageSummary, releaseReadinessSummary } from "./game/qa/qualityAssuranceData";
import { commanderTemplateCoverageSummary, dialogueLibraryStatusSummary, masteryFeaturesLiveSummary, personalityFrameworkSummary, recruitmentMethodLiveSummary, relationshipCoverageSummary } from "./game/commanders/commanderProductionData";
import { DebugOverlay } from "./debug/DebugOverlay";

const app = document.getElementById("app");
if (!app) throw new Error("Missing #app root element");

const log = new Log({
  sink: import.meta.env.DEV
    ? (entry) => console[entry.level === "debug" ? "log" : entry.level](
        `[${entry.system}] ${entry.message}`,
        entry.data ?? "",
      )
    : undefined,
});

const bus = new EventBus<GameEvents>();

let session: RunSessionRecord | null = null;
let sessionMs = 0;
let director: EnemyDirector | null = null;
// AF-056: the Conductor sits OVER the locked AF-017 Director — it never
// touches enemy stats or budgets, only shapes WHEN directives land.
let conductor: DirectorConductor<SpawnDirective> | null = null;

const input = new ActionInput(DEFAULT_INPUT_TUNING, DEFAULT_BINDINGS);
new KeyboardMouseAdapter(input).attach();
const gamepad = new GamepadAdapter(input);

// Placeholder expedition arena (real arenas arrive with biome modules).
const ARENA = { minX: 0, minY: 0, maxX: 60, maxY: 34 };
const ARENA_OBSTACLES: readonly Obstacle[] = [
  { minX: 14, minY: 8, maxX: 18, maxY: 12 },
  { minX: 40, minY: 20, maxX: 46, maxY: 23 },
  { minX: 26, minY: 26, maxX: 34, maxY: 28 },
];

const camera = new Camera(DEFAULT_CAMERA_TUNING, 32, 18);
let movement: PlayerMovement | null = null;
let sandboxCanvas: HTMLCanvasElement | null = null;

// ── Sandbox combat (AF-021/AF-033): director directives materialise as
// EnemyDef-driven drones; the framework underneath is the deliverable.
interface Drone {
  id: string;
  x: number;
  y: number;
  // AF-033: EnemyMovementState fields — stepEnemyMovement mutates these directly.
  elapsedMs: number;
  strafeDirection: 1 | -1;
  phase: "hidden" | "active";
  hull: number;
  maxHull: number;
  elite: boolean;
  alive: boolean;
  /** AF-032: weapons apply statuses through this same engine — no per-drone reimplementation. */
  status: StatusEngine;
  /** AF-033: identity + behaviour source of truth — elite-adjusted view if applicable. */
  def: EnemyDef;
  runtime: EnemyRuntime;
  /** AF-034: elite-only numeric effects layered alongside def, not merged into AF-033's schema. */
  mutationEffects: MutationEffects;
  /** AF-034: Elite Codex key — the base def id, or a tier+mutation-set signature for a generated Elite. */
  codexId: string;
  eliteTier: string | null;
  eliteMutations: readonly string[];
  /** AF-046: Outlaw squad membership — null for every non-squad enemy. */
  squadId: string | null;
  /** AF-047: Machine network membership + assigned formation slot — null for every non-networked enemy. */
  networkId: string | null;
  networkOffsetX: number | null;
  networkOffsetY: number | null;
  /** AF-048: Crystal ecosystem membership — null for every non-ecosystem enemy. Deliberately no
   * formation-anchor fields: the ecosystem has no command unit for others to anchor on, so
   * "formation"-behaviour organisms fall back to AF-033's existing player-anchored default. */
  ecosystemId: string | null;
  /** AF-049: Void swarm membership — null for every non-swarm enemy. Same no-anchor rationale as AF-048. */
  swarmId: string | null;
  /** AF-050: Ancient Custodian site membership — null for every non-site enemy. */
  siteId: string | null;
  /** AF-051: Xenomorph Hive membership — null for every non-hive enemy. */
  hiveId: string | null;
  /** AF-052: Nomad Fleet membership — null for every non-fleet enemy. */
  fleetId: string | null;
  /** AF-053: Paragon Protocol membership — null for every non-protocol enemy. */
  protocolId: string | null;
  /** AF-054: Celestial Constellation membership — null for every non-constellation enemy. */
  constellationId: string | null;
  /** AF-055: Eclipsed group membership — null for every non-eclipsed enemy. */
  eclipsedId: string | null;
}

interface TestProjectile {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  ttlMs: number;
  live: boolean;
  // AF-032: fields ProjectileBehaviour.stepProjectile() needs, plus pierce bookkeeping it owns.
  originX: number;
  originY: number;
  elapsedMs: number;
  bouncesRemaining: number;
  reversed: boolean;
  behaviour: (typeof SANDBOX_WEAPONS)[number]["projectileBehaviour"];
  pierceRemaining: number;
  // AF-033: enemy-fired projectiles carry their own damage packet — they hit the
  // player, not other drones, so they can't read it from the player's build.
  hostile: boolean;
  damageBaseDamage: number;
  damageCritChance: number;
  damageCritMultiplier: number;
  damageSchool: DamageSchool;
  damageSourceKind: DamageSourceKind;
  statusOnHit: StatusOnHit | null;
}

interface DamagePopup {
  x: number;
  y: number;
  text: string;
  critical: boolean;
  ttlMs: number;
  live: boolean;
}

const projectilePool = new Pool<TestProjectile>({
  create: () => ({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    ttlMs: 0,
    live: false,
    originX: 0,
    originY: 0,
    elapsedMs: 0,
    bouncesRemaining: 0,
    reversed: false,
    behaviour: "straight",
    pierceRemaining: 0,
    hostile: false,
    damageBaseDamage: 0,
    damageCritChance: 0,
    damageCritMultiplier: 1,
    damageSchool: "physical",
    damageSourceKind: "direct",
    statusOnHit: null,
  }),
  reset: (p) => (p.live = false),
});
const popupPool = new Pool<DamagePopup>({
  create: () => ({ x: 0, y: 0, text: "", critical: false, ttlMs: 0, live: false }),
  reset: (p) => (p.live = false),
});

let drones: Drone[] = [];
let projectiles: TestProjectile[] = [];
let popups: DamagePopup[] = [];
let playerDefence: DefenceState | null = null;
/** AF-033: enemy status-on-hit applies here — bridges into AF-020 movement exactly as StatusEngine already documents. */
let playerStatus: StatusEngine | null = null;
let combatRng: Rng | null = null;
let droneCounter = 0;
let hitCount = 0;
let critCount = 0;

// ── Sandbox XP & upgrades (AF-022): kills drop gems, gems level you up,
// levels present real build choices. Placeholder upgrade content — the
// pool/curve/pickup framework underneath is the deliverable.
const sandboxBuild = {
  weaponBonus: 0,
  critBonus: 0,
  fireIntervalScale: 1,
  speedStacks: 0,
  magnetBonus: 0,
  researchWeaponBonus: 0, // AF-024 → AF-021 pipeline research stage
  researchLootBonus: 0, // AF-024 → AF-023 ladder shift
  equipmentWeaponBonus: 0, // AF-028 → AF-021 pipeline equipment stage
};

const SANDBOX_UPGRADES: UpgradeDefinition[] = [
  { id: "damage", category: "weaponUpgrade", name: "Focused Coils", description: "+15% weapon damage", weight: 10, maxStacks: 5 },
  { id: "firerate", category: "weaponUpgrade", name: "Rapid Cycler", description: "+14% fire rate", weight: 10, maxStacks: 5 },
  { id: "crit", category: "critical", name: "Precision Optics", description: "+5% critical chance", weight: 6, maxStacks: 4 },
  { id: "speed", category: "movement", name: "Tuned Thrusters", description: "+8% movement speed", weight: 6, maxStacks: 5 },
  { id: "barrier", category: "shield", name: "Emergency Barrier", description: "+20 barrier now", weight: 5, maxStacks: null },
  { id: "magnet", category: "resource", name: "Collection Field", description: "+1.5 magnet radius", weight: 4, maxStacks: 3 },
];

function playerPacket() {
  const commanderCritDamage = commanderRuntime?.bonuses.criticalDamage ?? 0;
  return {
    baseDamage: 9,
    kind: "direct",
    school: "energy",
    critChance: 0.15 + sandboxBuild.critBonus,
    critMultiplier: 2 + commanderCritDamage,
  } as const;
}

function applyUpgrade(id: string): void {
  switch (id) {
    case "damage":
      sandboxBuild.weaponBonus += 0.15;
      break;
    case "firerate":
      sandboxBuild.fireIntervalScale *= 0.86;
      break;
    case "crit":
      sandboxBuild.critBonus += 0.05;
      break;
    case "speed":
      sandboxBuild.speedStacks += 1;
      movement?.addModifier({
        id: "upgrade-speed",
        kind: "speedMultiplier",
        multiplier: 1 + 0.08 * sandboxBuild.speedStacks,
        durationMs: Number.MAX_SAFE_INTEGER,
      });
      break;
    case "barrier":
      playerDefence?.addBarrier(20);
      break;
    case "magnet":
      sandboxBuild.magnetBonus += 1.5;
      break;
  }
}

let xpSystem: XpSystem | null = null;
let xpPickups: XpPickups | null = null;
let upgradePool: UpgradePool | null = null;
let currentOffer: readonly UpgradeDefinition[] = [];

// ── Sandbox loot (AF-023): elites always drop, drones sometimes; beams on
// the field, pickups announced. Placeholder drop table — the generator,
// rarity ladder, and ground-loot policy underneath are the deliverable.
const SANDBOX_DROP_TABLE: DropTableEntry[] = [
  { baseItemId: "PROTO_CANNON", category: "weapon", weight: 10 },
  { baseItemId: "HULL_PLATING", category: "equipment", weight: 10 },
  { baseItemId: "STRANGE_RELIC", category: "relic", weight: 4 },
  { baseItemId: "SALVAGED_ALLOY", category: "craftingMaterial", weight: 10 },
  { baseItemId: "RESEARCH_CORE", category: "researchSample", weight: 6 },
];

interface LootNotice {
  text: string;
  colour: string;
  ttlMs: number;
}

let groundLoot: GroundLoot | null = null;
let lootRng: Rng | null = null;
let lootNotices: LootNotice[] = [];
let lootBankedCount = 0;
let lootCollectedCount = 0;

// ── Save Framework (AF-044): Autosave-status bookkeeping and Save Profiles
// sit above every existing SaveSlice without changing any of them. Settings
// are deliberately profile-independent (device-scoped), so they get their
// own slice constructed here, ahead of everything else.
const saveCoordinator = new SaveCoordinator();
const saveProfileManager = new SaveProfileManager(new LocalStorageAdapter());
const settingsSlice = new SaveSlice<SettingsData>({
  key: "settings",
  currentVersion: 1,
  migrations: {},
  defaultData: () => DEFAULT_SETTINGS,
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});
let settings: SettingsData = DEFAULT_SETTINGS;
// Cached synchronously for screen rendering — SaveProfileManager itself is async.
let activeProfileName = "—";
function persistSettings(): void {
  void settingsSlice.save(settings);
  saveCoordinator.recordSave("settings");
  audioMixer.syncFromSettings(settings.audio);
}
saveCoordinator.register({
  id: "settings",
  toSave: () => settings,
  loadSave: (data) => {
    settings = data;
  },
});

// ── Audio (AF-045): mixer seeded from AF-044's existing settings; no audio
// asset pipeline exists yet, so NullAudioBackend records intent rather than
// producing sound — a real backend implements the same three-method
// interface with zero changes here.
const audioMixer = AudioMixer.fromSettings(settings.audio);
const audioEngine: AudioEngine = createSandboxAudioEngine(audioMixer, new NullAudioBackend());

// ── Research (AF-024): permanent progression through a real save slice.
const researchSlice = new SaveSlice<ResearchSaveData>({
  key: "research",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ points: 0, unlocked: [], revealed: [], totalPointsEarned: 0 }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

// AF-081/082: the roster tree — AF-024's thirteen projects, AF-081's Lattice
// Attunement, and AF-082's four roster projects, through the unchanged engine.
const researchTree = new ResearchTree(ROSTER_RESEARCH_TREE, (node) => {
  bus.emit("ResearchUnlocked", { nodeId: node.id, category: node.category });
  // AF-088: Recovered Research (Scientific Archive) + Research (Expedition
  // Journal) both feed from the exact same real unlock event.
  scientificArchive.record("recoveredResearch", node.id, `Research unlocked: ${node.name}`);
  expeditionJournal.record("research", node.id, `Research unlocked: ${node.name}`);
});

function persistResearch(): void {
  void researchSlice.save(researchTree.toSave());
  saveCoordinator.recordSave("research");
}
saveCoordinator.register({ id: "research", toSave: () => researchTree.toSave(), loadSave: (data) => researchTree.loadSave(data) });

/** Research is never lost: points bank immediately on sample collection. */
function bankResearchSample(drop: LootDrop): void {
  const tierBonus = RARITY_LADDER.indexOf(drop.rarity);
  const amount = 3 + tierBonus;
  researchTree.addPoints(amount);
  bus.emit("ResearchPointsGained", { amount });
  if (tierBonus >= RARITY_LADDER.indexOf("epic")) {
    if (researchTree.reveal("ancient-conduit")) {
      lootNotices.push({ text: "HIDDEN DISCOVERY · ANCIENT CONDUIT", colour: "#9b5cff", ttlMs: 2400 });
    }
  }
  persistResearch();
}

// ── Crafting / Lightforge (AF-025): persistent materials, blueprints, hangar.
const craftingSlice = new SaveSlice<CraftingSaveData>({
  key: "crafting",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ materials: {}, blueprints: [...STARTING_BLUEPRINTS], hangar: [] }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const crafting = new CraftingSystem(
  SANDBOX_RECIPES,
  DEFAULT_CRAFTING_TUNING,
  (nodeId) => researchTree.isUnlocked(nodeId),
  (blueprintId) => bus.emit("BlueprintUnlocked", { blueprintId }),
);

function persistCrafting(): void {
  void craftingSlice.save(crafting.toSave());
  saveCoordinator.recordSave("crafting");
}
saveCoordinator.register({ id: "crafting", toSave: () => crafting.toSave(), loadSave: (data) => crafting.loadSave(data) });

// ── Achievements & Collections (AF-042): the one genuinely new save slice —
// scoped to exactly the two Collection categories AF-026 has no bucket for,
// plus the capped Discovery Log. Achievement completion itself persists for
// free through AF-026's existing meta.discover("achievements", id).
const collectionLedgerSlice = new SaveSlice<CollectionLedgerSaveData>({
  key: "collectionLedger",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ extraCollections: {}, discoveryLog: [] }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});
const collectionLedger = new CollectionLedger();
const achievementRuntime = new AchievementRuntime(SANDBOX_ACHIEVEMENTS);
const metaAchievementReader: AchievementProgressReader = {
  stat: (key) => meta.stat(key),
  collectionCount: (category) => meta.snapshot.collectionCounts[category] ?? 0,
  isCompleted: (id) => meta.hasDiscovered("achievements", id),
};

// ── Codex (AF-043): a pure read-only presentation layer — zero new unlock
// mechanism, zero new save slice. Section Completion persists through the
// exact same meta.discover("achievements", …) bucket AF-042 already uses.
const codexRuntime = new CodexRuntime([...SANDBOX_CODEX_ENTRIES, LYRA_VOSS_CODEX_ENTRY, KANE_VANGUARD_CODEX_ENTRY, RYKER_ENGINEER_CODEX_ENTRY, CAEL_WEAVER_CODEX_ENTRY, DRAKE_HUNTER_CODEX_ENTRY, SOL_RESONANT_CODEX_ENTRY, VALE_VOIDRUNNER_CODEX_ENTRY, ISKANDER_SWARMMASTER_CODEX_ENTRY, THORNE_STARFORGED_CODEX_ENTRY, VEX_CHRONOMANCER_CODEX_ENTRY, ASH_TEMPEST_CODEX_ENTRY, KORVEN_PHANTOM_CODEX_ENTRY, SYN_BIOFORGE_CODEX_ENTRY, SOLARI_PHOTON_CODEX_ENTRY, KAIN_SINGULARITY_CODEX_ENTRY, REYES_WARDEN_CODEX_ENTRY, ORION_STARLANCER_CODEX_ENTRY, VOLKOV_TITAN_CODEX_ENTRY, MYRR_ORACLE_CODEX_ENTRY, NOVA_ARCHITECT_CODEX_ENTRY, VEGA_ECHO_CODEX_ENTRY, RHEM_CATALYST_CODEX_ENTRY, ROSS_HORIZON_CODEX_ENTRY, SOLACE_DIPLOMAT_CODEX_ENTRY, ORIS_NANOFORGE_CODEX_ENTRY, DRAKE_SENTINEL_CODEX_ENTRY, HELIX_ALCHEMIST_CODEX_ENTRY, FEN_BEASTMASTER_CODEX_ENTRY, NOCTIS_VOIDWALKER_CODEX_ENTRY, AETHER_CELESTIAL_CODEX_ENTRY, PRIME_FOUNDER_CODEX_ENTRY]);
const codexReader: CodexUnlockReader = {
  hasDiscovered: (category, id) => meta.hasDiscovered(category, id),
  hasExtraDiscovered: (category, id) => collectionLedger.hasDiscovered(category, id),
};
// AF-087: the discovery-progression lattice rides on top of AF-043's
// unchanged binary unlock gate; the player journal is curated separately.
const codexDiscovery = new CodexDiscoveryRuntime();
const codexJournal = new CodexJournalRuntime();
// AF-088: the ecosystem layer — the 8-tier archive wraps AF-087's own
// discovery lattice by composition; the two permanent ledgers and the
// notebook extension are new, independent surfaces.
const codexArchive = new CodexArchiveRuntime(codexDiscovery);
const scientificArchive = new ScientificArchiveRuntime();
const expeditionJournal = new ExpeditionJournalRuntime();
const playerNotebook = new PlayerNotebookExtensionRuntime();

function persistCollectionLedger(): void {
  void collectionLedgerSlice.save(collectionLedger.toSave());
  saveCoordinator.recordSave("collectionLedger");
}
saveCoordinator.register({ id: "collectionLedger", toSave: () => collectionLedger.toSave(), loadSave: (data) => collectionLedger.loadSave(data) });

/** Crafting materials bank immediately on collection (nothing is wasted). */
function bankCraftingMaterial(drop: LootDrop): void {
  const tierIndex = RARITY_LADDER.indexOf(drop.rarity);
  crafting.addMaterial("commonMaterials", 2 + tierIndex);
  if (tierIndex >= RARITY_LADDER.indexOf("rare")) crafting.addMaterial("rareAlloys", 1);
  persistCrafting();
}

// ── Meta progression (AF-026): the permanent ledger, third save slice.
const metaSlice = new SaveSlice<MetaSaveData>({
  key: "meta",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({
    accountXp: 0,
    mastery: {},
    collections: {},
    statistics: {},
    completedChallenges: [],
    unlockedCosmetics: [],
  }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const meta = new MetaProgression(
  SANDBOX_CHALLENGES,
  (challenge) => {
    bus.emit("ChallengeCompleted", {
      challengeId: challenge.id,
      rewardKind: challenge.reward.kind,
      rewardId: challenge.reward.id,
    });
    lootNotices.push({ text: `CHALLENGE · ${challenge.name.toUpperCase()}`, colour: "#ffc652", ttlMs: 2400 });
  },
  (level) => bus.emit("AccountLevelUp", { level }),
);

// ── Galaxy (AF-038): the permanent overworld. Sector Stability/Exploration%
// persist through AF-026's existing meta save slice (namespaced statistic
// keys); the runtime's own position/event-timer state is session-local.
const galaxyRuntime = new GalaxyRuntime(SANDBOX_GALAXY, new Rng(Date.now()).fork("galaxy"), "sys-lucent-gate");

// ── Factions (AF-039): reputation persists through the same namespaced
// meta-statistic pattern AF-038 established; relationships/events are
// session-local runtime state, mirroring GalaxyRuntime's exact discipline.
const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(Date.now()).fork("faction"));
// AF-086: the Living Faction Ecosystem — civilisations grow, compete, and
// decline whether or not the player is present, through AF-039's real engine.
const civSim = new CivilisationSimulationRuntime(factionRuntime, new Rng(Date.now()).fork("civSim"));
let activeFactionMissionId: string | null = null;

// ── Galaxy Economy (AF-040): Credits persist through the same namespaced
// meta-statistic pattern AF-038/039 established (economy:credits); the
// runtime's own offer rotation/event timer are session-local, mirroring
// GalaxyRuntime/FactionRuntime's exact discipline.
const marketRuntime = new MarketRuntime(SANDBOX_GALAXY_ECONOMY, new Rng(Date.now()).fork("economy"));
const CREDITS_KEY = "economy:credits";
// AF-089: the Galactic Economy — colonies produce, consume, and trade
// whether or not the player is present, reading AF-086's real
// civilisation state directly and writing back only through its
// bounded feedPlayerImpact.
const galacticEconomy = new GalacticEconomyRuntime(civSim, new Rng(Date.now()).fork("galacticEconomy"));
// AF-090: the Civilisation Framework — named settlements at real galaxy
// systems, developing through a linear ladder toward Legendary Status;
// reads AF-086's civilisation state and AF-024's research tree, and
// delegates four of its eight investment actions to AF-089's own methods.
const civilisation = new CivilisationFrameworkRuntime(civSim, galacticEconomy, researchTree, new Rng(Date.now()).fork("civilisation"));

function awardCredits(amount: number): void {
  meta.recordStat(CREDITS_KEY, amount);
  persistMeta();
}

// ── Galaxy Events (AF-041): World State persists through the same
// namespaced meta-statistic pattern AF-038/039/040 established
// (worldState:<key>); the runtime's own event timer is session-local,
// mirroring every prior *Runtime's exact discipline.
const worldEventRuntime = new WorldEventRuntime(SANDBOX_WORLD_EVENTS, new Rng(Date.now()).fork("worldEvents"));
const respondedWorldEvents = new Set<string>();

function persistMeta(): void {
  void metaSlice.save(meta.toSave());
  saveCoordinator.recordSave("meta");
}
saveCoordinator.register({ id: "meta", toSave: () => meta.toSave(), loadSave: (data) => meta.loadSave(data) });

// The ledger listens; gameplay systems never know meta exists (AF-001 §7).
bus.on("EnemyKilled", ({ enemyId, elite, boss }) => {
  // AF-056: breathing room after Elite Battles and Boss Phases — pacing, not stats.
  if (elite) conductor?.openRecoveryWindow("eliteBattles");
  if (boss) conductor?.openRecoveryWindow("bossPhases");
  meta.recordStat("enemiesDestroyed");
  meta.addMasteryCounter("weapon:test-cannon", "kills");
  meta.addMasteryXp("weapon:test-cannon", elite ? 5 : 1);
  if (elite) {
    meta.addAccountXp(ACCOUNT_XP_AWARDS.eliteDefeated);
    awardCredits(CREDIT_AWARDS.eliteDefeated); // AF-040: Elite Enemies as a Resource Source.
  }
  // AF-034: Elite Codex discovery reuses AF-026's existing collections engine —
  // codexId is the base def id, or a tier+mutation-set signature for a generated Elite.
  const killedDrone = drones.find((d) => d.id === enemyId);
  meta.discover("enemies", killedDrone?.codexId ?? enemyId);
  if (!boss) audioEngine.play(elite ? "cue-elite-death" : "cue-enemy-death"); // AF-045.
  // AF-037: mission objective progress — the same EnemyKilled fact every prior module already reads.
  if (boss) missionRuntime?.recordProgress("missionBossDefeated");
  else {
    missionRuntime?.recordProgress("missionKills");
    if (elite) missionRuntime?.recordProgress("missionElitesKilled");
  }
});
bus.on("DamageDealt", ({ amount, critical }) => {
  meta.recordStat("damageDealt", amount);
  if (critical) {
    meta.addMasteryCounter("weapon:test-cannon", "criticalHits");
    audioEngine.play("cue-critical-hit"); // AF-045: Player Feedback.
  }
});
bus.on("PlayerDamaged", ({ amount }) => {
  conductor?.recordPlayerDamaged(amount); // AF-056: Adaptive Response's live damageTaken input
  meta.recordStat("damageTaken", amount);
  if (bossRuntime) bossFightDamageTaken = true; // AF-035: gates the "No Damage" mastery challenge.
  missionRuntime?.recordProgress("missionDamageTaken", amount); // AF-037: gates the No Damage optional objective.
});
bus.on("ShieldBroken", () => {
  audioEngine.play("cue-shield-break"); // AF-045: Player Feedback.
});
bus.on("CommanderLevelUp", () => {
  audioEngine.play("cue-level-up"); // AF-045: Player Feedback.
});
// AF-049: Void Distortion is one of AF-017's existing EnvironmentalEvent
// outcomes — reacting to the fact the Director already emits, no Director change.
bus.on("EnvironmentalEventTriggered", ({ eventType }) => {
  // AF-056: breathing room after Major Events — the window opens once the
  // event (including any faction entrance below) has landed.
  conductor?.openRecoveryWindow("majorEvents");
  if (eventType === "VoidDistortion") spawnVoidSwarmFromEvent();
  // AF-050: Ancient Signal is one of AF-017's existing EnvironmentalEvent outcomes.
  if (eventType === "AncientSignal") spawnAncientSiteFromEvent();
  // AF-053: Gravity Flux is one of AF-017's existing EnvironmentalEvent
  // outcomes — quantum distortion and gravity-affected weaponry fit it exactly.
  if (eventType === "GravityFlux") spawnProtocolFromEvent();
  // AF-054: Solar Flare is one of AF-017's existing EnvironmentalEvent
  // outcomes — a perfect thematic fit for a living-star formation's entrance.
  if (eventType === "SolarFlare") spawnConstellationFromEvent();
});
bus.on("LootDropped", ({ rarity }) => {
  if (rarity === "legendary" || rarity === "ancient" || rarity === "mythic" || rarity === "singularity") {
    audioEngine.play("cue-legendary-drop"); // AF-045: Player Feedback.
  }
});
// AF-035: the Boss spawns when the Director's existing MiniBoss phase begins — no Director change.
// AF-037: automatic RunPhase advancement replaces the placeholder manual "Advance Run Phase" button.
bus.on("DirectorPhaseChanged", ({ to }) => {
  if (to === "MiniBoss" && !bossRuntime) spawnBoss();
  if (to === "LightContact") advanceRunPhaseTo("EarlyExploration");
  else if (to === "Combat" || to === "HeavyCombat") advanceRunPhaseTo("EnemyEscalation");
  else if (to === "ElitePressure") advanceRunPhaseTo("EliteEncounters");
  else if (to === "EnvironmentalEvent") advanceRunPhaseTo("EnvironmentalEvents");
  else if (to === "MiniBoss") advanceRunPhaseTo("MiniBoss");
});
bus.on("LootCollected", ({ itemId, rarity }) => {
  meta.recordStat("itemsCollected");
  meta.discover("equipment", itemId);
  if (rarity === "legendary" || rarity === "ancient" || rarity === "mythic" || rarity === "singularity") {
    meta.recordStat("rareItemsFound");
    // AF-056: a Resource Discovery earns breathing room to enjoy it in.
    conductor?.openRecoveryWindow("resourceDiscoveries");
  }
});
bus.on("ResearchUnlocked", ({ nodeId }) => {
  meta.addAccountXp(ACCOUNT_XP_AWARDS.researchUnlocked);
  meta.discover("research", nodeId);
  persistMeta();
  awardCredits(CREDIT_AWARDS.researchUnlocked); // AF-040: Research as a Resource Source.
  audioEngine.play("cue-research-complete"); // AF-045.
});
bus.on("ItemCrafted", () => {
  audioEngine.play("cue-craft-success"); // AF-045.
});
bus.on("ChallengeCompleted", () => {
  audioEngine.play("cue-achievement"); // AF-045.
});
// AF-043: the "relics" collection bucket has existed since AF-026 with no
// producer until now — RelicAcquired already fires every time; nothing new.
bus.on("RelicAcquired", ({ relicId }) => {
  meta.discover("relics", relicId);
  persistMeta();
});
// AF-044: a Major Milestone Backup — a checksum-protected, cross-slice
// snapshot taken at a genuinely significant moment, not on every save.
let milestoneBackupCount = 0;
bus.on("AccountLevelUp", () => {
  void saveCoordinator.writeMilestoneBackup(new LocalStorageAdapter(), "milestone-backup").then(() => {
    milestoneBackupCount += 1;
  });
  audioEngine.play("cue-achievement"); // AF-045: Player Feedback.
});
bus.on("RunEnded", ({ result, playTimeMs }) => {
  audioEngine.play(result === "victory" ? "cue-mission-complete" : "cue-mission-failed"); // AF-045.
  meta.recordStat("runs");
  meta.recordStat(result === "victory" ? "victories" : "defeats");
  meta.recordStat("playTimeMs", playTimeMs);
  // AF-071: the placeholder mastery track becomes the commander's REAL
  // AF-026 track, and victories grant a talent point.
  meta.addMasteryXp(sandboxCommanderProfile.masteryTrackId, result === "victory" ? 20 : 8);
  if (result === "victory") commanderProgression.grantTalentPoints(1);
  roster.recordUse(sandboxCommander.id, result === "victory"); // AF-072: usage informs future balancing
  shipOutfitting.recordUse(); // AF-073: hull mastery accumulates per expedition
  fleet.recordMission(sandboxShip.id, result === "victory"); // AF-074: fleet statistics support long-term balancing
  if (weaponRuntime) weaponMastery.recordShots(weaponRuntime.snapshot.shotsFired); // AF-075: accuracy is derived from real fire
  arsenal.recordUse(sandboxWeapon.id); // AF-076: arsenal statistics support future balancing
  meta.addMasteryXp("ship:placeholder", result === "victory" ? 20 : 8);
  meta.addAccountXp(
    result === "victory" ? ACCOUNT_XP_AWARDS.missionCompleted : ACCOUNT_XP_AWARDS.missionFailed,
  );
  persistMeta();
  // AF-040: Mission Completion as a Resource Source — Credits on victory only.
  if (result === "victory") awardCredits(CREDIT_AWARDS.missionCompleted);
  // AF-039: a completed Faction Mission grants reputation (clamped through
  // AF-038's exact GalaxyRuntime.clampedDelta) plus its faction reward,
  // reusing whichever existing acquisition system that reward kind already has.
  if (activeFactionMissionId) {
    const factionMission = SANDBOX_FACTION_ROSTER.missions.find((m) => m.id === activeFactionMissionId);
    if (result === "victory" && factionMission) {
      const repKey = `faction:${factionMission.factionId}:reputation`;
      const repDelta = GalaxyRuntime.clampedDelta(meta.stat(repKey), factionMission.reputationReward, REPUTATION_MIN, REPUTATION_MAX);
      meta.recordStat(repKey, repDelta);
      persistMeta();
      awardCredits(CREDIT_AWARDS.factionMissionBonus); // AF-040: Faction Rewards as a Resource Source.
      // AF-043: FactionDef.loreId has existed since AF-039 with no producer
      // until now — completing that faction's mission is a real discovery.
      const missionFaction = factionRuntime.findFaction(factionMission.factionId);
      if (missionFaction) meta.discover("lore", missionFaction.loreId);
      const reward = factionMission.reward;
      if (reward.kind === "resource") {
        crafting.addMaterial(reward.id as Parameters<typeof crafting.addMaterial>[0], reward.amount);
        persistCrafting();
        if (collectionLedger.discover("resources", reward.id)) persistCollectionLedger(); // AF-042: Collections.
      } else if (reward.kind === "blueprint") {
        crafting.unlockBlueprint(reward.id);
        persistCrafting();
      } else if (reward.kind === "researchPoints") {
        researchTree.addPoints(reward.amount);
        persistResearch();
      } else if (reward.kind === "lore") {
        meta.discover("lore", reward.id);
        persistMeta();
      }
    }
    activeFactionMissionId = null;
  }
});

/** Unlocked research feeds live systems at run start (AF-024 §4). */
function researchEffects(): { weaponBonus: number; lootBonus: number; magnetBonus: number } {
  let weaponBonus = 0;
  let lootBonus = 0;
  let magnetBonus = 0;
  for (const node of researchTree.unlockedNodes) {
    if (!node.effect) continue;
    if (node.effect.kind === "weaponResearchBonus") weaponBonus += node.effect.value;
    else if (node.effect.kind === "lootResearchBonus") lootBonus += node.effect.value;
    else if (node.effect.kind === "magnetRadiusBonus") magnetBonus += node.effect.value;
  }
  return { weaponBonus, lootBonus, magnetBonus };
}

// ── Inventory (AF-027): fifth save slice — the command centre for items.
const inventorySlice = new SaveSlice<InventorySaveData>({
  key: "inventory",
  currentVersion: 1,
  migrations: {},
  defaultData: () => ({ items: [], loadouts: [], nextInstanceId: 1 }),
  storage: new LocalStorageAdapter(),
  onWarning: (message, detail) => log.warn("save", message, detail),
});

const inventory = new Inventory(DEFAULT_INVENTORY_TUNING);

function persistInventory(): void {
  void inventorySlice.save(inventory.toSave());
  saveCoordinator.recordSave("inventory");
}
saveCoordinator.register({ id: "inventory", toSave: () => inventory.toSave(), loadSave: (data) => inventory.loadSave(data) });

// ── Equipment (AF-028): fixed sandbox loadout demonstrates the aggregation/
// set-bonus engine feeding directly into existing combat/movement fields —
// no new stat pipeline. Real loadout editing arrives with the UI module.
const sandboxLoadoutSlots: Partial<Record<import("./game/equipment/equipmentData").EquipmentSlot, string>> = {
  primaryWeapon: "refit-cannon",
  equipment1: "barrier-plate",
  equipment2: "vanguard-thrusters",
  equipment3: "vanguard-core",
  equipment4: "cryo-manifold", // AF-079: the first active-bearing module, live in the loadout
  equipment5: "aegis-bastion-array", // AF-080: the Bastion manufacturer set, live —
  equipment6: "aegis-ward-projector", // — both pieces, so set detection has a subject
};
// AF-080: the full roster — AF-079's six plus the four roster modules, additively.
const sandboxEquipmentById = new Map(ROSTER_EQUIPMENT.map((item) => [item.id, item]));
// AF-079: the workshop collection — a monotone lattice mirroring AF-077's
// reliquary. Installed modules are crafted; the relay is discovered lore.
const workshop = new EquipmentCollectionRuntime(ROSTER_EQUIPMENT_PROFILES);
for (const itemId of Object.values(sandboxLoadoutSlots)) workshop.recordCrafted(itemId);
workshop.recordDiscovered("ancient-relay");

// ── Relics (AF-029): in-run discoveries, apply on pickup, reset per run.
let relicSystem = new RelicSystem(ROSTER_RELICS);
function newRelicSystem(): RelicSystem {
  return new RelicSystem(ROSTER_RELICS, (from, to) => {
    reliquary.recordEvolved(from.id); // AF-077: evolution is remembered forever
    reliquary.recordOwned(to.id);
    lootNotices.push({ text: `EVOLVED · ${from.name.toUpperCase()} → ${to.name.toUpperCase()}`, colour: "#ffc652", ttlMs: 2600 });
    bus.emit("RelicEvolved", { fromId: from.id, toId: to.id });
  });
}

// ── Commander (AF-030): governs the run via the four-hook signature.
const sandboxCommander = SANDBOX_COMMANDERS[0]!;
// AF-071: the framework profile wraps AF-030's def — talents, missions,
// mastery track, relationships. One progression runtime per commander,
// profile-scoped, fed a talent point per mission victory.
const sandboxCommanderProfile = FRAMEWORK_PROFILES.find((p) => p.commanderId === sandboxCommander.id)!;
const commanderProgression = new CommanderProgressionRuntime(sandboxCommanderProfile);
// AF-072: the launch roster — fourteen seats, the starting trio recruited,
// usage recorded per expedition so statistics can inform future balancing.
const roster = new RosterRuntime(FULL_RECRUITMENT_WITH_FOUNDER, STARTING_COMMANDER_IDS);
let commanderRuntime: CommanderRuntime | null = null;

// AF-130: the Commander Bond Network — one bond per unordered pair in the
// real roster, additive to and never modifying AF-071's dialogue-only
// CommanderRelationshipDef shape.
const bondNetwork = new BondNetworkRuntime(seedBondGraph(FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER), DUAL_ULTIMATES);

// AF-131: the Living Expedition Ship — the A.S.V. Afterlight, the player's
// home hub. Additive; never touches AF-031's combat Ship Framework.
const livingShip = new LivingShipRuntime(INITIAL_SHIP_UPGRADES);
const memorialGarden = new MemorialGardenLog();
const companionHabitat = new CompanionHabitatRuntime();
const shipCommanderRooms = commanderRoomsFor(FULL_ROSTER_WITH_FOUNDER);

// AF-132: the Living Galaxy — additive over the real AF-041/086/089/090
// simulation stack; adds the fields nothing else already tracks
// (pollution/wildlife/healthcare/crime/weather) plus news, discoveries,
// festivals, and a stateful player-reputation ledger.
const livingGalaxyEnvironment = new EnvironmentalRuntime(seedEnvironmentalStates(SANDBOX_GALAXY.systems));
const livingGalaxyReputation = new PlayerReputationLedger();
const livingGalaxyChronicle = new LivingGalaxyChronicle();
const livingGalaxyFestivals = new FestivalCalendar();
const livingGalaxyCrime = new CrimeLedger();

// AF-133: the Legacy Engine — additive over MetaProgression, the real
// GalacticHistoryRuntime, and AF-130's EmotionalMemoryLog (reused
// directly for Commander Memories rather than duplicated).
const legacyProgress = new LegacyProgressTracker();
const legacyHistory = new GalacticHistoryLog();
const legacyRecords = new GalacticRecordBoard();
const legacyChronicle = new PlayerChronicle();
const legacyJournal = new PlayerJournalRuntime();
const legacyGifts = new GiftLedger();
const legacyPhotos = new PhotoAlbum();

// AF-134: the Living Museum — additive over AF-130's BondNetworkRuntime
// (Commander Hall rooms expand with bond level, via its existing public
// API) and AF-133's GiftLedger (commander donations reuse it directly).
const museumRestoration = new RestorationLab();
const museumDonations = seedCommanderDonations(COMMANDER_DONATION_EXAMPLES);
const museumVisitors = new VisitorLog();
const museumQuality = new MuseumQualityTracker();
const museumTheater = new MuseumCollectionRegistry<(typeof THEATER_PROGRAM_KINDS)[number]>();
const museumLibrary = new MuseumCollectionRegistry<(typeof LIBRARY_BOOK_KINDS)[number]>();
const museumAudioArchive = new MuseumCollectionRegistry<(typeof AUDIO_ARCHIVE_KINDS)[number]>();

// AF-135: the Chronicle of Humanity — real composition over AF-130's
// EmotionalMemoryLog/BondNetworkRuntime and AF-133/134's trackers;
// EvolvingEntry is the one genuinely new primitive.
const chronicleCommanderMemories = new EmotionalMemoryLog();
const chroniclePlanets = new PlanetaryChronicle();
const chronicleOralHistory = new MuseumCollectionRegistry<(typeof ORAL_HISTORY_TOPICS)[number]>();
const chronicleBooks = new MuseumCollectionRegistry<(typeof PUBLISHER_VOICES)[number]>();
const chronicleWritableEntries = new MuseumCollectionRegistry<(typeof PLAYER_WRITABLE_ENTRY_KINDS)[number]>();

// AF-136: the Dynamic Story Engine — real new narrative tracking,
// composing with AF-133's LegacyProgressTracker and AF-135's
// EvolvingEntry/generateFinalChronicle rather than duplicating them.
const storyPillars = new StoryPillarTracker();
const storyDirector = new StoryDirector();
const commanderStorylines = new CommanderStorylineLog();
const storyBranches = new StoryBranchTracker();
const narrativeCallbacks = new NarrativeCallbackLog();

// AF-137: the Galactic Event Engine — a new scale-tier classification
// alongside AF-041's real WorldEventRuntime (type-based categories);
// the two never share state, per the spec's own instruction to compose
// with AF-130/132/133/136 rather than duplicate any of them.
const galacticEventLog = new GalacticEventLog();
const miningBoomChain = new EventChainRuntime(EVENT_CHAIN_EXAMPLE);
const eventEngineRng = new Rng(Date.now()).fork("event-engine");
{
  const openingTier = rollTier({ economyHealth: 0, averagePollution: 20, averageWildlife: 60, reputationTotal: 0, strongestBondLevel: 0, dominantPillarCount: 0 }, eventEngineRng.next());
  const example = EVENT_TIER_EXAMPLES[openingTier][0] ?? "A quiet day.";
  galacticEventLog.record(openingTier, example, 0);
}

// AF-138: the Civilisation Engine — this module's own genuinely new
// per-settlement attributes and 6-stage ladder, composed with AF-090's
// real CivilisationFrameworkRuntime rather than re-tracking what it
// already tracks (see civilisationEngineData.ts for the full,
// research-confirmed overlap map).
const civilisationAttributes = new CivilisationAttributeExtension();
const civilisationMegaprojects = new MegaprojectTracker();
const civilisationLandmarks = new MuseumCollectionRegistry<(typeof CIVILISATION_LANDMARK_KINDS)[number]>();
const civilisationImmigration = new ImmigrationLedger();
const civilisationSocialCalendar = new SocialEventCalendar();
const civilisationGovernment = new GovernmentPriorityTracker();
const civilisationPublicOpinion = new PublicOpinionTracker();
const civilisationCareers = new CareerPipeline();

// AF-139: the Evolution Engine — every class here composes with real
// locked state via plain ids/values (equipment families, settlement
// stages, research/talent/bond counts) rather than duplicating any of
// it; see evolutionEngineData.ts for the Great Projects naming-collision
// note (composes AF-090/AF-138's real rosters instead of a third one).
const equipmentEvolution = new EquipmentEvolutionTracker();
const architectureHistory = new HistoricalArchitectureLedger();
const speciesAdaptation = new SpeciesAdaptationRegistry();
const companionEvolution = new CompanionEvolutionTracker();
const languageEvolution = new LanguageEvolutionLog();
{
  const seedSettlement = civilisation.allSettlements[0];
  if (seedSettlement) architectureHistory.record(seedSettlement.profile.settlementId, architecturalStageFor(seedSettlement.developmentStage), civilisation.epochCount);
  languageEvolution.coin("first-light", "The light that never went out.", 0, "Explorers");
}

// AF-140: the Infinite Endgame Engine — composes AF-069's real
// EndgameRuntime.unlocked gate, AF-139's real greatProjectsProgressSummary,
// and AF-082's real infiniteResearchProjectFor directly rather than
// inventing parallel systems; see endgameEngineData.ts for the Legendary
// Projects/Colony Specialisation/Annual Events collision notes.
const frontierExpeditions = new FrontierExpeditionRegistry();
const commanderLegacy = new CommanderLegacyRuntime();
const expeditionCouncil = new ExpeditionCouncilTracker();
const megaDiscoveries = new MegaDiscoveryLog();
const galacticMuseumExpansion = new GalacticMuseumExpansionTracker();
const megacities = new MegacityLedger();
const emergentIndustries = new EmergentIndustryLedger();
const annualEndgameCalendar = new AnnualEndgameCalendar();
{
  const seedSettlement = civilisation.allSettlements[0];
  if (seedSettlement) {
    const population = civSim.stateFor(seedSettlement.profile.factionId)?.attributes.population ?? 0;
    if (megacityThresholdMet(population, seedSettlement.specialisation)) megacities.record(seedSettlement.profile.settlementId, civilisation.epochCount);
  }
  if (industryEmergenceEligible(galacticEconomy.snapshot.economicHealth)) emergentIndustries.emerge("Tourism", civilisation.epochCount);
}

// AF-141: the Galactic Creator Engine — composes AF-131's real
// MemorialGardenLog and AF-133's real PhotoAlbum rather than duplicating
// either; see galacticCreatorData.ts for the naming-adjacency note on
// Community Projects and the Expedition Flag id-namespace note.
const photoAlbums = new PhotoAlbumCurator();
const exhibitionCurator = new ExhibitionCuratorRuntime();
const expeditionFlags = new ExpeditionFlagRegistry();
const gardenDesigns = new CreationElementStudio<(typeof GARDEN_ELEMENT_KINDS)[number]>();
const observatoryDesigns = new CreationElementStudio<(typeof OBSERVATORY_ELEMENT_KINDS)[number]>();
const soundtrackPlaylists = new SoundtrackPlaylistRegistry();
const commanderContributions = new CommanderCreativeContributionLog();
const communityProjects = new CommunityProjectTracker();
const creationHeritage = new CreationHeritageLedger();
{
  const bondAverage = bondNetwork.snapshot().averageLevel;
  if (contributionEligible(bondAverage)) {
    for (const [commanderId, domain] of Object.entries(CREATOR_COMMANDER_DOMAINS)) {
      commanderContributions.contribute(commanderId, `Suggests a ${domain.toLowerCase()} touch for the next creation.`, 0);
    }
  }
  gardenDesigns.select("garden-verdance", "Trees");
  gardenDesigns.select("garden-verdance", "Water");
  soundtrackPlaylists.addTrack("Ship", "Drift Among the Ashes");
}

// AF-142: the Modular Universe Engine — a dependency-graph/cross-system
// registry for whole MODULES (a different granularity than AF-070's
// real per-pack LiveOpsRegistry, which this composes with rather than
// duplicates for Save Compatibility/Live Event Support — see
// moduleUniverseData.ts for the full research findings).
const moduleUniverse = new ModuleRegistry();
const contentDiscovery = new ContentDiscoveryFeed();
moduleUniverse.register({
  id: "expansion-ocean-worlds",
  name: "Ocean Worlds",
  category: "Planets",
  dependencies: [],
  gameplayTags: ["evolving"],
  narrativeTags: ["hope"],
  factionRelationships: ["humanAlliance"],
  commanderInteractions: ["voss-pathfinder"],
  museumCompatible: true,
  chronicleSupport: true,
  legacySupport: true,
  accessibilityMetadata: ["highContrast", "narrationReady"],
  origin: "core",
});
contentDiscovery.discover("Recovered archives", "A sealed data-vault surfaces beneath Verdance's tide pools.", 0);

// AF-143: the Atlas Development Framework — a dedicated research pass
// found its "Design Score >9.5/10" gate is, almost verbatim, this
// project's own real standing process (docs/FOUNDATION_LOCK.md §5);
// commanderCompletenessFor/worldCompletenessFor are the genuinely new
// pieces, composing real signals rather than importing AF-130/131/134/135
// directly (see atlasFrameworkData.ts for the full research findings).
const designScoreCard = new DesignScoreCard();
for (const category of DESIGN_SCORE_CATEGORIES) designScoreCard.score(category, 9.6);
const postLaunchSupport = new PostLaunchSupportTracker();
const knowledgeBase = new KnowledgeBaseRegistry();
knowledgeBase.contribute("Engineering patterns", "Decoupled composition", "Pass plain signal values instead of importing modules directly — AF-137's tierWeightsFor, reused through AF-143.");
postLaunchSupport.record("Performance", "60fps sustained across the sandbox mission.", 0);

// AF-144: the Afterlight Operating System — reuses AF-001's real,
// generic EventBus (System Bus) and AF-133's real NpcMemoryLog (Memory
// Manager) directly rather than building competing classes; the rest
// (World State/Simulation Clock/Priority Engine/Decision Router/
// Prediction Engine/Performance Orchestrator/Recovery System/Live
// Telemetry) are confirmed genuinely new (see aosData.ts).
const aosBus = new EventBus<AosEventMap>();
const aosTelemetry = new TelemetryCollector();
for (const kind of ["PlanetRestored", "CommanderRecruited", "ResearchCompleted"] as const) {
  aosBus.on(kind, () => aosTelemetry.record(kind));
}
const aosWorldState = new WorldStateStore<{ settlementCount: number; averagePopulation: number }>();
const aosClocks = new SimulationClockRegistry();
const aosPriority = new PriorityEngine();
aosPriority.register("player", "High");
aosPriority.register("nearby-colonies", "Medium");
aosPriority.register("remote-galaxy-sim", "Low");
const aosDecisionRouter = new DecisionRouter();
const aosPrediction = new PredictionEngine();
const aosPerformanceBudget = new PerformanceBudgetTracker();
const aosRecoveryLog = new RecoveryLog();
aosBus.emit("PlanetRestored", { planetId: SEEDED_SETTLEMENTS[0]!.settlementId });
aosWorldState.setCurrent({ settlementCount: civilisation.allSettlements.length, averagePopulation: 0 }, 0);
aosRecoveryLog.record("Save migration", "Legacy save slice upgraded to the current schema on load.", 0);

// AF-146: the Afterlight Design Constitution — a new, separate
// in-universe charter, never modifying or superseding the project's
// real docs/CONSTITUTION.md; see designConstitutionData.ts for the
// full relationship notes (the real Constitution's own gates,
// AF-136's real StoryPillarTracker, and the AF-145 numbering gap).
const featureCompliance = new FeatureComplianceRegistry();
const pillarReinforcement = new PillarReinforcementLedger();
featureCompliance.evaluate(
  "expansion-ocean-worlds",
  Object.fromEntries(CONTENT_TEST_QUESTIONS.map((q) => [q, true])) as Record<(typeof CONTENT_TEST_QUESTIONS)[number], boolean>,
  new Set(EXPANSION_TEST_REQUIREMENTS),
);
pillarReinforcement.reinforce("Wonder", "expansion-ocean-worlds");
pillarReinforcement.reinforce("Discovery", "expansion-ocean-worlds");

// AF-145: the Atlas Core — sent as a follow-up filling the numbering
// gap AF-146 identified; its own third, separate in-universe charter,
// never modifying the real docs/CONSTITUTION.md or AF-146's real data
// (see atlasCoreData.ts for the full relationship notes).
const atlasCompliance = new AtlasCoreComplianceRegistry();
const atlasPrincipleReinforcement = new AtlasPrincipleReinforcementLedger();
atlasCompliance.evaluate("expansion-ocean-worlds", new Set(DESIGN_VALIDATION_QUESTIONS), new Set(["hope-over-despair", "discovery-over-grinding"]));
atlasPrincipleReinforcement.reinforce("hope-over-despair", "expansion-ocean-worlds");
atlasPrincipleReinforcement.reinforce("discovery-over-grinding", "expansion-ocean-worlds");

// AF-147: the Afterlight Franchise Bible — explicitly not a gameplay
// system per its own text; CanonAuthorityResolver/eraFor are the
// genuinely new mechanics (a canon-tier conflict resolver and a named
// timeline), confirmed absent anywhere else in the codebase; see
// franchiseBibleData.ts for the full overlap notes against the real
// docs/CONSTITUTION.md and AF-145/146's charters.
const canonLedger = new CanonRecordLedger();
const canonResolver = new CanonAuthorityResolver();
const franchiseCompliance = new FranchiseComplianceRegistry();
canonLedger.record({ sourceId: "afterlight-1", tier: "Main Games", subject: "first-expedition", claim: "The First Expedition departed from Earth orbit." });
canonLedger.record({ sourceId: "companion-book-1", tier: "Official Companion Books", subject: "first-expedition", claim: "The First Expedition carried twelve founding commanders." });
franchiseCompliance.evaluate("expansion-ocean-worlds", new Set(FRANCHISE_TEST_QUESTIONS), new Set(["Hope", "Discovery", "Legacy"]));

// AF-148: the Atlas Canon Engine — composes AF-133's real
// GalacticHistoryLog (via CanonEventLedger's optional forward) and
// AF-135's real EvolvingEntry/AuthorVoice/PlanetaryChronicle directly
// rather than duplicating any of them; KnowledgeStateTracker,
// CommanderContinuityLedger, ArtifactAuthenticityRegistry, and the
// Timeline Protection gate are the confirmed genuinely new pieces (see
// canonEngineData.ts for the full research findings).
const canonEvents = new CanonEventLedger(legacyHistory);
const knowledgeStates = new KnowledgeStateTracker();
const commanderContinuity = new CommanderContinuityLedger();
const artifactAuthenticity = new ArtifactAuthenticityRegistry();
{
  const seedSettlementId = SEEDED_SETTLEMENTS[0]!.settlementId;
  canonEvents.record(
    { id: "event-first-contact", date: 12, participants: [sandboxCommander.id], planetId: seedSettlementId, galaxyRegion: "core", commanderIds: [sandboxCommander.id], witnesses: [], evidence: ["recovered-beacon-log"], museumReferences: [], chronicleReferences: [], relationshipImpact: null, futureCallbacks: [] },
    { title: "First Contact", epoch: 12, planetId: seedSettlementId, commanderIds: [sandboxCommander.id], description: "Humanity's first confirmed contact with precursor technology.", hasPhoto: false, hasDialogue: false, hasNewsCoverage: true, hasMuseumEntry: false },
  );
  knowledgeStates.setObjectiveReality("event-first-contact", "The beacon was ancient precursor technology.");
  knowledgeStates.revealHistoricalUnderstanding("event-first-contact", "Scholars believe it predates recorded history.", 5, "Scientists");
  knowledgeStates.setPublicKnowledge("event-first-contact", "People say it's an alien artifact.");
  commanderContinuity.recordFact(sandboxCommander.id, "Led the First Contact expedition.", 12);
  artifactAuthenticity.register({ artifactId: "artifact-beacon-fragment", provenance: `Recovered from ${seedSettlementId}.`, ownershipChain: ["First Expedition"], restorationHistory: ["Initial cleaning"], scientificAnalysis: "Pre-Collapse alloy signature.", museumLocation: null, authenticityConfidence: 40, publicInterpretation: "Believed to be precursor technology." });
  recordPlanetContinuityFact(chroniclePlanets, seedSettlementId, "Discovery", "First surveyed during the Atlas Initiative.", 10, "Explorers");
}

// AF-149: the Atlas Protocol — execution workflow, distinct from
// AF-145's philosophy. FeatureLifecycleTracker/AtlasScoreCard/
// IterationCycleTracker are the genuinely new pieces (see
// atlasProtocolData.ts for the full overlap notes against AF-094/095/
//097's real pipelines and AF-143's real DesignScoreCard).
const featureLifecycle = new FeatureLifecycleTracker();
const atlasScoreCard = new AtlasScoreCard();
const iterationCycles = new IterationCycleTracker();
featureLifecycle.register("expansion-ocean-worlds", 0);
featureLifecycle.advance("expansion-ocean-worlds", 1);
for (const category of ATLAS_SCORE_CATEGORIES) atlasScoreCard.score(category, 9.7);
iterationCycles.recordCycle("expansion-ocean-worlds", 0);
iterationCycles.recordCycle("expansion-ocean-worlds", 5);

// AF-150: the Afterlight Universe Master Index — a meta-registry over
// individual game objects, a different granularity than AF-142's real
// ModuleRegistry (whole modules); MasterIndexRegistry reuses AF-142's
// real adjacency-list dependency-graph algorithm rather than
// regressing to the slower approach that bug once was (see
// masterIndexData.ts for the full overlap notes).
const masterIndex = new MasterIndexRegistry();
const relationshipGraph = new RelationshipGraph();
const dependencyMap = new DependencyMap();
const versionHistory = new VersionHistoryLedger();
const qualityTracker = new QualityTracker();
{
  const indexId = `commander-${sandboxCommander.id}`;
  masterIndex.register({
    id: indexId,
    category: "Commanders",
    moduleOrigin: "AF-030",
    creationEpoch: 0,
    canonStatus: "Core Timeline",
    dependencies: [],
    relatedSystems: ["bond-network", "living-ship"],
    museumLinks: [],
    chronicleLinks: [],
    expansionCompatibility: ["AF-141", "AF-148"],
  });
  relationshipGraph.link(indexId, "Related Species", "species-wolf");
  dependencyMap.record(indexId, "Optional systems", "galactic-creator-engine");
  versionHistory.recordChange(indexId, "session-dev", "Registered in the Master Index.", ["indexing"], 0);
  qualityTracker.setScore(indexId, "Accessibility score", 9);
  qualityTracker.setScore(indexId, "Narrative score", 9.5);
}

// ── Ship (AF-031): the ship IS the movement profile + defence seed + energy.
const sandboxShip = SANDBOX_SHIPS[0]!;
// AF-073: the framework profile wraps AF-031's def — modules, mastery,
// identity, ascension. One outfitting runtime for the active hull.
const sandboxShipProfile = SHIP_PROFILES.find((p) => p.shipId === sandboxShip.id)!;
const shipOutfitting = new ShipOutfittingRuntime(sandboxShipProfile, SANDBOX_SHIP_MODULES);
// AF-074: the launch fleet — ten berths, the Wayfarer collected, missions
// recorded per hull so statistics support long-term balancing.
const fleet = new ShipCollectionRuntime(FLEET_ENTRIES, STARTING_SHIP_IDS);
const sandboxFleetEntry = FLEET_ENTRIES.find((e) => e.shipId === sandboxShip.id)!;
let shipRuntime: ShipRuntime | null = null;

// ── Weapon (AF-032): fires through the same DamagePipeline "weapon" stage
// and StatusEngine every prior module already reserved — no new plumbing.
const sandboxWeapon = SANDBOX_WEAPONS[0]!;
// AF-075: the framework profile wraps AF-032's def — element, mastery,
// unique mechanic. One mastery ledger for the equipped weapon.
const sandboxWeaponProfile = WEAPON_PROFILES.find((p) => p.weaponId === sandboxWeapon.id)!;
const weaponMastery = new WeaponMasteryRuntime(sandboxWeaponProfile);
// AF-076: the launch arsenal — ten weapons, the Coil Ripper collected,
// uses recorded per expedition so statistics support future balancing.
const arsenal = new WeaponCollectionRuntime(ARSENAL_ENTRIES, STARTING_WEAPON_IDS);
// AF-077: the reliquary — a monotone collection lattice fed by real acquisitions.
const reliquary = new RelicCollectionRuntime(ROSTER_RELIC_PROFILES);
// AF-078: the drop pool and set detection ride the FULL roster.
const sandboxArsenalEntry = ARSENAL_ENTRIES.find((e) => e.weaponId === sandboxWeapon.id)!;
let weaponRuntime: WeaponRuntime | null = null;

// ── Boss (AF-035): reuses DefenceState for hull/shield/armour and
// EnemyRuntime for attack telegraph/cooldown gating — spawned when the
// Director's existing MiniBoss phase begins.
const sandboxBoss = SANDBOX_BOSSES[0]!;
let bossRuntime: BossRuntime | null = null;
let bossMotion = { x: 0, y: 0, elapsedMs: 0, strafeDirection: 1 as 1 | -1, phase: "hidden" as "hidden" | "active" };
let bossIntroRemainingMs = 0;
let bossRewardsGranted = false;
let bossFightDamageTaken = false;
// AF-057: the Boss Director decorates the locked AF-035 runtime — run-scoped.
let bossDirector: BossDirectorRuntime | null = null;

// AF-068: the campaign spans the whole profile, not one run — module-scoped,
// fed by mission victories, system arrivals, and boss defeats. Story beats
// drain through the AF-055/057 consume seam at a paced cadence: gameplay
// never pauses for the story.
const campaign = new CampaignRuntime(SANDBOX_CAMPAIGN);
let lastCampaignBeat: string | null = null;
let campaignBeatClockMs = 0;
const CAMPAIGN_BEAT_CADENCE_MS = 1500;

// AF-069: the endgame begins after the main campaign — constructed locked,
// unlocked the moment AF-068's ladder completes, fed by the same real play.
const endgame = new EndgameRuntime(SANDBOX_ASCENSIONS);

// AF-070: the live-ops registry — the core game registers as pack zero so the
// no-replacement gate protects every shipped id; season one layers on top.
const liveOps = new LiveOpsRegistry();
liveOps.registerPack(CORE_GAME_PACK);
liveOps.registerPack(SEASON_ONE_PACK);
liveOps.beginSeason(SEASON_ONE);

function feedCampaignProgress(counterKey: string): void {
  campaign.recordProgress(counterKey);
  if (campaign.isComplete && !endgame.isUnlocked) endgame.notifyCampaignComplete();
  if (endgame.isUnlocked) endgame.recordMilestone();
}
let lastBossPhaseIndex = 0;
let bossFightElapsedMs = 0;
const BOSS_HAZARD_BASE_RADIUS = 3;
const bossHazardZone: HazardZoneDef = {
  id: "vault-collapse",
  x: 0,
  y: 0,
  radius: 3,
  tickIntervalMs: 900,
  damagePerTick: 6,
  statusOnTick: { kind: "corruption", strength: 3, durationMs: 1800 },
};
let bossHazardState: HazardZoneState = { tickClockMs: 0 };

// ── Biome (AF-036): weather rotation, hazard ticking, weighted Biome
// Events, and pass-through feeds into AF-017/021/023/028's existing hooks.
const sandboxBiome = SANDBOX_BIOMES[0]!;
// AF-058: AF-038's StarSystemDef.biomeId gets its first consumer — the run's
// biome follows the galaxy. The registry is additive; the sandbox biome is
// the fallback for any system whose biomeId has no authored def yet.
const BIOME_REGISTRY: readonly BiomeDef[] = [...SANDBOX_BIOMES, HUMAN_FRONTIER_BIOME, CRYSTAL_EXPANSE_BIOME, MACHINE_EXPANSE_BIOME, VOID_EXPANSE_BIOME, ANCIENT_CORE_BIOME, SOLAR_WASTES_BIOME, FROZEN_REACH_BIOME, DERELICT_EXPANSE_BIOME, LIVING_ECOSPHERES_BIOME, SINGULARITY_ZONE_BIOME];
let activeBiome: BiomeDef = sandboxBiome;
let biomeRuntime: BiomeRuntime | null = null;

// ── Mission (AF-037): deterministic modifier rolling, run-scoped objective
// progress, and modifier-derived feeds into AF-017/023's reserved hooks.
// AF-083: the expedition roster — selectable in Mission Selection; the
// sandbox template heads the array unchanged.
let selectedMissionTemplate = FRAMEWORK_MISSIONS[0]!;
// AF-084: the expedition log — permanent, append-only personal history,
// fed at the endRun seam; defeats remembered as honestly as victories.
const expeditionLog = new ExpeditionLogRuntime();
let missionRuntime: MissionRuntime | null = null;
let extractionRemainingMs = 0;

function equipmentEffects() {
  const validation = validateLoadout(sandboxLoadoutSlots, sandboxEquipmentById);
  if (!validation.ok) {
    log.warn("equipment", "sandbox loadout failed validation", validation);
    return aggregateLoadout({}, sandboxEquipmentById, ROSTER_EQUIPMENT_SETS);
  }
  return aggregateLoadout(sandboxLoadoutSlots, sandboxEquipmentById, ROSTER_EQUIPMENT_SETS);
}

function dropLoot(x: number, y: number): void {
  if (!lootRng || !groundLoot || !xpSystem || !session) return;
  const drop = generateDrop(
    SANDBOX_DROP_TABLE,
    {
      itemLevel: xpSystem.snapshot.level,
      difficulty: 1,
      ascension: session.ascension,
      mutatorBonus: missionRuntime?.lootMutatorBonus ?? 0,
      researchBonus: sandboxBuild.researchLootBonus,
      // AF-036: Resource Distribution feeds AF-023's own reserved-but-unused hook.
      smartLoot: biomeRuntime ? { categoryWeights: biomeRuntime.resourceWeights } : undefined,
    },
    DEFAULT_LOOT_TUNING,
    lootRng,
  );
  groundLoot.place(drop, x, y);
  bus.emit("LootDropped", { itemId: drop.baseItemId, rarity: drop.rarity, category: drop.category, seed: drop.seed });
}

/** AF-033/035: shared hostile-projectile spawn path — enemy ranged attacks and Boss attacks both use it. */
function fireHostileProjectiles(
  originX: number,
  originY: number,
  weapon: (typeof SANDBOX_WEAPONS)[number],
  baseAngle: number,
  damageMultiplier: number,
  statusOverride: StatusOnHit | null,
): void {
  const shotAngles = computeShotAngles(weapon.firePattern, weapon.projectilesPerShot, baseAngle);
  for (const shotAngle of shotAngles) {
    const projectile = projectilePool.acquire();
    projectile.x = originX;
    projectile.y = originY;
    projectile.originX = originX;
    projectile.originY = originY;
    projectile.velocityX = Math.cos(shotAngle) * weapon.projectileSpeed;
    projectile.velocityY = Math.sin(shotAngle) * weapon.projectileSpeed;
    projectile.ttlMs = (weapon.range / weapon.projectileSpeed) * 1000 + 200;
    projectile.elapsedMs = 0;
    projectile.bouncesRemaining = 1;
    projectile.reversed = false;
    projectile.behaviour = weapon.projectileBehaviour;
    projectile.pierceRemaining = weapon.pierceCount;
    projectile.hostile = true;
    projectile.damageBaseDamage = weapon.baseDamage * damageMultiplier;
    projectile.damageCritChance = weapon.critChance;
    projectile.damageCritMultiplier = weapon.critMultiplier;
    projectile.damageSchool = weapon.damageSchool;
    projectile.damageSourceKind = weapon.damageSourceKind;
    projectile.statusOnHit = statusOverride ?? weapon.statusOnHit;
    projectile.live = true;
    projectiles.push(projectile);
  }
}

/** AF-033/034: shared spawn path — normal wave spawning and death-triggered Spawn Events both use it.
 * Returns the spawned drone's id so AF-046 squads can enrol their members. */
function spawnEnemyInstance(baseDef: EnemyDef, x: number, y: number, elite: boolean): string {
  let def = baseDef;
  let mutationEffects: MutationEffects = EMPTY_MUTATION_EFFECTS;
  let codexId = baseDef.id;
  let eliteTier: string | null = null;
  let eliteMutations: readonly string[] = [];
  if (elite && combatRng) {
    const tier = combatRng.pick(ELITE_TIERS);
    const eliteInstance = generateElite(baseDef, tier, combatRng);
    def = eliteInstance.def;
    mutationEffects = eliteInstance.mutationEffects;
    codexId = eliteInstance.id;
    eliteTier = eliteInstance.tier;
    eliteMutations = eliteInstance.mutations;
  }
  // AF-036: the biome's enemy buff is the same EquipmentBonus shape every passive uses —
  // only shieldCapacity is mechanically live today (folded into starting shield at spawn),
  // the same proportional scope every prior module's buff vocabulary shipped with.
  if (biomeRuntime?.enemyBuff?.kind === "shieldCapacity") {
    def = { ...def, shield: def.shield + biomeRuntime.enemyBuff.value };
  }
  droneCounter += 1;
  const droneId = `drone-${droneCounter}`;
  const status = new StatusEngine({
    onTickDamage: (_kind, amount) => {
      const target = drones.find((d) => d.id === droneId);
      if (target) target.hull -= amount;
    },
  });
  // AF-036: enemies native to this biome ignore its own hazards — reuses setImmunity exactly.
  for (const kind of biomeRuntime?.hazardImmunities ?? []) status.setImmunity(kind, true);
  drones.push({
    id: droneId,
    x,
    y,
    elapsedMs: 0,
    strafeDirection: 1,
    phase: "hidden",
    hull: def.hull,
    maxHull: def.hull,
    elite,
    alive: true,
    status,
    def,
    runtime: new EnemyRuntime(def),
    mutationEffects,
    codexId,
    eliteTier,
    eliteMutations,
    squadId: null,
    networkId: null,
    networkOffsetX: null,
    networkOffsetY: null,
    ecosystemId: null,
    swarmId: null,
    siteId: null,
    hiveId: null,
    fleetId: null,
    protocolId: null,
    constellationId: null,
    eclipsedId: null,
  });
  return droneId;
}

// ── AF-046: Human Outlaws — squad state and mines are run-scoped, like every
// other combat structure in this file. Mines reuse AF-035's exact hazard engine.
let outlawSquads: OutlawSquadRuntime[] = [];
let outlawMines: Array<{ zone: HazardZoneDef; state: HazardZoneState; ttlMs: number }> = [];
let outlawMineDropClockMs = 0;
let outlawMineCounter = 0;
let outlawSquadCounter = 0;

function squadOf(drone: Drone): OutlawSquadRuntime | null {
  if (!drone.squadId) return null;
  return outlawSquads.find((s) => s.squadId === drone.squadId) ?? null;
}

/** An Outlaw ambush: an AF-034 Elite Captain plus four members, enrolled in
 * one squad. Every unit spawns through the existing shared spawn path. */
function spawnOutlawSquad(anchorX: number, anchorY: number): void {
  if (!combatRng) return;
  outlawSquadCounter += 1;
  const squadId = `outlaw-squad-${outlawSquadCounter}`;
  const captainDef = OUTLAW_ENEMIES.find((d) => d.id === "outlaw-captain")!;
  const memberDefs = OUTLAW_ENEMIES.filter((d) => d.id !== "outlaw-captain");
  const captainDroneId = spawnEnemyInstance(captainDef, anchorX, anchorY, true); // Elite Captain — AF-034's pipeline, unchanged
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const memberDroneIds = memberDefs.map((def, index) =>
    spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false),
  );
  const squad = new OutlawSquadRuntime(squadId, captainDroneId, memberDroneIds);
  outlawSquads.push(squad);
  for (const drone of drones) {
    if (drone.id === captainDroneId || memberDroneIds.includes(drone.id)) drone.squadId = squadId;
  }
  const callsign = combatRng.pick(OUTLAW_CALLSIGNS);
  lootNotices.push({ text: `OUTLAW AMBUSH — CAPT. "${callsign}"`, colour: "#ff8c1a", ttlMs: 3000 });
}

// ── AF-047: Machine Collective — networks are run-scoped like squads. Where a
// broken Outlaw squad scatters (fear), a broken machine network degrades (logic).
let machineNetworks: MachineNetworkRuntime[] = [];
let machineNetworkCounter = 0;

function networkOf(drone: Drone): MachineNetworkRuntime | null {
  if (!drone.networkId) return null;
  return machineNetworks.find((n) => n.networkId === drone.networkId) ?? null;
}

/** A Machine reinforcement network: an AF-034 Elite Command Core plus five
 * members, all through the existing shared spawn path. */
function spawnMachineNetwork(anchorX: number, anchorY: number): void {
  machineNetworkCounter += 1;
  const networkId = `machine-network-${machineNetworkCounter}`;
  const coreDef = MACHINE_ENEMIES.find((d) => d.id === "machine-command-core")!;
  const memberDefs = MACHINE_ENEMIES.filter((d) => d.id !== "machine-command-core");
  const coreDroneId = spawnEnemyInstance(coreDef, anchorX, anchorY, true); // Elite Command Core — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, different doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  let shieldGeneratorDroneId: string | null = null;
  let repairDroneId: string | null = null;
  let constructorDroneId: string | null = null;
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "machine-shield-generator") shieldGeneratorDroneId = id;
    if (def.id === "machine-repair-drone") repairDroneId = id;
    if (def.id === "machine-swarm-constructor") constructorDroneId = id;
    return id;
  });
  machineNetworks.push(new MachineNetworkRuntime(networkId, coreDroneId, memberDroneIds, shieldGeneratorDroneId, repairDroneId, constructorDroneId));
  for (const drone of drones) {
    if (drone.id === coreDroneId) drone.networkId = networkId;
    const memberIndex = memberDroneIds.indexOf(drone.id);
    if (memberIndex >= 0) {
      drone.networkId = networkId;
      drone.networkOffsetX = offsets[memberIndex]!.x;
      drone.networkOffsetY = offsets[memberIndex]!.y;
    }
  }
  lootNotices.push({ text: "MACHINE NETWORK ONLINE — COMMAND CORE DETECTED", colour: "#4d7cff", ttlMs: 3000 });
}

// ── AF-048: Crystal Ascendancy — ecosystems are run-scoped like squads and
// networks. Where a broken squad scatters and a broken network degrades in
// steps, a broken ecosystem WEAKENS CONTINUOUSLY: no state machine, just
// resonance strength recomputed from the living node count on every kill.
let crystalEcosystems: CrystalResonanceRuntime[] = [];
let crystalEcosystemCounter = 0;
let crystalGrowths: Array<{ zone: HazardZoneDef; state: HazardZoneState }> = [];
let crystalGrowthCounter = 0;
const crystalSeederClocksMs = new Map<string, number>();

function ecosystemOf(drone: Drone): CrystalResonanceRuntime | null {
  if (!drone.ecosystemId) return null;
  return crystalEcosystems.find((e) => e.ecosystemId === drone.ecosystemId) ?? null;
}

/** A Crystal ecosystem: an AF-034 Elite Titan plus its five supporting
 * organisms, all through the existing shared spawn path. */
function spawnCrystalEcosystem(anchorX: number, anchorY: number): void {
  crystalEcosystemCounter += 1;
  const ecosystemId = `crystal-ecosystem-${crystalEcosystemCounter}`;
  const titanDef = CRYSTAL_ENEMIES.find((d) => d.id === "crystal-titan")!;
  const memberDefs = CRYSTAL_ENEMIES.filter((d) => d.id !== "crystal-titan");
  const titanDroneId = spawnEnemyInstance(titanDef, anchorX, anchorY, true); // Elite Titan — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, third doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const nodeIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "crystal-resonance-node") nodeIds.push(id);
    return id;
  });
  crystalEcosystems.push(new CrystalResonanceRuntime(ecosystemId, [titanDroneId, ...memberDroneIds], nodeIds));
  for (const drone of drones) {
    if (drone.id === titanDroneId || memberDroneIds.includes(drone.id)) drone.ecosystemId = ecosystemId;
  }
  lootNotices.push({ text: "CRYSTAL ECOSYSTEM DETECTED — RESONANCE RISING", colour: "#9b5cff", ttlMs: 3000 });
}

// ── AF-049: Void Swarm — the fourth doctrine, and the first that is not a
// state machine or a snapshot: corruption is TIME-VARYING, climbing for as
// long as a Beacon survives and only falling once one is destroyed or the
// swarm is fully contained. Swarms are run-scoped like every other structure.
let voidSwarms: VoidCorruptionRuntime[] = [];
let voidSwarmCounter = 0;
let voidZones: Array<{ zone: HazardZoneDef; state: HazardZoneState }> = [];
let voidZoneCounter = 0;
const voidZoneClocksMs = new Map<string, number>();

function swarmOf(drone: Drone): VoidCorruptionRuntime | null {
  if (!drone.swarmId) return null;
  return voidSwarms.find((s) => s.swarmId === drone.swarmId) ?? null;
}

/** A Void Swarm incursion: an AF-034 Elite Ancient Void Avatar plus its five
 * supporting organisms, all through the existing shared spawn path. */
function spawnVoidSwarm(anchorX: number, anchorY: number): void {
  voidSwarmCounter += 1;
  const swarmId = `void-swarm-${voidSwarmCounter}`;
  const avatarDef = VOID_ENEMIES.find((d) => d.id === "ancient-void-avatar")!;
  const memberDefs = VOID_ENEMIES.filter((d) => d.id !== "ancient-void-avatar");
  const avatarDroneId = spawnEnemyInstance(avatarDef, anchorX, anchorY, true); // Elite Avatar — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, fourth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const beaconIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "void-beacon") beaconIds.push(id);
    return id;
  });
  voidSwarms.push(new VoidCorruptionRuntime(swarmId, [avatarDroneId, ...memberDroneIds], beaconIds));
  for (const drone of drones) {
    if (drone.id === avatarDroneId || memberDroneIds.includes(drone.id)) drone.swarmId = swarmId;
  }
  lootNotices.push({ text: "REALITY DESTABILISING — VOID SWARM DETECTED", colour: "#c94dff", ttlMs: 3000 });
}

/** AF-049: Void Distortion is one of AF-017's existing EnvironmentalEvent
 * outcomes (`ENVIRONMENTAL_EVENTS`) — no Director change, just a new
 * listener on the fact it already emits, the same pattern AF-035's Boss
 * uses off `DirectorPhaseChanged`. */
function spawnVoidSwarmFromEvent(): void {
  if (!movement || !director || !combatRng) return;
  const player = movement.snapshot;
  const angle = combatRng.float(0, Math.PI * 2);
  const x = Math.min(ARENA.maxX - 3, Math.max(ARENA.minX + 3, player.x + Math.cos(angle) * 14));
  const y = Math.min(ARENA.maxY - 3, Math.max(ARENA.minY + 3, player.y + Math.sin(angle) * 14));
  spawnVoidSwarm(x, y);
  director.notifyEnemiesSpawned(6, 1); // the Avatar spawns as an AF-034 Elite
}

// ── AF-050: Ancient Custodians — the fifth doctrine, and the mirror-
// opposite direction of every prior one: a site gets STRONGER the longer
// the player lingers near it, not weaker as its units die. Sites are
// run-scoped like every other structure.
let ancientSites: AncientSecurityRuntime[] = [];
let ancientSiteCounter = 0;

function siteOf(drone: Drone): AncientSecurityRuntime | null {
  if (!drone.siteId) return null;
  return ancientSites.find((s) => s.siteId === drone.siteId) ?? null;
}

/** An Ancient Custodian site: an AF-034 Elite Ancient Executor plus its
 * five supporting guardians, all through the existing shared spawn path. */
function spawnAncientSite(anchorX: number, anchorY: number): void {
  ancientSiteCounter += 1;
  const siteId = `ancient-site-${ancientSiteCounter}`;
  const executorDef = ANCIENT_ENEMIES.find((d) => d.id === "ancient-executor")!;
  const memberDefs = ANCIENT_ENEMIES.filter((d) => d.id !== "ancient-executor");
  const executorDroneId = spawnEnemyInstance(executorDef, anchorX, anchorY, true); // Elite Executor — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, fifth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const nodeIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "shield-architect") nodeIds.push(id);
    return id;
  });
  ancientSites.push(new AncientSecurityRuntime(siteId, [executorDroneId, ...memberDroneIds], nodeIds));
  for (const drone of drones) {
    if (drone.id === executorDroneId || memberDroneIds.includes(drone.id)) drone.siteId = siteId;
  }
  lootNotices.push({ text: "ANCIENT SITE DETECTED — MINOR TRESPASS LOGGED", colour: "#8fd8ff", ttlMs: 3000 });
}

/** AF-050: Ancient Signal is one of AF-017's existing EnvironmentalEvent
 * outcomes (`ENVIRONMENTAL_EVENTS`) — no Director change, the same
 * react-to-an-existing-fact pattern AF-049 used for Void Distortion. */
function spawnAncientSiteFromEvent(): void {
  if (!movement || !director || !combatRng) return;
  const player = movement.snapshot;
  const angle = combatRng.float(0, Math.PI * 2);
  const x = Math.min(ARENA.maxX - 3, Math.max(ARENA.minX + 3, player.x + Math.cos(angle) * 14));
  const y = Math.min(ARENA.maxY - 3, Math.max(ARENA.minY + 3, player.y + Math.sin(angle) * 14));
  spawnAncientSite(x, y);
  director.notifyEnemiesSpawned(6, 1); // the Executor spawns as an AF-034 Elite
}

// ── AF-051: Bio-Engineered Xenomorphs — the sixth doctrine, and the first
// whose core meter only ever grows: Biomass climbs from every death,
// including the Hive's own, and never decreases. Hives are run-scoped like
// every other structure; Acid Pools reuse AF-035's exact hazard engine.
let xenoHives: HiveEvolutionRuntime[] = [];
let xenoHiveCounter = 0;
let acidPools: Array<{ zone: HazardZoneDef; state: HazardZoneState }> = [];
let acidPoolCounter = 0;

function hiveOf(drone: Drone): HiveEvolutionRuntime | null {
  if (!drone.hiveId) return null;
  return xenoHives.find((h) => h.hiveId === drone.hiveId) ?? null;
}

/** A Xenomorph incursion: an AF-034 Elite Living Titan plus its five
 * supporting organisms, all through the existing shared spawn path. */
function spawnHive(anchorX: number, anchorY: number): void {
  xenoHiveCounter += 1;
  const hiveId = `xeno-hive-${xenoHiveCounter}`;
  const titanDef = XENO_ENEMIES.find((d) => d.id === "living-titan")!;
  const memberDefs = XENO_ENEMIES.filter((d) => d.id !== "living-titan");
  const titanDroneId = spawnEnemyInstance(titanDef, anchorX, anchorY, true); // Elite Titan — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, sixth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const nodeIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "evolution-node") nodeIds.push(id);
    return id;
  });
  xenoHives.push(new HiveEvolutionRuntime(hiveId, [titanDroneId, ...memberDroneIds], nodeIds));
  for (const drone of drones) {
    if (drone.id === titanDroneId || memberDroneIds.includes(drone.id)) drone.hiveId = hiveId;
  }
  lootNotices.push({ text: "HIVE DETECTED — BIOMASS RISING", colour: "#8bff4d", ttlMs: 3000 });
}

// ── AF-052: Stellar Nomads — the seventh doctrine, and the first driven by
// an actively-spent economy rather than a passive multiplier. Fleets are
// run-scoped like every other structure; the Nomad Flagship is both the
// AF-034 Elite leader AND the fleet's Command Ship.
let nomadFleets: NomadFleetRuntime[] = [];
let nomadFleetCounter = 0;

function fleetOf(drone: Drone): NomadFleetRuntime | null {
  if (!drone.fleetId) return null;
  return nomadFleets.find((f) => f.fleetId === drone.fleetId) ?? null;
}

/** A Nomad fleet: an AF-034 Elite Flagship (also the Command Ship) plus its
 * five supporting crew, all through the existing shared spawn path. */
function spawnFleet(anchorX: number, anchorY: number): void {
  nomadFleetCounter += 1;
  const fleetId = `nomad-fleet-${nomadFleetCounter}`;
  const flagshipDef = NOMAD_ENEMIES.find((d) => d.id === "nomad-flagship")!;
  const memberDefs = NOMAD_ENEMIES.filter((d) => d.id !== "nomad-flagship");
  const flagshipDroneId = spawnEnemyInstance(flagshipDef, anchorX, anchorY, true); // Elite Flagship — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, seventh doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const escortIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "escort-fighter") escortIds.push(id);
    return id;
  });
  nomadFleets.push(new NomadFleetRuntime(fleetId, [flagshipDroneId, ...memberDroneIds], flagshipDroneId, escortIds));
  for (const drone of drones) {
    if (drone.id === flagshipDroneId || memberDroneIds.includes(drone.id)) drone.fleetId = fleetId;
  }
  lootNotices.push({ text: "NOMAD FLEET DETECTED — SALVAGE OPPORTUNITY", colour: "#e8862a", ttlMs: 3000 });
}

// ── AF-053: Paragon Protocol — the eighth doctrine, and the first with a
// single irreversible threshold event instead of a smooth curve. Protocols
// and singularity charges are run-scoped like every other structure.
let paragonProtocols: ParagonInstabilityRuntime[] = [];
let paragonProtocolCounter = 0;
let singularityCharges: Array<{ zone: HazardZoneDef; state: HazardZoneState }> = [];
let singularityChargeCounter = 0;

function protocolOf(drone: Drone): ParagonInstabilityRuntime | null {
  if (!drone.protocolId) return null;
  return paragonProtocols.find((p) => p.protocolId === drone.protocolId) ?? null;
}

/** A Paragon Protocol incursion: an AF-034 Elite Omega Prototype plus its
 * five supporting prototypes, all through the existing shared spawn path. */
function spawnProtocol(anchorX: number, anchorY: number): void {
  paragonProtocolCounter += 1;
  const protocolId = `paragon-protocol-${paragonProtocolCounter}`;
  const omegaDef = PARAGON_ENEMIES.find((d) => d.id === "omega-prototype")!;
  const memberDefs = PARAGON_ENEMIES.filter((d) => d.id !== "omega-prototype");
  const omegaDroneId = spawnEnemyInstance(omegaDef, anchorX, anchorY, true); // Elite Omega — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, eighth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  const sentinelIds: string[] = [];
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "containment-sentinel") sentinelIds.push(id);
    return id;
  });
  paragonProtocols.push(new ParagonInstabilityRuntime(protocolId, [omegaDroneId, ...memberDroneIds], sentinelIds));
  for (const drone of drones) {
    if (drone.id === omegaDroneId || memberDroneIds.includes(drone.id)) drone.protocolId = protocolId;
  }
  lootNotices.push({ text: "PARAGON PROTOCOL DETECTED — CONTAINMENT NOMINAL", colour: "#ff8a1a", ttlMs: 3000 });
}

/** AF-053: Gravity Flux is one of AF-017's existing EnvironmentalEvent
 * outcomes — no Director change, the same react-to-an-existing-fact
 * pattern AF-049/050 used for Void Distortion / Ancient Signal. */
function spawnProtocolFromEvent(): void {
  if (!movement || !director || !combatRng) return;
  const player = movement.snapshot;
  const angle = combatRng.float(0, Math.PI * 2);
  const x = Math.min(ARENA.maxX - 3, Math.max(ARENA.minX + 3, player.x + Math.cos(angle) * 14));
  const y = Math.min(ARENA.maxY - 3, Math.max(ARENA.minY + 3, player.y + Math.sin(angle) * 14));
  spawnProtocol(x, y);
  director.notifyEnemiesSpawned(6, 1); // the Omega Prototype spawns as an AF-034 Elite
}

// ── AF-054: Celestial Conclave — the ninth doctrine, and the first whose
// bonus is local rather than global: a fixed-pattern graph where each
// living entity's bonus depends on its OWN surviving link count, not one
// shared value for the whole formation. Constellations and gravity wells
// are run-scoped like every other structure.
let celestialConstellations: CelestialConstellationRuntime[] = [];
let celestialConstellationCounter = 0;
let gravityWells: Array<{ zone: HazardZoneDef; state: HazardZoneState }> = [];
let gravityWellCounter = 0;
const gravityWellClocksMs = new Map<string, number>();

function constellationOf(drone: Drone): CelestialConstellationRuntime | null {
  if (!drone.constellationId) return null;
  return celestialConstellations.find((c) => c.constellationId === drone.constellationId) ?? null;
}

/** A Celestial formation: an AF-034 Elite Living Supernova plus its five
 * supporting entities, wired into a star-pattern Constellation graph — the
 * Constellation Avatar is the hub, linked to every other point, making it
 * the anchor by construction rather than a hardcoded flag. */
function spawnConstellation(anchorX: number, anchorY: number): void {
  celestialConstellationCounter += 1;
  const constellationId = `celestial-constellation-${celestialConstellationCounter}`;
  const supernovaDef = CELESTIAL_ENEMIES.find((d) => d.id === "living-supernova")!;
  const memberDefs = CELESTIAL_ENEMIES.filter((d) => d.id !== "living-supernova");
  const supernovaDroneId = spawnEnemyInstance(supernovaDef, anchorX, anchorY, true); // Elite Supernova — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, ninth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  let avatarDroneId: string | null = null;
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "constellation-avatar") avatarDroneId = id;
    return id;
  });
  const allIds = [supernovaDroneId, ...memberDroneIds];
  const links: Array<[string, string]> = [];
  if (avatarDroneId) {
    for (const id of allIds) if (id !== avatarDroneId) links.push([avatarDroneId, id]);
  }
  if (memberDroneIds.length >= 2) links.push([memberDroneIds[0]!, memberDroneIds[1]!]); // one extra edge beyond the hub, for a richer pattern
  celestialConstellations.push(new CelestialConstellationRuntime(constellationId, allIds, links));
  for (const drone of drones) {
    if (allIds.includes(drone.id)) drone.constellationId = constellationId;
  }
  lootNotices.push({ text: "CELESTIAL FORMATION DETECTED — CONSTELLATION ALIGNED", colour: "#ffd24d", ttlMs: 3000 });
}

/** AF-054: Solar Flare is one of AF-017's existing EnvironmentalEvent
 * outcomes — no Director change, the same react-to-an-existing-fact
 * pattern AF-049/050/053 used. */
function spawnConstellationFromEvent(): void {
  if (!movement || !director || !combatRng) return;
  const player = movement.snapshot;
  const angle = combatRng.float(0, Math.PI * 2);
  const x = Math.min(ARENA.maxX - 3, Math.max(ARENA.minX + 3, player.x + Math.cos(angle) * 14));
  const y = Math.min(ARENA.maxY - 3, Math.max(ARENA.minY + 3, player.y + Math.sin(angle) * 14));
  spawnConstellation(x, y);
  director.notifyEnemiesSpawned(6, 1); // the Living Supernova spawns as an AF-034 Elite
}

// ── AF-055: The Eclipsed — the tenth doctrine, and the first that is a
// mirror: every member walks its OWN five-stage fall (staggered, slowed by
// the Memory Warden, jumped forward by grief on every ally death), and the
// group's Ability Mimicry scales with the player's own progression level.
// Groups are run-scoped like every other structure.
let eclipsedGroups: EclipsedCorruptionRuntime[] = [];
let eclipsedGroupCounter = 0;

function eclipsedOf(drone: Drone): EclipsedCorruptionRuntime | null {
  if (!drone.eclipsedId) return null;
  return eclipsedGroups.find((g) => g.eclipsedId === drone.eclipsedId) ?? null;
}

/** A lost expedition: an AF-034 Elite Eclipsed Champion plus its five
 * fallen crew, all through the existing shared spawn path. */
function spawnEclipsed(anchorX: number, anchorY: number): void {
  eclipsedGroupCounter += 1;
  const eclipsedId = `eclipsed-${eclipsedGroupCounter}`;
  const championDef = ECLIPSED_ENEMIES.find((d) => d.id === "eclipsed-champion")!;
  const memberDefs = ECLIPSED_ENEMIES.filter((d) => d.id !== "eclipsed-champion");
  const championDroneId = spawnEnemyInstance(championDef, anchorX, anchorY, true); // Elite Champion — AF-034's pipeline, unchanged
  // Cross-module reuse of AF-046's pure formation math — same wedge, tenth doctrine.
  const offsets = OutlawSquadRuntime.formationOffsets(memberDefs.length);
  let wardenDroneId: string | null = null;
  const memberDroneIds = memberDefs.map((def, index) => {
    const id = spawnEnemyInstance(def, anchorX + offsets[index]!.x, anchorY + offsets[index]!.y, false);
    if (def.id === "memory-warden") wardenDroneId = id;
    return id;
  });
  eclipsedGroups.push(new EclipsedCorruptionRuntime(eclipsedId, [championDroneId, ...memberDroneIds], championDroneId, wardenDroneId));
  for (const drone of drones) {
    if (drone.id === championDroneId || memberDroneIds.includes(drone.id)) drone.eclipsedId = eclipsedId;
  }
  lootNotices.push({ text: "LOST EXPEDITION DETECTED — TRANSPONDERS STILL BROADCASTING", colour: "#c9d4e8", ttlMs: 3000 });
}

/** Shared kill-effects path — reached both by a direct hit and by a status DoT tick killing a drone. */
function killDrone(drone: Drone): void {
  drone.alive = false;
  drone.runtime.ai.transitionTo("death");
  bus.emit("EnemyKilled", { enemyId: drone.id, elite: drone.elite, boss: false });
  commanderRuntime?.notifyKill();
  director?.notifyEnemiesRemoved(1, drone.elite ? 1 : 0);
  // AF-033: Death Events are configuration over this same unconditional EnemyKilled fact.
  if (hasDeathEvent(drone.def, "xp")) {
    xpPickups?.spawn(drone.elite ? "elite" : drone.def.xpTier, drone.x, drone.y);
  }
  if (hasDeathEvent(drone.def, "loot") && (drone.elite || (lootRng && lootRng.next() < 0.08))) {
    dropLoot(drone.x, drone.y);
  }
  // AF-029: elites never simply drop gold — relic pool applies on pickup.
  if (drone.elite && lootRng && hasDeathEvent(drone.def, "loot")) {
    const relicId = lootRng.pick(ROSTER_RELICS.map((r) => r.id)); // AF-078: the full roster drops
    const result = relicSystem.acquire(relicId);
    if (result.ok) {
      reliquary.recordOwned(relicId); // AF-077: the lattice advances on real acquisition
      lootNotices.push({ text: `RELIC · ${relicId.toUpperCase().replaceAll("-", " ")}`, colour: "#9b5cff", ttlMs: 2200 });
      bus.emit("RelicAcquired", { relicId });
    }
  }
  // AF-033: Status Explosion — StatusEngine.apply() in a radius, reusing AF-021's engine exactly.
  if (hasDeathEvent(drone.def, "statusExplosion") && drone.def.attack.mechanism.kind === "ranged") {
    const statusOnHit = drone.def.attack.mechanism.weapon.statusOnHit;
    if (statusOnHit) {
      for (const other of drones) {
        if (!other.alive || other.id === drone.id) continue;
        if (Math.hypot(other.x - drone.x, other.y - drone.y) <= 3) {
          other.status.apply({ kind: statusOnHit.kind, strength: statusOnHit.strength, durationMs: statusOnHit.durationMs });
        }
      }
    }
  }
  // AF-033: Spawn Event — death-triggered spawn, reusing this module's own spawn path, not a second one.
  if (hasDeathEvent(drone.def, "spawnEvent")) {
    spawnEnemyInstance(SANDBOX_ENEMIES[0]!, drone.x, drone.y, false);
  }
  // AF-034: Explosive mutation — detonates in a damage radius on death; the actual
  // danger is the player standing nearby, per the mutation's own counterplay text.
  if (drone.mutationEffects.explosionOnDeath && movement && playerDefence && combatRng) {
    const player = movement.snapshot;
    const explosion = drone.mutationEffects.explosionOnDeath;
    if (Math.hypot(player.x - drone.x, player.y - drone.y) <= explosion.radius && !player.invulnerable) {
      const packet = { baseDamage: explosion.damage, kind: "area", school: "energy", critChance: 0, critMultiplier: 1 } as const;
      const result = resolveDamage(packet, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, combatRng);
      const intake = playerDefence.takeDamage(result.finalDamage);
      bus.emit("PlayerDamaged", { amount: result.finalDamage, source: drone.id });
      camera.shake("ShieldBreak");
      if (intake.defeated) endRun("defeat");
    }
  }
  // AF-046: Command Structure — destroying leaders weakens formations,
  // mechanically: the squad scatters into AF-033's existing retreat state.
  const squad = squadOf(drone);
  if (squad) {
    const role = squad.notifyDroneDestroyed(drone.id);
    if (role === "captain") {
      lootNotices.push({ text: "SQUAD BROKEN — CAPTAIN DOWN", colour: "#ff8c1a", ttlMs: 2600 });
      meta.discover("lore", LORE_MERCENARY_GUILD_CODEX); // first captain kill unlocks the Guild's Codex entry (AF-043)
      persistMeta();
      for (const member of drones) {
        if (!member.alive || member.squadId !== squad.squadId) continue;
        const state = member.runtime.ai.current;
        if (state === "targetAcquired" || state === "attack") member.runtime.ai.transitionTo("retreat");
      }
    }
    if (squad.state === "eliminated") {
      // Faction Synergy: their presence affects nearby systems — clearing a
      // squad improves the current system's Sector Stability (AF-038's stat).
      const stabilityKey = `galaxy:${galaxyRuntime.currentSystem.id}:stability`;
      const delta = GalaxyRuntime.clampedDelta(meta.stat(stabilityKey), 5, 0, 100);
      meta.recordStat(stabilityKey, delta);
      persistMeta();
      lootNotices.push({ text: "OUTLAW SQUAD ELIMINATED — SECTOR STABILITY IMPROVED", colour: "#4de868", ttlMs: 2600 });
      outlawSquads = outlawSquads.filter((s) => s.squadId !== squad.squadId);
    }
  }
  // AF-047: Network Command — destroying the Command Core degrades the network:
  // machines keep fighting, but synchronisation, shields, repair, and the
  // factory all stop. No scatter — machines do not fear.
  const network = networkOf(drone);
  if (network) {
    const role = network.notifyDroneDestroyed(drone.id);
    if (role === "core") {
      lootNotices.push({ text: "NETWORK DEGRADED — COMMAND CORE OFFLINE", colour: "#4d7cff", ttlMs: 2600 });
      meta.discover("lore", LORE_MACHINE_NETWORK_DOCTRINE); // first core kill unlocks the doctrine Codex entry (AF-043)
      persistMeta();
    }
    if (network.state === "eliminated") {
      // Loot: Research Data — banked through AF-024's existing points path,
      // announced through its existing bus fact (bankResearchSample's pattern).
      researchTree.addPoints(3);
      persistResearch();
      bus.emit("ResearchPointsGained", { amount: 3 });
      lootNotices.push({ text: "MACHINE NETWORK ELIMINATED — RESEARCH DATA RECOVERED", colour: "#4d7cff", ttlMs: 2600 });
      machineNetworks = machineNetworks.filter((n) => n.networkId !== network.networkId);
    }
  }
  // AF-048: Resonance Network — "destroying resonance nodes weakens nearby
  // organisms", mechanically and immediately: no threshold, no delay, just a
  // recomputed strength on every node kill. No scatter, no degrade step —
  // the ecosystem simply gets a little weaker.
  const ecosystem = ecosystemOf(drone);
  if (ecosystem) {
    const role = ecosystem.notifyDroneDestroyed(drone.id);
    if (role === "node") {
      lootNotices.push({ text: "RESONANCE NODE DESTROYED — ECOSYSTEM WEAKENED", colour: "#9b5cff", ttlMs: 2600 });
      meta.discover("lore", LORE_CRYSTAL_RESONANCE_ARCHIVE); // first node kill unlocks the resonance archive Codex entry (AF-043)
      persistMeta();
    }
    if (ecosystem.eliminated) {
      lootNotices.push({ text: "CRYSTAL ECOSYSTEM ELIMINATED", colour: "#9b5cff", ttlMs: 2600 });
      crystalEcosystems = crystalEcosystems.filter((e) => e.ecosystemId !== ecosystem.ecosystemId);
    }
  }
  // AF-049: Corruption System — "destroying Beacons weakens surrounding
  // corruption", both an immediate step down (inside the runtime) and the
  // removal of a growth source; unlike every prior faction, this doctrine
  // also decays on its own once every Beacon is gone — containment, not a snap.
  const swarm = swarmOf(drone);
  if (swarm) {
    const role = swarm.notifyDroneDestroyed(drone.id);
    if (role === "beacon") {
      lootNotices.push({ text: "VOID BEACON DESTROYED — CORRUPTION CONTAINED", colour: "#c94dff", ttlMs: 2600 });
      meta.discover("lore", LORE_VOID_CORRUPTION_ARCHIVE); // first beacon kill unlocks the corruption archive Codex entry (AF-043)
      persistMeta();
    }
    if (swarm.eliminated) {
      lootNotices.push({ text: "VOID SWARM ELIMINATED", colour: "#c94dff", ttlMs: 2600 });
      voidSwarms = voidSwarms.filter((s) => s.swarmId !== swarm.swarmId);
    }
  }
  // AF-050: Ancient Network — "destroying network nodes weakens the defence
  // grid", permanently: the site's alert ceiling shrinks and clamps down
  // immediately. Unlike every prior faction, killing members otherwise does
  // nothing to help — the site only calms down when the player disengages.
  const site = siteOf(drone);
  if (site) {
    const role = site.notifyDroneDestroyed(drone.id);
    if (role === "node") {
      lootNotices.push({ text: "SHIELD ARCHITECT DESTROYED — DEFENCE GRID WEAKENED", colour: "#8fd8ff", ttlMs: 2600 });
      meta.discover("lore", LORE_ANCIENT_CUSTODIANS_CODEX); // first architect kill unlocks the doctrine Codex entry (AF-043)
      persistMeta();
    }
    if (site.eliminated) {
      lootNotices.push({ text: "ANCIENT SITE CLEARED", colour: "#8fd8ff", ttlMs: 2600 });
      ancientSites = ancientSites.filter((s) => s.siteId !== site.siteId);
    }
  }
  // AF-051: Evolution System — "the Hive never wastes biomass": every death
  // here feeds it, including this one. A Node kill additionally severs the
  // network link immediately, cutting shared bonuses without ever lowering
  // Biomass itself — the sixth doctrine has no way down at all.
  const hive = hiveOf(drone);
  if (hive) {
    const role = hive.notifyDroneDestroyed(drone.id);
    if (role === "node") {
      lootNotices.push({ text: "EVOLUTION NODE SEVERED — HIVE NETWORK CUT", colour: "#8bff4d", ttlMs: 2600 });
      meta.discover("lore", LORE_XENOMORPH_HIVE_CODEX); // first node kill unlocks the doctrine Codex entry (AF-043)
      persistMeta();
    }
    if (hive.eliminated) {
      lootNotices.push({ text: "HIVE ELIMINATED", colour: "#8bff4d", ttlMs: 2600 });
      xenoHives = xenoHives.filter((h) => h.hiveId !== hive.hiveId);
    }
  }
  // AF-052: Fleet Coordination — "destroying command ships disrupts fleet
  // cohesion": the Flagship's death doesn't scatter, degrade, weaken,
  // corrupt, de-escalate, or sever anything already banked — it only
  // throttles the fleet's future Scrap income.
  const fleet = fleetOf(drone);
  if (fleet) {
    const role = fleet.notifyDroneDestroyed(drone.id);
    if (role === "commandShip") {
      lootNotices.push({ text: "COMMAND SHIP DOWN — FLEET COHESION DISRUPTED", colour: "#e8862a", ttlMs: 2600 });
      meta.discover("lore", LORE_NOMAD_FLEET_CODEX); // first command ship kill unlocks the faction's Codex entry (AF-043)
      persistMeta();
    }
    if (fleet.eliminated) {
      lootNotices.push({ text: "NOMAD FLEET ELIMINATED", colour: "#e8862a", ttlMs: 2600 });
      nomadFleets = nomadFleets.filter((f) => f.fleetId !== fleet.fleetId);
    }
  }
  // AF-053: Containment System — a Containment Sentinel's death removes
  // active repair without touching Stability's current value at all; it
  // never triggers Collapse by itself, but it removes the only thing
  // holding it back.
  const protocol = protocolOf(drone);
  if (protocol) {
    const role = protocol.notifyDroneDestroyed(drone.id);
    if (role === "sentinel") {
      lootNotices.push({ text: "CONTAINMENT SENTINEL DESTROYED — REPAIR OFFLINE", colour: "#ff8a1a", ttlMs: 2600 });
      meta.discover("lore", LORE_PARAGON_PROTOCOL_CODEX); // first sentinel kill unlocks the doctrine Codex entry (AF-043)
      persistMeta();
    }
    if (protocol.eliminated) {
      lootNotices.push({ text: "PARAGON PROTOCOL ELIMINATED", colour: "#ff8a1a", ttlMs: 2600 });
      paragonProtocols = paragonProtocols.filter((p) => p.protocolId !== protocol.protocolId);
    }
  }
  // AF-054: Celestial Network — "destroying anchor entities destabilises
  // nearby formations" needs no special case here: the Constellation Avatar
  // is simply the highest-degree point in the graph, so its death costs
  // every neighbour a link at once, purely from the graph shape itself.
  const constellation = constellationOf(drone);
  if (constellation) {
    const role = constellation.notifyDroneDestroyed(drone.id);
    if (role === "member" && drone.def.id === "constellation-avatar") {
      lootNotices.push({ text: "CONSTELLATION AVATAR DESTROYED — FORMATION DESTABILISED", colour: "#ffd24d", ttlMs: 2600 });
      meta.discover("lore", LORE_CELESTIAL_CONCLAVE_CODEX); // first avatar kill unlocks the doctrine Codex entry (AF-043)
      persistMeta();
    }
    if (constellation.eliminated) {
      lootNotices.push({ text: "CELESTIAL FORMATION ELIMINATED", colour: "#ffd24d", ttlMs: 2600 });
      celestialConstellations = celestialConstellations.filter((c) => c.constellationId !== constellation.constellationId);
    }
  }
  // AF-055: the Eclipsed — grief is mechanical (handled inside the runtime:
  // every death pushes the survivors further along their own falls). The
  // Warden's death removes the one thing slowing them; the Champion's death
  // recovers an identity — the group's Codex unlock is a name, not a kill.
  const eclipsed = eclipsedOf(drone);
  if (eclipsed) {
    const role = eclipsed.notifyDroneDestroyed(drone.id);
    if (role === "warden") {
      lootNotices.push({ text: "MEMORY WARDEN LOST — THE MANIFEST GOES UNREAD", colour: "#c9d4e8", ttlMs: 2600 });
    }
    if (role === "champion") {
      lootNotices.push({ text: "IDENTITY RECOVERED — A COMMANDER'S NAME COMES HOME", colour: "#c9d4e8", ttlMs: 3000 });
      meta.discover("lore", LORE_ECLIPSED_CODEX); // first champion kill unlocks the Eclipsed Codex entry (AF-043)
      persistMeta();
    }
    if (eclipsed.eliminated) {
      lootNotices.push({ text: "LOST EXPEDITION AT REST", colour: "#c9d4e8", ttlMs: 2600 });
      eclipsedGroups = eclipsedGroups.filter((g) => g.eclipsedId !== eclipsed.eclipsedId);
    }
  }
}

/** AF-056: the Conductor's gate — ordinary directives can wait out a Recovery
 * Window in the Spawn Queue; boss timing is AF-017/035's own domain and is
 * never deferred. Deferred directives flush from the per-tick update. */
function spawnWave(directive: SpawnDirective): void {
  if (!conductor || directive.waveType === "MiniBossWave" || directive.waveType === "BossWave") {
    executeWave(directive);
    return;
  }
  const released = conductor.gateDirective(directive);
  if (released.length === 0) {
    // Visual threat indicator (AF-056 §Accessibility): the held encounter is named, not hidden.
    lootNotices.push({ text: `${WAVE_TYPE_TO_ENCOUNTER_TYPE[directive.waveType].toUpperCase()} HOLDING — RECOVERY WINDOW`, colour: "#8a94a8", ttlMs: 2200 });
  }
  for (const gated of released) executeWave(gated);
}

function executeWave(directive: SpawnDirective): void {
  if (!movement || !combatRng || !director) return;
  const player = movement.snapshot;
  // AF-046: the Director's existing AmbushEvent wave identity becomes the
  // Outlaws' entrance — an ambush IS their doctrine. No Director changes.
  // AF-047: likewise, ReinforcementWave becomes the Machine Collective's —
  // Automated Reinforcements ARE their doctrine.
  // AF-048: MixedEncounter becomes the Crystal Ascendancy's entrance — a
  // mixed roster of cooperating organisms IS the ecosystem's doctrine.
  // AF-051: HunterPack becomes the Xenomorph Hive's — a hunting pack IS
  // Swarming/Flanking/Overwhelming Numbers, almost too literally to pass up.
  // AF-052: AmbientPatrol becomes the Stellar Nomads' — a convoy passing
  // through fits an opportunistic, low-intensity encounter type well.
  // AF-055: EliteSquad becomes the Eclipsed's — ElitePressure's "squad of
  // elites" gains a face: every Eclipsed was once a Commander, and the
  // Champion still spawns through AF-034's pipeline as the wave promises.
  if (
    directive.waveType === "AmbushEvent" ||
    directive.waveType === "ReinforcementWave" ||
    directive.waveType === "MixedEncounter" ||
    directive.waveType === "HunterPack" ||
    directive.waveType === "AmbientPatrol" ||
    directive.waveType === "EliteSquad"
  ) {
    const angle = combatRng.float(0, Math.PI * 2);
    const distance = directive.placement.minDistanceFromPlayer + combatRng.float(0, 4);
    const x = Math.min(ARENA.maxX - 3, Math.max(ARENA.minX + 3, player.x + Math.cos(angle) * distance));
    const y = Math.min(ARENA.maxY - 3, Math.max(ARENA.minY + 3, player.y + Math.sin(angle) * distance));
    if (directive.waveType === "AmbushEvent") {
      spawnOutlawSquad(x, y);
      director.notifyEnemiesSpawned(5, 1); // captain spawns as an AF-034 Elite
    } else if (directive.waveType === "ReinforcementWave") {
      spawnMachineNetwork(x, y);
      director.notifyEnemiesSpawned(6, 1); // command core spawns as an AF-034 Elite
    } else if (directive.waveType === "MixedEncounter") {
      spawnCrystalEcosystem(x, y);
      director.notifyEnemiesSpawned(6, 1); // titan spawns as an AF-034 Elite
    } else if (directive.waveType === "HunterPack") {
      spawnHive(x, y);
      director.notifyEnemiesSpawned(6, 1); // living titan spawns as an AF-034 Elite
    } else if (directive.waveType === "AmbientPatrol") {
      spawnFleet(x, y);
      director.notifyEnemiesSpawned(6, 1); // flagship spawns as an AF-034 Elite
    } else {
      spawnEclipsed(x, y);
      director.notifyEnemiesSpawned(6, 1); // champion spawns as an AF-034 Elite
    }
    // AF-056: a full faction group is a Large Enemy Wave — it earns breathing room.
    conductor?.notifyWaveLanded(6);
    return;
  }
  // Remaining generic waves (SwarmWave, MiniBossWave overflow, etc.) — never
  // elite: every AF-034 Elite now enters as a faction leader through the
  // branch above, so the census's elite column is theirs alone.
  const count = Math.max(1, Math.round(directive.budgetCost / 4));
  for (let i = 0; i < count; i += 1) {
    const angle = combatRng.float(0, Math.PI * 2);
    const distance = directive.placement.minDistanceFromPlayer + combatRng.float(0, 4);
    const x = Math.min(ARENA.maxX - 1, Math.max(ARENA.minX + 1, player.x + Math.cos(angle) * distance));
    const y = Math.min(ARENA.maxY - 1, Math.max(ARENA.minY + 1, player.y + Math.sin(angle) * distance));
    const baseDef = combatRng.pick(SANDBOX_ENEMIES);
    spawnEnemyInstance(baseDef, x, y, false);
  }
  director.notifyEnemiesSpawned(count, 0);
  conductor?.notifyWaveLanded(count);
}

/** AF-035: the Boss spawns once per run, triggered by the Director's existing MiniBoss phase. */
function spawnBoss(): void {
  if (!movement) return;
  const player = movement.snapshot;
  bossRuntime = new BossRuntime(sandboxBoss, DEFAULT_COMBAT_TUNING);
  bossMotion = { x: player.x + 10, y: player.y, elapsedMs: 0, strafeDirection: 1, phase: "hidden" };
  bossIntroRemainingMs = 2500;
  bossRewardsGranted = false;
  bossFightDamageTaken = false;
  bossHazardState = { tickClockMs: 0 };
  // AF-057: one director per encounter; every arrival is a recorded attempt (§Boss Memory).
  bossDirector = new BossDirectorRuntime(sandboxBoss.id, SANDBOX_BOSS_SUMMON_PLAN);
  lastBossPhaseIndex = 0;
  bossFightElapsedMs = 0;
  bossHazardZone.radius = BOSS_HAZARD_BASE_RADIUS;
  meta.recordStat(`boss:${sandboxBoss.id}:attempts`);
  persistMeta();
  lootNotices.push({
    text: `${sandboxBoss.name.toUpperCase()} — ${sandboxBoss.title.toUpperCase()}`,
    colour: "#ffc652",
    ttlMs: 3200,
  });
  audioEngine.play("cue-boss-spawn"); // AF-045: Player Feedback; also cues the Boss Introduction music transition.
}

/** AF-035: reward ceremony — reuses every acquisition system the "boss" xp tier/loot categories already gate. */
function grantBossRewards(): void {
  const def = sandboxBoss;
  xpPickups?.spawn(def.rewards.xpTier, bossMotion.x, bossMotion.y);
  for (const category of def.rewards.dropCategories) {
    if (lootRng && groundLoot && xpSystem && session) {
      const filtered = SANDBOX_DROP_TABLE.filter((entry) => entry.category === category);
      if (filtered.length > 0) {
        const drop = generateDrop(
          filtered,
          {
            itemLevel: xpSystem.snapshot.level,
            difficulty: 1,
            ascension: session.ascension,
            mutatorBonus: missionRuntime?.lootMutatorBonus ?? 0,
            researchBonus: sandboxBuild.researchLootBonus,
            smartLoot: biomeRuntime ? { categoryWeights: biomeRuntime.resourceWeights } : undefined,
          },
          DEFAULT_LOOT_TUNING,
          lootRng,
        );
        groundLoot.place(drop, bossMotion.x + lootRng.float(-1, 1), bossMotion.y + lootRng.float(-1, 1));
        bus.emit("LootDropped", { itemId: drop.baseItemId, rarity: drop.rarity, category: drop.category, seed: drop.seed });
      }
    }
  }
  if (def.rewards.guaranteedRelic && lootRng) {
    const relicId = lootRng.pick(ROSTER_RELICS.map((r) => r.id)); // AF-078: the full roster drops
    const result = relicSystem.acquire(relicId);
    if (result.ok) {
      reliquary.recordOwned(relicId); // AF-077: the lattice advances on real acquisition
      lootNotices.push({ text: `RELIC · ${relicId.toUpperCase().replaceAll("-", " ")}`, colour: "#9b5cff", ttlMs: 2200 });
      bus.emit("RelicAcquired", { relicId });
    }
  }
  if (def.rewards.guaranteedBlueprint && crafting.unlockBlueprint("bp-prototype-lance")) {
    bus.emit("BlueprintUnlocked", { blueprintId: "bp-prototype-lance" });
    lootNotices.push({ text: "BLUEPRINT · PROTOTYPE LANCE", colour: "#9b5cff", ttlMs: 2200 });
    persistCrafting();
  }
  meta.recordStat("bossesDefeated");
  meta.discover("bosses", def.codexId);
  awardCredits(CREDIT_AWARDS.bossDefeated); // AF-040: Bosses as a Resource Source.
  // AF-042: Discovery Log — full context for a boss-defeat discovery.
  collectionLedger.recordDiscovery({
    id: def.codexId,
    category: "bosses",
    atMs: Date.now(),
    missionId: session?.missionId ?? null,
    biomeId: activeBiome.id,
    galaxySectorId: galaxyRuntime.currentSystem.id,
    commanderId: sandboxCommander.id,
    shipId: sandboxShip.id,
  });
  persistCollectionLedger();
  // AF-035: mastery-challenge reward — the discoverable/Codex-visible half of AF-026's
  // grantReward; the private cosmetic-unlock bookkeeping stays MetaProgression's own.
  if (!bossFightDamageTaken) {
    for (const challenge of def.masteryChallenges) {
      if (challenge.kind === "noDamage") meta.discover("achievements", challenge.reward.id);
    }
  }
  lootNotices.push({ text: `${def.name.toUpperCase()} DEFEATED`, colour: "#ffc652", ttlMs: 3200 });
}

function updateSandboxCombat(fixedDtMs: number): void {
  if (!movement || !playerDefence || !combatRng || !director) return;
  const dt = fixedDtMs / 1000;
  const player = movement.snapshot;

  // AF-046: squad clocks tick; mine layers seed AF-035-engine hazard zones on
  // a cadence; live mines tick against the player exactly like a boss hazard.
  for (const squad of outlawSquads) squad.update(fixedDtMs);
  outlawMineDropClockMs += fixedDtMs;
  if (outlawMineDropClockMs >= OUTLAW_MINE_TUNING.dropIntervalMs) {
    outlawMineDropClockMs = 0;
    for (const drone of drones) {
      // (phase is only meaningful for ambush/burrow movement — alive is the correct gate here)
      if (drone.alive && drone.def.id === "outlaw-mine-layer") {
        outlawMineCounter += 1;
        outlawMines.push({ zone: createOutlawMine(`outlaw-mine-${outlawMineCounter}`, drone.x, drone.y), state: { tickClockMs: 0 }, ttlMs: OUTLAW_MINE_TUNING.ttlMs });
        if (outlawMines.length > OUTLAW_MINE_TUNING.maxLiveMines) outlawMines.shift();
      }
    }
  }
  for (const mine of outlawMines) {
    mine.ttlMs -= fixedDtMs;
    if (playerDefence && stepHazardZone(mine.zone, mine.state, fixedDtMs) && isInsideHazard(mine.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(mine.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: mine.zone.damagePerTick, source: mine.zone.id });
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }
  outlawMines = outlawMines.filter((m) => m.ttlMs > 0);

  // AF-047: network clocks tick; Self Repair regenerates linked machines while
  // the Repair Drone operates; the Drone Factory manufactures Combat Drones
  // through the same shared spawn path everything else uses.
  for (const network of machineNetworks) {
    network.update(fixedDtMs);
    if (network.repairUp) {
      for (const drone of drones) {
        if (drone.alive && drone.networkId === network.networkId && drone.hull < drone.maxHull) {
          drone.hull = Math.min(drone.maxHull, drone.hull + MACHINE_NETWORK_TUNING.repairHullPerSecond * dt);
        }
      }
    }
    if (network.tryConstructDrone()) {
      const constructorDrone = drones.find((d) => d.alive && d.id === network.constructorDroneId);
      if (constructorDrone && director) {
        const builtId = spawnEnemyInstance(MACHINE_ENEMIES.find((d) => d.id === "machine-combat-drone")!, constructorDrone.x, constructorDrone.y, false);
        const built = drones.find((d) => d.id === builtId);
        if (built) built.networkId = network.networkId;
        network.enrolMember(builtId);
        director.notifyEnemiesSpawned(1, 0); // the Director's census stays accurate
      }
    }
  }

  // AF-048: Resonance Network — Self Repair heals ecosystem members continuously,
  // scaled by resonance strength (no on/off threshold); Growth Seeders seed
  // AF-035-engine hazard zones on their own cadence, capped for performance;
  // live growths tick against the player and grow their radius continuously.
  for (const ecosystem of crystalEcosystems) {
    if (ecosystem.healPerSecond <= 0) continue;
    for (const drone of drones) {
      if (drone.alive && drone.ecosystemId === ecosystem.ecosystemId && drone.hull < drone.maxHull) {
        drone.hull = Math.min(drone.maxHull, drone.hull + ecosystem.healPerSecond * dt);
      }
    }
  }
  for (const drone of drones) {
    if (!drone.alive || drone.def.id !== "crystal-growth-seeder") continue;
    const clock = (crystalSeederClocksMs.get(drone.id) ?? 0) + fixedDtMs;
    if (clock < CRYSTAL_GROWTH_TUNING.seedIntervalMs) {
      crystalSeederClocksMs.set(drone.id, clock);
      continue;
    }
    crystalSeederClocksMs.set(drone.id, 0);
    if (crystalGrowths.length < CRYSTAL_GROWTH_TUNING.maxLiveGrowths) {
      crystalGrowthCounter += 1;
      crystalGrowths.push({ zone: createCrystalGrowth(`crystal-growth-${crystalGrowthCounter}`, drone.x, drone.y), state: { tickClockMs: 0 } });
    }
  }
  for (let i = 0; i < crystalGrowths.length; i += 1) {
    const growth = crystalGrowths[i]!;
    growth.zone = growCrystalZone(growth.zone, dt);
    if (stepHazardZone(growth.zone, growth.state, fixedDtMs) && isInsideHazard(growth.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(growth.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: growth.zone.damagePerTick, source: growth.zone.id });
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }

  // AF-049: Corruption System — corruption climbs while Beacons live, decays
  // once contained; Healing scales continuously with it (no threshold);
  // Corruption Zones seed once a swarm's corruption crosses the seed
  // threshold, reusing AF-035's exact hazard engine and carrying the
  // corruption status on tick.
  for (const swarm of voidSwarms) {
    swarm.update(fixedDtMs);
    if (swarm.healPerSecond <= 0) continue;
    for (const drone of drones) {
      if (drone.alive && drone.swarmId === swarm.swarmId && drone.hull < drone.maxHull) {
        drone.hull = Math.min(drone.maxHull, drone.hull + swarm.healPerSecond * dt);
      }
    }
  }
  for (const swarm of voidSwarms) {
    if (swarm.corruptionLevel < VOID_ZONE_TUNING.seedThreshold) continue;
    const clock = (voidZoneClocksMs.get(swarm.swarmId) ?? 0) + fixedDtMs;
    if (clock < VOID_ZONE_TUNING.seedIntervalMs) {
      voidZoneClocksMs.set(swarm.swarmId, clock);
      continue;
    }
    voidZoneClocksMs.set(swarm.swarmId, 0);
    const anchor = drones.find((d) => d.alive && d.swarmId === swarm.swarmId);
    if (anchor && voidZones.length < VOID_ZONE_TUNING.maxLiveZones) {
      voidZoneCounter += 1;
      voidZones.push({ zone: createCorruptionZone(`void-zone-${voidZoneCounter}`, anchor.x, anchor.y), state: { tickClockMs: 0 } });
    }
  }
  for (const zone of voidZones) {
    if (stepHazardZone(zone.zone, zone.state, fixedDtMs) && isInsideHazard(zone.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(zone.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: zone.zone.damagePerTick, source: zone.zone.id });
      if (zone.zone.statusOnTick && playerStatus) {
        playerStatus.apply(zone.zone.statusOnTick);
        bus.emit("StatusApplied", { targetId: "player", status: zone.zone.statusOnTick.kind });
      }
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }

  // AF-050: Security System — alert escalates while the player trespasses
  // near any living Custodian, de-escalates the moment they leave; Repair
  // Functions heals members continuously once a stage grants it, and
  // Guardian Deployment (stage 3+) manufactures one real reinforcement
  // through the shared spawn path, cadence-gated and lifetime-capped like
  // AF-047's Drone Factory.
  for (const site of ancientSites) {
    const siteMembers = drones.filter((d) => d.alive && d.siteId === site.siteId);
    const playerPresent = siteMembers.some((d) => Math.hypot(d.x - player.x, d.y - player.y) <= ANCIENT_SECURITY_TUNING.siteRadius);
    site.update(fixedDtMs, playerPresent);
    if (site.healPerSecond > 0) {
      for (const drone of siteMembers) {
        if (drone.hull < drone.maxHull) drone.hull = Math.min(drone.maxHull, drone.hull + site.healPerSecond * dt);
      }
    }
    if (site.tryDeployGuardian() && siteMembers.length > 0) {
      const anchor = siteMembers[0]!;
      const builtId = spawnEnemyInstance(ANCIENT_ENEMIES.find((d) => d.id === "defence-drone")!, anchor.x, anchor.y, false);
      const built = drones.find((d) => d.id === builtId);
      if (built) built.siteId = site.siteId;
      site.enrolMember(builtId);
      director.notifyEnemiesSpawned(1, 0); // the Director's census stays accurate
    }
  }

  // AF-051: Evolution System — Biomass climbs on its own; Organic
  // Regeneration heals hive members while the Node link holds; Rapid
  // Reinforcement manufactures one real Hive Drone through the shared
  // spawn path, cadence-gated and lifetime-capped like AF-047's Drone
  // Factory. Acid Pools tick against the player exactly like every prior
  // faction's hazard-engine reuse.
  for (const hive of xenoHives) {
    hive.update(fixedDtMs);
    if (hive.healPerSecond > 0) {
      for (const drone of drones) {
        if (drone.alive && drone.hiveId === hive.hiveId && drone.hull < drone.maxHull) {
          drone.hull = Math.min(drone.maxHull, drone.hull + hive.healPerSecond * dt);
        }
      }
    }
    if (hive.tryReinforce()) {
      const anchor = drones.find((d) => d.alive && d.hiveId === hive.hiveId);
      if (anchor) {
        const builtId = spawnEnemyInstance(XENO_ENEMIES.find((d) => d.id === "hive-drone")!, anchor.x, anchor.y, false);
        const built = drones.find((d) => d.id === builtId);
        if (built) built.hiveId = hive.hiveId;
        hive.enrolMember(builtId);
        director.notifyEnemiesSpawned(1, 0); // the Director's census stays accurate
      }
    }
    if (hive.stageIndex >= 1 && acidPools.length < 4 && combatRng.next() < 0.001) {
      const seeder = drones.find((d) => d.alive && d.hiveId === hive.hiveId);
      if (seeder) {
        acidPoolCounter += 1;
        acidPools.push({ zone: createAcidPool(`acid-pool-${acidPoolCounter}`, seeder.x, seeder.y), state: { tickClockMs: 0 } });
      }
    }
  }
  for (const pool of acidPools) {
    if (stepHazardZone(pool.zone, pool.state, fixedDtMs) && isInsideHazard(pool.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(pool.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: pool.zone.damagePerTick, source: pool.zone.id });
      if (pool.zone.statusOnTick && playerStatus) {
        playerStatus.apply(pool.zone.statusOnTick);
        bus.emit("StatusApplied", { targetId: "player", status: pool.zone.statusOnTick.kind });
      }
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }

  // AF-052: Fleet Coordination — Scrap climbs from Salvage Recovery; once
  // affordable AND off cooldown, the fleet spends it on Deployable Turrets
  // (a real reinforcement through the shared spawn path), Scrap Shields,
  // and Emergency Repairs — an actively-spent economy, not a passive buff.
  for (const fleet of nomadFleets) {
    fleet.update(fixedDtMs);
    const fleetMembers = drones.filter((d) => d.alive && d.fleetId === fleet.fleetId);
    if (fleetMembers.length === 0) continue;
    const anchor = fleetMembers[0]!;
    if (fleet.tryDeployTurret()) {
      const builtId = spawnEnemyInstance(NOMAD_ENEMIES.find((d) => d.id === "scout-skiff")!, anchor.x, anchor.y, false);
      const built = drones.find((d) => d.id === builtId);
      if (built) built.fleetId = fleet.fleetId;
      fleet.enrolMember(builtId);
      director.notifyEnemiesSpawned(1, 0); // the Director's census stays accurate
    }
    if (fleet.tryRaiseScrapShield()) {
      for (const drone of fleetMembers) drone.hull = Math.min(drone.maxHull, drone.hull + NOMAD_FLEET_TUNING.shieldBurstAmount * 0.5);
    }
    if (fleet.tryEmergencyRepair()) {
      for (const drone of fleetMembers) drone.hull = Math.min(drone.maxHull, drone.hull + NOMAD_FLEET_TUNING.repairHealAmount);
    }
  }

  // AF-053: Containment System — Reactor Stability ticks down on its own,
  // repaired by any living Containment Sentinel; the instant Collapse
  // fires, a single Singularity Charge detonates at the protocol's
  // location, reusing AF-035's exact hazard engine a fifth time.
  for (const protocol of paragonProtocols) {
    protocol.update(fixedDtMs);
    if (protocol.consumeCollapseEvent()) {
      const anchor = drones.find((d) => d.alive && d.protocolId === protocol.protocolId);
      if (anchor) {
        singularityChargeCounter += 1;
        singularityCharges.push({
          zone: createSingularityCharge(`singularity-charge-${singularityChargeCounter}`, anchor.x, anchor.y),
          state: { tickClockMs: 0 },
        });
      }
      lootNotices.push({ text: "CONTAINMENT COLLAPSE — REACTOR OVERLOAD", colour: "#ff8a1a", ttlMs: 3200 });
    }
  }
  for (const charge of singularityCharges) {
    if (stepHazardZone(charge.zone, charge.state, fixedDtMs) && isInsideHazard(charge.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(charge.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: charge.zone.damagePerTick, source: charge.zone.id });
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }

  // AF-054: Celestial Network — Healing/Ability Synchronisation heals each
  // member by ITS OWN link-derived amount (never a single shared value);
  // Gravity Wells seed on the Gravity Oracle's own cadence, reusing AF-035's
  // exact hazard engine a sixth time.
  for (const constellation of celestialConstellations) {
    for (const drone of drones) {
      if (!drone.alive || drone.constellationId !== constellation.constellationId) continue;
      const healPerSecond = constellation.healPerSecondFor(drone.id);
      if (healPerSecond > 0 && drone.hull < drone.maxHull) {
        drone.hull = Math.min(drone.maxHull, drone.hull + healPerSecond * dt);
      }
    }
  }
  for (const drone of drones) {
    if (!drone.alive || drone.def.id !== "gravity-oracle") continue;
    const clock = (gravityWellClocksMs.get(drone.id) ?? 0) + fixedDtMs;
    if (clock < GRAVITY_WELL_TUNING.seedIntervalMs) {
      gravityWellClocksMs.set(drone.id, clock);
      continue;
    }
    gravityWellClocksMs.set(drone.id, 0);
    if (gravityWells.length < GRAVITY_WELL_TUNING.maxLiveWells) {
      gravityWellCounter += 1;
      gravityWells.push({ zone: createGravityWell(`gravity-well-${gravityWellCounter}`, drone.x, drone.y), state: { tickClockMs: 0 } });
    }
  }
  for (const well of gravityWells) {
    if (stepHazardZone(well.zone, well.state, fixedDtMs) && isInsideHazard(well.zone, player.x, player.y) && !player.invulnerable) {
      const intake = playerDefence.takeDamage(well.zone.damagePerTick);
      bus.emit("PlayerDamaged", { amount: well.zone.damagePerTick, source: well.zone.id });
      if (intake.defeated) {
        endRun("defeat");
        return;
      }
    }
  }

  // AF-056: the Conductor's clock — advance the Recovery Window, feed the
  // live playerHealth input, and land whatever the Spawn Queue releases
  // this tick (two different faction directives flushing together IS a
  // dual-faction moment).
  if (conductor) {
    const defence = playerDefence.snapshot;
    const released = conductor.update(fixedDtMs, defence.maxHull > 0 ? defence.hull / defence.maxHull : 1);
    for (const directive of released) executeWave(directive);
  }

  // AF-055: the Eclipsed — every member's personal fall advances (slowed by
  // the Warden); Ability Mimicry reads the player's own progression level;
  // Memory Echoes surface as capped, non-interruptive notice text.
  for (const group of eclipsedGroups) {
    group.update(fixedDtMs);
    group.recordPlayerLevel(xpSystem?.snapshot.level ?? 0);
    const echo = group.consumeEchoEvent();
    if (echo) lootNotices.push({ text: echo, colour: "#c9d4e8", ttlMs: 3600 });
  }

  // AF-033: EnemyDef governs movement/attack; melee is contact damage through
  // the real pipeline, ranged fires a real WeaponDef through the same engine
  // the player's weapon uses.
  for (const drone of drones) {
    if (!drone.alive) continue;
    // AF-032: statuses a weapon applied tick down through the same StatusEngine as the player's.
    drone.status.update(fixedDtMs);
    drone.runtime.update(fixedDtMs);
    if (drone.hull <= 0) {
      killDrone(drone);
      continue;
    }

    // AF-034: Regeneration mutation — a MutationEffect layered alongside the def, not merged into it.
    if (drone.mutationEffects.regenPerSecond > 0) {
      drone.hull = Math.min(drone.maxHull, drone.hull + drone.mutationEffects.regenPerSecond * dt);
    }

    const hullFraction = drone.hull / drone.maxHull;

    // AF-034: Elite AI gains Retreat Logic — disengage below a critical-health
    // threshold instead of pressing the attack, then resume once recovered.
    if (drone.elite && hullFraction < 0.25 && (drone.runtime.ai.current === "targetAcquired" || drone.runtime.ai.current === "attack")) {
      drone.runtime.ai.transitionTo("retreat");
    }
    if (drone.runtime.ai.current === "retreat") {
      stepEnemyMovement("retreat", drone, fixedDtMs, {
        targetX: player.x,
        targetY: player.y,
        speed: drone.def.moveSpeed,
        bounds: ARENA,
      });
      // AF-046: a scattered squad holds its retreat order for the full scatter
      // window regardless of hull — command structure overrides self-preservation logic.
      const scatterHold = squadOf(drone)?.scatterActive ?? false;
      if (hullFraction > 0.35 && !scatterHold) drone.runtime.ai.transitionTo("recover");
      continue;
    }

    // AF-033: advance the AI state chain — idle→patrol→search→targetAcquired
    // happens immediately (no patrol waypoints yet); attack is entered the
    // tick a telegraphed attack resolves and exited back to targetAcquired.
    // AF-034 adds recover→targetAcquired, closing the retreat loop.
    const aiState = drone.runtime.ai.current;
    if (aiState === "idle") drone.runtime.ai.transitionTo("patrol");
    else if (aiState === "patrol") drone.runtime.ai.transitionTo("search");
    else if (aiState === "search") drone.runtime.ai.transitionTo("targetAcquired");
    else if (aiState === "attack") drone.runtime.ai.transitionTo("targetAcquired");
    else if (aiState === "recover") drone.runtime.ai.transitionTo("targetAcquired");

    const enrage = drone.runtime.specialAbilityBonus(hullFraction);
    const ecosystem = ecosystemOf(drone);
    const hive = hiveOf(drone);
    const protocol = protocolOf(drone);
    const eclipsed = eclipsedOf(drone);
    const speedMultiplier =
      1 +
      (enrage.movementSpeed ?? 0) +
      (ecosystem?.speedBonus ?? 0) +
      (hive?.speedBonus ?? 0) +
      (protocol?.speedBonus ?? 0) +
      // AF-055: desperation moves faster the further gone the member is — per its OWN stage.
      (eclipsed?.speedBonusFor(drone.id) ?? 0);
    // AF-046: Focus Fire — coordinated squad members hit harder while the
    // Captain lives; broken squads lose the bonus, not just the formation.
    // AF-047: Target Synchronisation — the machine equivalent, routed through
    // the Command Core and lost the moment the network degrades.
    // AF-048: Resonance damage bonus — the third doctrine, composed the same
    // way but continuous: it never turns fully off, just weaker per node lost.
    const squad = squadOf(drone);
    const network = networkOf(drone);
    const swarm = swarmOf(drone);
    const site = siteOf(drone);
    const fleet = fleetOf(drone);
    const constellation = constellationOf(drone);
    const focusFire = squad?.commandActive ? 1.15 : 1;
    const targetSync = 1 + (network?.targetSyncDamageBonus ?? 0);
    const resonance = 1 + (ecosystem?.damageBonus ?? 0);
    const corruption = 1 + (swarm?.damageBonus ?? 0);
    const targetInformation = 1 + (site?.damageBonus ?? 0);
    const hiveTargetInfo = 1 + (hive?.damageBonus ?? 0);
    const nomadTargetPriority = 1 + (fleet?.targetPriorityBonus ?? 0);
    const energyOverload = 1 + (protocol?.damageBonus ?? 0);
    // AF-054: Solar Energy — computed per-entity from its own link count, unlike every prior bonus here.
    const solarEnergy = 1 + (constellation?.damageBonusFor(drone.id) ?? 0);
    // AF-055: the member's own fall + the group's mirror of the player's progression.
    const eclipsedMirror = 1 + (eclipsed?.damageBonusFor(drone.id) ?? 0);
    const damageMultiplier =
      (1 + (enrage.damage ?? 0)) *
      focusFire *
      targetSync *
      resonance *
      corruption *
      targetInformation *
      hiveTargetInfo *
      nomadTargetPriority *
      energyOverload *
      solarEnergy *
      eclipsedMirror;
    const statusSlow = drone.status.has("freeze") || drone.status.has("stasis") ? 0 : drone.status.has("slow") ? 0.6 : 1;

    // AF-046: Formation Flying — the first live producer for AF-033's reserved
    // formationAnchor/formationOffset movement context: members fly their
    // assigned wedge slot on the Captain while the squad is coordinated.
    // AF-047: machine formation-behaviour units anchor on the Command Core
    // instead; other machines keep their own vectors (crossfire, not a conga line).
    const captainDrone = squad?.commandActive ? drones.find((d) => d.alive && d.squadId === squad.squadId && squad.isCaptain(d.id)) : undefined;
    const coreDrone =
      network?.targetSyncActive && !network.isCore(drone.id) && drone.def.movementBehaviour === "formation"
        ? drones.find((d) => d.alive && d.networkId === network.networkId && network.isCore(d.id))
        : undefined;
    const anchorDrone = captainDrone ?? coreDrone;
    const formationOffset = captainDrone
      ? squad?.offsetFor(drone.id)
      : coreDrone && drone.networkOffsetX !== null && drone.networkOffsetY !== null
        ? { x: drone.networkOffsetX, y: drone.networkOffsetY }
        : null;
    stepEnemyMovement(formationOffset && anchorDrone ? "formation" : drone.def.movementBehaviour, drone, fixedDtMs, {
      targetX: player.x,
      targetY: player.y,
      speed: drone.def.moveSpeed * speedMultiplier * statusSlow,
      bounds: ARENA,
      preferredRange: 6,
      // AF-049: Shadow Hunter's teleport movement needs a deterministic source — the
      // same seeded combatRng every other enemy/weapon roll already draws from.
      rng: () => combatRng!.next(),
      ...(formationOffset && anchorDrone
        ? {
            formationAnchorX: anchorDrone.x,
            formationAnchorY: anchorDrone.y,
            formationOffsetX: formationOffset.x,
            formationOffsetY: formationOffset.y,
          }
        : {}),
    });

    const dx = player.x - drone.x;
    const dy = player.y - drone.y;
    const distance = Math.hypot(dx, dy) || 0.0001;

    if (drone.def.attack.mechanism.kind === "melee") {
      const mechanism = drone.def.attack.mechanism;
      const canEngage = distance <= mechanism.contactRangeUnits;
      const attackResolved = drone.runtime.tryAttack(canEngage);
      if (attackResolved) drone.runtime.ai.transitionTo("attack");
      if (attackResolved && !player.invulnerable) {
        const packet = {
          baseDamage: mechanism.baseDamage * damageMultiplier,
          kind: "direct",
          school: mechanism.damageSchool,
          critChance: 0,
          critMultiplier: 1,
        } as const;
        const result = resolveDamage(packet, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, combatRng);
        const intake = playerDefence.takeDamage(result.finalDamage);
        bus.emit("PlayerDamaged", { amount: result.finalDamage, source: drone.id });
        movement.applyImpulse((-dx / distance) * 5, (-dy / distance) * 5, 100);
        if (intake.shieldBroken) {
          bus.emit("ShieldBroken", { targetId: "player" });
          camera.shake("ShieldBreak");
        } else {
          camera.shake("WeaponImpact");
        }
        // AF-034: a status mutation (Cryogenic/Incendiary/Corrupted) on a melee attacker —
        // melee has no statusOnHit field of its own, so this reaches the player through
        // MutationEffects instead.
        if (drone.mutationEffects.attackStatusOnHit && playerStatus && combatRng.next() < drone.mutationEffects.attackStatusOnHit.chance) {
          const status = drone.mutationEffects.attackStatusOnHit;
          playerStatus.apply({ kind: status.kind, strength: status.strength, durationMs: status.durationMs });
          bus.emit("StatusApplied", { targetId: "player", status: status.kind });
        }
        if (intake.defeated) {
          endRun("defeat");
          return;
        }
      }
    } else {
      const weapon = drone.def.attack.mechanism.weapon;
      const canEngage = distance <= weapon.range;
      if (drone.runtime.tryAttack(canEngage)) {
        drone.runtime.ai.transitionTo("attack");
        const angle = Math.atan2(dy, dx);
        // AF-034: an elite's mutation status takes priority over the base weapon's own.
        fireHostileProjectiles(drone.x, drone.y, weapon, angle, damageMultiplier, drone.mutationEffects.attackStatusOnHit);
      }
    }
  }

  // AF-035: Boss — introduction beat, then phases/enrage/attack drive through the
  // exact same StateMachine/DefenceState/EnemyRuntime/movement/weapon engines above.
  // AF-057: the Boss Director decorates this encounter — cinematic one-shots,
  // between-phase breathing room, the summon queue, arena escalation, and
  // paced ceremony lines, all without touching the locked BossRuntime.
  if (bossRuntime) {
    bossDirector?.update(fixedDtMs);
    const cinematic = bossDirector?.consumeCinematicEvent();
    if (cinematic === "bossArrival") {
      lootNotices.push({ text: "THE VAULT WAKES — ARENA ACTIVATED", colour: "#ffc652", ttlMs: 2800 });
      camera.shake("ShieldBreak");
    } else if (cinematic === "victorySequence") {
      lootNotices.push({ text: "THE WATCH ENDS — VAULT SILENT", colour: "#ffc652", ttlMs: 3200 });
    }
    if (bossRuntime.snapshot.state === "introduction") {
      bossIntroRemainingMs = Math.max(0, bossIntroRemainingMs - fixedDtMs);
      if (bossIntroRemainingMs === 0) bossRuntime.begin();
    } else if (bossRuntime.snapshot.state === "rewardCeremony") {
      // AF-057 §Reward Ceremony: the memory lines land one at a time — paced presentation.
      const ceremonyLine = bossDirector?.consumeCeremonyLine();
      if (ceremonyLine) lootNotices.push({ text: ceremonyLine, colour: "#ffc652", ttlMs: 2600 });
    } else {
      bossFightElapsedMs += fixedDtMs;
      bossRuntime.update(fixedDtMs);
      // AF-057 §Phase Management: a phase change opens breathing room, evolves
      // the arena (the existing AF-035 hazard grows), and queues the summon plan.
      if (bossRuntime.snapshot.phaseIndex !== lastBossPhaseIndex && bossDirector) {
        lastBossPhaseIndex = bossRuntime.snapshot.phaseIndex;
        bossDirector.notifyPhaseChanged(lastBossPhaseIndex);
        bossHazardZone.radius = BOSS_HAZARD_BASE_RADIUS * bossDirector.hazardRadiusScaleFor(lastBossPhaseIndex);
        lootNotices.push({ text: "THE ARENA EVOLVES — HOLD YOUR GROUND", colour: "#ffc652", ttlMs: 2600 });
      }
      if (bossRuntime.snapshot.state === "deathSequence") {
        if (!bossRewardsGranted) {
          bossRewardsGranted = true;
          grantBossRewards();
          // AF-057 §Boss Memory: victories + fastest kill persist through AF-026's stats.
          if (bossDirector) {
            bossDirector.notifyDefeated();
            feedCampaignProgress(CAMPAIGN_COUNTER_BOSSES); // AF-068/069: guardians fell for the story too
            meta.recordStat(`boss:${sandboxBoss.id}:victories`);
            const bestKey = `boss:${sandboxBoss.id}:fastestKillMs`;
            const delta = BossDirectorRuntime.fastestKillStatDelta(meta.stat(bestKey), bossFightElapsedMs);
            if (delta !== 0) meta.recordStat(bestKey, delta);
            persistMeta();
            const attempts = meta.stat(`boss:${sandboxBoss.id}:attempts`);
            const victories = meta.stat(`boss:${sandboxBoss.id}:victories`);
            bossDirector.queueCeremonyLines([
              `VICTORY — ATTEMPT ${attempts.toFixed(0)}, TRIUMPH ${victories.toFixed(0)}`,
              `TIME ${(bossFightElapsedMs / 1000).toFixed(1)}s · BEST ${(meta.stat(bestKey) / 1000).toFixed(1)}s`,
            ]);
          }
          bus.emit("EnemyKilled", { enemyId: sandboxBoss.id, elite: false, boss: true });
          advanceRunPhaseTo("RewardPhase");
        }
        bossRuntime.ai.transitionTo("rewardCeremony");
      } else {
        // AF-057 §Summon System: the queue drains one spec per cadence, after
        // the breathing room — through the same shared spawn path as everything.
        const summon = bossDirector?.consumeSummon();
        if (summon && director) {
          const summonDef = SANDBOX_ENEMIES.find((d) => d.id === summon.enemyId);
          if (summonDef) {
            for (let i = 0; i < summon.count; i += 1) {
              spawnEnemyInstance(summonDef, bossMotion.x + (i - summon.count / 2) * 2, bossMotion.y + 2, summon.elite);
            }
            director.notifyEnemiesSpawned(summon.count, summon.elite ? summon.count : 0);
            lootNotices.push({ text: "THE SENTINEL CALLS ITS GUARD", colour: "#ffc652", ttlMs: 2400 });
          }
        }
        stepEnemyMovement(bossRuntime.movementBehaviour, bossMotion, fixedDtMs, {
          targetX: player.x,
          targetY: player.y,
          speed: bossRuntime.moveSpeed,
          bounds: ARENA,
          preferredRange: 8,
        });
        const bossDx = player.x - bossMotion.x;
        const bossDy = player.y - bossMotion.y;
        const bossDistance = Math.hypot(bossDx, bossDy) || 0.0001;
        const bossWeapon = bossRuntime.attack.mechanism.kind === "ranged" ? bossRuntime.attack.mechanism.weapon : null;
        if (bossWeapon) {
          const canEngage = bossDistance <= bossWeapon.range;
          // AF-057 §Player Recovery: the boss holds fire while the arena evolves —
          // recovery through repositioning, never artificial healing.
          if (!bossDirector?.attacksHeld && bossRuntime.tryAttack(canEngage)) {
            const angle = Math.atan2(bossDy, bossDx);
            fireHostileProjectiles(bossMotion.x, bossMotion.y, bossWeapon, angle, bossRuntime.damageMultiplier, null);
          }
        }
        // AF-035 §Arena Design: a live hazard zone during the Collapse phase — reuses
        // AF-021's StatusEngine exactly, the same pattern as AF-033's Status Explosion.
        if (bossRuntime.currentPhase.mechanic === "arenaManipulation") {
          bossHazardZone.x = bossMotion.x;
          bossHazardZone.y = bossMotion.y;
          if (stepHazardZone(bossHazardZone, bossHazardState, fixedDtMs) && isInsideHazard(bossHazardZone, player.x, player.y) && !player.invulnerable) {
            const intake = playerDefence.takeDamage(bossHazardZone.damagePerTick);
            bus.emit("PlayerDamaged", { amount: bossHazardZone.damagePerTick, source: sandboxBoss.id });
            if (bossHazardZone.statusOnTick && playerStatus) {
              playerStatus.apply(bossHazardZone.statusOnTick);
              bus.emit("StatusApplied", { targetId: "player", status: bossHazardZone.statusOnTick.kind });
            }
            if (intake.defeated) {
              endRun("defeat");
              return;
            }
          }
        }
      }
    }
  }

  // AF-037: Mission — objective completion drives Extraction; a real (if
  // short) countdown, not an instant skip, closes out the mission structure.
  if (missionRuntime && session) {
    missionRuntime.update(fixedDtMs);
    if (session.phase === "RewardPhase" && missionRuntime.primaryObjectivesComplete) {
      advanceRunPhaseTo("Extraction");
      extractionRemainingMs = 5000;
    } else if (session.phase === "Extraction") {
      extractionRemainingMs = Math.max(0, extractionRemainingMs - fixedDtMs);
      if (extractionRemainingMs === 0) advanceRunPhaseTo("Results");
    }
    const missionEvent = missionRuntime.tryTriggerEvent();
    if (missionEvent) {
      bus.emit("EnvironmentalEventTriggered", { eventType: MISSION_EVENT_TO_ENVIRONMENTAL_EVENT[missionEvent] });
      lootNotices.push({ text: missionEvent.replace(/([A-Z])/g, " $1").trim().toUpperCase(), colour: "#3fd4f5", ttlMs: 2600 });
    }
  }

  // AF-036: Biome — weather rotation feeds AF-020's own MovementModifier "force"
  // kind, hazards reuse AF-035's exact hazard-zone engine, Biome Events extend
  // AF-017's existing EnvironmentalEventTriggered fact.
  if (biomeRuntime) {
    biomeRuntime.update(fixedDtMs);
    const weather = biomeRuntime.currentWeather;
    if (weather && (weather.windForceX !== 0 || weather.windForceY !== 0)) {
      movement.addModifier({
        id: "biome-weather-wind",
        kind: "force",
        forceX: weather.windForceX,
        forceY: weather.windForceY,
        durationMs: 1000, // refreshed every tick while the weather is active
      });
    }
    for (const hazard of biomeRuntime.tickHazards(fixedDtMs)) {
      if (isInsideHazard(hazard, player.x, player.y) && !player.invulnerable) {
        const intake = playerDefence.takeDamage(hazard.damagePerTick);
        bus.emit("PlayerDamaged", { amount: hazard.damagePerTick, source: `biome-hazard-${hazard.id}` });
        if (hazard.statusOnTick && playerStatus) {
          playerStatus.apply(hazard.statusOnTick);
          bus.emit("StatusApplied", { targetId: "player", status: hazard.statusOnTick.kind });
        }
        if (intake.defeated) {
          endRun("defeat");
          return;
        }
      }
    }
    const biomeEvent = biomeRuntime.tryTriggerEvent();
    if (biomeEvent) {
      bus.emit("EnvironmentalEventTriggered", { eventType: biomeEvent });
      lootNotices.push({ text: biomeEvent.replace(/([A-Z])/g, " $1").trim().toUpperCase(), colour: "#4de868", ttlMs: 2600 });
    }
  }

  // XP gems: magnetism + collection (AF-022).
  xpPickups?.update(fixedDtMs, player.x, player.y, {
    pickupRadius: DEFAULT_XP_TUNING.basePickupRadius,
    magnetRadius: DEFAULT_XP_TUNING.baseMagnetRadius + sandboxBuild.magnetBonus,
  });

  // Ground loot collection + notice lifetimes (AF-023).
  groundLoot?.update(player.x, player.y, DEFAULT_XP_TUNING.basePickupRadius + 0.4);
  for (const notice of lootNotices) notice.ttlMs -= fixedDtMs;
  lootNotices = lootNotices.filter((n) => n.ttlMs > 0);

  // Level-up: consume one queued level, present an offer (AF-022 §4).
  if (xpSystem && upgradePool && xpSystem.snapshot.pendingLevels > 0 && machine.overlays.length === 0) {
    xpSystem.consumePendingLevel();
    currentOffer = upgradePool.offer(DEFAULT_XP_TUNING.choicesPerLevel).choices;
    machine.pushOverlay("LevelUp");
    return;
  }

  // Weapon (AF-032): nearest-priority target, WeaponRuntime gates cooldown
  // + energy cost, fire pattern determines spawn geometry.
  if (weaponRuntime) {
    weaponRuntime.intervalScale = sandboxBuild.fireIntervalScale;
    weaponRuntime.update(fixedDtMs);
    const candidates: TargetCandidate[] = drones
      .filter((d) => d.alive)
      .map((d) => ({ id: d.id, x: d.x, y: d.y, health: d.hull, maxHealth: d.maxHull, isBoss: false, isElite: d.elite }));
    const bossAlive =
      bossRuntime && bossRuntime.snapshot.state !== "introduction" && bossRuntime.snapshot.state !== "deathSequence" && bossRuntime.snapshot.state !== "rewardCeremony";
    if (bossAlive && bossRuntime) {
      candidates.push({
        id: sandboxBoss.id,
        x: bossMotion.x,
        y: bossMotion.y,
        health: bossRuntime.snapshot.hull,
        maxHealth: bossRuntime.snapshot.maxHull,
        isBoss: true,
        isElite: false,
      });
    }
    // AF-035: a live Boss finally gives AF-021's bossPriority selector a real consumer.
    const target = bossAlive ? TARGET_SELECTORS.boss(candidates, player.x, player.y) : TARGET_SELECTORS.nearest(candidates, player.x, player.y);
    if (target && Math.hypot(target.x - player.x, target.y - player.y) <= sandboxWeapon.range) {
      const angle = Math.atan2(target.y - player.y, target.x - player.x);
      const shots = weaponRuntime.tryFire(angle);
      if (shots) {
        for (const shot of shots) {
          const projectile = projectilePool.acquire();
          projectile.x = player.x;
          projectile.y = player.y;
          projectile.originX = player.x;
          projectile.originY = player.y;
          projectile.velocityX = Math.cos(shot.angle) * sandboxWeapon.projectileSpeed;
          projectile.velocityY = Math.sin(shot.angle) * sandboxWeapon.projectileSpeed;
          projectile.ttlMs = (sandboxWeapon.range / sandboxWeapon.projectileSpeed) * 1000 + 200;
          projectile.elapsedMs = 0;
          projectile.bouncesRemaining = 1;
          projectile.reversed = false;
          projectile.behaviour = shot.behaviour;
          projectile.pierceRemaining = sandboxWeapon.pierceCount;
          projectile.live = true;
          projectiles.push(projectile);
        }
      }
    }
  }

  // Projectiles advance (deterministic per-behaviour motion, AF-032 §2) and resolve hits.
  // AF-033: hostile (enemy-fired) projectiles hit the player, never other drones.
  for (const projectile of projectiles) {
    if (!projectile.live) continue;
    stepProjectile(projectile.behaviour, projectile, fixedDtMs, { bounds: ARENA });
    projectile.ttlMs -= fixedDtMs;
    if (projectile.ttlMs <= 0) {
      projectile.live = false;
      continue;
    }

    if (projectile.hostile) {
      if (Math.hypot(player.x - projectile.x, player.y - projectile.y) < 0.6) {
        projectile.live = false;
        if (!player.invulnerable) {
          const packet = {
            baseDamage: projectile.damageBaseDamage,
            kind: projectile.damageSourceKind,
            school: projectile.damageSchool,
            critChance: projectile.damageCritChance,
            critMultiplier: projectile.damageCritMultiplier,
          } as const;
          const result = resolveDamage(packet, NEUTRAL_MODIFIERS, { values: {} }, DEFAULT_COMBAT_TUNING, combatRng);
          const intake = playerDefence.takeDamage(result.finalDamage);
          bus.emit("PlayerDamaged", { amount: result.finalDamage, source: "enemy-projectile" });
          if (intake.shieldBroken) {
            bus.emit("ShieldBroken", { targetId: "player" });
            camera.shake("ShieldBreak");
          } else {
            camera.shake("WeaponImpact");
          }
          if (projectile.statusOnHit && playerStatus && combatRng.next() < projectile.statusOnHit.chance) {
            playerStatus.apply({
              kind: projectile.statusOnHit.kind,
              strength: projectile.statusOnHit.strength,
              durationMs: projectile.statusOnHit.durationMs,
            });
            bus.emit("StatusApplied", { targetId: "player", status: projectile.statusOnHit.kind });
          }
          if (intake.defeated) {
            endRun("defeat");
            return;
          }
        }
      }
      continue;
    }

    // AF-035: the Boss shares the player's own damage pipeline — "boss" is already
    // AF-021's own DamageSourceKind, with its own resistance override built in.
    if (bossRuntime && bossRuntime.snapshot.state !== "introduction" && bossRuntime.snapshot.state !== "deathSequence" && bossRuntime.snapshot.state !== "rewardCeremony") {
      if (Math.hypot(bossMotion.x - projectile.x, bossMotion.y - projectile.y) < 1.2) {
        const result = resolveDamage(
          { ...playerPacket(), kind: "boss" },
          {
            ...NEUTRAL_MODIFIERS,
            weapon: sandboxBuild.weaponBonus,
            research: sandboxBuild.researchWeaponBonus,
            equipment:
              sandboxBuild.equipmentWeaponBonus +
              (relicSystem.aggregate.bonuses.damage ?? 0) +
              (commanderRuntime?.bonuses.damage ?? 0),
          },
          { values: {} },
          DEFAULT_COMBAT_TUNING,
          combatRng,
        );
        const finalDamage = result.finalDamage * bossRuntime.incomingDamageMultiplier;
        bossRuntime.defence.takeDamage(finalDamage);
        // AF-035: a fixed fraction of every hit also chips the boss's one weak point —
        // aiming at a specific sub-hitbox is a Hangar/targeting-UI concern, registered future.
        const weakPoint = sandboxBoss.weakPoints[0];
        if (weakPoint) bossRuntime.applyWeakPointDamage(weakPoint.id, finalDamage * 0.15);
        hitCount += 1;
        if (result.critical) critCount += 1;
        weaponMastery.recordHit(result.critical); // AF-075
        weaponMastery.recordBossDamage(finalDamage);
        bus.emit("DamageDealt", { amount: finalDamage, critical: result.critical, kind: "boss", targetId: sandboxBoss.id });
        commanderRuntime?.notifyDamageDealt(finalDamage);
        const popup = popupPool.acquire();
        popup.x = bossMotion.x;
        popup.y = bossMotion.y;
        popup.text = `${Math.round(finalDamage)}`;
        popup.critical = result.critical;
        popup.ttlMs = 600;
        popup.live = true;
        popups.push(popup);
        if (projectile.pierceRemaining > 0) {
          projectile.pierceRemaining -= 1;
        } else {
          projectile.live = false;
        }
        continue;
      }
    }

    for (const drone of drones) {
      if (!drone.alive) continue;
      if (Math.hypot(drone.x - projectile.x, drone.y - projectile.y) < 0.6) {
        const result = resolveDamage(
          playerPacket(),
          {
            ...NEUTRAL_MODIFIERS,
            weapon: sandboxBuild.weaponBonus,
            research: sandboxBuild.researchWeaponBonus,
            equipment:
              sandboxBuild.equipmentWeaponBonus +
              (relicSystem.aggregate.bonuses.damage ?? 0) +
              (commanderRuntime?.bonuses.damage ?? 0),
          },
          { values: {} },
          DEFAULT_COMBAT_TUNING,
          combatRng,
        );
        // AF-047: Shared Shields + Adaptive AI — a networked machine takes
        // lattice-reduced, school-adapted damage while its network is linked;
        // the network also analyses what hit it (§Adaptive AI, damageTypes input).
        const droneNetwork = networkOf(drone);
        let appliedDamage = result.finalDamage;
        if (droneNetwork) {
          droneNetwork.recordIncomingDamage(sandboxWeapon.damageSchool);
          appliedDamage *= droneNetwork.incomingDamageFactor(sandboxWeapon.damageSchool);
        }
        // AF-049: Reality Stability — corruption-scaled incoming-damage reduction,
        // the Swarm's own take on the same single damage-application point.
        const droneSwarm = swarmOf(drone);
        if (droneSwarm) appliedDamage *= 1 - droneSwarm.incomingDamageReduction;
        // AF-050: Shield Capacity — the Ancient Network's stage-stepped
        // incoming-damage reduction, the fifth doctrine's own take on the
        // same single damage-application point.
        const droneSite = siteOf(drone);
        if (droneSite) appliedDamage *= 1 - droneSite.incomingDamageReduction;
        // AF-052: Escort Protection — a fully independent, headcount-only
        // incoming-damage reduction; never derived from Scrap.
        const droneFleet = fleetOf(drone);
        if (droneFleet) appliedDamage *= 1 - droneFleet.escortDamageReduction;
        // AF-053: Adaptive Shields — pre-collapse incoming-damage reduction;
        // every point of damage dealt also cracks Reactor Stability further,
        // the doctrine's live Adaptive Technology input.
        const droneProtocol = protocolOf(drone);
        if (droneProtocol) {
          appliedDamage *= 1 - droneProtocol.incomingDamageReduction;
          droneProtocol.recordIncomingDamage(appliedDamage);
        }
        // AF-054: Shield Strength — computed per-entity from its own link
        // count, the same "no single shared value" shape as Solar Energy above.
        const droneConstellation = constellationOf(drone);
        if (droneConstellation) appliedDamage *= 1 - droneConstellation.incomingDamageReductionFor(drone.id);
        drone.hull -= appliedDamage;
        hitCount += 1;
        if (result.critical) critCount += 1;
        weaponMastery.recordHit(result.critical); // AF-075
        bus.emit("DamageDealt", { amount: appliedDamage, critical: result.critical, kind: result.kind, targetId: drone.id });
        commanderRuntime?.notifyDamageDealt(appliedDamage);
        // AF-032: status-on-hit applies through the same StatusEngine every status-inflicting system already uses.
        if (sandboxWeapon.statusOnHit && combatRng.next() < sandboxWeapon.statusOnHit.chance) {
          drone.status.apply({
            kind: sandboxWeapon.statusOnHit.kind,
            strength: sandboxWeapon.statusOnHit.strength,
            durationMs: sandboxWeapon.statusOnHit.durationMs,
          });
          bus.emit("StatusApplied", { targetId: drone.id, status: sandboxWeapon.statusOnHit.kind });
        }
        const popup = popupPool.acquire();
        popup.x = drone.x;
        popup.y = drone.y;
        popup.text = `${Math.round(appliedDamage)}`; // AF-047: the number shown IS the number applied (shield lattice included)
        popup.critical = result.critical;
        popup.ttlMs = 600;
        popup.live = true;
        popups.push(popup);
        if (drone.hull <= 0) {
          killDrone(drone);
        }
        // AF-032: Pierce lets a projectile survive a hit instead of despawning immediately.
        if (projectile.pierceRemaining > 0) {
          projectile.pierceRemaining -= 1;
        } else {
          projectile.live = false;
          break;
        }
      }
    }
  }

  // Popup lifetimes + list compaction back into pools.
  for (const popup of popups) {
    if (!popup.live) continue;
    popup.ttlMs -= fixedDtMs;
    popup.y -= 1.5 * dt;
    if (popup.ttlMs <= 0) popup.live = false;
  }
  projectiles = projectiles.filter((p) => (p.live ? true : (projectilePool.release(p), false)));
  popups = popups.filter((p) => (p.live ? true : (popupPool.release(p), false)));
  drones = drones.filter((d) => d.alive);

  playerDefence.update(fixedDtMs);
}

const CAMERA_MODE_BY_STATE: Partial<Record<GameStateId, CameraMode>> = {
  MainMenu: "Menu",
  GalaxyCommand: "GalaxyCommand",
  MissionSelect: "MissionBriefing",
  Gameplay: "Gameplay",
  MissionComplete: "MissionComplete",
  Defeat: "Defeat",
  Statistics: "Results",
};

const machine = new StateMachine<GameStateId>({
  initial: "Boot",
  transitions: GAME_TRANSITIONS,
  overlayHosts: OVERLAY_HOSTS,
  strict: import.meta.env.DEV,
  onTransition: (info) => {
    if (info.kind === "transition") {
      bus.emit("GameStateChanged", { from: info.from, to: info.to, durationMs: info.durationMs });
    } else if (info.kind === "overlay-push") {
      bus.emit("OverlayPushed", { overlay: info.to, base: machine.base });
    } else {
      bus.emit("OverlayPopped", { overlay: info.from, base: machine.base });
    }
    const cameraMode = CAMERA_MODE_BY_STATE[machine.base];
    if (cameraMode) camera.setMode(cameraMode);
    syncInputContext();
    render();
  },
  onRejected: (from, to, reason) =>
    log.warn("state", `refused transition ${from} → ${to}`, { reason }),
});

/** Input context follows the state machine (AF-019 §2). */
function syncInputContext(): void {
  if (machine.overlays.length > 0) input.setContext("overlay");
  else if (machine.base === "Gameplay") input.setContext("gameplay");
  else input.setContext("menu");
}

/** Placeholder screens — one per state, replaced as AF-017+ modules land. */
function screen(title: string, subtitle: string, actions: Array<[string, () => void]>): void {
  if (!app) return;
  app.innerHTML = "";
  const box = document.createElement("div");
  box.style.cssText = "text-align:center;max-width:32rem";
  const h1 = document.createElement("h1");
  h1.textContent = title;
  h1.style.cssText =
    "font-size:2rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--energy-white);margin-bottom:0.5rem";
  const p = document.createElement("p");
  p.textContent = subtitle;
  p.style.cssText = "color:var(--neutral-grey);margin-bottom:1.5rem;white-space:pre-line";
  box.append(h1, p);
  for (const [label, onClick] of actions) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText = [
      "display:block",
      "margin:0.5rem auto",
      "min-width:16rem",
      "padding:0.6rem 1.2rem",
      "background:rgba(16,26,56,0.6)",
      "border:1px solid var(--space-blue)",
      "border-bottom:2px solid var(--energy-violet)",
      "color:var(--energy-white)",
      "font:inherit",
      "letter-spacing:0.08em",
      "cursor:pointer",
    ].join(";");
    button.addEventListener("click", onClick);
    box.appendChild(button);
  }
  app.appendChild(box);
}

function startRun(): void {
  const seed = new Rng(`${Date.now()}`).int(1, 2 ** 31);
  // AF-058: resolve the run's biome from the current system BEFORE anything
  // records a biomeId — the galaxy decides where this expedition happens.
  activeBiome = BIOME_REGISTRY.find((b) => b.id === galaxyRuntime.currentSystem.biomeId) ?? sandboxBiome;
  const missionInstance = generateMission(selectedMissionTemplate, seed);
  session = createRunSession(
    {
      missionId: missionInstance.id,
      commanderId: "placeholder-commander",
      shipId: "placeholder-ship",
      weaponIds: [],
      equipmentIds: [],
      difficulty: "standard",
      ascension: 0,
      biomeId: activeBiome.id,
    },
    seed,
    Date.now(),
  );
  sessionMs = 0;
  // AF-043: the "ships"/"commanders"/"weapons" collection buckets have
  // existed since AF-026 with no producer until now — fielding one for a
  // run is a real discovery, not a new mechanism.
  meta.discover("ships", sandboxShip.id);
  meta.discover("commanders", sandboxCommander.id);
  meta.discover("weapons", sandboxWeapon.id);
  persistMeta();
  missionRuntime = new MissionRuntime(missionInstance, new Rng(seed).fork("mission"));
  extractionRemainingMs = 0;
  biomeRuntime = new BiomeRuntime(activeBiome, new Rng(seed).fork("biome"));
  movement = new PlayerMovement(sandboxShip.movementProfile);
  movement.setPosition(30, 17);
  movement.setBounds(ARENA);
  movement.setObstacles(ARENA_OBSTACLES);
  camera.setBounds(ARENA);
  camera.snapTo(30, 17);
  playerDefence = new DefenceState(sandboxShip.shield, sandboxShip.hull, DEFAULT_COMBAT_TUNING);
  playerStatus = new StatusEngine({
    onTickDamage: (_kind, amount) => playerDefence?.takeDamage(amount),
  });
  combatRng = new Rng(seed).fork("combat");
  drones = [];
  projectiles = [];
  popups = [];
  hitCount = 0;
  critCount = 0;
  bossRuntime = null; // AF-035: fresh run, fresh Boss — respawns when MiniBoss phase is reached again.
  bossDirector = null; // AF-057: the director lives and dies with its encounter.
  outlawSquads = []; // AF-046: squads and mines are run-scoped, like every combat structure here.
  outlawMines = [];
  outlawMineDropClockMs = 0;
  machineNetworks = []; // AF-047: networks are run-scoped too.
  crystalEcosystems = []; // AF-048: ecosystems and growths are run-scoped too.
  crystalGrowths = [];
  crystalSeederClocksMs.clear();
  voidSwarms = []; // AF-049: swarms and corruption zones are run-scoped too.
  voidZones = [];
  voidZoneClocksMs.clear();
  ancientSites = []; // AF-050: sites are run-scoped too.
  xenoHives = []; // AF-051: hives and acid pools are run-scoped too.
  acidPools = [];
  nomadFleets = []; // AF-052: fleets are run-scoped too.
  paragonProtocols = []; // AF-053: protocols and singularity charges are run-scoped too.
  singularityCharges = [];
  celestialConstellations = []; // AF-054: constellations and gravity wells are run-scoped too.
  gravityWells = [];
  gravityWellClocksMs.clear();
  eclipsedGroups = []; // AF-055: lost expeditions are run-scoped too.
  sandboxBuild.weaponBonus = 0;
  sandboxBuild.critBonus = 0;
  sandboxBuild.fireIntervalScale = 1;
  sandboxBuild.speedStacks = 0;
  const research = researchEffects();
  sandboxBuild.magnetBonus = research.magnetBonus;
  sandboxBuild.researchWeaponBonus = research.weaponBonus;
  sandboxBuild.researchLootBonus = research.lootBonus;
  // AF-028: equipped bonuses feed existing systems directly — no new stat pipeline.
  const equipment = equipmentEffects();
  sandboxBuild.equipmentWeaponBonus = equipment.bonuses.damage ?? 0;
  playerDefence.addBarrier(equipment.bonuses.shieldCapacity ?? 0);
  shipRuntime = new ShipRuntime(sandboxShip);
  weaponRuntime = new WeaponRuntime(sandboxWeapon, (amount) => shipRuntime?.trySpendEnergy(amount) ?? true);
  const shipSpeedBonus = shipRuntime.bonuses.movementSpeed ?? 0;
  const equipmentSpeedBonus = equipment.bonuses.movementSpeed ?? 0;
  if (shipSpeedBonus + equipmentSpeedBonus > 0) {
    movement.addModifier({
      id: "ship-and-equipment-speed",
      kind: "speedMultiplier",
      multiplier: 1 + shipSpeedBonus + equipmentSpeedBonus,
      durationMs: Number.MAX_SAFE_INTEGER,
    });
  }
  currentOffer = [];
  relicSystem = newRelicSystem();
  commanderRuntime = new CommanderRuntime(sandboxCommander, () => {
    lootNotices.push({ text: `ULTIMATE READY · ${sandboxCommander.ultimate.name.toUpperCase()}`, colour: "#9b5cff", ttlMs: 2200 });
  });
  xpSystem = new XpSystem(DEFAULT_XP_TUNING, null, (level) =>
    bus.emit("CommanderLevelUp", { level }),
  );
  xpPickups = new XpPickups(DEFAULT_XP_TUNING, (amount, tier) => {
    xpSystem?.addXp(amount);
    bus.emit("XpCollected", { amount, tier });
  });
  upgradePool = new UpgradePool(SANDBOX_UPGRADES, new Rng(seed).fork("upgrades"));
  lootRng = new Rng(seed).fork("loot");
  lootNotices = [];
  lootBankedCount = 0;
  lootCollectedCount = 0;
  groundLoot = new GroundLoot(
    DEFAULT_LOOT_TUNING,
    (drop: LootDrop) => {
      lootCollectedCount += 1;
      lootNotices.push({
        text: `${drop.rarity.toUpperCase()} · ${drop.baseItemId.replaceAll("_", " ")}`,
        colour: RARITY_TABLE[drop.rarity].colour,
        ttlMs: 1600,
      });
      bus.emit("LootCollected", { itemId: drop.baseItemId, rarity: drop.rarity, category: drop.category });
      if (drop.category === "researchSample") bankResearchSample(drop);
      if (drop.category === "craftingMaterial") bankCraftingMaterial(drop);
      // Weapons/equipment/relics land in the persistent inventory (AF-027).
      if (drop.category === "weapon" || drop.category === "equipment" || drop.category === "relic") {
        inventory.add(drop, Date.now());
        persistInventory();
      }
    },
    () => {
      lootBankedCount += 1; // banked to Results — value preserved (AF-023 §6)
    },
  );
  conductor = new DirectorConductor<SpawnDirective>(); // AF-056: run-scoped, like the Director itself
  director = new EnemyDirector({
    // AF-037: a mission modifier may widen Elite Squads for this run only —
    // a per-run tuning clone, never a change to the shared DirectorTuning constant.
    tuning: missionRuntime.eliteSquadSizeBonus !== 0
      ? { ...DEFAULT_DIRECTOR_TUNING, eliteSquadSize: DEFAULT_DIRECTOR_TUNING.eliteSquadSize + missionRuntime.eliteSquadSizeBonus }
      : DEFAULT_DIRECTOR_TUNING,
    rng: new Rng(seed).fork("director"),
    threatInputs: {
      missionDifficulty: 1,
      biomeModifier: biomeRuntime.threatModifier,
      mutatorModifier: missionRuntime.mutatorModifier,
      ascension: session.ascension,
      playerLevel: 1,
      equipmentQuality: 1,
    },
    onDirective: (directive) => {
      bus.emit("SpawnDirectiveIssued", {
        waveType: directive.waveType,
        budgetCost: directive.budgetCost,
        eliteCount: directive.eliteCount,
      });
      spawnWave(directive);
    },
    onPhaseChanged: (from, to) => bus.emit("DirectorPhaseChanged", { from, to }),
    onEnvironmentalEvent: (eventType) =>
      bus.emit("EnvironmentalEventTriggered", { eventType }),
  });
  log.info("run", "run started", { seed });
}

function endRun(result: "victory" | "defeat"): void {
  if (!session) return;
  session.result = result;
  session.playTimeMs = sessionMs;
  director = null;
  bus.emit("RunEnded", { result, seed: session.seed, playTimeMs: sessionMs });
  // AF-084: every expedition becomes part of the player's personal history.
  const missionSnap = missionRuntime?.snapshot ?? null;
  expeditionLog.recordExpedition({
    missionId: selectedMissionTemplate.id,
    tier: MISSION_ROSTER_ENTRIES.find((e) => e.missionId === selectedMissionTemplate.id)?.tier ?? "common",
    result,
    perfect: result === "victory" && missionSnap !== null && missionSnap.optionalDone === missionSnap.optionalTotal,
    optionalsDone: missionSnap?.optionalDone ?? 0,
    bossDefeated: (missionRuntime?.currentValue("missionBossDefeated") ?? 0) > 0,
    playTimeMs: sessionMs,
  });
  // AF-088: the Expedition Journal's Mission History entry mirrors the
  // same real endRun seam — automatically recorded, never player-curated.
  expeditionJournal.record("missionHistory", selectedMissionTemplate.id, `${result === "victory" ? "Victory" : "Defeat"}: ${selectedMissionTemplate.name}`);
  if ((missionRuntime?.currentValue("missionBossDefeated") ?? 0) > 0) {
    expeditionJournal.record("bosses", selectedMissionTemplate.id, `Boss defeated during ${selectedMissionTemplate.name}`);
  }
  if (result === "victory") feedCampaignProgress(CAMPAIGN_COUNTER_MISSIONS); // AF-068/069: campaign + endgame progress from real play
  // AF-089 §Player Participation: a victorious expedition genuinely
  // delivers resources to the mission's present faction's colony — the
  // spec's own "every expedition contributes to rebuilding civilisation."
  if (result === "victory") {
    const factionPresence = MISSION_PROFILES.find((p) => p.missionId === selectedMissionTemplate.id)?.factionPresence;
    if (factionPresence && factionPresence !== "none" && galacticEconomy.colonyFor(factionPresence)) {
      galacticEconomy.deliverResources(factionPresence, "civilianGoods", 3);
      // AF-090: the same victory funds that faction's named settlement's
      // own construction — the expedition visibly rebuilds a real place.
      const settlement = SEEDED_SETTLEMENTS.find((s) => s.factionId === factionPresence);
      if (settlement) civilisation.fundProjects(settlement.settlementId, 3);
    }
  }
  machine.transitionTo(result === "victory" ? "MissionComplete" : "Defeat");
}

/**
 * AF-037: real automatic RunPhase advancement — steps AF-016's existing
 * advancePhase() forward one legal transition at a time until reaching the
 * target (or Results, which ends the run). Replaces the placeholder manual
 * "Advance Run Phase" debug button as the primary way phases now change.
 */
function advanceRunPhaseTo(target: RunPhase): void {
  if (!session) return;
  while (session.phase !== target) {
    const previous = session.phase;
    const next = advancePhase(session);
    if (!next) return;
    bus.emit("RunPhaseChanged", { from: previous, to: next });
    if (next === "Results") {
      endRun("victory");
      return;
    }
  }
}

/** Movement sandbox (AF-020): fly the ship — input → movement → camera. */
function renderGameplaySandbox(): void {
  if (!app) return;
  app.innerHTML = "";
  const box = document.createElement("div");
  box.style.cssText = "text-align:center";

  sandboxCanvas = document.createElement("canvas");
  sandboxCanvas.width = 640;
  sandboxCanvas.height = 360;
  sandboxCanvas.style.cssText =
    "border:1px solid var(--space-blue);max-width:100%;image-rendering:pixelated";
  box.appendChild(sandboxCanvas);

  const hint = document.createElement("p");
  hint.textContent =
    "WASD / stick — fly · Space — boost (i-frames) · Esc — pause · cannon fires itself — survive";
  hint.style.cssText = "color:var(--neutral-grey);font-size:0.85rem;margin:0.5rem 0 0.75rem";
  box.appendChild(hint);

  const buttons = document.createElement("div");
  for (const [label, onClick] of [
    [
      "Advance Run Phase",
      () => {
        if (session) {
          const previous = session.phase;
          const next = advancePhase(session);
          if (next) bus.emit("RunPhaseChanged", { from: previous, to: next });
          if (next === "Results") endRun("victory");
          else render();
        }
      },
    ],
    ["Simulate Defeat", () => endRun("defeat")],
  ] as Array<[string, () => void]>) {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText =
      "margin:0 0.4rem;padding:0.4rem 1rem;background:rgba(16,26,56,0.6);border:1px solid var(--space-blue);color:var(--energy-white);font:inherit;font-size:0.85rem;cursor:pointer";
    button.addEventListener("click", onClick);
    buttons.appendChild(button);
  }
  box.appendChild(buttons);
  app.appendChild(box);
}

function drawSandbox(): void {
  if (!sandboxCanvas || machine.base !== "Gameplay" || !movement) return;
  const ctx = sandboxCanvas.getContext("2d");
  if (!ctx) return;

  const cam = camera.snapshot;
  const scale = 20 * cam.zoom;
  const originX = sandboxCanvas.width / 2 - (cam.x + cam.shakeOffsetX) * scale;
  const originY = sandboxCanvas.height / 2 - (cam.y + cam.shakeOffsetY) * scale;
  const toX = (worldX: number): number => originX + worldX * scale;
  const toY = (worldY: number): number => originY + worldY * scale;

  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);

  ctx.strokeStyle = "#101a38";
  ctx.lineWidth = 2;
  ctx.strokeRect(toX(ARENA.minX), toY(ARENA.minY), (ARENA.maxX - ARENA.minX) * scale, (ARENA.maxY - ARENA.minY) * scale);
  ctx.fillStyle = "#101a38";
  for (const box of ARENA_OBSTACLES) {
    ctx.fillRect(toX(box.minX), toY(box.minY), (box.maxX - box.minX) * scale, (box.maxY - box.minY) * scale);
  }

  // AF-046: Outlaw mines — orange warning rings (the faction's visual language),
  // readable area denial per AF-004's threat-communication law.
  for (const mine of outlawMines) {
    ctx.beginPath();
    ctx.strokeStyle = "#ff8c1a";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(mine.zone.x), toY(mine.zone.y), mine.zone.radius * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "#ff8c1a";
    ctx.arc(toX(mine.zone.x), toY(mine.zone.y), 0.15 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // AF-048: Crystal growths — violet filled zones that visibly expand
  // (the faction's visual language), readable area-under-threat per AF-004.
  for (const growth of crystalGrowths) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(155,92,255,0.18)";
    ctx.strokeStyle = "#9b5cff";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(growth.zone.x), toY(growth.zone.y), growth.zone.radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // AF-049: Corruption zones — deep violet reality tears (the faction's
  // visual language), readable area-under-threat per AF-004.
  for (const voidZone of voidZones) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(201,77,255,0.16)";
    ctx.strokeStyle = "#c94dff";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(voidZone.zone.x), toY(voidZone.zone.y), voidZone.zone.radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // AF-051: Acid Pools — sickly bioluminescent-green filled zones (the
  // faction's visual language), readable area-under-threat per AF-004.
  for (const pool of acidPools) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(139,255,77,0.2)";
    ctx.strokeStyle = "#8bff4d";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(pool.zone.x), toY(pool.zone.y), pool.zone.radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // AF-054: Gravity Wells — golden-white filled zones (the faction's
  // visual language), readable area-under-threat per AF-004.
  for (const well of gravityWells) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,243,196,0.2)";
    ctx.strokeStyle = "#ffd24d";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(well.zone.x), toY(well.zone.y), well.zone.radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // AF-053: Singularity Charges — orange-warning filled zones (the
  // faction's visual language), readable area-under-threat per AF-004.
  for (const charge of singularityCharges) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,138,26,0.2)";
    ctx.strokeStyle = "#ff8a1a";
    ctx.lineWidth = 1.5;
    ctx.arc(toX(charge.zone.x), toY(charge.zone.y), charge.zone.radius * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // AF-050: Ancient site perimeters — blue-white outlines (the faction's
  // visual language) making the trespass zone that drives escalation readable.
  for (const site of ancientSites) {
    const anchorDrone = drones.find((d) => d.alive && d.siteId === site.siteId);
    if (!anchorDrone) continue;
    ctx.beginPath();
    ctx.strokeStyle = "#8fd8ff";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.arc(toX(anchorDrone.x), toY(anchorDrone.y), ANCIENT_SECURITY_TUNING.siteRadius * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Drones: hostile = hot hues (AF-004 §3); elites read as diamonds (AF-007).
  for (const drone of drones) {
    const dx = toX(drone.x);
    const dy = toY(drone.y);
    const droneSize = (drone.elite ? 0.55 : 0.35) * scale;
    ctx.save();
    ctx.translate(dx, dy);
    ctx.fillStyle = drone.elite ? "#c8323c" : "#ff4054";
    ctx.shadowColor = "#ff4054";
    ctx.shadowBlur = 6;
    if (drone.elite) {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-droneSize, -droneSize, droneSize * 2, droneSize * 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, droneSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // Hull sliver under damaged drones.
    if (drone.hull < drone.maxHull) {
      ctx.fillStyle = "#101a38";
      ctx.fillRect(dx - droneSize, dy + droneSize + 3, droneSize * 2, 3);
      ctx.fillStyle = "#ff4054";
      ctx.fillRect(dx - droneSize, dy + droneSize + 3, (droneSize * 2 * drone.hull) / drone.maxHull, 3);
    }
  }

  // Loot beams: vertical, rarity-coloured — the unique shape read (AF-023 §5).
  if (groundLoot) {
    for (const ground of groundLoot.live) {
      if (!ground.drop) continue;
      const row = RARITY_TABLE[ground.drop.rarity];
      const bx = toX(ground.x);
      const by = toY(ground.y);
      const beamHeight = 46 * row.presentation + 14;
      const gradient = ctx.createLinearGradient(bx, by - beamHeight, bx, by);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, row.colour);
      ctx.fillStyle = gradient;
      ctx.fillRect(bx - 2, by - beamHeight, 4, beamHeight);
      ctx.fillStyle = row.colour;
      ctx.shadowColor = row.colour;
      ctx.shadowBlur = 10 * row.presentation;
      ctx.beginPath();
      ctx.ellipse(bx, by, 0.28 * scale, 0.12 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // XP gems: solar gold, size = significance (AF-002 §7, AF-022 §2).
  if (xpPickups) {
    ctx.fillStyle = "#ffc652";
    ctx.shadowColor = "#ffc652";
    ctx.shadowBlur = 6;
    for (const gem of xpPickups.live) {
      const gemSize = (gem.tier === "small" ? 0.12 : gem.tier === "elite" ? 0.22 : 0.17) * scale;
      ctx.beginPath();
      ctx.arc(toX(gem.x), toY(gem.y), gemSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // Player projectiles: cool light — ownership readable in one frame (AF-002 §3).
  ctx.fillStyle = "#3fd4f5";
  ctx.shadowColor = "#3fd4f5";
  ctx.shadowBlur = 8;
  for (const projectile of projectiles) {
    if (!projectile.live) continue;
    ctx.beginPath();
    ctx.arc(toX(projectile.x), toY(projectile.y), 0.12 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  const snap = movement.snapshot;
  const speed = Math.hypot(snap.velocityX, snap.velocityY);
  const dirX = speed > 0.1 ? snap.velocityX / speed : 0;
  const dirY = speed > 0.1 ? snap.velocityY / speed : -1;
  const px = toX(snap.x);
  const py = toY(snap.y);
  const size = sandboxShip.movementProfile.collisionRadius * scale * 2;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(Math.atan2(dirY, dirX) + Math.PI / 2);
  ctx.fillStyle = snap.boostActive ? "#3fd4f5" : "#f4f7ff";
  ctx.shadowColor = snap.boostActive ? "#3fd4f5" : "#9b5cff";
  ctx.shadowBlur = snap.boostActive ? 18 : 8;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.7, size);
  ctx.lineTo(-size * 0.7, size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Damage numbers: tabular feel, crits gold and larger (AF-002 §9 / AF-003 §4).
  for (const popup of popups) {
    if (!popup.live) continue;
    ctx.font = popup.critical ? "bold 16px monospace" : "12px monospace";
    ctx.fillStyle = popup.critical ? "#ffc652" : "#f4f7ff";
    ctx.globalAlpha = Math.min(1, popup.ttlMs / 300);
    ctx.fillText(popup.text, toX(popup.x), toY(popup.y));
    ctx.globalAlpha = 1;
  }

  // Loot pickup notices: rarity-coloured, top centre, brief (AF-003 §5).
  ctx.textAlign = "center";
  let noticeY = 30;
  for (const notice of lootNotices.slice(-3)) {
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = notice.colour;
    ctx.globalAlpha = Math.min(1, notice.ttlMs / 400);
    ctx.fillText(notice.text, sandboxCanvas.width / 2, noticeY);
    ctx.globalAlpha = 1;
    noticeY += 18;
  }
  ctx.textAlign = "left";

  // XP bar: solar gold, bottom centre (AF-003 §3 layout).
  if (xpSystem) {
    const xp = xpSystem.snapshot;
    const barWidth = sandboxCanvas.width * 0.6;
    const barX = (sandboxCanvas.width - barWidth) / 2;
    const barY = sandboxCanvas.height - 18;
    ctx.fillStyle = "rgba(5,6,10,0.7)";
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, 12);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(barX, barY, barWidth, 8);
    ctx.fillStyle = "#ffc652";
    ctx.fillRect(barX, barY, barWidth * Math.min(1, xp.xp / xp.nextThreshold), 8);
    ctx.font = "11px monospace";
    ctx.fillStyle = "#f4f7ff";
    ctx.fillText(`Lv ${xp.level}`, barX + barWidth + 8, barY + 8);
  }

  // Player status bars: Shield = shield.blue, Health = danger.red (AF-002 §7).
  if (playerDefence) {
    const defence = playerDefence.snapshot;
    const barWidth = 150;
    ctx.fillStyle = "rgba(5,6,10,0.7)";
    ctx.fillRect(8, 8, barWidth + 4, 26);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(10, 10, barWidth, 9);
    ctx.fillStyle = "#4d7cff";
    ctx.fillRect(10, 10, (barWidth * defence.shield) / defence.maxShield, 9);
    ctx.fillStyle = "#101a38";
    ctx.fillRect(10, 22, barWidth, 9);
    ctx.fillStyle = "#ff4054";
    ctx.fillRect(10, 22, (barWidth * defence.hull) / defence.maxHull, 9);
  }
}

function render(): void {
  const state = machine.current;
  switch (state) {
    case "Boot":
      screen("Afterlight", "Initialising…", []);
      break;
    case "Splash":
      screen("Afterlight", "The galaxy is dark. You carry the light.", [
        ["Continue", () => machine.transitionTo("MainMenu")],
      ]);
      break;
    case "MainMenu":
      screen("Afterlight", "Main Menu (placeholder)", [
        ["Enter Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "GalaxyCommand": {
      // Research panel (AF-024): spend banked points; unlocks persist forever.
      const snapshot = researchTree.snapshot;
      const nodeButtons: Array<[string, () => void]> = researchTree.visibleNodes
        .filter((n) => !researchTree.isUnlocked(n.id))
        .slice(0, 4)
        .map((n) => {
          const state = researchTree.stateOf(n.id);
          const tag = state === "available" ? `${n.cost} pts` : "locked";
          return [
            `Research: ${n.name} (${tag})`,
            () => {
              if (researchTree.unlock(n.id)) {
                persistResearch();
                render();
              }
            },
          ];
        });
      // Lightforge panel (AF-025): craft from known recipes, salvage the hangar.
      const forgeButtons: Array<[string, () => void]> = crafting.knownRecipes.map((recipe) => {
        const check = crafting.canCraft(recipe.id);
        const cost = Object.entries(recipe.materials)
          .map(([type, amount]) => `${amount} ${type.replace("Materials", "")}`)
          .join(", ");
        const tag = check.ok ? cost : check.reason === "insufficientMaterials" ? `needs ${cost}` : check.reason;
        return [
          `Lightforge: ${recipe.outputBaseItemId.replaceAll("_", " ")} (${tag})`,
          () => {
            const result = crafting.craft(recipe.id, xpSystem?.snapshot.level ?? 1, new Rng(Date.now()).fork("craft"));
            if (result.ok && result.item) {
              bus.emit("ItemCrafted", {
                recipeId: recipe.id,
                itemId: result.item.baseItemId,
                rarity: result.item.rarity,
                quality: result.item.quality,
              });
              persistCrafting();
              render();
            }
          },
        ];
      });
      const hangarItem = crafting.hangarItems[0];
      if (hangarItem) {
        forgeButtons.push([
          `Salvage: ${hangarItem.baseItemId.replaceAll("_", " ")} (${hangarItem.rarity}, q${hangarItem.quality})`,
          () => {
            const returned = crafting.salvageFromHangar(0);
            if (returned) {
              bus.emit("ItemSalvaged", { itemId: hangarItem.baseItemId, rarity: hangarItem.rarity });
              persistCrafting();
              render();
            }
          },
        ]);
      }
      // AF-038: Galaxy Map — route travel (gated by adjacency or the AF-024
      // Fast Travel unlock) and point-of-interest discovery (AF-026 collections).
      const fastTravelUnlocked = researchTree.isUnlocked("warp-charting");
      const currentSystem = galaxyRuntime.currentSystem;
      const explorationKey = `galaxy:${currentSystem.id}:explorationPercent`;
      const stabilityKey = `galaxy:${currentSystem.id}:stability`;
      const travelButtons: Array<[string, () => void]> = currentSystem.connectedSystemIds
        .map((id) => galaxyRuntime.findSystem(id))
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .map((target) => [
          `Travel: ${target.name} (${target.region})`,
          () => {
            if (galaxyRuntime.travelTo(target.id, fastTravelUnlocked)) {
              feedCampaignProgress(CAMPAIGN_COUNTER_SYSTEMS); // AF-068/069: exploration is campaign + endgame progress
              render();
            }
          },
        ]);
      const poiButtons: Array<[string, () => void]> = currentSystem.pointsOfInterest
        .filter((poi) => !meta.hasDiscovered(poi.discoveryCategory, poi.discoveryId))
        .map((poi) => [
          `Discover: ${poi.kind.replace(/([A-Z])/g, " $1").trim()}`,
          () => {
            if (meta.discover(poi.discoveryCategory, poi.discoveryId)) {
              const delta = GalaxyRuntime.clampedDelta(meta.stat(explorationKey), 15, 0, 100);
              meta.recordStat(explorationKey, delta);
              persistMeta();
              awardCredits(CREDIT_AWARDS.discovery); // AF-040: Exploration/Ancient Vaults as a Resource Source.
              // AF-042: Ancient Vaults double as the Ancient Artefacts collection; every
              // discovery gains full Discovery Log context (AF-042 §Discovery Log).
              if (poi.kind === "ancientVaults" && collectionLedger.discover("ancientArtefacts", poi.discoveryId)) {
                collectionLedger.recordDiscovery({
                  id: poi.discoveryId,
                  category: poi.discoveryCategory,
                  atMs: Date.now(),
                  missionId: session?.missionId ?? null,
                  biomeId: currentSystem.biomeId,
                  galaxySectorId: currentSystem.id,
                  commanderId: sandboxCommander.id,
                  shipId: sandboxShip.id,
                });
                persistCollectionLedger();
              }
              render();
            }
          },
        ]);
      // AF-039: Faction Relations — the current system's dominant faction
      // (StarSystemDef.dominantFaction is a plain string, matched by name),
      // its reputation (namespaced meta stat, clamped by AF-038's exact
      // GalaxyRuntime.clampedDelta), and Support/Oppose/Negotiate/Faction
      // Mission buttons. Player choice never blocks progression — Ignore
      // and Explore Independently are simply "do nothing" (no button needed).
      const dominantFaction = factionRuntime.findFactionByName(currentSystem.dominantFaction);
      const factionButtons: Array<[string, () => void]> = [];
      let factionLine = "";
      if (dominantFaction) {
        const repKey = `faction:${dominantFaction.id}:reputation`;
        const reputation = meta.stat(repKey);
        const reputationLevel = FactionRuntime.reputationLevel(reputation);
        const relation = factionRuntime.relationshipBetween("crystalDominion", "machineCollective");
        factionLine = `${dominantFaction.name} · reputation ${reputation.toFixed(0)} (${reputationLevel}) · Crystal Dominion ↔ Machine Collective: ${relation}`;
        const applyChoice = (choice: PlayerChoiceKind) => {
          const delta = GalaxyRuntime.clampedDelta(reputation, PLAYER_CHOICE_REPUTATION_DELTA[choice], REPUTATION_MIN, REPUTATION_MAX);
          meta.recordStat(repKey, delta);
          // AF-086 §Player Impact: diplomatic decisions nudge the living
          // ecosystem's politics surface — bounded, never dictating.
          if (choice === "support") civSim.feedPlayerImpact("politics", 3);
          else if (choice === "oppose") civSim.feedPlayerImpact("politics", -3);
          persistMeta();
          render();
        };
        factionButtons.push(
          [`Support ${dominantFaction.name}`, () => applyChoice("support")],
          [`Oppose ${dominantFaction.name}`, () => applyChoice("oppose")],
          [`Negotiate with ${dominantFaction.name}`, () => applyChoice("negotiate")],
        );
        const availableMission = factionRuntime.missionsFor(dominantFaction.id)[0];
        if (availableMission && !activeFactionMissionId) {
          factionButtons.push([
            `Accept Faction Mission: ${availableMission.name} (+${availableMission.reputationReward} rep)`,
            () => {
              // GalaxyCommand's legal transitions (AF-016) don't include Loading
              // directly — accepting queues the mission and routes through the
              // existing MissionSelect → Loading path, same as any other launch.
              activeFactionMissionId = availableMission.id;
              machine.transitionTo("MissionSelect");
            },
          ]);
        }
      }
      // AF-040: Galaxy Economy — a rotating merchant offer window, priced by
      // AF-023 Rarity value, AF-039 Faction Reputation, and any active
      // Special Economic Event. Buying spends the one genuinely new
      // currency (Credits); the other five Currency Types are read-only
      // views over values that already persist elsewhere (see debug overlay).
      const credits = meta.stat(CREDITS_KEY);
      const activeMerchant = marketRuntime.findMerchant("lucent-gate-trader");
      const merchantReputationLevel = dominantFaction
        ? FactionRuntime.reputationLevel(meta.stat(`faction:${dominantFaction.id}:reputation`))
        : "neutral";
      const marketButtons: Array<[string, () => void]> = activeMerchant
        ? marketRuntime.offersFor(activeMerchant.id).map((offer) => {
            const price = MarketRuntime.price(offer, merchantReputationLevel, marketRuntime.currentEvent);
            const reward = offer.reward;
            const label =
              reward.kind === "resource"
                ? `${reward.amount} ${reward.id}`
                : reward.kind === "researchPoints"
                  ? `${reward.amount} research pts`
                  : reward.kind === "blueprint"
                    ? `blueprint ${reward.id}`
                    : reward.kind;
            return [
              `Buy: ${label} (${price} cr)`,
              () => {
                if (credits < price) return;
                meta.recordStat(CREDITS_KEY, -price);
                persistMeta();
                if (reward.kind === "resource") {
                  crafting.addMaterial(reward.id, reward.amount);
                  persistCrafting();
                  if (collectionLedger.discover("resources", reward.id)) persistCollectionLedger(); // AF-042: Collections.
                } else if (reward.kind === "researchPoints") {
                  researchTree.addPoints(reward.amount);
                  persistResearch();
                } else if (reward.kind === "blueprint") {
                  crafting.unlockBlueprint(reward.id);
                  persistCrafting();
                }
                render();
              },
            ];
          })
        : [];
      // AF-041: Galaxy Events — the most recently fired World Event, and
      // Player Participation buttons (Ignore/Observe are simply not
      // responding — no button needed). Responding nudges World State on
      // top of the event's own ambient delta and, once per event instance,
      // records it permanently ("the galaxy remembers") plus the one
      // live-wired Event Chain outcome.
      const currentWorldEvent = worldEventRuntime.currentEvent;
      const worldEventButtons: Array<[string, () => void]> = [];
      let worldEventLine = "No Breaking Events.";
      if (currentWorldEvent) {
        const worldStateKey = `worldState:${currentWorldEvent.worldStateKey}`;
        worldEventLine = `Breaking: ${currentWorldEvent.category} · ${currentWorldEvent.kind.replace(/([A-Z])/g, " $1").trim()} (${currentWorldEvent.worldStateKey} ${meta.stat(worldStateKey).toFixed(0)})`;
        if (!respondedWorldEvents.has(currentWorldEvent.id)) {
          const respond = (choice: PlayerParticipationKind) => {
            const delta = GalaxyRuntime.clampedDelta(meta.stat(worldStateKey), PLAYER_PARTICIPATION_WORLD_STATE_DELTA[choice], WORLD_STATE_MIN, WORLD_STATE_MAX);
            meta.recordStat(worldStateKey, delta);
            respondedWorldEvents.add(currentWorldEvent.id);
            meta.discover("lore", currentWorldEvent.id);
            if (currentWorldEvent.chainsInto?.kind === "researchOpportunity") researchTree.addPoints(5);
            persistMeta();
            persistResearch();
            render();
          };
          worldEventButtons.push(
            [`Investigate: ${currentWorldEvent.kind}`, () => respond("investigate")],
            [`Support: ${currentWorldEvent.kind}`, () => respond("support")],
            [`Prevent: ${currentWorldEvent.kind}`, () => respond("prevent")],
          );
        }
      }
      screen(
        "Galaxy Command",
        `Research: ${snapshot.points} pts, ${snapshot.unlockedCount}/${ROSTER_RESEARCH_TREE.length} tech · Materials: ${crafting.materialCount("commonMaterials")} common, ${crafting.materialCount("rareAlloys")} alloy · Hangar: ${crafting.hangarItems.length}\n${currentSystem.name} (${currentSystem.region}) · exploration ${meta.stat(explorationKey).toFixed(0)}% · stability ${meta.stat(stabilityKey).toFixed(0)} · fast travel ${fastTravelUnlocked ? "unlocked" : "locked"}\n${factionLine}\nCredits: ${credits.toFixed(0)} · ${activeMerchant?.name ?? "Market"}${marketRuntime.currentEvent ? ` — ${marketRuntime.currentEvent}` : ""}\n${worldEventLine}`,
        [
          ["Select Mission", () => machine.transitionTo("MissionSelect")],
          ...travelButtons,
          ...poiButtons,
          ...factionButtons,
          ...marketButtons,
          ...worldEventButtons,
          ...nodeButtons,
          ...forgeButtons,
          ["Statistics", () => machine.transitionTo("Statistics")],
          ["Main Menu", () => machine.transitionTo("MainMenu")],
        ],
      );
      break;
    }
    case "MissionSelect": {
      const queuedFactionMission = activeFactionMissionId
        ? SANDBOX_FACTION_ROSTER.missions.find((m) => m.id === activeFactionMissionId)
        : null;
      // AF-083: every framework expedition is selectable — preview shows
      // category, difficulty, and threat budget (§Accessibility: Mission
      // Preview / Difficulty Preview).
      const missionButtons: Array<[string, () => void]> = FRAMEWORK_MISSIONS.filter((m) => m.id !== selectedMissionTemplate.id).map((m) => {
        const profile = MISSION_PROFILES.find((p) => p.missionId === m.id);
        return [
          `Select: ${m.name} (${m.category} · T${m.difficulty} · budget ${profile?.threatBudget ?? 0})`,
          () => {
            selectedMissionTemplate = m;
            render();
          },
        ];
      });
      screen(
        "Mission Selection",
        queuedFactionMission
          ? `Faction Mission queued: ${queuedFactionMission.name} (+${queuedFactionMission.reputationReward} rep on success).`
          : `Selected: ${selectedMissionTemplate.name} — ${selectedMissionTemplate.briefing}`,
        [
          [
            "Launch Expedition",
            () => {
              startRun();
              machine.transitionTo("Loading");
            },
          ],
          ...missionButtons,
          [
            "Back",
            () => {
              activeFactionMissionId = null;
              machine.transitionTo("GalaxyCommand");
            },
          ],
        ],
      );
      break;
    }
    case "Loading":
      screen("Loading", "Streaming expedition data…", []);
      // Async loading pattern: heavy work happens here, never inside a transition.
      setTimeout(() => {
        if (machine.base === "Loading") machine.transitionTo("Gameplay");
      }, 250);
      break;
    case "Gameplay":
      renderGameplaySandbox();
      break;
    case "Pause":
      screen("Paused", "The run is preserved beneath this overlay.", [
        ["Resume", () => machine.popOverlay()],
        [
          "Abandon Run",
          () => {
            director = null;
            // AF-039: an abandoned run never completes RunEnded, so a queued
            // Faction Mission must be released here — never permanently
            // trapping the offer (AF-039 §Player Choice).
            activeFactionMissionId = null;
            machine.transitionTo("GalaxyCommand");
          },
        ],
      ]);
      break;
    case "LevelUp": {
      // AF-003 §7 / AF-022 §4: three cards, immediate selection, instant resume.
      const level = xpSystem?.snapshot.level ?? 0;
      screen(
        `Level ${level}`,
        "Choose an upgrade — the run resumes instantly.",
        currentOffer.map((choice): [string, () => void] => [
          `${choice.name} — ${choice.description}`,
          () => {
            applyUpgrade(choice.id);
            upgradePool?.recordTaken(choice.id);
            currentOffer = [];
            machine.popOverlay();
          },
        ]),
      );
      break;
    }
    case "InventoryOverlay": {
      // AF-027: real persistent inventory, sorted by power, top entries shown.
      const topItems = inventory.sorted("power").slice(0, 6);
      const lines = topItems.length > 0
        ? topItems
            .map(
              (item) =>
                `${item.favourite ? "★" : " "} ${item.drop.rarity.toUpperCase()} ${item.drop.baseItemId.replaceAll("_", " ")} (lvl ${item.drop.itemLevel}, pwr ${Math.round(item.drop.affixes.reduce((s, a) => s + a.value, 0) + item.drop.itemLevel * 10)})`,
            )
            .join("\n")
        : "No items collected yet — weapons, equipment and relics found in expeditions land here permanently.";
      screen(`Inventory (${inventory.size} items)`, lines, [["Close", () => machine.popOverlay()]]);
      break;
    }
    case "MissionComplete":
      screen("Mission Complete", "Rewards banked. The galaxy grows brighter.", [
        ["Return to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "Defeat":
      screen("Run Lost", "Knowledge, research, and statistics retained.", [
        ["Return to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
        ["Statistics", () => machine.transitionTo("Statistics")],
      ]);
      break;
    case "Statistics": {
      // The account profile (AF-026 §7): the permanent ledger, readable.
      const profile = meta.snapshot;
      const stats = profile.statistics;
      const hours = ((stats["playTimeMs"] ?? 0) / 3_600_000).toFixed(2);
      const challengeLines = SANDBOX_CHALLENGES.map((c) => {
        const progress = meta.challengeProgress(c.id);
        const done = meta.isChallengeCompleted(c.id);
        return `${done ? "★" : "☆"} ${c.name} ${progress ? `${progress.current}/${progress.target}` : ""}`;
      }).join("   ");
      // AF-042: Achievements/Collections — Hidden Achievements stay "???" until completed.
      const completedAchievementCount = SANDBOX_ACHIEVEMENTS.filter((a) => meta.hasDiscovered("achievements", a.id)).length;
      const achievementLines = SANDBOX_ACHIEVEMENTS.map((a) => {
        const done = meta.hasDiscovered("achievements", a.id);
        if (a.hidden && !done) return "☆ ???";
        const progress = achievementRuntime.progress(a, metaAchievementReader);
        return `${done ? "★" : "☆"} ${a.name} ${done ? "" : `${progress.current}/${progress.target}`}`;
      }).join("   ");
      const recentDiscovery = collectionLedger.recentDiscoveries.at(-1);
      // AF-043: the Codex is a read-only presentation layer over discoveries
      // that already happen — no button here unlocks anything new.
      const codexUnlocked = codexRuntime.unlockedEntries(codexReader);
      const codexTitles = codexUnlocked.slice(0, 6).map((e) => e.title).join(", ");
      const codexLine = `Codex ${codexUnlocked.length}/${codexRuntime.all.length} entries (${codexRuntime.discoveryPercent(codexReader).toFixed(0)}%) · Missing Links ${codexRuntime.missingLinkCount()} · Unlocked: ${codexTitles || "none yet"}${codexUnlocked.length > 6 ? "…" : ""}`;
      // AF-087: the Player Journal — pin the most recently unlocked entry
      // as a real, curatable action; the note and history are live below.
      const featuredEntry = codexUnlocked.at(-1) ?? null;
      const journalLine = featuredEntry
        ? `Journal: ${codexJournal.snapshot.pinnedCount} pinned, ${codexJournal.snapshot.favouriteCount} favourite, ${codexJournal.snapshot.bookmarkedCount} bookmarked · Featured: ${featuredEntry.title} (${codexJournal.isPinned(featuredEntry.id) ? "pinned" : "not pinned"}${playerNotebook.researchGoalIds.includes(featuredEntry.id) ? ", goal" : ""}) — ${codexProfileFor(featuredEntry).gameplayInformation}`
        : `Journal: ${codexJournal.snapshot.pinnedCount} pinned, ${codexJournal.snapshot.favouriteCount} favourite, ${codexJournal.snapshot.bookmarkedCount} bookmarked · Featured: no discoveries yet`;
      // AF-044: Player Profile (Identity/Preferences) + Autosave Status — the
      // Save Framework's own summary line, matching every module's pattern.
      const metaStatus = saveCoordinator.status("meta");
      const saveLine = `Profile: ${activeProfileName} · Autosave: ${metaStatus ? `${metaStatus.saveCount} saves, last ${((Date.now() - metaStatus.lastSavedAtMs) / 1000).toFixed(0)}s ago` : "not yet saved"} · Reduced Notifications: ${settings.accessibility.reducedNotificationMode ? "on" : "off"}`;
      screen(
        `Account Level ${profile.accountLevel}`,
        [
          `Runs ${stats["runs"] ?? 0} · Victories ${stats["victories"] ?? 0} · Defeats ${stats["defeats"] ?? 0} · ${hours}h in expeditions`,
          `Enemies ${Math.round(stats["enemiesDestroyed"] ?? 0)} · Damage dealt ${Math.round(stats["damageDealt"] ?? 0)} · taken ${Math.round(stats["damageTaken"] ?? 0)}`,
          `Items ${stats["itemsCollected"] ?? 0} (rare ${stats["rareItemsFound"] ?? 0}) · Discovered: ${Object.entries(profile.collectionCounts).map(([k, v]) => `${k} ${v}`).join(", ") || "nothing yet"}`,
          `Challenges ${profile.completedChallenges}/${profile.totalChallenges}:   ${challengeLines}`,
          `Achievements ${completedAchievementCount}/${SANDBOX_ACHIEVEMENTS.length}:   ${achievementLines}`,
          `Resources ${collectionLedger.collectionCount("resources")} · Ancient Artefacts ${collectionLedger.collectionCount("ancientArtefacts")} · Recent discovery: ${recentDiscovery?.id ?? "none yet"}`,
          codexLine,
          journalLine,
          saveLine,
        ].join("\n"),
        [
          [
            `Toggle Reduced Notifications (currently ${settings.accessibility.reducedNotificationMode ? "on" : "off"})`,
            () => {
              settings = { ...settings, accessibility: { ...settings.accessibility, reducedNotificationMode: !settings.accessibility.reducedNotificationMode } };
              persistSettings();
              render();
            },
          ],
          ...(featuredEntry
            ? [
                [
                  `${codexJournal.isPinned(featuredEntry.id) ? "Unpin" : "Pin"} Featured Discovery: ${featuredEntry.title}`,
                  () => {
                    codexJournal.togglePin(featuredEntry.id);
                    render();
                  },
                ] as [string, () => void],
                // AF-088: the Player Notebook's Research Goals surface — a
                // real, independent toggle from AF-087's Pin.
                [
                  `${playerNotebook.researchGoalIds.includes(featuredEntry.id) ? "Clear" : "Set"} Research Goal: ${featuredEntry.title}`,
                  () => {
                    playerNotebook.toggleResearchGoal(featuredEntry.id);
                    render();
                  },
                ] as [string, () => void],
              ]
            : []),
          ["Back to Galaxy Command", () => machine.transitionTo("GalaxyCommand")],
          ["Back to Main Menu", () => machine.transitionTo("MainMenu")],
        ],
      );
      break;
    }
    case "Multiplayer":
    case "CommunityHub":
      screen(state, "Reserved for a future module.", []);
      break;
  }
}

// Frame loop: fixed-timestep sim (session timing for now; systems attach via
// GameManager as AF-017+ land) with an FPS estimate for the debug overlay.
let fps = 0;
let framesThisSecond = 0;
let fpsWindowStart = performance.now();

const loop = new GameLoop({
  update: (fixedDtMs) => {
    input.update(fixedDtMs);
    // AF-038: the galaxy evolves independent of whatever screen the player is on.
    galaxyRuntime.update(fixedDtMs);
    const galaxyEvent = galaxyRuntime.tryTriggerEvent();
    if (galaxyEvent) bus.emit("EnvironmentalEventTriggered", { eventType: galaxyEvent });
    // AF-039: faction politics evolve independent of whatever screen the player is on.
    factionRuntime.update(fixedDtMs);
    const factionEvent = factionRuntime.tryTriggerEvent();
    if (factionEvent) bus.emit("EnvironmentalEventTriggered", { eventType: factionEvent });
    // AF-086: the civilisation simulation ticks on the same ambient schedule.
    civSim.update(fixedDtMs);
    // AF-040: the market evolves independent of whatever screen the player is on.
    marketRuntime.update(fixedDtMs);
    marketRuntime.tryRotateInventories();
    const economicEvent = marketRuntime.tryTriggerEvent();
    if (economicEvent) bus.emit("EnvironmentalEventTriggered", { eventType: economicEvent });
    // AF-089: the galactic economy ticks on the same ambient schedule.
    galacticEconomy.update(fixedDtMs);
    // AF-090: settlements and megastructures tick on the same ambient schedule.
    civilisation.update(fixedDtMs);
    // AF-041: the galaxy evolves whether or not the player is present — an
    // ambient World State delta applies immediately on firing, independent
    // of any later Player Participation choice.
    worldEventRuntime.update(fixedDtMs);
    const worldEvent = worldEventRuntime.tryTriggerEvent();
    if (worldEvent) {
      bus.emit("EnvironmentalEventTriggered", { eventType: worldEvent.kind });
      const worldStateKey = `worldState:${worldEvent.worldStateKey}`;
      const ambientDelta = GalaxyRuntime.clampedDelta(meta.stat(worldStateKey), worldEvent.worldStateDelta, WORLD_STATE_MIN, WORLD_STATE_MAX);
      meta.recordStat(worldStateKey, ambientDelta);
      persistMeta();
      // AF-044: Reduced Notification Mode — registered as accessibility
      // vocabulary by AF-041 with no producer until now. Ambient events
      // still apply their World State effect either way; only the toast is suppressed.
      if (!settings.accessibility.reducedNotificationMode) {
        lootNotices.push({ text: `${worldEvent.category.toUpperCase()} · ${worldEvent.kind.replace(/([A-Z])/g, " $1").trim().toUpperCase()}`, colour: "#ffc652", ttlMs: 2800 });
      }
    }
    // AF-042: Achievements — a pure read over already-public MetaProgression
    // state; completion persists for free through meta.discover("achievements", id).
    for (const achievement of achievementRuntime.checkCompletions(metaAchievementReader)) {
      meta.discover("achievements", achievement.id);
      meta.addAccountXp(ACCOUNT_XP_AWARDS.challengeCompleted);
      persistMeta();
      lootNotices.push({ text: `ACHIEVEMENT · ${achievement.name.toUpperCase()}`, colour: "#ffc652", ttlMs: 3000 });
    }
    // AF-043: Codex Section Completion — reuses the exact achievement-completion
    // bucket, namespaced so it never collides with an achievement id.
    for (const category of codexRuntime.checkSectionCompletions(codexReader, (c) => meta.hasDiscovered("achievements", `codex-complete-${c}`))) {
      meta.discover("achievements", `codex-complete-${category}`);
      persistMeta();
      const reward = CODEX_SECTION_REWARDS[category];
      lootNotices.push({ text: `CODEX SECTION COMPLETE · ${category.toUpperCase()}${reward ? ` (${reward.kind})` : ""}`, colour: "#9b5cff", ttlMs: 3200 });
    }
    // AF-087: every newly-unlocked entry is "Observed" the moment the
    // player genuinely discovers it — the lattice never gates ahead of
    // AF-043's own unlock check.
    for (const entry of codexRuntime.unlockedEntries(codexReader)) {
      if (codexDiscovery.recordObserved(entry.id)) codexJournal.recordDiscoveryEvent(entry.id, "observed");
    }
    // AF-088: two AUTOMATIC feeds at the same real seam — the Expedition
    // Journal's Discoveries entry and the Scientific Archive's Scientific
    // Papers entry, both fed the instant AF-043's own unlock check goes
    // true (never player-curated — that stays the Notebook's job).
    for (const entry of codexRuntime.unlockedEntries(codexReader)) {
      if (codexArchive.recordDetected(entry.id)) {
        expeditionJournal.record("discoveries", entry.id, `Discovered: ${entry.title}`);
        scientificArchive.record("scientificPapers", entry.id, codexProfileFor(entry).scientificNotes);
      }
    }
    // AF-087: completing a whole Codex section masters every entry inside
    // it — the section-completion reward becomes a real progression event,
    // not just a notification.
    for (const category of codexRuntime.checkSectionCompletions(codexReader, (c) => meta.hasDiscovered("achievements", `codex-mastered-${c}`))) {
      meta.discover("achievements", `codex-mastered-${category}`);
      for (const entry of codexRuntime.entriesByCategory(category)) {
        if (codexDiscovery.recordMastered(entry.id)) codexJournal.recordDiscoveryEvent(entry.id, "mastered");
      }
    }
    // AF-045: Adaptive Music — a pure read over state AF-016/017/035 already
    // expose; transitions are seamless since setMusicState is idempotent.
    audioEngine.setMusicState(
      resolveMusicState({
        gameState: machine.base,
        directorPhase: director?.snapshot.phase ?? null,
        bossActive: bossRuntime !== null,
        bossPhase: bossRuntime ? bossRuntime.snapshot.phaseIndex + 1 : null,
        runResult: session?.result ?? null,
      }),
    );
    if (input.wasPressed("Pause") && machine.base === "Gameplay") {
      if (machine.overlays.at(-1) === "Pause") machine.popOverlay();
      else if (machine.overlays.length === 0) machine.pushOverlay("Pause");
    }
    if (input.consumeBuffered("InventoryOverlay") && machine.base === "Gameplay") {
      if (machine.overlays.at(-1) === "InventoryOverlay") machine.popOverlay();
      else if (machine.overlays.length === 0) machine.pushOverlay("InventoryOverlay");
    }
    if (machine.base === "Gameplay" && machine.overlays.length === 0) {
      sessionMs += fixedDtMs;
      director?.update(fixedDtMs);
      if (movement) {
        if (input.consumeBuffered("Boost")) movement.tryBoost();
        // AF-033: enemy status-on-hit reaches the player through the exact
        // AF-020 movement bridge StatusEngine already documents.
        if (playerStatus) {
          playerStatus.update(fixedDtMs);
          for (const modifier of playerStatus.movementModifiers) movement.addModifier(modifier);
        }
        const move = input.movement;
        movement.update(fixedDtMs, move.x, move.y);
        updateSandboxCombat(fixedDtMs);
        const snap = movement.snapshot;
        camera.update(fixedDtMs, snap.x, snap.y, snap.velocityX, snap.velocityY);
      }
      if (commanderRuntime) {
        commanderRuntime.update(fixedDtMs);
        if (input.consumeBuffered("CommanderAbility") && commanderRuntime.tryActivateAbility()) {
          camera.shake("WeaponImpact");
          lootNotices.push({ text: sandboxCommander.active.name.toUpperCase(), colour: "#3fd4f5", ttlMs: 1200 });
        }
        if (input.consumeBuffered("Ultimate") && commanderRuntime.tryActivateUltimate()) {
          camera.shake("Ultimate");
          lootNotices.push({ text: `${sandboxCommander.ultimate.name.toUpperCase()}!`, colour: "#9b5cff", ttlMs: 2600 });
        }
      }
      if (shipRuntime) {
        shipRuntime.update(fixedDtMs);
        if (input.consumeBuffered("ShipAbility") && shipRuntime.tryActivateAbility()) {
          camera.shake("WeaponImpact");
          lootNotices.push({ text: sandboxShip.ability.name.toUpperCase(), colour: "#5cffa8", ttlMs: 1200 });
        }
      }
      // AF-036: Environmental Interaction — gives AF-019's "Interact" action its
      // first real consumer. Only activateAncientDevice/harvestResource are
      // mechanically live; the rest are registered future (same pattern as ever).
      if (biomeRuntime && movement && input.consumeBuffered("Interact")) {
        const snap = movement.snapshot;
        const interactable = biomeRuntime.findInteractableInRange(snap.x, snap.y);
        if (interactable?.kind === "activateAncientDevice" && interactable.discoveryCategory && interactable.discoveryId) {
          if (meta.discover(interactable.discoveryCategory, interactable.discoveryId)) {
            lootNotices.push({ text: "ANCIENT DEVICE ACTIVATED", colour: "#ffc652", ttlMs: 2200 });
          }
        } else if (interactable?.kind === "harvestResource") {
          dropLoot(interactable.x, interactable.y);
          lootNotices.push({ text: "RESOURCE HARVESTED", colour: "#4de868", ttlMs: 1800 });
        }
      }
    }
  },
  render: () => {
    gamepad.poll();
    drawSandbox();
    framesThisSecond += 1;
    const now = performance.now();
    if (now - fpsWindowStart >= 1000) {
      fps = (framesThisSecond * 1000) / (now - fpsWindowStart);
      framesThisSecond = 0;
      fpsWindowStart = now;
    }
    // AF-068 §Story Delivery: presentation drains beats at its own pace —
    // one per cadence — through the consume seam; gameplay never pauses.
    if (now - campaignBeatClockMs >= CAMPAIGN_BEAT_CADENCE_MS) {
      const beat = campaign.consumeStoryBeat();
      if (beat) {
        lastCampaignBeat = `[${beat.channel}] ${beat.text}`;
        campaignBeatClockMs = now;
        lootNotices.push({ text: lastCampaignBeat.toUpperCase().slice(0, 72), colour: "#9fd0ff", ttlMs: 3200 });
      }
    }
    if (debugOverlay) {
      debugOverlay.update({
        gameState: `${machine.base} · ${navigationRealisationSummary()} · ${hudLiveSummary()} · ${moduleStatusSummary()} · ${eventQueueSummary(bus)}`,
        overlays: machine.overlays,
        runPhase: session?.phase ?? null,
        missionSeed: session?.seed ?? null,
        difficulty: session ? `${session.difficulty} / A${session.ascension}` : null,
        build: session ? session.shipId : null,
        sessionSeconds: sessionMs / 1000,
        fps,
        lastTransitionMs: machine.lastTransitionMs,
        droppedTimeMs: loop.droppedTimeMs,
        director: director
          ? `${director.snapshot.phase} · threat ${director.snapshot.threat.toFixed(2)} · budget ${director.snapshot.budget.toFixed(0)} · enemies ${director.snapshot.activeEnemies} (${director.snapshot.activeElites}E)`
          : null,
        input: `${input.currentContext} · move (${input.movement.x.toFixed(2)}, ${input.movement.y.toFixed(2)}) · last ${input.lastAction ?? "—"} · latency ~${inputLatencyProxyMs(fps).toFixed(1)}ms (frame-time proxy)`,
        movement: movement
          ? `${movement.state} · speed ${movement.snapshot.speed.toFixed(1)} · boost cd ${movement.snapshot.boostCooldownMs.toFixed(0)}ms · contacts ${movement.snapshot.collisionContacts}`
          : null,
        combat: playerDefence
          ? `drones ${drones.length} · proj ${projectiles.length} · crit ${hitCount > 0 ? ((critCount / hitCount) * 100).toFixed(0) : 0}% (${critCount}/${hitCount}) · shield ${playerDefence.snapshot.shield.toFixed(0)}/${playerDefence.snapshot.maxShield} · hull ${playerDefence.snapshot.hull.toFixed(0)}/${playerDefence.snapshot.maxHull}`
          : null,
        xp: xpSystem
          ? `Lv ${xpSystem.snapshot.level} · ${xpSystem.snapshot.xp.toFixed(0)}/${xpSystem.snapshot.nextThreshold.toFixed(0)} · gems ${xpPickups?.live.length ?? 0} · dmg +${(sandboxBuild.weaponBonus * 100).toFixed(0)}% · rate ×${(1 / sandboxBuild.fireIntervalScale).toFixed(2)}`
          : null,
        loot: groundLoot
          ? `ground ${groundLoot.live.length}/${DEFAULT_LOOT_TUNING.maxGroundLoot} · collected ${lootCollectedCount} · banked ${lootBankedCount}`
          : null,
        research: (() => {
          // AF-081 §Debug: efficiency + scientific progress, derived pure.
          const snap = researchTree.snapshot;
          const eff = researchEfficiencyFor(snap);
          const sci = scientificProgressFor(snap.unlockedCount, ROSTER_RESEARCH_TREE.length);
          return `pts ${snap.points} · unlocked ${snap.unlockedCount} · wpn +${(sandboxBuild.researchWeaponBonus * 100).toFixed(0)}% · loot +${(sandboxBuild.researchLootBonus * 100).toFixed(0)}% · eff ${(eff * 100).toFixed(0)}% · sci ${(sci * 100).toFixed(0)}%`;
        })(),
        meta: `acct Lv ${meta.snapshot.accountLevel} · runs ${meta.stat("runs")} · kills ${Math.round(meta.stat("enemiesDestroyed"))} · challenges ${meta.snapshot.completedChallenges}/${meta.snapshot.totalChallenges} · ${qaStatusSummary()} · ${regressionCoverageSummary()} · ${accessibilityStatusSummary()} · ${releaseReadinessSummary()}`,
        inventory: `${inventory.size} items · player ${inventory.countIn("player")} · loadouts ${inventory.allLoadouts.length} · builds ${buildManagementLiveSummary()}`,
        equipment: (() => {
          const eq = equipmentEffects();
          // AF-079: §Debug — energy usage, heat, mass from installed profiles + workshop lattice.
          const installedIds = new Set(Object.values(sandboxLoadoutSlots));
          const load = engineeringLoadFor(ROSTER_EQUIPMENT_PROFILES.filter((p) => installedIds.has(p.itemId)));
          const shop = workshop.snapshot;
          return `wpn +${((eq.bonuses.damage ?? 0) * 100).toFixed(0)}% · shield +${(eq.bonuses.shieldCapacity ?? 0).toFixed(0)} · sets ${eq.activeSetBonuses.length} · pwr ${eq.powerRating} · draw ${load.energyDraw} · heat ${load.heatLoad} · mass ${load.mass} · workshop ${shop.craftedCount}/${shop.workshopSize} crafted`;
        })(),
        relics: (() => {
          const collection = reliquary.snapshot;
          const setBonuses = activeSetBonusesFor(relicSystem.activeRelicIds);
          return `active ${relicSystem.activeRelicIds.length} [${relicSystem.activeRelicIds.join(", ") || "none"}] · synergies ${relicSystem.aggregate.synergies.length} · sets ${setBonuses.length} live · reliquary ${collection.ownedCount}/${collection.reliquarySize} owned, ${collection.evolvedCount} evolved`;
        })(),
        commander: commanderRuntime
          ? (() => {
              const prog = commanderProgression.snapshot;
              const rosterSnap = roster.snapshot;
              const usage = roster.statsFor(sandboxCommander.id);
              return `${sandboxCommander.callsign} (${prog.class}/${philosophyFor(sandboxCommander.id)}) · ability cd ${commanderRuntime.snapshot.activeCooldownMs.toFixed(0)}ms · ult ${commanderRuntime.snapshot.ultimateCharge.toFixed(0)}/${sandboxCommander.ultimate.chargeRequired}${commanderRuntime.snapshot.ultimateReady ? " READY" : ""} · talents ${prog.talentsUnlocked}/${prog.talentsTotal} (${prog.talentPoints} pts) · mission ${prog.missionBeat} · roster ${rosterSnap.recruitedCount}/${rosterSnap.rosterSize} · uses ${usage.uses} (${(usage.winRate * 100).toFixed(0)}% wr) · ${commanderTemplateCoverageSummary()} · ${recruitmentMethodLiveSummary()} · ${relationshipCoverageSummary()} · ${personalityFrameworkSummary()} · ${dialogueLibraryStatusSummary()} · ${masteryFeaturesLiveSummary()}`;
            })()
          : null,
        ships: shipRuntime
          ? (() => {
              const fit = shipOutfitting.snapshot;
              const fleetSnap = fleet.snapshot;
              return `${sandboxShip.name} (${sandboxShip.shipClass}/${fit.frameworkClass}) · ${sandboxFleetEntry.tier}/${sandboxFleetEntry.specialisation} · energy ${shipRuntime.snapshot.energy.toFixed(0)}/${sandboxShip.maxEnergy} · ${fit.offensiveIdentity}/${fit.primaryDefence} · modules ${fit.fittedModules}/${fit.moduleSlots} · fleet ${fleetSnap.collectedCount}/${fleetSnap.fleetSize}`;
            })()
          : null,
        weapons: weaponRuntime
          ? (() => {
              const mastery = weaponMastery.snapshot;
              const arsenalSnap = arsenal.snapshot;
              return `${sandboxWeapon.name} (${sandboxWeapon.category}/${sandboxWeapon.firePattern}) · ${sandboxArsenalEntry.tier}/${sandboxArsenalEntry.familyId} · ${mastery.frameworkCategory}/${mastery.element}${mastery.elementStatus ? `→${mastery.elementStatus}` : ""} · shots ${weaponRuntime.snapshot.shotsFired} · proj ${projectiles.filter((p) => p.live).length} · arsenal ${arsenalSnap.collectedCount}/${arsenalSnap.arsenalSize}`;
            })()
          : null,
        enemies: (() => {
          const alive = drones.filter((d) => d.alive);
          if (alive.length === 0) return "none active";
          const px = movement?.snapshot.x ?? 0;
          const py = movement?.snapshot.y ?? 0;
          const nearest = alive.reduce((closest, d) =>
            Math.hypot(d.x - px, d.y - py) < Math.hypot(closest.x - px, closest.y - py) ? d : closest,
          );
          const eliteCount = alive.filter((d) => d.elite).length;
          const eliteTag = nearest.eliteTier
            ? ` · ${nearest.eliteTier.toUpperCase()} [${nearest.eliteMutations.join(", ") || "no mutations"}]`
            : "";
          return `active ${alive.length} (${eliteCount}E) · nearest ${nearest.def.name} [${nearest.runtime.snapshot.state}]${nearest.runtime.isTelegraphing ? " TELEGRAPH" : ""} · hull ${nearest.hull.toFixed(0)}/${nearest.maxHull}${eliteTag}`;
        })(),
        boss: bossRuntime
          ? (() => {
              const snap = bossRuntime!.snapshot;
              return `${sandboxBoss.name} [${snap.state}] phase ${snap.phaseIndex + 1}/${sandboxBoss.phases.length} (${snap.phaseId})${snap.enraged ? " ENRAGED" : ""} · hull ${snap.hull.toFixed(0)}/${snap.maxHull} · shield ${snap.shield.toFixed(0)}/${snap.maxShield} · weak pts destroyed ${snap.weakPointsDestroyed.length}/${sandboxBoss.weakPoints.length}`;
            })()
          : null,
        biome: biomeRuntime
          ? (() => {
              const snap = biomeRuntime!.snapshot;
              const visual = biomeVisualIdentityFor(activeBiome.id);
              return `${activeBiome.name} · weather ${snap.activeWeather ?? "clear"} (${(snap.weatherRemainingMs / 1000).toFixed(0)}s) · hazards ${snap.hazardCount} · events ${snap.eventsTriggered}${snap.lastEventKind ? ` (last: ${snap.lastEventKind})` : ""} · lighting ${visual.lighting} · skybox ${visual.skybox}`;
            })()
          : null,
        mission: missionRuntime
          ? (() => {
              const snap = missionRuntime!.snapshot;
              const missionProfile = MISSION_PROFILES.find((p) => p.missionId === selectedMissionTemplate.id);
              return `${selectedMissionTemplate.name} (${missionProfile?.frameworkCategory ?? "?"} · budget ${missionProfile?.threatBudget ?? 0}) [${session?.phase ?? "—"}] · primary ${snap.primaryDone}/${snap.primaryTotal} · optional ${snap.optionalDone}/${snap.optionalTotal} · modifiers [${snap.activeModifierKinds.join(", ") || "none"}] · log ${expeditionLog.snapshot.timelineLength} (${expeditionLog.snapshot.perfectCount} perfect)`;
            })()
          : null,
        galaxy: (() => {
          const snap = galaxyRuntime.snapshot;
          const explorationKey = `galaxy:${snap.currentSystemId}:explorationPercent`;
          // AF-090 §Debug: Population, Infrastructure, Construction,
          // Development Level, Civilisation Rating — the visible rebuild.
          const civSnap = civilisation.snapshot;
          const megastructuresComplete = civilisation.allMegastructures.filter((m) => m.completed).length;
          return `${snap.currentSystemName} (${snap.region}) · exploration ${meta.stat(explorationKey).toFixed(0)}% · events ${snap.eventsTriggered}${snap.lastEventKind ? ` (last: ${snap.lastEventKind})` : ""} · settlements ${civSnap.settlementCount} · pop ${civSnap.averagePopulation.toFixed(0)} · upgrades ${civSnap.totalUpgradesBuilt} · construction ${civSnap.averageConstructionProgress.toFixed(0)}% · dev ${civSnap.averageDevelopmentLevel.toFixed(1)}/6 · rating ${civSnap.civilisationRating.toFixed(0)} · megastructures ${megastructuresComplete}/9`;
        })(),
        factions: (() => {
          const snap = factionRuntime.snapshot;
          const currentSystem = galaxyRuntime.currentSystem;
          const dominant = factionRuntime.findFactionByName(currentSystem.dominantFaction);
          const rep = dominant ? meta.stat(`faction:${dominant.id}:reputation`) : 0;
          const level = dominant ? FactionRuntime.reputationLevel(rep) : "—";
          const relation = factionRuntime.relationshipBetween("crystalDominion", "machineCollective");
          // AF-085: profiled coverage + the ten-civilisation register, live.
          const diplomatic = CIVILISATION_REGISTER.filter((c) => c.realisation.kind === "diplomatic").length;
          // AF-086: Galaxy Stability, Faction Growth, Active Wars, Economic
          // Output, Scientific Progress — the living ecosystem's §Debug fields.
          const eco = civSim.snapshot;
          return `${dominant?.name ?? "—"} rep ${rep.toFixed(0)} (${level}) · CD↔MC ${relation} · events ${snap.eventsTriggered}${snap.lastEventKind ? ` (last: ${snap.lastEventKind})` : ""} · profiled ${FACTION_PROFILES.length}/10 · civs ${CIVILISATION_REGISTER.length} (${diplomatic} diplomatic) · stability ${eco.galaxyStability.toFixed(0)} · growth ${eco.averagePopulationGrowth.toFixed(0)} · wars ${eco.activeWarCount} · econ ${eco.averageEconomicOutput.toFixed(0)} · sci ${eco.averageScientificProgress.toFixed(0)} · history ${eco.historyLength}`;
        })(),
        economy: (() => {
          const snap = marketRuntime.snapshot;
          const credits = meta.stat(CREDITS_KEY);
          const researchData = researchTree.snapshot.points;
          const crystalEssence = crafting.materialCount("crystalFragments");
          const offers = marketRuntime.offersFor("lucent-gate-trader").length;
          // AF-089 §Debug: Supply, Demand, Trade Routes, Industrial Output,
          // Population, Economic Health — the galactic economy, live.
          const galEco = galacticEconomy.snapshot;
          return `credits ${credits.toFixed(0)} · research data ${researchData} · crystal essence ${crystalEssence} · offers ${offers} · events ${snap.eventsTriggered}${snap.activeEventKind ? ` (active: ${snap.activeEventKind})` : ""} · supply ${galEco.totalSupply.toFixed(0)} · demand ${galEco.totalDemand.toFixed(1)} · routes ${galEco.openTradeRouteCount} · industry ${galEco.averageIndustrialOutput.toFixed(0)} · pop ${galEco.averagePopulation.toFixed(0)} · health ${galEco.economicHealth.toFixed(0)}%`;
        })(),
        worldEvents: (() => {
          const snap = worldEventRuntime.snapshot;
          const last = snap.lastEvent;
          const worldStateLine = last ? `${last.worldStateKey} ${meta.stat(`worldState:${last.worldStateKey}`).toFixed(0)}` : "—";
          return `${last ? `${last.category} · ${last.kind}` : "—"} · ${worldStateLine} · events ${snap.eventsTriggered}`;
        })(),
        achievements: (() => {
          const done = SANDBOX_ACHIEVEMENTS.filter((a) => meta.hasDiscovered("achievements", a.id)).length;
          const resources = collectionLedger.collectionCount("resources");
          const artefacts = collectionLedger.collectionCount("ancientArtefacts");
          return `${done}/${SANDBOX_ACHIEVEMENTS.length} complete · resources ${resources} · artefacts ${artefacts} · log ${collectionLedger.recentDiscoveries.length}`;
        })(),
        codex: (() => {
          const unlocked = codexRuntime.unlockedEntries(codexReader).length;
          const total = codexRuntime.all.length;
          const timelineUnlocked = codexRuntime.timeline(codexReader).length;
          // AF-087 §Debug: Discovery Progress + Player Journal, live.
          const progress = codexDiscovery.snapshot;
          const journalSnap = codexJournal.snapshot;
          // AF-088 §Debug: Knowledge Graph size, Museum Completion, Timeline
          // Completion, and the two permanent ledgers, live.
          const completion = collectionCompletionFor(codexRuntime, codexReader, 6, MUSEUM_EXHIBIT_KINDS.filter((k) => k.live).length);
          return `${unlocked}/${total} entries (${codexRuntime.discoveryPercent(codexReader).toFixed(0)}%) · missing links ${codexRuntime.missingLinkCount()} · timeline ${timelineUnlocked}/${TIMELINE_ERAS.length} · observed ${progress.observedCount} · mastered ${progress.masteredCount} · journal ${journalSnap.pinnedCount}pin/${journalSnap.bookmarkedCount}bm/${journalSnap.favouriteCount}fav · archived ${codexArchive.archivedCount} · museum ${completion.museum.toFixed(0)}% · sci-archive ${scientificArchive.length} · expo-journal ${expeditionJournal.length} · goals ${playerNotebook.researchGoalIds.length}`;
        })(),
        saveFramework: (() => {
          const statuses = saveCoordinator.allStatuses;
          const totalSaves = statuses.reduce((sum, s) => sum + s.saveCount, 0);
          const lastSaved = statuses.length > 0 ? Math.max(...statuses.map((s) => s.lastSavedAtMs)) : null;
          const sliceVersions = saveVersionSummary([
            { key: "settings", version: 1 },
            { key: "research", version: 1 },
            { key: "crafting", version: 1 },
            { key: "collectionLedger", version: 1 },
            { key: "meta", version: 1 },
            { key: "inventory", version: 1 },
          ]);
          return `v1 (${statuses.length} slices) · autosave ${totalSaves} total${lastSaved ? `, last ${((Date.now() - lastSaved) / 1000).toFixed(0)}s ago` : ""} · milestone backups ${milestoneBackupCount} · cloud offline (local only) · profile ${activeProfileName} · schema ${sliceVersions}`;
        })(),
        audio: (() => {
          // AF-091: adaptive layers composed on top of AF-045's real music state.
          const hullFraction = playerDefence ? playerDefence.snapshot.hull / playerDefence.snapshot.maxHull : 1;
          const layers = adaptiveMusicLayersFor({
            hullFraction,
            recentDiscovery: false,
            eliteOrBossPressure: director?.snapshot.phase === "MiniBoss" || bossRuntime !== null,
          });
          return `music ${audioEngine.musicState ?? "—"} · voices ${audioEngine.activeVoiceCount()} · master ${(audioMixer.effectiveVolume("master") * 100).toFixed(0)}% · muted ${audioMixer.isMuted("master") ? "yes" : "no"} · tension ${(layers.tension * 100).toFixed(0)}%${layers.lowHealthSting ? " (low-health sting)" : ""}`;
        })(),
        outlaws: (() => {
          if (outlawSquads.length === 0 && outlawMines.length === 0) return null;
          const squadLine = outlawSquads
            .map((s) => {
              const snap = s.snapshot;
              return `${snap.state} (${snap.order}, ${snap.captainAlive ? "captain up" : "captain down"}, ${snap.membersRemaining} left)`;
            })
            .join("; ");
          return `squads ${outlawSquads.length}${squadLine ? ` [${squadLine}]` : ""} · mines ${outlawMines.length}`;
        })(),
        machines: (() => {
          if (machineNetworks.length === 0) return null;
          const lines = machineNetworks
            .map((n) => {
              const snap = n.snapshot;
              const services = [snap.shieldNetworkUp ? "shields" : null, snap.repairUp ? "repair" : null, snap.factoryUp ? "factory" : null].filter(Boolean).join("+") || "none";
              return `${snap.state} (${snap.coreOnline ? "core online" : "core offline"}, ${snap.membersRemaining} units, ${services}, adapt p${snap.adaptation.physical}/e${snap.adaptation.energy}, built ${snap.factorySpawns})`;
            })
            .join("; ");
          return `networks ${machineNetworks.length} [${lines}]`;
        })(),
        crystals: (() => {
          if (crystalEcosystems.length === 0 && crystalGrowths.length === 0) return null;
          const lines = crystalEcosystems
            .map((e) => {
              const snap = e.snapshot;
              return `${snap.membersRemaining} organisms, ${snap.nodesRemaining} nodes, strength ${(snap.resonanceStrength * 100).toFixed(0)}%`;
            })
            .join("; ");
          return `ecosystems ${crystalEcosystems.length}${lines ? ` [${lines}]` : ""} · growths ${crystalGrowths.length}`;
        })(),
        voidSwarm: (() => {
          if (voidSwarms.length === 0 && voidZones.length === 0) return null;
          const lines = voidSwarms
            .map((s) => {
              const snap = s.snapshot;
              return `${snap.membersRemaining} organisms, ${snap.beaconsRemaining} beacons, corruption ${(snap.corruptionLevel * 100).toFixed(0)}%`;
            })
            .join("; ");
          return `swarms ${voidSwarms.length}${lines ? ` [${lines}]` : ""} · zones ${voidZones.length}`;
        })(),
        ancientSecurity: (() => {
          if (ancientSites.length === 0) return null;
          const lines = ancientSites
            .map((s) => {
              const snap = s.snapshot;
              return `${snap.stage} (${(snap.alertLevel * 100).toFixed(0)}%, ceiling ${(snap.ceiling * 100).toFixed(0)}%, ${snap.membersRemaining} units, ${snap.nodesRemaining} nodes, deployed ${snap.guardiansDeployed})`;
            })
            .join("; ");
          return `sites ${ancientSites.length} [${lines}]`;
        })(),
        xenoHive: (() => {
          if (xenoHives.length === 0 && acidPools.length === 0) return null;
          const lines = xenoHives
            .map((h) => {
              const snap = h.snapshot;
              return `${snap.stage} (biomass ${(snap.biomass * 100).toFixed(0)}%, ${snap.nodeLinked ? "linked" : "severed"}, ${snap.membersRemaining} organisms, reinforced ${snap.reinforcementsCalled})`;
            })
            .join("; ");
          return `hives ${xenoHives.length}${lines ? ` [${lines}]` : ""} · acid pools ${acidPools.length}`;
        })(),
        nomadFleets: (() => {
          if (nomadFleets.length === 0) return null;
          const lines = nomadFleets
            .map((f) => {
              const snap = f.snapshot;
              return `scrap ${snap.scrap.toFixed(0)}/${NOMAD_FLEET_TUNING.maxScrap} (${snap.commandShipAlive ? "command up" : "command down"}, ${snap.membersRemaining} crew, ${snap.escortsRemaining} escorts)`;
            })
            .join("; ");
          return `fleets ${nomadFleets.length} [${lines}]`;
        })(),
        paragonProtocols: (() => {
          if (paragonProtocols.length === 0 && singularityCharges.length === 0) return null;
          const lines = paragonProtocols
            .map((p) => {
              const snap = p.snapshot;
              return `stability ${(snap.stability * 100).toFixed(0)}% (${snap.collapsed ? "COLLAPSED" : "contained"}, ${snap.membersRemaining} units, ${snap.sentinelsRemaining} sentinels)`;
            })
            .join("; ");
          return `protocols ${paragonProtocols.length}${lines ? ` [${lines}]` : ""} · charges ${singularityCharges.length}`;
        })(),
        celestialConstellations: (() => {
          if (celestialConstellations.length === 0 && gravityWells.length === 0) return null;
          const lines = celestialConstellations
            .map((c) => {
              const snap = c.snapshot;
              const linkSummary = snap.members.map((m) => m.linkCount).join(",");
              return `${snap.membersRemaining} entities, links [${linkSummary}]`;
            })
            .join("; ");
          return `constellations ${celestialConstellations.length}${lines ? ` [${lines}]` : ""} · gravity wells ${gravityWells.length}`;
        })(),
        eclipsed: (() => {
          if (eclipsedGroups.length === 0) return null;
          const lines = eclipsedGroups
            .map((g) => {
              const snap = g.snapshot;
              const stages = snap.members.map((m) => m.stage).join(",");
              return `${snap.membersRemaining} lost [${stages}] (${snap.wardenAlive ? "warden holds" : "warden gone"}, mirror +${(snap.mimicryDamageBonus * 100).toFixed(0)}%, echoes ${snap.echoesEmitted})`;
            })
            .join("; ");
          return `expeditions ${eclipsedGroups.length} [${lines}]`;
        })(),
        conductor: (() => {
          if (!conductor || !director) return null;
          const snap = conductor.snapshot;
          const pressure = pressureFor(director.snapshot.phase, snap.windowOpen);
          const window = snap.windowOpen
            ? `recovery ${(snap.windowRemainingMs / 1000).toFixed(1)}s (${snap.lastTrigger})`
            : `no window (cooldown ${(snap.cooldownRemainingMs / 1000).toFixed(1)}s)`;
          return `${pressure} · ${window} · queue ${snap.queuedDirectives} · struggle ${(snap.struggleScore * 100).toFixed(0)}% · windows ${snap.windowsOpened}`;
        })(),
        bossDirector: (() => {
          if (!bossDirector || !bossRuntime) return null;
          const snap = bossDirector.snapshot;
          const bossSnap = bossRuntime.snapshot;
          const beat = beatFor(bossSnap.state, bossSnap.phaseIndex, sandboxBoss.phases.length, snap.transitionActive);
          const hold = snap.transitionActive ? `holding ${(snap.transitionRemainingMs / 1000).toFixed(1)}s` : "attacking";
          return `${beat} · ${hold} · summons ${snap.queuedSummons} queued/${snap.summonsIssued} issued · ceremony ${snap.queuedCeremonyLines} · cinematics ${snap.cinematicsFired}`;
        })(),
        campaign: (() => {
          const snap = campaign.snapshot;
          const objectives = snap.objectives.length > 0
            ? snap.objectives.map((o) => `${o.current}/${o.target}`).join(" ")
            : "open galaxy";
          return `${snap.stage} · "${snap.chapterName}" (${snap.chapterIndex + 1}/${snap.chapterCount}) · obj ${objectives} · flags ${snap.storyFlagCount} · unlocks ${snap.unlockCount} · beats ${snap.pendingBeats} · world ${snap.worldChangeCount}`;
        })(),
        endgame: (() => {
          const snap = endgame.snapshot;
          if (!snap.unlocked) return "locked — the endgame begins after the main campaign";
          return `Ascension ${snap.ascensionLevel} · milestones ${snap.milestonesThisAscension}/${snap.milestonesRequired}${snap.canAscend ? " (ASCEND READY)" : ""} · expeditions ${snap.expeditionsThisAscension}/${snap.expeditionsLifetime} lifetime · research ${snap.researchNodesTotal} · evolution ${snap.worldEvolutionCount} · legacy ${snap.legacyCount} · mods ${snap.activeModifierCount}`;
        })(),
        liveOps: (() => {
          const snap = liveOps.snapshot;
          return `v${snap.liveVersion} · packs ${snap.packCount} (${snap.contentCount} additions) · season ${snap.activeSeason ?? "—"} · retired ${snap.retiredTemporaryCount} · compat ok`;
        })(),
        bonds: (() => {
          const snap = bondNetwork.snapshot();
          const dualUltimatesUnlocked = DUAL_ULTIMATES.filter((d) => bondNetwork.isMaxBond(d.commanderA, d.commanderB)).length;
          return `${snap.totalBonds} pairs · ${snap.discoveredBonds} discovered · ${snap.maxedBonds} maxed (avg lvl ${snap.averageLevel.toFixed(2)}) · dual ultimates ${dualUltimatesUnlocked}/${DUAL_ULTIMATES.length}`;
        })(),
        ship: (() => {
          const snap = livingShip.snapshot();
          return `${snap.name} · upgrades ${snap.totalUpgradeLevel}/${snap.maxUpgradeLevel} (${snap.fullyUpgradedCategories}/${snap.totalCategories} maxed) · rooms ${shipCommanderRooms.length} · companions ${companionHabitat.count()} · memorial ${memorialGarden.all().length}`;
        })(),
        livingGalaxy: `pollution ${livingGalaxyEnvironment.averagePollution().toFixed(0)} · wildlife ${livingGalaxyEnvironment.averageWildlife().toFixed(0)} · rep ${livingGalaxyReputation.grandTotal()} · chronicle ${livingGalaxyChronicle.all().length} · festival ${livingGalaxyFestivals.currentFestival()} · unresolved crime ${livingGalaxyCrime.unresolvedCount()}`,
        legacy: `xp ${legacyProgress.totalXp()} (${legacyProgress.topCategory()}) · records ${legacyRecords.all().length}/9 · history ${legacyHistory.all().length} · favourite planet ${legacyChronicle.favouritePlanet() ?? "—"} · journal ${legacyJournal.all().length} · gifts ${legacyGifts.all().length} · photos ${legacyPhotos.all().length}`,
        livingMuseum: `quality ${museumQuality.value().toFixed(0)} · restoration ${museumRestoration.completedCount()}/${museumRestoration.allProjects().length} · donations ${museumDonations.all().length} · visitors ${museumVisitors.totalVisitors()} · theater ${museumTheater.all().length} · library ${museumLibrary.all().length} · audio ${museumAudioArchive.all().length}`,
        chronicle: (() => {
          const finalChronicle = generateFinalChronicle(legacyHistory, legacyChronicle, legacyProgress);
          return `planets ${chroniclePlanets.all().length} · oral history ${chronicleOralHistory.all().length} · books ${chronicleBooks.all().length} · writable ${chronicleWritableEntries.all().length} · commander memories ${chronicleCommanderMemories.all().length} · final chronicle records ${finalChronicle.totalHistoricalRecords}`;
        })(),
        storyEngine: (() => {
          const bias = storyDirector.pacingBias();
          const branchAxisSample = storyBranches.leaningFor("Curiosity vs Caution");
          const commanderStoryBeats = commanderStorylines.beatFor(sandboxCommander.id, "Origin Story")?.allVersions().length ?? 0;
          return `pillars [${storyPillars.dominantPillars(2).join(", ") || "none yet"}] · theme ${deriveCampaignTheme(storyPillars)} · rep ${reputationTitleFor(legacyProgress)} · pacing combat ${(bias.combat * 100).toFixed(0)}%/explore ${(bias.exploration * 100).toFixed(0)}%/downtime ${(bias.downtime * 100).toFixed(0)}% · callbacks ${narrativeCallbacks.all().length} · branch lean ${branchAxisSample} · commander story beats ${commanderStoryBeats}`;
        })(),
        eventEngine: (() => {
          const weights = tierWeightsFor({
            economyHealth: meta.stat(CREDITS_KEY) * 0.01,
            averagePollution: livingGalaxyEnvironment.averagePollution(),
            averageWildlife: livingGalaxyEnvironment.averageWildlife(),
            reputationTotal: livingGalaxyReputation.grandTotal(),
            strongestBondLevel: bondNetwork.snapshot().averageLevel,
            dominantPillarCount: storyPillars.dominantPillars(2).length,
          });
          return `weights [${EVENT_TIERS.map((t) => `${t} ${weights[t].toFixed(1)}`).join(", ")}] · logged ${galacticEventLog.all().length} · mining-boom chain ${miningBoomChain.stepsCompleted()}/${miningBoomChain.totalSteps()} (${miningBoomChain.currentStep() ?? "complete"})`;
        })(),
        civilisationEngine: (() => {
          const settlement = civilisation.allSettlements[0];
          if (!settlement) return null;
          const summary = civilisationAttributeSummaryFor(settlement.profile.settlementId, civilisation, civSim, civilisationAttributes);
          if (!summary) return null;
          return `${settlement.profile.name} stage ${summary.stage} · pop ${summary.values.Population.toFixed(0)} · culture ${summary.values.Culture.toFixed(0)} · megaprojects ${civilisationMegaprojects.completedCount()}/${CIVILISATION_MEGAPROJECTS.length} · landmarks ${civilisationLandmarks.all().length} · immigration ${civilisationImmigration.all().length} · social ${civilisationSocialCalendar.currentEvent()} · gov lean ${civilisationGovernment.dominantPriority() ?? "none"} · opinion ${civilisationPublicOpinion.overallOpinion().toFixed(1)} · careers ${civilisationCareers.totalPromotions()}`;
        })(),
        evolutionEngine: (() => {
          const settlement = civilisation.allSettlements[0];
          const archStage = settlement ? architecturalStageFor(settlement.developmentStage) : "—";
          const prog = commanderProgression.snapshot;
          const maturityScore = commanderMaturityScore(prog.talentsUnlocked, prog.missionBeatIndex, bondNetwork.snapshot().averageLevel);
          const maturityStage = commanderMaturityStageFor(maturityScore);
          const unlockedNodes = researchTree.unlockedNodes;
          const averageTier = unlockedNodes.length > 0 ? unlockedNodes.reduce((sum, n) => sum + n.tier, 0) / unlockedNodes.length : 0;
          const era = technologyEraFor(unlockedNodes.length, averageTier);
          const transportTier = transportTierFor(civilisation.epochCount, researchTree.isUnlocked("warp-charting"));
          const rank = playerEvolutionRankFor(meta.snapshot.accountLevel);
          const greatProjects = greatProjectsProgressSummary(civilisation, civilisationMegaprojects);
          const firstCompanion = companionHabitat.all()[0];
          const companionStage = firstCompanion ? companionEvolution.stageFor(firstCompanion.id) : "none yet";
          return `${era} · transport ${transportTier} · architecture ${archStage} (${architectureHistory.layersFor(settlement?.profile.settlementId ?? "").length} layers) · commander ${maturityStage} · rank ${rank} · equipment ${equipmentEvolution.stageFor("rail-rifle")} · species records ${speciesAdaptation.all().length} · companion ${companionStage} · phrases ${languageEvolution.all().length} · great projects ${greatProjects.completedProjects}/${greatProjects.totalProjects} (avg ${(greatProjects.averageProgress * 100).toFixed(0)}%)`;
        })(),
        endgameEngine: (() => {
          if (!endgame.snapshot.unlocked) return "locked — the endgame begins after the main campaign";
          const knowledge = infiniteResearchProjectFor(researchTree.unlockedNodes.length);
          return `expeditions ${frontierExpeditions.completedCount()}/${GREAT_EXPEDITION_DESTINATIONS.length} · council lean ${expeditionCouncil.dominantPriority() ?? "none"} · legacy successors ${commanderLegacy.all().length} · mega discoveries ${megaDiscoveries.all().length} · museum sectors ${galacticMuseumExpansion.sectorCount()} (artifacts ${galacticMuseumExpansion.artifactCount()}, exhibition ${temporaryExhibitionThemeFor(civilisation.epochCount)}) · megacities ${megacities.all().length} · industries ${emergentIndustries.all().length} · annual ${annualEndgameCalendar.currentEvent()} · knowledge ${knowledge.kind}`;
        })(),
        galacticCreator: (() => {
          creationHeritage.recordTransition("garden-verdance", heritageStageFor(civilisation.epochCount), civilisation.epochCount);
          return `albums ${photoAlbums.all().length} · exhibitions ${exhibitionCurator.all().length} · flags ${expeditionFlags.all().length} · garden elements ${gardenDesigns.elementsFor("garden-verdance").length} · observatory elements ${observatoryDesigns.elementsFor("observatory-first-light").length} · playlists ${soundtrackPlaylists.tracksFor("Ship").length} · commander ideas ${commanderContributions.all().length} · community ${communityProjects.completedCount()}/${COMMUNITY_PROJECT_EXAMPLES.length} · heritage ${creationHeritage.currentStageFor("garden-verdance") ?? "—"}`;
        })(),
        moduleUniverse: (() => {
          const oceanWorlds = moduleUniverse.moduleFor("expansion-ocean-worlds");
          if (!oceanWorlds) return null;
          const qa = moduleQaReport(oceanWorlds, moduleUniverse);
          const order = moduleUniverse.topologicalLoadOrder();
          return `modules ${moduleUniverse.all().length}/${MODULE_CATEGORIES.length} categories · compat [${moduleUniverse.compatibilityFor("expansion-ocean-worlds").join(", ")}] · qa ${qa.passed ? "passed" : "failed"} · loaded ${moduleUniverse.loadedCount()} · order ${order ? "resolved" : "CYCLE"} · discoveries ${contentDiscovery.all().length}/${CONTENT_DISCOVERY_KINDS.length}`;
        })(),
        atlasFramework: (() => {
          const commanderReport = commanderCompletenessFor({
            hasUniqueFantasy: true,
            gameplayDuplicatesExisting: false,
            bondLinkCount: bondNetwork.snapshot().discoveredBonds,
            shipRoomAssigned: shipCommanderRooms.some((r) => r.commanderId === sandboxCommander.id),
            museumContributionCount: museumDonations.fromCommander(sandboxCommander.id).length,
            hasChronicleBiography: chronicleCommanderMemories.historyFor(sandboxCommander.id).length > 0,
            personalQuestCount: commanderStorylines.beatFor(sandboxCommander.id, "Origin Story")?.allVersions().length ?? 0,
            masteryTrackProgress: commanderProgression.snapshot.talentsUnlocked,
            accessibilityReviewed: true,
          });
          const settlement = civilisation.allSettlements[0];
          const worldReport = settlement
            ? worldCompletenessFor({
                hasUniqueEcology: livingGalaxyEnvironment.averageWildlife() > 0,
                hasDistinctArchitecture: architectureHistory.layersFor(settlement.profile.settlementId).length > 0,
                hasWeatherProfile: true,
                hasWildlife: livingGalaxyEnvironment.averageWildlife() > 0,
                hasHistory: civilisation.epochCount > 0,
                hasEconomy: galacticEconomy.snapshot.colonyCount > 0,
                hasCulture: true,
                hasMusic: true,
                hasExplorationIdentity: true,
                museumCompatible: museumQuality.value() > 0,
              })
            : null;
          return `design gate ${designScoreCard.passesGate() ? "passed" : "pending"} · commander checklist ${Object.values(commanderReport.checks).filter(Boolean).length}/${COMMANDER_VALIDATION_CHECKLIST.length} · world checklist ${worldReport ? Object.values(worldReport.checks).filter(Boolean).length : 0}/${WORLD_VALIDATION_CHECKLIST.length} · post-launch ${postLaunchSupport.all().length} · knowledge base ${knowledgeBase.all().length}`;
        })(),
        aos: (() => {
          aosClocks.report("Civilisation Time", civilisation.epochCount);
          aosClocks.report("Real Time", sessionMs / 1000);
          aosPerformanceBudget.reportUsage("Rendering", 40);
          aosPerformanceBudget.reportUsage("Simulation depth", 55);
          const decision = aosDecisionRouter.resolve([
            { systemId: "living-galaxy", targetId: "settlement-verdance", tier: "Medium", fromPlayer: false },
            { systemId: "weather", targetId: "settlement-verdance", tier: "Low", fromPlayer: false },
          ]);
          const forecast = aosPrediction.forecast("Population growth", [40, 44, 48]);
          const context = buildDialogueContext({
            playerReputation: 0,
            currentCommanderId: sandboxCommander.id,
            planetHistoryCount: architectureHistory.all().length,
            timeOfDay: "day",
            relationshipStatus: "neutral",
            weatherCondition: "clear",
            nearbyDiscoveryCount: contentDiscovery.all().length,
            recentConversationCount: chronicleCommanderMemories.all().length,
          });
          return `responsibilities ${AOS_RESPONSIBILITIES.length} · bus events ${aosTelemetry.totalEvents()} · world state ${aosWorldState.isEmergency() ? "EMERGENCY" : "stable"} (settlements ${aosWorldState.getCurrent()?.settlementCount ?? 0}) · clocks [civ ${aosClocks.valueFor("Civilisation Time")}] · priority player=${aosPriority.tierFor("player")} · decision→${decision?.winner.systemId ?? "none"} · forecast ${forecast.predictedNext.toFixed(0)} (${(forecast.confidence * 100).toFixed(0)}%) · throttle [${aosPerformanceBudget.recommendedThrottleTargets().join(", ") || "none"}] · recoveries ${aosRecoveryLog.all().length} · dialogue friendly=${context.isFriendly}`;
        })(),
        designConstitution: (() => {
          const latest = featureCompliance.all().at(-1);
          return `features ${featureCompliance.all().length} (${featureCompliance.passedCount()} passed content test) · latest ${latest ? `${latest.featureId} ${latest.contentTest.yesCount}/${latest.contentTest.totalQuestions} · expansion ${latest.expansionTestPassed ? "passed" : "failed"}` : "—"} · dominant pillar ${pillarReinforcement.dominantPillar() ?? "none"} · reinforcements ${pillarReinforcement.all().length}`;
        })(),
        atlasCore: (() => {
          const latest = atlasCompliance.all().at(-1);
          return `principles ${ATLAS_PRINCIPLES.length} · hierarchy ${ATLAS_SYSTEM_HIERARCHY.length} systems · features ${atlasCompliance.all().length} (${atlasCompliance.passedCount()} validated) · latest reinforced ${latest?.principlesReinforcedCount ?? 0} · dominant principle ${atlasPrincipleReinforcement.dominantPrinciple() ?? "none"}`;
        })(),
        franchiseBible: (() => {
          const resolved = canonResolver.resolve(canonLedger.statementsFor("first-expedition"));
          return `era ${eraFor(civilisation.epochCount).name} · canon tiers ${CANON_TIERS.length} (statements ${canonLedger.all().length}, authoritative "${resolved?.sourceId ?? "none"}") · projects ${franchiseCompliance.all().length} (${franchiseCompliance.passedCount()} compliant)`;
        })(),
        canonEngine: (() => {
          const lore = loreValidationReport({
            timelineConflictFree: true,
            characterConsistent: true,
            planetHistoryRespected: true,
            commanderRelationshipsRespected: true,
            scientificallyPlausible: true,
            historicalReferencesValid: true,
            museumIntegrated: museumQuality.value() > 0,
            chronicleCompatible: true,
            expansionDependenciesResolved: true,
          });
          return `events ${canonEvents.all().length} · knowledge diverged=${knowledgeStates.hasDiverged("event-first-contact")} · lore ${Object.values(lore.checks).filter(Boolean).length}/${LORE_VALIDATION_CHECK_KINDS.length} (${lore.passed ? "passed" : "failed"}) · continuity facts ${commanderContinuity.all().length} · artifacts ${artifactAuthenticity.all().length}`;
        })(),
        atlasProtocol: (() => {
          const impact = systemImpactReportFor({ Gameplay: true, Civilisation: true, History: true });
          const flags = featureFlagAssessment(new Set(), new Set(GREEN_FLAGS.slice(0, 3)));
          const finalValidation = finalValidationPassed(new Set(FINAL_VALIDATION_QUESTIONS));
          return `stage ${featureLifecycle.stageFor("expansion-ocean-worlds") ?? "—"} · impact [${impact.affected.join(", ")}] · flags reject=${flags.shouldReject} green=${flags.greenFlagStrength} · atlas score ${atlasScoreCard.overallScore().toFixed(1)} (${atlasScoreCard.passesGate() ? "passed" : "pending"}) · cycles ${iterationCycles.cycleCountFor("expansion-ocean-worlds")} ready=${iterationCycles.readyToShip("expansion-ocean-worlds")} · final validation ${finalValidation ? "passed" : "iterating"}`;
        })(),
        masterIndex: (() => {
          const indexId = `commander-${sandboxCommander.id}`;
          const order = masterIndex.dependencyOrder();
          return `entries ${masterIndex.all().length}/${MASTER_CATALOGUE_CATEGORIES.length} categories · order ${order ? "resolved" : "CYCLE"} · relationships ${relationshipGraph.relatedTo(indexId).length} · dependency links ${dependencyMap.all().length} · version history ${versionHistory.historyFor(indexId).length} · quality ${qualityTracker.overallFor(indexId).toFixed(1)}`;
        })(),
      });
    }
  },
});

const debugOverlay = import.meta.env.DEV ? new DebugOverlay(document.body) : null;

// AF-046 → AF-055 §DEBUG: dev-only faction-encounter spawn keys (one per digit), in the same spirit
// as the debug overlay itself (AF-016 §10) — excluded from production builds.
if (import.meta.env.DEV) {
  window.addEventListener("keydown", (event) => {
    if (machine.base !== "Gameplay" || !movement) return;
    const player = movement.snapshot;
    if (event.key === "8") {
      spawnOutlawSquad(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(5, 1);
    } else if (event.key === "9") {
      spawnMachineNetwork(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "7") {
      spawnCrystalEcosystem(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "6") {
      spawnVoidSwarm(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "5") {
      spawnAncientSite(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "4") {
      spawnHive(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "3") {
      spawnFleet(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "2") {
      spawnProtocol(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "1") {
      spawnConstellation(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    } else if (event.key === "0") {
      spawnEclipsed(player.x + 8, player.y);
      director?.notifyEnemiesSpawned(6, 1);
    }
  });
}

render();
loop.start();
// Boot state loads persistent slices, then hands over (AF-016 Boot's job).
void (async () => {
  settings = await settingsSlice.load();
  researchTree.loadSave(await researchSlice.load());
  crafting.loadSave(await craftingSlice.load());
  meta.loadSave(await metaSlice.load());
  inventory.loadSave(await inventorySlice.load());
  collectionLedger.loadSave(await collectionLedgerSlice.load());
  // AF-044: Save Slots — every install always has at least a Primary Profile.
  let profiles = await saveProfileManager.list();
  if (profiles.length === 0) {
    await saveProfileManager.create("Commander", "primary");
    profiles = await saveProfileManager.list();
  }
  const activeId = await saveProfileManager.activeProfileId();
  activeProfileName = profiles.find((p) => p.id === activeId)?.name ?? "—";
  machine.transitionTo("Splash");
  log.info("boot", "Afterlight core gameplay skeleton started", {
    researchUnlocked: researchTree.snapshot.unlockedCount,
    hangar: crafting.hangarItems.length,
    accountLevel: meta.snapshot.accountLevel,
  });
})();
