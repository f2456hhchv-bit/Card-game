import { describe, expect, it } from "vitest";
import { Rng } from "../src/core/rng/Rng";
import {
  COMMANDER_ARCHETYPES,
  SANDBOX_COMMANDERS,
  findOverlap,
  fingerprint,
} from "../src/game/commanders/commanderData";
import {
  ABILITY_STRUCTURE_STAGES,
  COMMANDER_ARCHITECTURE_PARTS,
  COMMANDER_CLASSES,
  COMMANDER_CLASS_TO_ARCHETYPE,
  COMMANDER_COSMETIC_KINDS,
  COMMANDER_PROGRESSION_KINDS,
  FRAMEWORK_COMMANDERS,
  FRAMEWORK_PROFILES,
  PERSONAL_MISSION_BEATS,
  RELATIONSHIP_SUBJECTS,
  ROSTER_TARGET,
  TALENT_NODE_KINDS,
  architectureFor,
} from "../src/game/commanders/commanderFrameworkData";
import { CommanderProgressionRuntime } from "../src/game/commanders/CommanderProgressionRuntime";
import { SANDBOX_CODEX_ENTRIES } from "../src/game/codex/codexData";

function profileFor(commanderId: string) {
  return FRAMEWORK_PROFILES.find((p) => p.commanderId === commanderId)!;
}

describe("Commander Framework vocabulary — registered shelves (AF-071)", () => {
  it("registers eight classes, seventeen architecture parts, seven ability stages, six talent kinds, six mission beats, seven progression kinds, six relationship subjects, seven cosmetic kinds", () => {
    expect(COMMANDER_CLASSES.length).toBe(8);
    expect(COMMANDER_ARCHITECTURE_PARTS.length).toBe(17);
    expect(ABILITY_STRUCTURE_STAGES.length).toBe(7);
    expect(TALENT_NODE_KINDS.length).toBe(6);
    expect(PERSONAL_MISSION_BEATS.length).toBe(6);
    expect(COMMANDER_PROGRESSION_KINDS.length).toBe(7);
    expect(RELATIONSHIP_SUBJECTS.length).toBe(6);
    expect(COMMANDER_COSMETIC_KINDS.length).toBe(7);
  });

  it("every class maps totally onto AF-030's locked archetype shelf — a naming layer, never a redesign", () => {
    for (const cls of COMMANDER_CLASSES) expect(COMMANDER_ARCHETYPES).toContain(COMMANDER_CLASS_TO_ARCHETYPE[cls]);
  });

  it("registers the 12–16 release roster target; the framework ships three fully profiled commanders proving the architecture", () => {
    expect(ROSTER_TARGET.min).toBe(12);
    expect(ROSTER_TARGET.max).toBe(16);
    expect(FRAMEWORK_COMMANDERS.length).toBe(3); // AF-030's pair + AF-071's scientist, additively
    expect(FRAMEWORK_COMMANDERS.slice(0, 2)).toEqual(SANDBOX_COMMANDERS); // the locked roster is untouched
    expect(FRAMEWORK_PROFILES.length).toBe(FRAMEWORK_COMMANDERS.length);
  });
});

