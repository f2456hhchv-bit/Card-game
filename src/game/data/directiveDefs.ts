import type { RunStats } from "../World";

/**
 * Directives — rotating objectives that give each session a fresh, concrete
 * goal (and a reason to return). Three refresh daily, one weekly; both are
 * picked deterministically from a pool by the current date, so every player on
 * a given day shares the same board. Progress is fed from each run's stats.
 */
export interface DirectiveDef {
  id: string;
  period: "daily" | "weekly";
  /** "run" = best single run counts; "cumulative" = summed across the period. */
  mode: "run" | "cumulative";
  /** Which run metric this measures (see metricValue). */
  metric: string;
  target: number;
  /** One-line objective text (target already baked in). */
  text: string;
  /** Glyph icon key (see glyphIcon). */
  icon: string;
  hue: number;
  reward: { motes: number; alloy: number };
}

/** Value of a run metric for directive progress. */
export function metricValue(metric: string, s: RunStats): number {
  switch (metric) {
    case "kills":
      return s.kills;
    case "bossKills":
      return s.bossKills;
    case "eliteKills":
      return s.eliteKills;
    case "affixKills":
      return s.affixKills;
    case "timeMin":
      return Math.floor(s.elapsed / 60);
    case "motes":
      return s.motesCollected;
    case "pods":
      return s.podsCollected;
    case "ascension":
      return s.ascension;
    case "runs":
      return 1;
    default:
      return 0;
  }
}

const DAILY_POOL: DirectiveDef[] = [
  { id: "d_kills150", period: "daily", mode: "run", metric: "kills", target: 150, text: "Fell 150 Hollow in a single run", icon: "skull", hue: 300, reward: { motes: 60, alloy: 0 } },
  { id: "d_boss2", period: "daily", mode: "run", metric: "bossKills", target: 2, text: "Defeat 2 bosses in a single run", icon: "crown", hue: 45, reward: { motes: 80, alloy: 10 } },
  { id: "d_time8", period: "daily", mode: "run", metric: "timeMin", target: 8, text: "Survive 8 minutes in a single run", icon: "moon", hue: 200, reward: { motes: 70, alloy: 0 } },
  { id: "d_elite5", period: "daily", mode: "run", metric: "eliteKills", target: 5, text: "Fell 5 elite champions in a run", icon: "star", hue: 265, reward: { motes: 70, alloy: 0 } },
  { id: "d_motes300", period: "daily", mode: "run", metric: "motes", target: 300, text: "Gather 300 Light Motes in a run", icon: "sun", hue: 48, reward: { motes: 50, alloy: 15 } },
  { id: "d_pods2", period: "daily", mode: "run", metric: "pods", target: 2, text: "Secure 2 Supply Pods in a run", icon: "pod", hue: 40, reward: { motes: 60, alloy: 10 } },
  { id: "d_affix3", period: "daily", mode: "run", metric: "affixKills", target: 3, text: "Fell 3 affixed elites in a run", icon: "hexagon", hue: 330, reward: { motes: 70, alloy: 0 } },
  { id: "d_asc3", period: "daily", mode: "run", metric: "ascension", target: 3, text: "Reach Ascension 3 in Endless", icon: "chevronUp", hue: 195, reward: { motes: 90, alloy: 0 } },
];

const WEEKLY_POOL: DirectiveDef[] = [
  { id: "w_kills1500", period: "weekly", mode: "cumulative", metric: "kills", target: 1500, text: "Fell 1500 Hollow this week", icon: "skull", hue: 300, reward: { motes: 400, alloy: 40 } },
  { id: "w_boss15", period: "weekly", mode: "cumulative", metric: "bossKills", target: 15, text: "Defeat 15 bosses this week", icon: "crown", hue: 45, reward: { motes: 420, alloy: 40 } },
  { id: "w_runs10", period: "weekly", mode: "cumulative", metric: "runs", target: 10, text: "Complete 10 runs this week", icon: "rocket", hue: 150, reward: { motes: 350, alloy: 30 } },
  { id: "w_time40", period: "weekly", mode: "cumulative", metric: "timeMin", target: 40, text: "Survive 40 minutes total this week", icon: "moon", hue: 200, reward: { motes: 360, alloy: 30 } },
  { id: "w_motes2000", period: "weekly", mode: "cumulative", metric: "motes", target: 2000, text: "Gather 2000 Light Motes this week", icon: "sun", hue: 48, reward: { motes: 380, alloy: 40 } },
];

export const DIRECTIVE_DEFS: Record<string, DirectiveDef> = Object.fromEntries(
  [...DAILY_POOL, ...WEEKLY_POOL].map((d) => [d.id, d]),
);

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** A deterministic, distinct pick of `n` directives from a pool, seeded by key. */
export function pickDirectives(pool: DirectiveDef[], key: string, n: number): string[] {
  const idx = pool.map((_, i) => i);
  let seed = hashStr(key) || 1;
  for (let i = idx.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(n, pool.length)).map((i) => pool[i].id);
}

export const DAILY_DIRECTIVES = DAILY_POOL;
export const WEEKLY_DIRECTIVES = WEEKLY_POOL;
