## Verbatim prompt

117

You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-116 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the nineteenth fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-019

Codename:
THE ORACLE

Full Name:
Selene Myrr

Species:
Human

Age:
39

Gender:
Female

Homeworld:
Oracle Station Theta

Primary Faction:
Afterlight Initiative

Secondary Affiliation:
Predictive Analytics Directorate

Occupation:
Strategic Forecast Scientist

Battlefield Simulation Director

Predictive Systems Architect

Threat Rating:
S-Class

Recruitment Difficulty:
Endgame

==================================================
CORE FANTASY
==================================================

The Oracle wins before combat begins.

She predicts enemy behaviour.

Calculates probability.

Directs allies.

Manipulates battlefield information.

Players should feel like grand strategists who always remain one move ahead.

Victory comes from intelligence rather than reaction.

==================================================
PERSONALITY
==================================================

Traits

Analytical

Composed

Patient

Highly Intelligent

Empathetic

Visionary

Selene believes perfect preparation saves more lives than perfect weapons.

==================================================
VISUAL DESIGN
==================================================

Elegant white command suit.

Silver neural circuitry.

Floating holographic prediction rings.

Transparent tactical cloak.

Blue quantum visor.

Orbiting tactical drones.

Predictive holo-displays.

Minimalist scientific aesthetic.

==================================================
ANIMATION STYLE
==================================================

Calm.

Calculated.

Minimal movement.

Constant holographic interaction.

Predictive displays orbit naturally.

==================================================
VOICE STYLE
==================================================

Soft.

Confident.

Measured.

Calm.

Intellectually reassuring.

==================================================
MUSIC MOTIF
==================================================

Ambient piano.

Layered synth textures.

Gentle electronic pulses.

Subtle orchestral strings.

Represents foresight.

==================================================
PASSIVE
==================================================

Predictive Insight

Enemy attacks gradually become predicted.

Prediction increases:

Dodge timing.

Critical opportunities.

Weak point visibility.

Boss telegraph duration.

Loot efficiency.

==================================================
ABILITY ONE
==================================================

Tactical Projection

Deploy predictive battlefield simulation.

Highlights:

Enemy paths.

Incoming attacks.

Safe routes.

Objective priorities.

Resource locations.

==================================================
ABILITY TWO
==================================================

Probability Matrix

Select battlefield zone.

Inside the Matrix:

Critical chance increases.

Enemy accuracy decreases.

Cooldown efficiency improves.

Allied reaction speed improves.

==================================================
ULTIMATE
==================================================

Future Vision

Generate complete tactical forecast.

Enemy intentions become visible.

Boss mechanics previewed.

Rare opportunities highlighted.

Hidden objectives revealed.

Entire squad receives Prediction bonuses.

==================================================
SIGNATURE MECHANIC
==================================================

Prediction Level

Scanning.

Successful dodges.

Enemy analysis.

Mission intelligence.

Generate Prediction.

Higher Prediction unlocks:

Advanced simulations.

Automatic warnings.

Strategic enhancements.

Rare battlefield opportunities.

==================================================
TALENT TREE
==================================================

Branch One

Analysis

Scanning.

Prediction.

Weak-point detection.

Critical optimisation.

Branch Two

Strategy

Team support.

Objective planning.

Resource optimisation.

Cooldown management.

Branch Three

Oracle

Future Vision.

Boss forecasting.

Mission efficiency.

Battlefield intelligence.

==================================================
PREFERRED EQUIPMENT
==================================================

Neural Processors.

Prediction Arrays.

Advanced Sensors.

Quantum Computers.

Tactical Networks.

==================================================
PREFERRED SHIPS
==================================================

Command Cruiser.

Recon Vessel.

Science Flagship.

Prediction Frigate.

==================================================
PREFERRED WEAPONS
==================================================

Precision Beam.

Pulse Rifle.

Tactical Projector.

Energy Carbine.

==================================================
RELIC SYNERGY
==================================================

Knowledge Relics.

Research Relics.

Recon Relics.

Ancient Relics.

==================================================
MISSION BONUS
==================================================

Reconnaissance.

Strategic operations.

Fleet command.