describe("Nothing is left undefined (AF-071 §Commander Architecture)", () => {
  it("all seventeen architecture parts are present for every profiled commander", () => {
    for (const def of FRAMEWORK_COMMANDERS) {
      const architecture = architectureFor(def, profileFor(def.id));
      for (const part of COMMANDER_ARCHITECTURE_PARTS) {
        expect(architecture[part], `${def.id} missing ${part}`).toBe(true);
      }
    }
  });

  it("the seven-stage ability structure is complete: AF-030's four hooks plus secondary ability, mastery passive, and ascension upgrade", () => {
    for (const def of FRAMEWORK_COMMANDERS) {
      const profile = profileFor(def.id);
      expect(def.passive).toBeDefined(); // passive
      expect(def.active).toBeDefined(); // abilityOne
      expect(profile.secondaryAbility.cooldownMs).toBeGreaterThan(0); // abilityTwo
      expect(def.ultimate.chargeRequired).toBeGreaterThan(0); // ultimate
      expect(def.signature.tag.length).toBeGreaterThan(0); // signatureMechanic
      expect(profile.masteryPassive).toBeDefined(); // masteryPassive
      expect(profile.ascensionUpgrade.requiredAscensionLevel).toBeGreaterThan(0); // ascensionUpgrade — the AF-069 gate
    }
  });

  it("no two commanders overlap — AF-030's own fingerprint law holds across the extended roster", () => {
    for (const def of FRAMEWORK_COMMANDERS) expect(findOverlap(def, FRAMEWORK_COMMANDERS)).toBeNull();
    expect(new Set(FRAMEWORK_COMMANDERS.map(fingerprint)).size).toBe(FRAMEWORK_COMMANDERS.length);
  });
});

describe("Talent trees — three branches, six kinds each, AF-028 bonuses (AF-071 §Talent Trees)", () => {
  it("every commander has exactly three branches, each carrying all six node kinds", () => {
    for (const profile of FRAMEWORK_PROFILES) {
      expect(profile.talentBranches.length).toBe(3);
      for (const branch of profile.talentBranches) {
        expect(new Set(branch.nodes.map((n) => n.kind)).size).toBe(TALENT_NODE_KINDS.length);
        for (const node of branch.nodes) expect(node.bonus.value).not.toBe(0); // real AF-028 bonuses, no dead nodes
      }
    }
  });

  it("branches support hybrid builds: nodes unlock across branches in any order; only endgame nodes require branch investment", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("reyes-longlight"));
    runtime.grantTalentPoints(5);
    expect(runtime.tryUnlockTalent("reyes-longlight:doctrine:combat")).toBe(true);
    expect(runtime.tryUnlockTalent("reyes-longlight:salvo:mobility")).toBe(true); // second branch immediately
    expect(runtime.tryUnlockTalent("reyes-longlight:vanguard:economy")).toBe(true); // third branch too
    expect(runtime.snapshot.branchesTouched).toBe(3); // a hybrid build
    expect(runtime.tryUnlockTalent("reyes-longlight:doctrine:endgameNode")).toBe(false); // needs 3 in-branch
    expect(runtime.tryUnlockTalent("reyes-longlight:doctrine:utility")).toBe(true);
    expect(runtime.tryUnlockTalent("reyes-longlight:doctrine:economy")).toBe(true);
    runtime.grantTalentPoints(1);
    expect(runtime.tryUnlockTalent("reyes-longlight:doctrine:endgameNode")).toBe(true); // specialisation earned
  });

  it("talent bonuses aggregate and are cached until the build changes (§Performance)", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("vek-ironhull"));
    runtime.grantTalentPoints(2);
    runtime.tryUnlockTalent("vek-ironhull:rampart:combat");
    const first = runtime.talentBonuses();
    expect(first.length).toBe(1);
    expect(runtime.talentBonuses()).toBe(first); // same reference — cached
    runtime.tryUnlockTalent("vek-ironhull:anchor:utility");
    const second = runtime.talentBonuses();
    expect(second).not.toBe(first); // build changed, cache invalidated
    expect(second.length).toBe(2);
  });
});

