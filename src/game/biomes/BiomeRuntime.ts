/**
 * Biome runtime (AF-036): rotates weather (a MovementModifier "force"
 * producer), ticks hazard zones via AF-035's exact HazardZone engine,
 * weighted-picks Biome Events on a timer, and exposes resource weights /
 * enemy buff / hazard immunities / threat modifier for the composition
 * root to feed into AF-023/AF-028/AF-021/AF-017's existing hooks. No new
 * loot, hazard, movement, bonus, or threat system.
 */
import type { Rng } from "../../core/rng/Rng";
import { stepHazardZone, type HazardZoneDef, type HazardZoneState } from "../bosses/BossArena";
import type { BiomeDef, BiomeEventKind, InteractableDef, WeatherDef, WeatherKind } from "./biomeData";

export interface BiomeSnapshot {
  biomeId: string;
  activeWeather: WeatherKind | null;
  weatherRemainingMs: number;
  hazardCount: number;
  lastEventKind: BiomeEventKind | null;
  eventsTriggered: number;
}

export class BiomeRuntime {
  private readonly hazardStates = new Map<string, HazardZoneState>();
  private activeWeatherIndex = -1;
  private weatherRemainingMs = 0;
  private eventTimerMs = 0;
  private lastEventKind: BiomeEventKind | null = null;
  private eventsTriggered = 0;

  constructor(
    private readonly def: BiomeDef,
    private readonly rng: Rng,
    private readonly eventIntervalMs = 15000,
  ) {
    for (const hazard of def.hazards) this.hazardStates.set(hazard.id, { tickClockMs: 0 });
  }

  update(fixedDtMs: number): void {
    if (this.def.weather.length > 0) {
      this.weatherRemainingMs -= fixedDtMs;
      if (this.weatherRemainingMs <= 0) {
        this.activeWeatherIndex = this.rng.int(0, this.def.weather.length - 1);
        this.weatherRemainingMs = this.currentWeather?.durationMs ?? 0;
      }
    }
    this.eventTimerMs += fixedDtMs;
  }

  get currentWeather(): WeatherDef | null {
    if (this.activeWeatherIndex < 0) return null;
    return this.def.weather[this.activeWeatherIndex] ?? null;
  }

  /** Returns a newly-fired event kind exactly once per interval, or null. */
  tryTriggerEvent(): BiomeEventKind | null {
    if (this.def.events.length === 0 || this.eventTimerMs < this.eventIntervalMs) return null;
    this.eventTimerMs = 0;
    const totalWeight = this.def.events.reduce((sum, event) => sum + event.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    for (const event of this.def.events) {
      roll -= event.weight;
      if (roll <= 0) {
        this.lastEventKind = event.kind;
        this.eventsTriggered += 1;
        return event.kind;
      }
    }
    return null;
  }

  /** Hazards whose tick fired this frame — the caller applies damage/status (AF-021 engine, reused). */
  tickHazards(fixedDtMs: number): readonly HazardZoneDef[] {
    const firing: HazardZoneDef[] = [];
    for (const hazard of this.def.hazards) {
      const state = this.hazardStates.get(hazard.id);
      if (state && stepHazardZone(hazard, state, fixedDtMs)) firing.push(hazard);
    }
    return firing;
  }

  findInteractableInRange(x: number, y: number): InteractableDef | null {
    for (const interactable of this.def.interactables) {
      if (Math.hypot(interactable.x - x, interactable.y - y) <= interactable.radius) return interactable;
    }
    return null;
  }

  get resourceWeights() {
    return this.def.resourceWeights;
  }

  get enemyBuff() {
    return this.def.enemyBuff;
  }

  get hazardImmunities() {
    return this.def.hazardImmunities;
  }

  get threatModifier(): number {
    return this.def.threatModifier;
  }

  get snapshot(): BiomeSnapshot {
    return {
      biomeId: this.def.id,
      activeWeather: this.currentWeather?.kind ?? null,
      weatherRemainingMs: Math.max(0, this.weatherRemainingMs),
      hazardCount: this.def.hazards.length,
      lastEventKind: this.lastEventKind,
      eventsTriggered: this.eventsTriggered,
    };
  }
}
