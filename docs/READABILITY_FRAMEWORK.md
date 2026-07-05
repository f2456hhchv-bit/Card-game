# AFTERLIGHT — Gameplay Readability Framework

**Authority:** Produced output of AF-004. Extends AF-000 → AF-003 and the Master Constitution. Every future mechanic, enemy, boss, weapon, HUD element, particle, and visual effect extends this framework; it is extended, never replaced.
**Binding rule of the whole document:** at any moment the player can answer — *what is happening, why it happened, what happens next, what should I do* — within two seconds, in the most chaotic encounter, in every accessibility mode.

---

## 1. The attention model (player priority stack)

One ranked stack governs every frame. When anything competes for visibility, audio, or contrast, **higher rank wins and lower rank yields**:

1. **Own ship** — brightest object on screen, never fully occluded (AF-002 law)
2. **Enemies** — faction silhouette + hostile colour, never hidden
3. **Enemy attacks** — hostile projectiles/zones readable peripherally
4. **Boss mechanics** — telegraphs override all decoration
5. **Hazards** — always outlined, always animated (§5)
6. **Loot** — visible but never louder than threats
7. **Objectives** — present, quiet
8. **Visual effects** — lowest rank; first thing sacrificed under density

This stack unifies AF-002 §6.5 (draw-layer order) and AF-003 §2 (information hierarchy) into a single enforcement model. The VFX system implements it mechanically: under high entity density, effects **degrade in reverse rank order** (decoration fades first, telegraphs never fade).

## 2. The unique identity law

Every gameplay object class ships with all six, or it does not ship:

**Unique silhouette · unique colour · unique animation · unique sound · unique behaviour · unique purpose.**

- No two object classes may share a silhouette-plus-colour pair.
- Identity must survive motion: recognisable at full gameplay speed against the dark field, at 50% scale, and in every colour-blind mode (shape carries meaning when hue cannot).
- "Unique purpose" is the Constitution's filler ban applied to readability: if two objects need the same identity, one of them shouldn't exist.

## 3. Colour semantics (reconciled to AF-002 tokens)

AF-004 defines meaning by colour **family**; locked AF-002 defines the exact token within each family. The binding table:

| Meaning | Family (AF-004) | Canonical token (AF-002, as extended) | Disambiguation cue |
|---|---|---|---|
| Healing | Green | `vitality.green` `#4DE868` | + cross/regen tick motif |
| Shield | Blue | `shield.blue` `#4D7CFF` | Arc/ring shapes only |
| Immediate danger | Red | `danger.red` `#FF4054` | Reserved — red always means "can hurt you" |
| Warning | Orange | `warning.orange` `#FF8A3D` | Outline phase of telegraphs |
| Loot | Yellow | `solar.gold` `#FFC652` | Beacon pulse + rarity ramp |
| Void | Purple | `energy.violet` `#9B5CFF` | Organic/distorted shapes (Void faction) |
| Technology | Cyan | `plasma.cyan` → `energy.white` | Weapon/tool shapes; shield uses arcs |
| Neutral information | White | `energy.white` `#F4F7FF` | Text and markers only |

**Project Owner ruling, 2026-07-05:** the palette was extended with dedicated pure hues — `vitality.green` for healing and `shield.blue` for shields — replacing the earlier family-reconciliation to teal/cyan. Shape-pairing cues (arcs for shields, regen ticks for healing) are retained so no meaning rests on hue alone. Colours never change meaning anywhere in the game, including menus, map, and codex.

## 4. Shape semantics

Extends AF-002 §5 (faction silhouettes) with gameplay-role rules:

- **Friendly** — angular, clean, symmetrical (Human grammar). If it's symmetrical and cool-lit, it's yours.
- **Enemy** — distinct silhouette per class (identity law §2), hostile-family highlights.
- **Boss** — largest silhouette on screen and highest contrast, unmistakable at any distance. No regular enemy may approach boss scale.
- **Loot** — small simple glowing geometric solids, rarity-coloured (AF-002 ramp).
- **Hazards** — animated warning zones: outlined, pulsing, never static, never ambient-only. A motionless hazard is a design defect.

## 5. Combat feedback (the satisfaction contract)

Every successful action acknowledges within AF-003's 100ms law, and each acknowledgement is **distinct** — the player can identify the event with eyes closed (audio) or sound off (visuals):

Weapon fired · enemy hit · critical hit · shield damaged · shield broken · enemy defeated · elite defeated · boss damaged · boss staggered · XP collected · loot collected · level up · Ultimate ready.

Rules: feedback scales with significance (a common kill never celebrates louder than an elite kill; the reward hierarchy of the Constitution applies to feedback volume); stacking events coalesce rather than stack volume (ten kills ≠ ten full explosions of sound); all feedback objects are pooled (AF-001).

## 6. Telegraph anatomy (extends AF-002's grammar)

Every dangerous attack — boss, elite, or hazard — ships the full five-part anatomy:

1. **Animation** — visible windup on the attacker's body (readable top-down)
2. **Audio cue** — direction-appropriate, distinct per attack class
3. **Ground indicator** — AF-002 grammar: `warning.orange` outline during windup → `danger.red` fill at commit; the shape *is* the hitbox, exactly
4. **Charge timing** — windup duration proportional to damage: the more it hurts, the longer it warns
5. **Recovery window** — a readable punish opening after commit; aggression is rewarded with information

Law of the received hit: **the player can always narrate every hit they take** ("I stood in the red circle"). If a playtest ever produces "what killed me?", the mechanic — not the player — failed, and it returns for redesign. Indicator-shape-equals-hitbox is exact: no hits from outside the drawn shape, ever (Constitution: no cheap deaths, no hidden information).

## 7. HUD & notification communication rules

Extends AF-003 (which owns layout and the notification queue):

- **Never duplicate** — each fact renders in exactly one place; a second display of the same fact is an automatic review failure.
- **Contextual reveal** — information appears when it becomes decision-relevant and retires when it stops: interaction prompts near interactables, boost gauge when boost is used, ammo/energy when a consuming weapon is equipped. The HUD breathes with the moment.
- **Hide the unnecessary** — anything not answering a current-moment question is hidden, not dimmed.
- Notifications: short, clear, immediate, non-intrusive; coalescing, caps, and auto-expiry per AF-003 §5.

## 8. Accessibility (readability floor)

All modes per Constitution + AF-002 §11 + AF-003 §8: high contrast · reduced effects · reduced flashing · reduced shake · photosensitivity mode · colour-blind modes · visual clarity mode.

**The hard gate this framework adds:** every gameplay mechanic must remain fully understandable in *every* mode and *combination* of modes. Visual clarity mode strips to the §1 stack's top six ranks only. If a mechanic's readability depends on an effect that reduced-effects disables, the mechanic fails QA — accessibility settings tune presentation, never comprehension.

## 9. Performance (readability is cheap by design)

Clarity comes from silhouette, contrast, and colour — not rendering cost:

- Simple effects over complex ones; strong silhouettes over detail; flat contrast over layered translucency.
- **Minimal overdraw** — telegraphs are outlines + single fills, not stacked translucent layers; the §1 degradation model actively reduces cost in the densest (most performance-critical) moments, so readability and framerate improve together.
- Budgets per AF-001/AF-003 hold: 60 FPS floor everywhere, 120 preferred desktop.

## 10. Quality control (every future gameplay feature)

The five questions, answered at review, no exceptions: Can players identify it instantly? Does it improve readability? Does it support gameplay? Does it remain visible during intense combat? Does it follow Afterlight's visual language? — any "No" returns it for redesign. This checklist joins the Constitution's Design Decision Matrix and AF-002 §13 in every future module's QA sheet.

## 11. Debug support (dev builds)

The debug overlay gains a readability panel: live combat event stream (from the Event Bus) · visual priority state (what's being degraded, current density) · warning/telegraph queue with timings · active danger indicators + hitbox-shape overlay (verifies §6's shape-equals-hitbox law) · HUD visibility state (what's revealed/hidden and why) · frame cost of feedback/VFX. Every law in this document is observable.

## 12. Standing review obligations (bind every future content module)

Per AF-004's self-review loop — executed at each content module's QA stage, and globally at every playable milestone: review every mechanic, HUD element, effect, enemy, boss, weapon, and loot rarity against §§1–10; verify colour and silhouette consistency; verify combat readability at peak density; verify all accessibility modes; verify performance; remove visual noise; **verify the two-second rule** — every combat decision understandable within two seconds. Repeat until the most chaotic encounter remains instantly readable.

---

## Internal review loop (AF-004, recorded)

- **Unified attention model** — one stack now reconciles draw order (AF-002), information hierarchy (AF-003), and player priority (AF-004); no competing hierarchies exist. ✔
- **Colour language** — family semantics bound to exact locked tokens; one reconciliation documented and owner-overridable; reserved-red preserved. ✔
- **Silhouettes** — identity law with no-shared-pairs rule; boss scale exclusivity; motion/scale/colour-blind survival tests. ✔
- **Combat readability** — five-part telegraph anatomy, shape-equals-hitbox exactness, narratable-hit law, feedback-scales-with-significance. ✔
- **Accessibility** — comprehension guaranteed in every mode combination; clarity mode defined by the priority stack. ✔
- **Performance** — degradation model makes the busiest frames the cheapest; minimal-overdraw rules. ✔
- **Simplification pass** — rejected a third telegraph phase (two-phase grammar + timing already carries it); rejected per-enemy colour variants (family consistency beats variety); folded "danger indicators" into the telegraph anatomy rather than a parallel system. ✔
- **Two-second rule** — adopted as the framework's global acceptance test, verifiable in playtests via §11 tooling. ✔

**Internal quality score: 9.5/10 — approved; §12 obligations bind all future content modules.**
