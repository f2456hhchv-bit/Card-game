/**
 * Research data shapes + the sandbox placeholder tree (AF-024). The real
 * research tree arrives as content; this tree proves the engine. Categories
 * and node types are the registered shelves.
 */
export const RESEARCH_CATEGORIES = [
  "commanderDevelopment",
  "shipEngineering",
  "weaponTechnology",
  "energySystems",
  "shieldTechnology",
  "droneEngineering",
  "orbitalTechnology",
  "crafting",
  "exploration",
  "galaxyNavigation",
  "ancientTechnology",
  "voidResearch",
  "crystalResonance",
  "automation",
  "qualityOfLife",
] as const;

export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

export const RESEARCH_NODE_TYPES = [
  "passiveBonus",
  "featureUnlock",
  "newMechanic",
  "craftingUnlock",
  "blueprintUnlock",
  "commanderUnlock",
  "shipUnlock",
  "missionUnlock",
  "biomeUnlock",
  "galaxyUnlock",
  "ancientDiscovery",
] as const;

export type ResearchNodeType = (typeof RESEARCH_NODE_TYPES)[number];

/** Effect payloads consumed by existing systems (AF-024 §4). Placeholder
 * kinds for the sandbox; content modules extend the union. */
export type ResearchEffect =
  | { kind: "weaponResearchBonus"; value: number } // AF-021 pipeline research stage
  | { kind: "lootResearchBonus"; value: number } // AF-023 ladder shift
  | { kind: "magnetRadiusBonus"; value: number } // AF-022 collection
  | { kind: "unlockFlag"; flag: string };

export interface ResearchNodeDef {
  id: string;
  name: string;
  category: ResearchCategory;
  tier: number;
  cost: number;
  /** Always 0 — unlocks are instant, permanently (DR-005, owner-ratified).
   * Field retained for data-format stability only. */
  completionTimeMs: number;
  prerequisites: readonly string[];
  nodeType: ResearchNodeType;
  /** Hidden until revealed by a discovery trigger (AF-024 §3). */
  hidden: boolean;
  effect: ResearchEffect | null;
}

/** Sandbox tree: 13 nodes, 3 branches, one cross-link, one hidden discovery, one galaxy unlock. */
export const SANDBOX_RESEARCH_TREE: readonly ResearchNodeDef[] = [
  // Weapon branch
  { id: "focused-lattice", name: "Focused Lattice", category: "weaponTechnology", tier: 1, cost: 3, completionTimeMs: 0, prerequisites: [], nodeType: "passiveBonus", hidden: false, effect: { kind: "weaponResearchBonus", value: 0.05 } },
  { id: "coherent-beams", name: "Coherent Beams", category: "weaponTechnology", tier: 2, cost: 6, completionTimeMs: 0, prerequisites: ["focused-lattice"], nodeType: "passiveBonus", hidden: false, effect: { kind: "weaponResearchBonus", value: 0.08 } },
  { id: "harmonic-overload", name: "Harmonic Overload", category: "weaponTechnology", tier: 3, cost: 12, completionTimeMs: 0, prerequisites: ["coherent-beams"], nodeType: "newMechanic", hidden: false, effect: { kind: "weaponResearchBonus", value: 0.12 } },
  // Energy/collection branch
  { id: "field-dynamics", name: "Field Dynamics", category: "energySystems", tier: 1, cost: 3, completionTimeMs: 0, prerequisites: [], nodeType: "passiveBonus", hidden: false, effect: { kind: "magnetRadiusBonus", value: 0.8 } },
  { id: "resonant-collectors", name: "Resonant Collectors", category: "energySystems", tier: 2, cost: 6, completionTimeMs: 0, prerequisites: ["field-dynamics"], nodeType: "passiveBonus", hidden: false, effect: { kind: "magnetRadiusBonus", value: 1.2 } },
  // Exploration branch
  { id: "survey-protocols", name: "Survey Protocols", category: "exploration", tier: 1, cost: 4, completionTimeMs: 0, prerequisites: [], nodeType: "passiveBonus", hidden: false, effect: { kind: "lootResearchBonus", value: 0.1 } },
  { id: "deep-scanning", name: "Deep Scanning", category: "exploration", tier: 2, cost: 8, completionTimeMs: 0, prerequisites: ["survey-protocols"], nodeType: "featureUnlock", hidden: false, effect: { kind: "lootResearchBonus", value: 0.15 } },
  // Cross-link: needs both branches
  { id: "unified-theory", name: "Unified Theory", category: "ancientTechnology", tier: 3, cost: 15, completionTimeMs: 0, prerequisites: ["coherent-beams", "deep-scanning"], nodeType: "featureUnlock", hidden: false, effect: { kind: "weaponResearchBonus", value: 0.1 } },
  // Quality of life
  { id: "rapid-refit", name: "Rapid Refit", category: "qualityOfLife", tier: 1, cost: 2, completionTimeMs: 0, prerequisites: [], nodeType: "featureUnlock", hidden: false, effect: null },
  { id: "expanded-archives", name: "Expanded Archives", category: "qualityOfLife", tier: 2, cost: 5, completionTimeMs: 0, prerequisites: ["rapid-refit"], nodeType: "featureUnlock", hidden: false, effect: null },
  // Shield line
  { id: "barrier-theory", name: "Barrier Theory", category: "shieldTechnology", tier: 1, cost: 4, completionTimeMs: 0, prerequisites: [], nodeType: "passiveBonus", hidden: false, effect: null },
  // Hidden discovery — revealed by collecting an epic+ research sample
  { id: "ancient-conduit", name: "Ancient Conduit", category: "ancientTechnology", tier: 3, cost: 10, completionTimeMs: 0, prerequisites: ["survey-protocols"], nodeType: "ancientDiscovery", hidden: true, effect: { kind: "weaponResearchBonus", value: 0.15 } },
  // AF-038: Fast Travel gate — the first real producer for the galaxyNavigation
  // category and galaxyUnlock node type, both registered since AF-024.
  { id: "warp-charting", name: "Warp Charting", category: "galaxyNavigation", tier: 2, cost: 9, completionTimeMs: 0, prerequisites: ["deep-scanning"], nodeType: "galaxyUnlock", hidden: false, effect: { kind: "unlockFlag", flag: "GALAXY_FAST_TRAVEL" } },
];
