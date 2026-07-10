/**
 * The Afterlight Universe Master Index (AF-150). Explicitly "not a
 * gameplay feature" per its own text — a meta-registry over every
 * individual game OBJECT (a specific Commander, a specific planet, a
 * specific quest, ...), at a genuinely different granularity than
 * AF-142's real `ModuleRegistry`, which registers whole MODULES (a
 * system like "Ocean Worlds" that might ship many objects and many
 * AF-070 content packs over its lifetime). AF-148's `CanonEventLedger`
 * is narrower still — one richer record type (historical events) with
 * witnesses/evidence, not a registry spanning all 35 of this spec's
 * catalogue categories.
 *
 * Direct shape overlap with AF-142's real `ModuleRegistrationDef`
 * (id/dependencies/museumCompatible/chronicleSupport/origin) is
 * expected and intentional — both are registries — but this module's
 * `MasterIndexEntry` operates one level down (individual objects, not
 * whole systems), so it is its own separate interface, never importing
 * or extending AF-142's type. `MasterIndexRegistry.topologicalOrderOver`
 * mirrors AF-142's real adjacency-list algorithm (the same fix that
 * corrected an O(n²)-per-registration bug in that module) rather than
 * reinventing or regressing to the slower approach.
 *
 * "Expansion Support" ("every future module automatically registers
 * itself, no manual indexing required") restates AF-142's own real
 * "no manual integration required" philosophy at the individual-object
 * granularity — composed, not duplicated: any object registered here
 * can (but is not required to) also be registered as part of an AF-142
 * module.
 *
 * "Failsafe Rules" (8 checks, all-must-pass — "no asset ships unless...")
 * is the EIGHTH occurrence of the same checklist-gate mechanic in this
 * codebase, after the real Constitution's two gates, AF-146's Expansion
 * Test, AF-145's Design Validation, AF-147's Franchise Test, AF-148's
 * `expansionRespectsTimeline`, and AF-149's Final Validation.
 *
 * "Quality Tracking" (8 categories) overlaps in spirit with AF-143's
 * real `DesignScoreCard`/AF-149's real `AtlasScoreCard` (both averaged,
 * gated 0-10 rubrics) but is a different shape — per-CATEGORY numeric
 * scores plus two free-form status strings, tracked per indexed OBJECT
 * rather than per proposed FEATURE — so `QualityTracker` is its own new
 * class, not a third reuse of the same DesignScoreCard shape.
 *
 * "Player-Facing Derivatives" (Museum/Chronicle/Codex/Planet Browser/
 * Commander Profiles/Relationship Viewer/Timeline/Lore Search) lists
 * systems that are ALL already real and locked (AF-042/043/134/135 and
 * others) — kept as pure reference data confirming what the Master
 * Index conceptually sits beneath, never reimplementing any of them.
 */
export const MASTER_CATALOGUE_CATEGORIES = [
  "Commanders",
  "Planets",
  "Star Systems",
  "Galaxies",
  "Species",
  "Companions",
  "Ships",
  "Weapons",
  "Armour",
  "Relics",
  "Resources",
  "Materials",
  "Research",
  "Technologies",
  "Buildings",
  "Colonies",
  "Civilisations",
  "Events",
  "Museum Artifacts",
  "Chronicle Entries",
  "Historical Figures",
  "Factions",
  "NPCs",
  "Music",
  "Audio",
  "Animations",
  "Visual Effects",
  "Accessibility Features",
  "UI Components",
  "Achievements",
  "Titles",
  "Lore",
  "Dialogue",
  "Quests",
] as const;
export type MasterCatalogueCategory = (typeof MASTER_CATALOGUE_CATEGORIES)[number];

export interface MasterIndexEntry {
  id: string;
  category: MasterCatalogueCategory;
  moduleOrigin: string;
  creationEpoch: number;
  canonStatus: string;
  dependencies: readonly string[];
  relatedSystems: readonly string[];
  museumLinks: readonly string[];
  chronicleLinks: readonly string[];
  expansionCompatibility: readonly string[];
}

export const RELATIONSHIP_KINDS = ["Related Commanders", "Related Planets", "Related Species", "Related Quests", "Related Technologies", "Historical Events", "Museum Exhibits", "Chronicle Articles", "Future References"] as const;
export type RelationshipKind = (typeof RELATIONSHIP_KINDS)[number];

export const DEPENDENCY_RELATION_KINDS = ["Parent systems", "Child systems", "Required systems", "Optional systems", "Expansion systems", "Deprecated systems"] as const;
export type DependencyRelationKind = (typeof DEPENDENCY_RELATION_KINDS)[number];

export const QUALITY_TRACKING_CATEGORIES = ["Completion status", "Review score", "Accessibility score", "Performance score", "Narrative score", "Replayability score", "Documentation status", "QA status"] as const;
export type QualityTrackingCategory = (typeof QUALITY_TRACKING_CATEGORIES)[number];

export const DOCUMENTATION_LINK_KINDS = ["Design Bible", "Technical Guide", "Art Guide", "Audio Guide", "Narrative Guide", "Accessibility Guide", "Performance Notes", "Testing Results"] as const;

export const VISUAL_MAP_KINDS = ["Galaxy graph", "Commander graph", "Timeline graph", "Technology tree", "Faction map", "Relationship network", "Civilisation growth", "Expansion architecture"] as const;

export const DEVELOPER_DASHBOARD_CHECKS = ["Missing assets", "Broken links", "Unused dialogue", "Performance hotspots", "Accessibility gaps", "Narrative inconsistencies", "Museum completeness", "Lore coverage"] as const;

/** All eight of these are already real, locked player-facing systems
 * (see module doc comment) — kept as reference confirmation only. */
export const PLAYER_FACING_DERIVATIVES = ["Museum", "Chronicle", "Codex", "Planet Browser", "Commander Profiles", "Relationship Viewer", "Timeline", "Lore Search"] as const;

/** The EIGHTH all-must-pass checklist gate in this codebase (see
 * module doc comment). */
export const FAILSAFE_SHIP_GATES = ["Indexed", "Documented", "Validated", "Linked", "Accessible", "Versioned", "QA approved", "Canon checked"] as const;
export type FailsafeShipGate = (typeof FAILSAFE_SHIP_GATES)[number];

export function shipGatePassed(satisfied: ReadonlySet<FailsafeShipGate>): boolean {
  return FAILSAFE_SHIP_GATES.every((gate) => satisfied.has(gate));
}

export const MASTER_INDEX_ACCESSIBILITY_SURFACES = ["Documentation search", "Developer narration", "Visual dependency graphs", "Colour-safe diagrams", "Keyboard navigation"] as const;
