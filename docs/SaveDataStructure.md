# AFTERLIGHT — Save Data Structure

**Last updated:** 2026-06-28 · Source of truth: `src/game/save/SaveManager.ts`

The game persists a single **profile** to `localStorage`. There is no run-state
save (runs are single-sitting by design); only meta-progression and settings
survive.

- **Storage key:** `afterlight.save.v1`
- **Current version:** `1`
- **Format:** JSON

## Schema (v1)

```ts
interface SaveData {
  version: number;            // schema version, for migration
  motes: number;              // persistent soft currency
  bestTime: number;           // best survival time, seconds
  bestKills: number;          // most kills in one run
  totalKills: number;         // lifetime kills across all runs
  runsPlayed: number;         // lifetime run count
  achievements: string[];     // unlocked achievement ids
  tutorialSeen: boolean;      // first-run coach hints shown (skipped for
                              // returning profiles via migration)
  meta: Record<string, number>; // permanent meta-upgrade levels (metaDefs id→lvl)
  wardens: string[];          // unlocked Warden ids (default ["lumen"])
  selectedWarden: string;     // active Warden id (default "lumen")
  daily: { date: string; bestTime: number; bestKills: number }; // today's Daily best
  audio: {
    master: number;           // 0..1
    sfx: number;              // 0..1
    music: number;            // 0..1 (ambience)
    muted: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    screenShake: boolean;
    damageNumbers: boolean;
    highContrast: boolean;    // reserved; UI lands in a later milestone
  };
}
```

## Compatibility & migration

- On load, an unknown/partial save is **merged onto current defaults**
  (`SaveManager.migrate`), so older saves never wipe — missing fields are
  back-filled and `version` is normalised to the current value.
- Corrupt/unparseable data falls back to a fresh default profile rather than
  crashing.
- Writes are best-effort: storage being unavailable (e.g. private browsing) is
  caught and ignored — progression is non-essential to playing.

### Versioning policy
- **Additive** changes (new optional fields): bump nothing structural; defaults
  back-fill them. Keep the same storage key.
- **Breaking** changes (renamed/removed/retyped fields): increment
  `SAVE_VERSION`, add an explicit migration step in `migrate()`, and update this
  document in the same change. Never silently discard a player's progress.

## What is intentionally NOT saved
- Mid-run state (entities, loadout, timers). A run is one sitting.
- Anything device-identifying. No analytics, no network — fully local.
