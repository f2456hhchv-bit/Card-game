# AFTERLIGHT — Progression Systems

**Last updated:** 2026-06-28

Covers both in-run progression and persistent meta-progression.

---

## In-run progression

### Experience & leveling
- Enemies drop **XP shards** on death (value = enemy `xpValue`, ×8 for elites).
- Collected XP is multiplied by the Warden's `xpMult` relic stat.
- **XP-to-next curve:** `round(5 + level·4 + level²·0.7)`.
  - L1→2: 9 · L2→3: ~16 · L5→6: ~42 · L10→11: ~115.
  - Designed to keep early level-ups fast (build momentum) and slow gradually so
    later picks feel earned. Tunable; see `World.checkLevelUp()`.
- Multiple level-ups from one pickup queue sequentially; each opens a draft.

### The Draft
On level-up the world freezes and offers **3** options sampled from the pool of
all currently-valid choices:
- **New weapon** (if a weapon slot is free)
- **Weapon upgrade** (owned, not maxed)
- **New relic** (if a relic slot is free)
- **Relic upgrade** (owned, not maxed)
- **★ Evolution ★** (a mastered weapon's paired relic requirement is met) —
  *guaranteed* to appear when available, rendered as a distinct golden card.

If *everything* is maxed, the level-up converts to a small heal so it's never a
dead pick. Logic in `Loadout.rollDraft()` / `Game.openDraftIfPending()`.

### Weapon Evolution ✅
A weapon at **max level (8)** whose **paired relic is owned at level 3+** can
**evolve** into a signature form (e.g. Lumen Bolt + Keen Edge → *Sunlance*).
Evolving replaces the base weapon in-place at level 1 and keeps the relic.
Evolved forms are far stronger, have their own 5-level track, and never appear
as fresh weapon picks. Full pairing table: `docs/WeaponCatalogue.md`. Logic in
`Loadout.getEvolutions()` and `applyDraft("weapon-evolve")`.

### Relics (passives)
Source of truth: `src/game/data/passiveDefs.ts`. Each has up to 5 levels.

| Relic | Effect per level | Max |
| --- | --- | --- |
| Vital Core | +20×lvl Max HP | 5 |
| Swift Stride | +8%×lvl Move Speed | 5 |
| Focusing Lens | +10%×lvl Damage | 5 |
| Quickening Charm | +8%×lvl Attack Speed | 5 |
| Resonator | +10%×lvl Area | 5 |
| Lodestone | +28×lvl Pickup Radius | 5 |
| Ember Heart | +0.6×lvl HP Regen/s | 5 |
| Ward Plate | +5%×lvl Armor (capped 85%) | 5 |
| Keen Edge | +4%×lvl Crit, +10%×lvl Crit Dmg | 5 |
| Scholar's Mark | +12%×lvl XP Gain | 5 |

Stats recompute from base + all relics whenever the loadout changes
(`Loadout.recomputeStats`), never per-frame.

### Pickups
| Pickup | Effect |
| --- | --- |
| XP shard | Grants XP. Homes in once within pickup radius. |
| Heal | Restores HP (12 normal / 30 from elites). |
| Magnet | Pulls every pickup on the field to the Warden. |
| Bomb | Detonates, destroying all on-screen enemies. |

Special drop chances are far higher from elites (see `World.dropLoot`).

---

## Meta-progression (persistent)

### Light Motes
Soft currency earned per run: `floor(seconds·0.5 + kills·0.2)`. Persisted in the
save profile. **Shop (M3)** will spend Motes on permanent unlocks: alternate
Wardens, starting weapons, and stage modifiers.

### Records & Achievements
- **Records:** best survival time, most kills — shown on the main menu.
- **Achievements** (current): `centurion` (100 kills), `five-minute-vigil`,
  `ten-minute-vigil`, `ascendant` (reach level 20). Stored as unlocked ids.

See `docs/SaveDataStructure.md` for the persisted schema.

---

## Planned progression work
- **Weapon Evolution** (M2): ✅ shipped — mastered weapon + paired relic → evolved form.
- **Daily Run** (M3): deterministic offline seed from the date.
- **Unlock economy tuning** (M3): Mote earn/spend balance once the shop exists.
