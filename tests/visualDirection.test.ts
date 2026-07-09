import { describe, expect, it } from "vitest";
import {
  ANIMATION_LANGUAGE_PRINCIPLES,
  ART_STYLE_INFLUENCES,
  BIOME_VISUAL_ELEMENTS,
  CAMERA_FRAMEWORK_KINDS,
  CINEMATIC_PRESENTATION_BINDINGS,
  COLOUR_LANGUAGE_ELEMENTS,
  FACTION_COLOUR_SIGNATURES,
  LIGHTING_THEMES,
  MATERIAL_SYSTEM_BINDINGS,
  PHOTO_MODE_FEATURES,
  VFX_MIN_PRIORITY,
  VISUAL_ACCESSIBILITY_SURFACES,
  VISUAL_PERFORMANCE_DISCIPLINES,
  VISUAL_PILLARS,
  biomeVisualIdentityFor,
  colourSignaturesAreDistinct,
} from "../src/game/visual/visualDirectionData";

describe("Visual Direction Framework vocabulary (AF-092)", () => {
  it("registers 8 pillars, 8 art influences, 7 colour elements, 8 biome elements, 8 materials, 8 lighting, 9 VFX, 8 cinematic, 7 animation, 7 camera, 8 photo mode, 7 accessibility, 5 performance", () => {
    expect(VISUAL_PILLARS.length).toBe(8);
    expect(ART_STYLE_INFLUENCES.length).toBe(8);
    expect(COLOUR_LANGUAGE_ELEMENTS.length).toBe(7);
    expect(BIOME_VISUAL_ELEMENTS.length).toBe(8);
    expect(Object.keys(MATERIAL_SYSTEM_BINDINGS).length).toBe(8);
    expect(Object.keys(LIGHTING_THEMES).length).toBe(8);
    expect(Object.keys(VFX_MIN_PRIORITY).length).toBe(9);
    expect(Object.keys(CINEMATIC_PRESENTATION_BINDINGS).length).toBe(8);
    expect(ANIMATION_LANGUAGE_PRINCIPLES.length).toBe(7);
    expect(Object.keys(CAMERA_FRAMEWORK_KINDS).length).toBe(7);
    expect(PHOTO_MODE_FEATURES.length).toBe(8);
    expect(Object.keys(VISUAL_ACCESSIBILITY_SURFACES).length).toBe(7);
    expect(VISUAL_PERFORMANCE_DISCIPLINES.length).toBe(5);
  });

  it("6 faction colour signatures, each with all 7 colour language elements populated", () => {
    expect(Object.keys(FACTION_COLOUR_SIGNATURES).length).toBe(6);
    for (const [factionId, signature] of Object.entries(FACTION_COLOUR_SIGNATURES)) {
      for (const element of COLOUR_LANGUAGE_ELEMENTS) {
        expect(signature[element].length, `${factionId} ${element}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("Identity-uniqueness chain — ninth axis (AF-092 §Colour Language)", () => {
  it("every faction hex is distinct from every other faction hex AND from AF-007's locked rarity ladder", () => {
    expect(colourSignaturesAreDistinct()).toBe(true);
  });
});

describe("Biome visual identity — hand-authored + generated fallback (AF-092 §Biome Visual Language)", () => {
  it("resolves complete for hand-authored AND generated ids alike", () => {
    for (const biomeId of ["crystal-fields-alpha", "frozen-reach", "some-future-biome"]) {
      const identity = biomeVisualIdentityFor(biomeId);
      for (const element of BIOME_VISUAL_ELEMENTS) expect(identity[element].length, `${biomeId} ${element}`).toBeGreaterThan(0);
    }
  });
});

describe("VFX priority ordering — gameplay-critical effects never culled first (AF-092 §VFX System)", () => {
  it("bossMechanics > environmentalHazards > explosions > weapons/abilities > scanning/construction/research > weather", () => {
    expect(VFX_MIN_PRIORITY.bossMechanics!).toBeGreaterThan(VFX_MIN_PRIORITY.environmentalHazards!);
    expect(VFX_MIN_PRIORITY.environmentalHazards!).toBeGreaterThan(VFX_MIN_PRIORITY.explosions!);
    expect(VFX_MIN_PRIORITY.explosions!).toBeGreaterThan(VFX_MIN_PRIORITY.weapons!);
    expect(VFX_MIN_PRIORITY.weapons).toBe(VFX_MIN_PRIORITY.abilities);
    expect(VFX_MIN_PRIORITY.weapons!).toBeGreaterThan(VFX_MIN_PRIORITY.scanning!);
    expect(VFX_MIN_PRIORITY.scanning).toBe(VFX_MIN_PRIORITY.construction);
    expect(VFX_MIN_PRIORITY.construction).toBe(VFX_MIN_PRIORITY.research);
    expect(VFX_MIN_PRIORITY.research!).toBeGreaterThan(VFX_MIN_PRIORITY.weather!);
  });
});

describe("Live/future flag counts (AF-092)", () => {
  it("1 of 8 lighting themes live; 1 of 7 camera kinds live; 2 of 7 accessibility surfaces live via AF-044; 5 of 5 performance disciplines honestly future", () => {
    expect(Object.values(LIGHTING_THEMES).filter(Boolean).length).toBe(1);
    expect(Object.values(CAMERA_FRAMEWORK_KINDS).filter(Boolean).length).toBe(1);
    expect(Object.values(VISUAL_ACCESSIBILITY_SURFACES).filter(Boolean).length).toBe(2);
    expect(VISUAL_PERFORMANCE_DISCIPLINES.length).toBe(5);
  });

  it("every cinematic presentation binding names a real AF-module reference", () => {
    for (const binding of Object.values(CINEMATIC_PRESENTATION_BINDINGS)) expect(binding).toMatch(/AF-\d{3}/);
    for (const binding of Object.values(MATERIAL_SYSTEM_BINDINGS)) expect(binding).toMatch(/AF-\d{3}/);
  });
});

describe("Visual Direction Framework — self-review (AF-092 §Self Review Loop)", () => {
  it("120 seeded biome ids all resolve complete, distinct visual identities", () => {
    const seen = new Set<string>();
    for (let seed = 0; seed < 120; seed += 1) {
      const biomeId = `seed-biome-${seed}`;
      const identity = biomeVisualIdentityFor(biomeId);
      const signature = JSON.stringify(identity);
      if (seen.has(signature)) throw new Error(`seed ${seed}: duplicate generated identity`);
      seen.add(signature);
      for (const element of BIOME_VISUAL_ELEMENTS) {
        if (identity[element].length === 0) throw new Error(`seed ${seed}: empty ${element}`);
      }
    }
  });
});
