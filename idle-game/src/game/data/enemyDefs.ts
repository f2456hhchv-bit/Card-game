/**
 * Cosmetic Hollow archetypes. Combat numbers come entirely from `Economy.ts`
 * (a function of stage + boss flag) — archetypes only pick a name and a body
 * shape/hue for the 3D rig, so the battlefield reads as varied even though
 * balance stays a single, easily-tuned curve. Names and silhouettes are drawn
 * from the AFTERLIGHT bestiary — the Hollow, shard-creatures of the dark.
 */
export type EnemyShape = "wraith" | "shard" | "brute" | "darter" | "dome" | "robed";

export interface EnemyArchetype {
  id: string;
  name: string;
  shape: EnemyShape;
}

export const ENEMY_ARCHETYPES: EnemyArchetype[] = [
  { id: "drifter", name: "Drifter", shape: "wraith" },
  { id: "mote", name: "Mote", shape: "shard" },
  { id: "husk", name: "Husk", shape: "brute" },
  { id: "lunger", name: "Lunger", shape: "darter" },
  { id: "wisp", name: "Wisp", shape: "dome" },
  { id: "caster", name: "Caster", shape: "robed" },
];

/** Deterministic archetype pick so the same stage always looks the same. */
export function archetypeForStage(stage: number): EnemyArchetype {
  const hash = (stage * 2654435761) % ENEMY_ARCHETYPES.length;
  return ENEMY_ARCHETYPES[hash];
}

export interface BossArchetype {
  name: string;
  shape: "maw" | "choir";
}

/** One signature boss silhouette per sector (named in stageDefs' bossName). */
export function bossShapeForStage(stage: number): BossArchetype["shape"] {
  return stage % 2 === 0 ? "choir" : "maw";
}
