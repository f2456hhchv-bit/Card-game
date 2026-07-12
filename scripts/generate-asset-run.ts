/**
 * The asset run file — docs/asset-run.json, via `npm run assets:run`.
 * One importable data file for an external prompt generator: the full art
 * directive at the top, then one entry per SOURCE asset (derived entries
 * are code-generated per the Asset Pipeline Directive §2 and need no art)
 * carrying structured REQUIREMENTS — pipeline/delivery/keying, view and
 * size guidance, and every piece of world context the generator needs to
 * compose its own prompt: faction + palette, biome + visual identity,
 * manufacturer house style, rarity, lore, roles, ability names, usage.
 *
 * No prompt strings — the generator writes those. Source of truth:
 * src/game/assets/assetRegistry.ts; never hand-edit the output.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { sourceEntries, derivedEntries } from "../src/game/assets/assetRegistry";
import type { AssetPipelineKind, AssetRegistryEntry } from "../src/game/assets/assetPipeline";
import { LAUNCH_FLEET, FLEET_ENTRIES, MANUFACTURERS as SHIP_MANUFACTURERS } from "../src/game/ships/shipRosterData";
import { LAUNCH_ARSENAL, ARSENAL_ENTRIES, WEAPON_MANUFACTURERS } from "../src/game/weapons/weaponRosterData";
import { FULL_ROSTER_WITH_FOUNDER, FULL_PROFILES_WITH_FOUNDER } from "../src/game/commanders/cmd031AtlasPrime";
import { SANDBOX_ENEMIES } from "../src/game/enemies/enemyData";
import { OUTLAW_ENEMIES } from "../src/game/enemies/outlawData";
import { MACHINE_ENEMIES } from "../src/game/enemies/machineData";
import { CRYSTAL_ENEMIES } from "../src/game/enemies/crystalData";
import { VOID_ENEMIES } from "../src/game/enemies/voidData";
import { ANCIENT_ENEMIES } from "../src/game/enemies/ancientData";
import { XENO_ENEMIES } from "../src/game/enemies/xenoData";
import { NOMAD_ENEMIES } from "../src/game/enemies/nomadData";
import { PARAGON_ENEMIES } from "../src/game/enemies/paragonData";
import { CELESTIAL_ENEMIES } from "../src/game/enemies/celestialData";
import { ECLIPSED_ENEMIES } from "../src/game/enemies/eclipsedData";
import { SANDBOX_BOSSES } from "../src/game/bosses/bossData";
import { BOSS_ARTIFACTS } from "../src/game/bosses/bossArtifacts";
import { SANDBOX_PASSIVES } from "../src/game/passives/passiveData";
import { SANDBOX_ARTIFACTS } from "../src/game/artifacts/artifactData";
import { ROSTER_RELICS, SANDBOX_RELIC_SETS, ROSTER_RELIC_PROFILES } from "../src/game/relics/relicRosterData";
import { SANDBOX_BIOMES } from "../src/game/biomes/biomeData";
import { ANCIENT_CORE_BIOME } from "../src/game/biomes/ancientCoreBiome";
import { CRYSTAL_EXPANSE_BIOME } from "../src/game/biomes/crystalExpanseBiome";
import { DERELICT_EXPANSE_BIOME } from "../src/game/biomes/derelictExpanseBiome";
import { HUMAN_FRONTIER_BIOME } from "../src/game/biomes/frontierBiome";
import { FROZEN_REACH_BIOME } from "../src/game/biomes/frozenReachBiome";
import { LIVING_ECOSPHERES_BIOME } from "../src/game/biomes/livingEcospheresBiome";
import { MACHINE_EXPANSE_BIOME } from "../src/game/biomes/machineExpanseBiome";
import { SINGULARITY_ZONE_BIOME } from "../src/game/biomes/singularityZoneBiome";
import { SOLAR_WASTES_BIOME } from "../src/game/biomes/solarWastesBiome";
import { VOID_EXPANSE_BIOME } from "../src/game/biomes/voidExpanseBiome";
import { biomeVisualIdentityFor, FACTION_COLOUR_SIGNATURES } from "../src/game/visual/visualDirectionData";
import { GALAXY_CLUSTERS } from "../src/game/galaxy/galaxyClusterData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { FRAMEWORK_MISSIONS } from "../src/game/missions/missionFrameworkData";
import { PARTICLE_BURSTS } from "../src/engine/vfx/particleTuning";
import { RARITY_TABLE } from "../src/game/loot/lootTuning";
import { SANDBOX_FACTION_ROSTER } from "../src/game/factions/factionData";
import { ELITE_REWARD_POOL } from "../src/game/loot/eliteRewardPool";
import { SANDBOX_WAVE_REWARDS } from "../src/game/progression/waveRewards";
import { ROSTER_RESEARCH_TREE } from "../src/game/research/researchRosterData";

// ── Lookup maps ────────────────────────────────────────────────────────────
const shipsById = new Map(LAUNCH_FLEET.map((s) => [s.id, s]));
const fleetEntriesById = new Map(FLEET_ENTRIES.map((e) => [e.shipId, e]));
const weaponsById = new Map(LAUNCH_ARSENAL.map((w) => [w.id, w]));
const arsenalEntriesById = new Map(ARSENAL_ENTRIES.map((e) => [e.weaponId, e]));
const commandersById = new Map(FULL_ROSTER_WITH_FOUNDER.map((c) => [c.id, c]));
const profilesById = new Map(FULL_PROFILES_WITH_FOUNDER.map((p) => [p.commanderId, p]));
const bossArtifactsById = new Map(BOSS_ARTIFACTS.map((a) => [a.id, a]));
const passivesById = new Map(SANDBOX_PASSIVES.map((p) => [p.id, p]));
const artifactsById = new Map(SANDBOX_ARTIFACTS.map((a) => [a.id, a]));
const relicsById = new Map(ROSTER_RELICS.map((r) => [r.id, r]));
const relicProfilesById = new Map(ROSTER_RELIC_PROFILES.map((p: any) => [p.relicId, p]));
const relicSetsById = new Map(SANDBOX_RELIC_SETS.map((s) => [s.id, s]));
const missionsById = new Map(FRAMEWORK_MISSIONS.map((m) => [m.id, m]));

const ENEMY_GROUPS: Array<{ key: string; faction: string; roster: readonly any[] }> = [
  { key: "sandbox", faction: "Sandbox (factionless)", roster: SANDBOX_ENEMIES },
  { key: "mercenaryGuild", faction: "Mercenary Guild / Outlaws", roster: OUTLAW_ENEMIES },
  { key: "machineCollective", faction: "Machine Collective", roster: MACHINE_ENEMIES },
  { key: "crystalDominion", faction: "Crystal Dominion", roster: CRYSTAL_ENEMIES },
  { key: "voidSwarm", faction: "Void Swarm", roster: VOID_ENEMIES },
  { key: "ancientCustodians", faction: "Ancient Custodians", roster: ANCIENT_ENEMIES },
  { key: "xenomorphHive", faction: "Xenomorph Hive", roster: XENO_ENEMIES },
  { key: "nomadFleet", faction: "Stellar Nomads", roster: NOMAD_ENEMIES },
  { key: "paragonProtocol", faction: "Paragon Protocol", roster: PARAGON_ENEMIES },
  { key: "celestialConclave", faction: "Celestial Conclave", roster: CELESTIAL_ENEMIES },
  { key: "theEclipsed", faction: "The Eclipsed", roster: ECLIPSED_ENEMIES },
];
const enemiesById = new Map<string, { enemy: any; factionKey: string; faction: string }>();
for (const group of ENEMY_GROUPS) for (const enemy of group.roster) enemiesById.set(enemy.id, { enemy, factionKey: group.key, faction: group.faction });

/** Faction visual language — authored colour signatures where they exist, catalogued roster language otherwise. */
const FACTION_VISUAL_FALLBACK: Record<string, string> = {
  sandbox: "neutral steel grey, cyan energy accents",
  voidSwarm: "void black / deep violet / fracture magenta; black energy, distorted silhouettes, gravitational lensing",
  xenomorphHive: "dark chitin / amber-yellow veins (colour law: no green in keyed sprites); organic bone plating, bioluminescent, spined",
  paragonProtocol: "white lab alloy / orange warning lights / cracked energy-core blue; quantum distortion",
  celestialConclave: "solar plasma gold-white / nebula violet; gravitational-lensing halos",
  theEclipsed: "grey hull / purple corruption / pale memory white; damaged armour, flickering lights, broken insignias, ghost-like",
};
function factionVisual(key: string): { palette?: string; visualSignature?: string; language?: string } {
  const sig = (FACTION_COLOUR_SIGNATURES as Record<string, { primary: string; secondary: string; energy: string; uiAccent: string; lightingTheme: string; materialPalette: string; visualSignature: string } | undefined>)[key];
  if (sig) return { palette: `${sig.primary} / ${sig.secondary} / ${sig.energy} (UI accent ${sig.uiAccent})`, visualSignature: `${sig.visualSignature}; ${sig.materialPalette}; ${sig.lightingTheme}` };
  return { language: FACTION_VISUAL_FALLBACK[key] };
}

