# AF-005 — UI COMPONENT LIBRARY

**Module status:** Complete (specification produced; live component review binds the UI implementation module)
**Lock status:** LOCKED — extends AF-000 → AF-004 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/UI_COMPONENT_LIBRARY.md` (the binding UI component library of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-004 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================
OBJECTIVE
==================================================

Implement the complete User Interface Component Library.

Every interface within Afterlight must be built from this library.

No unique UI components should be created unless absolutely necessary.

The goal is consistency.

The player should instinctively understand every interface because every component behaves the same throughout the game.

==================================================
CORE PHILOSOPHY
==================================================

Premium.

Minimal.

Modular.

Responsive.

Readable.

Reusable.

Elegant.

Every UI element should feel engineered rather than decorated.

==================================================
DESIGN TOKENS
==================================================

Define reusable tokens for:

Primary Colour

Secondary Colour

Accent Colour

Success Colour

Warning Colour

Danger Colour

Background Colour

Border Colour

Glow Colour

Disabled Colour

Hover Colour

Pressed Colour

Focus Colour

Animation Speed

Corner Radius

Border Width

Shadow Strength

Padding

Spacing

Typography Scale

Never hardcode visual values.

==================================================
BUTTON SYSTEM
==================================================

Every button contains:

Default State

Hover State

Pressed State

Focused State

Disabled State

Loading State

Selected State

Locked State

Every button provides immediate visual feedback.

==================================================
PANEL SYSTEM
==================================================

Reusable panels include:

Standard Panel

Information Panel

Tooltip Panel

Confirmation Panel

Inventory Panel

Dialogue Panel

Mission Panel

Research Panel

Crafting Panel

Collection Panel

Scrollable Panel

Panels share identical construction rules.

==================================================
CARD SYSTEM
==================================================

Reusable cards include:

Commander Card

Ship Card

Weapon Card

Equipment Card

Relic Card

Research Card

Mission Card

Boss Card

Collection Card

Achievement Card

Every card follows the same spacing and hierarchy.

==================================================
ICON SYSTEM
==================================================

Support icon sizes:

16px

24px

32px

48px

64px

96px

Icons use consistent:

Stroke weight

Glow

Lighting

Perspective

Spacing

==================================================
INPUT COMPONENTS
==================================================

Support:

Buttons

Checkboxes

Radio Buttons

Dropdown Lists

Search Bars

Text Fields

Sliders

Steppers

Tabs

Pagination

Context Menus

Every interaction behaves consistently.

==================================================
SCROLL SYSTEM
==================================================

Implement:

Vertical Scroll

Horizontal Scroll

Momentum Scroll

Controller Scroll

Touch Scroll

Mouse Wheel

Scrollbar visibility configurable.

==================================================
MODAL WINDOWS
==================================================

Support:

Confirmation

Warning

Information

Item Inspection

Research Unlock

Mission Results

Achievement

Never stack excessive modal windows.

==================================================
ANIMATION
==================================================

UI animations:

Fade

Scale

Slide

Glow

Pulse

Highlight

Duration:

100ms–300ms

Never delay gameplay.

==================================================
RESPONSIVE DESIGN
==================================================

Support:

Desktop

Steam Deck

Tablet

Mobile Landscape

Future Console

Safe areas respected.

No overlapping components.

==================================================
ACCESSIBILITY
==================================================

Support:

UI Scale

Font Scale

High Contrast

Controller Navigation

Keyboard Navigation

Touch Navigation

Focus Indicators

Reduced Motion

==================================================
PERFORMANCE
==================================================

Pool reusable UI.

Reuse components.

Lazy load large interfaces.

Avoid unnecessary redraws.

Maintain:

60 FPS Desktop

60 FPS Mobile

==================================================
DEBUG
==================================================

Display:

Active Components

UI Draw Calls

Focus State

Navigation Path

Animation Count

Performance

==================================================
OUTPUT
==================================================

Produce the complete User Interface Component Library.

Every menu, HUD element, popup, inventory and future interface extends this framework.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Review every UI component.

Review every button.

Review every panel.

Review every card.

Review every tooltip.

Review controller navigation.

Review keyboard navigation.

Review touch interaction.

Review responsiveness.

Review accessibility.

Review spacing.

Review typography.

Review consistency.

Review performance.

Remove duplicate components.

Simplify interaction.

Ensure every screen feels like it belongs to the same premium application.

Repeat until every interface is visually and functionally consistent.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 → AF-004 alignment review (recorded at catalogue time)

- One-library-for-everything restates the Constitution's no-duplication law and AF-003 §11's "one of everything" rule; this module supplies the concrete component inventory. No contradictions.
- Design tokens extend AF-002 §3's palette tokens (including the 2026-07-05 `vitality.green`/`shield.blue` extension) with semantic UI roles and non-colour tokens (radius, spacing, animation speed) — extension, not replacement. Success = `vitality.green`, Warning = `warning.orange`, Danger = `danger.red` map cleanly onto the locked colour semantics.
- Icon sizes add **96px** to AF-002 §8's ladder (16–64px) — a superset; the 24px grid and 16px-first test still govern.
- Tooltip Panel and Confirmation Panel are the AF-003 §6/§8 components restated as library members — same single instances, not duplicates.
- Animation range (100–300ms), pooling, dirty-flag redraw avoidance, and 60 FPS floors restate AF-002 §10 / AF-003 §9 / AF-001 §5 laws.
- Responsive targets add Tablet and Mobile Landscape detail to AF-000's platform list — consistent superset. Note: mobile portrait is not listed; landscape is the mobile orientation of record until the Project Owner rules otherwise (flagged in output §9).

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved. Produced output: `docs/UI_COMPONENT_LIBRARY.md`.