Scientific expeditions.

High-value recoveries.

Ancient archives.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Infinite Equation"

Recover a lost predictive supercomputer.

Prevent hostile factions from obtaining its simulations.

Solve tactical anomalies.

Preserve the Oracle Network.

Selene joins after the player chooses to preserve knowledge rather than destroy it to deny enemy access.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"Tomorrow's Memory"

Restore the legendary Oracle Array.

Predict a galaxy-wide invasion.

Coordinate multiple expedition fleets.

Unlock the Legendary Predictive Core.

==================================================
RELATIONSHIPS
==================================================

Close Friend:

Aurelion Vex.

Professional Respect:

Lyra Voss.

Collaborates With:

Seraphina Cael.

Distrusts:

Leaders ruled by emotion.

Blind aggression.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Oracle Armour.

Animated holographic constellations.

Strategic projection effects.

Commander Title:

"The Foresighted"

Legendary silver-blue palette.

Museum displays.

Exclusive dialogue.

==================================================
COMMANDER STRENGTHS
==================================================

Battlefield awareness.

Boss prediction.

Squad support.

Mission planning.

Information gathering.

Objective efficiency.

==================================================
COMMANDER WEAKNESSES
==================================================

Low direct damage.

Requires planning.

Less effective without battlefield information.

High tactical complexity.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Maintain Prediction.

Warn allies.

Prioritise objectives.

Reveal hidden threats.

Coordinate battlefield positioning.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"The future has already begun."

Boss Encounter

"I've seen this outcome before."

Ultimate

"Look beyond the present."

Victory

"The correct decision was made."

Low Health

"I failed to account for that..."

==================================================
CODEX SUMMARY
==================================================

Selene Myrr rebuilt humanity's predictive analytics systems using recovered Afterlight computational arrays, enabling expedition commanders to forecast large-scale threats before they emerged. Her strategic doctrines dramatically reduced expedition casualties and became the foundation of modern Afterlight operational planning.

==================================================
MUSEUM ENTRY
==================================================

Display:

Oracle Core.

Prediction interface.

Strategic journals.

Recovered simulation archives.

Interactive tactical forecasting simulator.

==================================================
ACCESSIBILITY
==================================================

High-contrast prediction indicators.

Simplified tactical overlays.

Customisable warning notifications.

Reduced holographic effects.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-019 exactly as specified.

This becomes the canonical implementation of Selene Myrr.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Selene Myrr.

Review prediction systems.

Review battlefield awareness.

Review strategic gameplay.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-116.

Reduce overlap with reconnaissance and research Commanders.

Strengthen foresight identity.

Ensure Selene Myrr becomes the definitive strategic Commander of Afterlight, rewarding intelligence, planning and tactical mastery through one of the deepest battlefield information systems in the game while remaining intuitive, readable and highly rewarding to master.

Repeat until Commander CMD-019 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-117.

## Foundation / AF-000–116 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Per the spec's own self-review directive ("Reduce overlap with reconnaissance and research Commanders"), her `support`/`support` archetype/class deliberately avoids the `recon` archetype used four times already (Voss, Drake, Vex, Korven) — verified by a dedicated test asserting neither her archetype nor her class is `recon`. Her passive/signature bind to `onCriticalHit`/`pickupRadius` and `onKill`/`resourceGain`, proven distinct from the entire 40-commander existing roster via the real fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. Her three spec'd relationships (Close Friend Vex, Professional Respect Voss, Collaborates With Cael) bind to their real roster ids exactly, with no relationship to Kane, Ryker, Drake, Sol, Vale, Iskander, Thorne, Ash, Korven, Syn, Solari, Kain, Reyes, Orion, or Volkov invented since the spec is silent on those pairings; her Codex entry's `relatedEntryIds` accordingly names only the three commanders the spec actually relates her to. Several Preferred-X ids resolve to strong real-data ties (`horizon-flux-capacitor`'s Quantum Horizon manufacturer, `aurelia-hull-mk1`'s real scienceVessel class, `singularity-zone`'s "Axiom" lore). Zero changes to any locked module (AF-000–116).

Score: 9.5/10 — approved and locked.