const NAMED_BIOMES: readonly any[] = [SANDBOX_BIOMES[0]!, ANCIENT_CORE_BIOME, CRYSTAL_EXPANSE_BIOME, DERELICT_EXPANSE_BIOME, HUMAN_FRONTIER_BIOME, FROZEN_REACH_BIOME, LIVING_ECOSPHERES_BIOME, MACHINE_EXPANSE_BIOME, SINGULARITY_ZONE_BIOME, SOLAR_WASTES_BIOME, VOID_EXPANSE_BIOME];
const biomesById = new Map(NAMED_BIOMES.map((b) => [b.id, b]));
/** The registry's biome sub-kind ids embed a display name — map it back to the def. */
const BIOME_BY_DISPLAY_NAME: Record<string, any> = {
  "Ancient Core": ANCIENT_CORE_BIOME,
  "Crystal Expanse": CRYSTAL_EXPANSE_BIOME,
  "Derelict Expanse": DERELICT_EXPANSE_BIOME,
  "Human Frontier": HUMAN_FRONTIER_BIOME,
  "Frozen Reach": FROZEN_REACH_BIOME,
  "Living Ecospheres": LIVING_ECOSPHERES_BIOME,
  "Machine Expanse": MACHINE_EXPANSE_BIOME,
  "Singularity Zone": SINGULARITY_ZONE_BIOME,
  "Solar Wastes": SOLAR_WASTES_BIOME,
  "Void Expanse": VOID_EXPANSE_BIOME,
};
function biomeContext(biome: any): Record<string, unknown> {
  const vis = biomeVisualIdentityFor(biome.id);
  const authored = !vis.lighting.includes("(generated)");
  return {
    biome: biome.name,
    biomeId: biome.id,
    biomeLore: biome.lore,
    biomeVisualIdentity: authored ? vis : undefined,
    biomeVisualIdentityStatus: authored ? "authored" : "unauthored — art direction not yet written for this biome; generator should flag, not invent silently",
  };
}

