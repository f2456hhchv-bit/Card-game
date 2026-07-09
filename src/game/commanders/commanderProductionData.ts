/**
 * Commander Production Framework (AF-098). Extends AF-030's CommanderDef,
 * AF-071's CommanderProfileDef/CommanderProgressionRuntime, AF-072's
 * RosterRuntime, and AF-026's MetaProgression — all UNCHANGED. Realises
 * the spec's 37-field "Every Commander Must Define" list onto whichever
 * of those already carries the field, and honestly flags the 16 that are
 * genuinely new (their SHAPE is defined here; per-commander content
 * authoring is separate future work). Personality is dialogue-only by
 * shape — no bonus field exists on PersonalityDialogueHint, mirroring
 * CommanderRelationshipDef's own "not gameplay balance" law. Zero
 * changes to any locked module.
 */

/** Commander Production Pipeline — 14-stage LINEAR pipeline (AF-098
 * §Commander Production Pipeline), the same shape as AF-095/097's
 * pipelines: stages only advance, no ring, always terminates. */
export const COMMANDER_PRODUCTION_PIPELINE_STAGES = [
  "loreFoundation",
  "combatPhilosophy",
  "personality",
  "visualIdentity",
  "shipSynergy",
  "weaponSynergy",
  "abilities",
  "talentTree",
  "masteryTrack",
  "recruitmentStory",
  "dialogue",
  "accessibilityReview",
  "performanceValidation",
  "productionLock",
] as const;
export type CommanderProductionStage = (typeof COMMANDER_PRODUCTION_PIPELINE_STAGES)[number];

export function nextCommanderProductionStage(stage: CommanderProductionStage): CommanderProductionStage | null {
  const index = COMMANDER_PRODUCTION_PIPELINE_STAGES.indexOf(stage);
  return index >= 0 && index < COMMANDER_PRODUCTION_PIPELINE_STAGES.length - 1 ? COMMANDER_PRODUCTION_PIPELINE_STAGES[index + 1]! : null;
}

export type CommanderFieldRealisation = { kind: "existing"; ref: string } | { kind: "future"; note: string };

/** Every Commander Must Define — 37 fields (AF-098 §Every Commander Must
 * Define). 21 already have a real home on CommanderDef/CommanderProfileDef/
 * RosterRuntime/MetaProgression/Codex; 16 are genuinely new — this module
 * defines their shape, per-commander values are separate future content. */
export const COMMANDER_TEMPLATE_FIELDS = [
  "uniqueId",
  "callsign",
  "realName",
  "age",
  "species",
  "faction",
  "homeworld",
  "background",
  "psychologicalProfile",
  "leadershipStyle",
  "combatStyle",
  "visualDescription",
  "animationStyle",
  "voiceStyle",
  "musicMotif",
  "passive",
  "abilityOne",
  "abilityTwo",
  "ultimate",
  "signatureMechanic",
  "talentTree",
  "masteryChallenges",
  "preferredShips",
  "preferredWeapons",
  "preferredEquipment",
  "preferredRelics",
  "preferredResearch",
  "preferredBiomes",
  "recruitmentMission",
  "legendaryMission",
  "endingStory",
  "relationships",
  "dialogueLibrary",
  "codexEntry",
  "museumEntry",
  "statistics",
  "futureExpansionHooks",
] as const;
export type CommanderTemplateField = (typeof COMMANDER_TEMPLATE_FIELDS)[number];

