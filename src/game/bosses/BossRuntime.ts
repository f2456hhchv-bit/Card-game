/**
 * Boss runtime (AF-035): owns the phase state machine, reuses AF-021's
 * DefenceState directly for hull/shield/armour, and reuses AF-033's
 * EnemyRuntime directly for attack telegraph/cooldown gating by
 * synthesizing the minimal EnemyDef view it actually reads (attack +
 * specialAbility) — the same "reuse the engine, not just the vocabulary"
 * rule every prior module followed.
 */
import { DefenceState } from "../combat/DefenceState";
import type { CombatTuning } from "../combat/combatTuning";
import { EnemyRuntime } from "../enemies/EnemyRuntime";
import type { EnemyDef } from "../enemies/enemyData";
import { createBossStateMachine, type BossState } from "./BossAI";
import type { BossDef, BossPhaseDef } from "./bossData";

export interface BossSnapshot {
  bossId: string;
  state: BossState;
  phaseIndex: number;
  phaseId: string;
  hull: number;
  maxHull: number;
  shield: number;
  maxShield: number;
  enraged: boolean;
  weakPointsDestroyed: readonly string[];
  elapsedMs: number;
}

const TRANSITION_DURATION_MS = 500;

export class BossRuntime {
  readonly ai = createBossStateMachine("introduction");
  readonly defence: DefenceState;
  private phaseIndex = 0;
  private enemyRuntime: EnemyRuntime;
  private readonly weakPointHull = new Map<string, number>();
  private readonly weakPointsDestroyed = new Set<string>();
  private elapsedMs = 0;
  private enraged = false;
  private transitionRemainingMs = 0;

  constructor(private readonly def: BossDef, tuning: CombatTuning) {
    this.defence = new DefenceState(def.shield, def.hull, tuning, def.armour);
    this.enemyRuntime = new EnemyRuntime(this.phaseAsEnemyDef(def.phases[0]!));
    for (const weakPoint of def.weakPoints) {
      this.weakPointHull.set(weakPoint.id, weakPoint.hullFraction * def.hull);
    }
  }

  private phaseAsEnemyDef(phase: BossPhaseDef): EnemyDef {
    return {
      id: `${this.def.id}-${phase.phaseId}`,
      name: this.def.name,
      family: this.def.family,
      roles: ["tank", "bossSupport"],
      lore: this.def.lore,
      strengths: [],
      weaknesses: [],
      counterplay: "",
      hull: this.def.hull,
      shield: this.def.shield,
      movementBehaviour: phase.movementBehaviour,
      moveSpeed: phase.moveSpeed,
      attack: phase.attack,
      specialAbility: phase.additionalAbility,
      eliteModifier: null,
      deathEvents: [],
      xpTier: "boss",
    };
  }

  get currentPhase(): BossPhaseDef {
    return this.def.phases[this.phaseIndex]!;
  }

  /** Call once the introduction beat finishes to start the fight. */
  begin(): void {
    this.ai.transitionTo("engaging");
  }

  update(fixedDtMs: number): void {
    this.elapsedMs += fixedDtMs;
    this.defence.update(fixedDtMs);

    const state = this.ai.current;
    if (state === "introduction" || state === "rewardCeremony" || state === "deathSequence") return;

    if (this.defence.isDefeated) {
      this.ai.transitionTo("deathSequence");
      return;
    }

    if (state === "transitioning") {
      this.transitionRemainingMs = Math.max(0, this.transitionRemainingMs - fixedDtMs);
      if (this.transitionRemainingMs === 0) this.ai.transitionTo("engaging");
      return;
    }

    this.enemyRuntime.update(fixedDtMs);

    const hullFraction = this.defence.snapshot.hull / this.def.hull;
    const nextPhase = this.def.phases[this.phaseIndex + 1];
    if (nextPhase && hullFraction <= nextPhase.hullThreshold) {
      this.phaseIndex += 1;
      this.enemyRuntime = new EnemyRuntime(this.phaseAsEnemyDef(this.currentPhase));
      this.transitionRemainingMs = TRANSITION_DURATION_MS;
      this.ai.transitionTo("transitioning");
      return;
    }

    if (!this.enraged && this.evaluateEnrage(hullFraction)) {
      this.enraged = true;
      if (this.ai.current === "engaging") this.ai.transitionTo("enrage");
    }
  }

  private evaluateEnrage(hullFraction: number): boolean {
    const enrage = this.def.enrage;
    if (!enrage) return false;
    switch (enrage.trigger) {
      case "lowHealth":
        return enrage.hullThreshold !== undefined && hullFraction <= enrage.hullThreshold;
      case "timeLimit":
        return enrage.timeLimitMs !== undefined && this.elapsedMs >= enrage.timeLimitMs;
      case "ascension":
      case "missionModifier":
      case "specialEvent":
        // Ascension is evaluated externally via notifyAscension (no ascension context
        // inside the runtime); missionModifier/specialEvent are registered future,
        // the same "no consumer yet" pattern AF-028/033/034 already established.
        return false;
    }
  }

  /** External hook — ascension enrage needs the run's ascension level, not owned here. */
  notifyAscension(ascension: number): void {
    const enrage = this.def.enrage;
    if (
      !this.enraged &&
      enrage?.trigger === "ascension" &&
      enrage.ascensionThreshold !== undefined &&
      ascension >= enrage.ascensionThreshold
    ) {
      this.enraged = true;
      if (this.ai.current === "engaging") this.ai.transitionTo("enrage");
    }
  }

  get damageMultiplier(): number {
    return this.enraged && this.def.enrage ? 1 + this.def.enrage.damageMultiplier : 1;
  }

  get speedMultiplier(): number {
    return this.enraged && this.def.enrage ? 1 + this.def.enrage.speedMultiplier : 1;
  }

  tryAttack(canEngage: boolean): boolean {
    const state = this.ai.current;
    if (state !== "engaging" && state !== "enrage") return false;
    return this.enemyRuntime.tryAttack(canEngage);
  }

  get attack() {
    return this.currentPhase.attack;
  }

  get movementBehaviour() {
    return this.currentPhase.movementBehaviour;
  }

  get moveSpeed(): number {
    return this.currentPhase.moveSpeed * this.speedMultiplier;
  }

  /** Returns true the instant this weak point is destroyed (fires once). */
  applyWeakPointDamage(weakPointId: string, amount: number): boolean {
    const current = this.weakPointHull.get(weakPointId);
    if (current === undefined || this.weakPointsDestroyed.has(weakPointId)) return false;
    const next = Math.max(0, current - amount);
    this.weakPointHull.set(weakPointId, next);
    if (next === 0) {
      this.weakPointsDestroyed.add(weakPointId);
      return true;
    }
    return false;
  }

  /** Destroyed weak points make the boss more vulnerable — reward for precision play. */
  get incomingDamageMultiplier(): number {
    return 1 + this.weakPointsDestroyed.size * 0.15;
  }

  get snapshot(): BossSnapshot {
    const defenceSnapshot = this.defence.snapshot;
    return {
      bossId: this.def.id,
      state: this.ai.current,
      phaseIndex: this.phaseIndex,
      phaseId: this.currentPhase.phaseId,
      hull: defenceSnapshot.hull,
      maxHull: this.def.hull,
      shield: defenceSnapshot.shield,
      maxShield: this.def.shield,
      enraged: this.enraged,
      weakPointsDestroyed: [...this.weakPointsDestroyed],
      elapsedMs: this.elapsedMs,
    };
  }
}
