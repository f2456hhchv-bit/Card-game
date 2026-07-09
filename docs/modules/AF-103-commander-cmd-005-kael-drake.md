## Verbatim prompt

103

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-102 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the fifth fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-005

Codename:
THE HUNTER

Full Name:
Kael Drake

Species:
Human

Age:
41

Gender:
Male

Homeworld:
Ashfall Frontier

Primary Faction:
Independent Frontier Rangers

Secondary Affiliation:
Afterlight Initiative

Occupation:
Frontier Tracker

Elite Recon Specialist

Xeno Hunter

Threat Rating:
S-Class

Recruitment Difficulty:
Mid Campaign

==================================================
CORE FANTASY
==================================================

The Hunter studies every enemy before eliminating it.

He thrives against elite targets, bosses and dangerous wildlife.

Knowledge gained during battle becomes his greatest weapon.

Players should feel like patient apex predators rather than reckless soldiers.

==================================================
PERSONALITY
==================================================

Traits

Observant

Quiet

Patient

Loyal

Independent

Dry Humour

Kael speaks only when he has something worth saying.

He values preparation over confidence.

==================================================
VISUAL DESIGN
==================================================

Light reconnaissance armour.

Dark forest green and graphite plating.

Adaptive camouflage cloak.

Compact tactical backpack.

Retractable targeting visor.

Biometric gauntlet.

Magnetic utility belt.

Long-range sensor drone.

Battle-scarred equipment.

==================================================
ANIMATION STYLE
==================================================

Fluid.

Deliberate.

Low profile.

Constant environmental awareness.

Minimal unnecessary movement.

Predatory posture.

==================================================
VOICE STYLE
==================================================

Quiet.

Controlled.

Experienced.

Measured.

Calm under pressure.

==================================================
MUSIC MOTIF
==================================================

Low strings.

Minimal percussion.

Sparse electronic ambience.

Gradually increasing tension.

Represents patience before action.

==================================================
PASSIVE
==================================================

Predator's Analysis

Damaging an enemy gradually reveals:

Weak Points.

Resistances.

Attack Patterns.

Loot Quality.

Bosses permanently contribute to Hunter Knowledge.

==================================================
ABILITY ONE
==================================================

Hunter Drone

Deploy tactical reconnaissance drone.

Continuously tracks enemies.

Highlights weak points.

Marks elite targets.

Reveals hidden movement.

==================================================
ABILITY TWO
==================================================

Execution Protocol

Select a marked target.

Gain:

Critical Chance.

Critical Damage.

Precision.

Weak-point penetration.

Bonuses increase the longer the target survives.

==================================================
ULTIMATE
==================================================

Perfect Hunt

Enter heightened awareness.

Time slows slightly.

Weak points become fully exposed.

Movement becomes faster.

Critical hits chain together.

Boss attack telegraphs become easier to read.

==================================================
SIGNATURE MECHANIC
==================================================

Hunter Knowledge

Every enemy permanently analysed contributes knowledge.

Knowledge improves:

Critical efficiency.

Scanning.

Boss encounters.

Tracking.

Rare enemy detection.

Hunter Knowledge never resets.

==================================================
TALENT TREE
==================================================

Branch One

Marksman

Critical damage.

Weak point mastery.

Precision.

Range.

Branch Two

Tracker

Scanning.

Movement.

Detection.

Elite awareness.

Exploration.

Branch Three

Apex Predator

Boss hunting.

Elite control.

Execution bonuses.

Threat assessment.

==================================================
PREFERRED EQUIPMENT
==================================================

Advanced Sensors.

Targeting Computers.

Recon Modules.

Energy Capacitors.

Adaptive Cloaks.

==================================================
PREFERRED SHIPS
==================================================

Recon Frigate.

Interceptor.

Prototype Scout.

Light Hunter Corvette.

==================================================
PREFERRED WEAPONS
==================================================

Precision Railgun.

