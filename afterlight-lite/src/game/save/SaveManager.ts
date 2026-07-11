import type { AttachmentSlot } from "../types";

const STORAGE_KEY = "afterlight-lite:save:v1";
const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  motes: number;
  attachmentLevels: Record<AttachmentSlot, number>;
  lastShipId: string;
  bestWave: number;
}

function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    motes: 0,
    attachmentLevels: { weapon: 0, shield: 0, wings: 0, thrusters: 0, hull: 0, cockpit: 0 },
    lastShipId: "vanguard",
    bestWave: 0,
  };
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    const base = defaultSave();
    return {
      version: SAVE_VERSION,
      motes: typeof parsed.motes === "number" ? parsed.motes : base.motes,
      attachmentLevels: { ...base.attachmentLevels, ...(parsed.attachmentLevels ?? {}) },
      lastShipId: parsed.lastShipId ?? base.lastShipId,
      bestWave: typeof parsed.bestWave === "number" ? parsed.bestWave : base.bestWave,
    };
  } catch {
    return defaultSave();
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private browsing, quota) — progress just won't persist.
  }
}
