/**
 * Visual Direction Framework (AF-092). Consolidates AF-002/007/008's
 * design-doc canon (visual language, iconography, colour system — never
 * runtime code until now) into a real, testable registry: faction
 * colour signatures extend the identity-uniqueness chain (AF-085's five
 * → AF-086's sixth → AF-089's seventh → AF-090's eighth → this ninth);
 * biome visual identities follow AF-091's hand-authored-plus-generated-
 * fallback pattern; materials, VFX priority, and accessibility all
 * realise onto real systems (AF-025/044/089) wherever one exists.
 */
import { RARITY_TABLE, type Rarity } from "../loot/lootTuning";

/** 8 Visual Pillars (AF-092 §Visual Pillars) — registered, no runtime behaviour. */
export const VISUAL_PILLARS = ["gameplayClarity", "scientificPlausibility", "cinematicPresentation", "playerReadability", "factionIdentity", "environmentalStorytelling", "technicalEfficiency", "futureScalability"] as const;

/** 8 Art Style influences (AF-092 §Art Style). */
export const ART_STYLE_INFLUENCES = ["nasaRealism", "hardScienceFiction", "optimisticFuturism", "ancientMegastructures", "modernIndustrialDesign", "alienElegance", "naturalEcosystems", "spaceExploration"] as const;

/** Colour Language — 7 elements per faction (AF-092 §Colour Language). */
export const COLOUR_LANGUAGE_ELEMENTS = ["primary", "secondary", "energy", "uiAccent", "lightingTheme", "materialPalette", "visualSignature"] as const;
export type ColourLanguageElement = (typeof COLOUR_LANGUAGE_ELEMENTS)[number];

export interface FactionColourSignature {
  primary: string;
  secondary: string;
  energy: string;
  uiAccent: string;
  lightingTheme: string;
  materialPalette: string;
  visualSignature: string;
}

/** One signature per AF-085/086/089/090-profiled civilisation — hex codes
 * distinct from AF-007's locked rarity ladder and from each other,
 * asserted ("no two factions appear similar"). */
export const FACTION_COLOUR_SIGNATURES: Readonly<Record<string, FactionColourSignature>> = {
  crystalDominion: { primary: "#8a5cf5", secondary: "#c9a6ff", energy: "#e0c3ff", uiAccent: "#b083ff", lightingTheme: "cool violet glow", materialPalette: "grown crystal, no seams", visualSignature: "faceted refraction on every surface" },
  machineCollective: { primary: "#3d4d5c", secondary: "#7fa8bf", energy: "#4dd9ff", uiAccent: "#5ce1e6", lightingTheme: "cold blue-grey utility light", materialPalette: "fractal foundry block, matte metal", visualSignature: "hex-tiled surfaces, visible seams" },
  humanAlliance: { primary: "#d9a13d", secondary: "#f2d38a", energy: "#ffbf4d", uiAccent: "#ffd27f", lightingTheme: "warm reconstructed-relay amber", materialPalette: "modular ceramic, repaired plating", visualSignature: "patchwork panels, visible rivets" },
  mercenaryGuild: { primary: "#8c2f2f", secondary: "#c96a4d", energy: "#ff7a3d", uiAccent: "#ff9166", lightingTheme: "harsh dock-bay floodlight", materialPalette: "armoured salvage, mismatched hulls", visualSignature: "stencilled serials, camera coverage" },
  ancientCustodians: { primary: "#e8e2d0", secondary: "#c9a84d", energy: "#fff2b3", uiAccent: "#e0c76b", lightingTheme: "standing gold-white glow", materialPalette: "white stone alloy, gold conduit", visualSignature: "geometry that predates its visitors" },
  nomadFleet: { primary: "#5c7a8c", secondary: "#a3b8a6", energy: "#c9d98c", uiAccent: "#9fc98c", lightingTheme: "convoy running-lights, mismatched", materialPalette: "lashed hull plate, patched armour", visualSignature: "silhouette recomposed every season" },
};

/** Every faction hex is distinct from every other faction hex AND from
 * AF-007's locked rarity ladder — a pure check, no new colour store. */
export function colourSignaturesAreDistinct(): boolean {
  const allHex: string[] = [];
  for (const signature of Object.values(FACTION_COLOUR_SIGNATURES)) {
    allHex.push(signature.primary, signature.secondary, signature.energy, signature.uiAccent);
  }
  for (const rarity of Object.values(RARITY_TABLE)) allHex.push(rarity.colour);
  return new Set(allHex).size === allHex.length;
}

/** Biome Visual Language — 8 elements (AF-092 §Biome Visual Language). */
export const BIOME_VISUAL_ELEMENTS = ["lighting", "fog", "skybox", "planetaryColours", "architecture", "vegetation", "weather", "environmentalVfx"] as const;
export type BiomeVisualElement = (typeof BIOME_VISUAL_ELEMENTS)[number];

export type BiomeVisualIdentity = Readonly<Record<BiomeVisualElement, string>>;

