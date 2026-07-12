/**
 * Asset Registry (DIRECTIVE — Asset Pipeline & Derivation Rules, binding,
 * 2026-07-12). The single source of truth for every art/audio-adjacent
 * asset the shipped content roster needs: what pipeline it renders
 * through, whether it's a real source file or a code-derived combination
 * of one, and its current delivery status. `docs/ASSET_MANIFEST.md` is
 * generated FROM this file (`scripts/generate-asset-manifest.ts`) — it is
 * never hand-edited.
 *
 * §5 Placeholder discipline: every entry starts at status "missing" (the
 * true state today — zero art exists) rather than "placeholder", since
 * nothing has even a temporary asset yet; main.ts's existing canvas-
 * primitive rendering already satisfies "the game must boot and play with
 * any mix of delivered and placeholder assets" by construction, with zero
 * code change required here.
 */
import { LAUNCH_FLEET, MANUFACTURERS as SHIP_MANUFACTURERS } from "../ships/shipRosterData";
import { LAUNCH_ARSENAL, WEAPON_MANUFACTURERS } from "../weapons/weaponRosterData";
import { GEOMETRIC_FIRE_PATTERNS, IDENTITY_FIRE_PATTERNS, PROJECTILE_BEHAVIOURS } from "../weapons/weaponData";
import { FULL_ROSTER_WITH_FOUNDER } from "../commanders/cmd031AtlasPrime";
import { SANDBOX_ENEMIES } from "../enemies/enemyData";
import { OUTLAW_ENEMIES } from "../enemies/outlawData";
import { MACHINE_ENEMIES } from "../enemies/machineData";
import { CRYSTAL_ENEMIES } from "../enemies/crystalData";
import { VOID_ENEMIES } from "../enemies/voidData";
import { ANCIENT_ENEMIES } from "../enemies/ancientData";
import { XENO_ENEMIES } from "../enemies/xenoData";
import { NOMAD_ENEMIES } from "../enemies/nomadData";
import { PARAGON_ENEMIES } from "../enemies/paragonData";
import { CELESTIAL_ENEMIES } from "../enemies/celestialData";
import { ECLIPSED_ENEMIES } from "../enemies/eclipsedData";
import { MUTATION_KINDS, ELITE_TIERS } from "../enemies/eliteData";
import { SANDBOX_BOSSES, MINI_BOSS, createWorldBossVariant } from "../bosses/bossData";
import { BOSS_ARTIFACTS } from "../bosses/bossArtifacts";
import { SANDBOX_PASSIVES } from "../passives/passiveData";
import { SANDBOX_ARTIFACTS } from "../artifacts/artifactData";
import { ROSTER_RELICS, SANDBOX_RELIC_SETS } from "../relics/relicRosterData";
import { SANDBOX_BIOMES, BIOME_EVENT_KINDS } from "../biomes/biomeData";
import { ANCIENT_CORE_BIOME, ACORE_WEATHER, ACORE_HAZARD_KINDS, ACORE_POI_KINDS } from "../biomes/ancientCoreBiome";
import { CRYSTAL_EXPANSE_BIOME, EXPANSE_WEATHER, EXPANSE_HAZARD_KINDS, EXPANSE_POI_KINDS } from "../biomes/crystalExpanseBiome";
import { DERELICT_EXPANSE_BIOME, WRECK_WEATHER, WRECK_HAZARD_KINDS, WRECK_POI_KINDS } from "../biomes/derelictExpanseBiome";
import { HUMAN_FRONTIER_BIOME, FRONTIER_WEATHER, FRONTIER_HAZARD_KINDS, FRONTIER_POI_KINDS } from "../biomes/frontierBiome";
import { FROZEN_REACH_BIOME, REACH_WEATHER, REACH_HAZARD_KINDS, REACH_POI_KINDS } from "../biomes/frozenReachBiome";
import { LIVING_ECOSPHERES_BIOME, ECO_WEATHER, ECO_HAZARD_KINDS, ECO_POI_KINDS } from "../biomes/livingEcospheresBiome";
import { MACHINE_EXPANSE_BIOME, FORGE_WEATHER, FORGE_HAZARD_KINDS, FORGE_POI_KINDS } from "../biomes/machineExpanseBiome";
import { SINGULARITY_ZONE_BIOME, ZONE_WEATHER, ZONE_HAZARD_KINDS, ZONE_POI_KINDS } from "../biomes/singularityZoneBiome";
import { SOLAR_WASTES_BIOME, WASTES_WEATHER, WASTES_HAZARD_KINDS, WASTES_POI_KINDS } from "../biomes/solarWastesBiome";
import { VOID_EXPANSE_BIOME, VOIDX_WEATHER, VOIDX_HAZARD_KINDS, VOIDX_POI_KINDS } from "../biomes/voidExpanseBiome";
import { GALAXY_CLUSTERS } from "../galaxy/galaxyClusterData";
import { SANDBOX_GALAXY } from "../galaxy/galaxyData";
import { FRAMEWORK_MISSIONS } from "../missions/missionFrameworkData";
import { MISSION_MODIFIER_KINDS } from "../missions/missionData";
import { GAME_STATE_IDS } from "../states/GameStates";
import { PARTICLE_BURSTS } from "../../engine/vfx/particleTuning";
import { RARITY_TABLE } from "../loot/lootTuning";
import { RESOURCE_TYPES } from "../crafting/craftingData";
import { CURRENCY_IDS } from "../economy/economyData";
import { REPUTATION_LEVELS, SANDBOX_FACTION_ROSTER } from "../factions/factionData";
import { INTERACTION_KINDS, ENVIRONMENTAL_CONDITIONS } from "../biomes/biomeData";
import { ELITE_REWARD_POOL } from "../loot/eliteRewardPool";
import { SANDBOX_WAVE_REWARDS } from "../progression/waveRewards";
import { ROSTER_RESEARCH_TREE } from "../research/researchRosterData";
import { BUILD_PATHS } from "../progression/buildPaths";
import { ENVIRONMENTAL_EVENTS } from "../director/directorTuning";
import type { AssetPipelineKind, AssetRegistryEntry } from "./assetPipeline";

