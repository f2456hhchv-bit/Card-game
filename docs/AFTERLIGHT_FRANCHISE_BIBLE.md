# The Afterlight Franchise Bible (AF-147)

Built entirely under `src/game/franchiseBible/`. Explicitly "not a gameplay system" per its own text — the fourth module in a row whose subject is franchise-level governance rather than in-game mechanics, after the real `docs/CONSTITUTION.md`, AF-145's Atlas Core, and AF-146's Design Constitution.

## What's genuinely new

Confirmed absent anywhere else in the codebase before this module:

- **`eraFor`** — a real, named 8-Era chronology (Earth Era → Collapse Era → First Expedition → Atlas Initiative → Reconstruction Era → Expansion Era → Beacon Era → Future Eras), mapped onto an epoch number. AF-068's `CampaignRuntime` chapters are a gameplay-campaign structure, not a franchise-wide timeline — genuinely different territory.
- **`CanonAuthorityResolver`** — a real conflict resolver over the spec's own 6-tier canon ladder ("conflicts always resolve in favour of the highest canon tier"). Mirrors AF-144's real `DecisionRouter` tier-comparison shape, but arbitrates LORE statements rather than gameplay change requests — a distinct domain, not a duplicate.
- **`CanonRecordLedger`** — append-only, keeps every canon statement ever made about a subject, not just the resolved winner.
- **`FranchiseComplianceRegistry`** — append-only per-project evaluation history against the Franchise Test and theme-coverage minimum.

## Documented overlaps, not merged

- **"Core Themes"** (10 items) is the densest vocabulary overlap yet with the project's other three abstract-value lists — the real Constitution's Design Pillars, AF-146's `TEN_PILLARS` (shares Hope/Discovery/Humanity/Civilisation verbatim), and AF-145's Atlas Principle virtues (shares Curiosity/Hope/Stewardship/Discovery/Legacy verbatim). Kept as its own separate, fourth list; its own genuinely new rule is a minimum-count threshold ("at least three themes"), a different mechanic shape than the other three lists' exact-N or all-N gates.
- **"The Franchise Test"** (6 questions, all must be "Yes") is the *fifth* occurrence of the same all-must-pass checklist-gate mechanic in this codebase, after the real Constitution's two gates, AF-146's Expansion Test, and AF-145's Design Validation. Kept as its own separate, sixth question list.

## Kept as pure reference data, no runtime

Visual/Music/Language Identity, Commander/World Standards, Technology Rules, Merchandise/Adaptation Guidelines, Community Values, and Future Vision are all franchise-wide brand/creative guidance with no computational analog — the same honest scope boundary AF-140 through AF-146 already applied to pure design-philosophy sections.

## Live

Fresh-run debug line: `franchise era Earth Era · canon tiers 6 (statements 2, authoritative "afterlight-1") · projects 1 (1 compliant)` — the resolver correctly picked the Main Games–tier statement over the Official Companion Books one. Browser-verified, zero page errors.

## Review

Zero changes to `docs/CONSTITUTION.md`, AF-144's `DecisionRouter`, AF-145/146's charters, AF-068's `CampaignRuntime`, or any other locked module. 8 tests, suite at 1663. Score 9.5/10 — approved and locked.
