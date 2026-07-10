/**
 * The Atlas Living Universe Engine (AF-185). The permanent heartbeat
 * ensuring every prior Atlas system continuously evolves together.
 *
 * NAMING NOTE: this module is unrelated to the already-locked AF-132
 * "Living Galaxy" (`src/game/livingGalaxy/` — per-system pollution/
 * wildlife/weather/crime, dynamic news, festivals, deep-space
 * phenomena) or AF-XXX's `livingMuseum`/`livingShip` modules. AF-185
 * lives entirely under its own `atlasLivingUniverse/` directory and
 * never reads, writes, or reuses any of their state.
 *
 * Reused directly wherever a section names a mechanic that already
 * exists:
 *
 * - "Living People" composes AF-166's real `IdentityRegistry`
 *   directly — a character's continuously evolving identity snapshot
 *   is exactly "learning, teaching, growing, changing opinions...
 *   even outside player interaction."
 * - "Living Communities" and "Living Culture" both compose AF-159's
 *   real `CulturalTrendTracker` directly.
 * - "Living Cities" and "Living Planets" both compose AF-135's real
 *   `PlanetaryChronicle`/`EvolvingEntry` directly — "the skyline tells
 *   history" is exactly `entryFor(id).allVersions()`.
 * - "Living Knowledge" and "Living History" ("through additional
 *   evidence... history becomes richer") also compose AF-135's real
 *   `PlanetaryChronicle` directly, plus AF-172's real
 *   `HypothesisTracker` for "new evidence appears."
 * - "Living Science" composes AF-159's real `MysteryLog` and AF-169's
 *   real `ensureNextHorizonOpen` directly — at least the fifth-plus
 *   module to reuse this completion-chains-to-a-new-mystery guarantee.
 * - "Living Relationships" composes AF-160's real `MentorshipLedger`
 *   directly.
 * - "Living Civilisation" ("every generation contributes... progress
 *   remains continuous") reuses AF-175's real `GenerationalHandoffLedger`
 *   directly.
 * - "Living Feedback" ("the cycle never ends") composes AF-151's real
 *   `KnowledgeGraph.addEdge` directly, using the already-real
 *   `"Influenced"` `GraphEdgeKind` — the same reuse AF-177 through
 *   AF-184's own "Network"/"Web"/"Feedback" sections already made.
 * - "The Living Future" composes AF-159's real `MysteryLog.open` and
 *   AF-174's real `HorizonEffectTracker` directly.
 *
 * "The Living Domains" (12) shares only 3 of 12 exact-string members
 * with AF-176's real `CONTINUUM_DOMAINS` — the lowest overlap
 * deliberately checked and documented in this codebase's ongoing
 * `detectOverlap` record, since this list uses concrete nouns
 * (People/Communities/Cities/Planets) rather than the abstract
 * domain vocabulary (Science/Education/Culture) every prior
 * comparison list shares.
 *
 * "The Living Present"'s governing guarantee — "what is happening
 * now? Not only what happened before?" — is confirmed genuinely new:
 * `LivingPresentTracker` is the ONLY overwriting tracker in a
 * codebase otherwise full of append-only or write-once permanence
 * (AF-135's `EvolvingEntry`, AF-177's `GenesisRegistry`, AF-180's
 * `UniversalLibrary`, AF-181's `EternalArchive`, all of which
 * deliberately never forget). "The Living Present" is explicitly NOT
 * about preserving history — it answers "what is happening right
 * now," so a later `update` call intentionally replaces the previous
 * one rather than accumulating a version history.
 */

export const LIVING_DOMAINS = ["People", "Communities", "Cities", "Planets", "Species", "Weather", "Civilisations", "Institutions", "Knowledge", "Culture", "Technology", "History"] as const;
export type LivingDomain = (typeof LIVING_DOMAINS)[number];

export const LIVING_PEOPLE_EXAMPLES = ["Learning", "Teaching", "Growing", "Changing opinions", "Building friendships", "Creating traditions", "Finding new purpose"] as const;

export const LIVING_COMMUNITY_EXAMPLES = ["New parks", "Volunteer groups", "Public artwork", "Scientific clubs", "Local traditions", "Community gardens"] as const;

export const LIVING_CITY_EXAMPLES = ["Historic districts remain", "New architecture appears", "Public transport improves", "Education grows", "Nature matures"] as const;

export const LIVING_PLANET_EXAMPLES = ["Climate stabilises", "Species migrate", "Forests mature", "Oceans recover", "Settlements develop", "Scientific interest changes"] as const;

export const LIVING_KNOWLEDGE_EXAMPLES = ["Old theories refine", "New evidence appears", "Universities publish", "Museums reinterpret", "Students ask better questions"] as const;

export const LIVING_HISTORY_EXAMPLES = ["Additional evidence", "New perspectives", "Recovered archives", "Scientific discoveries"] as const;

export const LIVING_CULTURE_EXAMPLES = ["Art evolves", "Music evolves", "Language evolves", "Architecture evolves", "Cuisine evolves", "Education evolves"] as const;

export const LIVING_SCIENCE_EXAMPLES = ["Research continues", "New disciplines emerge", "Old questions gain answers", "New questions appear"] as const;

export const LIVING_ECOLOGY_EXAMPLES = ["Habitats recover", "Species diversify", "Climate responds", "Human stewardship improves resilience"] as const;

export const LIVING_RELATIONSHIP_EXAMPLES = ["Friendships strengthen", "Mentorship grows", "Communities heal", "Families expand", "Institutions collaborate"] as const;

export const LIVING_CIVILISATION_CONTRIBUTIONS = ["Ideas", "Art", "Science", "Infrastructure", "Culture", "Hope"] as const;

export const LIVING_FEEDBACK_CHAIN = ["Education", "Science", "Ecology", "Wellbeing", "Creativity", "Civilisation"] as const;

export const LIVING_FUTURE_EXAMPLES = ["New opportunities", "New people", "New discoveries", "New friendships", "New mysteries"] as const;

export const LIVING_UNIVERSE_DEVELOPER_TOOLS = ["Universe heartbeat monitor", "Living systems graph", "Growth timeline", "Activity heatmap", "Civilisation vitality dashboard", "Dynamic evolution viewer"] as const;
