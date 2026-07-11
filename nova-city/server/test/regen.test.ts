import { describe, expect, it } from 'vitest';
import { RESOURCE_MAX, resolveStatus, settleResources, tickCharacter } from '../src/domain/regen.js';
import type { Character } from '../src/types.js';

function baseCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'char_1',
    userId: 'user_1',
    callsign: 'Test',
    level: 1,
    xp: 0,
    credits: 0,
    stats: { strength: 10, defense: 10, speed: 10, dexterity: 10 },
    resources: { fuel: 50, resolve: 50, morale: 50, health: 50, updatedAt: 0 },
    status: 'ok',
    statusUntil: null,
    locationId: 'nova-city',
    travelDestinationId: null,
    equippedWeaponId: null,
    equippedArmorId: null,
    inventory: [],
    factionId: null,
    medicAssistUsedAt: null,
    createdAt: 0,
    ...overrides,
  };
}

describe('settleResources', () => {
  it('regenerates resources proportional to elapsed time', () => {
    const pool = { fuel: 0, resolve: 0, morale: 0, health: 0, updatedAt: 0 };
    const oneMinuteLater = 60_000;
    const next = settleResources(pool, oneMinuteLater, false);
    expect(next.fuel).toBeCloseTo(2, 5);
    expect(next.morale).toBeCloseTo(1, 5);
  });

  it('caps resources at their max', () => {
    const pool = { fuel: 99, resolve: 99, morale: 99, health: 99, updatedAt: 0 };
    const farFuture = 100 * 60_000;
    const next = settleResources(pool, farFuture, false);
    expect(next.fuel).toBe(RESOURCE_MAX.fuel);
  });

  it('does not regenerate health while in hospital', () => {
    const pool = { fuel: 0, resolve: 0, morale: 0, health: 10, updatedAt: 0 };
    const next = settleResources(pool, 60_000, true);
    expect(next.health).toBe(10);
  });
});

describe('resolveStatus', () => {
  it('leaves an unexpired jail sentence in place', () => {
    const character = baseCharacter({ status: 'jail', statusUntil: 10_000 });
    const result = resolveStatus(character, 5_000);
    expect(result.status).toBe('jail');
  });

  it('releases from jail once statusUntil has passed', () => {
    const character = baseCharacter({ status: 'jail', statusUntil: 10_000 });
    const result = resolveStatus(character, 10_001);
    expect(result.status).toBe('ok');
    expect(result.statusUntil).toBeNull();
  });

  it('restores full health on release from hospital', () => {
    const character = baseCharacter({
      status: 'hospital',
      statusUntil: 10_000,
      resources: { fuel: 10, resolve: 10, morale: 10, health: 5, updatedAt: 0 },
    });
    const result = resolveStatus(character, 10_001);
    expect(result.status).toBe('ok');
    expect(result.resources.health).toBe(RESOURCE_MAX.health);
  });
});

describe('tickCharacter', () => {
  it('composes status resolution and regen in one pass', () => {
    const character = baseCharacter({
      status: 'hospital',
      statusUntil: 10_000,
      resources: { fuel: 0, resolve: 0, morale: 0, health: 5, updatedAt: 0 },
    });
    const ticked = tickCharacter(character, 70_000);
    expect(ticked.status).toBe('ok');
    expect(ticked.resources.health).toBe(RESOURCE_MAX.health);
    expect(ticked.resources.fuel).toBeGreaterThan(0);
  });
});
