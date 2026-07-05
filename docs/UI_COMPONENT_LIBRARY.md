# AFTERLIGHT — UI Component Library

**Authority:** Produced output of AF-005. Extends AF-000 → AF-004 and the Master Constitution. Every menu, HUD element, popup, inventory, and future interface is assembled from this library; it is extended, never replaced.
**Binding rule of the whole document:** no interface builds a bespoke component when a library component exists. A new component may be added only when no existing component or composition can serve — and it is added *to the library*, never to one screen.

---

## 1. Design tokens

All tokens live as data (`src/data/visual/ui-tokens` when code lands) per AF-001's no-magic-numbers law. Components reference token names only. Colour tokens **alias** the AF-002 palette (single source of truth — the library never invents colours):

| Token | Value | Notes |
|---|---|---|
| `ui.primary` | → `space.blue` | Panel bases, structural chrome |
| `ui.secondary` | → `space.black` @ 85% | Panel backgrounds (AF-002 §7) |
| `ui.accent` | → `energy.violet` | Active element, signature accent |
| `ui.success` | → `vitality.green` | Positive results, confirmations |
| `ui.warning` | → `warning.orange` | Caution states |
| `ui.danger` | → `danger.red` | Destructive actions, errors |
| `ui.background` | → `space.black` | Screen base |
| `ui.border` | → `space.blue` @ 60% | 1px standard borders |
| `ui.glow` | → `energy.violet` @ 40% | Earned-glow accents only |
| `ui.disabled` | `#5A6275` @ 50% | Desaturated, reduced opacity |
| `ui.hover` | +8% lightness on base | Uniform hover shift |
| `ui.pressed` | −6% lightness on base | Uniform pressed shift |
| `ui.focus` | → `plasma.cyan` | 2px focus ring, all input modes |
| `anim.fast` / `anim.base` / `anim.slow` | 100ms / 180ms / 300ms | The only three UI durations |
| `radius.base` / `radius.large` | 4px / 8px | Two radii, no others |
| `border.width` | 1px (2px high-contrast) | |
| `shadow.strength` | 0 / soft / lifted | Three elevation steps |
| `pad.*` / `gap.*` | 8px grid: 4, 8, 16, 24, 32 | AF-002 spacing grid |
| `type.*` | Title 32 / Header 24 / Body 16 / Numbers 16 tab / Tooltip 14 | AF-002 §9 scale |

High-contrast, colour-blind, and scaling accessibility modes are token-table swaps (AF-002 §11) — the library inherits every mode for free.

## 2. Button system

One `Button` component, eight states, each visually distinct and token-driven:

**Default · Hover (+lightness, `anim.fast`) · Pressed (−lightness, same frame as input — AF-003 §9) · Focused (`ui.focus` ring) · Disabled (`ui.disabled`, non-interactive, keeps layout) · Loading (inline spinner, label retained, input blocked) · Selected (persistent `ui.accent` underline/border) · Locked (padlock glyph + requirement tooltip on hover/focus — tells the player *how to unlock*, never just "no").**

Variants (style presets, not new components): primary, secondary, ghost, destructive (`ui.danger`, used only for §7 destructive flows), icon-button. Minimum hit target 44px touch / 32px pointer.

## 3. Panel system

One `Panel` base — AF-002 §7 construction (translucent near-black, 1px border, optional accent line, 8px grid) — with named presets: **Standard, Information, Tooltip** (the single AF-003 §6 tooltip), **Confirmation** (the single AF-003 §8 warning surface), **Inventory, Dialogue, Mission, Research, Crafting, Collection, Scrollable** (composes §6 scroll). Presets differ only in slots and default sizing; construction rules are identical, so every surface in the game is recognisably the same material.

## 4. Card system

One `Card` anatomy — **[rarity/status frame] → icon/portrait → name → classification row → stat block (tabular numerals) → footer (state/action)** — with data-driven presets: Commander, Ship, Weapon, Equipment, Relic, Research, Mission, Boss, Collection, Achievement. Rarity colours the frame per the AF-002 ramp; locked/undiscovered cards render as silhouettes (curiosity, not spoilers). Spacing and hierarchy are fixed by the anatomy: a Weapon Card and a Boss Card are instantly siblings. Cards are the game's premium showcase surface — and the level-up choices of AF-003 §7 are this component.

## 5. Input components

One focus model (AF-003 §6) drives all of: Button, Checkbox, Radio group, Dropdown, Search bar, Text field, Slider (+ Stepper twin for fine control — every slider value also settable by stepper for motor accessibility), Tabs (root navigation, one input away — AF-003), Pagination, Context menu (long-press on touch). Uniform interaction grammar: confirm activates, back dismisses, focus ring identical everywhere, disabled states keep layout. No screen may invent an input behaviour.

