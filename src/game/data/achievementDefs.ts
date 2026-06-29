/**
 * Achievement definitions. Each has a `check(ctx)` predicate evaluated against a
 * snapshot of the just-finished run plus lifetime/profile totals. Achievements
 * are awarded (and toasted) when their predicate first becomes true; unlock
 * state lives in `save.achievements`.
 */
export interface AchievementContext {
  // This run
  runTime: number;
  runKills: number;
  runEliteKills: number;
  runBossKills: number;
  runLevel: number;
  runEvolved: boolean;
  runDaily: boolean;
  // Lifetime / profile
  lifetimeBosses: number;
  metaPurchases: number;
  wardensUnlocked: number;
  wardensTotal: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (c: AchievementContext) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first-light",
    name: "First Light",
    description: "Fell your first Hollow.",
    icon: "✦",
    check: (c) => c.runKills >= 1,
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Fell 100 Hollow in a single run.",
    icon: "⚔",
    check: (c) => c.runKills >= 100,
  },
  {
    id: "swarmbreaker",
    name: "Swarmbreaker",
    description: "Fell 400 Hollow in a single run.",
    icon: "☄",
    check: (c) => c.runKills >= 400,
  },
  {
    id: "keeper",
    name: "Keeper",
    description: "Survive 5 minutes in a single run.",
    icon: "⏳",
    check: (c) => c.runTime >= 300,
  },
  {
    id: "lightwarden",
    name: "Lightwarden",
    description: "Survive 10 minutes in a single run.",
    icon: "🌙",
    check: (c) => c.runTime >= 600,
  },
  {
    id: "ascendant",
    name: "Ascendant",
    description: "Reach level 20 in a single run.",
    icon: "⬆",
    check: (c) => c.runLevel >= 20,
  },
  {
    id: "boss-slayer",
    name: "Boss Slayer",
    description: "Defeat a boss.",
    icon: "☠",
    check: (c) => c.runBossKills >= 1,
  },
  {
    id: "hollowbane",
    name: "Hollowbane",
    description: "Defeat 5 bosses across all runs.",
    icon: "🗡",
    check: (c) => c.lifetimeBosses >= 5,
  },
  {
    id: "transcendent",
    name: "Transcendent",
    description: "Evolve a weapon.",
    icon: "★",
    check: (c) => c.runEvolved,
  },
  {
    id: "devotee",
    name: "Devotee",
    description: "Complete a Daily Run.",
    icon: "📅",
    check: (c) => c.runDaily,
  },
  {
    id: "collector",
    name: "Collector",
    description: "Unlock every Warden.",
    icon: "👥",
    check: (c) => c.wardensUnlocked >= c.wardensTotal,
  },
  {
    id: "investor",
    name: "Investor",
    description: "Purchase 10 permanent upgrade levels.",
    icon: "✧",
    check: (c) => c.metaPurchases >= 10,
  },
];
