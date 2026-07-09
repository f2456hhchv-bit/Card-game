## Verbatim prompt

100

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-099 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the second fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-002

Codename:
THE VANGUARD

Full Name:
Adrian Kane

Species:
Human

Age:
47

Gender:
Male

Homeworld:
Bastion Prime

Primary Faction:
United Human Frontier

Secondary Affiliation:
Afterlight Initiative

Occupation:
Fleet Commander

Military Strategist

Veteran Officer

Threat Rating:
S-Class

Recruitment Difficulty:
Early-Mid Campaign

==================================================
CORE FANTASY
==================================================

The Vanguard is the immovable shield of humanity.

He dominates battle through positioning, resilience and battlefield control rather than reckless aggression.

Players should feel like they are leading a disciplined fleet instead of fighting alone.

==================================================
PERSONALITY
==================================================

Traits

Disciplined

Protective

Stoic

Patient

Honourable

Self-Sacrificing

Believes that every civilian life outweighs military glory.

==================================================
VISUAL DESIGN
==================================================

Heavy command armour.

Dark graphite plating.

White military markings.

Blue command lights.

Long reinforced officer coat.

Mechanical left arm.

Command visor.

Decorated service medals.

Battle-worn appearance.

==================================================
ANIMATION STYLE
==================================================

Heavy.

Purposeful.

Military precision.

Minimal unnecessary movement.

Confident posture.

Always aware of surroundings.

==================================================
VOICE STYLE
==================================================

Deep.

Calm.

Authoritative.

Measured.

Never panicked.

==================================================
MUSIC MOTIF
==================================================

Low brass.

Military percussion.

Deep synthesizers.

Slow orchestral progression.

Represents determination.

==================================================
PASSIVE
==================================================

Iron Resolve

Nearby allies receive reduced incoming damage.

Commander gains increased resistance while defending objectives.

Revives are performed significantly faster.

==================================================
ABILITY ONE
==================================================

Guardian Barrier

Deploy an energy wall.

Blocks projectiles.

Absorbs explosions.

Protects allies.

Provides temporary cover.

==================================================
ABILITY TWO
==================================================

Command Protocol

Issue tactical orders.

Nearby allies gain:

Damage Resistance

Reload Speed

Shield Regeneration

Target Priority Indicators

==================================================
ULTIMATE
==================================================

Fortress Formation

Deploy a massive command field.

All allies inside gain:

Massive shield regeneration.

Damage reduction.

Status immunity.

Increased objective capture speed.

Enemy movement is slowed.

==================================================
SIGNATURE MECHANIC
==================================================

Leadership Presence

Every defended objective generates Leadership.

Leadership increases:

Defensive efficiency.

Shield strength.

Team survivability.

Command ability effectiveness.

Leadership persists throughout the expedition.

==================================================
TALENT TREE
==================================================

Branch One

Defender

Barrier upgrades

Shield efficiency

Damage mitigation

Objective control

Branch Two

Commander

Team buffs

Leadership generation

Cooldown reduction

Squad support

Branch Three

Juggernaut

Hull durability

Crowd control

Threat generation

Emergency recovery

==================================================
PREFERRED EQUIPMENT
==================================================

Heavy Shields

Reinforced Armour

Power Reactors

Command Modules

Repair Systems

==================================================
PREFERRED SHIPS
==================================================

Heavy Cruiser

Destroyer

Support Carrier

==================================================
PREFERRED WEAPONS
==================================================

Heavy Railgun

Pulse Cannon

Defender Beam

Missile Battery

==================================================
RELIC SYNERGY
==================================================

Defence Relics

Support Relics

Leadership Relics

Ancient Military Relics

==================================================
MISSION BONUS
==================================================

Defence missions.

Escort operations.

Civilian evacuations.

Fortification objectives.

Fleet battles.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Last Bastion"

A frontier colony faces overwhelming attack.

Hold defensive lines.

Protect evacuation transports.

Prevent orbital collapse.

Kane joins only after witnessing the player's commitment to civilian survival.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"Stand Until Dawn"

Lead the defence of the legendary Bastion Array.

Survive multiple assault waves.

Coordinate allied fleets.

Prevent destruction of the Afterlight Relay.

Unlock the Legendary Command Matrix.

==================================================
RELATIONSHIPS
==================================================

Friendly:

Military leaders.

Engineers.

Security forces.

Deep Respect:

Dr. Lyra Voss.

Distrusts:

Pirates.

Mercenaries.

Commanders who pursue glory over duty.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Command Armour.

Animated Shield Effects.

Officer Portraits.

Commander Title:

"The Wall"

Legendary military colour palette.

Museum displays.

Exclusive dialogue.

==================================================
COMMANDER STRENGTHS
==================================================

Objective defence.

Survivability.

Crowd control.

Team support.

Battlefield control.

Boss endurance.

==================================================
COMMANDER WEAKNESSES
==================================================

Lower mobility.

Lower exploration bonuses.

Limited burst damage.

Requires strategic positioning.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Prioritise civilians.

Protect objectives.

Deploy barriers proactively.

Remain near allies.

Control battlefield space.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"We hold the line. No exceptions."

Objective Under Attack

"Reinforce immediately!"

Boss Encounter

"Strength without discipline is weakness."

Victory

"They're alive. That's what matters."

Low Health

"I've endured worse."

==================================================
CODEX SUMMARY
==================================================

Adrian Kane commanded humanity's final defensive fleets during the darkest years following the Collapse.

His refusal to abandon civilian populations became legendary throughout frontier space, inspiring countless colonies to resist extinction.

==================================================
MUSEUM ENTRY
==================================================

Display:

Original command armour.

Battle-standard.

Service medals.

Command logs.

Interactive Bastion Prime defence hologram.

==================================================
ACCESSIBILITY
==================================================

Barrier placement preview.

Objective highlights.

High-contrast shield effects.

Optional simplified command indicators.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-002 exactly as specified.

This becomes the canonical implementation of Adrian Kane.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Adrian Kane.

Review defensive gameplay.

Review team support.

Review battlefield control.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-099.

Reduce overlap with exploration Commanders.

Strengthen leadership fantasy.

Ensure Adrian Kane becomes the definitive defensive Commander of Afterlight, embodying courage, discipline and sacrifice while providing one of the deepest tactical support playstyles in the game.

Repeat until Commander CMD-002 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-100.

## Foundation / AF-000–099 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper — every spec field realises onto one of these real shapes. His passive/signature bind to `onDamageTaken`/`shieldRegeneration` and `onDamageTaken`/`cooldownReduction`, a fresh pair not yet used elsewhere in the roster. Proven distinct from the entire 23-commander existing roster via the real fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. His spec'd "Deep Respect" for Dr. Lyra Voss is realised as a genuine cross-commander relationship binding to CMD-001's real roster id (`voss-pathfinder`), and his Codex entry cross-references hers via `relatedEntryIds` — the first explicit inter-commander continuity link in the roster. A third Codex commander entry is added additively; `codexData.ts` itself remains untouched. All 20 Preferred-X ids and his recruitment source are checked against real, existing rosters. His structural weaknesses (no `damage`/`criticalDamage`/`movementSpeed` bonus anywhere on his own passive/signature) are proven by test. Zero changes to any locked module (AF-000–099).

Score: 9.5/10 — approved and locked.
