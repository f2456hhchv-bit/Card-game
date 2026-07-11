import type { Ship, ShipClass } from '../types.js';

export interface FleetSummary {
  shipCount: number;
  firepower: number;
  shieldHP: number;
  cargo: number;
  crewCapacity: number;
}

const EMPTY_SUMMARY: FleetSummary = { shipCount: 0, firepower: 0, shieldHP: 0, cargo: 0, crewCapacity: 0 };

export function summarizeFleet(ownedShips: Ship[], shipClassById: Map<string, ShipClass>): FleetSummary {
  return ownedShips.reduce((acc, ship) => {
    const cls = shipClassById.get(ship.shipClassId);
    if (!cls) return acc;
    return {
      shipCount: acc.shipCount + 1,
      firepower: acc.firepower + cls.firepower,
      shieldHP: acc.shieldHP + cls.shieldHP,
      cargo: acc.cargo + cls.cargo,
      crewCapacity: acc.crewCapacity + cls.crewCapacity,
    };
  }, EMPTY_SUMMARY);
}
