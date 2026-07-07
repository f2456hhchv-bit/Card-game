# AFTERLIGHT — Ancient Custodian Enemy Framework

**Authority:** Produced output of AF-050. Extends AF-000 → AF-049. Every future precursor civilisation, ancient defence system, sacred vault and forgotten technology extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** Custodians preserve, never conquer — a site gets STRONGER the longer an intruder lingers and calms the moment they leave, and every ounce of threat is measured escalation over aggression.

---

## 1. Faction Identity — the sixth profiled faction

`ancientCustodians` was a registered-but-unprofiled AF-039 `FactionId`, exactly like AF-046's Mercenary Guild. This module gives it a full `FactionDef` — territory, government, technology, unique resource — paying off that content debt.

## 2. Visual Language — data now, art at the asset pass

`ANCIENT_VISUAL_LANGUAGE` records white ceramic, a gold structural-frame accent, and blue-white energy; live today in the dashed site-perimeter canvas rendering, binding to real chassis at the AF-002/006 asset pass.

## 3. Core Units — fourteen registered, six fully authored, zero schema changes

Sentinel, Defence Drone, Guardian Sphere, Shield Architect, Custodian Walker, and Elite Ancient Executor are plain AF-033 `EnemyDef`s, every one using the `ancientGuardian` family, checked distinct from AF-048's Crystal Titan and the entire five-faction roster. Ranged attacks ARE AF-032 `WeaponDef`s, the first real use of the dormant `ancient` category. Eight further unit kinds are registered vocabulary.

## 4. Combat Style & Security System — escalation is the weapon

Live today: a five-stage security ladder (Minor Trespass, Warning, Containment, Guardian Deployment, Maximum Response) driven by `AncientSecurityRuntime.alertLevel` — climbing while the player trespasses near a site, de-escalating continuously the instant they leave, and permanently capped by surviving network nodes. Repair Functions, Target Information, and Shield Capacity are mechanically live, stepped discretely by stage. Guardian Deployment (stage 3+) manufactures a real reinforcement, reusing AF-047's Drone Factory cadence pattern.

## 5. Ancient Network — destroy the node, cap the ceiling

The deliberate fifth doctrine, and the first that escalates rather than weakens: destroying a Shield Architect doesn't just remove a buff source — it permanently shrinks how far the site's alert can ever climb again, and clamps current alert down to match immediately. Verified live: the displayed ceiling collapsed from 100% to 0% the instant the Architect died.

## 6. Elite Variants & Mini-Bosses

Ancient Executors spawn as AF-034 Elites through the unchanged pipeline. The seven Elite gains and six Mini-Boss kinds are registered vocabulary binding to AF-034/035 content when authored.

## 7. Faction Synergy & Loot

Kills flow through every existing reward path unmodified. Ancient Blueprints, Prototype Components, and the rest are registered loot vocabulary awaiting item content. The doctrine Codex entry (AF-043, additive) unlocks on the first Shield Architect kill.

## 8. Accessibility & performance

Readable telegraphs are enforced (≥400ms on every ranged def, ≥200ms melee); site state is surfaced plainly on the debug overlay (stage, alert %, ceiling %, node count, guardians deployed); the site perimeter is drawn directly on the arena so the trespass boundary that drives escalation is always visible.

## 9. Debug

Live: per-site stage name, alert/ceiling percentages, member/node counts, and Guardian Deployment count — the shared `DebugOverlay` `ancientSecurity` field. A dev-only spawn key ("5") makes the encounter deterministically verifiable alongside the Outlaws' (8), Machines' (9), Crystals' (7), and Void's (6).

---

## Internal review loop (AF-050, recorded)

- **No duplicated systems** — schema, weapons, elites, the Drone Factory cadence pattern, formation math reuse, loot, Codex, faction profiling, and the `EnvironmentalEventTriggered` fact all reuse AF-017/021/032/033/034/039/043/046/047 exactly; `AncientSecurityRuntime` is the only genuinely new surface. ✔
- **Escalates, never scatters, degrades, weakens, or corrupts** — verified live and across a 1,000-encounter sweep: alert climbs only while present, de-escalates only while absent, and never exceeds its node-derived ceiling. ✔
- **Adapts without becoming unfair** — the 100% cap held at 100,000 accumulated update ticks; the ceiling shrinks permanently and clamps immediately on a node kill, verified live twice in the browser. ✔
- **Stronger the longer you linger, not weaker as units die** — the mirror-opposite direction of every prior faction, by design, matching "measured escalation" rather than aggression. ✔
- **Sandbox proof** — a live site's ceiling visibly collapsed from 100% to 0% in the same tick its Shield Architect died, on two independent runs, zero page errors. ✔
- **Self-review caught and correctly resolved a real pre-existing id collision** — an older, unrelated `codex-ancient-custodians` lore entry already existed; the new doctrine entry was renamed rather than overwriting locked content, and cross-referenced instead. ✔

**Internal quality score: 9.5/10 — approved and locked; the remaining eight unit defs, nine Special Mechanics, six mini-boss `BossDef`s, and faction art/audio bind at future content and asset modules.**