/**
 * Production split (Project Owner review, 2026-07-12): precision vector UI
 * is CODE-DRAWN, never image-generated — the Visual Style Rules' rounded
 * chunky geometry (rings, bars, borders, glyphs, frames) is exactly what
 * canvas primitives do best, and generation is the worst tool for it.
 * Particle bursts are in this set because Particles.ts already draws them
 * in code today. These entries stay in the registry (they're real work
 * with real status tracking) but are excluded from the asset run.
 */
const CODE_DRAWN_CATEGORIES = new Set(["input-glyphs", "hud-chrome", "ui-components", "starmap-chrome", "frames", "loot-rarity", "elite-tiers", "particles"]);

/**
 * Generation order (Project Owner review, 2026-07-12): P1 is the playable
 * vertical slice — ships, weapons, enemies, HUD — plus what a slice
 * literally hits in its first minutes (the boss at wave 5, XP gems from
 * the first kill, and the fire-pattern/projectile primitives every weapon
 * composes from). P2: commanders, biomes, and the in-run readability layer.
 * P3: everything else. Generate in that order.
 */
const PRIORITY_1_CATEGORIES = new Set(["ships", "weapons", "enemies", "boss", "hud-chrome", "xp-tiers", "fire-patterns", "projectile-behaviours"]);
const PRIORITY_2_CATEGORIES = new Set(["commanders", "biomes", "environment", "player-vfx", "elite-mutations", "elite-tiers", "combat-entities", "status-effects", "particles", "ui-components", "input-glyphs"]);

const entries: AssetRegistryEntry[] = [];
function add(entry: Omit<AssetRegistryEntry, "status" | "production" | "priority"> & Partial<Pick<AssetRegistryEntry, "status" | "production" | "priority">>): void {
  // §4 colour law: keyColour is EXPLICIT on every keyed entry — a
  // machine-readable registry must not carry an implicit "blank means
  // green" default that every consumer has to know about. Green unless the
  // entry says otherwise (Crystal Dominion/Ascendancy art is magenta-keyed).
  const keyColour = entry.pipeline === "keyed" ? (entry.keyColour ?? "green") : undefined;
  const production = entry.production ?? (CODE_DRAWN_CATEGORIES.has(entry.category) ? "codeDrawn" : "generated");
  const priority = entry.priority ?? (PRIORITY_1_CATEGORIES.has(entry.category) ? 1 : PRIORITY_2_CATEGORIES.has(entry.category) ? 2 : 3);
  entries.push({ status: "missing", ...entry, production, priority, ...(keyColour ? { keyColour } : {}) });
}

/**
 * §4: "Crystal Dominion sprites are magenta-keyed." Faction-tagged keyed
 * art inherits this — commanders included, and the Crystal Ascendancy
 * faction string too (its one commander's authored design brief is
 * crystal-lined suit/halo/gauntlets — the exact crystal-motif art class
 * the magenta key exists for).
 */
const MAGENTA_KEYED_FACTIONS = new Set(["Crystal Dominion", "Crystal Ascendancy"]);

