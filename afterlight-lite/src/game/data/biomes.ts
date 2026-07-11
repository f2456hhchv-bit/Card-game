import type { BiomeId } from "../types";

export interface BiomeInfo {
  id: BiomeId;
  name: string;
  /** Background tint used by the World renderer when this biome's boss/wave is active. */
  fogColor: string;
  colorPrimary: string;
  colorSecondary: string;
  glowColor: string;
}

export const BIOMES: Record<BiomeId, BiomeInfo> = {
  asteroidBelt: {
    id: "asteroidBelt",
    name: "Asteroid Belt",
    fogColor: "#1a1610",
    colorPrimary: "#a3876b",
    colorSecondary: "#4a3f35",
    glowColor: "#d9b98a",
  },
  nebulaDrift: {
    id: "nebulaDrift",
    name: "Nebula Drift",
    fogColor: "#180f26",
    colorPrimary: "#c56ce8",
    colorSecondary: "#6a1fb0",
    glowColor: "#e79bff",
  },
  iceField: {
    id: "iceField",
    name: "Ice Field",
    fogColor: "#0a1620",
    colorPrimary: "#8fe3ff",
    colorSecondary: "#1c6fa8",
    glowColor: "#c9f6ff",
  },
  volcanicMoon: {
    id: "volcanicMoon",
    name: "Volcanic Moon",
    fogColor: "#1f0d08",
    colorPrimary: "#ff8a4c",
    colorSecondary: "#7a1d0e",
    glowColor: "#ffce8a",
  },
  derelictStation: {
    id: "derelictStation",
    name: "Derelict Station",
    fogColor: "#0f1712",
    colorPrimary: "#9ad66b",
    colorSecondary: "#33402a",
    glowColor: "#d4ff9e",
  },
  voidRift: {
    id: "voidRift",
    name: "Void Rift",
    fogColor: "#0a0614",
    colorPrimary: "#8a5cff",
    colorSecondary: "#241249",
    glowColor: "#00f0ff",
  },
};

export const BIOME_ORDER: BiomeId[] = [
  "asteroidBelt",
  "nebulaDrift",
  "iceField",
  "volcanicMoon",
  "derelictStation",
  "voidRift",
];
