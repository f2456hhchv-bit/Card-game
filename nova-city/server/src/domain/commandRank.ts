export interface CommandRankInput {
  shipCount: number;
  stationCount: number;
  sectorsControlled: number;
  alignment: number;
}

/** The "1 ship -> commander of galaxies" progression display, derived purely from owned assets. */
export function commandRank(input: CommandRankInput): string {
  const { shipCount, stationCount, sectorsControlled, alignment } = input;
  if (sectorsControlled >= 6) return 'Galactic Commander';
  if (sectorsControlled >= 3) {
    if (alignment <= -30) return 'Sector Warlord';
    if (alignment >= 30) return 'Sector Steward';
    return 'Sector Commander';
  }
  if (shipCount >= 8 || stationCount >= 3) return 'Fleet Commander';
  if (shipCount >= 4 || stationCount >= 1) return 'Squadron Leader';
  if (shipCount >= 2) return 'Ship Captain';
  return 'Drifter';
}
