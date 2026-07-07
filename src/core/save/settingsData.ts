/**
 * Settings Save data shapes (AF-044). Persists independently of any Save
 * Profile — accessibility/graphics/audio/control preferences apply to the
 * device/installation, not to a particular character's progress, matching
 * how most games actually scope settings (a deliberate design call, not an
 * oversight). Reduced Notification Mode was registered as accessibility
 * vocabulary by AF-041 with no producer until now.
 */
export const SETTINGS_CATEGORIES = [
  "graphics",
  "audio",
  "accessibility",
  "controls",
  "hud",
  "language",
  "gameplayOptions",
  "performance",
] as const;
export type SettingsCategory = (typeof SETTINGS_CATEGORIES)[number];

export interface SettingsData {
  graphics: {
    resolution: "auto" | "720p" | "1080p" | "1440p";
    vsync: boolean;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
  };
  accessibility: {
    highContrast: boolean;
    colourBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
    /** AF-041 §Accessibility registered this with no producer until now. */
    reducedNotificationMode: boolean;
    largeText: boolean;
  };
  controls: {
    invertY: boolean;
    sensitivity: number;
  };
  hud: {
    showDamageNumbers: boolean;
    showMinimap: boolean;
  };
  language: {
    locale: string;
  };
  gameplayOptions: {
    autoPickup: boolean;
    pauseOnFocusLoss: boolean;
  };
  performance: {
    particleQuality: "low" | "medium" | "high";
    targetFrameCap: 60 | 120;
  };
}

export const DEFAULT_SETTINGS: SettingsData = {
  graphics: { resolution: "auto", vsync: true },
  audio: { masterVolume: 0.8, musicVolume: 0.7, sfxVolume: 0.8, muted: false },
  accessibility: { highContrast: false, colourBlindMode: "none", reducedNotificationMode: false, largeText: false },
  controls: { invertY: false, sensitivity: 1 },
  hud: { showDamageNumbers: true, showMinimap: true },
  language: { locale: "en" },
  gameplayOptions: { autoPickup: true, pauseOnFocusLoss: true },
  performance: { particleQuality: "high", targetFrameCap: 120 },
};
