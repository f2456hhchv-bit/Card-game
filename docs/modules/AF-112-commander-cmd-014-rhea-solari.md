## Verbatim prompt

112

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-111 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the fourteenth fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-014

Codename:
THE PHOTON

Full Name:
Rhea Solari

Species:
Human

Age:
31

Gender:
Female

Homeworld:
Helios Array

Primary Faction:
Afterlight Initiative

Secondary Affiliation:
Solar Energy Directorate

Occupation:
Photon Systems Scientist

Energy Weapons Specialist

Stellar Array Commander

Threat Rating:
S-Class

Recruitment Difficulty:
Late Campaign

==================================================
CORE FANTASY
==================================================

The Photon converts light into overwhelming precision.

Every beam.

Every reflection.

Every burst of energy.

Can be redirected, amplified and focused.

Players should feel like they are weaponising the power of stars themselves.

==================================================
PERSONALITY
==================================================

Traits

Optimistic

Energetic

Fearless

Brilliant

Curious

Inspirational

Rhea believes every sunrise proves humanity deserves another chance.

==================================================
VISUAL DESIGN
==================================================

Brilliant white combat suit.

Gold solar plating.

Radiant energy wings.

Floating solar mirrors.

Golden visor.

Photon gauntlets.

Solar reactor backpack.

Constant shimmering light.

==================================================
ANIMATION STYLE
==================================================

Elegant.

Fast.

Confident.

Light trails follow movement.

Abilities flow continuously.

==================================================
VOICE STYLE
==================================================

Bright.

Warm.

Confident.

Energetic.

Encouraging.

==================================================
MUSIC MOTIF
==================================================

Orchestral brass.

Bright strings.

Hopeful piano.

Radiant synthesizers.

Represents optimism.

==================================================
PASSIVE
==================================================

Solar Conversion

Energy pickups become Photon Charge.

Photon Charge improves:

Beam damage.

Critical chance.

Shield regeneration.

Movement speed.

==================================================
ABILITY ONE
==================================================

Photon Lance

Fire concentrated beam.

Pierces enemies.

Reflects from crystal surfaces.

Charges allied energy systems.

Activates ancient solar devices.

==================================================
ABILITY TWO
==================================================

Solar Mirrors

Deploy floating mirrors.

Reflect beams.

Redirect projectiles.

Amplify allied lasers.

Create precision firing lanes.

==================================================
ULTIMATE
==================================================

Helios Cascade

Open orbital solar array.

Massive beams rain across the battlefield.

Energy regeneration accelerates.

Enemy armour melts.

Solar mirrors multiply beam paths.

Ancient solar technology reaches maximum output.

==================================================
SIGNATURE MECHANIC
==================================================

Luminosity

Every successful beam interaction builds Luminosity.

Higher Luminosity grants:

Larger beams.

Longer reflections.

Improved critical damage.

Enhanced solar abilities.

==================================================
TALENT TREE
==================================================

Branch One

Photon Weapons

Beam mastery.

Critical damage.

Reflection chains.

Armour penetration.

Branch Two

Solar Engineering

Energy economy.

Mirror efficiency.

Recharge speed.

Power distribution.

Branch Three

Radiance

Support.

Movement.

Area illumination.

Battlefield control.

==================================================
PREFERRED EQUIPMENT
==================================================

Solar Capacitors.

Beam Lenses.

Energy Reactors.

Targeting Arrays.

Reflective Modules.

==================================================
PREFERRED SHIPS
==================================================

Solar Cruiser.

Energy Frigate.

Beam Carrier.

Helios Prototype.

==================================================
PREFERRED WEAPONS
==================================================

Photon Beam.

Solar Cannon.

Light Projector.

Radiance Rifle.

==================================================
RELIC SYNERGY
==================================================

Solar Relics.

Energy Relics.

Beam Relics.

Ancient Relics.

==================================================
MISSION BONUS
==================================================

Solar arrays.

Energy stations.

Crystal worlds.

Ancient observatories.

Orbital platforms.

Power restoration.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Dying Sun"

Repair a failing stellar energy collector.

Restore planetary power.

Protect civilian engineers.

Prevent stellar collapse.

Rhea joins after the player chooses to save millions of civilians despite sacrificing valuable technology.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"The First Dawn"

Restart the legendary Helios Array.

Synchronise planetary mirrors.

Restore the largest solar network in the galaxy.

Unlock the Legendary Stellar Prism.

==================================================
RELATIONSHIPS
==================================================

Close Friend:

Valen Ash.

Scientific Collaboration:

Aria Sol.

Professional Respect:

Lyra Voss.

Distrusts:

Energy monopolies.

Planetary exploitation.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Solar Armour.

Radiant beam effects.

Golden energy wings.

Commander Title:

"The Dawnbringer"

Legendary solar colour palette.

Museum displays.

Exclusive dialogue.

==================================================
COMMANDER STRENGTHS
==================================================

Beam weapons.

Area damage.

Energy generation.

Long-range precision.

Support.

Crystal synergy.

==================================================
COMMANDER WEAKNESSES
==================================================

Requires positioning.

Dependent on beam angles.

Reduced effectiveness in confined terrain.

Less effective with projectile builds.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Optimise beam reflections.

Support allied energy systems.

Maintain Luminosity.

Prioritise elite enemies.

Protect solar infrastructure.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"Let's give this galaxy another sunrise."

Solar Device

"It's beautiful... it's still working."

Boss Encounter

"Even stars outlive tyrants."

Ultimate

"Rise with the dawn!"

Victory

"Hope travels at the speed of light."

==================================================
CODEX SUMMARY
==================================================

Rhea Solari restored humanity's first functioning stellar energy array after the Collapse, ending decades of energy shortages across multiple frontier systems. Her work proved that the stars themselves could once again become the foundation of civilisation's future.

==================================================
MUSEUM ENTRY
==================================================

Display:

Photon Gauntlets.

Helios control core.

Solar engineering journals.

Original beam reflector.

Interactive stellar energy simulator.

==================================================
ACCESSIBILITY
==================================================

Reduced bloom mode.

High-contrast beam indicators.

Simplified reflection previews.

Photosensitivity protection.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-014 exactly as specified.

This becomes the canonical implementation of Rhea Solari.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Rhea Solari.

Review beam mechanics.

Review reflection gameplay.

Review energy systems.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-111.

Reduce excessive visual intensity.

Strengthen light-manipulation identity.

Ensure Rhea Solari becomes the definitive photon Commander of Afterlight, delivering a uniquely satisfying beam-based playstyle built around precision, energy manipulation and radiant battlefield control while remaining readable, elegant and mechanically distinct.

Repeat until Commander CMD-014 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-112.

## Foundation / AF-000–111 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Her passive/signature bind to `onKill`/`damage` and `onCriticalHit`/`criticalDamage`, proven distinct from the entire 35-commander existing roster via the real fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. Her three spec'd relationships (Close Friend Ash, Scientific Collaboration Sol, Professional Respect Voss) bind to their real roster ids exactly, with no relationship to Kane, Ryker, Cael, Drake, Vale, Iskander, Thorne, Vex, Korven, or Syn invented since the spec is silent on those pairings; her Codex entry's `relatedEntryIds` accordingly names only the three commanders the spec actually relates her to. Her `assault` archetype is a first real use of that registered value. Several Preferred-X ids resolve to strong real-data ties (`dawnspire`'s real `energyWeapons` specialisation, `helios-prism-array`'s name echoing her own homeworld, `solar-wastes`'s literal solar theme). Zero changes to any locked module (AF-000–111).

Score: 9.5/10 — approved and locked.
