# AFTERLIGHT — Progression Systems

**Last updated:** 2026-06-29

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
| Tidal Charm | +12%×lvl Projectile Speed | 5 |
| Echo Stone | +1×lvl Extra Projectiles (build-defining) | 2 |

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

### Light Motes & the Shop ✅
Soft currency earned per run: `floor((seconds·0.5 + kills·0.2) · fortuneMult)`.
Persisted in the save profile (`save.motes`).

The **Shop** (main menu → Shop) spends Motes on **permanent meta-upgrades** that
apply to the Warden's *base* stats at the start of every future run — the
long-term "one more run" hook. Source of truth: `src/game/data/metaDefs.ts`;
purchase state in `save.meta` (id → level). Each upgrade has escalating costs.

| Upgrade | Effect / level | Max |
| --- | --- | --- |
| Might | +5% damage | 5 |
| Vigor | +8 Max HP | 5 |
| Haste | +4% move speed | 5 |
| Alacrity | +4% attack speed | 5 |
| Greed | +6% XP gain | 5 |
| Resilience | +3% armor | 5 |
| Magnetism | +12 pickup radius | 5 |
| Recovery | +0.3 regen/s | 3 |
| Fortune | +8% Motes earned (compounds the economy) | 5 |

Meta upgrades apply in `Loadout.recomputeStats` (base → meta → in-run relics),
wired via `World.metaLevels` which `Game` sets from the save each run.

### Wardens ✅ (character select)
Source of truth: `src/game/data/wardenDefs.ts`. Each **Warden** is a playable
character with a different **starting weapon** and a small permanent **perk**
(stat tilt). The first (Lumen) is free; others are unlocked with Light Motes.
Selection + unlock state live in the save (`selectedWarden`, `wardens[]`).

| Warden | Starter | Perk | Unlock |
| --- | --- | --- | --- |
| Lumen | Lumen Bolt | Balanced | free |
| Vesper | Prism Shards | +15% Area, −10 Max HP | 250 |
| Pyre | Nova Pulse | +12% Damage, −8% Move Speed | 350 |
| Surge | Arc Coil | +12% Attack Speed, −15 Max HP | 350 |

The perk applies in `Loadout.recomputeStats` in the order **base → Warden perk →
meta upgrades → in-run relics**. Selected via the main-menu **Wardens** screen.

### Ship Gear, Sets & the Hangar ✅ (inventory + merge + set bonuses)
The Guardian is a **starship**, so its equippable gear is **ship systems**. Rather
than one fixed module per slot, the player builds an **inventory** of many items
and equips **one per slot** (Hull / Core / Engines / Wings). Source of truth:
`src/game/data/gearDefs.ts`; state in `save.gear` (`inventory` id→`{grade,dupes}`
and `equipped` slot→itemId).

There are **4 sets × 4 slots = 16 items**. Each item grants its **slot's** stat,
scaled by grade:

| Slot | Stat per grade |
| --- | --- |
| Hull 🛡 | +6 Max HP, +1.5% armour |
| Core ⚛ | +3.5% damage |
| Engines 🚀 | +2.5% move speed, +8 pickup radius |
| Wings 🪽 | +2.5% attack speed, +2% area |

**Sets** add a payoff for collecting + equipping matching pieces (2-piece and a
big 4-piece bonus that grants a signature perk):

| Set | 2-piece | 4-piece (full set) |
| --- | --- | --- |
| Salvager | +6% XP gain | +8% damage & +25 Max HP |
| Solaris | +8% damage | **Overdrive** light pulse + 12% damage |
| Bastion | +30 Max HP | **Aegis** revive (survive a lethal hit) + 6% armour |
| Zephyr | +8% move speed | **Salvo** +1 projectile on every weapon & +0.25s i-frames |

