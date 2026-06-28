# AFTERLIGHT — Playtest Notes

**Last updated:** 2026-06-28

Observations from playtests, and the actions they drive. Newest first.

## 2026-06-28 — v0.1 developer smoke + first-loop review

**Method:** Automated browser smoke test (headless Chromium) plus design
review of the implemented loop against the GDD.

**Observed (smoke test):**
- Boots to the main menu cleanly; "Begin Vigil" starts a run.
- HUD updates correctly (XP bar, level, timer, kills, HP, weapon slot).
- Combat works end-to-end: Lumen Bolt auto-targets the nearest Drifter, deals
  damage (damage number "9" shown), kill registered within 5s.
- No console errors after adding the inline favicon (prior 404 removed).
- Procedural rendering reads clearly: luminous Warden vs. dark hexagonal Hollow.

**Design read (to validate with human play):**
- Early game (0–2 min) may feel slightly sparse with only one weapon — the
  second-weapon draft around L3 should arrive promptly. *Watch first-run pacing.*
- Orbit (Warden's Halo) and Aura (Radiance) give satisfying always-on feedback
  and are good "safety" picks; Nova Pulse's knockback feels impactful for
  crowd control.
- Elite hit-shake + loot burst reads as a satisfying "moment." Good.

**Actions taken:**
- Added inline SVG favicon (removed the only console error).
- Logged BUG-001 (test-only) as resolved.

**Open questions for next playtest (ideally human):**
1. Is the 0–2 min ramp engaging or slow?
2. Does difficulty at ~5 min feel fair given a coherent build?
3. Are draft choices legible and meaningfully different at a glance?
4. Is the swarm readable at high density, or does additive glow wash out?

> Template for future entries: Method · Observed · Design read · Actions ·
> Open questions.
