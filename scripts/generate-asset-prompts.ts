/**
 * Companion to scripts/generate-asset-manifest.ts. Walks the SAME registry
 * (src/game/assets/assetRegistry.ts) and, for every SOURCE entry only
 * (DIRECTIVE §2 — derived entries are never separate source files, so they
 * get no art-generation prompt), builds a ready-to-use image prompt pulling
 * its subject description verbatim from the shipped data. Every prompt is
 * locked to the 2026-07-12 Visual Style Rules AND the 2026-07-12 Asset
 * Pipeline Directive's colour law (DIRECTIVE §4).
 *
 * Run via `npm run assets:prompts`. Writes docs/asset-prompts.csv.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { sourceEntries } from "../src/game/assets/assetRegistry";
import type { AssetPipelineKind } from "../src/game/assets/assetPipeline";
import { LAUNCH_FLEET, MANUFACTURERS as SHIP_MANUFACTURERS } from "../src/game/ships/shipRosterData";
import { LAUNCH_ARSENAL, WEAPON_MANUFACTURERS } from "../src/game/weapons/weaponRosterData";
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
import { ROSTER_RELICS, SANDBOX_RELIC_SETS } from "../src/game/relics/relicRosterData";
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
import { biomeVisualIdentityFor } from "../src/game/visual/visualDirectionData";
import { GALAXY_CLUSTERS } from "../src/game/galaxy/galaxyClusterData";
import { SANDBOX_GALAXY } from "../src/game/galaxy/galaxyData";
import { FRAMEWORK_MISSIONS } from "../src/game/missions/missionFrameworkData";

const STYLE_LOCK =
  "House style: chibi-proportioned stylized 3D, flat toon/cel-shading (max two-tone gradient, no PBR falloff), " +
  "rounded chunky forms with visible thickness, soft dark outline or additive drop-glow for edge separation " +
  "(never a realistic cast shadow), saturated flat colour, no gradients past a subtle two-stop, no fine detail, " +
  "no film grain/vignette/chromatic aberration/lens flare/dust/scratches. Silhouette must read clearly at 32px.";
const VFX_STYLE_LOCK =
  "House VFX style: large, few, rounded particles — fat circles, chunky stars, thick rings. Never fine dust, " +
  "realistic smoke, or lens flares. Additive glow clipped tight to the source. Flat saturated colour, no gradients " +
  "past a subtle two-stop, nothing gritty. Must read clearly at 32px, never obscure a silhouette for more than ~200ms.";
const UI_STYLE_LOCK =
  "House UI style: rounded, chunky shapes — no 1px lines, no sharp rectangles, minimum visible corner radius, " +
  "bars/panels/frames have visible thickness. Flat saturated colour capped at a two-stop gradient. Rounded, " +
  "heavy-weight friendly type. Outline or drop-glow for separation, never a realistic shadow.";
const BACKGROUND_STYLE_LOCK =
  "House background style: flat saturated colour, no gradients past a subtle two-stop, no film grain/vignette/" +
  "chromatic aberration/lens flare/dust/scratches. Bold simple shapes, no fine detail or naturalistic texture " +
  "noise. Must stay clearly readable behind foreground sprites — it never competes with the silhouette.";
/** UI screens are real UI chrome (panels/buttons); biomes/galaxy/missions are environment illustration, not UI. */
function pipelineLock(pipeline: AssetPipelineKind, category: string): string {
  if (pipeline === "additive") return VFX_STYLE_LOCK;
  if (pipeline === "fullbleed") return category === "ui-screens" ? UI_STYLE_LOCK : BACKGROUND_STYLE_LOCK;
  return STYLE_LOCK;
}
function an(word: string): string {
  return /^[aeiouAEIOU]/.test(word) ? `an ${word}` : `a ${word}`;
}

interface PromptRow {
  id: string;
  category: string;
  pipeline: AssetPipelineKind;
  name: string;
  prompt: string;
}
const rows: PromptRow[] = [];

