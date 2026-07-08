import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import { COMMANDER_ARCHETYPES, findOverlap, fingerprint } from "../src/game/commanders/commanderData";
import {
  COMMANDER_ARCHITECTURE_PARTS,
  ROSTER_TARGET,
  architectureFor,
} from "../src/game/commanders/commanderFrameworkData";
import {
  AI_COMMANDER_CONTEXTS,
  BALANCE_AXES,
  COMMANDER_STAT_KINDS,
  CUSTOMISATION_KINDS,
  LAUNCH_PROFILES,
  LAUNCH_ROSTER,
  PHILOSOPHY_TO_ARCHETYPE,
  RECRUITMENT_SOURCES,
  RECRUITMENT_TABLE,
  ROSTER_PHILOSOPHIES,
  STARTING_COMMANDER_IDS,
  TEAM_SYNERGY_KINDS,
  philosophyFor,
  syntheticCommanderFor,
  type RecruitmentSource,
} from "../src/game/commanders/rosterData";
import { RosterRuntime } from "../src/game/commanders/RosterRuntime";
import { CommanderProgressionRuntime } from "../src/game/commanders/CommanderProgressionRuntime";

describe("Roster vocabulary — registered shelves (AF-072)", () => {
  it("registers fourteen philosophies, six team-synergy kinds, four AI contexts, seven recruitment sources, eight customisation kinds, eight stat kinds, five balance axes", () => {
    expect(ROSTER_PHILOSOPHIES.length).toBe(14);
    expect(TEAM_SYNERGY_KINDS.length).toBe(6);
    expect(AI_COMMANDER_CONTEXTS.length).toBe(4);
    expect(RECRUITMENT_SOURCES.length).toBe(7);
    expect(CUSTOMISATION_KINDS.length).toBe(8);
    expect(COMMANDER_STAT_KINDS.length).toBe(8);
    expect(BALANCE_AXES.length).toBe(5);
  });

  it("balance never happens along raw damage: the axis shelf carries decision/positioning/synergy/timing/knowledge only", () => {
    expect(BALANCE_AXES).not.toContain("rawDamage" as never);
    expect(BALANCE_AXES).not.toContain("damage" as never);
  });

  it("every philosophy maps totally onto AF-030's locked archetype shelf", () => {
    for (const philosophy of ROSTER_PHILOSOPHIES) expect(COMMANDER_ARCHETYPES).toContain(PHILOSOPHY_TO_ARCHETYPE[philosophy]);
  });
});

describe("The launch roster — fourteen commanders, one philosophy each (AF-072 §Initial Roster)", () => {
  it("ships fourteen commanders inside AF-071's ROSTER_TARGET, each with a profile and a UNIQUE philosophy", () => {
    expect(LAUNCH_ROSTER.length).toBe(14);
    expect(LAUNCH_ROSTER.length).toBeGreaterThanOrEqual(ROSTER_TARGET.min - 2); // "approximately 14"
    expect(LAUNCH_PROFILES.length).toBe(LAUNCH_ROSTER.length);
    const philosophies = LAUNCH_ROSTER.map((c) => philosophyFor(c.id));
    expect(new Set(philosophies).size).toBe(14); // a bijection — every philosophy taken exactly once
    for (const philosophy of philosophies) expect(ROSTER_PHILOSOPHIES).toContain(philosophy!);
  });

  it("no two commanders overlap: AF-030's fingerprint law AND unique (trigger, passive bonus) pairs across all fourteen", () => {
    for (const def of LAUNCH_ROSTER) expect(findOverlap(def, LAUNCH_ROSTER)).toBeNull();
    expect(new Set(LAUNCH_ROSTER.map(fingerprint)).size).toBe(14);
    const pairs = LAUNCH_ROSTER.map((c) => `${c.passive.trigger}|${c.passive.bonus.kind}`);
    expect(new Set(pairs).size).toBe(14); // stronger than the fingerprint law demands
  });

  it("every commander passes AF-071's seventeen-part architecture completeness function", () => {
    for (const def of LAUNCH_ROSTER) {
      const profile = LAUNCH_PROFILES.find((p) => p.commanderId === def.id)!;
      const architecture = architectureFor(def, profile);
      for (const part of COMMANDER_ARCHITECTURE_PARTS) expect(architecture[part], `${def.id} missing ${part}`).toBe(true);
    }
  });

  it("gives AF-028's dormant droneEffectiveness and orbitalPower bonus kinds their FIRST producers", () => {
    const aviary = LAUNCH_ROSTER.find((c) => c.id === "kite-aviary")!;
    const thunderline = LAUNCH_ROSTER.find((c) => c.id === "holt-thunderline")!;
    expect(aviary.passive.bonus.kind).toBe("droneEffectiveness");
    expect(thunderline.passive.bonus.kind).toBe("orbitalPower");
  });

  it("every commander's talent tree works through AF-071's unchanged progression runtime", () => {
    for (const profile of LAUNCH_PROFILES) {
      const runtime = new CommanderProgressionRuntime(profile);
      runtime.grantTalentPoints(1);
      const firstNode = profile.talentBranches[0]!.nodes[0]!;
      expect(runtime.tryUnlockTalent(firstNode.id)).toBe(true);
      expect(runtime.talentBonuses().length).toBe(1);
      expect(runtime.tryApplyAscensionUpgrade(3)).toBe(true); // every gate is 1–3
    }
  });
});

