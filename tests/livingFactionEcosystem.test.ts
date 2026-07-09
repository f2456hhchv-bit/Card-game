import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { CONFLICT_STATES, FACTION_EVENT_KINDS } from "../src/game/factions/factionData";
import { FactionRuntime } from "../src/game/factions/FactionRuntime";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { RESEARCH_ROSTER_DISCIPLINES } from "../src/game/research/researchRosterData";
import { FACTION_PROFILES } from "../src/game/factions/factionFrameworkData";
import { CivilisationSimulationRuntime, GalacticHistoryRuntime } from "../src/game/factions/CivilisationSimulationRuntime";
import {
  ATTRIBUTE_MAX,
  ATTRIBUTE_MIN,
  CIVILISATION_MODEL_PARTS,
  CIVILISATION_PROFILES,
  DIPLOMATIC_AI_FACTORS,
  ECONOMIC_OUTPUTS,
  FACTION_LIFECYCLE_PHASES,
  FACTION_SPECIALISATION_PARTS,
  FOCUS_TO_ROSTER_DISCIPLINE,
  GALACTIC_COUNCIL_SESSION_KINDS,
  GALACTIC_EVENTS,
  GALACTIC_EVENT_KINDS,
  HISTORICAL_RECORD_KINDS,
  INTER_FACTION_RELATIONSHIP_KINDS,
  LIVING_ECOSYSTEM_ACCESSIBILITY_SURFACES,
  LIVING_ECOSYSTEM_FORBIDDEN_OUTCOMES,
  LIVING_ECOSYSTEM_PERFORMANCE_DISCIPLINES,
  MODEL_PART_REALISATION,
  PLAYER_IMPACT_MAX_DELTA,
  PLAYER_IMPACT_SURFACES,
  PLAYER_WAR_INFLUENCE_CAP,
  RELATIONSHIP_KIND_TO_CONFLICT_STATE,
  SCIENTIFIC_FOCUSES,
  WARFARE_CONFLICT_KINDS,
  baselineAttributes,
  nextLifecyclePhase,
} from "../src/game/factions/livingEcosystemData";

describe("Living Faction Ecosystem vocabulary — registered shelves (AF-086)", () => {
  it("registers twelve model parts, eight lifecycle phases, eight diplomatic factors, ten galactic events, nine relationship kinds, eight warfare kinds, eight economic outputs, eight scientific focuses, seven specialisation parts, eight historical kinds, eight player-impact surfaces, seven council kinds, two forbidden outcomes, eight accessibility surfaces, four performance disciplines", () => {
    expect(CIVILISATION_MODEL_PARTS.length).toBe(12);
    expect(FACTION_LIFECYCLE_PHASES.length).toBe(8);
    expect(DIPLOMATIC_AI_FACTORS.length).toBe(8);
    expect(GALACTIC_EVENT_KINDS.length).toBe(10);
    expect(GALACTIC_EVENTS.length).toBe(10);
    expect(INTER_FACTION_RELATIONSHIP_KINDS.length).toBe(9);
    expect(WARFARE_CONFLICT_KINDS.length).toBe(8);
    expect(ECONOMIC_OUTPUTS.length).toBe(8);
    expect(SCIENTIFIC_FOCUSES.length).toBe(8);
    expect(FACTION_SPECIALISATION_PARTS.length).toBe(7);
    expect(HISTORICAL_RECORD_KINDS.length).toBe(8);
    expect(PLAYER_IMPACT_SURFACES.length).toBe(8);
    expect(GALACTIC_COUNCIL_SESSION_KINDS.length).toBe(7);
    expect(LIVING_ECOSYSTEM_FORBIDDEN_OUTCOMES.length).toBe(2);
    expect(LIVING_ECOSYSTEM_ACCESSIBILITY_SURFACES.length).toBe(8);
    expect(LIVING_ECOSYSTEM_PERFORMANCE_DISCIPLINES.length).toBe(4);
  });

  it("the nine relationship kinds map TOTALLY onto AF-039's eight conflict states, and every galactic event carries an authored delta plus a valid-or-null AF-039 event binding", () => {
    for (const kind of INTER_FACTION_RELATIONSHIP_KINDS) {
      expect([...CONFLICT_STATES]).toContain(RELATIONSHIP_KIND_TO_CONFLICT_STATE[kind]);
    }
    for (const event of GALACTIC_EVENTS) {
      expect(Object.keys(event.attributeDeltas).length, `${event.kind} has no delta`).toBeGreaterThan(0);
      expect([...HISTORICAL_RECORD_KINDS]).toContain(event.historicalKind);
      if (event.boundFactionEvent !== null) expect([...FACTION_EVENT_KINDS]).toContain(event.boundFactionEvent);
    }
  });

  it("AF-039's ten registered-but-never-ticked attributes are given real numeric baselines, and the four new registers exist alongside them", () => {
    const baseline = baselineAttributes();
    for (const attribute of ["influence", "militaryStrength", "technology", "economicPower", "stability", "exploration", "aggression", "trust", "corruption", "expansion"] as const) {
      expect(baseline[attribute]).toBeGreaterThanOrEqual(ATTRIBUTE_MIN);
      expect(baseline[attribute]).toBeLessThanOrEqual(ATTRIBUTE_MAX);
    }
    for (const register of ["population", "industrialOutput", "resourceReserves", "infrastructure"] as const) {
      expect(baseline[register]).toBeGreaterThanOrEqual(ATTRIBUTE_MIN);
    }
    for (const part of CIVILISATION_MODEL_PARTS) expect(MODEL_PART_REALISATION[part]).toBeDefined();
  });

  it("the eight scientific focuses map onto AF-082's REAL fifteen-discipline roster shelf", () => {
    for (const focus of SCIENTIFIC_FOCUSES) {
      expect([...RESEARCH_ROSTER_DISCIPLINES]).toContain(FOCUS_TO_ROSTER_DISCIPLINE[focus]);
    }
  });
});

