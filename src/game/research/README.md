# research — Research Framework (AF-024, game layer)

**Purpose:** Permanent progression: knowledge that survives every run, unlocking possibilities rather than just numbers.

**Responsibilities:** Content-agnostic tree engine (`ResearchTree`) — prerequisite gating, cycle/dangling validation, hidden discoveries, point spending, full reset with refund and preserved discoveries, save serialisation with deprecation-safe loading; data shapes + sandbox placeholder tree (`researchData`).

**Dependencies:** `core/save` for persistence (research is the save system's first consumer). Discovery triggers arrive as bus facts wired at the composition root.

**Events:** the composition root emits `ResearchUnlocked` and `ResearchPointsGained`; effects feed AF-021's pipeline research stage, AF-023's ladder shift, and AF-022's collection radii.

**Data structures:** `ResearchNodeDef` (id/category/tier/cost/prereqs/type/hidden/effect), `ResearchEffect` union, `ResearchSaveData`, fifteen categories + eleven node types (registered shelves).

**Extension points:** the real research tree replaces the sandbox tree as pure data; new effect kinds extend the union with their consuming modules; mutually-exclusive groups and partial refunds are registered future flags; timed research (completionTimeMs) is reserved pending a Project Owner ruling.

**Known limitations:** sandbox tree is placeholder content; the research screen (network view, search, filters) builds from AF-005 components at the UI module.
