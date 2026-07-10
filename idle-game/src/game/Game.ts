import { Rng } from "../core/math/Rng";
import { loadState, saveState } from "./save/SaveManager";
import { createDefaultState, type GameState } from "./state/GameState";
import { simulateTick, type CombatEvent, type TickResult } from "./sim/Combat";
import { resolveOfflineProgress, type OfflineResult } from "./sim/Offline";
import { effectiveHeroStats, type EffectiveStats } from "./sim/HeroStats";
import { upgradeById, upgradeCost } from "./data/upgradeDefs";
import { PRESTIGE, afterglowForStage } from "./data/prestigeDefs";
import { enhanceCost, type GearSlot } from "./data/gearDefs";

export type GameEvent =
  | { kind: "combat"; event: CombatEvent }
  | { kind: "offlineSummary"; result: OfflineResult }
  | { kind: "upgradePurchased"; id: string }
  | { kind: "gearEnhanced"; slot: GearSlot }
  | { kind: "prestiged"; afterglow: number };

export type GameListener = (event: GameEvent) => void;

const AUTOSAVE_INTERVAL_SECONDS = 15;
/** Absences shorter than this resume silently — no modal for "stepped away
 * to make tea," only for "closed the laptop for hours." */
const OFFLINE_SUMMARY_THRESHOLD_SECONDS = 60;

/**
 * Orchestrates the pure sim (Combat/Offline/HeroStats) against persisted
 * state and the outside world (wall-clock, localStorage, UI/renderer
 * listeners). The sim modules stay pure/testable; this is the only place
 * that touches Date.now(), localStorage, or timers.
 */
export class Game {
  state: GameState;
  /** Set once at construction if the player was away long enough to matter;
   * the UI shows it once, then the caller should clear it. */
  offlineSummary: OfflineResult | null = null;

  private rng: Rng;
  private listeners = new Set<GameListener>();
  private secondsSinceAutosave = 0;

  constructor() {
    this.state = loadState();
    this.rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    this.catchUpFromAbsence();
  }

  /**
   * Fast-forward past any gap since `state.lastSeenAt` — called at boot, and
   * again whenever the tab regains visibility (backgrounded tabs have their
   * rAF loop throttled/suspended by the browser, so a long background stint
   * should be treated the same as being fully closed, not as one huge live
   * tick). Absences under the threshold just bump the clock silently.
   */
  catchUpFromAbsence(): void {
    const now = Date.now();
    const elapsed = (now - this.state.lastSeenAt) / 1000;
    if (elapsed >= OFFLINE_SUMMARY_THRESHOLD_SECONDS) {
      const result = resolveOfflineProgress(this.state, now, this.rng);
      this.state = result.state;
      this.offlineSummary = result;
      this.emit({ kind: "offlineSummary", result });
    } else {
      this.state.lastSeenAt = now;
    }
  }

  on(listener: GameListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: GameEvent): void {
    for (const listener of this.listeners) listener(event);
  }

  /** Acknowledge and clear the one-time offline-return summary. */
  dismissOfflineSummary(): void {
    this.offlineSummary = null;
  }

  effectiveStats(): EffectiveStats {
    return effectiveHeroStats(this.state);
  }

  /** Advance the live simulation by `dtSeconds` (called every animation frame
   * or on a fixed interval — small dt, so batching rarely fires and events
   * come through near one-to-one with actual kills for smooth animation). */
  tick(dtSeconds: number): TickResult {
    const result = simulateTick(this.state, dtSeconds, this.rng);
    this.state = result.state;
    this.state.lastSeenAt = Date.now();
    for (const event of result.events) this.emit({ kind: "combat", event });

    this.secondsSinceAutosave += dtSeconds;
    if (this.secondsSinceAutosave >= AUTOSAVE_INTERVAL_SECONDS) {
      this.secondsSinceAutosave = 0;
      this.save();
    }
    return result;
  }

  save(): void {
    saveState(this.state);
  }

  // ---- Shop ---------------------------------------------------------------
  upgradeLevel(id: string): number {
    return this.state.upgrades[id] ?? 0;
  }

  upgradeCostFor(id: string): number | null {
    const def = upgradeById(id);
    return def ? upgradeCost(def, this.upgradeLevel(id)) : null;
  }

  canBuyUpgrade(id: string): boolean {
    const def = upgradeById(id);
    if (!def) return false;
    const level = this.upgradeLevel(id);
    if (def.maxLevel !== undefined && level >= def.maxLevel) return false;
    return this.state.gold >= upgradeCost(def, level);
  }

  buyUpgrade(id: string): boolean {
    const def = upgradeById(id);
    if (!def || !this.canBuyUpgrade(id)) return false;
    const level = this.upgradeLevel(id);
    this.state.gold -= upgradeCost(def, level);
    this.state.upgrades[id] = level + 1;
    this.emit({ kind: "upgradePurchased", id });
    return true;
  }

  // ---- Gear -----------------------------------------------------------------
  enhanceCostFor(slot: GearSlot): number | null {
    const item = this.state.gear[slot];
    return item ? enhanceCost(item.rarity, item.enhanceLevel) : null;
  }

  canEnhanceGear(slot: GearSlot): boolean {
    const item = this.state.gear[slot];
    if (!item) return false;
    return this.state.alloy >= enhanceCost(item.rarity, item.enhanceLevel);
  }

  enhanceGear(slot: GearSlot): boolean {
    const item = this.state.gear[slot];
    if (!item || !this.canEnhanceGear(slot)) return false;
    this.state.alloy -= enhanceCost(item.rarity, item.enhanceLevel);
    this.state.gear = { ...this.state.gear, [slot]: { ...item, enhanceLevel: item.enhanceLevel + 1 } };
    this.emit({ kind: "gearEnhanced", slot });
    return true;
  }

  // ---- Prestige ---------------------------------------------------------
  canPrestige(): boolean {
    return this.state.highestStageReached >= PRESTIGE.unlockStage;
  }

  prestigePreview(): number {
    return afterglowForStage(this.state.highestStageReached);
  }

  prestige(): boolean {
    if (!this.canPrestige()) return false;
    const gained = this.prestigePreview();
    const fresh = createDefaultState();
    fresh.createdAt = this.state.createdAt;
    fresh.afterglow = this.state.afterglow + gained;
    fresh.lifetimeHighestStage = this.state.lifetimeHighestStage;
    fresh.rebirths = this.state.rebirths + 1;
    this.state = fresh;
    this.emit({ kind: "prestiged", afterglow: gained });
    this.save();
    return true;
  }
}