/** Where in-game runtime entities come from — the user asked for faction/biome origin per asset. */
const COMBAT_ENTITY_ORIGIN: Record<string, { description: string; factionKey?: string; usedIn: string }> = {
  "outlaw-mine": { description: "Proximity mine seeded by the Outlaw Mine Layer; small, readable, clearly dangerous", factionKey: "mercenaryGuild", usedIn: "in-run gameplay" },
  "crystal-growth": { description: "Living crystal growth spreading across the arena floor (terrain expansion)", factionKey: "crystalDominion", usedIn: "in-run gameplay" },
  "xeno-hive": { description: "Hive structure — organic, bone-plated, bioluminescent", factionKey: "xenomorphHive", usedIn: "in-run gameplay" },
  "ancient-site": { description: "Security site structure — white stone alloy, gold conduit", factionKey: "ancientCustodians", usedIn: "in-run gameplay" },
  "loot-cache": { description: "Dropped loot cache/canister awaiting pickup; tinted by rarity frame at runtime", usedIn: "in-run gameplay" },
  "merchant-vessel": { description: "The Travelling Merchant's vessel — mismatched trader hull, inviting not hostile", usedIn: "in-run merchant encounter" },
  "extraction-beacon": { description: "Extraction beacon structure the player reaches to end the run", usedIn: "in-run extraction phase" },
  "meteor-telegraph": { description: "Impact warning ring shown on the ground before a meteor strike", usedIn: "Meteor Shower environmental event" },
  "meteor-impact": { description: "Meteor strike impact burst", usedIn: "Meteor Shower environmental event" },
  "acid-pool": { description: "Acid pool ground hazard with a lazy bubble loop; AMBER not green (colour law)", factionKey: "xenomorphHive", usedIn: "in-run gameplay" },
  "void-zone": { description: "Void corruption zone — reality-torn dark patch with a violet edge", factionKey: "voidSwarm", usedIn: "in-run gameplay" },
  "gravity-well": { description: "Visible distortion ring pulling inward", factionKey: "celestialConclave", usedIn: "in-run gameplay" },
  "singularity-charge": { description: "Unstable contained point of light", factionKey: "paragonProtocol", usedIn: "in-run gameplay" },
  "machine-shield-lattice": { description: "Shared-shield lattice — hexagonal energy links between networked units", factionKey: "machineCollective", usedIn: "in-run gameplay" },
  "constellation-link": { description: "Constellation link-line between networked enemies", factionKey: "celestialConclave", usedIn: "in-run gameplay" },
  "spawn-warp-in": { description: "Enemy spawn warp-in flash — brief, readable, fair (spawn-fairness telegraph)", usedIn: "every enemy spawn" },
  "telegraph-ring": { description: "Generic radial attack telegraph — reads instantly as danger area", usedIn: "enemy/boss attacks" },
  "telegraph-line": { description: "Generic line/cone attack telegraph (snipers, beams)", usedIn: "enemy/boss attacks" },
  "hazard-telegraph": { description: "Hazard-zone arming telegraph before a zone deals damage", usedIn: "all hazard zones" },
  "loot-beam": { description: "Vertical light column marking a drop; tinted by rarity", usedIn: "in-run loot drops" },
  "extraction-beacon-pulse": { description: "Active pulse while the extraction countdown runs", usedIn: "in-run extraction phase" },
};

