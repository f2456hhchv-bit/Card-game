/**
 * The AF-016 game states and their legal-transition table
 * (docs/CORE_GAMEPLAY.md §2). Multiplayer and CommunityHub are reserved
 * names with no inbound edges — unreachable until their modules arrive.
 */
export const GAME_STATE_IDS = [
  "Boot",
  "Splash",
  "MainMenu",
  "GalaxyCommand",
  "MissionSelect",
  "Loading",
  "Gameplay",
  "Pause",
  "LevelUp",
  "InventoryOverlay",
  "MissionComplete",
  "Defeat",
  "Statistics",
  "Multiplayer",
  "CommunityHub",
] as const;

export type GameStateId = (typeof GAME_STATE_IDS)[number];

/** Overlays stack on Gameplay without disturbing the run beneath (AF-016 §2). */
export const OVERLAY_HOSTS: Readonly<Partial<Record<GameStateId, readonly GameStateId[]>>> = {
  Pause: ["Gameplay"],
  LevelUp: ["Gameplay"],
  InventoryOverlay: ["Gameplay"],
};

export const GAME_TRANSITIONS: Readonly<Record<GameStateId, readonly GameStateId[]>> = {
  Boot: ["Splash"],
  Splash: ["MainMenu"],
  MainMenu: ["GalaxyCommand", "Statistics"],
  GalaxyCommand: ["MissionSelect", "Statistics", "MainMenu"],
  MissionSelect: ["Loading", "GalaxyCommand"],
  Loading: ["Gameplay", "GalaxyCommand"],
  // GalaxyCommand edge = abandoning the run (offered from the Pause overlay).
  Gameplay: ["MissionComplete", "Defeat", "GalaxyCommand"],
  MissionComplete: ["GalaxyCommand", "Statistics"],
  Defeat: ["GalaxyCommand", "Statistics"],
  Statistics: ["MainMenu", "GalaxyCommand"],
  // Overlays never originate base transitions.
  Pause: [],
  LevelUp: [],
  InventoryOverlay: [],
  // Reserved (AF-016): names registered, unreachable until their modules.
  Multiplayer: [],
  CommunityHub: [],
};
