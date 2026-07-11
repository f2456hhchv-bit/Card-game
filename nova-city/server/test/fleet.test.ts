import { describe, expect, it } from 'vitest';
import { summarizeFleet } from '../src/domain/fleet.js';
import type { Ship, ShipClass } from '../src/types.js';

const skiff: ShipClass = {
  id: 'ship-scout-skiff',
  hullClass: 'scout',
  name: 'Scout Skiff',
  flavor: '',
  price: 300,
  firepower: 8,
  shieldHP: 20,
  cargo: 10,
  crewCapacity: 4,
};
const frigate: ShipClass = {
  id: 'ship-frigate',
  hullClass: 'frigate',
  name: 'Frigate',
  flavor: '',
  price: 2500,
  firepower: 35,
  shieldHP: 90,
  cargo: 40,
  crewCapacity: 12,
};
const classById = new Map([
  [skiff.id, skiff],
  [frigate.id, frigate],
]);

function ship(shipClassId: string): Ship {
  return { id: 'ship_x', ownerCharacterId: 'char_1', shipClassId, name: 'Test', builtAt: 0 };
}

describe('summarizeFleet', () => {
  it('returns zeroed totals for an empty fleet', () => {
    const summary = summarizeFleet([], classById);
    expect(summary).toEqual({ shipCount: 0, firepower: 0, shieldHP: 0, cargo: 0, crewCapacity: 0 });
  });

  it('sums stats across owned ships', () => {
    const summary = summarizeFleet([ship('ship-scout-skiff'), ship('ship-frigate')], classById);
    expect(summary.shipCount).toBe(2);
    expect(summary.firepower).toBe(43);
    expect(summary.shieldHP).toBe(110);
  });

  it('ignores ships whose class is unknown rather than throwing', () => {
    const summary = summarizeFleet([ship('missing-class')], classById);
    expect(summary.shipCount).toBe(0);
  });
});