const HUD_DESCRIPTIONS: Record<string, string> = {
  "health-bar": "Player hull/health bar", "shield-bar": "Player shield/barrier bar, distinct from health at a glance",
  "energy-bar": "Ship energy bar (weapon/ability energy pool)", "xp-bar": "XP progress bar with level indicator",
  "boss-health-bar": "Boss health bar with phase-threshold ticks and weak-point indicator slot",
  "ultimate-meter": "Commander ultimate charge meter with a clear READY state", "ability-cooldown": "Ability cooldown indicator (radial or pips)",
  "minimap": "Minimap frame + player/enemy/objective blips", "crosshair": "Aim crosshair/reticle",
  "damage-numbers": "Floating damage-number treatment, distinct crit variant", "toast-banner": "Loot/reward toast notification banner",
  "wave-banner": "Wave announcement banner (WAVE 5, MINI BOSS…)", "objective-tracker": "Mission objective tracker (primary + optional)",
  "extraction-timer": "Extraction countdown readout",
};
const UI_DESCRIPTIONS: Record<string, { description: string; states?: string[] }> = {
  "button-set": { description: "Button component", states: ["normal", "hover", "pressed", "disabled"] },
  "panel": { description: "Screen panel background, 9-slice-friendly" },
  "card-frame": { description: "Choice-card frame (level-ups, build paths, boss artifacts)", states: ["normal", "selected"] },
  "tooltip": { description: "Tooltip bubble" }, "modal-frame": { description: "Modal/dialog frame, 9-slice-friendly" },
  "tab-bar": { description: "Tab bar", states: ["active", "inactive"] }, "toggle": { description: "Settings toggle", states: ["on", "off"] },
  "slider": { description: "Settings slider — track, fill, handle" }, "scrollbar": { description: "Scrollbar — track and thumb" },
  "list-row": { description: "List/roster row background", states: ["normal", "selected"] },
  "talent-node-frame": { description: "Talent-tree node frame", states: ["locked", "available", "unlocked"] },
};
const PLAYER_VFX_DESCRIPTIONS: Record<string, string> = {
  "engine-trail": "Constant thruster trail, subtle, never obscures the ship", "boost-dash": "Boost dash burst along the dash direction",
  "invuln-shimmer": "Invulnerability-frame outline glow during boost", "barrier-bubble": "Active barrier/shield bubble around the ship",
  "shield-impact": "Shield impact flash + knockback ring", "player-death": "Ship destruction — fragment-and-flash, bold and brief",
  "player-spawn": "Spawn-in / mission-start materialisation", "extraction-warp": "Warp-out in a bold vertical light column",
  "heal-pulse": "Hull-repair pulse (repair drones, heal passives, patch kits)",
};
const INTERACTABLE_DESCRIPTIONS: Record<string, string> = {
  activateAncientDevice: "Ancient device the player activates (dormant + active states)", destroyObstacle: "Destructible obstacle",
  openHiddenArea: "Sealed hidden-area entrance", triggerEvent: "Event trigger console/beacon", harvestResource: "Harvestable resource node",
  disableHazard: "Hazard control the player disables", unlockSecret: "Secret lock/vault marker",
};
const STARMAP_DESCRIPTIONS: Record<string, string> = {
  "route-line": "Route/lane line between systems (travelled + untravelled states)", "position-marker": "Current-position marker",
  "threat-pips": "System threat-level pips (threat 1-7)", "locked-marker": "Locked/undiscovered system marker",
};
const STATUS_TREATMENT: Record<string, string> = {
  burn: "warm orange tint + fat ember particles", freeze: "pale blue tint + chunky frost ring", shock: "pale yellow tint + crackling arcs",
  corruption: "void-purple tint + glitching outline", poison: "AMBER tint (colour law — lore colour is green) + bubbling droplets",
  slow: "grey-blue tint + slow drifting ring", stasis: "pale cyan tint + frozen-in-place ring", shieldBreak: "white flash + shattering shards",
  armourBreak: "orange flash + cracking plates", overload: "electric blue tint + crackling overload arcs",
};
const MUTATION_TELL: Record<string, string> = {
  regeneration: "pulsing GOLD hull seams (colour law — lore colour is green)", shielded: "barrier shimmer", explosive: "cracked glowing plating",
  teleport: "spatial-distortion flash", reflectiveArmour: "mirrored sheen", rapidAssault: "overcharged weapon glow", gravityField: "distortion ring",
  summoner: "beacon pulse before each spawn", berserker: "red low-hull flare", cryogenic: "frost trail", incendiary: "trailing embers",
  corrupted: "glitching void-purple outline", quantumShift: "flickering double-image", temporalEcho: "trailing translucent duplicate",
  adaptiveArmour: "colour-shifting plates", electric: "crackling arcs", cloaked: "fading outline on a visible cycle", vampiric: "red damage tether from target",
};
const FIRE_PATTERN_GEOMETRY: Record<string, string> = {
  singleShot: "one projectile straight ahead", burst: "rapid sequence along one line", spread: "simultaneous fan", arc: "swept arc volley",
  nova: "ring in all directions", spiral: "rotating emission angle", beam: "continuous beam", orbit: "projectiles circling the ship",
  homing: "seeking launch", chain: "arcs target-to-target", wave: "wide wavefront", chargedShot: "held charge then single heavy release",
};
const PROJECTILE_BEHAVIOUR_MOTION: Record<string, string> = {
  straight: "constant velocity line", seeking: "curves toward target", bouncing: "reflects off arena bounds", piercing: "passes through targets",
  explosive: "detonates in a radius on hit", returning: "boomerangs back to the ship", accelerating: "gains speed over flight",
  splitting: "splits into fragments mid-flight", orbiting: "orbits the ship", chainLightning: "arcs between targets",
  persistentBeam: "sustained beam, not a projectile", gravityAffected: "arcs under gravity wells",
};
const SCREEN_PURPOSE: Record<string, string> = {
  Boot: "initial boot", Splash: "splash/logo", MainMenu: "main menu", GalaxyCommand: "home-base hub + star map", MissionSelect: "mission selection",
  Loading: "loading transition", Gameplay: "in-run HUD frame", Pause: "pause overlay", LevelUp: "level-up choice overlay",
  InventoryOverlay: "inventory overlay", MissionComplete: "results/victory", Defeat: "defeat/game-over", Statistics: "statistics",
  Multiplayer: "reserved, unbuilt", CommunityHub: "reserved, unbuilt", BuildPathChoice: "build-defining path choice overlay",
  MidRunMerchant: "mid-run merchant overlay", ExtractionDecision: "extraction risk/reward decision overlay",
  BossArtifactChoice: "boss artifact reward choice overlay", RecruitCommanders: "commander recruitment", ViewMuseum: "relic museum",
  ReadCodex: "codex/lore", ManageAtlas: "Atlas meta-stat screen", LoadoutChoice: "pre-run loadout picker",
};

// ── Size / view guidance per pipeline+category (suggested minimums, not law). ──
function assetShape(entry: AssetRegistryEntry, subtype: string): { assetType: string; view?: string; suggestedSize: string; nineSlice?: boolean } {
  const cat = entry.category;
  if (cat === "ships" && subtype === "portrait") return { assetType: "character/vehicle portrait", view: "3/4 hero angle, plain dark backdrop", suggestedSize: "512x512" };
  if (cat === "ships" && subtype === "sprite") return { assetType: "in-run sprite", view: "top-down, nose north", suggestedSize: "256x256, trimmed" };
  if (cat === "commanders" && subtype === "portrait") return { assetType: "character portrait", view: "head-and-shoulders", suggestedSize: "512x512" };
  if (cat === "commanders" && subtype === "sprite") return { assetType: "in-run sprite", view: "full body, facing north", suggestedSize: "256x256, trimmed" };
  if (cat === "enemies") return { assetType: "in-run sprite (idle only — move/attack/death are code-derived)", view: "top-down/side hybrid, facing north", suggestedSize: "256x256, trimmed" };
  if (cat === "boss" && subtype === "model") return { assetType: "boss sprite/model render", view: "top-down/side hybrid, facing north", suggestedSize: "1024x1024, trimmed" };
  if (entry.pipeline === "fullbleed" && cat === "ui-screens") return { assetType: "screen background/layout art", suggestedSize: "1920x1080" };
  if (entry.pipeline === "fullbleed" && entry.id.startsWith("branding:app-icon-512")) return { assetType: "app icon", suggestedSize: "512x512 exact" };
  if (entry.pipeline === "fullbleed" && entry.id.startsWith("branding:app-icon-192")) return { assetType: "app icon", suggestedSize: "192x192 exact" };
  if (entry.id === "branding:favicon") return { assetType: "favicon", suggestedSize: "64x64" };
  if (entry.pipeline === "fullbleed") return { assetType: "background art", suggestedSize: "1920x1080" };
  if (cat === "hud-chrome" || cat === "ui-components") return { assetType: "UI element", suggestedSize: "as-needed, 9-slice where panel/bar-shaped", nineSlice: true };
  if (entry.pipeline === "additive") return { assetType: "VFX (single frame or short frame sheet)", suggestedSize: "256x256 per frame" };
  if (subtype === "icon" || cat.endsWith("s") /* icon-shaped defaults */) return { assetType: "icon", view: "centered, transparent background", suggestedSize: "128x128" };
  return { assetType: "sprite", suggestedSize: "256x256, trimmed" };
}

