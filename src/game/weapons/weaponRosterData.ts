/**
 * Weapon Roster (AF-076). The AF-074 fleet move applied to the arsenal:
 * AF-032's WeaponDef and AF-075's WeaponProfileDef are UNCHANGED — the
 * roster is data. Fourteen fully identified manufacturers (the spec's ten
 * plus the four already shipped), eight tiers where TIER AFFECTS
 * ACQUISITION AND NEVER VIABILITY (entries carry no stat field), and the
 * module's new concept: WEAPON FAMILIES — sub-identities within AF-075's
 * framework categories, authored for the spec's four example categories
 * (four families each) plus every category the arsenal actually uses.
 * Prototype weapons make AF-075's dormant heat register meaningful as a
 * DATA DISCIPLINE: the prototype runs hottest, asserted. Legendary means
 * seven unique traits, not bigger numbers. syntheticWeaponFor(n) proves
 * 100+ expansion through AF-032/075's unchanged laws.
 */
import type { WeaponDef } from "./weaponData";
import {
  FRAMEWORK_WEAPONS,
  WEAPON_PROFILES,
  type WeaponFrameworkCategory,
  type WeaponProfileDef,
} from "./weaponFrameworkData";

/** Weapon manufacturers (AF-076 §Weapon Manufacturers) — the spec's ten plus the four already shipped. */
export const WEAPON_MANUFACTURER_IDS = [
  "atlas-dynamics",
  "helios-industries",
  "nova-forge",
  "vanguard-systems",
  "aegis-armaments",
  "quantum-horizon",
  "black-horizon",
  "frontier-salvage",
  "ancient-foundry",
  "paragon-laboratories",
  "halcyon-driveworks",
  "ironmoor-foundry",
  "void-legion-remnant",
  "meridian-yards",
] as const;
export type WeaponManufacturerId = (typeof WEAPON_MANUFACTURER_IDS)[number];

/** The six identity parts every weapon manufacturer must carry (AF-076 §Weapon Manufacturers). */
export interface WeaponManufacturerDef {
  id: WeaponManufacturerId;
  name: string;
  visualIdentity: string;
  engineeringStyle: string;
  technologyFocus: string;
  lore: string;
  audioProfile: string;
  signatureMechanic: string;
}

