/**
 * ChronicleRuntime pieces (AF-135). Real composition over the pieces
 * already built this session — AF-130's EmotionalMemoryLog and
 * BondNetworkRuntime, AF-133's PlayerChronicle/LegacyProgressTracker/
 * GiftLedger/GalacticHistoryLog/exportLegacySnapshot/
 * inheritedFlavourLines — never a duplicate of any of them.
 */
import type { BondNetworkRuntime } from "../commanders/BondNetworkRuntime";
import { EmotionalMemoryLog } from "../commanders/BondNetworkRuntime";
import type { CommanderDef } from "../commanders/commanderData";
import type { GalacticHistoryLog, GiftLedger, LegacyProgressTracker, PlayerChronicle } from "../legacy/LegacyEngineRuntime";
import { exportLegacySnapshot, inheritedFlavourLines } from "../legacy/LegacyEngineRuntime";
import { EvolvingEntry, type AuthorVoice } from "./chronicleData";

/**
 * Per-planet evolving prose, distinct from AF-132's numeric
 * EnvironmentalRuntime — this tracks the "planet history spans
 * centuries" narrative, not pollution/wildlife indices.
 */
export class PlanetaryChronicle {
  private readonly entries = new Map<string, EvolvingEntry>();

  entryFor(planetId: string): EvolvingEntry {
    let entry = this.entries.get(planetId);
    if (!entry) {
      entry = new EvolvingEntry(planetId);
      this.entries.set(planetId, entry);
    }
    return entry;
  }

  write(planetId: string, text: string, epoch: number, authorVoice: AuthorVoice): void {
    this.entryFor(planetId).expand(text, epoch, authorVoice);
  }

  all(): readonly EvolvingEntry[] {
    return [...this.entries.values()];
  }
}

export interface PlayerBiography {
  totalLegacyXp: number;
  leadershipStyle: string;
  favouritePlanet: string | null;
  favouriteShip: string | null;
  victoryCount: number;
  defeatCount: number;
  expeditionPhilosophy: string;
}

/** Real biography, composed entirely from AF-133's existing trackers —
 * no new favourite-planet/ship/victory storage is created here. */
export function generatePlayerBiography(chronicle: PlayerChronicle, legacyProgress: LegacyProgressTracker): PlayerBiography {
  const topCategory = legacyProgress.topCategory();
  return {
    totalLegacyXp: legacyProgress.totalXp(),
    leadershipStyle: `A ${topCategory.toLowerCase()} at heart.`,
    favouritePlanet: chronicle.favouritePlanet(),
    favouriteShip: chronicle.favouriteShip(),
    victoryCount: chronicle.victoryCount(),
    defeatCount: chronicle.defeatCount(),
    expeditionPhilosophy: `Guided by ${topCategory.toLowerCase()} instincts above all else.`,
  };
}

export interface CommanderHistory {
  commanderId: string;
  memories: number;
  giftsDonated: number;
  strongestBondPartnerId: string | null;
  strongestBondLevel: number;
}

/** Composes AF-130's EmotionalMemoryLog + AF-133's GiftLedger +
 * AF-130's BondNetworkRuntime through their existing public APIs. */
export function commanderHistoryFor(commanderId: string, memoryLog: EmotionalMemoryLog, giftLedger: GiftLedger, bondNetwork: BondNetworkRuntime, roster: readonly CommanderDef[]): CommanderHistory {
  let strongestBondPartnerId: string | null = null;
  let strongestBondLevel = 0;
  for (const other of roster) {
    if (other.id === commanderId) continue;
    const level = bondNetwork.bondFor(commanderId, other.id)?.level ?? 0;
    if (level > strongestBondLevel) {
      strongestBondLevel = level;
      strongestBondPartnerId = other.id;
    }
  }
  return {
    commanderId,
    memories: memoryLog.historyFor(commanderId).length,
    giftsDonated: giftLedger.fromCommander(commanderId).length,
    strongestBondPartnerId,
    strongestBondLevel,
  };
}

export interface FinalChronicle {
  totalHistoricalRecords: number;
  totalLegacyXp: number;
  biography: PlayerBiography;
  inheritedFlavourLines: readonly string[];
}

/** "The player receives their own history book" — a real, deterministic
 * aggregation of everything the session already tracks. */
export function generateFinalChronicle(history: GalacticHistoryLog, chronicle: PlayerChronicle, legacyProgress: LegacyProgressTracker): FinalChronicle {
  const snapshot = exportLegacySnapshot(legacyProgress, history);
  return {
    totalHistoricalRecords: history.all().length,
    totalLegacyXp: snapshot.totalXp,
    biography: generatePlayerBiography(chronicle, legacyProgress),
    inheritedFlavourLines: inheritedFlavourLines(snapshot),
  };
}