// ── Ships — sprite is source; roster thumbnail is DERIVED (downscale). ──
for (const ship of LAUNCH_FLEET) {
  add({ id: `${ship.id}:portrait`, name: ship.name, category: "ships", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${ship.id}:sprite`, name: ship.name, category: "ships", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${ship.id}:thumbnail`, name: ship.name, category: "ships", pipeline: "keyed", sourceOrDerived: "derived", derivedFrom: `${ship.id}:sprite` });
}

// ── Weapons — icon + projectile are keyed; muzzle/impact are additive. ──
for (const weapon of LAUNCH_ARSENAL) {
  add({ id: `${weapon.id}:icon`, name: weapon.name, category: "weapons", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${weapon.id}:projectile`, name: weapon.name, category: "weapons", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${weapon.id}:muzzle`, name: weapon.name, category: "weapons", pipeline: "additive", sourceOrDerived: "source" });
  add({ id: `${weapon.id}:impact`, name: weapon.name, category: "weapons", pipeline: "additive", sourceOrDerived: "source" });
}

// ── Commanders — portrait/sprite keyed source; ultimate VFX additive source.
// Crystal-faction commanders are magenta-keyed like their faction's enemies (§4). ──
for (const commander of FULL_ROSTER_WITH_FOUNDER) {
  const keyColour = MAGENTA_KEYED_FACTIONS.has(commander.faction) ? ("magenta" as const) : ("green" as const);
  add({ id: `${commander.id}:portrait`, name: commander.name, category: "commanders", pipeline: "keyed", sourceOrDerived: "source", keyColour });
  add({ id: `${commander.id}:sprite`, name: commander.name, category: "commanders", pipeline: "keyed", sourceOrDerived: "source", keyColour });
  add({ id: `${commander.id}:ultimate-vfx`, name: commander.name, category: "commanders", pipeline: "additive", sourceOrDerived: "source" });
}

// ── Equipment + ship modules — icons, keyed source. ──
const EQUIPMENT_IDS = ["refit-cannon", "barrier-plate", "vanguard-thrusters", "vanguard-core", "ancient-relay", "cryo-manifold", "aegis-bastion-array", "aegis-ward-projector", "horizon-flux-capacitor", "nova-warden-hive"];
for (const id of EQUIPMENT_IDS) add({ id: `equipment-${id}`, name: id, category: "equipment", pipeline: "keyed", sourceOrDerived: "source" });
const SHIP_MODULE_IDS = ["module-fusion-reactor", "module-vector-engine", "module-lattice-shield", "module-predictive-targeter", "module-drone-bay", "module-deep-sensor", "module-cryo-loop", "module-axiom-core"];
for (const id of SHIP_MODULE_IDS) add({ id: `shipmodule-${id}`, name: id, category: "ship-modules", pipeline: "keyed", sourceOrDerived: "source" });

// ── Enemies — ONLY idle is source; move/attack/death are derived from it (§2). ──
const ENEMY_GROUPS: Array<{ faction: string; roster: readonly { id: string; name: string }[] }> = [
  { faction: "sandbox", roster: SANDBOX_ENEMIES },
  { faction: "mercenaryGuild", roster: OUTLAW_ENEMIES },
  { faction: "machineCollective", roster: MACHINE_ENEMIES },
  { faction: "crystalDominion", roster: CRYSTAL_ENEMIES },
  { faction: "voidSwarm", roster: VOID_ENEMIES },
  { faction: "ancientCustodians", roster: ANCIENT_ENEMIES },
  { faction: "xenomorphHive", roster: XENO_ENEMIES },
  { faction: "nomadFleet", roster: NOMAD_ENEMIES },
  { faction: "paragonProtocol", roster: PARAGON_ENEMIES },
  { faction: "celestialConclave", roster: CELESTIAL_ENEMIES },
  { faction: "theEclipsed", roster: ECLIPSED_ENEMIES },
];
for (const group of ENEMY_GROUPS) {
  for (const enemy of group.roster) {
    const idleId = `${enemy.id}:idle`;
    add({ id: idleId, name: enemy.name, category: "enemies", pipeline: "keyed", sourceOrDerived: "source", keyColour: group.faction === "crystalDominion" ? "magenta" : "green" });
    for (const state of ["move", "attack", "death"] as const) {
      add({ id: `${enemy.id}:${state}`, name: enemy.name, category: "enemies", pipeline: "keyed", sourceOrDerived: "derived", derivedFrom: idleId, keyColour: group.faction === "crystalDominion" ? "magenta" : "green" });
    }
  }
}