export const WEAPON_MANUFACTURERS: readonly WeaponManufacturerDef[] = [
  { id: "atlas-dynamics", name: "Atlas Dynamics", visualIdentity: "Slab breeches, visible bolts, ammunition counted in crates.", engineeringStyle: "Overbuilt and repairable in the field.", technologyFocus: "Ordnance density.", lore: "The shipyard's armaments division — same bolts, more of them.", audioProfile: "Deep percussive thumps with mechanical follow-through.", signatureMechanic: "Cluster payloads that always fit one more warhead." },
  { id: "helios-industries", name: "Helios Industries", visualIdentity: "Sun-gold emitter housings over white ceramic.", engineeringStyle: "Light as structure — optics before armour.", technologyFocus: "Coherent light and prism splitting.", lore: "The racing yard's optics lab, retooled from trophies to beams.", audioProfile: "Rising harmonic whines that resolve on the hit.", signatureMechanic: "Prism arrays — one beam in, several arguments out." },
  { id: "nova-forge", name: "Nova Forge", visualIdentity: "Hive-textured launchers with drone-assembled magazines.", engineeringStyle: "Self-replicating munitions lines.", technologyFocus: "Autonomous ordnance.", lore: "The mining collective's tooling arm — the tools still defend themselves.", audioProfile: "Chittering launch cycles under a bass ignition.", signatureMechanic: "Ordnance that finishes assembling itself mid-flight." },
  { id: "vanguard-systems", name: "Vanguard Systems", visualIdentity: "Blade-lined rails, gunmetal blue, one killing light.", engineeringStyle: "Every gram serves the shot.", technologyFocus: "Fire control and precision rails.", lore: "Fleetworks' duelling-range subsidiary — the paperwork is also precise.", audioProfile: "A held breath, then a single clean crack.", signatureMechanic: "Executioner timing — criticals that were always going to happen." },
  { id: "aegis-armaments", name: "Aegis Armaments", visualIdentity: "Rounded white housings with green field-lines.", engineeringStyle: "Weapons that protect while they fire.", technologyFocus: "Defensive integration.", lore: "The convoy guard's arsenal — never lost an escorted hull, armed accordingly.", audioProfile: "Soft charge hums with chime confirmations.", signatureMechanic: "Fire patterns that reinforce shields between volleys." },
  { id: "quantum-horizon", name: "Quantum Horizon", visualIdentity: "Iridescent seams that render a frame late.", engineeringStyle: "Deadline-driven impossibility.", technologyFocus: "Exotic projection.", lore: "Zone researchers who came back employable — their weapons almost did.", audioProfile: "Sounds that arrive slightly before the trigger.", signatureMechanic: "Probability-weighted shots — the likely target is the hit target." },
  { id: "black-horizon", name: "Black Horizon", visualIdentity: "Matte void panels; hard to photograph, harder to trace.", engineeringStyle: "Deniable and precise.", technologyFocus: "Interdiction and denial.", lore: "Nobody incorporates Black Horizon. It is simply, occasionally, invoiced.", audioProfile: "Near-silence with a pressure drop on impact.", signatureMechanic: "Field denial — spaces that stop being safe to stand in." },
  { id: "frontier-salvage", name: "Frontier Salvage", visualIdentity: "Mismatched panels, honest rust, stencilled serials from three fleets.", engineeringStyle: "It fires, it ships.", technologyFocus: "Reclamation engineering.", lore: "The graveyard's quartermasters — every barrel has a previous owner.", audioProfile: "Rattling reports with a proud aftershake.", signatureMechanic: "Scatter patterns tuned by whatever parts arrived that week." },
  { id: "ancient-foundry", name: "Ancient Foundry", visualIdentity: "White stone alloy and gold conduit, excavated not machined.", engineeringStyle: "Reprinted precursor tolerances.", technologyFocus: "Vigil-grade energy projection.", lore: "The dig site's armoury — the precursors finished these designs first.", audioProfile: "A choir-like charge that predates its operators.", signatureMechanic: "Lances that recognise what they were built to guard against." },
  { id: "paragon-laboratories", name: "Paragon Laboratories", visualIdentity: "Exposed telemetry, warning stencils, one fresh weld always cooling.", engineeringStyle: "Ship it before it is safe.", technologyFocus: "Experimental fire control.", lore: "The Protocol's weapons programme, resumed by volunteers with insurance.", audioProfile: "Unstable charge whines the manual says are normal.", signatureMechanic: "Overdriven fire modes that trade heat for possibility." },
  { id: "halcyon-driveworks", name: "Halcyon Driveworks", visualIdentity: "Expedition white with exposed coil windings.", engineeringStyle: "Survey tools that learned to argue.", technologyFocus: "Field-maintainable coilguns.", lore: "The drive yard's sidearm line — built for expeditions that were never meant to end in combat.", audioProfile: "Capacitor sighs with a railsnap finish.", signatureMechanic: "Charge that carries through pierced targets." },
  { id: "ironmoor-foundry", name: "Ironmoor Foundry", visualIdentity: "Foundry grey, proud welds, recoil handled by mass.", engineeringStyle: "Mass is honesty, in armaments too.", technologyFocus: "Slab-breech scatterguns.", lore: "The hull foundry's counterweight division.", audioProfile: "One flat authoritative report.", signatureMechanic: "Novas that reward standing exactly where you should not." },
  { id: "void-legion-remnant", name: "Void Legion Remnant", visualIdentity: "Seams of not-quite-black that drip upward.", engineeringStyle: "Recovered, not designed.", technologyFocus: "Corruption delivery.", lore: "Not a manufacturer — a salvage designation for what the Legion left loaded.", audioProfile: "A sound best described as an absence arriving.", signatureMechanic: "Corruption that remembers its targets." },
  { id: "meridian-yards", name: "Meridian Yards", visualIdentity: "Survey-white lattices grown around instrument cores.", engineeringStyle: "Measurement first, munition second.", technologyFocus: "Crystal lattice emitters.", lore: "The survey yard's field kit — the lattice fires the winter it remembers.", audioProfile: "Glass-chime volleys that frost at the edges.", signatureMechanic: "Split shards that inherit their parent's cold." },
];

/** Weapon tiers (AF-076 §Weapon Tiers) — acquisition, never long-term viability. */
export const WEAPON_TIERS = ["common", "uncommon", "rare", "epic", "legendary", "ancient", "prototype", "mythic"] as const;
export type WeaponTier = (typeof WEAPON_TIERS)[number];