// ── Build the entries ──────────────────────────────────────────────────────
const assets: Record<string, unknown>[] = [];
let unmatched = 0;

for (const entry of sourceEntries()) {
  const lastColon = entry.id.lastIndexOf(":");
  const baseId = entry.id.slice(0, lastColon === -1 ? entry.id.length : lastColon);
  const subtype = lastColon === -1 ? "" : entry.id.slice(lastColon + 1);
  const shape = assetShape(entry, subtype);
  const context: Record<string, unknown> = {};
  let matched = false;

  const ship = shipsById.get(baseId);
  if (ship) {
    matched = true;
    const fleet = fleetEntriesById.get(ship.id);
    const manufacturer = SHIP_MANUFACTURERS.find((m: any) => m.name === ship.manufacturer || m.id === ship.manufacturer) as any;
    Object.assign(context, {
      subject: subtype === "ability-vfx" ? `ship ability "${ship.ability.name}" of the ${ship.name}` : `the ${ship.name}, ${ship.shipClass}-class starship`,
      shipClass: ship.shipClass, tier: fleet?.tier, specialisation: fleet?.specialisation,
      manufacturer: ship.manufacturer, manufacturerVisualIdentity: manufacturer?.visualIdentity, manufacturerEngineering: manufacturer?.engineeringStrengths ?? manufacturer?.technologyPhilosophy,
      lore: ship.lore, usedIn: subtype === "portrait" ? "hangar/loadout screens" : subtype === "ability-vfx" ? "in-run gameplay (KeyR ability)" : "in-run gameplay",
    });
  }
  const weapon = weaponsById.get(baseId);
  if (weapon) {
    matched = true;
    const arsenal = arsenalEntriesById.get(weapon.id);
    const manufacturer = WEAPON_MANUFACTURERS.find((m: any) => m.name === weapon.manufacturer || m.id === weapon.manufacturer) as any;
    Object.assign(context, {
      subject: `the ${weapon.name}, ${weapon.category} weapon`,
      weaponCategory: weapon.category, rarity: weapon.rarity, rarityHex: (RARITY_TABLE as any)[weapon.rarity]?.colour, tier: arsenal?.tier, family: arsenal?.familyId,
      manufacturer: weapon.manufacturer, manufacturerVisualIdentity: manufacturer?.visualIdentity, manufacturerSignature: manufacturer?.signatureMechanic,
      firePattern: `${weapon.firePattern} — ${FIRE_PATTERN_GEOMETRY[weapon.firePattern] ?? ""}`,
      projectileBehaviour: `${weapon.projectileBehaviour} — ${PROJECTILE_BEHAVIOUR_MOTION[weapon.projectileBehaviour] ?? ""}`,
      damageSchool: weapon.damageSchool, statusOnHit: weapon.statusOnHit?.kind ?? null, lore: weapon.lore,
      usedIn: subtype === "icon" ? "loadout/inventory/HUD" : "in-run gameplay",
      assetPart: subtype, // icon | projectile | muzzle | impact
    });
  }
  const commander = commandersById.get(baseId);
  if (commander) {
    matched = true;
    const profile = profilesById.get(baseId) as any;
    Object.assign(context, {
      subject: subtype === "ultimate-vfx" ? `ultimate ability "${commander.ultimate.name}"` : subtype === "active-vfx" ? `active ability "${commander.active.name}" (fires often — visibly smaller than an ultimate)` : `${commander.name} "${commander.callsign}"`,
      archetype: commander.archetype, commanderClass: profile?.class, faction: commander.faction,
      biography: commander.biography, designBrief: profile?.visualDesign,
      usedIn: subtype === "portrait" ? "recruitment/roster/loadout screens, dialogue framing" : subtype === "sprite" ? "in-run gameplay" : "in-run gameplay",
    });
  }
  const enemyHit = enemiesById.get(baseId);
  if (enemyHit) {
    matched = true;
    const { enemy, factionKey, faction } = enemyHit;
    Object.assign(context, {
      subject: `${enemy.name}, ${enemy.family}`,
      faction, factionVisual: factionVisual(factionKey),
      roles: enemy.roles, family: enemy.family, attackType: enemy.attack?.attackType, lore: enemy.lore,
      xpTier: enemy.xpTier, usedIn: "in-run gameplay",
      statesNote: "idle only — move/attack/death states are derived in code from this sprite",
    });
  }
  if (entry.category === "boss") {
    matched = true;
    const boss = SANDBOX_BOSSES[0]!;
    Object.assign(context, {
      subject: subtype === "model" ? `${boss.name}, "${boss.title}"` : `${entry.name} (${subtype})`,
      faction: boss.faction, family: boss.family, lore: boss.lore,
      phases: boss.phases.map((p) => ({ id: p.phaseId, attack: p.attack.name ?? p.attack.attackType, mechanic: p.mechanic })),
      weakPoint: boss.weakPoints[0]?.id, usedIn: "in-run boss encounters (base model reused at scale for World Boss / Mini Boss variants)",
    });
  }
  const bossArtifact = bossArtifactsById.get(baseId);
  if (bossArtifact) { matched = true; Object.assign(context, { subject: bossArtifact.name, description: bossArtifact.description, usedIn: subtype === "icon" ? "BossArtifactChoice overlay, HUD" : "in-run gameplay" }); }
  const passive = passivesById.get(baseId);
  if (passive) { matched = true; Object.assign(context, { subject: passive.name, description: passive.description, passiveCategory: passive.category, trigger: passive.trigger, usedIn: "level-up cards, HUD" }); }
  const artifact = artifactsById.get(baseId);
  if (artifact) { matched = true; Object.assign(context, { subject: artifact.name, description: artifact.description, usedIn: subtype === "icon" ? "merchant/inventory" : "in-run gameplay" }); }
  const relic = relicsById.get(baseId);
  if (relic) {
    matched = true;
    const rp = relicProfilesById.get(baseId) as any;
    Object.assign(context, { subject: relic.name, description: relic.description, relicCategory: (relic as any).category, rarity: (relic as any).rarity, rarityHex: (RARITY_TABLE as any)[(relic as any).rarity]?.colour, profileVisual: rp?.visualIdentity, usedIn: "museum, inventory, drop beams" });
  }
  const relicSet = relicSetsById.get(baseId);
  if (relicSet) { matched = true; Object.assign(context, { subject: `relic set "${relicSet.name}" active-bonus aura`, description: (relicSet as any).description, pieces: (relicSet as any).pieceRelicIds ?? undefined, usedIn: "in-run gameplay, worn by the player ship" }); }

  if (entry.category === "biomes") {
    matched = true;
    const biome = biomesById.get(baseId);
    if (biome) Object.assign(context, { subject: `${biome.name} environment`, ...biomeContext(biome), usedIn: "in-run play-field background" });
  }
  if (entry.category === "biome-weather" || entry.category === "biome-hazards" || entry.category === "biome-poi") {
    matched = true;
    const displayName = entry.id.split(":")[1]!;
    const biome = BIOME_BY_DISPLAY_NAME[displayName];
    Object.assign(context, {
      subject: entry.name,
      kind: entry.category === "biome-weather" ? "weather effect" : entry.category === "biome-hazards" ? "environmental hazard (static art + trigger VFX)" : "discovery/landmark",
      ...(biome ? biomeContext(biome) : { biome: displayName }),
      usedIn: "in-run gameplay within this biome",
    });
  }
  if (entry.category === "biome-events") { matched = true; Object.assign(context, { subject: `shared biome event "${entry.name}"`, usedIn: "in-run events, all biomes" }); }

  if (entry.category === "galaxy") {
    matched = true;
    if (entry.id.startsWith("galaxy-cluster:")) {
      const cluster = GALAXY_CLUSTERS.find((c) => entry.id === `galaxy-cluster:${c.id}`) as any;
      Object.assign(context, { subject: `galaxy cluster "${entry.name}"`, theme: cluster?.theme, usedIn: "GalaxyCommand map background" });
    } else if (entry.id.startsWith("galaxy-region:")) {
      const region = [...SANDBOX_GALAXY.regions, ...GALAXY_CLUSTERS[1]!.galaxy.regions].find((r: any) => entry.id === `galaxy-region:${r.id}`) as any;
      Object.assign(context, { subject: `star-map region "${entry.name}"`, lore: region?.lore, usedIn: "GalaxyCommand star map" });
    } else {
      const system = ([...SANDBOX_GALAXY.systems, ...GALAXY_CLUSTERS[1]!.galaxy.systems] as any[]).find((s) => entry.id === `galaxy-system:${s.id}`);
      const biome = system ? biomesById.get(system.biomeId) : undefined;
      Object.assign(context, { subject: `star-system node "${entry.name}"`, region: system?.regionId, threatLevel: system?.threatLevel, biome: biome?.name, usedIn: "GalaxyCommand star map" });
    }
  }
  if (entry.category === "missions") {
    matched = true;
    const mission = missionsById.get(entry.id.replace("mission:", "")) as any;
    const biome = mission ? biomesById.get(mission.biomeId) : undefined;
    Object.assign(context, { subject: `mission briefing "${entry.name}"`, briefing: mission?.briefing, missionCategory: mission?.category, difficultyTier: mission?.difficulty, ...(biome ? biomeContext(biome) : {}), usedIn: "MissionSelect screen" });
  }
  if (entry.category === "mission-modifiers") { matched = true; Object.assign(context, { subject: `mission modifier "${entry.name}"`, assetPart: entry.id.startsWith("modifier-icon") ? "icon" : "in-run environmental overlay VFX", usedIn: "MissionSelect + in-run" }); }
  if (entry.category === "ui-screens") { matched = true; Object.assign(context, { subject: `"${entry.name}" screen`, purpose: SCREEN_PURPOSE[entry.name] ?? entry.name, usedIn: "full-screen UI" }); }
  if (entry.category === "particles") { matched = true; const def = (PARTICLE_BURSTS as any)[entry.name]; Object.assign(context, { subject: `particle burst "${entry.name}"`, colourHex: def?.colour, particleCount: def?.count, usedIn: "in-run game feel" }); }
  if (entry.category === "status-effects") { matched = true; Object.assign(context, { subject: `status effect "${entry.name}"`, treatment: STATUS_TREATMENT[entry.name], rule: "tint + one particle loop only — never a texture/material change (Visual Style Rule 6)", usedIn: "applied over any afflicted sprite" }); }
  if (entry.category === "loot-rarity") { matched = true; Object.assign(context, { subject: `rarity frame "${entry.name}"`, rarityHex: (RARITY_TABLE as any)[entry.name]?.colour, rule: "composited around item icons at runtime — never baked into icon art (DIRECTIVE §2)", usedIn: "all item icons, drop beams" }); }
  if (entry.category === "resources") { matched = true; Object.assign(context, { subject: `resource "${entry.name}"`, colourNote: entry.name.toLowerCase().includes("biomass") ? "amber-yellow, not green (colour law)" : undefined, usedIn: "inventory/crafting/HUD" }); }
  if (entry.category === "currencies") { matched = true; Object.assign(context, { subject: `currency "${entry.name}"`, usedIn: "shops, HUD, results" }); }
  if (entry.category === "titles") { matched = true; Object.assign(context, { subject: `cosmetic title card "${entry.name.replace("TITLE_", "").replace(/_/g, " ")}"`, usedIn: "profile/results screens" }); }
  if (entry.category === "frames") { matched = true; Object.assign(context, { subject: `portrait frame "${entry.name.replace("FRAME_", "").replace(/_/g, " ")}"`, usedIn: "composited around commander portraits" }); }
  if (entry.category === "reputation-titles") { matched = true; Object.assign(context, { subject: `reputation rank badge "${entry.name}"`, usedIn: "profile/story screens" }); }
  if (entry.category === "achievements") { matched = true; Object.assign(context, { subject: `achievement badge "${entry.name}"`, usedIn: "Statistics/achievements UI" }); }
  if (entry.category === "faction-reputation") { matched = true; Object.assign(context, { subject: `faction standing tier "${entry.name}"`, tierOrder: "hostile→distrusted→neutral→known→trusted→respected→honoured→legendaryAlly", usedIn: "faction reputation UI" }); }
  if (entry.category === "manufacturers") {
    matched = true;
    const m = [...WEAPON_MANUFACTURERS, ...SHIP_MANUFACTURERS].find((x: any) => x.name === entry.name) as any;
    Object.assign(context, { subject: `manufacturer emblem "${entry.name}"`, manufacturerVisualIdentity: m?.visualIdentity, signature: m?.signatureMechanic ?? m?.signatureSystem, usedIn: "item cards, hangar, codex" });
  }
  if (entry.category === "fire-patterns") { matched = true; Object.assign(context, { subject: `fire-pattern muzzle primitive "${entry.name}"`, geometry: FIRE_PATTERN_GEOMETRY[entry.name], usedIn: "composed with weapon muzzle VFX" }); }
  if (entry.category === "projectile-behaviours") { matched = true; Object.assign(context, { subject: `projectile trail primitive "${entry.name}"`, motion: PROJECTILE_BEHAVIOUR_MOTION[entry.name], usedIn: "composed with weapon projectile sprites" }); }
  if (entry.category === "xp-tiers") { matched = true; Object.assign(context, { subject: `XP gem, tier "${entry.name}"`, tierScale: "small→medium→large→elite→boss→ancient→research; size/intensity rises with tier", usedIn: "in-run pickups" }); }
  if (entry.category === "branding") { matched = true; Object.assign(context, { subject: entry.name, gameIdentity: "AFTERLIGHT — a dying galaxy re-lit one expedition at a time; hopeful, not grim", usedIn: "app identity" }); }
  if (entry.category === "hud-chrome") { matched = true; Object.assign(context, { subject: HUD_DESCRIPTIONS[entry.name] ?? entry.name, usedIn: "in-run HUD" }); }
  if (entry.category === "ui-components") { matched = true; const u = UI_DESCRIPTIONS[entry.name]; Object.assign(context, { subject: u?.description ?? entry.name, states: u?.states, usedIn: "all screens" }); }
  if (entry.category === "player-vfx") { matched = true; Object.assign(context, { subject: PLAYER_VFX_DESCRIPTIONS[entry.name] ?? entry.name, usedIn: "player ship, in-run" }); }
  if (entry.category === "combat-entities") {
    matched = true;
    const origin = COMBAT_ENTITY_ORIGIN[entry.name];
    Object.assign(context, { subject: origin?.description ?? entry.name, ...(origin?.factionKey ? { faction: ENEMY_GROUPS.find((g) => g.key === origin.factionKey)?.faction, factionVisual: factionVisual(origin.factionKey) } : {}), usedIn: origin?.usedIn ?? "in-run gameplay" });
  }
  if (entry.category === "environment") { matched = true; Object.assign(context, { subject: entry.name, usedIn: "in-run play-field, all biomes", rule: "must never compete with foreground silhouettes" }); }
  if (entry.category === "interactables") { matched = true; Object.assign(context, { subject: INTERACTABLE_DESCRIPTIONS[entry.name] ?? entry.name, rule: "must read as interactive at a glance", usedIn: "in-run gameplay" }); }
  if (entry.category === "environmental-conditions") { matched = true; Object.assign(context, { subject: `condition indicator "${entry.name}"`, usedIn: "HUD/briefing when the biome condition is active" }); }
  if (entry.category === "starmap-chrome") { matched = true; Object.assign(context, { subject: STARMAP_DESCRIPTIONS[entry.name] ?? entry.name, usedIn: "GalaxyCommand star map" }); }
  if (entry.category === "banners") { matched = true; Object.assign(context, { subject: "boss introduction title card (name + title reveal)", example: `THE HOLLOW SENTINEL — Last Watcher of the Drift`, usedIn: "boss introduction state" }); }
  if (entry.category === "elite-reward-vfx") {
    matched = true;
    const reward = ELITE_REWARD_POOL.find((r) => `${r.id}:vfx` === entry.id);
    Object.assign(context, { subject: `elite-reward grant "${reward?.name ?? entry.name}"`, description: reward?.description, frequency: "one per Elite kill — bold, brief, celebratory", usedIn: "in-run gameplay" });
  }
  if (entry.category === "wave-reward-vfx") {
    matched = true;
    const reward = SANDBOX_WAVE_REWARDS.find((r) => `${r.id}:vfx` === entry.id);
    Object.assign(context, { subject: `wave-reward grant "${reward?.name ?? entry.name}"`, description: reward?.description, rewardCategory: reward?.category, frequency: "every wave landing — small and ambient, must never interrupt play", usedIn: "in-run gameplay" });
  }
  if (entry.category === "faction-emblems") {
    matched = true;
    const faction = SANDBOX_FACTION_ROSTER.factions.find((f) => entry.id === `faction-emblem:${f.id}`) as any;
    Object.assign(context, { subject: `faction emblem "${entry.name}"`, factionVisual: faction ? factionVisual(faction.id) : undefined, government: faction?.identity?.government ?? undefined, usedIn: "reputation UI, mission briefings, codex" });
  }
  if (entry.category === "research-nodes") {
    matched = true;
    const node = ROSTER_RESEARCH_TREE.find((n) => entry.id === `research-node:${n.id}`) as any;
    Object.assign(context, { subject: `research node "${entry.name}"`, researchCategory: node?.category, tier: node?.tier, nodeType: node?.nodeType, usedIn: "research tree (GalaxyCommand)" });
  }
  if (entry.category === "elite-mutations") { matched = true; Object.assign(context, { subject: `mutation tell "${entry.name}"`, visualTell: MUTATION_TELL[entry.name], rule: "additive overlay composited onto ANY enemy sprite — never a separate mutated sprite (DIRECTIVE §2)", usedIn: "elite enemies, in-run" }); }
  if (entry.category === "elite-tiers") { matched = true; Object.assign(context, { subject: `elite tier ring "${entry.name}"`, tierOrder: "veteran→champion→ancient→prime→legendary→apex→mythic; intensity escalates", rule: "additive ring composited under the enemy — stackable with mutation tells", usedIn: "elite enemies, in-run" }); }
  if (entry.category === "equipment") { matched = true; Object.assign(context, { subject: `equipment item "${entry.name}"`, usedIn: "inventory/loadout" }); }
  if (entry.category === "ship-modules") { matched = true; Object.assign(context, { subject: `ship module "${entry.name}"`, usedIn: "Upgrade Ship / outfitting UI" }); }

  if (!matched) {
    unmatched += 1;
    console.error("NO REQUIREMENTS BUILDER MATCHED:", entry.id, entry.category);
  }

  // Strip undefined values for a clean file.
  const cleanContext = Object.fromEntries(Object.entries(context).filter(([, v]) => v !== undefined));
  assets.push({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    pipeline: entry.pipeline,
    ...(entry.keyColour ? { keyColour: entry.keyColour, paletteConstraint: entry.keyColour === "magenta" ? "no magenta anywhere in this sprite's palette (magenta-keyed)" : "no green anywhere in this sprite's palette (green-keyed; see directive.colourLaw for substitutions)" } : {}),
    assetType: shape.assetType,
    ...(shape.view ? { view: shape.view } : {}),
    suggestedSize: shape.suggestedSize,
    ...(shape.nineSlice ? { nineSlice: true } : {}),
    requirements: cleanContext,
  });
}

