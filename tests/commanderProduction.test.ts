import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";
import { LAUNCH_ROSTER } from "../src/game/commanders/rosterData";
import {
  COMMANDER_ACCESSIBILITY_LIVE,
  COMMANDER_ACCESSIBILITY_SURFACES,
  COMMANDER_DESIGN_STANDARDS,
  COMMANDER_PERFORMANCE_DISCIPLINES,
  COMMANDER_PERFORMANCE_LIVE,
  COMMANDER_PRODUCTION_PIPELINE_STAGES,
  COMMANDER_RELATIONSHIP_COVERAGE,
  COMMANDER_TEMPLATE_FIELDS,
  COMMANDER_TEMPLATE_REALISATION,
  DIALOGUE_TRIGGER_CATEGORIES,
  MASTERY_FEATURES,
  MASTERY_FEATURE_REALISATION,
  PERSONALITY_TRAITS,
  RECRUITMENT_METHODS,
  RECRUITMENT_METHOD_REALISATION,
  ROSTER_DIVERSITY_AXES,
  ROSTER_DIVERSITY_PROVEN,
  commanderTemplateCoverageSummary,
  dialogueLibraryStatusSummary,
  masteryFeaturesLiveSummary,
  nextCommanderProductionStage,
  personalityFrameworkSummary,
  personalityShapeFields,
  recruitmentMethodLiveSummary,
  relationshipCoverageSummary,
  type PersonalityDialogueHint,
} from "../src/game/commanders/commanderProductionData";

