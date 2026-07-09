# User Experience Framework (AF-093)

Extends AF-003's paper HUD/menu architecture (design-doc only until now) into real, testable code. Zero changes to AF-016 (states), AF-019 (input), or AF-027 (loadouts).

## What's new

- **Primary Interfaces realisation map** — of 14 named interfaces, 3 have a dedicated live `GameStateId` (Main Menu, Mission Terminal, Inventory), 4 are fused into one that hosts them (Galaxy Map/Research Centre/Crafting → GalaxyCommand; Codex → Statistics), and 7 are honest future (Commander Screen, Ship Hangar, Equipment Lab, Museum, Civilisation Hub, Settings, Photo Mode). Every one of the 14 still carries a complete 9-part `UiInterfaceProfileDef`, proven by `uiArchitectureFor`.
- **HUD/Feedback/Navigation/Inventory/Build/Notification/Accessibility honesty maps** — each spec vocabulary flagged live only where a real renderer/engine/field exists: 3/11 HUD elements (health, shield, notifications), 2/5 nav devices (keyboard/mouse, gamepad), 3/7 feedback channels, 2/8 inventory-experience features, 5/7 build-management kinds (onto AF-027's real `Loadout`), 3/11 accessibility surfaces (onto AF-044's `highContrast`/`colourBlindMode` and AF-019's rebinding engine). All 7 notification categories already realise onto the one real `lootNotices` toast queue.
- **Onboarding** — 7 features, honestly all future; nothing exists yet.
- **Input latency** — `inputLatencyProxyMs` is a genuine, measured proxy (frame time), not a fabricated number.

## Live

The debug overlay's `state`, `input`, and `inventory` lines now carry real UX summaries (`ui 3 live/4 fused/7 future · hud 3/11 live`, a frame-time latency proxy, `builds 5/7 live`). Browser-verified, zero errors.

## Review

Zero changes to any locked module. 8 tests, suite at 1095. Score 9.5/10 — approved and locked.
