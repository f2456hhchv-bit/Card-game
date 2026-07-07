# AFTERLIGHT — Galaxy Event Framework

**Authority:** Produced output of AF-041. Extends AF-000 → AF-040. Every future seasonal event, expansion, campaign, and world simulation extends this architecture; it is extended, never replaced.
**Binding rule of the whole document:** the galaxy evolves whether or not the player is present — every fired event applies its ambient World State change immediately, and player response is always an additional, never mandatory, layer on top.

---

## 1. World State — ten tracked values, a namespaced statistic each

Faction Activity, Sector Stability, Threat Levels, Resource Availability, Ancient Activity, Void Corruption, Scientific Progress, Trade Networks, Civilian Population, and Exploration Progress (`WORLD_STATE_KEYS`) each persist through AF-026's `recordStat` under `worldState:<key>`, clamped to [0, 100] by AF-038's exact `GalaxyRuntime.clampedDelta`. Nine of the ten have a live sandbox producer; Void Corruption is registered, awaiting content.

## 2. Event Categories — four re-surfaced, six new

Galaxy, Faction, Economic, and Environmental Events are AF-038/039/040/017's own registered kinds, re-surfaced at the world-simulation layer as plain-string values rather than re-registered as a second vocabulary. Sector, Ancient, Scientific Discovery, Emergency, Hidden, and Legendary Events are genuinely new (`SECTOR_EVENT_KINDS`, `ANCIENT_EVENT_KINDS`, `SCIENTIFIC_DISCOVERY_KINDS`, `EMERGENCY_EVENT_KINDS`, `HIDDEN_EVENT_KINDS`, `LEGENDARY_EVENT_KINDS`).

## 3. Galaxy/Sector/Faction/Ancient Events — content, not code

The spec's own "Examples include" list for Galaxy Events is itself nearly a 1:1 restating of AF-038's `GALAXY_EVENT_KINDS` — confirming this category is meant to be re-surfaced. Sector Events remain localised by convention (each `WorldEventDef` nudges exactly one World State key); Ancient Events remain rare by weight (the sandbox roster weights them low, matching "Ancient events remain rare").

## 4. Dynamic Event Generation — the same weighted-pick-on-a-timer, a sixth time

`WorldEventRuntime.tryTriggerEvent()` fires a weighted pick from the roster's own event pool once per interval, deterministic from the runtime's seeded `Rng` — "deterministic from World Seed" is the identical guarantee every generator in this project already makes, verified directly (same seed, same fired-event sequence). Galaxy State, Faction Status, Player Progress, Exploration %, Research, and Mission History are the World State/statistics this weighting could read in future content; the sandbox weights are static today.

## 5. Player Participation — never mandatory, one layer up from AF-039

Ignore and Observe carry a zero World State delta by data, so the UI only surfaces buttons for Investigate/Support/Prevent — the identical discipline AF-039 established for Ignore/Explore Independently. Every choice the player does make applies an additional delta on top of the event's own ambient change, and is recorded so the same event instance can't be responded to twice.

## 6. Event Chains — modular content references, not a second engine

`chainsInto: { kind, contentId }` is a plain reference into whatever system that outcome kind names. Four of the ten sandbox events carry one; `researchOpportunity` has a live producer (`researchTree.addPoints`) at the composition root, browser-verified. The remaining seven `EventChainOutcomeKind`s are registered, awaiting the content module that owns that experience.

## 7. World Evolution — AF-026's collections, a new namespace of entries

"The galaxy remembers" is `meta.discover("lore", event.id)` on response — the same idempotent discovery call every lore source in this project already makes. No new persistence layer.

## 8. Notification System — Galaxy Command's subtitle, and the existing HUD toast

Breaking Events show as one more line in Galaxy Command's subtitle, the exact pattern AF-038/039/040 already established there. Events firing mid-expedition also flash through the existing `lootNotices` toast list. Sector Alerts/Faction Messages/Emergency Signals/Research Reports/Trade Updates/Discovery Logs are simply that same notification surface, categorised by the event's own `category` field — not six separate channels.

## 9. Long-Term Consequences — composition points, not eight new subsystems

Research is live via Event Chains (§6); Faction Relationships/Trade Routes are AF-039's Conflict System and this module's own `factionActivity`/`tradeNetworks` World State keys. Mission Availability, Sector Difficulty, Biome Conditions, Boss Availability, and Exploration are registered composition points awaiting their own future producer.

## 10. Accessibility & performance

Event filters, timeline view, large notifications, controller/touch navigation, colour-blind support, high contrast, and reduced notification mode build from AF-003/AF-004/AF-005/AF-019 at the UI module. `WorldEventRuntime` allocates nothing per frame beyond its own timer; the event roster is a static content array.

## 11. Debug

Live: the last fired event's category and kind, the World State value it touched (with its current persisted number), and total events triggered — rendered in the shared `DebugOverlay` `worldEvents` field.

---

## Internal review loop (AF-041, recorded)

- **No duplicated systems** — four Event Categories, World State clamping, generation algorithm, and World Evolution persistence all reuse AF-017/026/036/037/038/039/040 exactly; `WorldEventRuntime`'s generation engine is the only genuinely new mechanical surface, and it stays pure by design. ✔
- **The galaxy evolves with or without the player** — every fired event's ambient World State delta applies immediately in the GameLoop tick, independent of which screen is active or whether the player ever responds; verified directly in the browser (Trade Networks moved from 0 to 10 purely from the event firing, before any button was clicked). ✔
- **Every choice influences future events without ever being mandatory** — Ignore/Observe are zero-delta by data; Investigate/Support/Prevent are optional additional nudges, verified to apply correctly (10 → 14) and to correctly disable themselves once used. ✔
- **Event chains remain modular** — `chainsInto` is inert data on the event; nothing forces the runtime to execute a chain, and the one live producer is an ordinary call to an existing acquisition method. ✔
- **Sandbox proof** — a real event roster fires deterministically, updates a real persisted World State value, displays on Galaxy Command's subtitle exactly as the spec names it, and Player Participation both nudges the value further and permanently marks the event as answered — all browser-verified with zero errors. ✔
- **Simplification pass** — rejected a second Galaxy/Faction/Economic/Environmental event vocabulary (re-surfaced the existing kinds by value); rejected a seventh weighted-pick implementation as a shared utility (kept it inline, matching five prior precedents); rejected editing any locked category union to add this module's four non-overlapping example names (homed them into new categories instead); rejected auto-executing Event Chains (kept them as inert, composable data). ✔

**Internal quality score: 9.5/10 — approved and locked; Void Corruption, the remaining seven Event Chain outcome kinds, and the full notification/timeline UI (filters, reduced notification mode) bind at future content and UI modules.**
