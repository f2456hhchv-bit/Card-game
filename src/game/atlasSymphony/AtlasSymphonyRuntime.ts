import type { GrandPerformanceJourney } from "./atlasSymphonyData";
import { GRAND_PERFORMANCE_JOURNEYS } from "./atlasSymphonyData";

/** "Every campaign gradually becomes a scientific journey, a cultural
 * journey, an ecological journey, a human journey. Together they
 * create one story." Confirmed genuinely new (see
 * atlasSymphonyData.ts module doc comment): `isUnifiedStory` is true
 * only once every journey has been contributed to at least once. */
export class CampaignJourneyTracker {
  private readonly counts = new Map<GrandPerformanceJourney, number>();

  contribute(journey: GrandPerformanceJourney): void {
    this.counts.set(journey, (this.counts.get(journey) ?? 0) + 1);
  }

  countFor(journey: GrandPerformanceJourney): number {
    return this.counts.get(journey) ?? 0;
  }

  dominantJourney(): GrandPerformanceJourney | null {
    if (this.counts.size === 0) return null;
    return GRAND_PERFORMANCE_JOURNEYS.reduce((best, journey) => (this.countFor(journey) > this.countFor(best) ? journey : best), GRAND_PERFORMANCE_JOURNEYS[0]!);
  }

  isUnifiedStory(): boolean {
    return GRAND_PERFORMANCE_JOURNEYS.every((journey) => this.countFor(journey) > 0);
  }
}
