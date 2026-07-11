export interface GameEvents {
  levelUp: { level: number };
  waveStart: { wave: number; label: string };
  bossSpawned: { name: string };
  bossDefeated: { name: string; wave: number };
  gameOver: { wave: number; level: number; motesCollected: number; motesRetained: number };
}
