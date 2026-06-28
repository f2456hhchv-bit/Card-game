# AFTERLIGHT — Game Design Document

**Status:** Living document · **Version:** 0.1 · **Last updated:** 2026-06-28

This is the single source of truth for AFTERLIGHT's design. When gameplay and
this document disagree, that is a bug in one of them — reconcile before moving
on.

---

## 1. Vision

AFTERLIGHT is an offline, single-player **bullet-heaven survival roguelite**. A
run is a tense, escalating fight for survival against an endless tide of
enemies, where the player's power compounds through in-run upgrade drafts until
they feel briefly, gloriously unstoppable — and then the difficulty catches up.

The core fantasy: **a lone keeper of light holding back an ocean of dark.** Each
run is a candle burning down. How long can you hold?

### Pillars

1. **Effortless to control, deep to master.** One input (movement). All the
   depth is in positioning and build decisions.
2. **Compounding power.** The dopamine of a build coming together — weapons
   evolving, screen-clearing combos emerging from drafted synergies.
3. **Readable chaos.** Hundreds of enemies on screen that remain legible through
   colour, motion, and restraint in visual noise.
4. **Respect the player.** No monetisation, no dark patterns, no grind walls.
   Difficulty and reward, nothing else.

---

## 2. The Loop

### Moment-to-moment (seconds)
Move to dodge and herd enemies → weapons auto-fire → enemies die → drop XP
shards → collect shards → fill XP bar.

### Run-to-run minute (minutes)
Level up → **draft** one of three weapons/relics → power spikes → enemies scale
up → new enemy types and elites appear → survive surges → eventually fall.

### Meta (sessions)
Earn **Light Motes** from each run based on time survived and kills → spend on
permanent unlocks (planned) → chase achievements, best-time, and best-kills
records → take on Daily Runs (planned, offline-seeded).

---

## 3. World & Theme

- **Setting:** The last lit reach of a world being swallowed by the *Umbral
  Tide*. Light is finite and precious.
- **The Warden (player):** A vessel that channels stored light into weapons. Its
  body is a faceted light-core surrounded by a soft halo.
- **The Hollow (enemies):** Silhouetted, desaturated shard-creatures of the
  dark. They are drawn to light and seek to extinguish the Warden.
- **Tone:** Melancholy but defiant. Beautiful light against oppressive dark.

Art direction: **procedural neon-on-void vector art**. Luminous additive-blended
projectiles and effects; dark, low-saturation enemies; a parallax dot-field
void. No bitmap assets. See `docs/ArchitectureNotes.md` for the rendering model.

---

## 4. Player Character

The Warden has a **derived stat block** built from base stats plus all owned
relics (see `docs/ProgressionSystems.md` and `src/game/entities/Player.ts`):

- Max HP, Move Speed, Regen, Armor
- Damage, Attack Speed, Area, Projectile Speed, Extra Projectiles, Crit
- Pickup Radius, XP Gain, Light radius

Movement is direct (no acceleration/inertia) for crisp, responsive control —
essential in a genre about precise positioning.

---

## 5. Combat

- **Auto-attacking:** All weapons fire automatically on their own cooldowns.
- **Weapons:** Each has 8 levels with escalating stats and behaviour. Patterns:
  *nearest-target volley, spread fan, radial nova, orbiting orbs, damage aura.*
  See `docs/WeaponCatalogue.md`.
- **Damage model:** `damage = base × damageMult`, with crit rolls multiplying by
  `critMult`. Knockback scales with the hitting source.
- **Enemy contact:** Touching an enemy deals its damage to the Warden, then a
  short per-enemy cooldown prevents per-frame draining. The Warden gets brief
  invulnerability after each hit.
- **Feedback:** Damage numbers, hit-flash, death bursts, screen shake, and
  procedural SFX on every meaningful event.

---

## 6. Enemies

Archetypes drive distinct movement AI: `chase`, `charger`, `orbiter`, and
`shooter` (ranged, fires hostile projectiles). Elites are larger, tankier, hit
harder, and drop generous loot. See `docs/EnemyCatalogue.md`.

The **Spawn Director** (`src/game/SpawnDirector.ts`) governs pacing: a smoothly
rising spawn rate and enemy stat scale, periodic **surges** of heavy pressure,
and scheduled **elite** spawns. A soft enemy cap protects performance.

**Bosses ✅** are marquee, multi-phase encounters (`BossController`) that arrive
every 3 minutes. They telegraph each attack with a glowing wind-up, are immune
to knockback, wear a dedicated HUD health bar, and summon adds between phases.
The first boss, **The Maw**, has three escalating phases. On defeat they shower
generous loot. **Enemy projectiles** (`EnemyProjectile`) are pooled, hostile,
and tested against the Warden.

---

## 7. Progression (in-run)

- **XP & Levels:** Enemies drop XP shards; collecting them fills the XP bar. The
  XP-to-next curve rises smoothly so level-ups stay frequent but gradually slow.
- **Draft:** Each level-up pauses the action and offers three choices: new
  weapons, weapon upgrades, new relics, or relic upgrades. Six weapon slots and
  six relic slots.
- **Weapon Evolution ✅:** Maxed weapons paired with a specific relic (L3+)
  evolve into a powered-up signature form — the genre's signature build payoff.
  Evolution-ready weapons guarantee a golden draft card. See
  `docs/WeaponCatalogue.md` for pairings.

---

## 8. Progression (meta)

- **Light Motes:** Soft currency earned per run.
- **Unlocks (planned):** New starting Wardens, starting weapons, and stage
  modifiers purchased with Motes.
- **Achievements:** Milestone goals (survive N minutes, fell N enemies, reach
  level N). Tracked in the save profile.
- **Records:** Best survival time and most kills, shown on the main menu.

---

## 9. Game States

`menu → playing → (draft ↔ playing) → (paused ↔ playing) → gameover → menu`

The simulation only advances during `playing`. Drafts and pauses freeze the
world entirely for a clean "time stop" feel. See `src/game/Game.ts`.

---

## 10. Accessibility

First-class, in settings: master/SFX/ambience volume + mute, screen-shake
toggle, reduce-motion (also auto-detected from the OS), damage-number toggle,
and a performance overlay. High-contrast mode is planned. Controls work on
keyboard and touch with no configuration.

---

## 11. Non-Goals

No multiplayer, ads, microtransactions, battle pass, energy, loot boxes, or any
pay-to-win mechanic — permanently. These are design constraints, not omissions.

---

## 12. Open Design Questions

Tracked in `docs/Roadmap.md` and the milestone backlog. Current biggest ones:
weapon-evolution pairing rules, boss cadence, and the meta-unlock economy
tuning. These will be resolved as their milestones come up.
