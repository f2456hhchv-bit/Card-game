## Verbatim prompt

99

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-098 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the first fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-001

Codename:
THE PATHFINDER

Full Name:
Dr. Lyra Voss

Species:
Human

Age:
38

Gender:
Female

Homeworld:
New Horizon Colony

Primary Faction:
Afterlight Initiative

Secondary Affiliation:
United Human Frontier

Occupation:
Astrophysicist
Explorer
Expedition Commander

Threat Rating:
A-Class

Recruitment Difficulty:
Early Campaign

==================================================
CORE FANTASY
==================================================

The Pathfinder is not humanity's greatest soldier.

She is humanity's greatest explorer.

She survives through preparation, intelligence, positioning and scientific mastery.

Players constantly feel rewarded for exploring every corner of a map.

==================================================
PERSONALITY
==================================================

Traits

Curious

Optimistic

Calm

Patient

Empathetic

Highly Intelligent

Believes knowledge always outweighs violence.

She rarely raises her voice.

She inspires confidence.

==================================================
VISUAL DESIGN
==================================================

Slim exploration exosuit.

White and dark navy armour.

Gold scientific markings.

Long expedition coat.

Compact scanning drone.

Integrated holographic wrist computer.

Explorer backpack.

Blue visor.

NASA-inspired equipment.

==================================================
ANIMATION STYLE
==================================================

Smooth.

Confident.

Minimal wasted movement.

Always analysing surroundings.

Frequently scanning.

Calm combat posture.

==================================================
VOICE STYLE
==================================================

Warm.

Professional.

Scientific.

Quiet confidence.

Never arrogant.

==================================================
MUSIC MOTIF
==================================================

Soft synths.

Piano.

Ambient strings.

Gradually expanding orchestration.

Represents discovery.

==================================================
PASSIVE
==================================================

Explorer's Instinct

Nearby hidden resources become visible.

Scanning speed increased.

Codex discoveries reward additional research.

==================================================
ABILITY ONE
==================================================

Survey Drone

Deploy autonomous drone.

Reveals map.

Marks enemies.

Finds hidden resources.

Can activate ancient terminals remotely.

==================================================
ABILITY TWO
==================================================

Quantum Scanner

Large scanning pulse.

Highlights:

Secrets

Weak points

Collectibles

Scientific anomalies

Hidden objectives

==================================================
ULTIMATE
==================================================

Afterlight Beacon

Deploys temporary exploration beacon.

Reveals entire surrounding sector.

Increases ally research.

Improves loot quality.

Weakens hidden enemies.

Creates temporary safe zone.

==================================================
SIGNATURE MECHANIC
==================================================

Scientific Momentum

Every discovery grants Momentum.

Momentum improves:

Research gain.

Scanning.

Critical information.

Resource quality.

Momentum resets only after mission completion.

==================================================
TALENT TREE
==================================================

Branch One

Explorer

Improved scanning

Faster exploration

Secret detection

Movement

Branch Two

Scientist

Research bonuses

Ancient technology

Prototype analysis

Laboratory efficiency

Branch Three

Field Commander

Drone upgrades

Survivability

Team support

Mission planning

==================================================
PREFERRED EQUIPMENT
==================================================

Scanning Arrays

Sensor Packages

Research Modules

Drone Systems

Energy Reactors

==================================================
PREFERRED SHIPS
==================================================

Science Vessel

Recon Frigate

Prototype Explorer

==================================================
PREFERRED WEAPONS
==================================================

Precision Laser

Arc Rifle

Beam Emitter

Light Railgun

==================================================
RELIC SYNERGY
==================================================

Research Relics

Exploration Relics

Ancient Relics

Drone Relics

==================================================
MISSION BONUS
==================================================

Exploration missions.

Research missions.

Survey missions.

Ancient ruins.

Scientific expeditions.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Silent Observatory"

Players investigate an abandoned orbital observatory.

Recover scientific archives.

Defeat scavengers.

Restore telescope.

Recruit Lyra after proving scientific curiosity over destruction.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"Light Beyond Infinity"

Discover the first complete Afterlight Relay.

Decode precursor star maps.

Reveal hidden galaxy sectors.

Unlock Legendary Scanner.

==================================================
RELATIONSHIPS
==================================================

Friendly:

Scientists.

Engineers.

Explorers.

Respectful:

Military Commanders.

Distrusts:

Void Cults.

Pirates.

Those seeking technology for domination.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Portraits.

Explorer Armour.

Drone skins.

Commander title:

"The Cartographer"

Legendary colour palette.

Museum displays.

Voice lines.

==================================================
COMMANDER STRENGTHS
==================================================

Exploration.

Research.

Map control.

Information gathering.

Resource efficiency.

Hidden discoveries.

==================================================
COMMANDER WEAKNESSES
==================================================

Lower burst damage.

Lower direct combat power.

Requires planning.

Maximum effectiveness depends upon player knowledge.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Prioritise scanning.

Reveal objectives.

Support allies.

Maintain safe positioning.

Deploy drones intelligently.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"Every unanswered question is an opportunity."

Ancient Discovery

"Incredible... this changes everything."

Boss Fight

"Observe first. React second."

Victory

"Knowledge survives long after battles end."

Low Health

"I'll need a moment to think..."

==================================================
CODEX SUMMARY
==================================================

Dr. Lyra Voss became one of the first commanders to rediscover functioning Afterlight technology after decades of failed expeditions.

Her discoveries transformed humanity's understanding of the galaxy and reignited hope that civilisation could be rebuilt.

==================================================
MUSEUM ENTRY
==================================================

Display:

Explorer suit.

Original survey drone.

Recovered observatory logs.

Personal journal.

Interactive galaxy map.

==================================================
ACCESSIBILITY
==================================================

Ability previews.

Scan outlines.

Optional scan automation.

High contrast discoveries.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-001 exactly as specified.

This becomes the canonical implementation of Dr. Lyra Voss.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Lyra.

Review exploration pacing.

Review scientific identity.

Review build diversity.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-098.

Reduce combat overlap.

Strengthen exploration fantasy.

Ensure Lyra becomes the definitive exploration Commander of Afterlight, rewarding curiosity, preparation and scientific discovery while remaining mechanically unique and emotionally memorable.

Repeat until Commander CMD-001 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-099.

## Foundation / AF-000–098 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper (introduced for Roster Expansion Batch 1) — every field in the spec's Commander Identity/Personality/Visual Design/Animation/Voice/Music/Abilities/Talent Tree/Preferences/Recruitment/Legendary Mission/Relationships/Mastery/Dialogue/Codex/Museum sections realises onto one of these real shapes, never a new one invented for her alone. Her passive/ultimate/signature bind to the closest real `PassiveTrigger`/`BonusKind` pairs available (only 5 combat triggers and 15 bonus kinds exist; "nearby hidden resources become visible" realises as `pickupRadius`, "research gain" as `experienceGain` — the same trigger-bridging convention already used for vael-meridian, a fellow scientist-class commander). Proven distinct from the entire 22-commander existing roster via the real AF-030 fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. Her Field Commander talent branch gives `droneEffectiveness` a second real producer. A second Codex commander entry (`codex-commander-voss-pathfinder`) is added additively, extending — not modifying — `codexData.ts`. All 20 Preferred-X ids and her recruitment source are checked against real, existing rosters, not invented. Her structural weaknesses (no `damage`/`criticalDamage` bonus anywhere on her own passive/signature) are proven by test, matching the spec's stated combat weaknesses. Zero changes to any locked module (AF-000–098).

Score: 9.5/10 — approved and locked.