// ── Elite mutations / tiers — standalone additive overlays (composited onto any enemy, never baked into a separate mutated sprite). ──
for (const kind of MUTATION_KINDS as readonly string[]) add({ id: `elite-mutation:${kind}`, name: kind, category: "elite-mutations", pipeline: "additive", sourceOrDerived: "source" });
for (const tier of ELITE_TIERS as readonly string[]) add({ id: `elite-tier:${tier}`, name: tier, category: "elite-tiers", pipeline: "additive", sourceOrDerived: "source" });

// ── Boss — base model is source; World Boss / Mini Boss are derived (scale only). ──
const hollowSentinel = SANDBOX_BOSSES[0]!;
const worldBoss = createWorldBossVariant(hollowSentinel, 1.75);
add({ id: `${hollowSentinel.id}:model`, name: hollowSentinel.name, category: "boss", pipeline: "keyed", sourceOrDerived: "source" });
add({ id: `${worldBoss.id}:model`, name: worldBoss.name, category: "boss", pipeline: "keyed", sourceOrDerived: "derived", derivedFrom: `${hollowSentinel.id}:model` });
add({ id: `${MINI_BOSS.id}:model`, name: MINI_BOSS.name, category: "boss", pipeline: "keyed", sourceOrDerived: "derived", derivedFrom: `${hollowSentinel.id}:model` });
for (const phase of hollowSentinel.phases) add({ id: `${hollowSentinel.id}:${phase.phaseId}`, name: phase.phaseId, category: "boss", pipeline: "additive", sourceOrDerived: "source" });
for (const wp of hollowSentinel.weakPoints) add({ id: `${hollowSentinel.id}:weakpoint:${wp.id}`, name: wp.id, category: "boss", pipeline: "additive", sourceOrDerived: "source" });
if (hollowSentinel.enrage) add({ id: `${hollowSentinel.id}:enrage`, name: "enrage", category: "boss", pipeline: "additive", sourceOrDerived: "source" });

