import type { NpcEnemy } from '../types.js';

export function isNpcDefeated(npc: NpcEnemy, now: number): boolean {
  return npc.defeatedUntil !== null && now < npc.defeatedUntil;
}
