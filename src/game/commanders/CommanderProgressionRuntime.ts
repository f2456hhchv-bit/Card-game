/**
 * Commander progression runtime (AF-071). Pure and deterministic — the
 * AF-068/069/070 ledger discipline applied to one commander's growth.
 * AF-030's CommanderRuntime (cooldowns, ultimate charge) is untouched;
 * this runtime carries everything the framework adds:
 * - Talents: points in, nodes out. Hybrid builds are the default — nodes
 *   unlock from any branch in any order; only the endgame node has a
 *   prerequisite (three owned nodes in its own branch), so specialisation
 *   is earned, never forced.
 * - Talent bonuses are AF-028 EquipmentBonus values, aggregated and CACHED
 *   until the build changes (§Performance: "cache talent calculations").
 * - Personal missions advance strictly through the six beats.
 * - The ascension upgrade (the seventh ability stage) unlocks its linked
 *   talent node FREE once AF-069's ascension level reaches the gate.
 * - Progression is append-only; there is no removal operation (respec is
 *   a future Project-Owner decision, not an accidental capability).
 */
import { PERSONAL_MISSION_BEATS, type CommanderProfileDef, type PersonalMissionDef, type TalentNodeDef } from "./commanderFrameworkData";
import type { EquipmentBonus } from "../equipment/equipmentData";

export interface CommanderProgressionSnapshot {
  commanderId: string;
  class: string;
  talentPoints: number;
  talentsUnlocked: number;
  talentsTotal: number;
  branchesTouched: number;
  missionBeatIndex: number;
  missionBeat: string;
  ascensionUpgradeApplied: boolean;
}

export class CommanderProgressionRuntime {
  private talentPoints = 0;
  private readonly unlockedNodeIds = new Set<string>();
  private missionBeatIndex = 0;
  private ascensionUpgradeAppliedFlag = false;
  private bonusCache: readonly EquipmentBonus[] | null = null;

  constructor(private readonly profile: CommanderProfileDef) {}

  grantTalentPoints(amount = 1): void {
    if (amount > 0) this.talentPoints += amount;
  }

  private findNode(nodeId: string): { node: TalentNodeDef; branchNodeIds: readonly string[] } | null {
    for (const branch of this.profile.talentBranches) {
      const node = branch.nodes.find((n) => n.id === nodeId);
      if (node) return { node, branchNodeIds: branch.nodes.map((n) => n.id) };
    }
    return null;
  }

  /** Hybrid builds by default: any branch, any order. Endgame nodes require
   * three owned nodes in their own branch — specialisation is earned. */
  tryUnlockTalent(nodeId: string): boolean {
    if (this.talentPoints < 1 || this.unlockedNodeIds.has(nodeId)) return false;
    const found = this.findNode(nodeId);
    if (!found) return false;
    if (found.node.kind === "endgameNode") {
      const ownedInBranch = found.branchNodeIds.filter((id) => id !== nodeId && this.unlockedNodeIds.has(id)).length;
      if (ownedInBranch < 3) return false;
    }
    this.talentPoints -= 1;
    this.unlockedNodeIds.add(nodeId);
    this.bonusCache = null;
    return true;
  }

  isUnlocked(nodeId: string): boolean {
    return this.unlockedNodeIds.has(nodeId);
  }

  /** Aggregated AF-028 bonuses, cached until the build changes (§Performance). */
  talentBonuses(): readonly EquipmentBonus[] {
    if (this.bonusCache) return this.bonusCache;
    const bonuses: EquipmentBonus[] = [];
    for (const branch of this.profile.talentBranches) {
      for (const node of branch.nodes) {
        if (this.unlockedNodeIds.has(node.id)) bonuses.push(node.bonus);
      }
    }
    this.bonusCache = bonuses;
    return bonuses;
  }

  /** Personal missions advance strictly through the six beats. */
  advanceMissionBeat(): PersonalMissionDef | null {
    if (this.missionBeatIndex >= this.profile.personalMissions.length) return null;
    const mission = this.profile.personalMissions[this.missionBeatIndex]!;
    this.missionBeatIndex += 1;
    return mission;
  }

  /** The seventh ability stage: at the gated AF-069 level, the linked node unlocks free, once. */
  tryApplyAscensionUpgrade(ascensionLevel: number): boolean {
    if (this.ascensionUpgradeAppliedFlag) return false;
    if (ascensionLevel < this.profile.ascensionUpgrade.requiredAscensionLevel) return false;
    this.ascensionUpgradeAppliedFlag = true;
    this.unlockedNodeIds.add(this.profile.ascensionUpgrade.talentNodeId);
    this.bonusCache = null;
    return true;
  }

  get snapshot(): CommanderProgressionSnapshot {
    const branchesTouched = this.profile.talentBranches.filter((branch) =>
      branch.nodes.some((node) => this.unlockedNodeIds.has(node.id)),
    ).length;
    const beat =
      this.missionBeatIndex >= PERSONAL_MISSION_BEATS.length
        ? "complete"
        : PERSONAL_MISSION_BEATS[this.missionBeatIndex]!;
    return {
      commanderId: this.profile.commanderId,
      class: this.profile.class,
      talentPoints: this.talentPoints,
      talentsUnlocked: this.unlockedNodeIds.size,
      talentsTotal: this.profile.talentBranches.reduce((n, b) => n + b.nodes.length, 0),
      branchesTouched,
      missionBeatIndex: this.missionBeatIndex,
      missionBeat: beat,
      ascensionUpgradeApplied: this.ascensionUpgradeAppliedFlag,
    };
  }
}
