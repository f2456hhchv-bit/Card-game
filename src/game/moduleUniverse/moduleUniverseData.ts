/**
 * The Modular Universe Engine (AF-142). A research pass before
 * implementation found this spec collides with locked architectural
 * modules more than with locked content modules — several sections are
 * already real, and several are honestly declared "future" by earlier
 * modules, which this module can now genuinely fulfil.
 *
 * Already real, composed directly, zero new code:
 * - "Live Event Support" (Seasonal celebrations, offline players never
 *   lose permanent content) — AF-070's real `LiveOpsRegistry` already
 *   has Seasons (`beginSeason`/`endSeason`/`activeSeason`) and a
 *   structural FOMO-rejection rule (only `temporaryChallenges` additions
 *   may be temporary; permanent content can never be marked temporary).
 * - "Save Compatibility" ("existing saves remain valid") — AF-070's real
 *   `compatibilityFor(saveVersion)` and monotone version number already
 *   guarantee this exactly.
 *
 * Genuinely new — the real gap AF-070's `ContentPackDef` left open
 * (confirmed: no `dependencies` field, no gameplay/narrative tags, no
 * faction/commander reference fields, no museum/chronicle/legacy
 * compatibility flags) — this module's `ModuleRegistry` registers whole
 * MODULES (e.g. "Ocean Worlds," a system that might ship many AF-070
 * content packs over time) with a real dependency graph and cross-
 * cutting compatibility tags, at a different granularity than AF-070's
 * per-pack registry.
 *
 * `moduleQaReport` genuinely fulfils gates AF-095's `qualityAssuranceData.ts`
 * (Master QA Framework) explicitly flagged as still-future (no existing
 * "Dependencies" or "Museum integration" gate) — without modifying
 * AF-095's locked data.
 *
 * `ModuleRegistry.topologicalLoadOrder`/dependency-cycle rejection mirrors
 * the real grey/black DFS algorithm AF-024's `ResearchTree.validate()`
 * already uses for prerequisite graphs, rather than inventing an
 * untested second algorithm — adapted here for `ModuleRegistrationDef`'s
 * different shape.
 *
 * "Modules load dynamically, inactive content remains unloaded" is
 * modelled honestly at the data/state level (a `loaded`/`unloaded` flag
 * per module) rather than claiming literal bundler-level code-splitting —
 * AF-094's `technicalArchitectureData.ts` already honestly declares
 * `asynchronousLoading`/`assetStreaming`/`multithreading` as `false`
 * (still future) at the engine level, and this module doesn't
 * contradict that.
 *
 * `ContentDiscoveryFeed` is kept deliberately separate from (never
 * merged with) AF-132's real `NEWS_CATEGORIES`/`DISCOVERY_KINDS`, since
 * this spec's exact wording ("Recovered archives," "Commander
 * invitations") doesn't appear verbatim there — the same
 * documented-parallel treatment established for AF-138/140's own small
 * cycling calendars.
 *
 * `accessibilityMetadata` on `ModuleRegistrationDef` follows AF-093's
 * real `accessibilityTags: readonly string[]` shape/spirit rather than
 * inventing new vocabulary.
 *
 * The Faction/Commander/World "automatic expansion" checklists and the
 * Developer Toolkit are kept as pure reference data with no independent
 * runtime validator: a "module" registered here describes a whole
 * SYSTEM (like AF-070's confirmed-absent "developer tools"), not a
 * specific faction/commander/planet instance, so there is nothing of
 * that shape to validate against — and Developer Toolkit describes
 * internal, non-player-facing tooling with no runtime surface, the same
 * honest scope boundary AF-140/141 already applied to sections with no
 * computational analog.
 */
export const MODULE_CATEGORIES = [
  "Commanders",
  "Ships",
  "Weapons",
  "Relics",
  "Species",
  "Companions",
  "Biomes",
  "Planets",
  "Star Systems",
  "Galaxies",
  "Civilisations",
  "Megastructures",
  "Storylines",
  "Events",
  "Research Trees",
  "Museum Wings",
  "Education Systems",
  "Architectural Styles",
  "Music Packs",
  "Seasonal Events",
] as const;
export type ModuleCategory = (typeof MODULE_CATEGORIES)[number];

/** The 12 real, already-locked systems every module automatically
 * integrates with — ids match the AF number, never colliding with any
 * roster id elsewhere. */