if (unmatched > 0) {
  console.error(`FAILED: ${unmatched} entries had no requirements builder`);
  process.exit(1);
}

// ── Directive header + write ───────────────────────────────────────────────
const VISUAL_STYLE_RULES = [
  "Shapes are rounded and chunky. No 1px lines, no sharp rectangles. Minimum corner radius on any UI panel or bar. Health bars, buttons, frames all have visible thickness.",
  "Colour is saturated and flat. No gradients longer than a subtle two-stop. No desaturated greys except the defined rarity/faction colours. Use the loot-tier hex values as the canonical accent palette.",
  "VFX are bold and brief. Particles are large, few, and rounded — fat circles, chunky stars, thick rings. Never fine dust, never realistic smoke, never lens flares. Additive glow is allowed but clipped tight to the source.",
  "Outlines over realism. Where an entity needs separation from the background, prefer a soft dark outline or drop-glow, never a realistic shadow.",
  "Text is chunky and friendly. Rounded, heavy-weight type for damage numbers and headers. No thin or condensed faces anywhere in gameplay.",
  "Status effects tint, they don't texture. Burn = warm orange tint + fat ember particles; freeze = pale blue tint + chunky frost ring. A tint plus one particle loop, never a material change.",
  "Nothing gritty. No scratches, film grain, chromatic aberration, vignettes, or screen dirt. The camera is clean.",
  "Readability beats fidelity. Any effect that obscures the player ship or enemy silhouettes for more than ~200ms gets scaled down. The silhouette is sacred.",
];

