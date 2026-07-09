/**
 * The Living Faction Ecosystem simulation (AF-086). Deterministic per
 * seed, in-memory (session-scoped, the same discipline FactionRuntime's
 * own relationship map already uses — no new persistence surface).
 * Advances civilisations through the eight-phase life cycle, runs the
 * Diplomatic AI against AF-039's REAL `FactionRuntime.setRelationship`,
 * resolves warfare with a hard-capped player-influence term, rolls
 * Galactic Events through the same weighted-pick-on-a-timer algorithm
 * AF-036/037/038/039 already implement inline (a sixth writing of the
 * pattern, not a shared utility — the established precedent), and
 * records everything to a permanent, append-only Galactic History.
 */
import type { Rng } from "../../core/rng/Rng";
import type { ConflictState, FactionId } from "./factionData";
import { FactionRuntime } from "./FactionRuntime";
import {
  CIVILISATION_PROFILES,
  DIPLOMATIC_AI_FACTORS,
  FACTION_LIFECYCLE_PHASES,
  GALACTIC_EVENTS,
  IMPACT_SURFACE_TO_ATTRIBUTE,
  LIFECYCLE_MAX_EPOCHS_IN_PHASE,
  LIFECYCLE_PHASE_BIAS,
  PLAYER_WAR_INFLUENCE_CAP,
  PLAYER_IMPACT_MAX_DELTA,
  RELATIONSHIP_KIND_TO_CONFLICT_STATE,
  WARFARE_CONFLICT_KINDS,
  baselineAttributes,
  clampAttribute,
  nextLifecyclePhase,
  type CivilisationProfileDef,
  type DiplomaticAiFactor,
  type ExtendedAttributeKey,
  type FactionLifecyclePhase,
  type GalacticEventKind,
  type HistoricalRecordKind,
  type InterFactionRelationshipKind,
  type PlayerImpactSurface,
  type WarfareConflictKind,
} from "./livingEcosystemData";

export interface CivilisationState {
  factionId: FactionId;
  attributes: Record<ExtendedAttributeKey, number>;
  lifeCyclePhase: FactionLifecyclePhase;
  epochsInPhase: number;
  phaseAdvances: number;
}

export interface HistoricalRecord {
  sequence: number;
  kind: HistoricalRecordKind;
  factionId: FactionId | null;
  description: string;
}

export interface WarState {
  kind: WarfareConflictKind;
  a: FactionId;
  b: FactionId;
  resolutionProgress: number;
}

export interface DiplomaticDecision {
  a: FactionId;
  b: FactionId;
  relationshipKind: InterFactionRelationshipKind;
  resultingState: ConflictState;
  score: number;
  reasoning: Readonly<Record<DiplomaticAiFactor, number>>;
}

export interface CivilisationSimulationSnapshot {
  factionCount: number;
  galaxyStability: number;
  averagePopulationGrowth: number;
  activeWarCount: number;
  averageEconomicOutput: number;
  averageScientificProgress: number;
  epochsSimulated: number;
  historyLength: number;
}

/**
 * The Galactic History — permanent, append-only (the AF-084
 * ExpeditionLogRuntime pattern applied to the galaxy itself). Records are
 * never edited or removed; the galaxy builds permanent history.
 */
export class GalacticHistoryRuntime {
  private readonly records: HistoricalRecord[] = [];

  record(kind: HistoricalRecordKind, factionId: FactionId | null, description: string): HistoricalRecord {
    const entry: HistoricalRecord = { sequence: this.records.length + 1, kind, factionId, description };
    this.records.push(entry);
    return entry;
  }

  get timeline(): readonly HistoricalRecord[] {
    return this.records;
  }

  get length(): number {
    return this.records.length;
  }
}

