import { describe, expect, it } from 'vitest';
import { isNpcDefeated } from '../src/domain/npc.js';
import type { NpcEnemy } from '../src/types.js';

function npc(overrides: Partial<NpcEnemy> = {}): NpcEnemy {
  return {
    id: 'npc_1',
    name: 'Test Enemy',
    flavor: '',
    locationId: 'nova-city',
    tier: 1,
    stats: { strength: 10, defense: 10, speed: 10, dexterity: 10 },
    minReward: 10,
    maxReward: 20,
    xp: 5,
    respawnMinutes: 2,
    defeatedUntil: null,
    ...overrides,
  };
}

describe('isNpcDefeated', () => {
  it('is not defeated when defeatedUntil is null', () => {
    expect(isNpcDefeated(npc({ defeatedUntil: null }), 1000)).toBe(false);
  });

  it('is defeated while now is before defeatedUntil', () => {
    expect(isNpcDefeated(npc({ defeatedUntil: 5000 }), 1000)).toBe(true);
  });

  it('is available again once now reaches defeatedUntil', () => {
    expect(isNpcDefeated(npc({ defeatedUntil: 5000 }), 5000)).toBe(false);
    expect(isNpcDefeated(npc({ defeatedUntil: 5000 }), 6000)).toBe(false);
  });
});