// Index rosters by id for O(1) lookup while walking the registry.
const shipsById = new Map(LAUNCH_FLEET.map((s) => [s.id, s]));
const weaponsById = new Map(LAUNCH_ARSENAL.map((w) => [w.id, w]));
const commandersById = new Map(FULL_ROSTER_WITH_FOUNDER.map((c) => [c.id, c]));
const profilesById = new Map(FULL_PROFILES_WITH_FOUNDER.map((p) => [p.commanderId, p]));
const enemyGroups: Array<{ faction: string; roster: readonly any[] }> = [
  { faction: "Sandbox", roster: SANDBOX_ENEMIES },
  { faction: "Mercenary Guild / Outlaws", roster: OUTLAW_ENEMIES },
  { faction: "Machine Collective", roster: MACHINE_ENEMIES },
  { faction: "Crystal Dominion", roster: CRYSTAL_ENEMIES },
  { faction: "Void Swarm", roster: VOID_ENEMIES },
  { faction: "Ancient Custodians", roster: ANCIENT_ENEMIES },
  { faction: "Xenomorph Hive", roster: XENO_ENEMIES },
  { faction: "Stellar Nomads", roster: NOMAD_ENEMIES },
  { faction: "Paragon Protocol", roster: PARAGON_ENEMIES },
  { faction: "Celestial Conclave", roster: CELESTIAL_ENEMIES },
  { faction: "The Eclipsed", roster: ECLIPSED_ENEMIES },
];
const enemiesById = new Map<string, { enemy: any; faction: string }>();
for (const group of enemyGroups) for (const enemy of group.roster) enemiesById.set(enemy.id, { enemy, faction: group.faction });
const hollowSentinel = SANDBOX_BOSSES[0]!;
const bossArtifactsById = new Map(BOSS_ARTIFACTS.map((a) => [a.id, a]));
const passivesById = new Map(SANDBOX_PASSIVES.map((p) => [p.id, p]));
const artifactsById = new Map(SANDBOX_ARTIFACTS.map((a) => [a.id, a]));
const relicsById = new Map(ROSTER_RELICS.map((r) => [r.id, r]));
const relicSetsById = new Map(SANDBOX_RELIC_SETS.map((s) => [s.id, s]));
const namedBiomesById = new Map(
  [SANDBOX_BIOMES[0]!, ANCIENT_CORE_BIOME, CRYSTAL_EXPANSE_BIOME, DERELICT_EXPANSE_BIOME, HUMAN_FRONTIER_BIOME, FROZEN_REACH_BIOME, LIVING_ECOSPHERES_BIOME, MACHINE_EXPANSE_BIOME, SINGULARITY_ZONE_BIOME, SOLAR_WASTES_BIOME, VOID_EXPANSE_BIOME].map((b: any) => [b.id, b]),
);
const regionsById = new Map([...SANDBOX_GALAXY.regions, ...GALAXY_CLUSTERS[1]!.galaxy.regions].map((r: any) => [r.id, r]));
const systemsById = new Map(([...SANDBOX_GALAXY.systems, ...GALAXY_CLUSTERS[1]!.galaxy.systems] as any[]).map((s) => [s.id, s]));
const missionsById = new Map(FRAMEWORK_MISSIONS.map((m) => [m.id, m]));

function manufacturerBrief(name: string, list: readonly { id: string; name: string; visualIdentity: string }[]): string {
  const m = list.find((x) => x.name === name || x.id === name);
  return m ? `${m.name} house style: ${m.visualIdentity}` : name;
}

const MUTATION_TELL: Record<string, string> = {
  regeneration: "pulsing gold hull seams (colour-law substitution for its green lore colour, DIRECTIVE §4)",
  shielded: "a visible barrier shimmer",
  explosive: "cracked, glowing hull plating",
  teleport: "a brief spatial-distortion flash",
  reflectiveArmour: "a mirrored hull sheen",
  rapidAssault: "an overcharged weapon glow",
  gravityField: "a visible distortion ring",
  summoner: "a beacon pulse before each spawn",
  berserker: "a red damage-state flare",
  cryogenic: "a frost trail",
  incendiary: "trailing embers",
  corrupted: "a glitching void-purple outline",
  quantumShift: "a flickering double-image",
  temporalEcho: "a trailing translucent duplicate",
  adaptiveArmour: "colour-shifting hull plates",
  electric: "crackling arcs across the hull",
  cloaked: "a fading outline on a visible cycle",
  vampiric: "a red damage tether drawn from the target",
};
const STATUS_TREATMENT: Record<string, string> = {
  burn: "warm orange tint + fat ember particles",
  freeze: "pale blue tint + chunky frost ring",
  shock: "pale yellow tint + crackling arc particles",
  corruption: "void-purple tint + glitching outline particles",
  poison: "amber tint (colour-law substitution for its green lore colour, DIRECTIVE §4) + bubbling droplet particles",
  slow: "grey-blue tint + slow drifting ring",
  stasis: "pale cyan tint + frozen-in-place ring",
  shieldBreak: "white flash tint + shattering shard particles",
  armourBreak: "orange flash tint + cracking-plate particles",
  overload: "electric blue tint + crackling overload particles",
};

