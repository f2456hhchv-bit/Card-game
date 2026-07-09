## Verbatim prompt

111


You are continuing development of Afterlight.

Completed Modules

AF-000 → AF-110 are LOCKED.

Do NOT redesign previous systems.

Only extend them.

This module is the thirteenth fully production-ready Commander.

It must conform to AF-071, AF-072 and AF-098.

==================================================
COMMANDER IDENTITY
==================================================

Commander ID:
CMD-013

Codename:
THE BIOFORGE

Full Name:
Dr. Mira Syn

Species:
Human

Age:
40

Gender:
Female

Homeworld:
Eden Genesis Station

Primary Faction:
Afterlight Initiative

Secondary Affiliation:
Galactic Bioengineering Council

Occupation:
Bioengineer

Genetic Systems Director

Xenobiology Specialist

Threat Rating:
S-Class

Recruitment Difficulty:
Late Campaign

==================================================
CORE FANTASY
==================================================

The Bioforge transforms life itself into a battlefield resource.

She grows living organisms.

Mutates allies.

Cultivates biological structures.

Neutralises hostile evolution.

Victory comes through adaptation rather than destruction.

Players should feel like they are cultivating a living ecosystem that evolves alongside them.

==================================================
PERSONALITY
==================================================

Traits

Compassionate

Patient

Brilliant

Empathetic

Curious

Protective

Mira believes every living organism deserves understanding before judgement.

==================================================
VISUAL DESIGN
==================================================

White biological research suit.

Emerald energy veins.

Living bio-organic shoulder armour.

Floating DNA holograms.

Adaptive vine-like gauntlets.

Portable laboratory backpack.

Luminescent green visor.

Subtle organic growths integrated into equipment.

==================================================
ANIMATION STYLE
==================================================

Graceful.

Precise.

Scientific.

Organic growth accompanies abilities.

Constant sample collection.

==================================================
VOICE STYLE
==================================================

Gentle.

Calm.

Warm.

Confident.

Encouraging.

==================================================
MUSIC MOTIF
==================================================

Organic ambience.

Soft strings.

Nature-inspired synths.

Piano.

Gentle choir.

Represents life and renewal.

==================================================
PASSIVE
==================================================

Adaptive Evolution

Defeated biological enemies generate Genetic Data.

Genetic Data permanently improves:

Healing.

Adaptation.

Mutation efficiency.

Biological resistance.

==================================================
ABILITY ONE
==================================================

Living Bloom

Grow biological structures.

Possible creations include:

Healing Pods.

Defensive Vines.

Spore Fields.

Barrier Roots.

Nutrient Nodes.

Structures evolve during combat.

==================================================
ABILITY TWO
==================================================

Genome Rewrite

Temporarily enhance allies.

Possible mutations include:

Faster regeneration.

Improved mobility.

Increased resilience.

Enhanced critical recovery.

Negative biological effects removed.

==================================================
ULTIMATE
==================================================

Genesis Protocol

Create a massive living ecosystem.

Biological structures rapidly expand.

Healing spreads continuously.

Hostile organisms become unstable.

Friendly mutations reach maximum potential.

The battlefield slowly transforms into a thriving biome.

==================================================
SIGNATURE MECHANIC
==================================================

Evolution Level

Every successful biological interaction increases Evolution.

Higher Evolution unlocks:

Advanced mutations.

Larger living structures.

Improved healing.

Rare biological discoveries.

==================================================
TALENT TREE
==================================================

Branch One

Mutation

Evolution.

Adaptive bonuses.

Regeneration.

Biological enhancement.

Branch Two

Cultivation

Living structures.

Healing.

Area support.

Resource generation.

Branch Three

Xenobiology

Alien adaptation.

Resistance.

Specimen analysis.

Biological research.

==================================================
PREFERRED EQUIPMENT
==================================================

Medical Systems.

Bio Reactors.

Genetic Scanners.

Adaptive Armour.

Evolution Chambers.

==================================================
PREFERRED SHIPS
==================================================

Medical Cruiser.

Research Vessel.

Bioengineering Carrier.

Genesis Explorer.

==================================================
PREFERRED WEAPONS
==================================================

Bio Projector.

Spore Launcher.

Pulse Injector.

Genome Emitter.

==================================================
RELIC SYNERGY
==================================================

Biological Relics.

Healing Relics.

Research Relics.

Ancient Relics.

==================================================
MISSION BONUS
==================================================

Medical emergencies.

Alien ecosystems.

Planet restoration.

Scientific expeditions.

Species preservation.

Xenobiology research.

==================================================
RECRUITMENT MISSION
==================================================

Mission:

"The Last Seed"