export const COMMANDER_TEMPLATE_REALISATION: Readonly<Record<CommanderTemplateField, CommanderFieldRealisation>> = {
  uniqueId: { kind: "existing", ref: "CommanderDef.id" },
  callsign: { kind: "existing", ref: "CommanderDef.callsign" },
  realName: { kind: "existing", ref: "CommanderDef.name" },
  age: { kind: "future", note: "no age field on CommanderDef/CommanderProfileDef" },
  species: { kind: "future", note: "no species field anywhere; the game has no biological-species register at all (AF-088's own honest gap)" },
  faction: { kind: "existing", ref: "CommanderDef.faction" },
  homeworld: { kind: "future", note: "no homeworld field on CommanderDef/CommanderProfileDef" },
  background: { kind: "existing", ref: "CommanderDef.biography" },
  psychologicalProfile: { kind: "future", note: "biography is prose background, not a structured psychological profile" },
  leadershipStyle: { kind: "future", note: "no leadership-style vocabulary exists" },
  combatStyle: { kind: "existing", ref: "CommanderDef.archetype (10-value CommanderArchetype union)" },
  visualDescription: { kind: "existing", ref: "CommanderProfileDef.visualDesign" },
  animationStyle: { kind: "future", note: "no renderer/animation-profile class exists (AF-094's own confirmed gap)" },
  voiceStyle: { kind: "existing", ref: "CommanderProfileDef.voice" },
  musicMotif: { kind: "future", note: "AF-091 gives biomes/factions a sound identity function; no commander-scoped equivalent exists" },
  passive: { kind: "existing", ref: "CommanderDef.passive" },
  abilityOne: { kind: "existing", ref: "CommanderDef.active" },
  abilityTwo: { kind: "existing", ref: "CommanderProfileDef.secondaryAbility" },
  ultimate: { kind: "existing", ref: "CommanderDef.ultimate" },
  signatureMechanic: { kind: "existing", ref: "CommanderDef.signature" },
  talentTree: { kind: "existing", ref: "CommanderProfileDef.talentBranches + CommanderProgressionRuntime" },
  masteryChallenges: { kind: "future", note: "MetaProgression has a generic challenge engine; no per-commander unique-challenge content is authored yet" },
  preferredShips: { kind: "future", note: "\"commanders\" is registered as a synergy-surface NAME on ship/weapon/equipment/relic/research frameworks, never resolved to a specific commander id" },
  preferredWeapons: { kind: "future", note: "same synergy-surface-name-only gap as preferredShips" },
  preferredEquipment: { kind: "future", note: "same synergy-surface-name-only gap as preferredShips" },
  preferredRelics: { kind: "future", note: "same synergy-surface-name-only gap as preferredShips" },
  preferredResearch: { kind: "future", note: "a commanderDevelopment research category exists (unlocking commanders generically), not a per-commander preference list" },
  preferredBiomes: { kind: "future", note: "no commander↔biome binding exists anywhere" },
  recruitmentMission: { kind: "existing", ref: "RecruitmentDef.requirement (rosterData.ts RECRUITMENT_TABLE)" },
  legendaryMission: { kind: "existing", ref: "CommanderProfileDef.personalMissions (final of 6 beats)" },
  endingStory: { kind: "future", note: "personalMissions covers the beat sequence, not a distinct epilogue/ending text field" },
  relationships: { kind: "existing", ref: "CommanderProfileDef.relationships" },
  dialogueLibrary: { kind: "future", note: "confirmed absent everywhere — voiceLineIds are unresolved string placeholders, no backing dialogue data" },
  codexEntry: { kind: "existing", ref: "codexData.ts codex-commander-* entries" }, // shape is real; only 1 of 14 commanders has an authored entry today (proven in tests, not the type)
  museumEntry: { kind: "existing", ref: "codexEcosystemData.ts commanderMemorabilia, live-bound to RosterRuntime.statsFor" },
  statistics: { kind: "existing", ref: "CommanderProfileDef.statisticKeys" },
  futureExpansionHooks: { kind: "existing", ref: "CommanderProfileDef.futureExpansionHooks" },
};

/** Design Standards — 10 traits (AF-098 §Design Standards), vocabulary
 * only — aspirational per-commander quality bar, not a checkable system. */
export const COMMANDER_DESIGN_STANDARDS = ["uniqueSilhouette", "uniquePersonality", "uniqueGameplayLoop", "uniqueProgression", "uniqueStrengths", "uniqueWeaknesses", "uniqueDialogue", "uniqueEmotionalArc", "uniqueSoundtrackMotif", "uniqueMasteryFantasy"] as const;

/** Roster Diversity — 10 axes (AF-098 §Roster Diversity). 2 already
 * proven pairwise-distinct across the real 14-commander roster
 * (combatRole via the RosterPhilosophy bijection, factionHistory via the
 * real faction field); the other 8 are new fields with no roster-wide
 * content yet to prove diversity over. */
