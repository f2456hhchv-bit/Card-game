# Live Operations (AF-070)

The third ledger module (AF-068 campaign → AF-069 endgame → AF-070 live ops): a validating **content-pack registry** where the spec's promises are registration-time gates:

- **"Never invalidate previous content"**: an addition reusing an already-registered id is a replacement attempt and is REJECTED. The core game registers as pack zero with REAL shipped ids (all ten biomes, the Hollow Sentinel, campaign chapters), so the gate protects the actual game. Packs have no removal field — removal is unrepresentable.
- **"Never create power creep"**: an addition is a kind + an id (+ a challenge-only temporary flag). No stat field exists; the seasonal-reward shelf is entirely cosmetic/lore.
- **"Regression testing becomes mandatory"**: a pack failing ANY of the six QA gates (performance, balance, saveCompatibility, accessibility, loreConsistency, existingProgression) is rejected. Rejection is all-or-nothing — a rejected pack mutates nothing.
- **"Avoid FOMO-exclusive gameplay"**: only `temporaryChallenges` additions may be temporary; a temporary biome/mission/relic is rejected by the gauntlet. Ending a season retires exactly its temporary challenges; everything else persists, and the class exposes no reset/removal operation (prototype-asserted).
- **"Roadmap: Year 1 → Year 10 without architectural redesign"**: versions are unbounded, compatibility is monotone (`compatibilityFor` any older save), and the decade sweep runs 40 seasons + 10 expansions through the same unmodified class.
- **Returning players**: `returningPlayerRecap(sinceVersion)` and the append-only `contentTimeline` are the Season Archive / Content Timeline from §Accessibility.
