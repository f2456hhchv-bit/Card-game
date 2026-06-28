# AFTERLIGHT — Known Issues & Limitations

**Last updated:** 2026-06-28

Not bugs — known, intentional limitations of the current build and the plan to
address them. (Defects go in `docs/BugTracker.md`.)

## Current limitations (v0.1)

- **No pause button on touch yet.** Touch players can't pause without a keyboard.
  → On-screen pause button planned in M2.
- **No tutorial.** Controls are shown only in the README. → First-run onboarding
  in M2.
- **One boss type.** "The Maw" is the only boss; later encounters reuse it with
  scaled HP. → More bosses planned (data/controller split already supports it).
- **No "evolution-ready" telegraph.** Players may not realise a weapon can evolve
  until the golden card appears. → Considering a HUD marker (see PlaytestNotes).
- **No meta-shop.** Light Motes accrue but can't be spent yet. → M3.
- **Single stage / palette.** One arena look. → Additional stages in M3.
- **High-contrast & colourblind modes** are reserved in settings/save but not
  yet implemented. → Accessibility polish pass.
- **Performance numbers at the 900-enemy cap are unmeasured** on real hardware.
  → Stress measurement scheduled in M2 (see PerformanceLog).

## Browser/platform notes
- Requires a modern browser with Canvas2D and Web Audio. Audio unlocks on the
  first user gesture (start button) per autoplay policy; this is expected.
- `localStorage` may be unavailable in private modes; saving silently no-ops and
  the game remains fully playable.
