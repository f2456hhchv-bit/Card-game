import { describe, expect, it } from "vitest";
import {
  COLONY_IDENTITY_TRAITS,
  COMMANDER_IDENTITY_QUALITIES,
  CULTURAL_IDENTITY_EXPRESSIONS,
  IDENTITY_DEVELOPER_TOOLS,
  IDENTITY_LAYERS,
  INSTITUTIONAL_IDENTITY_KINDS,
  PERSONAL_IDENTITY_SIGNATURES,
  PLANETARY_IDENTITY_TRAITS,
  PROFESSIONAL_IDENTITY_EXAMPLES,
  SYMBOLISM_CATEGORIES,
} from "../src/game/atlasIdentity/atlasIdentityData";
import { EarnedTitleTracker, ReputationTracker } from "../src/game/atlasIdentity/AtlasIdentityRuntime";
import { MeaningCurator, SignificanceTracker } from "../src/game/atlasMeaning/AtlasMeaningRuntime";
import { INDIVIDUAL_PURPOSE_KINDS } from "../src/game/atlasPurpose/atlasPurposeData";
import { CULTURAL_IDENTITY_LAYERS } from "../src/game/atlasConsciousness/atlasConsciousnessData";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";

describe("The Atlas Identity Engine (AF-167)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(IDENTITY_LAYERS.length).toBe(10);
    expect(PERSONAL_IDENTITY_SIGNATURES.length).toBe(9);
    expect(PROFESSIONAL_IDENTITY_EXAMPLES.length).toBe(8);
    expect(COMMANDER_IDENTITY_QUALITIES.length).toBe(8);
    expect(COLONY_IDENTITY_TRAITS.length).toBe(9);
    expect(PLANETARY_IDENTITY_TRAITS.length).toBe(8);
    expect(INSTITUTIONAL_IDENTITY_KINDS.length).toBe(7);
    expect(CULTURAL_IDENTITY_EXPRESSIONS.length).toBe(8);
    expect(SYMBOLISM_CATEGORIES.length).toBe(8);
    expect(IDENTITY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("IDENTITY_LAYERS is a genuinely different axis from AF-166's real CULTURAL_IDENTITY_LAYERS (scale-of-identity vs what-a-citizen-identifies-with)", () => {
    expect(IDENTITY_LAYERS).not.toEqual(CULTURAL_IDENTITY_LAYERS);
    const overlap = IDENTITY_LAYERS.filter((l) => (CULTURAL_IDENTITY_LAYERS as readonly string[]).includes(l));
    expect(overlap.length).toBeLessThan(IDENTITY_LAYERS.length);
  });

  it("PROFESSIONAL_IDENTITY_EXAMPLES shares 4 exact-string members with AF-162's real INDIVIDUAL_PURPOSE_KINDS", () => {
    const overlap = PROFESSIONAL_IDENTITY_EXAMPLES.filter((p) => (INDIVIDUAL_PURPOSE_KINDS as readonly string[]).includes(p));
    expect(overlap.sort()).toEqual(["Engineer", "Explorer", "Historian", "Scientist"]);
  });

  it("Personal Identity reuses AF-163's real generic MeaningCurator directly, over a new SignatureTraitKind type parameter rather than a mirrored class", () => {
    const curator = new MeaningCurator<(typeof PERSONAL_IDENTITY_SIGNATURES)[number]>();
    curator.curate("commander-fen-beastmaster", "Favourite sayings", "\"The wild remembers kindness.\"", 20);
    expect(curator.entryFor("commander-fen-beastmaster", "Favourite sayings")?.description).toBe('"The wild remembers kindness."');
  });

  it("ReputationTracker accumulates external recognition over time, a genuinely different axis from internal growth trackers", () => {
    const tracker = new ReputationTracker();
    tracker.recognizeFor("commander-fen-beastmaster", "Mentorship", 5);
    tracker.recognizeFor("commander-fen-beastmaster", "Mentorship", 10);
    tracker.recognizeFor("commander-fen-beastmaster", "Bravery", 12);
    expect(tracker.recognitionCountFor("commander-fen-beastmaster", "Mentorship")).toBe(2);
    expect(tracker.mostRecognizedQuality("commander-fen-beastmaster")).toBe("Mentorship");
  });

  it("The same ReputationTracker generic class serves both Commander Identity and Institutional Identity", () => {
    const tracker = new ReputationTracker();
    tracker.recognizeFor("museum-verdance", "Research strengths", 10);
    expect(tracker.recognitionCountFor("museum-verdance", "Research strengths")).toBe(1);
  });

  it("EarnedTitleTracker is append-only — a title, once earned, is never replaced or curated away", () => {
    const tracker = new EarnedTitleTracker();
    tracker.earn("settlement-verdance", "The city that rebuilt the oceans.", 20);
    tracker.earn("settlement-verdance", "The city that welcomed strangers.", 40);
    expect(tracker.titlesFor("settlement-verdance").length).toBe(2);
  });

  it("Cultural Identity reuses AF-159's real CulturalTrendTracker directly", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Verdance Harvest Festival", "settlement-verdance", 10);
    expect(tracker.adoptersFor("Verdance Harvest Festival")).toEqual(["settlement-verdance"]);
  });

  it("Symbolism composes AF-163's real SignificanceTracker directly for reinforcement", () => {
    const tracker = new SignificanceTracker();
    tracker.register("verdance-flag", "The Verdance Flag", 1);
    tracker.reinforce("verdance-flag", 20);
    expect(tracker.significanceOf("verdance-flag")).toBe(1);
  });
});