// ── Boss artifacts / passives / artifacts / relics — keyed icon + additive VFX where relevant. ──
for (const a of BOSS_ARTIFACTS) {
  add({ id: `${a.id}:icon`, name: a.name, category: "boss-artifacts", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${a.id}:vfx`, name: a.name, category: "boss-artifacts", pipeline: "additive", sourceOrDerived: "source" });
}
for (const p of SANDBOX_PASSIVES) add({ id: `${p.id}:icon`, name: p.name, category: "passives", pipeline: "keyed", sourceOrDerived: "source" });
for (const a of SANDBOX_ARTIFACTS) {
  add({ id: `${a.id}:icon`, name: a.name, category: "artifacts", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `${a.id}:vfx`, name: a.name, category: "artifacts", pipeline: "additive", sourceOrDerived: "source" });
}
for (const r of ROSTER_RELICS) add({ id: `${r.id}:icon`, name: r.name, category: "relics", pipeline: "keyed", sourceOrDerived: "source" });
for (const s of SANDBOX_RELIC_SETS) add({ id: `${s.id}:set-tell`, name: s.name, category: "relics", pipeline: "additive", sourceOrDerived: "source" });

// ── Biomes — full-bleed backgrounds; weather/hazard are additive; POI icons are keyed; shared events additive. ──
const NAMED_BIOMES = [ANCIENT_CORE_BIOME, CRYSTAL_EXPANSE_BIOME, DERELICT_EXPANSE_BIOME, HUMAN_FRONTIER_BIOME, FROZEN_REACH_BIOME, LIVING_ECOSPHERES_BIOME, MACHINE_EXPANSE_BIOME, SINGULARITY_ZONE_BIOME, SOLAR_WASTES_BIOME, VOID_EXPANSE_BIOME];
for (const b of [SANDBOX_BIOMES[0]!, ...NAMED_BIOMES]) add({ id: `${b.id}:background`, name: b.name, category: "biomes", pipeline: "fullbleed", sourceOrDerived: "source" });
const BIOME_SUBKINDS = [
  { name: "Ancient Core", weather: ACORE_WEATHER, hazards: ACORE_HAZARD_KINDS, poi: ACORE_POI_KINDS },
  { name: "Crystal Expanse", weather: EXPANSE_WEATHER, hazards: EXPANSE_HAZARD_KINDS, poi: EXPANSE_POI_KINDS },
  { name: "Derelict Expanse", weather: WRECK_WEATHER, hazards: WRECK_HAZARD_KINDS, poi: WRECK_POI_KINDS },
  { name: "Human Frontier", weather: FRONTIER_WEATHER, hazards: FRONTIER_HAZARD_KINDS, poi: FRONTIER_POI_KINDS },
  { name: "Frozen Reach", weather: REACH_WEATHER, hazards: REACH_HAZARD_KINDS, poi: REACH_POI_KINDS },
  { name: "Living Ecospheres", weather: ECO_WEATHER, hazards: ECO_HAZARD_KINDS, poi: ECO_POI_KINDS },
  { name: "Machine Expanse", weather: FORGE_WEATHER, hazards: FORGE_HAZARD_KINDS, poi: FORGE_POI_KINDS },
  { name: "Singularity Zone", weather: ZONE_WEATHER, hazards: ZONE_HAZARD_KINDS, poi: ZONE_POI_KINDS },
  { name: "Solar Wastes", weather: WASTES_WEATHER, hazards: WASTES_HAZARD_KINDS, poi: WASTES_POI_KINDS },
  { name: "Void Expanse", weather: VOIDX_WEATHER, hazards: VOIDX_HAZARD_KINDS, poi: VOIDX_POI_KINDS },
];
for (const b of BIOME_SUBKINDS) {
  for (const w of b.weather as readonly string[]) add({ id: `biome-weather:${b.name}:${w}`, name: w, category: "biome-weather", pipeline: "additive", sourceOrDerived: "source" });
  for (const h of b.hazards as readonly string[]) add({ id: `biome-hazard:${b.name}:${h}`, name: h, category: "biome-hazards", pipeline: "additive", sourceOrDerived: "source" });
  for (const p of b.poi as readonly string[]) add({ id: `biome-poi:${b.name}:${p}`, name: p, category: "biome-poi", pipeline: "keyed", sourceOrDerived: "source" });
}
for (const kind of BIOME_EVENT_KINDS as readonly string[]) add({ id: `biome-event:${kind}`, name: kind, category: "biome-events", pipeline: "additive", sourceOrDerived: "source" });

// ── Galaxy structure — full-bleed backgrounds; system nodes keyed icons. ──
for (const cluster of GALAXY_CLUSTERS) add({ id: `galaxy-cluster:${cluster.id}`, name: cluster.name, category: "galaxy", pipeline: "fullbleed", sourceOrDerived: "source" });
const ALL_REGIONS = [...SANDBOX_GALAXY.regions, ...GALAXY_CLUSTERS[1]!.galaxy.regions];
for (const region of ALL_REGIONS) add({ id: `galaxy-region:${region.id}`, name: region.name, category: "galaxy", pipeline: "fullbleed", sourceOrDerived: "source" });
const ALL_SYSTEMS = [...SANDBOX_GALAXY.systems, ...GALAXY_CLUSTERS[1]!.galaxy.systems] as readonly { id: string; name: string }[];
for (const system of ALL_SYSTEMS) add({ id: `galaxy-system:${system.id}`, name: system.name, category: "galaxy", pipeline: "keyed", sourceOrDerived: "source" });

// ── Missions — full-bleed briefing art; modifiers keyed icon + additive overlay. ──
for (const mission of FRAMEWORK_MISSIONS) add({ id: `mission:${mission.id}`, name: mission.name, category: "missions", pipeline: "fullbleed", sourceOrDerived: "source" });
for (const kind of MISSION_MODIFIER_KINDS as readonly string[]) {
  add({ id: `modifier-icon:${kind}`, name: kind, category: "mission-modifiers", pipeline: "keyed", sourceOrDerived: "source" });
  add({ id: `modifier-vfx:${kind}`, name: kind, category: "mission-modifiers", pipeline: "additive", sourceOrDerived: "source" });
}

// ── UI screens — full-bleed backgrounds. ──
for (const screenId of GAME_STATE_IDS as readonly string[]) add({ id: `screen:${screenId}`, name: screenId, category: "ui-screens", pipeline: "fullbleed", sourceOrDerived: "source" });

// ── Particles / status effects / rarity — additive; icons/frames keyed where relevant. ──
for (const kind of Object.keys(PARTICLE_BURSTS)) add({ id: `particle:${kind}`, name: kind, category: "particles", pipeline: "additive", sourceOrDerived: "source" });
const STATUS_KINDS = ["burn", "shock", "freeze", "corruption", "poison", "slow", "stasis", "shieldBreak", "armourBreak", "overload"];
for (const kind of STATUS_KINDS) add({ id: `status:${kind}`, name: kind, category: "status-effects", pipeline: "additive", sourceOrDerived: "source" });
for (const rarity of Object.keys(RARITY_TABLE)) add({ id: `rarity-frame:${rarity}`, name: rarity, category: "loot-rarity", pipeline: "additive", sourceOrDerived: "source" });

// ── Resources / currencies / titles / frames / manufacturer emblems — keyed icons. ──
for (const resource of RESOURCE_TYPES as readonly string[]) add({ id: `resource:${resource}`, name: resource, category: "resources", pipeline: "keyed", sourceOrDerived: "source" });
for (const currency of CURRENCY_IDS as readonly string[]) add({ id: `currency:${currency}`, name: currency, category: "currencies", pipeline: "keyed", sourceOrDerived: "source" });
const TITLES = ["TITLE_UNSCARRED", "TITLE_VETERAN", "TITLE_ARCHIVIST_OF_BOSSES", "TITLE_WINTERLINE_WARDEN", "TITLE_FOUNDRY_BREAKER", "TITLE_UNTOUCHED", "TITLE_DRONE_REAPER"];
for (const t of TITLES) add({ id: `title:${t}`, name: t, category: "titles", pipeline: "keyed", sourceOrDerived: "source" });
const FRAMES = ["FRAME_BOSS_HUNTER", "FRAME_FIRST_LIGHT", "FRAME_ELITE_HUNTER", "FRAME_HARVESTER"];
for (const f of FRAMES) add({ id: `frame:${f}`, name: f, category: "frames", pipeline: "additive", sourceOrDerived: "source" });
const REP_TITLES = ["The Explorer", "The Builder", "The Scientist", "The Guardian", "The Diplomat", "The Founder", "The Pathfinder", "The Restorer"];
for (const t of REP_TITLES) add({ id: `reputation-title:${t}`, name: t, category: "reputation-titles", pipeline: "keyed", sourceOrDerived: "source" });
const ACHIEVEMENT_IDS = ["ach-veteran", "ach-boss-hunter", "ach-curator", "ach-trusted-ally", "ach-researcher", "ach-restorer", "ach-ghost-vault", "ach-first-contact"];
for (const id of ACHIEVEMENT_IDS) add({ id: `achievement:${id}`, name: id, category: "achievements", pipeline: "keyed", sourceOrDerived: "source" });
for (const tier of REPUTATION_LEVELS as readonly string[]) add({ id: `faction-reputation:${tier}`, name: tier, category: "faction-reputation", pipeline: "keyed", sourceOrDerived: "source" });
for (const m of WEAPON_MANUFACTURERS as readonly { id: string; name: string }[]) add({ id: `manufacturer:${m.id}`, name: m.name, category: "manufacturers", pipeline: "keyed", sourceOrDerived: "source" });
for (const m of SHIP_MANUFACTURERS as readonly { id: string; name: string }[]) {
  const dupOfWeapon = (WEAPON_MANUFACTURERS as readonly { id: string }[]).some((w) => w.id === m.id);
  if (!dupOfWeapon) add({ id: `manufacturer:${m.id}`, name: m.name, category: "manufacturers", pipeline: "keyed", sourceOrDerived: "source" });
}
for (const p of [...GEOMETRIC_FIRE_PATTERNS, ...IDENTITY_FIRE_PATTERNS] as readonly string[]) add({ id: `fire-pattern:${p}`, name: p, category: "fire-patterns", pipeline: "additive", sourceOrDerived: "source" });
for (const b of PROJECTILE_BEHAVIOURS as readonly string[]) add({ id: `projectile-behaviour:${b}`, name: b, category: "projectile-behaviours", pipeline: "additive", sourceOrDerived: "source" });
for (const tier of ["small", "medium", "large", "elite", "boss", "ancient", "research"]) add({ id: `xp-tier:${tier}`, name: tier, category: "xp-tiers", pipeline: "keyed", sourceOrDerived: "source" });

// ── Full-sweep additions (2026-07-12, second registry pass): everything
// rendered as a primitive today that the roster-driven walk above missed —
// branding, HUD chrome, the generic UI kit, player-ship VFX, the run-time
// combat/environment entities main.ts already simulates (mines, acid
// pools, gravity wells, telegraphs, loot beams…), interactables, faction
// emblems, research-node icons, and per-ability VFX. All source entries.

// Branding / app identity.
const BRANDING = [
  ["logo-wordmark", "AFTERLIGHT logo/wordmark", "keyed"],
  ["app-icon-512", "PWA app icon 512px", "fullbleed"],
  ["app-icon-192", "PWA app icon 192px", "fullbleed"],
  ["favicon", "Browser favicon", "fullbleed"],
  ["loading-spinner", "Loading spinner/animation", "additive"],
  ["cursor", "Custom cursor", "keyed"],
  ["display-typeface", "Chunky rounded display typeface (Visual Style Rule 5)", "keyed"],
] as const;
for (const [id, name, pipeline] of BRANDING) add({ id: `branding:${id}`, name, category: "branding", pipeline: pipeline as AssetPipelineKind, sourceOrDerived: "source" });

// HUD chrome — every readout the run screen draws as text/rects today.
const HUD_CHROME = ["health-bar", "shield-bar", "energy-bar", "xp-bar", "boss-health-bar", "ultimate-meter", "ability-cooldown", "minimap", "crosshair", "damage-numbers", "toast-banner", "wave-banner", "objective-tracker", "extraction-timer"];
for (const id of HUD_CHROME) add({ id: `hud:${id}`, name: id, category: "hud-chrome", pipeline: "keyed", sourceOrDerived: "source" });

// Generic UI component kit — shared by every screen in GAME_STATE_IDS.
const UI_COMPONENTS = ["button-set", "panel", "card-frame", "tooltip", "modal-frame", "tab-bar", "toggle", "slider", "scrollbar", "list-row", "talent-node-frame"];
for (const id of UI_COMPONENTS) add({ id: `ui:${id}`, name: id, category: "ui-components", pipeline: "keyed", sourceOrDerived: "source" });

// Player-ship VFX — movement/defence states PlayerMovement + DefenceState already simulate.
const PLAYER_VFX = ["engine-trail", "boost-dash", "invuln-shimmer", "barrier-bubble", "shield-impact", "player-death", "player-spawn", "extraction-warp", "heal-pulse"];
for (const id of PLAYER_VFX) add({ id: `player-vfx:${id}`, name: id, category: "player-vfx", pipeline: "additive", sourceOrDerived: "source" });

// Run-time combat/environment entities — real state arrays in main.ts,
// all rendered as primitives today (outlawMines, acidPools, voidZones,
// gravityWells, singularityCharges, meteorImpacts, crystalGrowths,
// machineNetworks' lattice, celestialConstellations' links, xenoHives,
// ancientSites), plus the shared telegraph/spawn/loot/extraction/merchant
// visuals every run uses.
const COMBAT_ENTITIES_KEYED = ["outlaw-mine", "crystal-growth", "xeno-hive", "ancient-site", "loot-cache", "merchant-vessel", "extraction-beacon"];
for (const id of COMBAT_ENTITIES_KEYED) add({ id: `combat-entity:${id}`, name: id, category: "combat-entities", pipeline: "keyed", sourceOrDerived: "source", keyColour: id === "crystal-growth" ? "magenta" : "green" });
const COMBAT_ENTITIES_ADDITIVE = ["meteor-telegraph", "meteor-impact", "acid-pool", "void-zone", "gravity-well", "singularity-charge", "machine-shield-lattice", "constellation-link", "spawn-warp-in", "telegraph-ring", "telegraph-line", "hazard-telegraph", "loot-beam", "extraction-beacon-pulse"];
for (const id of COMBAT_ENTITIES_ADDITIVE) add({ id: `combat-entity:${id}`, name: id, category: "combat-entities", pipeline: "additive", sourceOrDerived: "source" });

// Shared environment layers — the play-field itself.
add({ id: "environment:space-backdrop", name: "Shared deep-space backdrop (starfield base layer)", category: "environment", pipeline: "fullbleed", sourceOrDerived: "source" });
add({ id: "environment:arena-boundary", name: "Arena boundary treatment", category: "environment", pipeline: "additive", sourceOrDerived: "source" });

// Interactables (AF-036 INTERACTION_KINDS) — physical objects the player activates in-run.
for (const kind of INTERACTION_KINDS as readonly string[]) add({ id: `interactable:${kind}`, name: kind, category: "interactables", pipeline: "keyed", sourceOrDerived: "source" });

// Environmental-condition indicators (AF-036) — the biome-condition tags surfaced to the player.
for (const kind of ENVIRONMENTAL_CONDITIONS as readonly string[]) add({ id: `condition:${kind}`, name: kind, category: "environmental-conditions", pipeline: "keyed", sourceOrDerived: "source" });

// Star-map chrome — the GalaxyCommand map's own furniture beyond region/system art.
add({ id: "starmap:route-line", name: "Star-map route/lane line", category: "starmap-chrome", pipeline: "additive", sourceOrDerived: "source" });
add({ id: "starmap:position-marker", name: "Current-position marker", category: "starmap-chrome", pipeline: "keyed", sourceOrDerived: "source" });
add({ id: "starmap:threat-pips", name: "System threat-level pips", category: "starmap-chrome", pipeline: "keyed", sourceOrDerived: "source" });
add({ id: "starmap:locked-marker", name: "Locked-system marker", category: "starmap-chrome", pipeline: "keyed", sourceOrDerived: "source" });

// Boss introduction banner — the AF-035 introduction state's own title card.
add({ id: "banner:boss-intro", name: "Boss introduction banner/title card", category: "banners", pipeline: "fullbleed", sourceOrDerived: "source" });

// Ship active abilities (AF-031, KeyR) — one VFX per hull's named ability.
for (const ship of LAUNCH_FLEET) add({ id: `${ship.id}:ability-vfx`, name: `${ship.name} — ${ship.ability.name}`, category: "ship-abilities", pipeline: "additive", sourceOrDerived: "source" });

// Commander active abilities (AF-030, cooldown-gated) — one VFX per commander's named active.
for (const commander of FULL_ROSTER_WITH_FOUNDER) add({ id: `${commander.id}:active-vfx`, name: `${commander.name} — ${commander.active.name}`, category: "commander-actives", pipeline: "additive", sourceOrDerived: "source" });

// Elite/Wave reward grant VFX (GP-FINAL) — the moment each reward kind fires.
for (const reward of ELITE_REWARD_POOL) add({ id: `${reward.id}:vfx`, name: reward.name, category: "elite-reward-vfx", pipeline: "additive", sourceOrDerived: "source" });
for (const reward of SANDBOX_WAVE_REWARDS) add({ id: `${reward.id}:vfx`, name: reward.name, category: "wave-reward-vfx", pipeline: "additive", sourceOrDerived: "source" });

// Faction emblems (AF-039/085) — reputation UI, mission givers, codex.
for (const faction of SANDBOX_FACTION_ROSTER.factions) add({ id: `faction-emblem:${faction.id}`, name: faction.name, category: "faction-emblems", pipeline: "keyed", sourceOrDerived: "source", keyColour: MAGENTA_KEYED_FACTIONS.has(faction.name) ? "magenta" : "green" });

// Research-node icons (AF-024) — the research tree renders one node per def.
for (const node of ROSTER_RESEARCH_TREE) add({ id: `research-node:${node.id}`, name: node.name, category: "research-nodes", pipeline: "keyed", sourceOrDerived: "source" });

// ── Proof-pass additions (2026-07-12, third registry pass) ──────────────

// Build-Defining Path choice cards (GP-001, every 5 waves) — nine paths, each a real card the player picks.
for (const path of BUILD_PATHS) add({ id: `build-path:${path.id}`, name: path.name, category: "build-paths", pipeline: "keyed", sourceOrDerived: "source" });

// Loot base items (SANDBOX_DROP_TABLE, main.ts — inline data, mirrored here) — every drop names one of these.
const LOOT_BASE_ITEMS = ["PROTO_CANNON", "HULL_PLATING", "STRANGE_RELIC", "SALVAGED_ALLOY", "RESEARCH_CORE"];
for (const id of LOOT_BASE_ITEMS) add({ id: `loot-item:${id}`, name: id.replaceAll("_", " ").toLowerCase(), category: "loot-items", pipeline: "keyed", sourceOrDerived: "source" });

// Director environmental events (AF-017/GP-002) — distinct from the biome-event kinds; each needs an onset VFX/announcement.
for (const event of ENVIRONMENTAL_EVENTS as readonly string[]) add({ id: `director-event:${event}`, name: event, category: "director-events", pipeline: "additive", sourceOrDerived: "source" });

// Input prompt glyphs (AF-019 DEFAULT_BINDINGS — keyboard, gamepad, mouse, touch all bindable today).
const INPUT_GLYPHS = ["pad-north", "pad-south", "pad-east", "pad-west", "pad-dpad-up", "pad-dpad-down", "pad-dpad-left", "pad-dpad-right", "pad-start", "pad-back", "keyboard-keycap-frame", "mouse-left", "mouse-right", "touch-button-frame"];
for (const id of INPUT_GLYPHS) add({ id: `input-glyph:${id}`, name: id, category: "input-glyphs", pipeline: "keyed", sourceOrDerived: "source" });

// Hostile-projectile tint — enemy shots reuse the player projectile primitives but MUST read
// as hostile at a glance (AF-004 readability law); one shared additive treatment.
add({ id: "combat-entity:hostile-projectile-tint", name: "hostile-projectile-tint", category: "combat-entities", pipeline: "additive", sourceOrDerived: "source" });

export const ASSET_REGISTRY: readonly AssetRegistryEntry[] = entries;

export function sourceEntries(): readonly AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter((e) => e.sourceOrDerived === "source");
}
export function derivedEntries(): readonly AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter((e) => e.sourceOrDerived === "derived");
}
export function entriesByPipeline(pipeline: AssetPipelineKind): readonly AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter((e) => e.pipeline === pipeline);
}
/** Source entries that actually enter the generation run — code-drawn entries are engineering work, not art generation. */
export function generatedSourceEntries(): readonly AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter((e) => e.sourceOrDerived === "source" && e.production === "generated");
}
export function codeDrawnEntries(): readonly AssetRegistryEntry[] {
  return ASSET_REGISTRY.filter((e) => e.production === "codeDrawn");
}
