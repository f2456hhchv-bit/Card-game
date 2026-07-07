/**
 * Relic system (AF-029): active relic tracking, symmetric synergy
 * detection, mutual-exclusion validation, and evolution. Numeric effects
 * (including negative trade-off clauses) feed the SAME AF-028 aggregation
 * shape — no second stat pipeline.
 */
import type { BonusTotals } from "../equipment/EquipmentAggregate";
import { validateRelicDef, type RelicDef } from "./relicData";

export interface RelicSynergy {
  relicIdA: string;
  relicIdB: string;
}

export interface RelicAggregate {
  bonuses: BonusTotals;
  behaviourCount: number;
  synergies: readonly RelicSynergy[];
}

export type AcquireResult =
  | { ok: true }
  | { ok: false; reason: "invalidDefinition"; errors: readonly string[] }
  | { ok: false; reason: "maxStacksReached" }
  | { ok: false; reason: "exclusionConflict"; conflictingId: string };

export class RelicSystem {
  private readonly definitionsById: Map<string, RelicDef>;
  private readonly active = new Map<string, number>(); // id → stack count

  constructor(
    definitions: readonly RelicDef[],
    private readonly onEvolved?: (from: RelicDef, to: RelicDef) => void,
  ) {
    this.definitionsById = new Map(definitions.map((d) => [d.id, d]));
  }

  acquire(relicId: string): AcquireResult {
    const def = this.definitionsById.get(relicId);
    if (!def) return { ok: false, reason: "invalidDefinition", errors: [`unknown relic "${relicId}"`] };

    const schemaErrors = validateRelicDef(def);
    if (schemaErrors.length > 0) return { ok: false, reason: "invalidDefinition", errors: schemaErrors };

    // Exclusion applies whenever the incoming relic shares a group with an
    // active one — checked on the group, not on the acquiring relic's own
    // stacking flag (a relic can be "unique" and still belong to a group).
    if (def.exclusionGroup) {
      for (const [activeId] of this.active) {
        const activeDef = this.definitionsById.get(activeId);
        if (activeDef && activeDef.exclusionGroup === def.exclusionGroup && activeId !== relicId) {
          return { ok: false, reason: "exclusionConflict", conflictingId: activeId };
        }
      }
    }

    const currentStacks = this.active.get(relicId) ?? 0;
    const cap = def.maxStacks ?? Infinity;
    if (currentStacks >= cap) return { ok: false, reason: "maxStacksReached" };

    this.active.set(relicId, currentStacks + 1);
    this.checkAllEvolutions();
    return { ok: true };
  }

  has(relicId: string): boolean {
    return this.active.has(relicId);
  }

  stacksOf(relicId: string): number {
    return this.active.get(relicId) ?? 0;
  }

  /** Symmetric, deterministic: order of acquisition never changes the result. */
  private detectSynergies(): RelicSynergy[] {
    const synergies: RelicSynergy[] = [];
    const ids = [...this.active.keys()].sort();
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const a = this.definitionsById.get(ids[i] as string);
        const b = ids[j] as string;
        if (a?.synergyWith.includes(b)) {
          synergies.push({ relicIdA: ids[i] as string, relicIdB: b });
        }
      }
    }
    return synergies;
  }

  /**
   * Order-independent: scans every ACTIVE relic (not just the one just
   * acquired), since a new arrival may complete another active relic's
   * evolution requirements. Re-scans after each evolution in case one
   * evolution unlocks another; a relic never chains into itself so this
   * always terminates.
   */
  private checkAllEvolutions(): void {
    let changed = true;
    while (changed) {
      changed = false;
      for (const id of [...this.active.keys()]) {
        const def = this.definitionsById.get(id);
        if (!def?.evolvesInto) continue;
        const requirementsMet = def.evolutionRequires.every((reqId) => this.active.has(reqId));
        if (!requirementsMet) continue;
        const evolved = this.definitionsById.get(def.evolvesInto);
        if (!evolved) continue;

        // Consume the base relic and its requirements; grant the evolved form once.
        this.active.delete(def.id);
        for (const reqId of def.evolutionRequires) this.active.delete(reqId);
        this.active.set(evolved.id, (this.active.get(evolved.id) ?? 0) + 1);
        this.onEvolved?.(def, evolved);
        changed = true;
        break; // active set mutated — restart the scan
      }
    }
  }

  /** Aggregation: numeric clauses (incl. negative trade-offs) sum identically. */
  get aggregate(): RelicAggregate {
    const bonuses: BonusTotals = {};
    let behaviourCount = 0;
    for (const [id, stacks] of this.active) {
      const def = this.definitionsById.get(id);
      if (!def) continue;
      for (const effect of def.effects) {
        bonuses[effect.kind] = (bonuses[effect.kind] ?? 0) + effect.value * stacks;
      }
      behaviourCount += def.behaviours.length * stacks;
    }
    return { bonuses, behaviourCount, synergies: this.detectSynergies() };
  }

  get activeRelicIds(): readonly string[] {
    return [...this.active.keys()];
  }
}
