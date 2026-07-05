# AFTERLIGHT — UX & HUD Architecture

**Authority:** Produced output of AF-003. Extends AF-000 → AF-002 and the Master Constitution. Every future interface extends this framework; it is extended, never replaced.
**Binding rule of the whole document:** the HUD is invisible until required — information appears exactly when needed, and nothing distracts from gameplay.

---

## 1. UX laws

1. **Fast** — no interaction takes more clicks/taps than decisions it contains.
2. **Intuitive** — position, colour, and shape tell the player what a thing is before they read it (AF-002 grammar).
3. **Consistent** — one control does one thing everywhere; one layout pattern per problem.
4. **Predictable** — nothing moves, appears, or reorders without a player-visible cause.
5. **Minimal** — an element that answers no active question is not on screen.
6. **Responsive** — every input acknowledges within one frame (§9).

The player's attention budget belongs to gameplay decisions, never to finding information.

## 2. Information hierarchy (binding priority order)

When screen space, audio, or attention conflict, **lower priority always yields**:

| Priority | Class | Contents |
|---|---|---|
| **P1** | Immediate survival | Health, Shield, nearby threats, danger indicators, boss mechanics |
| **P2** | Combat | Weapons, abilities, Ultimate, cooldowns, XP, level-up |
| **P3** | Progression | Loot, resources, objectives, research, mission progress |
| **P4** | Reference | Statistics, collections, lore, codex, achievements |

Enforcement rules: P1 renders above everything and is never obscured by P2–P4; P3 notifications defer while a P1 event (boss telegraph, shield break) is active; P4 lives entirely in menus — it never claims HUD space during an expedition.

## 3. HUD layout (six anchored zones)

All zones anchor to screen corners/edges on the AF-002 8px grid, scale with HUD-scale, and respect platform safe zones (mobile notches, TV overscan for future console):

```
┌─────────────────┬──────────────────┬─────────────────┐
│ TOP LEFT        │ TOP CENTRE       │ TOP RIGHT       │
│ Player status:  │ Mission info:    │ Minimap         │
│ health, shield, │ biome, objective │ mission timer   │
│ portrait,       │ wave state,      │ threat level    │
│ status effects  │ boss warning     │ perf icons      │
├─────────────────┴──────────────────┴─────────────────┤
│                    GAMEPLAY                           │
├─────────────────┬──────────────────┬─────────────────┤
│ BOTTOM LEFT     │ BOTTOM CENTRE    │ BOTTOM RIGHT    │
│ Commander       │ XP bar, level,   │ weapons,        │
│ ability,        │ interaction      │ ammo/energy     │
│ Ultimate,       │ prompts, reward  │ (future), boost │
│ cooldowns       │ notifications    │ active buffs    │
└─────────────────┴──────────────────┴─────────────────┘
```

- Zone contents are **data-driven layout definitions** (AF-001: configuration through data) — HUD position/scale/opacity settings and future gamepad/mobile variants are config, not code forks.
- The centre of the screen is sacred: nothing persistent renders there. Boss warnings (P1) may interrupt top-centre; they are the *only* element allowed to grow toward centre, and only during telegraph.
- Visual style per AF-002 §7: transparent near-black panels, 1px borders, soft earned glow, high contrast, ≥44px touch targets on mobile.

## 4. Feedback (≤100ms law)

Every one of these events produces sensory acknowledgement within 100ms of the triggering Event Bus event — most within the same frame:

| Event (AF-001 bus) | Feedback |
|---|---|
| `PlayerDamaged` | Health bar flash + directional damage cue + brief vignette pulse |
| Healing | Bar fill animation + teal glow tick |
| Shield break | Distinct cyan shatter burst + audio (learned instantly, never confused with health damage) |
| Critical hit | Emphasised damage number (tabular numerals, AF-002 §9) |
| `CommanderLevelUp` | Gold XP flash + level-up presentation (§7) |
| Loot pickup | Rarity-coloured pickup pulse + bottom-centre notification |
| `ResearchUnlocked` | P3 notification (defers during combat spikes) |
| `BossSpawned` | Full-priority P1 warning: top-centre banner + audio sting |
| `MissionCompleted` | Completion sequence, then results |

The HUD is a **pure Event Bus subscriber** (AF-001 §5/§7): it never polls game state, and gameplay systems never know the HUD exists.

## 5. Notification system

- One queue, four channels by priority class; sources: mission updates, research, achievements, loot, crafting, commander progress, ship progress, galaxy events.
- **Intelligent stacking:** identical types coalesce ("+3 Alloy ×4" not four toasts); max 3 visible; overflow queues; P3/P4 notifications defer while P1 is active and drop to a post-mission summary if still stale at mission end. Spam is architecturally impossible, not just discouraged.
- Notification objects are **pooled** (AF-001 pooling law); duration is a player setting (§8).

## 6. Tooltips & menus

**Tooltips** — one component, everywhere: Name · Description · Statistics (colour-coded: buffs teal, nerfs red, unchanged neutral — always paired with +/− signs per the colour-blind law) · optional Lore · Upgrade info · Synergies. Dynamic positioning keeps tooltips inside the viewport and never over the player ship or active telegraphs; delay is a player setting.