export const SYSTEM_COMPATIBILITY_TARGETS: Readonly<Record<string, string>> = {
  "AF-130": "Bond Network",
  "AF-131": "Living Ship",
  "AF-132": "Living Galaxy",
  "AF-133": "Legacy Engine",
  "AF-134": "Living Museum",
  "AF-135": "Chronicle",
  "AF-136": "Story Engine",
  "AF-137": "Event Engine",
  "AF-138": "Civilisation Engine",
  "AF-139": "Evolution Engine",
  "AF-140": "Infinite Endgame",
  "AF-141": "Creator Engine",
};

export const PLANNED_EXPANSION_EXAMPLES = [
  "New galaxies",
  "New playable species",
  "Additional Commander Academies",
  "Ancient precursor civilizations",
  "Lost human expeditions",
  "Ocean worlds",
  "Gas giant colonies",
  "Underground civilizations",
  "Living planets",
  "Dark matter ecosystems",
] as const;

export const FACTION_EXPANSION_CHECKLIST = ["History", "Politics", "Diplomacy", "Economy", "Trade", "Relationships", "Commander opinions", "Museum exhibits", "Historical timeline entries", "News integration"] as const;

export const COMMANDER_EXPANSION_CHECKLIST = ["Bond links", "Ship room", "Museum exhibit", "Personal quests", "Dialogue", "Legacy integration", "Historical records", "Relationships", "Training content"] as const;

export const WORLD_EXPANSION_CHECKLIST = ["Wildlife", "Weather", "Colonies", "Economy", "Research", "Culture", "History", "Festivals", "Events", "Evolution", "Tourism", "Education"] as const;

/** Deliberately separate from AF-132's real `NEWS_CATEGORIES`/
 * `DISCOVERY_KINDS` — see module doc comment. */
export const CONTENT_DISCOVERY_KINDS = ["Recovered archives", "Expeditions", "Research", "Historical discoveries", "Commander invitations", "News reports"] as const;
export type ContentDiscoveryKind = (typeof CONTENT_DISCOVERY_KINDS)[number];

export const MOD_SUPPORT_SURFACES = ["New planets", "Stories", "Music", "UI themes", "Ships", "Museum exhibits", "Commander skins", "Accessibility improvements"] as const;

export const DEVELOPER_TOOLKIT_SURFACES = ["Rapid Commander creation", "Planet generator", "Species generator", "Museum editor", "Dialogue validator", "Chronicle preview", "Relationship simulator", "Galaxy visualiser"] as const;

export const UNIVERSE_ACCESSIBILITY_SURFACES = ["Expansion summaries", "Content filters", "Optional tutorials", "Discovery tracker", "Narration ready"] as const;

export type ModuleOrigin = "core" | "mod";

/** "Every module automatically registers..." — the real shape AF-070's
 * `ContentPackDef` deliberately lacks (no dependencies, no tags, no
 * cross-system flags). `accessibilityMetadata` follows AF-093's real
 * `accessibilityTags` shape. */
export interface ModuleRegistrationDef {
  id: string;
  name: string;
  category: ModuleCategory;
  dependencies: readonly string[];
  gameplayTags: readonly string[];
  narrativeTags: readonly string[];
  factionRelationships: readonly string[];
  commanderInteractions: readonly string[];
  museumCompatible: boolean;
  chronicleSupport: boolean;
  legacySupport: boolean;
  accessibilityMetadata: readonly string[];
  origin: ModuleOrigin;
}

/**
 * "New content automatically integrates with AF-130 → AF-141." A
 * deterministic, illustrative mapping from a registration's own
 * declared fields onto the 12 real target systems — computed
 * automatically at registration time ("no manual integration
 * required"), never a manual per-module wiring step.
 */
export function systemCompatibilityFor(def: ModuleRegistrationDef): readonly string[] {
  const targets: string[] = [];
  if (def.commanderInteractions.length > 0) targets.push("AF-130");
  if (def.category === "Ships") targets.push("AF-131");
  if ((["Planets", "Star Systems", "Galaxies", "Biomes", "Species", "Companions"] as const).includes(def.category as never)) targets.push("AF-132");
  if (def.legacySupport) targets.push("AF-133");
  if (def.museumCompatible) targets.push("AF-134");
  if (def.chronicleSupport) targets.push("AF-135");
  if (def.category === "Storylines") targets.push("AF-136");
  if ((["Events", "Seasonal Events"] as const).includes(def.category as never)) targets.push("AF-137");
  if ((["Civilisations", "Megastructures"] as const).includes(def.category as never)) targets.push("AF-138");
  if (def.gameplayTags.includes("evolving")) targets.push("AF-139");
  if (def.gameplayTags.includes("endgame")) targets.push("AF-140");
  if ((["Museum Wings", "Architectural Styles", "Music Packs"] as const).includes(def.category as never)) targets.push("AF-141");
  return targets;
}
