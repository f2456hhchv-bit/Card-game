# AF-003 — UX & HUD ARCHITECTURE

**Module status:** Complete (specification produced; playtest review loop pending first playable build — see note below)
**Lock status:** LOCKED — extends AF-000 → AF-002 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/UX_HUD_ARCHITECTURE.md` (the binding UX and HUD architecture of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-002 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================

OBJECTIVE

==================================================

Implement the complete User Experience (UX) and HUD Architecture.

The player should never struggle to understand what is happening.

Information must appear exactly when needed.

Nothing should distract from gameplay.

The HUD should feel invisible until required.

==================================================

UX PHILOSOPHY

==================================================

Fast.

Intuitive.

Consistent.

Predictable.

Minimal.

Responsive.

Every interaction should feel effortless.

The player should spend time making gameplay decisions.

Never searching menus.

==================================================

PLAYER INFORMATION HIERARCHY

==================================================

Priority 1

Immediate Survival

Health

Shield

Nearby Threats

Danger Indicators

Boss Mechanics

----------------------------

Priority 2

Combat

Weapons

Abilities

Ultimate

Cooldowns

XP

Level Up

----------------------------

Priority 3

Progression

Loot

Resources

Objectives

Research

Mission Progress

----------------------------

Priority 4

Reference

Statistics

Collections

Lore

Codex

Achievements

==================================================

HUD LAYOUT

==================================================

Top Left

Player Status

Health

Shield

Commander Portrait

Status Effects

----------------------------

Top Centre

Mission Information

Biome

Objective

Wave State

Boss Warning

----------------------------

Top Right

Mini Map

Mission Timer

Threat Level

Performance Icons

----------------------------

Bottom Left

Commander Ability

Ultimate

Cooldown Indicators

----------------------------

Bottom Centre

XP Bar

Level Indicator

Interaction Prompts

Reward Notifications

----------------------------

Bottom Right

Weapons

Ammo/Energy (future)

Boost

Active Buffs

==================================================

HUD DESIGN RULES

==================================================

Transparent backgrounds.

Minimal borders.

Soft glow.

Consistent spacing.

High contrast.

Large touch targets on mobile.

Never block gameplay.

Respect safe zones.

==================================================

PLAYER FEEDBACK

==================================================

Immediate feedback for:

Damage

Healing

Shield Break

Critical Hits

Level Up

Loot Pickup

Research Complete

Boss Arrival

Mission Complete

Feedback should occur within 100 milliseconds.

==================================================

NOTIFICATION SYSTEM

==================================================

Support:

Mission Updates

Research Complete

Achievement

Loot

Crafting

Commander Progress

Ship Progress

Galaxy Events

Notifications stack intelligently.

Never spam the player.

==================================================

TOOLTIPS

==================================================

Every tooltip contains:

Name

Description

Statistics

Lore (optional)

Upgrade Information

Synergies

Colour coded values.

Dynamic positioning.

Never cover important gameplay.

==================================================

MENUS

==================================================

Maximum depth:

Three levels.

Every menu reachable within seconds.

Support:

Mouse

Controller

Touch

Keyboard

Navigation remains consistent throughout.

==================================================

LEVEL-UP SCREEN

==================================================

Pause gameplay.

Present three upgrade choices.

Clear comparison.

Readable descriptions.

Distinct icons.

Fast selection.

Return immediately to gameplay.

==================================================

ERROR PREVENTION

==================================================

Warn before:

Deleting items.

Salvaging favourites.

Resetting research.

Discarding Mythic items.

Always allow cancellation.

==================================================

ACCESSIBILITY

==================================================

Support:

HUD Scale

HUD Opacity

HUD Position

Font Size

Tooltip Delay

Notification Duration

Controller Focus Indicators

Touch Optimisation

==================================================

RESPONSIVENESS

==================================================

Animations

100–300ms

Buttons

Immediate response

Menus

Instant opening

Loading indicators only when required.

==================================================

PERFORMANCE

==================================================

HUD updates only when values change.

Avoid per-frame redraws.

Pool notifications.

Reuse UI components.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================

DEBUG

==================================================

Display

HUD Elements

Notification Queue

UI Draw Calls

Tooltip State

Focus State

Performance

==================================================

OUTPUT

==================================================

Produce the complete User Experience and HUD Architecture.

Every future interface extends this framework.

Never replace it.

Play complete missions.

Navigate every menu.

Level up repeatedly.

Collect every loot rarity.

Fight every Boss.

Review information hierarchy.

Review readability.

Review menu speed.

Review controller navigation.

Review mobile usability.

Review accessibility.

Review notification frequency.

Review performance.

Remove unnecessary information.

Simplify where possible.

Repeat until players instinctively know where to find every piece of information without conscious effort.

Target internal quality score:

9.5/10 minimum.

==================================================

## Constitution / AF-000 → AF-002 alignment review (recorded at catalogue time)

- Information-over-decoration, invisible-until-needed HUD: consistent with Constitution Visual Philosophy and AF-002's "HUD answers questions, never decorates". The six-zone layout here **extends** AF-002 §7's element list into concrete screen placement — no contradiction.
- HUD design rules (transparent panels, minimal borders, soft glow, high contrast, ≥44px touch targets) restate AF-002 §7 panel style exactly.
- ≤100ms feedback restates AF-002 §10 combat feedback timing; 100–300ms UI animation range fits AF-002's <300ms law.
- Event-driven HUD updates ("only when values change", no per-frame redraws, pooled notifications) are direct applications of AF-001 §5 (events over polling, allocation discipline) — the UI System subscribes to the Event Bus.
- Accessibility list extends the Constitution's mandatory set with HUD opacity/position, tooltip delay, notification duration — superset, permitted.
- New canon surfaced: **Mythic** rarity tier named (error-prevention section). AF-002 defined a five-tier rarity ramp (common → legendary); Mythic is catalogued as a future tier above legendary, colour to be assigned by the loot module — flagged so the loot AF module resolves it explicitly rather than by accident.
- **Playtest loop note:** the OUTPUT review steps requiring live play (complete missions, every boss, every rarity, controller/mobile navigation) cannot execute before the first playable build. They are recorded in `docs/UX_HUD_ARCHITECTURE.md` §12 as standing QA obligations that run at first playable and after every UI change. The specification review steps (hierarchy, readability, simplification) were executed now.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved as specification; playtest obligations pending first playable build. Produced output: `docs/UX_HUD_ARCHITECTURE.md`.
