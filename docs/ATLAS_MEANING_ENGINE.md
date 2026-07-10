# The Atlas Meaning Engine (AF-163)

Built entirely under `src/game/atlasMeaning/`. Exists above AF-162's Purpose Engine: purpose asks "what are we trying to achieve?", meaning asks "why does it matter?"

## The module's domain-vocabulary overlap (not a new record)

**"Meaning Domains"** (12) overlaps with the recurring "domain" vocabulary family — up to 5 exact-string matches against AF-162's real `PURPOSE_DOMAINS` (Community/History/Culture/Education/Exploration), confirmed by a dedicated test, but confirmed NOT a new overlap record (AF-162's own 8-match overlap with AF-161 remains the heaviest). Kept as its own separate union: this one tags what kind of emotional significance applies.

## The module's unifying generalizations

- **`MeaningCurator<TCategory>`** — the one generic mechanic behind "Personal Meaning", "Player Meaning" and "Collective Memory", all of which describe curating a single best-of entry per named superlative category for an entity. Confirmed by a dedicated test using all three category unions against the same generic class. `PersonalMeaningCategory` is confirmed a genuinely different concept from AF-133's real `NpcMemoryLog`: that class stores every memory a subject accumulates, while `MeaningCurator` picks out the single most meaningful entry per category — a highlights reel layered above raw memory, never a replacement for it.
- **`SignificanceTracker`** — the one generic mechanic behind "Symbols" and "Meaning Through Time," both describing a named entity (object or event) accumulating significance through reinforcing moments rather than a fixed importance assigned up front. Confirmed by a dedicated test exercising both an object and an event through the same class.

## What's genuinely new

- **`CommunityMeaningTracker`** — attaches emotional meaning to a real place.
- **`QuietMomentLog`** — a simple append-only record; quiet moments are never scored or ranked, only remembered.

## Live

Fresh-run debug line: `meaning personal "First contact with the Verdance wildlife." · player favourite "Verdance" · collective "The Verdance famine relief." · symbol significance 1 · community meaning "Where the founder's helmet is displayed." · quiet moments 1`. Browser-verified; the only console message present is the same pre-existing, baseline-confirmed 404 noted since AF-154 (unrelated to this module).

## Review

Zero changes to AF-162's `PURPOSE_DOMAINS`, AF-133's `NpcMemoryLog`, or any other locked module. 8 tests, suite at 1811. Score 9.5/10 — approved and locked.