/** A weapon family — a sub-identity within an AF-075 framework category (AF-076 §Weapon Families). */
export interface WeaponFamilyDef {
  id: string;
  category: WeaponFrameworkCategory;
  name: string;
  gameplayNote: string;
}

export const WEAPON_FAMILIES: readonly WeaponFamilyDef[] = [
  // The spec's four example categories, four families each.
  { id: "railguns:precision", category: "railguns", name: "Precision Rails", gameplayNote: "One shot, one answer — positioning is the trigger." },
  { id: "railguns:heavy", category: "railguns", name: "Heavy Rails", gameplayNote: "Slow spool, hull-cracking payoff." },
  { id: "railguns:orbital", category: "railguns", name: "Orbital Rails", gameplayNote: "Fire support called down rather than aimed." },
  { id: "railguns:experimental", category: "railguns", name: "Experimental Rails", gameplayNote: "The rail is also the projectile. Sometimes." },
  { id: "laserArrays:continuous", category: "laserArrays", name: "Continuous Arrays", gameplayNote: "Damage as a held commitment." },
  { id: "laserArrays:pulsed", category: "laserArrays", name: "Pulsed Arrays", gameplayNote: "Rhythm windows between pulses." },
  { id: "laserArrays:prism", category: "laserArrays", name: "Prism Arrays", gameplayNote: "One beam in, several arguments out." },
  { id: "laserArrays:resonance", category: "laserArrays", name: "Resonance Arrays", gameplayNote: "Shields answer to the frequency." },
  { id: "missileLaunchers:swarm", category: "missileLaunchers", name: "Swarm Missiles", gameplayNote: "Quantity with an opinion." },
  { id: "missileLaunchers:heavy", category: "missileLaunchers", name: "Heavy Missiles", gameplayNote: "One reload, one silhouette change." },
  { id: "missileLaunchers:smart", category: "missileLaunchers", name: "Smart Missiles", gameplayNote: "Target priority is the build decision." },
  { id: "missileLaunchers:cluster", category: "missileLaunchers", name: "Cluster Missiles", gameplayNote: "Always one more warhead." },
  { id: "gravityWeapons:compression", category: "gravityWeapons", name: "Compression", gameplayNote: "Crowds become points." },
  { id: "gravityWeapons:singularity", category: "gravityWeapons", name: "Singularity", gameplayNote: "The battlefield bends first, breaks second." },
  { id: "gravityWeapons:orbital", category: "gravityWeapons", name: "Orbital Gravity", gameplayNote: "Wells that patrol." },
  { id: "gravityWeapons:quantum", category: "gravityWeapons", name: "Quantum Gravity", gameplayNote: "Mass as a probability." },
  // Families for every category the arsenal actually uses.
  { id: "arcWeapons:chain", category: "arcWeapons", name: "Chain Arcs", gameplayNote: "The crowd is the conductor." },
  { id: "shotguns:breach", category: "shotguns", name: "Breach Scatter", gameplayNote: "Range is a choice you make with your hull." },
  { id: "voidWeapons:unmaking", category: "voidWeapons", name: "Unmaking", gameplayNote: "Corruption deepens; it never resets." },
  { id: "cryoWeapons:lattice", category: "cryoWeapons", name: "Lattice Cryo", gameplayNote: "Every fragment remembers winter." },
] as const;

/** Collection kinds (AF-076 §Weapon Collection) — seven registered; permanent by the AF-026 pattern. */
export const WEAPON_COLLECTION_KINDS = [
  "blueprints",
  "manufacturers",
  "weaponFamilies",
  "legendaryWeapons",
  "prototypeDesigns",
  "ancientTechnology",
  "experimentalVariants",
] as const;
export type WeaponCollectionKind = (typeof WEAPON_COLLECTION_KINDS)[number];

/** Research kinds (AF-076 §Weapon Research) — six registered. */
export const WEAPON_ROSTER_RESEARCH_KINDS = ["alternativeFireModes", "experimentalAmmunition", "efficiency", "handling", "specialisation", "manufacturerTechnologies"] as const;

/** Legendary traits (AF-076 §Legendary Weapons) — seven; never universally stronger. */
export const LEGENDARY_WEAPON_TRAITS = ["uniqueIdentity", "uniqueLore", "uniqueMechanics", "uniqueProgression", "uniqueCosmetics", "uniqueDiscovery", "uniqueMastery"] as const;

