/**
 * Enemy Director tuning surface (AF-017 §9). Every number that shapes combat
 * pacing lives here as data (AF-011 §7: no mechanic tunable only in code).
 * Migrates into the Data Registry tables when that system lands.
 */
export type DirectorPhase =
  | "Recovery"
  | "LightContact"
  | "Combat"
  | "HeavyCombat"
  | "ElitePressure"
  | "EnvironmentalEvent"
  | "MiniBoss"
  | "BossHandoff"
  | "Reward";

export type WaveType =
  | "AmbientPatrol"
  | "SwarmWave"
  | "HunterPack"
  | "EliteSquad"
  | "ReinforcementWave"
  | "AmbushEvent"
  | "MiniBossWave"
  | "BossWave"
  | "MixedEncounter";

export type EnvironmentalEventType =
  | "MeteorShower"
  | "SolarFlare"
  | "CrystalGrowth"
  | "GravityFlux"
  | "VoidDistortion"
  | "MachineReinforcements"
  | "AncientSignal";

export const ENVIRONMENTAL_EVENTS: readonly EnvironmentalEventType[] = [
  "MeteorShower",
  "SolarFlare",
  "CrystalGrowth",
  "GravityFlux",
  "VoidDistortion",
  "MachineReinforcements",
  "AncientSignal",
];

export interface PhaseStep {
  phase: DirectorPhase;
  /** Base duration; jittered ±jitterRatio per run by the seeded RNG. */
  durationMs: number;
}

export interface ThreatWeights {
  ascensionFactor: number;
  elapsedSlopePerMinute: number;
  levelWeight: number;
  equipmentWeight: number;
}

export interface DirectorTuning {
  /** The AF-017 pacing cycle, in order. Boss handoff follows the last step. */
  phaseSequence: readonly PhaseStep[];
  phaseDurationJitterRatio: number;
  /** Budget throttle per phase (0 = silent, 1 = full pressure). */
  phaseIntensity: Readonly<Record<DirectorPhase, number>>;
  /** Wave types the Director may pick per phase. */
  wavesByPhase: Readonly<Partial<Record<DirectorPhase, readonly WaveType[]>>>;
  waveCost: Readonly<Record<WaveType, number>>;
  /** Budget points accrued per second at intensity 1, threat 1. */
  budgetRatePerSecond: number;
  /** Performance cap: no directives while this many enemies are active. */
  maxActiveEnemies: number;
  maxSimultaneousElites: number;
  eliteSquadSize: number;
  /** Fairness contract carried on every directive (AF-017 §6). */
  minSpawnDistanceFromPlayer: number;
  spawnTelegraphMs: number;
  /** Director decision cadence — decisions are not per-frame work. */
  decisionIntervalMs: number;
  threatWeights: ThreatWeights;
  threatClamp: { min: number; max: number };
}

export const DEFAULT_DIRECTOR_TUNING: DirectorTuning = {
  phaseSequence: [
    { phase: "Recovery", durationMs: 8_000 },
    { phase: "LightContact", durationMs: 10_000 },
    { phase: "Combat", durationMs: 20_000 },
    { phase: "HeavyCombat", durationMs: 15_000 },
    { phase: "ElitePressure", durationMs: 12_000 },
    { phase: "Recovery", durationMs: 8_000 },
    { phase: "EnvironmentalEvent", durationMs: 10_000 },
    { phase: "HeavyCombat", durationMs: 15_000 },
    { phase: "MiniBoss", durationMs: 20_000 },
    { phase: "Recovery", durationMs: 10_000 },
  ],
  phaseDurationJitterRatio: 0.2,
  phaseIntensity: {
    Recovery: 0.15,
    LightContact: 0.4,
    Combat: 0.7,
    HeavyCombat: 1.0,
    ElitePressure: 0.9,
    EnvironmentalEvent: 0.6,
    MiniBoss: 0.8,
    BossHandoff: 0,
    Reward: 0,
  },
  wavesByPhase: {
    Recovery: ["AmbientPatrol"],
    LightContact: ["AmbientPatrol", "HunterPack"],
    Combat: ["SwarmWave", "HunterPack", "MixedEncounter"],
    HeavyCombat: ["SwarmWave", "ReinforcementWave", "AmbushEvent", "MixedEncounter"],
    ElitePressure: ["EliteSquad"],
    EnvironmentalEvent: ["HunterPack", "SwarmWave"],
    MiniBoss: ["SwarmWave"],
  },
  waveCost: {
    AmbientPatrol: 6,
    SwarmWave: 14,
    HunterPack: 10,
    EliteSquad: 24,
    ReinforcementWave: 16,
    AmbushEvent: 12,
    MiniBossWave: 40,
    BossWave: 0,
    MixedEncounter: 18,
  },
  budgetRatePerSecond: 3,
  maxActiveEnemies: 120,
  maxSimultaneousElites: 3,
  eliteSquadSize: 2,
  minSpawnDistanceFromPlayer: 12,
  spawnTelegraphMs: 700,
  decisionIntervalMs: 250,
  threatWeights: {
    ascensionFactor: 0.15,
    elapsedSlopePerMinute: 0.08,
    levelWeight: 0.02,
    equipmentWeight: 0.03,
  },
  threatClamp: { min: 0.25, max: 12 },
};