describe("Personal missions, relationships, ascension (AF-071 §Personal Missions, §Relationships, §Ability Structure)", () => {
  it("personal missions advance strictly through the six beats and then complete", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("vael-meridian"));
    for (const beat of PERSONAL_MISSION_BEATS) {
      const mission = runtime.advanceMissionBeat();
      expect(mission?.beat).toBe(beat);
    }
    expect(runtime.advanceMissionBeat()).toBeNull();
    expect(runtime.snapshot.missionBeat).toBe("complete");
  });

  it("relationships are dialogue-only by shape and every target resolves to a real codex entry or commander", () => {
    const codexIds = new Set(SANDBOX_CODEX_ENTRIES.map((e) => e.id));
    const commanderIds = new Set(FRAMEWORK_COMMANDERS.map((c) => c.id));
    for (const profile of FRAMEWORK_PROFILES) {
      for (const relationship of profile.relationships) {
        expect(RELATIONSHIP_SUBJECTS).toContain(relationship.subject);
        expect(codexIds.has(relationship.targetId) || commanderIds.has(relationship.targetId)).toBe(true);
        // Dialogue, not gameplay balance: a subject, a target, a hint — no bonus field exists.
        expect(Object.keys(relationship).sort()).toEqual(["dialogueHint", "subject", "targetId"]);
      }
    }
  });

  it("the ascension upgrade unlocks its linked talent node free at the AF-069 gate, exactly once", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("reyes-longlight"));
    expect(runtime.tryApplyAscensionUpgrade(0)).toBe(false); // below the gate
    expect(runtime.tryApplyAscensionUpgrade(1)).toBe(true); // Ascension I reached
    expect(runtime.isUnlocked("reyes-longlight:doctrine:endgameNode")).toBe(true); // free, without points
    expect(runtime.tryApplyAscensionUpgrade(5)).toBe(false); // once only
    const api = Object.getOwnPropertyNames(CommanderProgressionRuntime.prototype);
    for (const name of api) expect(/remove|delete|revoke|reset|respec/i.test(name)).toBe(false); // append-only progression
  });
});

describe("GP-003 §Commanders — save/load round-trips (progression never resets)", () => {
  it("toSave/loadSave round-trips talent points, unlocked nodes, mission beat, and ascension", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("reyes-longlight"));
    runtime.grantTalentPoints(3);
    runtime.tryUnlockTalent("reyes-longlight:doctrine:combat");
    runtime.advanceMissionBeat();
    runtime.tryApplyAscensionUpgrade(1);
    const saved = runtime.toSave();

    const restored = new CommanderProgressionRuntime(profileFor("reyes-longlight"));
    restored.loadSave(saved);
    expect(restored.snapshot).toEqual(runtime.snapshot);
    expect(restored.isUnlocked("reyes-longlight:doctrine:combat")).toBe(true);
  });

  it("drops unknown talent node ids on load rather than throwing (deprecation-safe)", () => {
    const runtime = new CommanderProgressionRuntime(profileFor("vek-ironhull"));
    runtime.loadSave({ talentPoints: 2, unlockedNodeIds: ["not-a-real-node"], missionBeatIndex: 0, ascensionUpgradeApplied: false });
    expect(runtime.isUnlocked("not-a-real-node")).toBe(false);
    expect(runtime.snapshot.talentsUnlocked).toBe(0);
  });
});

describe("Commander Framework — self-review: build diversity (AF-071 §Self Review Loop)", () => {
  it("1,000 seeded careers spend points across random branches — every build is valid, hybrid-capable, and never overspends", () => {
    for (let career = 0; career < 1000; career += 1) {
      const rng = new Rng(career);
      const profile = FRAMEWORK_PROFILES[career % FRAMEWORK_PROFILES.length]!;
      const runtime = new CommanderProgressionRuntime(profile);
      const allNodeIds = profile.talentBranches.flatMap((b) => b.nodes.map((n) => n.id));
      let granted = 0;
      let spent = 0;
      for (let step = 0; step < 40; step += 1) {
        if (rng.next() < 0.5) {
          runtime.grantTalentPoints(1);
          granted += 1;
        } else {
          const nodeId = allNodeIds[Math.floor(rng.next() * allNodeIds.length)]!;
          if (runtime.tryUnlockTalent(nodeId)) spent += 1;
        }
        const snap = runtime.snapshot;
        if (snap.talentPoints !== granted - spent) throw new Error("point ledger drifted");
        if (snap.talentsUnlocked !== spent) throw new Error("unlock ledger drifted");
      }
      expect(runtime.talentBonuses().length).toBe(spent); // every spent point is a live AF-028 bonus
    }
  });
});