/** Prototype mechanics (AF-076 §Prototype Weapons) — seven; mastery, not power. */
export const PROTOTYPE_WEAPON_MECHANICS = ["experimentalFireModes", "riskVsReward", "heatManagement", "energyInstability", "uniqueControls", "advancedMechanics", "highSkillCeiling"] as const;

/** Statistics (AF-076 §Weapon Statistics) — eight registered; AF-026 vocabulary. */
export const WEAPON_ROSTER_STATS = ["usage", "accuracy", "criticalHits", "damage", "favouriteBuilds", "bossPerformance", "mastery", "historicalRecords"] as const;

/** Balance axes (AF-076 §Balance Principles) — numerical superiority deliberately absent. */
export const WEAPON_ROSTER_BALANCE_AXES = ["combatRole", "mechanicalComplexity", "positioning", "skillExpression", "buildSynergy"] as const;

/** A roster entry — identity and acquisition only. NO stat field: tiers cannot buff. */
export interface WeaponRosterEntry {
  weaponId: string;
  manufacturerId: WeaponManufacturerId;
  tier: WeaponTier;
  familyId: string;
  collectionKind: WeaponCollectionKind;
  discoveryMethod: string;
}

/** Five new weapons through AF-032's UNCHANGED WeaponDef shape. */
export const ROSTER_WEAPON_DEFS: readonly WeaponDef[] = [
  {
    id: "atlas-cluster-battery", name: "Atlas Cluster Battery", category: "missile", manufacturer: "Atlas Dynamics",
    tier: 1, rarity: "common", lore: "One more warhead always fits. Atlas checked.",
    damageSchool: "physical", damageSourceKind: "area", baseDamage: 5, critChance: 0.05, critMultiplier: 1.5,
    fireIntervalMs: 1200, firePattern: "spread", projectilesPerShot: 4, projectileBehaviour: "explosive",
    range: 16, projectileSpeed: 12, pierceCount: 0, explosionRadius: 1.2, statusOnHit: null, energyCost: 0, evolution: null,
  },
  {
    id: "helios-prism-array", name: "Helios Prism Array", category: "laser", manufacturer: "Helios Industries",
    tier: 3, rarity: "epic", lore: "One beam in, several arguments out — the prism does not negotiate.",
    damageSchool: "energy", damageSourceKind: "direct", baseDamage: 6, critChance: 0.1, critMultiplier: 1.9,
    fireIntervalMs: 800, firePattern: "spread", projectilesPerShot: 3, projectileBehaviour: "piercing",
    range: 18, projectileSpeed: 22, pierceCount: 2, explosionRadius: 0, statusOnHit: { kind: "burn", chance: 0.15, strength: 4, durationMs: 1500 }, energyCost: 5, evolution: null,
  },
  {
    id: "paragon-flux-driver", name: "Paragon Flux Driver", category: "singularity", manufacturer: "Paragon Laboratories",
    tier: 4, rarity: "legendary", lore: "The manual's final page is an apology. The fire mode works anyway.",
    damageSchool: "energy", damageSourceKind: "area", baseDamage: 9, critChance: 0.08, critMultiplier: 2.0,
    fireIntervalMs: 1600, firePattern: "chargedShot", projectilesPerShot: 1, projectileBehaviour: "gravityAffected",
    range: 15, projectileSpeed: 10, pierceCount: 0, explosionRadius: 1.6, statusOnHit: { kind: "overload", chance: 0.25, strength: 3, durationMs: 1600 }, energyCost: 20, evolution: null,
  },
  {
    id: "foundry-sunlance", name: "Foundry Sunlance", category: "ancient", manufacturer: "Ancient Foundry",
    tier: 4, rarity: "legendary", lore: "It recognises what it was built to guard against. It has been waiting to say so.",
    damageSchool: "energy", damageSourceKind: "beam", baseDamage: 8, critChance: 0.12, critMultiplier: 1.8,
    fireIntervalMs: 1000, firePattern: "beam", projectilesPerShot: 1, projectileBehaviour: "persistentBeam",
    range: 20, projectileSpeed: 30, pierceCount: 1, explosionRadius: 0, statusOnHit: { kind: "shieldBreak", chance: 0.2, strength: 4, durationMs: 1800 }, energyCost: 12, evolution: null,
  },
  {
    id: "salvage-scattergun", name: "Salvage Scattergun", category: "flak", manufacturer: "Frontier Salvage",
    tier: 1, rarity: "common", lore: "Every barrel has a previous owner. All of them agreed to this.",
    damageSchool: "physical", damageSourceKind: "direct", baseDamage: 4, critChance: 0.06, critMultiplier: 1.6,
    fireIntervalMs: 700, firePattern: "arc", projectilesPerShot: 5, projectileBehaviour: "straight",
    range: 9, projectileSpeed: 14, pierceCount: 0, explosionRadius: 0, statusOnHit: null, energyCost: 0, evolution: null,
  },
];

