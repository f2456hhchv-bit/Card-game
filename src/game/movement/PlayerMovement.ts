/**
 * Player movement simulation (AF-020). Arcade contract: instant direction
 * changes, predictable scalar acceleration, zero drift — the ship goes where
 * the stick points. Deterministic: runs only in the fixed timestep and reads
 * nothing but its inputs. Collision slides (tangent preserved), never sticks.
 */
import type { WorldBounds } from "../../engine/camera/Camera";
import type { MovementModifier, MovementProfile } from "./movementTuning";

export type MovementStateId =
  | "Idle"
  | "Moving"
  | "Boosting"
  | "ShieldImpact"
  | "AbilityMovement"
  | "TemporarySlow"
  | "TemporaryRoot"
  | "MissionComplete"
  | "Defeat";

export interface Obstacle {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface ActiveModifier extends MovementModifier {
  remainingMs: number;
}

export interface MovementSnapshot {
  state: MovementStateId;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  boostActive: boolean;
  boostCooldownMs: number;
  invulnerable: boolean;
  modifierCount: number;
  collisionContacts: number;
}

export class PlayerMovement {
  private x = 0;
  private y = 0;
  private directionX = 0;
  private directionY = -1;
  private speed = 0;
  private velocityX = 0;
  private velocityY = 0;

  private boostRemainingMs = 0;
  private boostCooldownMs = 0;

  private impulseX = 0;
  private impulseY = 0;
  private staggerRemainingMs = 0;

  private controlLock: "MissionComplete" | "Defeat" | null = null;
  private abilityMovementActive = false;

  private readonly modifiers: ActiveModifier[] = [];
  private bounds: WorldBounds | null = null;
  private obstacles: readonly Obstacle[] = [];
  private contactsThisTick = 0;

  constructor(private readonly profile: MovementProfile) {}

  // ── World setup ──────────────────────────────────────────────────────────

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setBounds(bounds: WorldBounds | null): void {
    this.bounds = bounds;
  }

  setObstacles(obstacles: readonly Obstacle[]): void {
    this.obstacles = obstacles;
  }

  // ── Gameplay surface ─────────────────────────────────────────────────────

  /** Buffered boost activation (AF-019 §4 feeds this). */
  tryBoost(): boolean {
    if (this.controlLock !== null || this.isRooted()) return false;
    if (this.boostRemainingMs > 0 || this.boostCooldownMs > 0) return false;
    this.boostRemainingMs = this.profile.boostDurationMs;
    this.boostCooldownMs = this.profile.boostCooldownMs;
    return true;
  }

  /** Shield-impact knockback: explicit impulse channel + brief stagger. */
  applyImpulse(impulseX: number, impulseY: number, staggerMs = 0): void {
    this.impulseX += impulseX;
    this.impulseY += impulseY;
    this.staggerRemainingMs = Math.max(this.staggerRemainingMs, staggerMs);
  }

  /** Same-id reapplication refreshes duration (AF-020 §5). */
  addModifier(modifier: MovementModifier): void {
    const existing = this.modifiers.find((m) => m.id === modifier.id);
    if (existing) {
      existing.remainingMs = modifier.durationMs;
      return;
    }
    this.modifiers.push({ ...modifier, remainingMs: modifier.durationMs });
  }

  setControlLocked(reason: "MissionComplete" | "Defeat" | null): void {
    this.controlLock = reason;
  }

  setAbilityMovement(active: boolean): void {
    this.abilityMovementActive = active;
  }

  // ── Simulation (fixed timestep only) ─────────────────────────────────────

