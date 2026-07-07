/**
 * Voice Pool (AF-045 §Performance "Limit simultaneous voices" / §Positional
 * Audio "Priority Mixing"): a per-category cap on simultaneous playing
 * voices. When a category is full, a new request only claims a slot by
 * evicting the currently-lowest-priority voice, and only if it is strictly
 * higher priority than that voice — gameplay-critical sounds (Shield Break,
 * Legendary Drop) are never silently dropped in favour of ambient filler.
 */
import type { AudioCategory } from "./audioData";

interface ActiveVoice {
  voiceId: string;
  cueId: string;
  priority: number;
}

export class VoicePool {
  private readonly activeByCategory = new Map<AudioCategory, ActiveVoice[]>();
  private nextVoiceId = 1;

  constructor(private readonly maxVoicesPerCategory: number = 8) {}

  /** Returns the new voice's id if it was granted a slot, or null if it was dropped. */
  requestVoice(category: AudioCategory, cueId: string, priority: number): string | null {
    const active = this.activeByCategory.get(category) ?? [];
    const voiceId = `voice-${this.nextVoiceId++}`;
    if (active.length < this.maxVoicesPerCategory) {
      active.push({ voiceId, cueId, priority });
      this.activeByCategory.set(category, active);
      return voiceId;
    }
    let lowestIndex = -1;
    let lowestPriority = Infinity;
    for (let i = 0; i < active.length; i += 1) {
      if (active[i]!.priority < lowestPriority) {
        lowestPriority = active[i]!.priority;
        lowestIndex = i;
      }
    }
    if (lowestIndex >= 0 && priority > lowestPriority) {
      active[lowestIndex] = { voiceId, cueId, priority };
      return voiceId;
    }
    return null; // dropped — the category is full of equal-or-higher-priority voices
  }

  release(category: AudioCategory, voiceId: string): void {
    const active = this.activeByCategory.get(category);
    if (!active) return;
    this.activeByCategory.set(category, active.filter((v) => v.voiceId !== voiceId));
  }

  activeVoiceCount(category?: AudioCategory): number {
    if (category) return this.activeByCategory.get(category)?.length ?? 0;
    let total = 0;
    for (const active of this.activeByCategory.values()) total += active.length;
    return total;
  }
}
