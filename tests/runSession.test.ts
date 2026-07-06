import { describe, expect, it } from "vitest";
import {
  RUN_PHASES,
  advancePhase,
  createRunSession,
} from "../src/game/session/RunSession";

const config = {
  missionId: "m1",
  commanderId: "c1",
  shipId: "s1",
  weaponIds: [],
  equipmentIds: [],
  difficulty: "standard",
  ascension: 0,
  biomeId: "b1",
};

describe("RunSession (AF-016 §3/§4)", () => {
  it("starts at Spawn with the seed recorded", () => {
    const session = createRunSession(config, 1234, 0);
    expect(session.phase).toBe("Spawn");
    expect(session.seed).toBe(1234);
    expect(session.result).toBeNull();
  });

  it("advances through all eleven phases in order and stops at Results", () => {
    const session = createRunSession(config, 1, 0);
    const visited = [session.phase];
    let next = advancePhase(session);
    while (next !== null) {
      visited.push(next);
      next = advancePhase(session);
    }
    expect(visited).toEqual([...RUN_PHASES]);
    expect(advancePhase(session)).toBeNull();
  });
});