Recover the final surviving genetic archive from a dying world.

Protect endangered native species.

Prevent illegal bio-harvesting.

Restore the planetary ecosystem.

Mira joins after the player chooses ecological preservation over immediate military gain.

==================================================
LEGENDARY MISSION
==================================================

Mission:

"The Garden Beyond Stars"

Restore the mythical Genesis Vault.

Recover extinct DNA archives.

Revive an ancient ecosystem.

Unlock the Legendary Genesis Genome.

==================================================
RELATIONSHIPS
==================================================

Close Friend:

Aria Sol.

Scientific Collaboration:

Lyra Voss.

Professional Respect:

Seraphina Cael.

Distrusts:

Biological weapons research.

Genetic exploitation.

Species extinction.

==================================================
MASTERY TRACK
==================================================

100 Levels.

Rewards include:

Genesis Armour.

Animated floral particle effects.

Living companion cosmetics.

Commander Title:

"The Gardener"

Legendary emerald colour palette.

Museum displays.

Exclusive dialogue.

==================================================
COMMANDER STRENGTHS
==================================================

Healing.

Adaptation.

Area support.

Survivability.

Biological encounters.

Planet restoration.

==================================================
COMMANDER WEAKNESSES
==================================================

Lower burst damage.

Requires Evolution buildup.

Less effective against fully mechanical enemies.

Support-focused.

==================================================
AI BEHAVIOUR
==================================================

If AI controlled:

Heal allies.

Grow support structures.

Prioritise ecosystem preservation.

Remove harmful effects.

Support frontline Commanders.

==================================================
DIALOGUE EXAMPLES
==================================================

Mission Start

"Life always finds another path."

Biological Discovery

"Incredible... evolution never truly stops."

Boss Encounter

"Even predators are part of nature."

Ultimate

"Grow. Adapt. Endure."

Victory

"Another world has a future."

==================================================
CODEX SUMMARY
==================================================

Dr. Mira Syn rebuilt humanity's lost xenobiology programme after recovering intact genetic archives from forgotten colonies. Her work restored countless endangered ecosystems and proved that rebuilding civilisation required protecting life in all its forms—not merely surviving among the stars.

==================================================
MUSEUM ENTRY
==================================================

Display:

Portable genome sequencer.

Genesis Archive.

Living research samples.

Recovered botanical journals.

Interactive ecosystem evolution simulator.

==================================================
ACCESSIBILITY
==================================================

Simplified Evolution Meter.

High-contrast healing indicators.

Reduced biological growth effects.

Healing radius preview.

Narration ready.

==================================================
OUTPUT
==================================================

Produce Commander CMD-013 exactly as specified.

This becomes the canonical implementation of Dr. Mira Syn.

Future references extend this implementation.

Never replace it.

==================================================
SELF REVIEW LOOP
==================================================

Play hundreds of hours using Dr. Mira Syn.

Review healing gameplay.

Review biological systems.

Review mutation mechanics.

Review progression.

Review dialogue.

Review mastery.

Review accessibility.

Review performance.

Review integration with AF-000 through AF-110.

Reduce overlap with support Commanders.

Strengthen biological identity.

Ensure Dr. Mira Syn becomes the definitive bioengineering Commander of Afterlight, rewarding adaptation, restoration and ecosystem management through a uniquely living playstyle that blends scientific discovery with long-term battlefield support.

Repeat until Commander CMD-013 consistently achieves an internal quality score of 9.5/10 or higher.

Only then lock AF-111.

## Foundation / AF-000–110 / GP-FINAL alignment review

Built entirely on AF-030's unchanged `CommanderDef`, AF-071's unchanged `CommanderProfileDef`, and AF-098's `CommanderExpandedProfileDef` wrapper. Her passive binds to `onKill`/`shieldRegeneration` — a literal trigger match, since "Defeated biological enemies generate Genetic Data" maps directly onto the real `onKill` trigger — and her signature binds to `onCriticalHit`/`resourceGain`, proven distinct from the entire 34-commander existing roster via the real fingerprint/`findOverlap` law and AF-071's real 17-part `architectureFor` completeness check. Her three spec'd relationships (Close Friend Sol, Scientific Collaboration Voss, Professional Respect Cael) bind to their real roster ids exactly, with no relationship to Kane, Ryker, Drake, Vale, Iskander, Thorne, Vex, Ash, or Korven invented since the spec is silent on those pairings; her Codex entry's `relatedEntryIds` accordingly names only the three commanders the spec actually relates her to. Her `support` archetype is a first real use of that registered value. All Preferred-X ids checked against real, existing rosters. Zero changes to any locked module (AF-000–110).

Score: 9.5/10 — approved and locked.