/** New profiles through AF-075's UNCHANGED WeaponProfileDef shape — element/status law respected;
 * the PROTOTYPE-mechanics weapon runs the hottest heat in the arsenal (the dormant register as discipline). */
const ROSTER_WEAPON_PROFILE_DEFS: readonly WeaponProfileDef[] = [
  {
    weaponId: "atlas-cluster-battery", frameworkCategory: "missileLaunchers",
    visualIdentity: "Crate-fed launcher block with visible bolt heads and a hand-stencilled count.",
    element: "kinetic", heatGenerationPerShot: 7,
    passiveTrait: { trigger: "onKill", bonus: { kind: "damage", value: 0.02 } },
    uniqueMechanic: { tag: "atlas-doctrine", description: "Cluster spread tightens as the magazine empties." },
    evolutionSource: "blueprints", masteryTrackId: "weapon:atlas-cluster-battery",
    statisticKeys: ["weapon:atlas-cluster-battery:kills"], cosmetics: [{ kind: "audioPacks", id: "atlas-crate-thump" }],
    futureExpansionHooks: ["family-missileLaunchers-swarm-variant"],
  },
  {
    weaponId: "helios-prism-array", frameworkCategory: "laserArrays",
    visualIdentity: "Sun-gold emitter crown over white ceramic; the prism visibly disagrees with itself.",
    element: "thermal", heatGenerationPerShot: 5,
    passiveTrait: { trigger: "onCriticalHit", bonus: { kind: "statusChance", value: 0.04 } },
    uniqueMechanic: { tag: "helios-doctrine", description: "Pierced targets refract the beam onward at reduced anger." },
    evolutionSource: "research", masteryTrackId: "weapon:helios-prism-array",
    statisticKeys: ["weapon:helios-prism-array:kills"], cosmetics: [{ kind: "projectileColours", id: "helios-dawn-split" }],
    futureExpansionHooks: ["family-laserArrays-resonance-variant"],
  },
  {
    weaponId: "paragon-flux-driver", frameworkCategory: "gravityWeapons",
    visualIdentity: "Exposed telemetry around a containment sphere; the warning stencils are load-bearing.",
    element: "quantum", heatGenerationPerShot: 14,
    passiveTrait: { trigger: "onDamageTaken", bonus: { kind: "cooldownReduction", value: 0.03 } },
    uniqueMechanic: { tag: "flux-doctrine", description: "Overcharge holds trade heat for radius — the manual apologises." },
    evolutionSource: "prototypeTechnology", masteryTrackId: "weapon:paragon-flux-driver",
    statisticKeys: ["weapon:paragon-flux-driver:kills"], cosmetics: [{ kind: "impactEffects", id: "flux-collapse-ring" }],
    futureExpansionHooks: ["family-gravityWeapons-quantum-variant"],
  },
  {
    weaponId: "foundry-sunlance", frameworkCategory: "beamWeapons",
    visualIdentity: "White stone alloy channel with gold conduit — lit from within, aimed like a verdict.",
    element: "resonance", heatGenerationPerShot: 6,
    passiveTrait: { trigger: "onShieldBreak", bonus: { kind: "damage", value: 0.04 } },
    uniqueMechanic: { tag: "sunlance-doctrine", description: "Broken shields feed the lance — the vigil compounds." },
    evolutionSource: "ancientTechnology", masteryTrackId: "weapon:foundry-sunlance",
    statisticKeys: ["weapon:foundry-sunlance:kills"], cosmetics: [{ kind: "killEffects", id: "sunlance-first-light" }],
    futureExpansionHooks: ["family-beamWeapons-vigil-variant"],
  },
  {
    weaponId: "salvage-scattergun", frameworkCategory: "shotguns",
    visualIdentity: "Five barrels from three fleets, honest rust, serials filed by someone sentimental.",
    element: "kinetic", heatGenerationPerShot: 3,
    passiveTrait: { trigger: "onKill", bonus: { kind: "resourceGain", value: 0.03 } },
    uniqueMechanic: { tag: "salvage-doctrine", description: "Kills at breach range shake loose extra salvage." },
    evolutionSource: "blueprints", masteryTrackId: "weapon:salvage-scattergun",
    statisticKeys: ["weapon:salvage-scattergun:kills"], cosmetics: [{ kind: "weaponSkins", id: "salvage-three-fleets" }],
    futureExpansionHooks: ["family-shotguns-breach-variant"],
  },
];

