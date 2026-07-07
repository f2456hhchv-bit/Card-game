/**
 * Mission generation (AF-037 §Mission Generation): deterministic from the
 * mission seed, the same guarantee every other seeded generator in the
 * game already makes (loot, elites, relics). Rolls which modifiers from
 * the template's pool are active for this instance — nothing else about
 * the template is mutated.
 */
import { Rng } from "../../core/rng/Rng";
import type { MissionDef, MissionModifierDef } from "./missionData";

export interface MissionInstance {
  /** Unique per (template, seed) combination. */
  id: string;
  def: MissionDef;
  activeModifiers: readonly MissionModifierDef[];
  seed: number;
}

export function generateMission(template: MissionDef, seed: number): MissionInstance {
  const rng = new Rng(seed).fork("modifiers");
  const slots = Math.min(template.modifierSlots, template.modifierPool.length);
  const shuffled = [...template.modifierPool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  const activeModifiers = shuffled.slice(0, slots);
  return {
    id: `${template.id}:${seed}`,
    def: template,
    activeModifiers,
    seed,
  };
}
