/**
 * Input framework data (AF-019 §11): action vocabulary, priority classes,
 * context permissions, default bindings, and the tuning surface. Feel is a
 * data edit (AF-011 §7). Migrates to Data Registry tables when that lands.
 */
export const GAME_ACTIONS = [
  "MoveUp",
  "MoveDown",
  "MoveLeft",
  "MoveRight",
  "Boost",
  "CommanderAbility",
  "Ultimate",
  "ShipAbility",
  "Pause",
  "Interact",
  "MissionMap",
  "InventoryOverlay",
  "StatisticsOverlay",
  "QuickPing", // future flag (AF-019)
  "PhotoMode", // future flag (AF-018/019)
  "DevConsole", // debug builds only
] as const;

export type GameAction = (typeof GAME_ACTIONS)[number];

export type ActionClass = "system" | "gameplay" | "secondary" | "debug";

export const ACTION_CLASS: Readonly<Record<GameAction, ActionClass>> = {
  MoveUp: "gameplay",
  MoveDown: "gameplay",
  MoveLeft: "gameplay",
  MoveRight: "gameplay",
  Boost: "gameplay",
  CommanderAbility: "gameplay",
  Ultimate: "gameplay",
  ShipAbility: "gameplay",
  Pause: "system",
  Interact: "gameplay",
  MissionMap: "secondary",
  InventoryOverlay: "secondary",
  StatisticsOverlay: "secondary",
  QuickPing: "gameplay",
  PhotoMode: "secondary",
  DevConsole: "debug",
};

export type InputContext = "gameplay" | "overlay" | "menu";

/** Which action classes may fire in each context (AF-019 §2). */
export const CONTEXT_PERMISSIONS: Readonly<Record<InputContext, readonly ActionClass[]>> = {
  gameplay: ["system", "gameplay", "secondary", "debug"],
  overlay: ["system", "debug"],
  menu: ["system", "secondary", "debug"],
};

/**
 * A binding is a device-qualified code, e.g. "key:KeyW", "mouse:0",
 * "pad:south", "touch:boost". Raw codes exist only in adapters and here.
 */
export type BindingCode = string;

export type BindingProfile = Readonly<Record<GameAction, readonly BindingCode[]>>;

export const DEFAULT_BINDINGS: BindingProfile = {
  MoveUp: ["key:KeyW", "key:ArrowUp"],
  MoveDown: ["key:KeyS", "key:ArrowDown"],
  MoveLeft: ["key:KeyA", "key:ArrowLeft"],
  MoveRight: ["key:KeyD", "key:ArrowRight"],
  Boost: ["key:Space", "pad:east"],
  CommanderAbility: ["key:ShiftLeft", "pad:west"],
  Ultimate: ["key:KeyQ", "pad:north"],
  ShipAbility: ["key:KeyR", "pad:dpadLeft"],
  Pause: ["key:Escape", "pad:start", "touch:pause"],
  Interact: ["key:KeyE", "pad:south"],
  MissionMap: ["key:KeyM", "pad:back"],
  InventoryOverlay: ["key:Tab", "pad:dpadUp"],
  StatisticsOverlay: ["key:KeyO", "pad:dpadDown"],
  QuickPing: [],
  PhotoMode: [],
  DevConsole: ["key:F1"],
};

export interface InputTuning {
  /** Radial deadzone radius (0–1) for analogue sticks, with rescaling. */
  deadzone: number;
  /** Sensitivity multiplier applied after the deadzone. */
  sensitivity: number;
  /** Exponential smoothing rate per second toward the target vector. */
  movementSmoothingPerSecond: number;
  /** Buffer window per bufferable action (AF-019 §4). */
  bufferWindowMs: number;
  bufferableActions: readonly GameAction[];
  /** Actions the player may switch to toggle (latched) mode. */
  toggleCapableActions: readonly GameAction[];
  /** Haptic/vibration intensity, 0–1 (0 disables). */
  hapticIntensity: number;
}

export const DEFAULT_INPUT_TUNING: InputTuning = {
  deadzone: 0.18,
  sensitivity: 1,
  movementSmoothingPerSecond: 14,
  bufferWindowMs: 150,
  bufferableActions: ["Boost", "CommanderAbility", "Ultimate", "ShipAbility", "Interact", "InventoryOverlay", "MissionMap"],
  toggleCapableActions: ["Boost"],
  hapticIntensity: 0.7,
};