const runFile = {
  title: "AFTERLIGHT — Asset Run (requirements, no prompts — the consuming generator writes its own)",
  generatedBy: "scripts/generate-asset-run.ts (source of truth: src/game/assets/assetRegistry.ts — regenerate via `npm run assets:run`, never hand-edit)",
  directive: {
    artStyle: "Chibi-proportioned stylized 3D rendered with flat toon/cel-shading — Nintendo-inspired, hopeful not grim. The 8 Visual Style Rules below bind every asset.",
    visualStyleRules: VISUAL_STYLE_RULES,
    litmusTest: "Shrink any new visual element to 32px. If you can't tell what it is, redesign it.",
    delivery: {
      keyed: "Pre-keyed RGBA PNG, trimmed to content, 2px alpha pad, nose/face pointing up (north). Never assume a background colour.",
      additive: "RGB PNG on pure black — black IS the transparency, rendered additively. Never rely on an alpha channel.",
      fullbleed: "Opaque image, rendered as a background. No keying, no blending tricks.",
    },
    colourLaw:
      "Nothing green in any KEYED sprite's palette. Lore-green subjects substitute: regeneration → gold, poison/toxic → amber, biomass → amber-yellow. " +
      "Green is permitted freely in ADDITIVE and FULL-BLEED assets. Crystal Dominion sprites are magenta-keyed — magenta forbidden in their palettes instead (per-entry keyColour field).",
    rarityPalette: Object.fromEntries(Object.entries(RARITY_TABLE as any).map(([k, v]: [string, any]) => [k, v.colour])),
    factionPalettes: FACTION_COLOUR_SIGNATURES,
    derivationPolicy:
      "Derived assets are NOT in this file and must not be generated: ship roster thumbnails, enemy move/attack/death states, and the World-Ender/Vanguard boss variants are produced in code from their parent asset (Asset Pipeline Directive §2).",
  },
  counts: {
    assets: assets.length,
    derivedExcluded: derivedEntries().length,
    byPipeline: {
      keyed: assets.filter((a) => a.pipeline === "keyed").length,
      additive: assets.filter((a) => a.pipeline === "additive").length,
      fullbleed: assets.filter((a) => a.pipeline === "fullbleed").length,
    },
  },
  assets,
};

const runPath = path.resolve(import.meta.dirname, "../docs/asset-run.json");
fs.writeFileSync(runPath, JSON.stringify(runFile, null, 2) + "\n");
console.log(`Wrote ${runPath}`);
console.log(`ASSETS: ${assets.length} (source) · derived excluded: ${derivedEntries().length}`);
