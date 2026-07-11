import type { BehaviorId, BehaviorParams, BossPhase, PlaceholderShape } from "./types";

let nextEntityId = 1;
export function allocId(): number {
  return nextEntityId++;
}

export type EnemyTier = "grunt" | "elite" | "miniboss" | "boss";

export interface Enemy {
  id: number;
  defId: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  contactDamage: number;
  moveSpeed: number;
  radius: number;
  tier: EnemyTier;
  behavior: BehaviorId;
  behaviorParams: BehaviorParams;
  shape: PlaceholderShape;
  xpValue: number;
  facingAngle: number;
  dead: boolean;
  /** SpatialHashGrid liveness flag — kept false whenever `dead` is true. */
  active: boolean;
  hitFlash: number;

  // behavior runtime scratch state (meaning depends on `behavior`)
  stateTimer: number;
  telegraphTimer: number;
  behaviorActive: boolean; // e.g. dashing / shielded, per-behavior
  originX: number;
  originY: number;

  // boss-only
  isBoss: boolean;
  phases?: BossPhase[];
  currentPhaseIndex: number;
}

export function createEnemy(params: {
  defId: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  contactDamage: number;
  moveSpeed: number;
  radius: number;
  tier: EnemyTier;
  behavior: BehaviorId;
  behaviorParams: BehaviorParams;
  shape: PlaceholderShape;
  xpValue: number;
  isBoss?: boolean;
  phases?: BossPhase[];
}): Enemy {
  return {
    id: allocId(),
    defId: params.defId,
    name: params.name,
    x: params.x,
    y: params.y,
    vx: 0,
    vy: 0,
    hp: params.hp,
    maxHp: params.hp,
    contactDamage: params.contactDamage,
    moveSpeed: params.moveSpeed,
    radius: params.radius,
    tier: params.tier,
    behavior: params.behavior,
    behaviorParams: params.behaviorParams,
    shape: params.shape,
    xpValue: params.xpValue,
    facingAngle: 0,
    dead: false,
    active: true,
    hitFlash: 0,
    stateTimer: 0,
    telegraphTimer: 0,
    behaviorActive: false,
    originX: params.x,
    originY: params.y,
    isBoss: params.isBoss ?? false,
    phases: params.phases,
    currentPhaseIndex: 0,
  };
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  pierceRemaining: number;
  radius: number;
  friendly: boolean;
  life: number;
  homing: number; // 0 = none, else curve strength
  color: string;
  glow?: string;
  dead: boolean;
  hitEnemyIds?: Set<number>;
  isMine?: boolean;
  armTimer?: number;
}

export interface Pickup {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: number;
  radius: number;
  dead: boolean;
  magnetized: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
  dead: boolean;
}

/** Short-lived, non-gameplay visual effects (hitscan beams, AoE rings, hit flashes). */
export type VisualEffect =
  | { kind: "ring"; x: number; y: number; radius: number; life: number; maxLife: number; color: string }
  | { kind: "beam"; x1: number; y1: number; x2: number; y2: number; life: number; maxLife: number; color: string }
  | { kind: "arc"; x: number; y: number; angle: number; spread: number; radius: number; life: number; maxLife: number; color: string }
  | { kind: "hit"; x: number; y: number; life: number; maxLife: number; color: string; crit: boolean };

export interface OrbitDroneInstance {
  angleOffset: number;
  hitTimer: number;
}

export interface WeaponInstance {
  upgradeId: string;
  stackCount: number; // 1-5
  cooldown: number;
  orbitDrones?: OrbitDroneInstance[];
}

export interface Player {
  x: number;
  y: number;
  angle: number;
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  xpToNext: number;
  motesThisRun: number;
  shipId: string;
  weapons: WeaponInstance[];
  passiveStacks: Record<string, number>;
  shieldCharges: number;
  shieldMax: number;
  shieldRegenTimer: number;
  regenAccum: number;
  invulnTimer: number;
  hitFlash: number;
  meleeSweepTimer: number;
}
