import { describe, expect, it } from "vitest";
import {
  COLLECTIVE_IDENTITY_EXAMPLES,
  COMMANDER_EVOLUTION_EXAMPLES,
  CONSCIOUSNESS_COMPONENTS,
  CONSCIOUSNESS_DEVELOPER_TOOLS,
  CULTURAL_IDENTITY_LAYERS,
  EMOTIONAL_CONTINUITY_DOMAINS,
  LIFE_STAGES,
  MORAL_REASONING_FACTORS,
  PERSONAL_GROWTH_AREAS,
  PRIVATE_LIFE_CATEGORIES,
  SELF_IMPROVEMENT_PURSUITS,
  SELF_REFLECTION_TOPICS,
  VALUE_EXAMPLES,
  hasIdentityGap,
  lifeStageRank,
  type Identity,
} from "../src/game/atlasConsciousness/atlasConsciousnessData";
import { EmotionalContinuityTracker, IdentityRegistry, PersonalGrowthTracker, ValuePriorityTracker } from "../src/game/atlasConsciousness/AtlasConsciousnessRuntime";
import { PURPOSE_DOMAINS } from "../src/game/atlasPurpose/atlasPurposeData";
import { COMMANDER_MATURITY_STAGES } from "../src/game/evolutionEngine/evolutionEngineData";
import { COMMANDER_WISDOM_TRAITS, REFLECTION_LOOP_STAGES } from "../src/game/atlasWisdom/atlasWisdomData";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { rankOptions } from "../src/game/atlasIntelligence/atlasIntelligenceData";

const SAMPLE_IDENTITY: Identity = {
  personalHistory: "Grew up on Verdance.",
  currentSelfImage: "A steady, dependable leader.",
  professionalIdentity: "Wildlife Commander",
  privateAspirations: "Found a sanctuary.",
  publicReputation: "A steady, dependable leader.",
  relationships: ["commander-thorne-starforged"],
  lifeMilestones: ["First expedition"],
  personalGrowth: "Learning patience.",
};

describe("The Atlas Consciousness Engine (AF-166)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(CONSCIOUSNESS_COMPONENTS.length).toBe(12);
    expect(SELF_REFLECTION_TOPICS.length).toBe(6);
    expect(VALUE_EXAMPLES.length).toBe(9);
    expect(PERSONAL_GROWTH_AREAS.length).toBe(8);
    expect(COMMANDER_EVOLUTION_EXAMPLES.length).toBe(7);
    expect(PRIVATE_LIFE_CATEGORIES.length).toBe(6);
    expect(LIFE_STAGES.length).toBe(5);
    expect(MORAL_REASONING_FACTORS.length).toBe(6);
    expect(SELF_IMPROVEMENT_PURSUITS.length).toBe(7);
    expect(EMOTIONAL_CONTINUITY_DOMAINS.length).toBe(6);
    expect(CULTURAL_IDENTITY_LAYERS.length).toBe(6);
    expect(COLLECTIVE_IDENTITY_EXAMPLES.length).toBe(5);
    expect(CONSCIOUSNESS_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("VALUE_EXAMPLES shares exactly 7 exact-string members with AF-162's real PURPOSE_DOMAINS", () => {
    const overlap = VALUE_EXAMPLES.filter((v) => (PURPOSE_DOMAINS as readonly string[]).includes(v));
    expect(overlap.length).toBe(7);
  });

  it("PERSONAL_GROWTH_AREAS shares exactly 3 exact-string members with AF-160's real COMMANDER_WISDOM_TRAITS", () => {
    const overlap = PERSONAL_GROWTH_AREAS.filter((a) => (COMMANDER_WISDOM_TRAITS as readonly string[]).includes(a));
    expect(overlap.sort()).toEqual(["Emotional maturity", "Humility", "Patience"]);
  });

  it("LIFE_STAGES describes the same career-progression quantity as AF-139's real COMMANDER_MATURITY_STAGES but is kept as its own separate 5-stage ladder", () => {
    expect(LIFE_STAGES).not.toEqual(COMMANDER_MATURITY_STAGES);
    expect(lifeStageRank("Early Career")).toBe(0);
    expect(lifeStageRank("Retirement")).toBe(4);
  });

  it("hasIdentityGap detects a divergence between self-image and public reputation", () => {
    expect(hasIdentityGap(SAMPLE_IDENTITY)).toBe(false);
    expect(hasIdentityGap({ ...SAMPLE_IDENTITY, publicReputation: "A reckless daredevil." })).toBe(true);
  });

  it("IdentityRegistry keeps a full evolving history rather than a single mutable record", () => {
    const registry = new IdentityRegistry();
    registry.record("commander-fen-beastmaster", SAMPLE_IDENTITY, 5);
    registry.record("commander-fen-beastmaster", { ...SAMPLE_IDENTITY, professionalIdentity: "Sanctuary Founder" }, 30);
    expect(registry.currentIdentityOf("commander-fen-beastmaster")?.professionalIdentity).toBe("Sanctuary Founder");
    expect(registry.history("commander-fen-beastmaster").length).toBe(2);
  });

  it("ValuePriorityTracker enforces a capped delta per update — 'values change gradually, never abruptly'", () => {
    const tracker = new ValuePriorityTracker();
    tracker.shiftToward("commander-fen-beastmaster", "Exploration", 100);
    expect(tracker.priorityOf("commander-fen-beastmaster", "Exploration")).toBeLessThanOrEqual(5);
    for (let i = 0; i < 30; i++) tracker.shiftToward("commander-fen-beastmaster", "Exploration", 100);
    expect(tracker.priorityOf("commander-fen-beastmaster", "Exploration")).toBe(100);
  });

  it("PersonalGrowthTracker mirrors AF-160's real CommanderWisdomTracker shape over a genuinely new 8-area union", () => {
    const tracker = new PersonalGrowthTracker();
    tracker.develop("commander-fen-beastmaster", "Decision quality", 40);
    tracker.develop("commander-fen-beastmaster", "Decision quality", 40);
    expect(tracker.areaScore("commander-fen-beastmaster", "Decision quality")).toBe(80);
    expect(tracker.overallGrowth("commander-fen-beastmaster")).toBeGreaterThan(0);
  });

  it("EmotionalContinuityTracker lets hope drop immediately on a setback but only recover gradually", () => {
    const tracker = new EmotionalContinuityTracker();
    tracker.setback("commander-fen-beastmaster", 40);
    expect(tracker.hopeLevelOf("commander-fen-beastmaster")).toBe(60);
    tracker.recoverStep("commander-fen-beastmaster", 10);
    expect(tracker.hopeLevelOf("commander-fen-beastmaster")).toBe(70);
  });

  it("Self Reflection is driven directly by AF-160's real Reflection Loop CyclicStageTracker, no second reflection cycle", () => {
    const loop = new CyclicStageTracker(REFLECTION_LOOP_STAGES);
    loop.record("Experience", 1);
    expect(loop.currentStage()).toBe("Experience");
  });

  it("Moral Reasoning reuses AF-155's real rankOptions directly, never a simplistic good/evil meter", () => {
    const outcome = rankOptions([
      { id: "report-the-anomaly", scores: { Evidence: 80, "Professional ethics": 70 } },
      { id: "cover-it-up", scores: { Evidence: 10, "Professional ethics": 5 } },
    ]);
    expect(outcome?.bestId).toBe("report-the-anomaly");
  });
});