const BIOME_VISUAL_IDENTITIES: Readonly<Record<string, BiomeVisualIdentity>> = {
  "crystal-fields-alpha": {
    lighting: "cool refracted violet",
    fog: "light, glassy haze",
    skybox: "shard-lit nebula",
    planetaryColours: "violet, pale blue, white",
    architecture: "grown lattice spires",
    vegetation: "none — crystalline growth stands in",
    weather: "ion cloud drift",
    environmentalVfx: "shard glints on movement",
  },
  "frozen-reach": {
    lighting: "flat cold white",
    fog: "dense, low-lying",
    skybox: "pale overcast",
    planetaryColours: "white, grey-blue",
    architecture: "expedition-white weathered stations",
    vegetation: "none",
    weather: "gentle snowfall",
    environmentalVfx: "sparse frost particles",
  },
};

export function biomeVisualIdentityFor(biomeId: string): BiomeVisualIdentity {
  return (
    BIOME_VISUAL_IDENTITIES[biomeId] ?? {
      lighting: `${biomeId} lighting (generated)`,
      fog: `${biomeId} fog (generated)`,
      skybox: `${biomeId} skybox (generated)`,
      planetaryColours: `${biomeId} palette (generated)`,
      architecture: `${biomeId} architecture (generated)`,
      vegetation: `${biomeId} vegetation (generated)`,
      weather: `${biomeId} weather (generated)`,
      environmentalVfx: `${biomeId} vfx (generated)`,
    }
  );
}

/** Material System — 8 materials (AF-092 §Material System), each realised
 * onto a real content system wherever one exists. */
export const MATERIAL_SYSTEM_BINDINGS: Readonly<Record<string, string>> = {
  industrialAlloys: "AF-025 rareAlloys/commonMaterials",
  ancientMaterials: "AF-025 ancientComponents / AF-082 ancient-technology thread",
  crystalGrowth: "AF-025 crystalFragments / AF-048 crystal ecosystems",
  organicTissue: "AF-051 xeno biomass content",
  voidMatter: "AF-089 voidMatter resource category",
  quantumSurfaces: "AF-025 quantumCores / AF-089 quantumMaterials",
  energyFields: "AF-025 energyCells / AF-089 energy category",
  adaptiveMaterials: "AF-053 Paragon adaptive-shield content",
};

/** Lighting themes — 8 kinds (AF-092 §Lighting), live/future flag. */
export const LIGHTING_THEMES: Readonly<Record<string, boolean>> = {
  globalIllumination: false,
  dynamicSunlight: false,
  planetaryAtmospheres: false,
  interiorLighting: false,
  emergencyLighting: false,
  bossLighting: false,
  weatherLighting: true, // AF-036 biome weather cycles already drive this conceptually
  discoveryLighting: false,
};

/** VFX System — 9 kinds (AF-092 §VFX System), each with a MINIMUM priority
 * so gameplay-critical effects are never the first culled under load —
 * the visual analogue of AF-091's Combat Audio priority table. */
export const VFX_MIN_PRIORITY: Readonly<Record<string, number>> = {
  weapons: 6,
  abilities: 6,
  weather: 2,
  explosions: 7,
  scanning: 3,
  construction: 3,
  research: 3,
  environmentalHazards: 8,
  bossMechanics: 10,
};

/** Cinematic Presentation — 8 kinds (AF-092 §Cinematic Presentation). */
export const CINEMATIC_PRESENTATION_BINDINGS: Readonly<Record<string, string>> = {
  missionIntros: "AF-016 Loading state transition",
  bossArrivals: "AF-045 cue-boss-spawn",
  ancientDiscoveries: "AF-087 discovery lattice",
  campaignMilestones: "AF-068 CampaignRuntime chapters",
  commanderRecruitment: "AF-072 RosterRuntime",
  civilisationRestoration: "AF-090 settlement development stages",
  galaxyEvents: "AF-038/041 EnvironmentalEventTriggered",
  victorySequences: "AF-016 MissionComplete state",
};

/** Animation Language — 7 principles (AF-092 §Animation Language). */
export const ANIMATION_LANGUAGE_PRINCIPLES = ["weight", "momentum", "mechanicalLogic", "organicBehaviour", "energyFlow", "impact", "recovery"] as const;

/** Camera Framework — 7 kinds (AF-092 §Camera Framework), live/future. */
export const CAMERA_FRAMEWORK_KINDS: Readonly<Record<string, boolean>> = {
  gameplayCamera: true, // the game already renders through one
  bossCamera: false,
  discoveryCamera: false,
  dialogueFraming: false,
  missionCinematics: false,
  photoMode: false,
  accessibilityOptions: false,
};

/** Photo Mode — 8 features (AF-092 §Photo Mode), all honestly future. */
export const PHOTO_MODE_FEATURES = ["freeCamera", "lightingControls", "filters", "depthOfField", "timeControl", "weather", "poses", "highResolutionExport"] as const;

/** Accessibility — 7 surfaces (AF-092 §Accessibility); 2 already live via AF-044. */
export const VISUAL_ACCESSIBILITY_SURFACES: Readonly<Record<string, boolean>> = {
  reducedParticles: false,
  reducedBloom: false,
  reducedMotion: false,
  highContrast: true, // AF-044 SettingsData.accessibility.highContrast
  colourBlindModes: true, // AF-044 SettingsData.accessibility.colourBlindMode
  photosensitivityMode: false,
  customVfxIntensity: false,
};

/** Performance disciplines — 5 (AF-092 §Performance). */
export const VISUAL_PERFORMANCE_DISCIPLINES = ["poolVfx", "lodEverything", "optimiseShaders", "streamLargeAssets", "reuseMaterials"] as const;

export type { Rarity };
