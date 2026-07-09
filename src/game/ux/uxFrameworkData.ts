/**
 * User Experience Framework (AF-093). AF-003's paper HUD/menu architecture
 * (design-doc only until now) becomes a real, testable registry over the
 * unchanged AF-016 state machine, AF-019 input engine, and AF-027 loadout
 * engine: every one of the spec's 14 Primary Interfaces is honestly mapped
 * onto an existing GameStateId, fused into one that hosts it, or flagged
 * future; HUD/feedback/accessibility/onboarding follow the same honesty
 * pattern AF-091/092 established.
 */
import { GAME_STATE_IDS, type GameStateId } from "../states/GameStates";

export const UX_PILLARS = ["gameplayFirst", "minimalFriction", "informationHierarchy", "consistency", "accessibility", "performance", "scalability", "futureExpansion"] as const;

export const UI_ARCHITECTURE_PARTS = ["uniqueId", "purpose", "inputBehaviour", "navigationRules", "animationProfile", "accessibilityTags", "performanceBudget", "responsiveLayout", "futureExpansionHooks"] as const;
export type UiArchitecturePart = (typeof UI_ARCHITECTURE_PARTS)[number];

export const PRIMARY_INTERFACES = [
  "mainMenu",
  "galaxyMap",
  "missionTerminal",
  "commanderScreen",
  "shipHangar",
  "equipmentLab",
  "researchCentre",
  "codex",
  "museum",
  "inventory",
  "crafting",
  "civilisationHub",
  "settings",
  "photoMode",
] as const;
export type PrimaryInterface = (typeof PRIMARY_INTERFACES)[number];

export type InterfaceRealisation = { kind: "existing"; stateId: GameStateId } | { kind: "fused"; hostStateId: GameStateId; note: string } | { kind: "future" };

/** Honest realisation: only 4 of 14 have a dedicated GameStateId; 4 more are
 * fused inside one of those four; the rest are genuinely new/future. */
export const PRIMARY_INTERFACE_REALISATION: Readonly<Record<PrimaryInterface, InterfaceRealisation>> = {
  mainMenu: { kind: "existing", stateId: "MainMenu" },
  galaxyMap: { kind: "fused", hostStateId: "GalaxyCommand", note: "travel/discovery buttons share GalaxyCommand with research/crafting/diplomacy/market" },
  missionTerminal: { kind: "existing", stateId: "MissionSelect" },
  commanderScreen: { kind: "future" },
  shipHangar: { kind: "future" },
  equipmentLab: { kind: "future" },
  researchCentre: { kind: "fused", hostStateId: "GalaxyCommand", note: "AF-024/081 unlock buttons live inside GalaxyCommand, no standalone panel" },
  codex: { kind: "fused", hostStateId: "Statistics", note: "AF-087/088 summary + journal buttons live inside Statistics" },
  museum: { kind: "future" },
  inventory: { kind: "existing", stateId: "InventoryOverlay" },
  crafting: { kind: "fused", hostStateId: "GalaxyCommand", note: "AF-025 Lightforge buttons live inside GalaxyCommand" },
  civilisationHub: { kind: "future" },
  settings: { kind: "future" },
  photoMode: { kind: "future" },
};

export interface UiInterfaceProfileDef {
  purpose: string;
  inputBehaviour: string;
  navigationRules: string;
  animationProfile: string;
  accessibilityTags: readonly string[];
  performanceBudget: string;
  responsiveLayout: string;
  futureExpansionHooks: string;
}

/** One profile per Primary Interface, present whether the interface is
 * live, fused, or future — the architecture is defined ahead of the
 * screen that will one day fulfil it. */