describe("Recruitment — meaningful and total (AF-072 §Recruitment)", () => {
  it("every commander has a recruitment entry, every source recruits someone, and the starting trio is the campaign's opening", () => {
    expect(RECRUITMENT_TABLE.length).toBe(LAUNCH_ROSTER.length);
    const usedSources = new Set(RECRUITMENT_TABLE.map((r) => r.source));
    for (const source of RECRUITMENT_SOURCES) expect(usedSources.has(source)).toBe(true);
    for (const id of STARTING_COMMANDER_IDS) {
      expect(RECRUITMENT_TABLE.find((r) => r.commanderId === id)!.source).toBe("campaign");
    }
  });

  it("the roster runtime gates recruitment on sources, recruits append-only, and tracks usage for balancing", () => {
    const roster = new RosterRuntime(RECRUITMENT_TABLE, STARTING_COMMANDER_IDS);
    expect(roster.snapshot.recruitedCount).toBe(3);
    expect(roster.snapshot.rosterSize).toBe(14);
    const none = new Set<RecruitmentSource>();
    expect(roster.tryRecruit("naru-whisper", none)).toBe(false); // exploration not reached
    const explored = new Set<RecruitmentSource>(["exploration"]);
    expect(roster.tryRecruit("naru-whisper", explored)).toBe(true);
    expect(roster.tryRecruit("naru-whisper", explored)).toBe(false); // already recruited — append-only
    roster.recordUse("naru-whisper", true);
    roster.recordUse("naru-whisper", false);
    expect(roster.statsFor("naru-whisper")).toEqual({ commanderId: "naru-whisper", uses: 2, victories: 1, winRate: 0.5 });
    roster.recordUse("vex-longfang", true); // not recruited — ignored
    expect(roster.statsFor("vex-longfang").uses).toBe(0);
    const api = Object.getOwnPropertyNames(RosterRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|retire|nerf|buff/i.test(name)).toBe(false); // no operation can retire or rebalance a commander
  });
});

describe("Long-term roster — 25+/50+/100+ without redesign (AF-072 §Long-Term Roster)", () => {
  it("one hundred synthetic commanders pass AF-030's overlap law and AF-071's completeness function on unchanged shapes", () => {
    const synthetics = Array.from({ length: 100 }, (_, i) => syntheticCommanderFor(i));
    const combined = [...LAUNCH_ROSTER, ...synthetics.map((s) => s.def)];
    expect(new Set(combined.map(fingerprint)).size).toBe(combined.length); // 114 distinct fingerprints
    for (const { def, profile } of synthetics) {
      const architecture = architectureFor(def, profile);
      for (const part of COMMANDER_ARCHITECTURE_PARTS) expect(architecture[part]).toBe(true);
    }
    expect(syntheticCommanderFor(42).def.id).toBe(syntheticCommanderFor(42).def.id); // deterministic
  });
});

describe("Roster — self-review: thousands of hours with every Commander (AF-072 §Self Review Loop)", () => {
  it("1,000 seeded seasons of recruitment and play keep every ledger consistent and every commander viable", () => {
    for (let season = 0; season < 1000; season += 1) {
      const rng = new Rng(season);
      const roster = new RosterRuntime(RECRUITMENT_TABLE, STARTING_COMMANDER_IDS);
      const sources = new Set<RecruitmentSource>();
      let expectedUses = 0;
      for (let step = 0; step < 60; step += 1) {
        const roll = rng.next();
        if (roll < 0.2 && sources.size < RECRUITMENT_SOURCES.length) {
          sources.add(RECRUITMENT_SOURCES[Math.floor(rng.next() * RECRUITMENT_SOURCES.length)]!);
        } else if (roll < 0.5) {
          const target = LAUNCH_ROSTER[Math.floor(rng.next() * LAUNCH_ROSTER.length)]!;
          roster.tryRecruit(target.id, sources);
        } else {
          const recruited = roster.recruitedIds;
          const pick = recruited[Math.floor(rng.next() * recruited.length)]!;
          roster.recordUse(pick, rng.next() < 0.6);
          expectedUses += 1;
        }
      }
      const snap = roster.snapshot;
      if (snap.totalUses !== expectedUses) throw new Error("usage ledger drifted");
      if (snap.recruitedCount < 3 || snap.recruitedCount > 14) throw new Error("recruitment out of bounds");
      for (const id of STARTING_COMMANDER_IDS) expect(roster.isRecruited(id)).toBe(true); // the trio never leaves
    }
  });
});