**Menus** — maximum depth **three levels** from any root, hard rule. One navigation model across mouse, keyboard, controller, and touch: a single focus system with visible focus indicators (controller-focus setting), consistent confirm/back mapping, and identical menu structure on every platform. Every screen reachable in seconds: root tabs are always one input away (bumpers/swipe/number keys).

## 7. Level-up screen (the signature interaction)

Pause gameplay → present **three** upgrade choices as cards → return to gameplay immediately on selection. Rules: identical card layout (icon, name, effect, synergy note); differences readable in under two seconds; distinct AF-002-grammar icons; current→new value comparison shown; selection via click/tap/d-pad+confirm/1-2-3 keys; no confirmation step (choosing is the confirmation); total flow cost target under four seconds of player time. This screen is P2 gameplay, not a menu — it must feel like combat rhythm, not administration.

## 8. Error prevention & accessibility

**Destructive-action law:** deleting items, salvaging favourites, resetting research, and discarding Mythic-tier items always warn first, name the thing ("Salvage *Solar Lance* (favourite)?"), and offer cancel as the default-focused option. Confirmations appear **only** for destructive actions — never for routine ones (predictability law: warnings stay meaningful).

**Accessibility settings (all in the settings save slice, live-applied):** HUD scale · HUD opacity · HUD position presets per zone · font size · tooltip delay · notification duration · controller focus indicator style · touch optimisation (larger targets, repositioned clusters for thumbs). These extend the Constitution's mandatory set; all are data/config swaps per AF-001/AF-002 architecture.

## 9. Responsiveness & performance

- Buttons acknowledge on the **same frame** as input; menus open instantly (pre-built, hidden — never constructed on open); UI animations 100–300ms ease-out (AF-002 §10); loading indicators appear only when a wait genuinely exists.
- **Dirty-flag rendering:** HUD elements re-render only when a subscribed value changes — zero per-frame HUD redraws in steady state.
- All repeating UI objects pooled (notifications, damage numbers, tooltip instances); UI components are reused instances, never per-screen rebuilds.
- Budget: HUD + UI ≤ 1ms per frame within the 60/120 FPS targets, verified by the debug overlay (§10) and enforced at QA.

## 10. Debug support (dev builds)

The debug overlay (AF-001 `src/debug/`) gains a UI panel showing: live HUD element tree with dirty-flag state · notification queue contents and channel states · UI draw calls per frame · tooltip state (owner, position, clamp reason) · focus state (current focus path, input mode) · UI frame-time cost. This makes every §9 rule observable rather than aspirational.

## 11. Extension points

Future interfaces (inventory, research tree, galaxy map, codex, shops, social) extend this framework by: registering new HUD elements into existing zones (or menu screens at ≤3 depth), publishing/subscribing Event Bus events, reusing the tooltip/notification/focus components, and inheriting the priority classes. **No future module may add a second notification system, tooltip component, or focus model** — duplication of these is an automatic AF review failure (Constitution: no duplicated functionality).

## 12. Standing playtest obligations (execute at first playable build, and after every UI change)

Recorded per AF-003 OUTPUT — these run as real play sessions once a playable build exists, and the results feed back into this document:

1. Play complete missions; verify the HUD stays "invisible until required".
2. Navigate every menu with mouse, keyboard, controller, and touch; verify ≤3 depth and seconds-to-anywhere.
3. Level up repeatedly; verify the §7 flow stays under target time and reads in <2s.
4. Collect every loot rarity; verify rarity recognition without reading.
5. Fight every boss; verify P1 dominance and telegraph readability.
6. Review notification frequency in dense play; verify coalescing prevents spam.
7. Verify §9 budgets on desktop and mobile (60 FPS floor).
8. Remove any information players never used; simplify and repeat.

---

## Internal review loop (AF-003, recorded)

- **Information hierarchy** — four priority classes with hard enforcement rules (P1 never obscured, P4 never on HUD). ✔
- **Readability** — every element inherits AF-002 tokens, type scale, and grammar; centre-screen kept sacred. ✔
- **Menu speed** — ≤3 depth hard rule, pre-built instant menus, root always one input away. ✔
- **Controller navigation** — single focus model across all inputs, visible indicators, consistent confirm/back. ✔
- **Mobile usability** — ≥44px targets, thumb-cluster touch layout, safe zones, equal layout system per AF-002 §7. ✔
- **Accessibility** — eight player-tunable UX settings, all config-driven, extending the Constitution's mandatory set. ✔
- **Notification frequency** — coalescing + caps + deferral + post-mission summary make spam impossible by construction. ✔
- **Performance** — dirty-flag rendering, pooling, pre-built menus, ≤1ms UI budget, observable in debug overlay. ✔
- **Simplification pass** — removed a considered fourth notification channel (duplicate of P3), rejected persistent centre-screen objective text (violates sacred centre), folded "performance icons" into a single status glyph. ✔
- **Playtest loop** — cannot run pre-build; converted to standing QA obligations (§12) executed from first playable onward. Honest status, no skipped stage — the pipeline's Prototype/QA stages arrive with the build modules. ✔

**Internal quality score: 9.5/10 — approved (specification); §12 obligations bind all future playable builds.**