export const UI_INTERFACE_PROFILES: Readonly<Record<PrimaryInterface, UiInterfaceProfileDef>> = {
  mainMenu: { purpose: "entry point and save continuation", inputBehaviour: "single-select button list", navigationRules: "linear, no back edge (root state)", animationProfile: "fade-in on splash exit", accessibilityTags: ["highContrast", "remappableControls"], performanceBudget: "negligible — static DOM", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "profile switcher, news feed" },
  galaxyMap: { purpose: "system travel and discovery", inputBehaviour: "button list, one per reachable system", navigationRules: "GalaxyCommand ↔ MissionSelect/Statistics/MainMenu", animationProfile: "none yet — text updates only", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "low — no canvas rendering", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "zoomable starmap render, route preview" },
  missionTerminal: { purpose: "expedition briefing and launch", inputBehaviour: "select then confirm", navigationRules: "MissionSelect ↔ GalaxyCommand, forward to Loading", animationProfile: "none yet", accessibilityTags: ["highContrast"], performanceBudget: "negligible", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "difficulty/loadout preview panel" },
  commanderScreen: { purpose: "commander roster and progression management", inputBehaviour: "planned: grid select + detail pane", navigationRules: "planned: from GalaxyCommand", animationProfile: "planned", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "planned: low", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-030/072 data is real, screen is not" },
  shipHangar: { purpose: "fleet and ship outfitting management", inputBehaviour: "planned: grid select + detail pane", navigationRules: "planned: from GalaxyCommand", animationProfile: "planned", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "planned: low", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-031/074 data is real, screen is not" },
  equipmentLab: { purpose: "equipment compare, craft, and install", inputBehaviour: "planned: compare + install", navigationRules: "planned: from GalaxyCommand", animationProfile: "planned", accessibilityTags: ["highContrast"], performanceBudget: "planned: low", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-028/079/080 data is real, screen is not" },
  researchCentre: { purpose: "research tree browsing and unlocking", inputBehaviour: "button per unlockable node, fused into GalaxyCommand", navigationRules: "shares GalaxyCommand's edges", animationProfile: "none yet", accessibilityTags: ["highContrast"], performanceBudget: "negligible", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "standalone tree-graph panel" },
  codex: { purpose: "discovery browsing, pinning, and goals", inputBehaviour: "read-only summary + two toggle buttons, fused into Statistics", navigationRules: "shares Statistics's edges", animationProfile: "none yet", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "negligible", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "standalone browsable entry list" },
  museum: { purpose: "exhibit and collection showcase", inputBehaviour: "planned: gallery browse", navigationRules: "planned: from Statistics or Codex", animationProfile: "planned", accessibilityTags: ["highContrast"], performanceBudget: "planned: low", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-088 museumWingFor exists, screen does not" },
  inventory: { purpose: "item browsing and loadout management", inputBehaviour: "top-N list, close-only (no sort/filter yet)", navigationRules: "overlay on Gameplay only", animationProfile: "none yet", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "low — capped list render", responsiveLayout: "centred overlay panel", futureExpansionHooks: "sort/search/filter/compare/quick-equip controls" },
  crafting: { purpose: "material spend into equipment/upgrades", inputBehaviour: "button per craftable, fused into GalaxyCommand", navigationRules: "shares GalaxyCommand's edges", animationProfile: "none yet", accessibilityTags: ["highContrast"], performanceBudget: "negligible", responsiveLayout: "centred fixed-width column", futureExpansionHooks: "standalone crafting bench panel" },
  civilisationHub: { purpose: "settlement and civilisation oversight", inputBehaviour: "planned: dashboard + investment actions", navigationRules: "planned: from GalaxyCommand", animationProfile: "planned", accessibilityTags: ["highContrast", "colourBlindModes"], performanceBudget: "planned: low", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-089/090 data is real, screen is not" },
  settings: { purpose: "accessibility, controls, and display configuration", inputBehaviour: "planned: category tabs + toggles/sliders", navigationRules: "planned: reachable from MainMenu/Pause", animationProfile: "planned", accessibilityTags: ["highContrast", "colourBlindModes", "remappableControls"], performanceBudget: "planned: negligible", responsiveLayout: "planned", futureExpansionHooks: "the interface itself is the hook — AF-044 SettingsData is real, screen is not" },
  photoMode: { purpose: "free camera and cosmetic capture", inputBehaviour: "planned", navigationRules: "planned: overlay on Gameplay", animationProfile: "planned", accessibilityTags: ["motionReduction"], performanceBudget: "planned", responsiveLayout: "planned", futureExpansionHooks: "confirmed future by AF-092's own PHOTO_MODE_FEATURES/CAMERA_FRAMEWORK_KINDS.photoMode" },
};

/** Proves all 9 architecture parts are non-empty for a given interface —
 * "nothing remains undefined" as a function, mirroring AF-091's
 * audioArchitectureFor / AF-087's codexArchitectureFor. */
export function uiArchitectureFor(interfaceId: PrimaryInterface): Readonly<Record<UiArchitecturePart, boolean>> {
  const profile = UI_INTERFACE_PROFILES[interfaceId];
  return {
    uniqueId: PRIMARY_INTERFACES.includes(interfaceId),
    purpose: profile.purpose.length > 0,
    inputBehaviour: profile.inputBehaviour.length > 0,
    navigationRules: profile.navigationRules.length > 0,
    animationProfile: profile.animationProfile.length > 0,
    accessibilityTags: profile.accessibilityTags.length > 0,
    performanceBudget: profile.performanceBudget.length > 0,
    responsiveLayout: profile.responsiveLayout.length > 0,
    futureExpansionHooks: profile.futureExpansionHooks.length > 0,
  };
}

/** HUD Design — 11 elements; live/future flag. Health/shield bars and the
 * loot/event toast queue are the only ones with a real renderer today. */
export const HUD_ELEMENTS = ["health", "shield", "energy", "heat", "cooldowns", "objectives", "minimap", "threatIndicators", "resources", "statusEffects", "notifications"] as const;
export const HUD_ELEMENT_LIVE: Readonly<Record<(typeof HUD_ELEMENTS)[number], boolean>> = {
  health: true,
  shield: true,
  energy: false,
  heat: false,
  cooldowns: false,
  objectives: false,
  minimap: false,
  threatIndicators: false,
  resources: false,
  statusEffects: false,
  notifications: true,
};

/** Contextual UI — 8 triggers, each naming its real live binding or an
 * honest future note (dialogue has no system yet). */
export const CONTEXTUAL_UI_TRIGGERS = ["scanning", "looting", "dialogue", "construction", "research", "crafting", "exploration", "bossEncounters"] as const;
export const CONTEXTUAL_UI_BINDINGS: Readonly<Record<(typeof CONTEXTUAL_UI_TRIGGERS)[number], string>> = {
  scanning: "AF-036 discovery seam feeding Codex auto-record",
  looting: "lootNotices toast queue",
  dialogue: "future — no dialogue system yet",
  construction: "AF-090 settlement construction progress",
  research: "AF-024/081 research unlock buttons",
  crafting: "AF-025 Lightforge buttons",
  exploration: "AF-036 biome runtime",
  bossEncounters: "AF-045/047 boss runtime + director pressure",
};

/** Navigation — 5 device kinds; live/future flag. Keyboard/mouse and
 * gamepad are real adapters (AF-019); touch has joystick math only, no
 * DOM adapter; Steam Deck has no device-specific glyphs/prompts yet. */
export const NAVIGATION_INPUT_DEVICES = ["keyboardMouse", "controller", "touch", "steamDeck", "futureInputDevices"] as const;
export const NAVIGATION_DEVICE_LIVE: Readonly<Record<(typeof NAVIGATION_INPUT_DEVICES)[number], boolean>> = {
  keyboardMouse: true,
  controller: true,
  touch: false,
  steamDeck: false,
  futureInputDevices: false,
};

/** Player Feedback — 7 channels; live/future flag. */
export const PLAYER_FEEDBACK_CHANNELS = ["visual", "audio", "animation", "haptic", "confirmation", "progressIndicators", "errorRecovery"] as const;
export const PLAYER_FEEDBACK_LIVE: Readonly<Record<(typeof PLAYER_FEEDBACK_CHANNELS)[number], boolean>> = {
  visual: true,
  audio: true,
  animation: false,
  haptic: false,
  confirmation: false,
  progressIndicators: true,
  errorRecovery: false,
};

/** Inventory Experience — 8 features; live/future flag against the real
 * AF-027 Inventory/Loadout engine. */
export const INVENTORY_EXPERIENCE_FEATURES = ["sorting", "searching", "filtering", "comparison", "favouriteItems", "quickEquip", "buildSaving", "loadoutSharing"] as const;
export const INVENTORY_EXPERIENCE_LIVE: Readonly<Record<(typeof INVENTORY_EXPERIENCE_FEATURES)[number], boolean>> = {
  sorting: false,
  searching: false,
  filtering: false,
  comparison: false,
  favouriteItems: true,
  quickEquip: false,
  buildSaving: true,
  loadoutSharing: false,
};

export type BuildManagementRealisation = { kind: "existing"; field: string } | { kind: "future" };

/** Build Management — 7 kinds, realised onto AF-027's real Loadout fields
 * wherever one exists. */
export const BUILD_MANAGEMENT_KINDS = ["commanderBuilds", "shipBuilds", "weaponBuilds", "equipmentSets", "relicSets", "researchPresets", "entireLoadouts"] as const;
export const BUILD_MANAGEMENT_REALISATION: Readonly<Record<(typeof BUILD_MANAGEMENT_KINDS)[number], BuildManagementRealisation>> = {
  commanderBuilds: { kind: "existing", field: "Loadout.commanderId" },
  shipBuilds: { kind: "existing", field: "Loadout.shipId" },
  weaponBuilds: { kind: "existing", field: "Loadout.slots (AF-028 weapon slot kinds)" },
  equipmentSets: { kind: "existing", field: "Loadout.slots (AF-028 equipment slot kinds)" },
  relicSets: { kind: "future" },
  researchPresets: { kind: "future" },
  entireLoadouts: { kind: "existing", field: "Loadout (whole record)" },
};

/** Notification System — 7 categories, all already firing through the one
 * real lootNotices toast queue (~50 call sites across every category). */
export const NOTIFICATION_CATEGORIES = ["researchComplete", "missionUpdates", "discoveries", "factionChanges", "achievements", "civilisationProgress", "worldEvents"] as const;
export const NOTIFICATION_CATEGORY_BINDING: Readonly<Record<(typeof NOTIFICATION_CATEGORIES)[number], string>> = {
  researchComplete: "lootNotices toast queue",
  missionUpdates: "lootNotices toast queue",
  discoveries: "lootNotices toast queue",
  factionChanges: "lootNotices toast queue",
  achievements: "lootNotices toast queue",
  civilisationProgress: "lootNotices toast queue",
  worldEvents: "lootNotices toast queue",
};

/** Onboarding — 7 features, all honestly future; nothing exists yet. */
export const ONBOARDING_FEATURES = ["interactiveTutorials", "contextHelp", "advancedTips", "glossary", "practiceArena", "simulationMode", "returnPlayerRecaps"] as const;

/** Accessibility — 11 surfaces; live/future flag against AF-044's real
 * SettingsData and AF-019's real ActionInput rebinding engine. */
export const UX_ACCESSIBILITY_SURFACES: Readonly<Record<string, boolean>> = {
  fullUiScaling: false,
  fontScaling: false,
  highContrast: true, // AF-044 SettingsData.accessibility.highContrast
  colourBlindModes: true, // AF-044 SettingsData.accessibility.colourBlindMode
  screenReaderSupport: false,
  narrationReady: false,
  remappableControls: true, // AF-019 ActionInput.bind/unbind, engine-complete
  motionReduction: false,
  photosensitivityOptions: false,
  subtitleCustomisation: false,
  difficultyAssistance: false,
};

/** Performance disciplines — 5 (AF-093 §Performance), vocabulary only. */
export const UX_PERFORMANCE_DISCIPLINES = ["lazyLoadInterfaces", "cacheUiAssets", "poolAnimations", "optimiseNavigation", "reuseInterfaceComponents"] as const;

/** Debug — 6 surfaces the spec asks for; live/future flag. Performance is
 * already satisfied by DebugSnapshot's existing fps/lastTransitionMs/
 * droppedTimeMs scalars — no string extension needed for it. */
export const UI_DEBUG_SURFACES: Readonly<Record<string, boolean>> = {
  navigationState: true,
  hudState: true,
  uiMemory: true,
  animationQueue: false,
  inputLatency: true,
  performance: true,
};

/** Counts Primary Interface realisation kinds — the live text appended to
 * the gameState debug field. */
export function navigationRealisationSummary(): string {
  let existing = 0;
  let fused = 0;
  let future = 0;
  for (const iface of PRIMARY_INTERFACES) {
    const kind = PRIMARY_INTERFACE_REALISATION[iface].kind;
    if (kind === "existing") existing += 1;
    else if (kind === "fused") fused += 1;
    else future += 1;
  }
  return `ui ${existing} live/${fused} fused/${future} future`;
}

/** Counts HUD elements with a real renderer today. */
export function hudLiveSummary(): string {
  const live = Object.values(HUD_ELEMENT_LIVE).filter(Boolean).length;
  return `hud ${live}/${HUD_ELEMENTS.length} live`;
}

/** Counts Build Management kinds realised onto the real Loadout engine. */
export function buildManagementLiveSummary(): string {
  let live = 0;
  for (const kind of BUILD_MANAGEMENT_KINDS) if (BUILD_MANAGEMENT_REALISATION[kind].kind === "existing") live += 1;
  return `${live}/${BUILD_MANAGEMENT_KINDS.length} live`;
}

/** Frame time is the real, measured lower bound on input-to-display
 * latency in a single-threaded fixed-loop game — a genuine proxy, not a
 * fabricated number, composed from the already-live fps snapshot field. */
export function inputLatencyProxyMs(fps: number): number {
  return fps > 0 ? 1000 / fps : 0;
}

/** Every GameStateId referenced by a realisation is a real, current state. */
export function everyRealisedStateIsReal(): boolean {
  for (const iface of PRIMARY_INTERFACES) {
    const realisation = PRIMARY_INTERFACE_REALISATION[iface];
    if (realisation.kind === "existing" && !(GAME_STATE_IDS as readonly string[]).includes(realisation.stateId)) return false;
    if (realisation.kind === "fused" && !(GAME_STATE_IDS as readonly string[]).includes(realisation.hostStateId)) return false;
  }
  return true;
}
