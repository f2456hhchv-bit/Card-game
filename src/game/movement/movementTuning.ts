/**
 * Movement tuning surface (AF-020 §3). Every attribute that shapes movement
 * feel is data (AF-011 §7). Ships/Commanders extend with their own profiles;
 * turnRate/mass/handling/friction are reserved for future handling profiles
 * (default profile: instant turn per the AF-020 movement model).
 */
export interface MovementProfile {
  /** World units per second. */
  maxSpeed: number;
  /** Speed gained per second while input is held. */
  acceleration: number;
  /** Speed lost per second when input releases. */
  deceleration: number;
  boostSpeed: number;
  boostDurationMs: number;
  boostCooldownMs: number;
  /** Ships may grant invulnerability frames during boost ("where applicable"). */
  boostGrantsInvulnerability: boolean;
  collisionRadius: number;
  /** Clamp for stacked speed multipliers (AF-020 §5). */
  speedMultiplierClamp: { min: number; max: number };
  /** Knockback impulse decay rate per second (shield impact). */
  impulseDecayPerSecond: number;
  /** Reserved attributes — future ship handling profiles (AF-020 §3). */
  turnRatePerSecond: number | "instant";
  mass: number;
  handling: number;
  movementFriction: number;
}

export const DEFAULT_MOVEMENT_PROFILE: MovementProfile = {
  maxSpeed: 9,
  acceleration: 55,
  deceleration: 70,
  boostSpeed: 22,
  boostDurationMs: 220,
  boostCooldownMs: 1400,
  boostGrantsInvulnerability: true,
  collisionRadius: 0.45,
  speedMultiplierClamp: { min: 0.15, max: 3 },
  impulseDecayPerSecond: 8,
  turnRatePerSecond: "instant",
  mass: 1,
  handling: 1,
  movementFriction: 0,
};

/** Reduced precision mode (AF-020 §8): forgiveness over twitch. */
export const REDUCED_PRECISION_PROFILE: MovementProfile = {
  ...DEFAULT_MOVEMENT_PROFILE,
  acceleration: 28,
  deceleration: 40,
};

export type MovementModifierKind = "speedMultiplier" | "root" | "force";

export interface MovementModifier {
  /** Stable id — reapplying the same id refreshes duration (AF-020 §5). */
  id: string;
  kind: MovementModifierKind;
  /** Multiplier for speedMultiplier kind (e.g. 0.5 slow, 1.4 haste). */
  multiplier?: number;
  /** World-units-per-second force vector for force kind (gravity, wind, currents). */
  forceX?: number;
  forceY?: number;
  durationMs: number;
}
