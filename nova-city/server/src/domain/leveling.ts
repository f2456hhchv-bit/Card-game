export function xpToNextLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.5));
}

export interface LevelResult {
  level: number;
  xp: number;
  leveledUp: boolean;
}

export function applyXp(level: number, xp: number, gained: number): LevelResult {
  let newXp = xp + gained;
  let newLevel = level;
  let leveledUp = false;
  while (newXp >= xpToNextLevel(newLevel)) {
    newXp -= xpToNextLevel(newLevel);
    newLevel += 1;
    leveledUp = true;
  }
  return { level: newLevel, xp: newXp, leveledUp };
}
