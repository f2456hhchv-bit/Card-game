import { describe, expect, it } from "vitest";
import {
  CIVILISATION_VALUES,
  CIVILISATION_WISDOM_FACTORS,
  COMMANDER_WISDOM_TRAITS,
  CULTURAL_WISDOM_FACTORS,
  ECOLOGICAL_WISDOM_FACTORS,
  ETHICAL_DELIBERATION_QUESTIONS,
  GENERATIONAL_TRANSFER_STAGES,
  HISTORICAL_REFLECTION_EXAMPLES,
  MENTORSHIP_AUDIENCES,
  REFLECTION_LOOP_STAGES,
  SCIENTIFIC_WISDOM_QUESTIONS,
  WISDOM_DEVELOPER_TOOLS,
  WISDOM_DIMENSIONS,
  WISDOM_MEMORY_OUTCOMES,
  WISDOM_SOURCES,
  ethicalDeliberationPassed,
  generationalTransferRank,
  scientificWisdomReviewed,
} from "../src/game/atlasWisdom/atlasWisdomData";
import { CommanderWisdomTracker, MentorshipLedger, WisdomMemoryArchive } from "../src/game/atlasWisdom/AtlasWisdomRuntime";
import { CyclicStageTracker } from "../src/game/atlasIntelligence/AtlasIntelligenceRuntime";
import { PERSONALITY_TRAITS } from "../src/game/commanders/commanderProductionData";
import { COMMANDER_MATURITY_STAGES } from "../src/game/evolutionEngine/evolutionEngineData";

describe("The Atlas Wisdom Engine (AF-160)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(WISDOM_SOURCES.length).toBe(13);
    expect(WISDOM_DIMENSIONS.length).toBe(12);
    expect(COMMANDER_WISDOM_TRAITS.length).toBe(6);
    expect(SCIENTIFIC_WISDOM_QUESTIONS.length).toBe(5);
    expect(CIVILISATION_WISDOM_FACTORS.length).toBe(6);
    expect(ECOLOGICAL_WISDOM_FACTORS.length).toBe(6);
    expect(CULTURAL_WISDOM_FACTORS.length).toBe(7);
    expect(HISTORICAL_REFLECTION_EXAMPLES.length).toBe(6);
    expect(MENTORSHIP_AUDIENCES.length).toBe(5);
    expect(ETHICAL_DELIBERATION_QUESTIONS.length).toBe(5);
    expect(REFLECTION_LOOP_STAGES.length).toBe(6);
    expect(CIVILISATION_VALUES.length).toBe(10);
    expect(GENERATIONAL_TRANSFER_STAGES.length).toBe(5);
    expect(WISDOM_MEMORY_OUTCOMES.length).toBe(6);
    expect(WISDOM_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("COMMANDER_WISDOM_TRAITS shares zero members with AF-030's real PERSONALITY_TRAITS or AF-139's real COMMANDER_MATURITY_STAGES, confirming a genuinely different axis", () => {
    const overlapWithPersonality = COMMANDER_WISDOM_TRAITS.filter((t) => (PERSONALITY_TRAITS as readonly string[]).includes(t));
    const overlapWithMaturity = COMMANDER_WISDOM_TRAITS.filter((t) => (COMMANDER_MATURITY_STAGES as readonly string[]).includes(t));
    expect(overlapWithPersonality.length).toBe(0);
    expect(overlapWithMaturity.length).toBe(0);
  });

  it("scientificWisdomReviewed and ethicalDeliberationPassed are both all-must-pass checklist gates", () => {
    expect(scientificWisdomReviewed(new Set(SCIENTIFIC_WISDOM_QUESTIONS.slice(0, 4)))).toBe(false);
    expect(scientificWisdomReviewed(new Set(SCIENTIFIC_WISDOM_QUESTIONS))).toBe(true);
    expect(ethicalDeliberationPassed(new Set(ETHICAL_DELIBERATION_QUESTIONS.slice(0, 4)))).toBe(false);
    expect(ethicalDeliberationPassed(new Set(ETHICAL_DELIBERATION_QUESTIONS))).toBe(true);
  });

  it("generationalTransferRank orders the linear Knowledge-to-Civilisation escalation ladder", () => {
    expect(generationalTransferRank("Knowledge")).toBe(0);
    expect(generationalTransferRank("Civilisation")).toBe(4);
  });

  it("CommanderWisdomTracker accumulates fine-grained trait scores with lived experience, clamped 0-100, distinct from AF-030's fixed PersonalityTrait", () => {
    const tracker = new CommanderWisdomTracker();
    tracker.develop("commander-fen-beastmaster", "Patience", 40);
    tracker.develop("commander-fen-beastmaster", "Patience", 40);
    tracker.develop("commander-fen-beastmaster", "Patience", 40);
    expect(tracker.traitScore("commander-fen-beastmaster", "Patience")).toBe(100);
    expect(tracker.overallWisdom("commander-fen-beastmaster")).toBeGreaterThan(0);
  });

  it("MentorshipLedger is the first real mentor/mentee relationship ledger in the codebase", () => {
    const ledger = new MentorshipLedger();
    ledger.assign("commander-thorne-starforged", "commander-fen-beastmaster", 15);
    expect(ledger.menteesOf("commander-thorne-starforged")).toEqual(["commander-fen-beastmaster"]);
    expect(ledger.mentorOf("commander-fen-beastmaster")).toBe("commander-thorne-starforged");
  });

  it("WisdomMemoryArchive records which institutions a lesson produced, the fourth mirrored memory-archive shape in this codebase", () => {
    const archive = new WisdomMemoryArchive();
    archive.archive("lesson-verdance-drought", ["Schools", "Public monuments"], 30);
    expect(archive.outcomesFor("lesson-verdance-drought")).toEqual(["Schools", "Public monuments"]);
  });

  it("Reflection Loop progression is driven directly by AF-155's real generic CyclicStageTracker, no new tracker class", () => {
    const loop = new CyclicStageTracker(REFLECTION_LOOP_STAGES);
    loop.record("Experience", 1);
    expect(loop.currentStage()).toBe("Experience");
    expect(loop.next("Improved Judgement")).toBe("Experience");
  });
});
