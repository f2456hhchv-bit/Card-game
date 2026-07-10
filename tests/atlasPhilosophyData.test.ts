import { describe, expect, it } from "vitest";
import {
  ACADEMIC_SCHOOLS,
  CIVILISATION_DIALOGUE_PARTICIPANTS,
  INTERDISCIPLINARY_INFLUENCES,
  LEADERSHIP_PHILOSOPHY_TOPICS,
  PHILOSOPHICAL_DOMAINS,
  PHILOSOPHICAL_EVENT_KINDS,
  PHILOSOPHICAL_QUESTIONS,
  PHILOSOPHY_DEVELOPER_TOOLS,
  PLAYER_PHILOSOPHY_DIMENSIONS,
  SCIENTIFIC_PHILOSOPHY_TOPICS,
} from "../src/game/atlasPhilosophy/atlasPhilosophyData";
import { AcademicInfluenceTracker, CommanderBeliefTracker, PhilosophicalEventLog, PlayerPhilosophyObserver } from "../src/game/atlasPhilosophy/AtlasPhilosophyRuntime";
import { WISDOM_DIMENSIONS } from "../src/game/atlasWisdom/atlasWisdomData";
import { CROSS_DISCIPLINARY_PAIRS } from "../src/game/atlasPossibility/atlasPossibilityData";
import { CulturalTrendTracker } from "../src/game/atlasPossibility/AtlasPossibilityRuntime";
import { PlanetaryChronicle } from "../src/game/chronicle/ChronicleRuntime";

describe("The Atlas Philosophy Engine (AF-161)", () => {
  it("registers exactly the spec'd category counts", () => {
    expect(PHILOSOPHICAL_DOMAINS.length).toBe(12);
    expect(PHILOSOPHICAL_QUESTIONS.length).toBe(7);
    expect(CIVILISATION_DIALOGUE_PARTICIPANTS.length).toBe(7);
    expect(ACADEMIC_SCHOOLS.length).toBe(5);
    expect(SCIENTIFIC_PHILOSOPHY_TOPICS.length).toBe(7);
    expect(LEADERSHIP_PHILOSOPHY_TOPICS.length).toBe(7);
    expect(PLAYER_PHILOSOPHY_DIMENSIONS.length).toBe(6);
    expect(PHILOSOPHICAL_EVENT_KINDS.length).toBe(6);
    expect(INTERDISCIPLINARY_INFLUENCES.length).toBe(4);
    expect(PHILOSOPHY_DEVELOPER_TOOLS.length).toBe(6);
  });

  it("PHILOSOPHICAL_DOMAINS shares exactly 3 exact-string members with AF-160's real WISDOM_DIMENSIONS despite the heavy conceptual overlap", () => {
    const exactOverlap = PHILOSOPHICAL_DOMAINS.filter((d) => (WISDOM_DIMENSIONS as readonly string[]).includes(d));
    expect(exactOverlap.sort()).toEqual(["Engineering", "Exploration", "Leadership"]);
  });

  it("INTERDISCIPLINARY_INFLUENCES shares zero exact pairs with AF-159's real symmetric CROSS_DISCIPLINARY_PAIRS, confirming a genuinely different (directional) shape", () => {
    const flatten = (pairs: ReadonlyArray<readonly [string, string]>) => pairs.map(([a, b]) => `${a}|${b}`);
    const overlap = flatten(INTERDISCIPLINARY_INFLUENCES).filter((pair) => flatten(CROSS_DISCIPLINARY_PAIRS).includes(pair));
    expect(overlap.length).toBe(0);
  });

  it("CommanderBeliefTracker keeps a full evolving history rather than overwriting a belief in place, over any real commander id", () => {
    const tracker = new CommanderBeliefTracker();
    tracker.setBelief("commander-fen-beastmaster", "Hope through unity.", 5);
    tracker.setBelief("commander-fen-beastmaster", "Progress through cooperation.", 20);
    expect(tracker.beliefOf("commander-fen-beastmaster")).toBe("Progress through cooperation.");
    expect(tracker.history("commander-fen-beastmaster").length).toBe(2);
  });

  it("AcademicInfluenceTracker tracks which of the 5 real Academic Schools an entity currently adheres to", () => {
    const tracker = new AcademicInfluenceTracker();
    tracker.recordAdherence("settlement-verdance", "Conservation School", 10);
    expect(tracker.schoolOf("settlement-verdance")).toBe("Conservation School");
  });

  it("PlayerPhilosophyObserver exposes only per-dimension tallies, never a combined categorical label", () => {
    const observer = new PlayerPhilosophyObserver();
    observer.observe("Environmental stewardship");
    observer.observe("Environmental stewardship");
    expect(observer.tallyFor("Environmental stewardship")).toBe(2);
    expect(observer.tallyFor("Scientific priorities")).toBe(0);
    expect(observer).not.toHaveProperty("label");
  });

  it("PhilosophicalEventLog is append-only and filterable by kind — 'nothing changes through combat, ideas matter'", () => {
    const log = new PhilosophicalEventLog();
    log.schedule("Museum roundtable", "Historians debate the Verdance excavation findings.", 15);
    expect(log.countFor("Museum roundtable")).toBe(1);
    expect(log.all().length).toBe(1);
  });

  it("Cultural Reflection reuses AF-159's real CulturalTrendTracker directly, no second trend-adoption tracker", () => {
    const tracker = new CulturalTrendTracker();
    tracker.record("Post-Contact Realism", "settlement-verdance", 10);
    expect(tracker.adoptersFor("Post-Contact Realism")).toEqual(["settlement-verdance"]);
  });

  it("Historical Reinterpretation reuses AF-135's real PlanetaryChronicle/EvolvingEntry directly — depth, not contradiction", () => {
    const chronicle = new PlanetaryChronicle();
    chronicle.write("settlement-verdance", "First contact records were incomplete.", 5, "Scientists");
    chronicle.write("settlement-verdance", "New evidence clarifies the First Contact timeline.", 30, "Military historians");
    expect(chronicle.entryFor("settlement-verdance").allVersions().length).toBe(2);
  });
});