export const ROSTER_DIVERSITY_AXES = ["age", "species", "background", "combatRole", "leadershipStyle", "scientificDiscipline", "militaryExperience", "factionHistory", "psychology", "personality"] as const;
export const ROSTER_DIVERSITY_PROVEN: Readonly<Record<(typeof ROSTER_DIVERSITY_AXES)[number], boolean>> = {
  age: false,
  species: false,
  background: false,
  combatRole: true, // RosterPhilosophy is a proven bijection across all 14 commanders
  leadershipStyle: false,
  scientificDiscipline: false,
  militaryExperience: false,
  factionHistory: true, // CommanderDef.faction is real and populated for all 14
  psychology: false,
  personality: false,
};

/** Personality Framework — 12 traits (AF-098 §Personality Framework).
 * DIALOGUE-ONLY BY SHAPE: PersonalityDialogueHint has no bonus field,
 * exactly mirroring CommanderRelationshipDef's "not gameplay balance"
 * law (commanderFrameworkData.ts) — a stat-bearing personality is
 * structurally unrepresentable, not just discouraged by convention. */
export const PERSONALITY_TRAITS = ["optimistic", "stoic", "scientific", "fearless", "curious", "compassionate", "strategic", "reckless", "diplomatic", "visionary", "haunted", "idealistic"] as const;
export type PersonalityTrait = (typeof PERSONALITY_TRAITS)[number];

export interface PersonalityDialogueHint {
  trait: PersonalityTrait;
  dialogueHint: string;
}

export function personalityShapeFields(hint: PersonalityDialogueHint): readonly string[] {
  return Object.keys(hint).sort();
}

export type RecruitmentMethodRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Recruitment — 8 methods (AF-098 §Recruitment), realised onto AF-072's
 * real 7-value RECRUITMENT_SOURCES wherever a direct match exists. */
export const RECRUITMENT_METHODS = ["campaign", "legendaryMissions", "exploration", "factionReputation", "ancientDiscovery", "scientificResearch", "galaxyRestoration", "hiddenExpeditions"] as const;
export const RECRUITMENT_METHOD_REALISATION: Readonly<Record<(typeof RECRUITMENT_METHODS)[number], RecruitmentMethodRealisation>> = {
  campaign: { kind: "existing", ref: "RECRUITMENT_SOURCES.campaign" },
  legendaryMissions: { kind: "existing", ref: "RECRUITMENT_SOURCES.legendaryMissions" },
  exploration: { kind: "existing", ref: "RECRUITMENT_SOURCES.exploration" },
  factionReputation: { kind: "existing", ref: "RECRUITMENT_SOURCES.factionReputation" },
  ancientDiscovery: { kind: "future" }, // no distinct source; would double-claim hiddenDiscoveries
  scientificResearch: { kind: "existing", ref: "RECRUITMENT_SOURCES.research" },
  galaxyRestoration: { kind: "existing", ref: "RECRUITMENT_SOURCES.story (the Frontier Restoration chapter gate)" },
  hiddenExpeditions: { kind: "existing", ref: "RECRUITMENT_SOURCES.hiddenDiscoveries" },
};

/** Dialogue System — 12 trigger categories (AF-098 §Dialogue System),
 * all honestly future — no dialogue system exists anywhere (confirmed
 * across AF-093/094/095's own research). */
export const DIALOGUE_TRIGGER_CATEGORIES = ["missionStart", "combat", "bosses", "discoveries", "research", "factionEncounters", "civilisationEvents", "idleConversation", "victory", "defeat", "recruitment", "legendaryMoments"] as const;

export type MasteryFeatureRealisation = { kind: "existing"; ref: string } | { kind: "future" };

/** Mastery — 7 features (AF-098 §Mastery). 5 delegate to AF-026's real
 * MetaProgression via the existing masteryTrackId string key; 2 are
 * honest future (no per-commander unique-challenge or title content
 * exists yet). */
export const MASTERY_FEATURES = ["masteryLevels", "uniqueChallenges", "titles", "cosmetics", "historicalRecords", "museumContent", "loreUnlocks"] as const;
export const MASTERY_FEATURE_REALISATION: Readonly<Record<(typeof MASTERY_FEATURES)[number], MasteryFeatureRealisation>> = {
  masteryLevels: { kind: "existing", ref: "MetaProgression.addMasteryXp/masteryRank, keyed by CommanderProfileDef.masteryTrackId" },
  uniqueChallenges: { kind: "future" }, // MetaProgression's challenge engine is generic; no per-commander content authored
  titles: { kind: "future" }, // no title system exists
  cosmetics: { kind: "existing", ref: "COMMANDER_COSMETIC_KINDS — 7 kinds, gameplay-neutral by shape" },
  historicalRecords: { kind: "existing", ref: "RosterRuntime.statsFor — real usage/win-rate ledger" },
  museumContent: { kind: "existing", ref: "codexEcosystemData.ts commanderMemorabilia, live-bound" },
  loreUnlocks: { kind: "existing", ref: "CommanderProfileDef.loreId + codex-commander-* entries" },
};

