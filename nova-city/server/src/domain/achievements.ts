export interface AchievementCheckInput {
  level: number;
  totalTrainedStats: number;
  tradesCompleted: number;
  sectorsExplored: number;
  shipCount: number;
  stationCount: number;
  sectorsControlled: number;
  alignment: number;
  credits: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  reward: number;
}

const DEFS: (AchievementDef & { isUnlocked: (i: AchievementCheckInput) => boolean })[] = [
  { id: 'first-blood', name: 'First Blood', description: 'Reach character level 2.', reward: 50, isUnlocked: (i) => i.level >= 2 },
  { id: 'seasoned-pilot', name: 'Seasoned Pilot', description: 'Reach character level 5.', reward: 150, isUnlocked: (i) => i.level >= 5 },
  { id: 'veteran-commander', name: 'Veteran Commander', description: 'Reach character level 10.', reward: 400, isUnlocked: (i) => i.level >= 10 },
  { id: 'iron-body', name: 'Iron Body', description: 'Train a combined 100 total stats.', reward: 100, isUnlocked: (i) => i.totalTrainedStats >= 100 },
  { id: 'juggernaut', name: 'Juggernaut', description: 'Train a combined 300 total stats.', reward: 350, isUnlocked: (i) => i.totalTrainedStats >= 300 },
  { id: 'licensed-trader', name: 'Licensed Trader', description: 'Complete 15 trades at the Trade Hub.', reward: 75, isUnlocked: (i) => i.tradesCompleted >= 15 },
  { id: 'black-market-contact', name: 'Black Market Contact', description: 'Complete 40 trades at the Trade Hub.', reward: 200, isUnlocked: (i) => i.tradesCompleted >= 40 },
  { id: 'charted-space', name: 'Charted Space', description: 'Scout 5 sectors.', reward: 100, isUnlocked: (i) => i.sectorsExplored >= 5 },
  { id: 'master-navigator', name: 'Master Navigator', description: 'Scout 10 sectors.', reward: 300, isUnlocked: (i) => i.sectorsExplored >= 10 },
  { id: 'fleet-commander', name: 'Fleet Commander', description: 'Own 3 or more ships.', reward: 250, isUnlocked: (i) => i.shipCount >= 3 },
  { id: 'station-holder', name: 'Station Holder', description: 'Build your first space station.', reward: 200, isUnlocked: (i) => i.stationCount >= 1 },
  { id: 'sector-power', name: 'Sector Power', description: 'Control 3 or more sectors.', reward: 500, isUnlocked: (i) => i.sectorsControlled >= 3 },
  { id: 'steward-of-light', name: 'Steward of Light', description: 'Reach +50 alignment.', reward: 300, isUnlocked: (i) => i.alignment >= 50 },
  { id: 'warlord-of-the-dark', name: 'Warlord of the Dark', description: 'Reach -50 alignment.', reward: 300, isUnlocked: (i) => i.alignment <= -50 },
  { id: 'wealthy-pilot', name: 'Wealthy Pilot', description: 'Accumulate 10,000 credits.', reward: 250, isUnlocked: (i) => i.credits >= 10_000 },
];

export const ACHIEVEMENTS: AchievementDef[] = DEFS.map(({ isUnlocked: _isUnlocked, ...def }) => def);

export function unlockedAchievementIds(input: AchievementCheckInput): string[] {
  return DEFS.filter((d) => d.isUnlocked(input)).map((d) => d.id);
}