**Acquisition & merge loop:** every run drops one random **item** at game over
(`SaveManager.grantItemDrop`). The **first** of an item *unlocks* it at **grade 1**
(and auto-equips if its slot is empty); duplicates **bank as cores**. In the
**Hangar** you **equip** items into slots and **merge** banked cores to raise an
item's grade — `mergeCost(grade) = grade`, so **1+2+3+4 = 10 cores** to max one
item to grade 5. The Hangar groups items by set, shows 2pc/4pc bonuses, and the
equipped panel surfaces which set bonuses are currently active.

Gear applies in `Loadout.recomputeStats` in the order **base → Warden perk → meta
upgrades → equipped gear + set bonuses → in-run relics** (`applyGear`), wired via
`World.gearEquipped`/`gearInventory` which `Game` sets from the save each run.
Perk runtime lives in `World`: Aegis (`revivesLeft` + revive in `damagePlayer`),
Overdrive (`updateOverdrive` pulse, drawn by `GameRenderer.drawPulse`), Slipstream
i-frames (`p.stats.iframes`), Salvo (`extraProjectiles`).

> **Daily Run footing:** gear, like meta-upgrades, is stripped for the Daily Run
> (`gearEquipped = emptyEquip()`) so it stays an equal-footing challenge. Item
> drops are still *earned* from a daily's end-of-run salvage.

### Stages ✅ (distinct battlegrounds)
Source of truth: `src/game/data/stageDefs.ts`; selection in `save.selectedStage`.
Each stage has its own **palette** (sky/nebula/fog/star colours, baked by
`Background.setStage`) and **enemy pool** (`SpawnDirector.reset(pool)`).

| Stage | Unlock | Palette | Pool flavour |
| --- | --- | --- | --- |
| The Fade | free | deep indigo void | full base bestiary |
| Ember Wastes | fell 1 boss (lifetime) | burning red/orange | faster, fiercer — adds **Cinder** & **Revenant** |

Chosen from the main-menu **stage chips** (locked stages show their requirement).
The Daily Run is always **The Fade** for equal footing. New stage-2 enemies live
in `enemyDefs.ts`; their sprites reuse fitting silhouettes with hot hues.

### Daily Run ✅
A once-a-day challenge seeded from the **local calendar date**
(`Rng.seedFromString("YYYY-MM-DD")` → `World.reseed`), so the run's generated
content is the same for a given day. It is played on **equal footing** — the
default Warden (Lumen) and **no permanent meta-upgrades** — making it a pure
skill challenge rather than a meta-power flex. The day's **best time/kills** are
tracked in `save.daily` (reset when the date rolls over) and shown on the menu.

> Note: this is *seed-based* (everyone gets the same daily seed), not lockstep-
> identical across players — fully verified identical outcomes would need replay
> validation, which is out of scope. Determinism of the seed → spawn stream is
> unit-tested.

**Planned (M3+):** stage modifiers, more Wardens/weapons, daily streaks.

### Records & Achievements ✅
- **Records screen** (main menu → Records): lifetime aggregates — best time, most
  felled, runs, total felled, bosses slain, time played — plus the full
  achievement grid (unlocked lit, locked dimmed with a lock). Lifetime totals
  live in `save.lifetime`, updated by `recordRun`.
- **Achievements** (12, in `achievementDefs.ts`): each has a `check(ctx)`
  predicate over the just-finished run + lifetime/profile totals. Awarded the
  moment they're satisfied — checked at game over and on key events (boss defeat,
  weapon evolution) for immediate **toast** notifications. Examples: First Light,
  Centurion (100/run), Swarmbreaker (400/run), Keeper (5m), Lightwarden (10m),
  Ascendant (lvl 20), Boss Slayer, Hollowbane (5 bosses lifetime), Transcendent
  (evolve), Devotee (daily), Collector (all Wardens), Investor (10 meta levels).

See `docs/SaveDataStructure.md` for the persisted schema.

---

## Planned progression work
- **Weapon Evolution** (M2): ✅ shipped — mastered weapon + paired relic → evolved form.
- **Daily Run** (M3): deterministic offline seed from the date.
- **Unlock economy tuning** (M3): Mote earn/spend balance once the shop exists.
