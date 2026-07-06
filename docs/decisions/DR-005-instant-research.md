# DR-005 — Research unlocks are instant, permanently

**Reason:** AF-024's spec lists "Completion Time" per node; real-time research timers collide with the Constitution's bans on artificial waiting and artificial retention, and answer the Feature Gate's "what interesting decision does this create?" with nothing.
**Alternatives considered:** (B) completion during the next expedition — waiting that overlaps play (a defensible future design); (C) real-time timers — Constitution conflict.
**Chosen solution:** Option A, ratified by Project Owner 2026-07-06: unlocks are instant, permanently. `completionTimeMs` remains in the node schema at zero, documented as unused (data-format stability; deleting it would contradict the module spec's field list).
**Trade-offs:** none material — a dormant data field versus a mechanic that would need constant justification.
**Dependencies:** AF-024 tree engine; extends by the same reasoning to AF-025's "Crafting Time" field (instant, reserved) unless the owner rules otherwise there.
**Future review:** only if a future module proposes design B with a concrete gameplay decision attached.
**Status:** Ratified by Project Owner, 2026-07-06.