/** Beam family for the Sunlance's category — registered alongside the in-use families above. */
export const BEAM_VIGIL_FAMILY: WeaponFamilyDef = { id: "beamWeapons:vigil", category: "beamWeapons", name: "Vigil Beams", gameplayNote: "Lances that recognise their targets." };
/** GP-004: families for the Summon/Biological categories' first real weapons (Swarm Tender, Spore Lance). */
export const SUMMON_TENDING_FAMILY: WeaponFamilyDef = { id: "summonWeapons:tending", category: "summonWeapons", name: "Tending Swarm", gameplayNote: "The ring grows; it never restarts." };
export const BIOLOGICAL_BLOOM_FAMILY: WeaponFamilyDef = { id: "biologicalWeapons:bloom", category: "biologicalWeapons", name: "Bloom Toxins", gameplayNote: "The poison outlives the shot." };
export const ALL_WEAPON_FAMILIES: readonly WeaponFamilyDef[] = [
  ...WEAPON_FAMILIES,
  BEAM_VIGIL_FAMILY,
  SUMMON_TENDING_FAMILY,
  BIOLOGICAL_BLOOM_FAMILY,
];

/** The launch arsenal — ten weapons on unchanged shapes; mythic honestly awaits its first weapon. */
export const LAUNCH_ARSENAL: readonly WeaponDef[] = [...FRAMEWORK_WEAPONS, ...ROSTER_WEAPON_DEFS];
export const ARSENAL_PROFILES: readonly WeaponProfileDef[] = [...WEAPON_PROFILES, ...ROSTER_WEAPON_PROFILE_DEFS];

export const ARSENAL_ENTRIES: readonly WeaponRosterEntry[] = [
  { weaponId: "coil-ripper", manufacturerId: "halcyon-driveworks", tier: "uncommon", familyId: "railguns:precision", collectionKind: "blueprints", discoveryMethod: "The starting sidearm — every survey carries one." },
  { weaponId: "coil-ripper-mk2", manufacturerId: "halcyon-driveworks", tier: "rare", familyId: "arcWeapons:chain", collectionKind: "blueprints", discoveryMethod: "Evolved from the Coil Ripper through research." },
  { weaponId: "novasplitter", manufacturerId: "ironmoor-foundry", tier: "epic", familyId: "shotguns:breach", collectionKind: "blueprints", discoveryMethod: "Blueprint purchase from Ironmoor's counterweight division." },
  { weaponId: "voidlance", manufacturerId: "void-legion-remnant", tier: "ancient", familyId: "voidWeapons:unmaking", collectionKind: "ancientTechnology", discoveryMethod: "Recovered loaded from a Legion wreck at Gravewake." },
  { weaponId: "hailborn-array", manufacturerId: "meridian-yards", tier: "rare", familyId: "cryoWeapons:lattice", collectionKind: "blueprints", discoveryMethod: "Grown from survey lattice schematics after Winterline." },
  { weaponId: "atlas-cluster-battery", manufacturerId: "atlas-dynamics", tier: "common", familyId: "missileLaunchers:cluster", collectionKind: "blueprints", discoveryMethod: "Open catalogue — Atlas sells to anyone with crates." },
  { weaponId: "helios-prism-array", manufacturerId: "helios-industries", tier: "epic", familyId: "laserArrays:prism", collectionKind: "experimentalVariants", discoveryMethod: "Awarded for a flawless expedition under solar weather." },
  { weaponId: "paragon-flux-driver", manufacturerId: "paragon-laboratories", tier: "prototype", familyId: "gravityWeapons:singularity", collectionKind: "prototypeDesigns", discoveryMethod: "Volunteered for — the Laboratories do not assign the Flux Driver." },
  { weaponId: "foundry-sunlance", manufacturerId: "ancient-foundry", tier: "legendary", familyId: "beamWeapons:vigil", collectionKind: "legendaryWeapons", discoveryMethod: "Unique discovery — the armoury vault beneath First Light." },
  { weaponId: "salvage-scattergun", manufacturerId: "frontier-salvage", tier: "common", familyId: "shotguns:breach", collectionKind: "blueprints", discoveryMethod: "Traded from a Nomad junker working the Gravewake fields." },
  // GP-004 §Content Engine: the Summon/Biological categories' first real weapons.
  { weaponId: "swarm-tender", manufacturerId: "halcyon-driveworks", tier: "rare", familyId: "summonWeapons:tending", collectionKind: "blueprints", discoveryMethod: "Field-modified from expedition survey drones." },
  { weaponId: "spore-lance", manufacturerId: "meridian-yards", tier: "uncommon", familyId: "biologicalWeapons:bloom", collectionKind: "blueprints", discoveryMethod: "Grown alongside the Hailborn lattice, tuned for toxin instead of frost." },
];