for (const entry of sourceEntries()) {
  const lock = pipelineLock(entry.pipeline, entry.category);
  const lastColon = entry.id.lastIndexOf(":");
  const baseId = entry.id.slice(0, lastColon === -1 ? entry.id.length : lastColon);
  const subtype = lastColon === -1 ? "" : entry.id.slice(lastColon + 1);
  let prompt: string | null = null;

  const ship = shipsById.get(baseId);
  if (ship) {
    const base = `${ship.name}, ${an(ship.shipClass)}-class starship built by ${manufacturerBrief(ship.manufacturer, SHIP_MANUFACTURERS as any)}. ${ship.lore}`;
    if (subtype === "portrait") prompt = `Hangar portrait, 3/4 hero angle on a plain dark backdrop. ${base}`;
    if (subtype === "sprite") prompt = `Top-down in-run sprite, straight overhead view, centered, nose pointing north. ${base}`;
  }

  const weapon = weaponsById.get(baseId);
  if (weapon) {
    const base = `${weapon.name}, ${an(weapon.category)} weapon by ${manufacturerBrief(weapon.manufacturer, WEAPON_MANUFACTURERS as any)}. ${weapon.lore}`;
    if (subtype === "icon") prompt = `Inventory/HUD icon on transparent background, centered, 3/4 angle. ${base}`;
    if (subtype === "projectile") prompt = `Projectile sprite for its "${weapon.projectileBehaviour}" behaviour and "${weapon.firePattern}" fire pattern. ${base}`;
    if (subtype === "muzzle") prompt = `Muzzle-flash VFX at the moment of firing, matching its "${weapon.firePattern}" spawn geometry. ${base}`;
    if (subtype === "impact") prompt = `Impact VFX where the projectile lands, brief and bold. ${base}`;
  }

  const commander = commandersById.get(baseId);
  if (commander) {
    const profile = profilesById.get(baseId);
    const visual = profile?.visualDesign ? ` Design brief: ${profile.visualDesign}` : "";
    const base = `${commander.name} "${commander.callsign}", ${an(commander.archetype)} commander of the ${commander.faction}. ${commander.biography}${visual}`;
    if (subtype === "portrait") prompt = `Character portrait, head-and-shoulders, plain backdrop. ${base}`;
    if (subtype === "sprite") prompt = `Full-body in-run sprite, standing pose, nose/face pointing north. ${base}`;
    if (subtype === "ultimate-vfx") prompt = `Ultimate-ability VFX for "${commander.ultimate.name}". ${base}`;
  }

  if (entry.category === "equipment") prompt = `Equipment icon on transparent background, centered. ${entry.name}.`;
  if (entry.category === "ship-modules") prompt = `Ship-module icon on transparent background, centered. ${entry.name}.`;

  const enemyHit = enemiesById.get(baseId);
  if (enemyHit && subtype === "idle") {
    const { enemy, faction } = enemyHit;
    prompt = `Idle animation state, top-down/side hybrid game-ready view, nose/face pointing north. ${enemy.name}, ${an(enemy.family)} of the ${faction} (roles: ${enemy.roles.join("/")}). ${enemy.lore}`;
  }

  if (entry.category === "elite-mutations") {
    const kind = entry.name;
    prompt = `Elite-mutation visual-tell overlay, additive, applicable to any enemy sprite: ${MUTATION_TELL[kind] ?? kind}.`;
  }
  if (entry.category === "elite-tiers") prompt = `Escalating elite-tier border/glow treatment for rank "${entry.name}", additive overlay to frame an enemy sprite.`;

  if (baseId === hollowSentinel.id && subtype === "model") {
    prompt = `Boss model, hero framing, nose/face pointing north. ${hollowSentinel.name}, "${hollowSentinel.title}" — ${hollowSentinel.lore}`;
  }
  if (entry.category === "boss" && subtype.startsWith("phase")) {
    const phase = hollowSentinel.phases.find((p) => p.phaseId === subtype);
    prompt = `Boss phase visual state "${subtype}" for ${hollowSentinel.name} — attack: ${phase?.attack.name ?? subtype}. Additive VFX layer.`;
  }
  if (entry.category === "boss" && baseId.includes("weakpoint")) {
    prompt = `Highlighted weak-point marker "${entry.name}" on ${hollowSentinel.name}'s model. Additive overlay.`;
  }
  if (entry.category === "boss" && subtype === "enrage") {
    prompt = `Final-stand enrage visual state for ${hollowSentinel.name} — cracked plating, intensified glow. Additive overlay.`;
  }

  const bossArtifact = bossArtifactsById.get(baseId);
  if (bossArtifact) {
    if (subtype === "icon") prompt = `Artifact icon on transparent background, centered. ${bossArtifact.name} — ${bossArtifact.description}.`;
    if (subtype === "vfx") prompt = `Activation VFX for ${bossArtifact.name} — ${bossArtifact.description}.`;
  }
  const passive = passivesById.get(baseId);
  if (passive) prompt = `Passive-ability icon on transparent background, centered. ${passive.name} — ${passive.description}.`;
  const artifact = artifactsById.get(baseId);
  if (artifact) {
    if (subtype === "icon") prompt = `Artifact icon on transparent background, centered. ${artifact.name} — ${artifact.description}.`;
    if (subtype === "vfx") prompt = `Effect VFX for ${artifact.name} — ${artifact.description}.`;
  }
  const relic = relicsById.get(baseId);
  if (relic) prompt = `Relic icon on transparent background, centered, otherworldly. ${relic.name} — ${relic.description}.`;
  const relicSet = relicSetsById.get(baseId);
  if (relicSet) prompt = `Set-bonus visual tell (aura/particle), additive, worn by the player when the "${relicSet.name}" relic set is active — ${relicSet.description}.`;

  if (entry.category === "biomes") {
    const [, biomeId] = entry.id.split(":");
    const biome = namedBiomesById.get(baseId.replace("biome-", ""));
    const b = biome ?? namedBiomesById.get(baseId);
    if (b) {
      const vis = biomeVisualIdentityFor(b.id);
      const authored = !vis.lighting.includes("(generated)");
      const visLine = authored
        ? `Visual identity: lighting ${vis.lighting}; fog ${vis.fog}; skybox ${vis.skybox}; palette ${vis.planetaryColours}; architecture ${vis.architecture}; vegetation ${vis.vegetation}.`
        : `NOTE: no visual identity authored yet for this biome — only lore exists; art direction must be decided before this prompt can be trusted as final.`;
      prompt = `Full-bleed background/environment art for the "${b.name}" biome. ${b.lore} ${visLine}`;
    }
  }
  if (entry.category === "biome-weather") prompt = `Weather VFX (additive) "${entry.name}".`;
  if (entry.category === "biome-hazards") prompt = `Environmental hazard art (additive trigger VFX) "${entry.name}".`;
  if (entry.category === "biome-poi") prompt = `Discovery/landmark icon or set-piece art (keyed) for "${entry.name}".`;
  if (entry.category === "biome-events") prompt = `Event-trigger VFX/banner (additive) for the shared biome event "${entry.name}".`;

  if (entry.category === "galaxy") {
    const cluster = GALAXY_CLUSTERS.find((c) => c.id === baseId.replace("galaxy-cluster:", "").replace("galaxy-cluster-", ""));
    const region = regionsById.get(entry.id.replace("galaxy-region:", ""));
    const system = systemsById.get(entry.id.replace("galaxy-system:", ""));
    if (entry.id.startsWith("galaxy-cluster:")) prompt = `Full-bleed galaxy-map background for the "${entry.name}" cluster.`;
    if (region) prompt = `Full-bleed star-map region nebula/label art for "${region.name}". ${region.lore}`;
    if (system) prompt = `Star-map node icon (keyed) for the system "${system.name}".`;
  }
  if (entry.category === "missions") {
    const mission = missionsById.get(entry.id.replace("mission:", ""));
    if (mission) prompt = `Full-bleed mission-briefing illustration for "${mission.name}" — ${mission.briefing}`;
  }
  if (entry.category === "mission-modifiers") {
    if (subtype === "icon" || entry.id.startsWith("modifier-icon")) prompt = `Mission-modifier icon (keyed) for "${entry.name}".`;
    else prompt = `Environmental overlay VFX (additive) signalling the active mission modifier "${entry.name}".`;
  }
  if (entry.category === "ui-screens") prompt = `Full-bleed screen layout/background treatment for the "${entry.name}" screen.`;
  if (entry.category === "particles") prompt = `Particle burst (additive) "${entry.name}".`;
  if (entry.category === "status-effects") prompt = `Status-effect treatment (additive tint + one particle loop, never a texture/material change) for "${entry.name}" — ${STATUS_TREATMENT[entry.name] ?? ""}`;
  if (entry.category === "loot-rarity") prompt = `Loot-rarity border/glow/icon-frame treatment (additive) for "${entry.name}" tier.`;
  if (entry.category === "resources") prompt = `Resource icon (keyed) on transparent background, centered, for "${entry.name}"${entry.name.toLowerCase().includes("biomass") ? " — amber-yellow palette (colour-law substitution for its green lore colour, DIRECTIVE §4)" : ""}.`;
  if (entry.category === "currencies") prompt = `Currency icon (keyed) on transparent background, centered, for "${entry.name}".`;
  if (entry.category === "titles") prompt = `Title-card/banner treatment for the cosmetic title "${entry.name.replace("TITLE_", "").replace(/_/g, " ")}".`;
  if (entry.category === "frames") prompt = `Portrait-frame border art (additive) for "${entry.name.replace("FRAME_", "").replace(/_/g, " ")}".`;
  if (entry.category === "reputation-titles") prompt = `Player rank badge (keyed) for the reputation title "${entry.name}".`;
  if (entry.category === "achievements") prompt = `Achievement badge icon (keyed) for "${entry.name}".`;
  if (entry.category === "faction-reputation") prompt = `Faction-standing icon/bar-segment (keyed) for reputation tier "${entry.name}".`;
  if (entry.category === "manufacturers") {
    const m = [...WEAPON_MANUFACTURERS, ...SHIP_MANUFACTURERS].find((x: any) => x.name === entry.name);
    prompt = `Manufacturer emblem/logo (keyed) for "${entry.name}"${m ? ` — ${(m as any).visualIdentity}` : ""}.`;
  }
  if (entry.category === "fire-patterns") prompt = `Muzzle/spawn-geometry VFX primitive (additive) for fire pattern "${entry.name}".`;
  if (entry.category === "projectile-behaviours") prompt = `Projectile visual/trail primitive (additive) for behaviour "${entry.name}".`;
  if (entry.category === "xp-tiers") prompt = `XP pickup gem/orb sprite (keyed) for tier "${entry.name}".`;

  if (!prompt) {
    console.error("NO PROMPT TEMPLATE MATCHED:", entry.id, entry.category);
    continue;
  }
  rows.push({ id: entry.id, category: entry.category, pipeline: entry.pipeline, name: entry.name, prompt: `${prompt} ${lock}` });
}

function csvEscape(field: string): string {
  return `"${String(field).replace(/"/g, '""')}"`;
}
const header = ["asset_id", "category", "pipeline", "name", "prompt"].map(csvEscape).join(",");
const lines = rows.map((r) => [r.id, r.category, r.pipeline, r.name, r.prompt].map(csvEscape).join(","));
const outPath = path.resolve(import.meta.dirname, "../docs/asset-prompts.csv");
fs.writeFileSync(outPath, [header, ...lines].join("\n") + "\n");
console.log(`Wrote ${outPath}`);
console.log(`TOTAL PROMPT ROWS (source-only): ${rows.length} / ${sourceEntries().length} source entries`);