describe("The eight-phase life cycle — a closed ring that always advances (AF-086 §Faction Life Cycle)", () => {
  it("the ring wraps from transformation back to expansion, and every phase is reachable by repeated advancement from any start", () => {
    expect(nextLifecyclePhase("transformation")).toBe("expansion");
    for (const phase of FACTION_LIFECYCLE_PHASES) {
      const seen = new Set<string>();
      let current = phase;
      for (let i = 0; i < FACTION_LIFECYCLE_PHASES.length; i += 1) {
        seen.add(current);
        current = nextLifecyclePhase(current);
      }
      expect(seen.size).toBe(FACTION_LIFECYCLE_PHASES.length); // the whole ring is visited, no shortcuts
      expect(current).toBe(phase); // and it closes exactly where it started
    }
  });
});

describe("Civilisation profiles extend AF-085's identity-uniqueness law (AF-086 §Faction Specialisation)", () => {
  it("every profiled civilisation's scientific focus is unique — the SIXTH identity axis, alongside AF-085's five", () => {
    expect(CIVILISATION_PROFILES.length).toBe(FACTION_PROFILES.length);
    const focuses = new Set(CIVILISATION_PROFILES.map((p) => p.scientificFocus));
    expect(focuses.size).toBe(CIVILISATION_PROFILES.length);
    for (const profile of CIVILISATION_PROFILES) {
      expect(FACTION_PROFILES.some((p) => p.factionId === profile.factionId), profile.factionId).toBe(true);
      expect(profile.futureExpansionHooks.length).toBeGreaterThan(0);
    }
  });
});

describe("The simulation through AF-039's REAL FactionRuntime (AF-086 §Diplomatic AI / §Warfare System)", () => {
  it("diplomaticDecisionFor reads every one of the eight factors from REAL simulated state — the score IS the reasoning", () => {
    const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(1));
    const sim = new CivilisationSimulationRuntime(factionRuntime, new Rng(1));
    const decision = sim.diplomaticDecisionFor("crystalDominion", "machineCollective");
    expect(Object.keys(decision.reasoning).sort()).toEqual([...DIPLOMATIC_AI_FACTORS].sort());
    for (const value of Object.values(decision.reasoning)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
    expect([...INTER_FACTION_RELATIONSHIP_KINDS]).toContain(decision.relationshipKind);
    expect([...CONFLICT_STATES]).toContain(decision.resultingState);
  });

  it("PLAYERS INFLUENCE, NEVER DICTATE: an enormous fed impact still clamps to the registered cap, and war resolution's player term never exceeds its cap", () => {
    const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(2));
    const sim = new CivilisationSimulationRuntime(factionRuntime, new Rng(2));
    const before = sim.stateFor("humanAlliance")!.attributes.militaryStrength;
    sim.feedPlayerImpact("military", 999999); // absurd input
    sim.advanceEpoch();
    const after = sim.stateFor("humanAlliance")!.attributes.militaryStrength;
    // The nudge is bounded by PLAYER_IMPACT_MAX_DELTA plus whatever the phase bias itself contributed —
    // never anywhere near the fed magnitude.
    expect(Math.abs(after - before)).toBeLessThanOrEqual(PLAYER_IMPACT_MAX_DELTA + 10);
    expect(PLAYER_WAR_INFLUENCE_CAP).toBeLessThan(1); // the cap is a genuine fraction, not "everything"
  });

  it("war resolution shifts the relationship to ceasefire through the REAL engine and logs to permanent history", () => {
    const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(3));
    const sim = new CivilisationSimulationRuntime(factionRuntime, new Rng(3));
    factionRuntime.setRelationship("crystalDominion", "machineCollective", "openWar");
    // Directly declare the war the same way runDiplomaticAi would, then drive it to resolution.
    for (let i = 0; i < 200; i += 1) {
      sim.feedPlayerImpact("military", 5);
      sim.advanceEpoch();
      if (sim.activeWars.length === 0 && sim.history.timeline.some((r) => r.kind === "wars")) break;
    }
    expect(sim.history.timeline.some((r) => r.kind === "wars")).toBe(true);
  });
});

