import type { Character, ResourceKey, ResourcePool } from '../types.js';

export const RESOURCE_MAX: Record<ResourceKey, number> = {
  fuel: 100,
  resolve: 100,
  morale: 100,
  health: 100,
};

/** Points regenerated per minute of real time — tuned for quick sessions, not multi-hour Torn-style waits. */
export const REGEN_PER_MINUTE: Record<ResourceKey, number> = {
  fuel: 10,
  resolve: 5,
  morale: 5,
  health: 5,
};

/**
 * Applies passive regen to a resource pool as of `now`, based on how long it's
 * been since `pool.updatedAt`. Health does not regen while `inHospital` — it is
 * restored to full instead when hospital status is cleared (see resolveStatus).
 */
export function settleResources(pool: ResourcePool, now: number, inHospital: boolean): ResourcePool {
  const elapsedMinutes = Math.max(0, (now - pool.updatedAt) / 60_000);
  const next: ResourcePool = { ...pool, updatedAt: now };
  for (const key of ['fuel', 'resolve', 'morale'] as const) {
    next[key] = Math.min(RESOURCE_MAX[key], next[key] + elapsedMinutes * REGEN_PER_MINUTE[key]);
  }
  if (!inHospital) {
    next.health = Math.min(RESOURCE_MAX.health, next.health + elapsedMinutes * REGEN_PER_MINUTE.health);
  }
  return next;
}

export interface StatusResolution {
  status: Character['status'];
  statusUntil: number | null;
  resources: ResourcePool;
  locationId?: string;
  travelDestinationId?: string | null;
}

/** Lazily expires jail/hospital/transit status once `statusUntil` has passed. */
export function resolveStatus(character: Character, now: number): StatusResolution {
  if (character.status !== 'ok' && character.statusUntil !== null && now >= character.statusUntil) {
    const resources =
      character.status === 'hospital'
        ? { ...character.resources, health: RESOURCE_MAX.health }
        : character.resources;
    const arrival: Pick<StatusResolution, 'locationId' | 'travelDestinationId'> =
      character.status === 'transit' && character.travelDestinationId
        ? { locationId: character.travelDestinationId, travelDestinationId: null }
        : {};
    return { status: 'ok', statusUntil: null, resources, ...arrival };
  }
  return { status: character.status, statusUntil: character.statusUntil, resources: character.resources };
}

/** Settles status expiry then resource regen. The single entry point routes should call before reading/mutating a character. */
export function tickCharacter(character: Character, now: number): Character {
  const statusResolved = resolveStatus(character, now);
  const resources = settleResources(statusResolved.resources, now, statusResolved.status === 'hospital');
  return {
    ...character,
    status: statusResolved.status,
    statusUntil: statusResolved.statusUntil,
    resources,
    ...(statusResolved.locationId ? { locationId: statusResolved.locationId } : {}),
    ...(statusResolved.travelDestinationId !== undefined
      ? { travelDestinationId: statusResolved.travelDestinationId }
      : {}),
  };
}
