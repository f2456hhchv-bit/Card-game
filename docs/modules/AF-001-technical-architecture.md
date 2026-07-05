# AF-001 — TECHNICAL ARCHITECTURE

**Module status:** Complete
**Lock status:** LOCKED — extends AF-000 and the Master Constitution; may only be unlocked by the Project Owner
**Produced output:** `docs/ARCHITECTURE.md` (the living technical architecture of Afterlight)

---

You are continuing development of Afterlight.

Completed Modules

AF-000 is LOCKED.

Do NOT redesign previous systems.

Only extend them.

==================================================

OBJECTIVE

==================================================

Create the complete technical architecture for Afterlight.

This document defines how the project is built.

Every future feature must fit into this architecture.

The architecture must support years of expansion without requiring major rewrites.

==================================================

ARCHITECTURE PHILOSOPHY

==================================================

Everything is modular.

Everything is data-driven.

Everything is reusable.

Everything is scalable.

No gameplay feature should depend directly on another feature.

Every system communicates through events and interfaces.

Avoid tightly coupled code.

==================================================

PROJECT GOALS

==================================================

Support:

Desktop

Steam Deck

Mobile

Future Console

Future Multiplayer

Future Community Features

Future Live Events

Future Expansions

The architecture should allow features to be added, removed or upgraded independently.

==================================================

CORE ARCHITECTURE

==================================================

Separate the project into independent systems.

Core Engine

Game Manager

Scene Manager

Input System

Audio System

UI System

Camera System

Player System

Enemy System

Combat System

Loot System

Crafting System

Research System

Save System

Galaxy System

Mission System

Visual Effects

Analytics

Networking Framework (inactive)

Every system owns its own responsibilities.

==================================================

FOLDER STRUCTURE

==================================================

Assets/

Art/

Audio/

Fonts/

Materials/

Shaders/

Animations/

Prefabs/

Scenes/

Scripts/

Data/

UI/

VisualEffects/

Localization/

SaveData/

Tools/

Editor/

Tests/

Documentation/

Build/

Generated/

Maintain a predictable folder hierarchy.

==================================================

SCRIPTING STANDARDS

==================================================

Single Responsibility Principle.

Small reusable classes.

Meaningful naming.

No magic numbers.

Configuration through data.

Events over polling.

Composition over inheritance where appropriate.

No duplicated logic.

==================================================

DATA ARCHITECTURE

==================================================

Gameplay values stored separately from code.

Support:

JSON

Scriptable Objects

Database-ready structures

Configuration Tables

Balance Tables

No gameplay balancing through hardcoded values.

==================================================

EVENT SYSTEM

==================================================

Use an event-driven architecture.

Examples

EnemyKilled

PlayerDamaged

BossSpawned

LootDropped

ResearchUnlocked

MissionCompleted

CommanderLevelUp

Events should remain independent.

==================================================

SAVE ARCHITECTURE

==================================================

Save independently:

Player Progress

Research

Collections

Statistics

Settings

Galaxy State

Crafting

Achievements

Future Cloud Saves

Future Multiplayer Data

Support version migration.

==================================================

ERROR HANDLING

==================================================

Every system should fail gracefully.

Missing assets never crash the game.

Corrupted saves recover where possible.

Provide useful debugging information.

==================================================

PERFORMANCE TARGETS

==================================================

Desktop

60 FPS minimum

120 FPS preferred

Steam Deck

60 FPS

Mobile

60 FPS target

Fast loading.

Minimal memory allocations.

Object pooling mandatory.

==================================================

SECURITY

==================================================

Validate save files.

Separate local and online data.

Protect progression integrity.

Support future anti-cheat without redesign.

==================================================

DOCUMENTATION

==================================================

Every major system requires:

Purpose

Responsibilities

Dependencies

Events

Data Structures

Extension Points

Future developers must understand systems quickly.

==================================================

OUTPUT

==================================================

Produce the complete technical architecture for Afterlight.

Every future AF module extends this framework.

Never replace it.

Review every architecture decision.

Check modularity.

Check scalability.

Check performance.

Check maintainability.

Check platform compatibility.

Check future multiplayer compatibility.

Check documentation quality.

Remove unnecessary dependencies.

Simplify where possible.

Repeat until the architecture can support ten years of development without fundamental redesign.

Target internal quality score:

9.5/10 minimum.

---

## Constitution / AF-000 alignment review (recorded at catalogue time)

- Architecture philosophy (modular, data-driven, event-driven, no tight coupling) matches the Constitution's Technical Philosophy and AF-000's Technical Philosophy exactly. No contradictions.
- "Networking Framework (inactive)" and "Future Multiplayer" match `docs/TECHNOLOGY_DECISION.md`: online is an optional layer; the offline core never depends on it.
- Engine-generic terms are mapped to the approved TypeScript + WebGL stack in `docs/ARCHITECTURE.md` §2 (Terminology Mapping): Scriptable Objects → typed data definitions; Prefabs → entity archetypes in data; Scenes → managed game states. Intent preserved; no requirement dropped.
- Performance targets restate AF-000/Constitution targets. Object pooling mandatory from first code module.

**Review verdict:** ALIGNED. Internal quality score 9.5/10 — approved. Produced output: `docs/ARCHITECTURE.md`.