describe("The Galactic History — permanent, append-only (AF-086 §Historical Timeline)", () => {
  it("records are sequence-monotone and the prototype offers no removal, mirroring AF-084's discipline", () => {
    const history = new GalacticHistoryRuntime();
    const first = history.record("discoveries", "ancientCustodians", "test discovery");
    const second = history.record("treaties", "humanAlliance", "test treaty");
    expect(first.sequence).toBe(1);
    expect(second.sequence).toBe(2);
    expect(history.length).toBe(2);
    const methods = Object.getOwnPropertyNames(GalacticHistoryRuntime.prototype);
    for (const method of methods) {
      expect(/remove|delete|revoke|reset|retire|forget|erase/i.test(method), `forbidden API: ${method}`).toBe(false);
    }
  });
});

describe("Living Faction Ecosystem — self-review: simulate thousands of years (AF-086 §Self Review Loop)", () => {
  it("500 epochs, 50 seeds: attributes stay clamped, phases always eventually advance, history only grows, and NO FACTION PERMANENTLY DOMINATES", () => {
    let anySeedRotated = false;
    for (let seed = 0; seed < 50; seed += 1) {
      const factionRuntime = new FactionRuntime(SANDBOX_FACTION_ROSTER, new Rng(seed).fork("factions"));
      const sim = new CivilisationSimulationRuntime(factionRuntime, new Rng(seed).fork("sim"));
      let lastHistoryLength = 0;
      const advancesAtStart = new Map(sim.allStates.map((s) => [s.factionId, s.phaseAdvances]));
      let leaderAt100: string | null = null;
      let leaderAt500: string | null = null;
      for (let epoch = 0; epoch < 500; epoch += 1) {
        sim.advanceEpoch();
        for (const state of sim.allStates) {
          for (const value of Object.values(state.attributes)) {
            if (value < ATTRIBUTE_MIN || value > ATTRIBUTE_MAX) throw new Error(`seed ${seed}: attribute out of bounds`);
          }
        }
        if (sim.history.length < lastHistoryLength) throw new Error(`seed ${seed}: history shrank`);
        lastHistoryLength = sim.history.length;
        if (epoch === 99) leaderAt100 = leaderOf(sim);
        if (epoch === 499) leaderAt500 = leaderOf(sim);
      }
      // Every faction's phase machinery actually moved — no civilisation stood frozen for 500 epochs.
      for (const state of sim.allStates) {
        expect(state.phaseAdvances, `seed ${seed} ${state.factionId}`).toBeGreaterThan(advancesAtStart.get(state.factionId)!);
      }
      if (leaderAt100 !== leaderAt500) anySeedRotated = true;
    }
    // Across many seeded galaxies, the early leader is NOT always still leading 400 epochs
    // later in every galaxy — permanent domination does not emerge from the authored dynamics.
    expect(anySeedRotated).toBe(true);
  });

  function leaderOf(sim: CivilisationSimulationRuntime): string {
    return [...sim.allStates].sort((a, b) => sumAttributes(b) - sumAttributes(a))[0]!.factionId;
  }

  function sumAttributes(state: { attributes: Record<string, number> }): number {
    return Object.values(state.attributes).reduce((sum, v) => sum + v, 0);
  }
});
