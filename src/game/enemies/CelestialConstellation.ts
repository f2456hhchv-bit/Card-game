/**
 * Celestial Constellation runtime (AF-054 §Celestial Network / §Combat
 * Style: Constellation Patterns): the one genuinely new mechanical surface
 * of the Celestial Conclave framework, and the ninth distinct faction
 * doctrine. Every prior faction's bonus is ONE shared value or flag for
 * the whole squad. A Constellation is instead a graph of specific pairwise
 * links between entities — not a hub-and-spoke network — and each living
 * entity's bonus is computed from its OWN surviving link count. Two
 * members can have different bonus magnitudes at the same instant,
 * something no prior doctrine's single shared number could produce.
 * "Destroying anchor entities destabilises nearby formations" needs no
 * special-cased anchor flag: an anchor is simply whichever unit the graph
 * gives the highest degree, so killing it costs every neighbour a link
 * simultaneously — a cascade that emerges from the graph shape itself.
 * Pure and bus-free, like every prior *Runtime.
 */
import { CONSTELLATION_TUNING } from "./celestialData";

export interface ConstellationMemberSnapshot {
  droneId: string;
  linkCount: number;
}

export interface ConstellationSnapshot {
  constellationId: string;
  membersRemaining: number;
  members: readonly ConstellationMemberSnapshot[];
}

export class CelestialConstellationRuntime {
  private readonly alive: Set<string>;
  private readonly adjacency = new Map<string, Set<string>>();

  /** `links` is an edge list — the constellation's fixed pattern, built once at spawn. */
  constructor(
    readonly constellationId: string,
    memberIds: readonly string[],
    links: ReadonlyArray<readonly [string, string]>,
  ) {
    this.alive = new Set(memberIds);
    for (const id of memberIds) this.adjacency.set(id, new Set());
    for (const [a, b] of links) {
      this.adjacency.get(a)?.add(b);
      this.adjacency.get(b)?.add(a);
    }
  }

  /** Returns "member" if this drone belonged to the constellation, else null.
   * No separate "anchor" case exists — an anchor's outsized impact is just
   * its neighbours each losing a link, which the caller reads via `linkCountFor`. */
  notifyDroneDestroyed(droneId: string): "member" | null {
    if (!this.alive.delete(droneId)) return null;
    return "member";
  }

  isMember(droneId: string): boolean {
    return this.adjacency.has(droneId);
  }

  get eliminated(): boolean {
    return this.alive.size === 0;
  }

  /** How many of this entity's linked neighbours are still alive — the
   * doctrine's core per-entity number, hard-capped for fairness. */
  linkCountFor(droneId: string): number {
    if (!this.alive.has(droneId)) return 0;
    const neighbours = this.adjacency.get(droneId);
    if (!neighbours) return 0;
    let count = 0;
    for (const neighbour of neighbours) if (this.alive.has(neighbour)) count += 1;
    return Math.min(CONSTELLATION_TUNING.maxContributingLinks, count);
  }

  /** Solar Energy — damage bonus, computed per-entity from its own link count. */
  damageBonusFor(droneId: string): number {
    return this.linkCountFor(droneId) * CONSTELLATION_TUNING.solarEnergyDamageBonusPerLink;
  }

  /** Shield Strength — incoming-damage reduction, computed per-entity from its own link count. */
  incomingDamageReductionFor(droneId: string): number {
    return this.linkCountFor(droneId) * CONSTELLATION_TUNING.shieldStrengthReductionPerLink;
  }

  /** Healing / Ability Synchronisation — heal-per-second, computed per-entity from its own link count. */
  healPerSecondFor(droneId: string): number {
    return this.linkCountFor(droneId) * CONSTELLATION_TUNING.healPerSecondPerLink;
  }

  get snapshot(): ConstellationSnapshot {
    const members: ConstellationMemberSnapshot[] = [];
    for (const droneId of this.alive) members.push({ droneId, linkCount: this.linkCountFor(droneId) });
    return { constellationId: this.constellationId, membersRemaining: this.alive.size, members };
  }
}