export const STARTING_WEAPON_IDS: readonly string[] = ["coil-ripper"];

/** 100+ expansion on the same shapes, deterministically. */
export function syntheticWeaponFor(index: number): { def: WeaponDef; profile: WeaponProfileDef; entry: WeaponRosterEntry } {
  const categories = ["ballistic", "laser", "plasma", "railgun", "missile", "beam", "flak", "arc", "drone", "orbital", "crystal", "void", "prototype", "ancient", "singularity"] as const;
  const patterns = ["singleShot", "burst", "spread", "arc", "nova", "spiral", "beam", "orbit", "homing", "chain", "wave", "chargedShot"] as const;
  const behaviours = ["straight", "seeking", "bouncing", "piercing", "explosive", "returning", "accelerating", "splitting", "orbiting", "chainLightning", "persistentBeam", "gravityAffected"] as const;
  const def: WeaponDef = {
    id: `synthetic-weapon-${index}`, name: `Synthetic Weapon ${index}`, category: categories[index % categories.length]!,
    manufacturer: "Atlas Dynamics", tier: 1 + (index % 4), rarity: "common", lore: `Arsenal expansion proof ${index}.`,
    damageSchool: index % 2 === 0 ? "physical" : "energy", damageSourceKind: "direct",
    baseDamage: 4 + (index % 6), critChance: 0.05, critMultiplier: 1.5,
    fireIntervalMs: 600 + (index % 5) * 100, firePattern: patterns[index % patterns.length]!,
    projectilesPerShot: 1 + (index % 3), projectileBehaviour: behaviours[Math.floor(index / patterns.length) % behaviours.length]!,
    range: 10 + (index % 8), projectileSpeed: 14, pierceCount: 0, explosionRadius: 0,
    statusOnHit: null, energyCost: 0, evolution: null,
  };
  const profile: WeaponProfileDef = {
    weaponId: def.id, frameworkCategory: "experimentalWeapons",
    visualIdentity: `Synthetic visual ${index}.`, element: "kinetic", heatGenerationPerShot: 1 + (index % 9),
    passiveTrait: { trigger: "onKill", bonus: { kind: "damage", value: 0.02 } },
    uniqueMechanic: { tag: `synthetic-${index}-doctrine`, description: `Synthetic mechanic ${index}.` },
    evolutionSource: null, masteryTrackId: `weapon:${def.id}`,
    statisticKeys: [`weapon:${def.id}:kills`], cosmetics: [{ kind: "weaponSkins", id: `synthetic-skin-${index}` }],
    futureExpansionHooks: [`synthetic-hook-${index}`],
  };
  return {
    def,
    profile,
    entry: {
      weaponId: def.id, manufacturerId: WEAPON_MANUFACTURER_IDS[index % WEAPON_MANUFACTURER_IDS.length]!,
      tier: WEAPON_TIERS[index % WEAPON_TIERS.length]!, familyId: "railguns:experimental",
      collectionKind: WEAPON_COLLECTION_KINDS[index % WEAPON_COLLECTION_KINDS.length]!, discoveryMethod: `Expansion discovery ${index}.`,
    },
  };
}
