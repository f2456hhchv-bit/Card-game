/**
 * Camera tuning surface (AF-018 §11). Camera feel is a data edit, never a
 * code edit (AF-011 §7). Migrates into Data Registry tables when that lands.
 */
export type CameraMode =
  | "Menu"
  | "GalaxyCommand"
  | "MissionBriefing"
  | "Gameplay"
  | "BossIntro"
  | "BossCombat"
  | "MissionComplete"
  | "Defeat"
  | "Results";

export interface CameraModeSettings {
  zoom: number;
  follow: boolean;
}

export interface CameraTuning {
  modes: Readonly<Record<CameraMode, CameraModeSettings>>;
  /** Exponential follow rate per second (higher = tighter). */
  followSmoothingPerSecond: number;
  /** Predictive look-ahead: camera aims at position + velocity × this. */
  lookAheadMs: number;
  /** Never-outrun clamp: max world-unit distance camera may trail the player. */
  maxLagDistance: number;
  zoomSmoothingPerSecond: number;
  shakeDecayPerSecond: number;
  /** Clarity cap: stacked shake impulses never exceed this amplitude. */
  maxShakeAmplitude: number;
  /** Per-source impulse amplitudes (AF-018 §5). */
  shakeAmplitudes: Readonly<Record<ShakeSource, number>>;
}

export type ShakeSource =
  | "WeaponImpact"
  | "ShieldBreak"
  | "Ultimate"
  | "BossSlam"
  | "LargeExplosion"
  | "MissionComplete";

export const DEFAULT_CAMERA_TUNING: CameraTuning = {
  modes: {
    Menu: { zoom: 1, follow: false },
    GalaxyCommand: { zoom: 0.85, follow: false },
    MissionBriefing: { zoom: 1, follow: false },
    Gameplay: { zoom: 1, follow: true },
    BossIntro: { zoom: 0.8, follow: false },
    BossCombat: { zoom: 1, follow: true },
    MissionComplete: { zoom: 0.9, follow: false },
    Defeat: { zoom: 0.9, follow: false },
    Results: { zoom: 1, follow: false },
  },
  followSmoothingPerSecond: 6,
  lookAheadMs: 220,
  maxLagDistance: 4,
  zoomSmoothingPerSecond: 3,
  shakeDecayPerSecond: 6,
  maxShakeAmplitude: 0.6,
  shakeAmplitudes: {
    WeaponImpact: 0.08,
    ShieldBreak: 0.3,
    Ultimate: 0.35,
    BossSlam: 0.5,
    LargeExplosion: 0.4,
    MissionComplete: 0.25,
  },
};