describe("Commander Production Framework vocabulary (AF-098)", () => {
  it("registers a 14-stage pipeline, 37 template fields, 10 design standards, 10 diversity axes, 12 personality traits, 8 recruitment methods, 12 dialogue categories, 7 mastery features, 8 accessibility surfaces, 4 performance disciplines", () => {
    expect(COMMANDER_PRODUCTION_PIPELINE_STAGES.length).toBe(14);
    expect(COMMANDER_TEMPLATE_FIELDS.length).toBe(37);
    expect(COMMANDER_DESIGN_STANDARDS.length).toBe(10);
    expect(ROSTER_DIVERSITY_AXES.length).toBe(10);
    expect(PERSONALITY_TRAITS.length).toBe(12);
    expect(RECRUITMENT_METHODS.length).toBe(8);
    expect(DIALOGUE_TRIGGER_CATEGORIES.length).toBe(12);
    expect(MASTERY_FEATURES.length).toBe(7);
    expect(COMMANDER_ACCESSIBILITY_SURFACES.length).toBe(8);
    expect(COMMANDER_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("the production pipeline is LINEAR — every stage advances to exactly one successor, the last advances to null, no cycling", () => {
    for (let i = 0; i < COMMANDER_PRODUCTION_PIPELINE_STAGES.length - 1; i += 1) {
      expect(nextCommanderProductionStage(COMMANDER_PRODUCTION_PIPELINE_STAGES[i]!)).toBe(COMMANDER_PRODUCTION_PIPELINE_STAGES[i + 1]);
    }
    expect(nextCommanderProductionStage(COMMANDER_PRODUCTION_PIPELINE_STAGES[COMMANDER_PRODUCTION_PIPELINE_STAGES.length - 1]!)).toBeNull();
  });

  it("21 of 37 template fields already have a real home; 16 are honestly new (shape only, no per-commander content yet)", () => {
    expect(commanderTemplateCoverageSummary()).toBe("template 21/37");
    for (const field of ["age", "species", "homeworld", "dialogueLibrary", "endingStory"] as const) expect(COMMANDER_TEMPLATE_REALISATION[field].kind).toBe("future");
  });
});

describe("Personality Framework is dialogue-only BY SHAPE (AF-098 §Personality Framework)", () => {
  it("PersonalityDialogueHint carries no bonus field — a stat-bearing personality is structurally unrepresentable, mirroring CommanderRelationshipDef's own law", () => {
    const hint: PersonalityDialogueHint = { trait: "haunted", dialogueHint: "Speaks rarely of the colony he couldn't save." };
    expect(personalityShapeFields(hint)).toEqual(["dialogueHint", "trait"]);
    expect(personalityFrameworkSummary()).toBe("12 personality traits (dialogue-only, never balance)");
  });
});

describe("Roster Diversity — only what's already provable across the real 14-commander roster (AF-098 §Roster Diversity)", () => {
  it("combatRole and factionHistory are proven; the other 8 axes have no roster-wide content yet", () => {
    expect(LAUNCH_ROSTER.length).toBe(14);
    expect(ROSTER_DIVERSITY_PROVEN.combatRole).toBe(true);
    expect(ROSTER_DIVERSITY_PROVEN.factionHistory).toBe(true);
    const provenCount = Object.values(ROSTER_DIVERSITY_PROVEN).filter(Boolean).length;
    expect(provenCount).toBe(2);
    expect(ROSTER_DIVERSITY_AXES.length - provenCount).toBe(8);
  });
});

describe("Recruitment/Mastery/Accessibility/Performance delegate to real registries (AF-098)", () => {
  it("7 of 8 recruitment methods realise onto AF-072's real RECRUITMENT_SOURCES; only ancientDiscovery is future", () => {
    expect(recruitmentMethodLiveSummary()).toBe("recruitment 7/8");
    expect(RECRUITMENT_METHOD_REALISATION.ancientDiscovery.kind).toBe("future");
  });

  it("5 of 7 mastery features delegate to real AF-026/072/088 mechanisms; uniqueChallenges and titles are future", () => {
    expect(masteryFeaturesLiveSummary()).toBe("mastery 5/7");
    let existing = 0;
    for (const feature of MASTERY_FEATURES) if (MASTERY_FEATURE_REALISATION[feature].kind === "existing") existing += 1;
    expect(existing).toBe(5);
  });

  it("2 of 8 accessibility surfaces live (controller nav, colour-blind); 1 of 4 performance disciplines live (voice pooling)", () => {
    expect(Object.values(COMMANDER_ACCESSIBILITY_LIVE).filter(Boolean).length).toBe(2);
    expect(COMMANDER_ACCESSIBILITY_LIVE.controllerNavigation).toBe(true);
    expect(COMMANDER_ACCESSIBILITY_LIVE.colourBlindSupport).toBe(true);
    expect(Object.values(COMMANDER_PERFORMANCE_LIVE).filter(Boolean).length).toBe(1);
    expect(COMMANDER_PERFORMANCE_LIVE.poolVoices).toBe(true);
  });

  it("dialogue is honestly 0/12 — no dialogue system exists anywhere", () => {
    expect(dialogueLibraryStatusSummary()).toBe("dialogue 0/12 (no dialogue system yet)");
  });
});

describe("Codex/relationship coverage matches the real roster exactly (AF-098)", () => {
  it("exactly 1 of the real Codex entries is a commander entry, matching the cited honest gap", () => {
    const commanderEntries = SANDBOX_CODEX_ENTRIES.filter((entry) => entry.id.startsWith("codex-commander-"));
    expect(commanderEntries.length).toBe(1);
    expect(commanderEntries[0]!.id).toBe("codex-commander-reyes");
  });

  it("relationshipCoverageSummary cites the real 3/14 split", () => {
    expect(COMMANDER_RELATIONSHIP_COVERAGE.rosterSize).toBe(LAUNCH_ROSTER.length);
    expect(relationshipCoverageSummary()).toBe("relationships 3/14 commanders");
  });
});

describe("Commander Production Framework — self-review (AF-098 §Self Review Loop)", () => {
  it("150 seeded rounds: walking the pipeline from any starting stage always reaches productionLock, never cycling", () => {
    for (let seed = 0; seed < 150; seed += 1) {
      const rng = new Rng(seed);
      const startIndex = Math.floor(rng.next() * COMMANDER_PRODUCTION_PIPELINE_STAGES.length);
      let stage = COMMANDER_PRODUCTION_PIPELINE_STAGES[startIndex]!;
      const visited = new Set<string>([stage]);
      let steps = 0;
      while (stage !== "productionLock" && steps <= COMMANDER_PRODUCTION_PIPELINE_STAGES.length) {
        const next = nextCommanderProductionStage(stage);
        if (next === null) throw new Error(`seed ${seed}: pipeline stalled at ${stage}`);
        if (visited.has(next)) throw new Error(`seed ${seed}: pipeline cycled back to ${next}`);
        visited.add(next);
        stage = next;
        steps += 1;
      }
      if (stage !== "productionLock") throw new Error(`seed ${seed}: pipeline never reached productionLock`);
    }
  });
});