/** Accessibility — 8 surfaces (AF-098 §Accessibility), delegated to
 * AF-092/093/095's real registries wherever a match exists. */
export const COMMANDER_ACCESSIBILITY_SURFACES = ["subtitleReady", "dialogueLog", "abilityPreview", "recommendedBuilds", "largeUi", "controllerNavigation", "touchNavigation", "colourBlindSupport"] as const;
export const COMMANDER_ACCESSIBILITY_LIVE: Readonly<Record<(typeof COMMANDER_ACCESSIBILITY_SURFACES)[number], boolean>> = {
  subtitleReady: false, // no dialogue system to subtitle
  dialogueLog: false,
  abilityPreview: false, // no tooltip/preview UI confirmed
  recommendedBuilds: false, // AF-093's build-saving exists; a "recommended" curator does not
  largeUi: false, // AF-093 confirmed fullUiScaling absent
  controllerNavigation: true, // AF-019 GamepadAdapter, tested (AF-095 §Accessibility Validation)
  touchNavigation: false, // TouchJoystick is math-only, no DOM adapter (AF-093's confirmed gap)
  colourBlindSupport: true, // AF-044 colourBlindMode, real settings field
};

/** Performance — 4 disciplines (AF-098 §Performance), delegated to
 * AF-094's real pooling registries wherever a match exists. */
export const COMMANDER_PERFORMANCE_DISCIPLINES = ["poolAnimations", "poolVoices", "reuseSharedLocomotion", "optimiseAbilitySystems"] as const;
export const COMMANDER_PERFORMANCE_LIVE: Readonly<Record<(typeof COMMANDER_PERFORMANCE_DISCIPLINES)[number], boolean>> = {
  poolAnimations: false, // no renderer/animation system exists (AF-094's confirmed gap)
  poolVoices: true, // AF-091's real VoicePool
  reuseSharedLocomotion: false, // no shared-locomotion abstraction exists
  optimiseAbilitySystems: false, // no dedicated optimisation work confirmed for CommanderRuntime's ability checks
};

/** Verified against tests/commanderFramework.test.ts's own relationship
 * shape-equality assertion: only the 3 FRAMEWORK_COMMANDERS (of
 * LAUNCH_ROSTER's 14) have authored CommanderRelationshipDefs today. */
export const COMMANDER_RELATIONSHIP_COVERAGE = { withRelationships: 3, rosterSize: 14 } as const;

export function commanderTemplateCoverageSummary(): string {
  let existing = 0;
  for (const field of COMMANDER_TEMPLATE_FIELDS) if (COMMANDER_TEMPLATE_REALISATION[field].kind === "existing") existing += 1;
  return `template ${existing}/${COMMANDER_TEMPLATE_FIELDS.length}`;
}

export function recruitmentMethodLiveSummary(): string {
  let existing = 0;
  for (const method of RECRUITMENT_METHODS) if (RECRUITMENT_METHOD_REALISATION[method].kind === "existing") existing += 1;
  return `recruitment ${existing}/${RECRUITMENT_METHODS.length}`;
}

export function personalityFrameworkSummary(): string {
  return `${PERSONALITY_TRAITS.length} personality traits (dialogue-only, never balance)`;
}

export function dialogueLibraryStatusSummary(): string {
  return `dialogue 0/${DIALOGUE_TRIGGER_CATEGORIES.length} (no dialogue system yet)`;
}

export function relationshipCoverageSummary(): string {
  return `relationships ${COMMANDER_RELATIONSHIP_COVERAGE.withRelationships}/${COMMANDER_RELATIONSHIP_COVERAGE.rosterSize} commanders`;
}

export function masteryFeaturesLiveSummary(): string {
  let live = 0;
  for (const feature of MASTERY_FEATURES) if (MASTERY_FEATURE_REALISATION[feature].kind === "existing") live += 1;
  return `mastery ${live}/${MASTERY_FEATURES.length}`;
}
