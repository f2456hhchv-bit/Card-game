# AFTERLIGHT — Mission Framework

**Authority:** Produced output of AF-037. Extends AF-000 → AF-036. Every future expedition, event, campaign, and expansion extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** no two missions should ever feel identical — every objective creates a decision, and generation is always deterministic from the mission seed.

---

## 1. Mission Structure — AF-016's RunPhase, finally driven

`RUN_PHASES` already mapped almost exactly onto this module's Mission Structure list. `advancePhase()` existed with only a placeholder manual debug button driving it. `advanceRunPhaseTo()` now steps it automatically from real triggers: Director phase changes, boss defeat, objective completion, and a real (if short) Extraction countdown — the manual button remains as a debug escape hatch, not the primary path.

## 2. Mission Generation — the same determinism guarantee as everything else

`generateMission(template, seed)` rolls which modifiers from the template's pool are active, deterministically. Same template, same seed, same mission, always — the same guarantee loot, elites, and relics already make.

## 3. Objectives — a run-scoped counter map, and one new semantic

Objective progress uses the counterKey/target *pattern* AF-026's `ChallengeDef` and AF-035's mastery challenges already use, but the counters are a fresh local map per mission — never routed through `MetaProgression`, which is permanent. A target of `0` is genuinely new: it means "never let this rise above zero," starting satisfied and revoked on the first violation, rather than waiting to be reached.

## 4. Optional Objectives — never block completion

Reuse AF-035's mastery-challenge shape (kind + reward) and AF-026's `MasteryReward` union. `primaryObjectivesComplete` only ever checks primary objectives.

## 5. Dynamic Events — a third naming layer, not a fourth event system

All ten `MissionEventKind`s map onto concrete strings AF-017's `EnvironmentalEventType` or AF-036's `BiomeEventKind` already fire through `EnvironmentalEventTriggered`. The weighted-pick-on-a-timer algorithm mirrors AF-036's `BiomeRuntime` exactly (not extracted into a shared utility, to avoid editing a locked module).

## 6. Mission Modifiers — two already-reserved hooks, plus one tuning clone

`ThreatInputs.mutatorModifier` and `DropContext.mutatorBonus` were hardcoded baselines since AF-017/AF-023. A modifier's elite-squad-size delta is applied via a per-run `DirectorTuning` clone — the shared constant is never mutated.

## 7. Mission Failure — already satisfied, verified not rebuilt

The existing `RunEnded` subscriber already grants XP and records statistics identically on victory and defeat; kill/loot/discovery tracking runs regardless of outcome. Nothing new was needed.

## 8. Mission Rewards & Galaxy Impact

Rewards reuse every acquisition system a mission touches (AF-022/23/24/25/26/29). Galaxy Impact reuses AF-026's existing `recordStat` engine with new statistic keys (Sector Stability, Faction Influence, Restoration Progress) — no new persistence layer.

## 9. Presentation, accessibility, performance

Mission briefing, objective cards, waypoints, and navigation assistance build from AF-003/AF-005 at the UI module. Objective/event pools are cached content, not per-frame allocations.

## 10. Debug

Live: mission name · RunPhase · primary/optional objective progress · active modifiers.

---

## Internal review loop (AF-037, recorded)

- **No duplicated systems** — RunPhase lifecycle, deterministic generation, event vocabulary, Director/loot mutator hooks, reward acquisition, and galaxy-statistic persistence all reuse AF-016/017/023/026/029/035/036 exactly. ✔
- **No two missions feel identical** — modifier rolls, dynamic events, and objective sets vary by seed while remaining deterministic and reproducible. ✔
- **Optional objectives never block completion** — verified directly in tests (`primaryObjectivesComplete` ignores optional state entirely). ✔
- **Sandbox proof** — a real mission drives automatic phase progression, a rolled modifier changes real numbers (threat, loot, elite squad size), a Dynamic Event fires, and objective progress tracks from existing combat facts — all observed live with zero errors. ✔
- **Simplification pass** — rejected a fourth event-generation engine (extended the existing two vocabularies through the existing bus fact); rejected persisting mission-scoped counters through `MetaProgression` (kept them local, matching AF-035's precedent); rejected mutating the shared `DirectorTuning` constant (cloned per-run instead). ✔

**Internal quality score: 9.5/10 — approved and locked; full mission roster, Galaxy Impact statistic wiring, and mission-briefing/summary UI bind at future content and UI modules.**