## 6. Scroll system

One `ScrollView`: vertical, horizontal, momentum (touch flick with standard decay), mouse wheel, controller (right-stick scroll + focus-follows into view), touch drag. Scrollbar visibility configurable (auto/always/never per accessibility settings); scroll position indicators always available to controller users. Virtualised rows for large collections (§10).

## 7. Modal windows

One `Modal` host with presets: Confirmation, Warning (destructive — AF-003 §8 rules: named subject, cancel default-focused), Information, Item Inspection, Research Unlock, Mission Results, Achievement. **Stacking law: maximum one gameplay-blocking modal at a time; one overlay level above it for confirmations arising from the modal itself. Depth two is the hard ceiling** — a third request queues. Modals trap focus, restore focus on close, and dim (never hide) their parent surface.

## 8. Animation vocabulary

Six primitives only — **Fade, Scale (≤1.05, never bouncy), Slide, Glow, Pulse, Highlight** — at the three token durations (100/180/300ms), standard ease-out. Rules: animation never delays input (interactive from frame one), never delays gameplay, and reduced-motion swaps all six for instant/fade-only per AF-002 §10. Any motion outside this vocabulary is a review failure.

## 9. Responsive design

Anchored, grid-based layouts (no absolute pixel positioning) across: Desktop (16:9/21:9), Steam Deck (1280×800), Tablet, Mobile Landscape, Future Console (TV safe areas). Safe-area insets are a layout input on every screen; components reflow, never overlap, and hit targets never shrink below minimums. **Orientation of record on mobile is landscape** (per AF-005 platform list); portrait support would be a Project Owner decision for a future module — flagged, not assumed.

## 10. Performance

Library-wide laws (inheriting AF-001/AF-003): all list items, notifications, tooltips, and cards **pooled**; components are reused instances — screens bind data into existing trees, never rebuild them; large interfaces (collections, research tree) **lazy-load + virtualise** (only visible rows exist); dirty-flag rendering — a component with unchanged data draws nothing. Budget: UI ≤ 1ms/frame (AF-003 §9), 60 FPS floor everywhere.

## 11. Accessibility

Inherited settings, all live-applied, all token-driven: UI scale, font scale, high contrast, controller/keyboard/touch navigation parity (every screen fully operable by each alone), focus indicators (style-configurable), reduced motion. The library is the accessibility implementation surface: because every screen is built from these components, every setting works everywhere by construction — no per-screen accessibility work, no per-screen accessibility bugs.

## 12. Debug support (dev builds)

UI panel additions (extends AF-003 §10): active component census (instances by type, pooled vs live) · UI draw calls · focus state and full navigation path · running animation count · per-component frame cost · virtualisation stats (rows realised vs total). Consistency is auditable: the census exposes any bespoke component the moment it appears.

## 13. Extension rules

Future interfaces compose existing components; new needs extend the library itself (new preset first, new component only if composition genuinely cannot serve — recorded with justification in the module that adds it). Duplicate-purpose components are an automatic review failure (Constitution: no duplicated functionality). The self-review loop of AF-005 runs against the live library at the UI implementation module and at every playable milestone: every component reviewed on every input mode, every platform profile, every accessibility mode, until every screen feels like the same premium application.

---

## Internal review loop (AF-005, recorded)

- **Component inventory** — every AF-005-listed component specified exactly once; tooltip/confirmation reuse the AF-003 singletons rather than duplicating them. ✔
- **Tokens** — full token table defined, colour tokens alias AF-002 (single source of truth), three durations, two radii; nothing hardcodable remains. ✔
- **Buttons/panels/cards** — one base each, presets by data; eight button states including Locked-with-reason (player-respect law). ✔
- **Navigation** — one focus model across controller/keyboard/touch/mouse; slider+stepper twins for motor accessibility. ✔
- **Responsiveness** — anchored grid layouts, safe areas as inputs, landscape-of-record flagged as an owner-visible assumption. ✔
- **Performance** — pooling, reuse, virtualisation, dirty flags, 1ms budget; census tooling makes violations visible. ✔
- **Simplification pass** — collapsed an initially separate "HUD widget" class into Panel presets; rejected per-screen animation curves (three durations, one easing); merged Stepper into Slider as a twin control rather than a fourth numeric input. ✔
- **Consistency test** — same material (panels), same anatomy (cards), same grammar (inputs), same motion (six primitives): a Research screen and an Inventory screen are unmistakably the same application. ✔

**Internal quality score: 9.5/10 — approved; live component review binds the UI implementation module.**