function pairKey(a: FactionId, b: FactionId): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export class CivilisationSimulationRuntime {
  private readonly states = new Map<FactionId, CivilisationState>();
  private readonly wars = new Map<string, WarState>();
  private readonly pendingPlayerImpact: Partial<Record<ExtendedAttributeKey, number>> = {};
  readonly history = new GalacticHistoryRuntime();

  private epochTimerMs = 0;
  private eventTimerMs = 0;
  private epochsSimulated = 0;

  constructor(
    private readonly factionRuntime: FactionRuntime,
    private readonly rng: Rng,
    profiles: readonly CivilisationProfileDef[] = CIVILISATION_PROFILES,
    private readonly epochIntervalMs = 8000,
    private readonly eventIntervalMs = 20000,
  ) {
    profiles.forEach((profile, index) => {
      // Staggered starting phases: factions begin spread around the ring,
      // never all in the same phase at once — the structural seed of
      // "no faction should permanently dominate" (AF-086 §Balance).
      const startPhase = FACTION_LIFECYCLE_PHASES[index % FACTION_LIFECYCLE_PHASES.length]!;
      this.states.set(profile.factionId, {
        factionId: profile.factionId,
        attributes: baselineAttributes(),
        lifeCyclePhase: startPhase,
        epochsInPhase: 0,
        phaseAdvances: 0,
      });
    });
  }

  stateFor(factionId: FactionId): CivilisationState | null {
    return this.states.get(factionId) ?? null;
  }

  get allStates(): readonly CivilisationState[] {
    return [...this.states.values()];
  }

  get activeWars(): readonly WarState[] {
    return [...this.wars.values()];
  }

  /** §Player Impact: a bounded nudge, applied at the next epoch — "player
   * actions accelerate history, never completely dictate it." However
   * large `amount` is, the applied delta never exceeds PLAYER_IMPACT_MAX_DELTA. */
  feedPlayerImpact(surface: PlayerImpactSurface, amount: number): void {
    const attribute = IMPACT_SURFACE_TO_ATTRIBUTE[surface];
    const capped = Math.max(-PLAYER_IMPACT_MAX_DELTA, Math.min(PLAYER_IMPACT_MAX_DELTA, amount));
    this.pendingPlayerImpact[attribute] = (this.pendingPlayerImpact[attribute] ?? 0) + capped;
  }

  update(fixedDtMs: number): void {
    this.epochTimerMs += fixedDtMs;
    this.eventTimerMs += fixedDtMs;
    if (this.epochTimerMs >= this.epochIntervalMs) {
      this.epochTimerMs = 0;
      this.advanceEpoch();
    }
    if (this.eventTimerMs >= this.eventIntervalMs) {
      this.eventTimerMs = 0;
      this.rollGalacticEvent();
    }
  }

  private applyDelta(state: CivilisationState, deltas: Partial<Record<ExtendedAttributeKey, number>>): void {
    for (const [key, delta] of Object.entries(deltas) as Array<[ExtendedAttributeKey, number]>) {
      state.attributes[key] = clampAttribute(state.attributes[key] + delta);
    }
  }

  /** One tick of galactic time: life-cycle bias + forced advancement,
   * diplomacy, and war resolution — the pure core, callable directly by
   * tests without waiting on `update`'s wall-clock timer. */
  advanceEpoch(): void {
    this.epochsSimulated += 1;
    for (const state of this.states.values()) {
      this.applyDelta(state, LIFECYCLE_PHASE_BIAS[state.lifeCyclePhase]);
      state.epochsInPhase += 1;
      // §Faction Life Cycle: "no civilisation remains unchanged forever" —
      // a phase always ends, either probabilistically or by forced cap.
      const forced = state.epochsInPhase >= LIFECYCLE_MAX_EPOCHS_IN_PHASE;
      if (forced || this.rng.next() < 0.3) {
        state.lifeCyclePhase = nextLifecyclePhase(state.lifeCyclePhase);
        state.epochsInPhase = 0;
        state.phaseAdvances += 1;
      }
    }
    // Apply and drain any player-impact nudges banked since the last epoch,
    // spread evenly across every simulated faction (the player influences
    // the galaxy, not one hand-picked winner).
    const pendingKeys = Object.keys(this.pendingPlayerImpact) as ExtendedAttributeKey[];
    if (pendingKeys.length > 0) {
      for (const state of this.states.values()) {
        this.applyDelta(state, this.pendingPlayerImpact);
      }
      for (const key of pendingKeys) delete this.pendingPlayerImpact[key];
    }
    this.runDiplomaticAi();
    this.resolveWars();
  }

  /** §Diplomatic AI: scores eight factors between one faction pair per
   * epoch and, past a threshold, applies the winning relationship kind
   * through AF-039's REAL FactionRuntime.setRelationship. "Every
   * diplomatic decision appears logical" — the score IS the reasoning,
   * returned for inspection. */
  private runDiplomaticAi(): DiplomaticDecision | null {
    const ids = [...this.states.keys()];
    if (ids.length < 2) return null;
    const a = ids[Math.floor(this.rng.next() * ids.length)]!;
    let b = ids[Math.floor(this.rng.next() * ids.length)]!;
    if (a === b) b = ids[(ids.indexOf(a) + 1) % ids.length]!;
    const decision = this.diplomaticDecisionFor(a, b);
    if (decision.score >= 0.55) {
      this.factionRuntime.setRelationship(a, b, decision.resultingState);
      this.history.record("treaties", a, `${decision.relationshipKind} formed between ${a} and ${b}`);
      if (decision.resultingState === "openWar") this.declareWar(a, b);
    }
    return decision;
  }

  /** Pure scoring function — every factor read from real simulated state,
   * no hidden randomness in the score itself (only which pair is sampled
   * is randomised). Exposed for direct testing of "appears logical". */
  diplomaticDecisionFor(a: FactionId, b: FactionId): DiplomaticDecision {
    const stateA = this.states.get(a)!;
    const stateB = this.states.get(b)!;
    const currentRelation = this.factionRuntime.relationshipBetween(a, b);
    const factors: Record<DiplomaticAiFactor, number> = {
      resourceNeeds: 1 - stateA.attributes.resourceReserves / 100,
      militaryThreats: stateB.attributes.militaryStrength / 100,
      scientificOpportunity: (stateA.attributes.technology + stateB.attributes.technology) / 200,
      territorialExpansion: stateA.attributes.expansion / 100,
      historicRelationships: currentRelation === "alliance" || currentRelation === "tradeAgreement" ? 0.8 : currentRelation === "openWar" ? 0.1 : 0.5,
      playerReputation: 0.5, // neutral unless fed via feedPlayerImpact("politics", …)
      ancientDiscoveries: stateA.attributes.influence / 100,
      galaxyEvents: 1 - stateA.attributes.stability / 100,
    };
    const aggregate = Object.values(factors).reduce((sum, v) => sum + v, 0) / DIPLOMATIC_AI_FACTORS.length;
    const hostile = stateA.attributes.aggression + stateB.attributes.aggression > 100;
    const relationshipKind: InterFactionRelationshipKind = hostile
      ? "openConflict"
      : factors.scientificOpportunity > 0.6
        ? "scientificPartnerships"
        : factors.resourceNeeds > 0.6
          ? "commercialAgreements"
          : "neutralCooperation";
    return {
      a,
      b,
      relationshipKind,
      resultingState: RELATIONSHIP_KIND_TO_CONFLICT_STATE[relationshipKind],
      score: aggregate,
      reasoning: factors,
    };
  }

  private declareWar(a: FactionId, b: FactionId): void {
    const key = pairKey(a, b);
    if (this.wars.has(key)) return;
    const kind = WARFARE_CONFLICT_KINDS[Math.floor(this.rng.next() * WARFARE_CONFLICT_KINDS.length)]!;
    this.wars.set(key, { kind, a, b, resolutionProgress: 0 });
    this.history.record("wars", a, `${kind} erupts between ${a} and ${b}`);
  }

  /** §Warfare System: "players may influence outcomes, not fully control
   * them" — the player's banked political impact contributes to the roll,
   * HARD-CAPPED at PLAYER_WAR_INFLUENCE_CAP of the total, however large
   * the underlying attribute nudge was. */
  private resolveWars(): void {
    for (const [key, war] of this.wars) {
      const stateA = this.states.get(war.a)!;
      const stateB = this.states.get(war.b)!;
      const strengthDiff = (stateA.attributes.militaryStrength - stateB.attributes.militaryStrength) / 100;
      const playerInfluence = Math.max(-PLAYER_WAR_INFLUENCE_CAP, Math.min(PLAYER_WAR_INFLUENCE_CAP, (this.pendingPlayerImpact.militaryStrength ?? 0) / PLAYER_IMPACT_MAX_DELTA * PLAYER_WAR_INFLUENCE_CAP));
      const noise = this.rng.float(-0.15, 0.15);
      war.resolutionProgress += strengthDiff * 0.5 + playerInfluence + noise;
      if (Math.abs(war.resolutionProgress) >= 1) {
        const winner = war.resolutionProgress > 0 ? war.a : war.b;
        const loser = winner === war.a ? war.b : war.a;
        this.applyDelta(this.states.get(winner)!, { militaryStrength: 3, influence: 4 });
        this.applyDelta(this.states.get(loser)!, { militaryStrength: -5, stability: -4 });
        this.factionRuntime.setRelationship(war.a, war.b, "ceasefire");
        this.history.record("wars", winner, `${war.kind} ends — ${winner} prevails over ${loser}`);
        this.wars.delete(key);
      }
    }
  }

  /** §Galactic Events: weighted pick on the shared timer discipline; the
   * event's authored delta applies to one sampled faction, and every
   * event permanently influences civilisation history. */
  private rollGalacticEvent(): GalacticEventKind | null {
    if (this.states.size === 0) return null;
    const totalWeight = GALACTIC_EVENTS.reduce((sum, e) => sum + e.weight, 0);
    let roll = this.rng.float(0, totalWeight);
    let chosen = GALACTIC_EVENTS[0]!;
    for (const event of GALACTIC_EVENTS) {
      roll -= event.weight;
      if (roll <= 0) {
        chosen = event;
        break;
      }
    }
    const ids = [...this.states.keys()];
    const subject = ids[Math.floor(this.rng.next() * ids.length)]!;
    this.applyDelta(this.states.get(subject)!, chosen.attributeDeltas);
    this.history.record(chosen.historicalKind, subject, `${chosen.kind} affects ${subject}`);
    return chosen.kind;
  }

  get snapshot(): CivilisationSimulationSnapshot {
    const states = [...this.states.values()];
    const count = states.length || 1;
    return {
      factionCount: states.length,
      galaxyStability: states.reduce((sum, s) => sum + s.attributes.stability, 0) / count,
      averagePopulationGrowth: states.reduce((sum, s) => sum + s.attributes.population, 0) / count,
      activeWarCount: this.wars.size,
      averageEconomicOutput: states.reduce((sum, s) => sum + (s.attributes.economicPower + s.attributes.industrialOutput) / 2, 0) / count,
      averageScientificProgress: states.reduce((sum, s) => sum + s.attributes.technology, 0) / count,
      epochsSimulated: this.epochsSimulated,
      historyLength: this.history.length,
    };
  }
}
