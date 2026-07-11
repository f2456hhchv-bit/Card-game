function utcDateString(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/** Calendar-day gate (UTC), not a rolling timer — "come back tomorrow", never "wait N hours". */
export function canClaimDailyBonus(lastClaimedDate: string | null, now: number): boolean {
  return lastClaimedDate !== utcDateString(now);
}

export function stampDailyBonusDate(now: number): string {
  return utcDateString(now);
}

export interface DailyBonusReward {
  credits: number;
  fuel: number;
  resolve: number;
}

/** Scales gently with level so it stays a nice-to-have, not the main income loop. */
export function dailyBonusReward(level: number): DailyBonusReward {
  return {
    credits: 100 + level * 15,
    fuel: 25,
    resolve: 15,
  };
}