Long Beam Rifle.

Resonance Sniper.

Hunter Pulse Rifle.

==================================================
RELIC SYNERGY
==================================================

Critical Relics.

Exploration Relics.

Hunter Relics.

Ancient Relics.

==================================================
MISSION BONUS
==================================================

Elite Hunts.

Tracking Missions.

Reconnaissance.

Boss Expeditions.

Wildlife Surveys.

Threat Elimination.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Last Trail"

Track a legendary apex organism across several sectors.

Investigate destroyed expeditions.

Analyse behaviour instead of rushing combat.

Defeat the creature after fully understanding its attack patterns.

Kael joins after witnessing patience and discipline.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"The Silent Predator"

Hunt the mythical Void Stalker.

Track it across multiple biomes.

Survive without detection.

Discover the complete Hunter Codex.

Unlock the Legendary Predator Visor.

==================================================
RELATIONSHIPS
==================================================

Close Respect:

Adrian Kane.

Friendship:

Dr. Lyra Voss.

Professional Trust:

Seraphina Cael.

Dislikes:

Recklessness.

Wasteful violence.

Unnecessary risk.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Hunter Armour.

Adaptive Camouflage.

Elite Kill Effects.

Commander Title:

"The Apex"

Legendary visor effects.

Museum displays.

Exclusive dialogue.

==================================================
COMMANDER STRENGTHS
==================================================

Elite enemies.

Bosses.

Critical strikes.

Reconnaissance.

Weak-point exploitation.

Tracking.

==================================================
COMMANDER WEAKNESSES
==================================================

Limited crowd control.

Requires preparation.

Lower effectiveness against large swarms.

Rewards precision over speed.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Prioritise elite enemies.

Maintain range.

Continuously analyse targets.

Avoid unnecessary engagements.

Support team intelligence.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"Every trail tells a story."

Elite Enemy

"Watch carefully... it's already made a mistake."

Boss Encounter

"No creature is invincible."

Ultimate

"The hunt ends now."

Victory

"It was never luck."

==================================================
CODEX SUMMARY
==================================================

Kael Drake spent decades protecting isolated frontier colonies by tracking and eliminating threats long before they reached civilian populations. His detailed field journals became the foundation for humanity's modern xeno-behaviour research programme, saving countless lives through observation rather than brute force.

==================================================
MUSEUM ENTRY
==================================================

Display:

Original Hunter Visor.

Field journals.

Recon drone.

Recovered tracking equipment.

Interactive predator behaviour simulator.

==================================================
ACCESSIBILITY
==================================================

High-contrast weak-point indicators.

Optional auto-marking.

Reduced visual clutter mode.

Customisable target highlights.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-005 exactly as specified.

This becomes the canonical implementation of Kael Drake.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Kael Drake.

Review tracking systems.

Review critical-hit gameplay.

Review elite encounters.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-102.

Reduce overlap with exploration Commanders.

Strengthen hunter fantasy.

Ensure Kael Drake becomes the definitive reconnaissance and boss-hunting Commander of Afterlight, rewarding patience, precision and battlefield knowledge while offering one of the game's deepest mastery-focused playstyles.

Repeat until Commander CMD-005 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-103.

## Foundation / AF-000–102 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. His passive/signature bind to `onCriticalHit`/`pickupRadius` and `onCriticalHit`/`statusChance` — fresh pairs. Proven distinct from the entire 26-commander existing roster via the real fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. His three spec'd relationships (Close Respect for Kane, Friendship with Voss, Professional Trust in Cael) bind to their real roster ids exactly, and — notably — no relationship to CMD-003 (Ryker) is invented, since the spec is silent on that pairing; his Codex entry's `relatedEntryIds` accordingly names only the three commanders the spec actually relates him to. All 20 Preferred-X ids and his recruitment source are checked against real, existing rosters. Zero changes to any locked module (AF-000–102).

Score: 9.5/10 — approved and locked.