  update(fixedDtMs: number, inputX: number, inputY: number): void {
    const dt = fixedDtMs / 1000;
    this.contactsThisTick = 0;

    // Timers.
    if (this.boostRemainingMs > 0) this.boostRemainingMs = Math.max(0, this.boostRemainingMs - fixedDtMs);
    else if (this.boostCooldownMs > 0) this.boostCooldownMs = Math.max(0, this.boostCooldownMs - fixedDtMs);
    if (this.staggerRemainingMs > 0) this.staggerRemainingMs = Math.max(0, this.staggerRemainingMs - fixedDtMs);
    for (let i = this.modifiers.length - 1; i >= 0; i -= 1) {
      const modifier = this.modifiers[i] as ActiveModifier;
      modifier.remainingMs -= fixedDtMs;
      if (modifier.remainingMs <= 0) this.modifiers.splice(i, 1);
    }

    // Input control.
    const controlAllowed =
      this.controlLock === null && !this.isRooted() && this.staggerRemainingMs === 0;
    let targetSpeed = 0;
    if (controlAllowed) {
      const magnitude = Math.hypot(inputX, inputY);
      if (magnitude > 0.01) {
        // Instant direction change — the arcade contract (AF-020 §1).
        this.directionX = inputX / magnitude;
        this.directionY = inputY / magnitude;
        const baseSpeed = this.boostRemainingMs > 0 ? this.profile.boostSpeed : this.profile.maxSpeed;
        targetSpeed = baseSpeed * Math.min(1, magnitude) * this.speedMultiplier();
      } else if (this.boostRemainingMs > 0) {
        // Boosting with no input still bursts along the facing direction.
        targetSpeed = this.profile.boostSpeed * this.speedMultiplier();
      }
    }

    // Predictable scalar acceleration.
    const rate = targetSpeed > this.speed ? this.profile.acceleration : this.profile.deceleration;
    const step = rate * dt;
    this.speed =
      this.speed < targetSpeed
        ? Math.min(targetSpeed, this.speed + step)
        : Math.max(targetSpeed, this.speed - step);
    if (this.isRooted()) this.speed = 0;

    this.velocityX = this.directionX * this.speed;
    this.velocityY = this.directionY * this.speed;

    // Knockback impulse (decaying) and environmental forces (additive).
    let moveX = this.velocityX + this.impulseX;
    let moveY = this.velocityY + this.impulseY;
    for (const modifier of this.modifiers) {
      if (modifier.kind === "force") {
        moveX += modifier.forceX ?? 0;
        moveY += modifier.forceY ?? 0;
      }
    }
    const impulseDecay = Math.exp(-this.profile.impulseDecayPerSecond * dt);
    this.impulseX *= impulseDecay;
    this.impulseY *= impulseDecay;
    if (Math.abs(this.impulseX) < 1e-3) this.impulseX = 0;
    if (Math.abs(this.impulseY) < 1e-3) this.impulseY = 0;

    this.x += moveX * dt;
    this.y += moveY * dt;

    this.collide();
    this.clampToBounds();
  }

  // ── Reads ────────────────────────────────────────────────────────────────

  get state(): MovementStateId {
    if (this.controlLock === "Defeat") return "Defeat";
    if (this.controlLock === "MissionComplete") return "MissionComplete";
    if (this.isRooted()) return "TemporaryRoot";
    if (this.staggerRemainingMs > 0 || this.impulseX !== 0 || this.impulseY !== 0) return "ShieldImpact";
    if (this.abilityMovementActive) return "AbilityMovement";
    if (this.speedMultiplier() < 1) return "TemporarySlow";
    if (this.boostRemainingMs > 0) return "Boosting";
    return this.speed > 0.05 ? "Moving" : "Idle";
  }

  get snapshot(): MovementSnapshot {
    return {
      state: this.state,
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      speed: this.speed,
      boostActive: this.boostRemainingMs > 0,
      boostCooldownMs: this.boostCooldownMs,
      invulnerable: this.boostRemainingMs > 0 && this.profile.boostGrantsInvulnerability,
      modifierCount: this.modifiers.length,
      collisionContacts: this.contactsThisTick,
    };
  }

  // ── Internals ────────────────────────────────────────────────────────────

  private isRooted(): boolean {
    return this.modifiers.some((m) => m.kind === "root");
  }

  private speedMultiplier(): number {
    let multiplier = 1;
    for (const modifier of this.modifiers) {
      if (modifier.kind === "speedMultiplier") multiplier *= modifier.multiplier ?? 1;
    }
    const clamp = this.profile.speedMultiplierClamp;
    return Math.min(clamp.max, Math.max(clamp.min, multiplier));
  }

  /** Circle-vs-AABB with tangent-preserving slide (AF-020 §6). */
  private collide(): void {
    const radius = this.profile.collisionRadius;
    for (const box of this.obstacles) {
      const nearestX = Math.min(box.maxX, Math.max(box.minX, this.x));
      const nearestY = Math.min(box.maxY, Math.max(box.minY, this.y));
      const dx = this.x - nearestX;
      const dy = this.y - nearestY;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq >= radius * radius) continue;
      this.contactsThisTick += 1;
      if (distanceSq > 1e-9) {
        // Push out along the contact normal only — tangent motion untouched.
        const distance = Math.sqrt(distanceSq);
        const push = radius - distance;
        this.x += (dx / distance) * push;
        this.y += (dy / distance) * push;
      } else {
        // Centre inside the box: escape along the shallowest axis.
        const leftGap = this.x - box.minX;
        const rightGap = box.maxX - this.x;
        const topGap = this.y - box.minY;
        const bottomGap = box.maxY - this.y;
        const smallest = Math.min(leftGap, rightGap, topGap, bottomGap);
        if (smallest === leftGap) this.x = box.minX - radius;
        else if (smallest === rightGap) this.x = box.maxX + radius;
        else if (smallest === topGap) this.y = box.minY - radius;
        else this.y = box.maxY + radius;
      }
    }
  }

  private clampToBounds(): void {
    if (!this.bounds) return;
    const radius = this.profile.collisionRadius;
    this.x = Math.min(this.bounds.maxX - radius, Math.max(this.bounds.minX + radius, this.x));
    this.y = Math.min(this.bounds.maxY - radius, Math.max(this.bounds.minY + radius, this.y));
  }
}
