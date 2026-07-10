/**
 * EvolutionEngineRuntime pieces (AF-139). Every class here composes
 * with real locked state via plain ids/values passed in by the caller
 * (main.ts) rather than importing the source modules directly — the
 * same decoupled-composition discipline AF-137's `tierWeightsFor`
 * established.
 */
import type { CivilisationFrameworkRuntime } from "../civilisation/CivilisationFrameworkRuntime";
import type { MegaprojectTracker } from "../civilisationEngine/CivilisationEngineRuntime";
import { CIVILISATION_MEGAPROJECTS } from "../civilisationEngine/civilisationEngineData";
import { EvolvingEntry, type AuthorVoice } from "../chronicle/chronicleData";
import {
  EQUIPMENT_EVOLUTION_STAGES,
  companionGrowthStageFor,
  type CompanionGrowthStage,
  type EquipmentEvolutionStage,
  type SpeciesAdaptationTrigger,
} from "./evolutionEngineData";

/** "Every equipment family evolves... older equipment becomes museum
 * worthy." Grow-only stage index per equipment family id. */
export class EquipmentEvolutionTracker {
  private readonly stageIndex = new Map<string, number>();

  advance(familyId: string): EquipmentEvolutionStage {
    const current = this.stageIndex.get(familyId) ?? 0;
    const next = Math.min(EQUIPMENT_EVOLUTION_STAGES.length - 1, current + 1);
    this.stageIndex.set(familyId, next);
    return EQUIPMENT_EVOLUTION_STAGES[next]!;
  }

  stageFor(familyId: string): EquipmentEvolutionStage {
    return EQUIPMENT_EVOLUTION_STAGES[this.stageIndex.get(familyId) ?? 0]!;
  }

  isHistoric(familyId: string): boolean {
    return this.stageFor(familyId) === "Historic Masterpiece";
  }
}

export interface ArchitectureLayerRecord {
  settlementId: string;
  stage: string;
  epoch: number;
}

/** "Older architecture remains preserved. Cities tell their own history."
 * Append-only, so every stage a settlement has ever passed through stays
 * inspectable — never collapsed down to just the current stage. */
export class HistoricalArchitectureLedger {
  private readonly records: ArchitectureLayerRecord[] = [];

  record(settlementId: string, stage: string, epoch: number): void {
    const layers = this.layersFor(settlementId);
    if (layers.at(-1) === stage) return; // no duplicate consecutive layers
    this.records.push({ settlementId, stage, epoch });
  }

  layersFor(settlementId: string): readonly string[] {
    return this.records.filter((r) => r.settlementId === settlementId).map((r) => r.stage);
  }

  all(): readonly ArchitectureLayerRecord[] {
    return this.records;
  }
}

export interface SpeciesAdaptationRecord {
  systemId: string;
  speciesId: string;
  trigger: SpeciesAdaptationTrigger;
  behaviour: string;
  sequence: number;
}

/** "Native species adapt... new behaviours appear naturally." A real
 * species/creature-level registry — AF-132's `EnvironmentalRuntime` only
 * tracks one aggregate wildlife number per system, never per-species. */
export class SpeciesAdaptationRegistry {
  private readonly records: SpeciesAdaptationRecord[] = [];

  adapt(systemId: string, speciesId: string, trigger: SpeciesAdaptationTrigger, behaviour: string): SpeciesAdaptationRecord {
    const record: SpeciesAdaptationRecord = { systemId, speciesId, trigger, behaviour, sequence: this.records.length };
    this.records.push(record);
    return record;
  }

  historyFor(systemId: string, speciesId: string): readonly SpeciesAdaptationRecord[] {
    return this.records.filter((r) => r.systemId === systemId && r.speciesId === speciesId);
  }

  all(): readonly SpeciesAdaptationRecord[] {
    return this.records;
  }
}

export interface CompanionEvolutionState {
  growth: number;
  behaviours: string[];
  traits: string[];
}

/** "Companions grow, learn, breed, develop personalities... long-lived
 * companions become legends." Keyed by the same `id` AF-131's real
 * `CompanionHabitatEntry` already uses — a genuinely new layer on top of
 * that pure dedup registry, never a competing companion store. */
export class CompanionEvolutionTracker {
  private readonly states = new Map<string, CompanionEvolutionState>();

  private stateFor(companionId: string): CompanionEvolutionState {
    let state = this.states.get(companionId);
    if (!state) {
      state = { growth: 0, behaviours: [], traits: [] };
      this.states.set(companionId, state);
    }
    return state;
  }

  grow(companionId: string, amount: number): void {
    const state = this.stateFor(companionId);
    state.growth = Math.min(100, state.growth + Math.max(0, amount));
  }

  learnBehaviour(companionId: string, behaviour: string): void {
    this.stateFor(companionId).behaviours.push(behaviour);
  }

  unlockTrait(companionId: string, trait: string): void {
    const state = this.stateFor(companionId);
    if (!state.traits.includes(trait)) state.traits.push(trait);
  }

  stageFor(companionId: string): CompanionGrowthStage {
    return companionGrowthStageFor(this.states.get(companionId)?.growth ?? 0);
  }

  isLegend(companionId: string): boolean {
    return this.stageFor(companionId) === "Legend";
  }

  snapshotFor(companionId: string): CompanionEvolutionState {
    const state = this.stateFor(companionId);
    return { growth: state.growth, behaviours: [...state.behaviours], traits: [...state.traits] };
  }
}

/** "Centuries later: new sayings appear... books preserve earlier
 * language." Reuses AF-135's real `EvolvingEntry` directly (versions
 * never overwrite, older ones stay archived) rather than a second
 * versioning primitive — the same reuse AF-136 already established for
 * Personal Storylines. */
export class LanguageEvolutionLog {
  private readonly entries = new Map<string, EvolvingEntry>();

  coin(phraseId: string, text: string, epoch: number, authorVoice: AuthorVoice): void {
    let entry = this.entries.get(phraseId);
    if (!entry) {
      entry = new EvolvingEntry(phraseId);
      this.entries.set(phraseId, entry);
    }
    entry.expand(text, epoch, authorVoice);
  }

  latestFor(phraseId: string): string | null {
    return this.entries.get(phraseId)?.latest()?.text ?? null;
  }

  all(): readonly EvolvingEntry[] {
    return [...this.entries.values()];
  }
}

export interface GreatProjectsProgressSummary {
  totalProjects: number;
  completedProjects: number;
  averageProgress: number;
}

/** "Very late game... projects require generations." A single, unified
 * progress lens over BOTH real, existing rosters (AF-090's 9
 * `MEGASTRUCTURES` and AF-138's 8 `CIVILISATION_MEGAPROJECTS`) rather
 * than a third parallel list — see the data file's naming-collision note. */
export function greatProjectsProgressSummary(civFramework: CivilisationFrameworkRuntime, megaprojectTracker: MegaprojectTracker): GreatProjectsProgressSummary {
  const megastructures = civFramework.allMegastructures;
  const megaprojectProgress = CIVILISATION_MEGAPROJECTS.map((m) => megaprojectTracker.progressFor(m.id) / m.threshold);
  const megastructureProgress = megastructures.map((m) => (m.completed ? 1 : m.progress / m.def.threshold));
  const allProgress = [...megastructureProgress, ...megaprojectProgress];
  const totalProjects = allProgress.length;
  const completedProjects = allProgress.filter((p) => p >= 1).length;
  const averageProgress = totalProjects === 0 ? 0 : allProgress.reduce((sum, p) => sum + p, 0) / totalProjects;
  return { totalProjects, completedProjects, averageProgress };
}
