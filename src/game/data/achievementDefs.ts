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
  runMotes: number;
  runAffixKills: number;
  runPods: number;
  runAscension: number;
  /** True when a Sector with an active Modifier was just cleared. */
  runModifierCleared: boolean;
  // Lifetime / profile
  lifetimeBosses: number;
  metaPurchases: number;
  runsPlayed: number;
  campaignProgress: number;
  wardensUnlocked: number;
  wardensTotal: number;
  chassisUnlocked: number;
  chassisTotal: number;
  // Gear
  fullSetsOwned: number;
  setsTotal: number;
  maxedGearItems: number;
  // Boss signatures
  signaturesOwned: number;
  signaturesTotal: number;
  // Warden mastery
  wardenMaxLevel: number;
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
    id: "collector",
    name: "Collector",
    description: "Unlock every Commander.",
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
  {
    id: "quartermaster",
    name: "Quartermaster",
    description: "Complete a full gear set (all 4 pieces).",
    icon: "🛠",
    check: (c) => c.fullSetsOwned >= 1,
  },
  {
    id: "outfitter",
    name: "Outfitter",
    description: "Complete every gear set.",
    icon: "🚀",
    check: (c) => c.fullSetsOwned >= c.setsTotal,
  },
  {
    id: "master-smith",
    name: "Master Smith",
    description: "Merge a gear item to max grade.",
    icon: "⬡",
    check: (c) => c.maxedGearItems >= 1,
  },
  {
    id: "warlord",
    name: "Warlord",
    description: "Claim every boss signature.",
    icon: "👑",
    check: (c) => c.signaturesTotal > 0 && c.signaturesOwned >= c.signaturesTotal,
  },
  {
    id: "veteran",
    name: "Veteran",
    description: "Raise a Commander to mastery level 10.",
    icon: "🎖",
    check: (c) => c.wardenMaxLevel >= 10,
  },
  // ---- Slaughter & endurance tiers ----------------------------------------
  {
    id: "legion-ender",
    name: "Legion Ender",
    description: "Fell 1,000 Hollow in a single run.",
    icon: "🌋",
    check: (c) => c.runKills >= 1000,
  },
  {
    id: "eternal-flame",
    name: "Eternal Flame",
    description: "Survive 20 minutes in a single run.",
    icon: "🔥",
    check: (c) => c.runTime >= 1200,
  },
  {
    id: "paragon",
    name: "Paragon",
    description: "Reach level 40 in a single run.",
    icon: "🌟",
    check: (c) => c.runLevel >= 40,
  },
  {
    id: "champion-hunter",
    name: "Champion Hunter",
    description: "Fell 12 elites in a single run.",
    icon: "🏹",
    check: (c) => c.runEliteKills >= 12,
  },
  {
    id: "ringbreaker",
    name: "Ringbreaker",
    description: "Fell 5 affixed elites (coloured rings) in a single run.",
    icon: "💫",
    check: (c) => c.runAffixKills >= 5,
  },
  // ---- Economy & run-events -------------------------------------------------
  {
    id: "prospector",
    name: "Prospector",
    description: "Gather 50 Light Motes on the field in a single run.",
    icon: "⬡",
    check: (c) => c.runMotes >= 50,
  },
  {
    id: "golden-wake",
    name: "Golden Wake",
    description: "Gather 150 Light Motes on the field in a single run.",
    icon: "☀",
    check: (c) => c.runMotes >= 150,
  },
  {
    id: "salvager",
    name: "Salvager",
    description: "Secure a Supply Pod before it self-destructs.",
    icon: "📦",
    check: (c) => c.runPods >= 1,
  },
  {
    id: "pod-runner",
    name: "Pod Runner",
    description: "Secure 3 Supply Pods in a single run.",
    icon: "🛰",
    check: (c) => c.runPods >= 3,
  },
  // ---- Campaign journey -----------------------------------------------------
  {
    id: "trailblazer",
    name: "Trailblazer",
    description: "Reach Galaxy 2 of the campaign.",
    icon: "🧭",
    check: (c) => c.campaignProgress >= 10,
  },
  {
    id: "voidfarer",
    name: "Voidfarer",
    description: "Reach Galaxy 5 of the campaign.",
    icon: "🌀",
    check: (c) => c.campaignProgress >= 40,
  },
  {
    id: "deeplight",
    name: "Deeplight",
    description: "Reach Galaxy 10 of the campaign.",
    icon: "🌌",
    check: (c) => c.campaignProgress >= 90,
  },
  {
    id: "conqueror",
    name: "Conqueror",
    description: "Clear all 100 Galaxies. Hold back the dark, forever.",
    icon: "♛",
    check: (c) => c.campaignProgress >= 1000,
  },
  {
    id: "storm-rider",
    name: "Storm Rider",
    description: "Clear a Sector that carries a Sector Modifier.",
    icon: "🌪",
    check: (c) => c.runModifierCleared,
  },
  // ---- Alt modes --------------------------------------------------------------
  {
    id: "starclimber",
    name: "Starclimber",
    description: "Reach Ascension 5 in Endless mode.",
    icon: "▲",
    check: (c) => c.runAscension >= 5,
  },
  {
    id: "bossbreaker",
    name: "Bossbreaker",
    description: "Fell 3 bosses in a single run.",
    icon: "⚡",
    check: (c) => c.runBossKills >= 3,
  },
  // ---- Fleet & devotion ------------------------------------------------------
  {
    id: "fleet-admiral",
    name: "Fleet Admiral",
    description: "Unlock every Ship in the fleet.",
    icon: "🚀",
    check: (c) => c.chassisTotal > 0 && c.chassisUnlocked >= c.chassisTotal,
  },
  {
    id: "benefactor",
    name: "Benefactor",
    description: "Purchase 25 permanent upgrade levels.",
    icon: "💠",
    check: (c) => c.metaPurchases >= 25,
  },
  {
    id: "centennial",
    name: "Centennial",
    description: "Fly 100 runs.",
    icon: "💯",
    check: (c) => c.runsPlayed >= 100,
  },
  {
    id: "dreadbane",
    name: "Dreadbane",
    description: "Defeat 25 bosses across all runs.",
    icon: "🗿",
    check: (c) => c.lifetimeBosses >= 25,
  },
];
