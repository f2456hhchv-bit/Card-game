import { Router } from 'express';
import { characters, users, HOME_LOCATION_ID } from '../store/collections.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { signToken } from '../auth/jwt.js';
import { newId } from '../util/ids.js';
import { characterView } from './helpers.js';
import type { Character } from '../types.js';

export const authRouter = Router();

const STARTING_STAT = 10;
const STARTING_CREDITS = 250;

function createStarterCharacter(userId: string, callsign: string): Character {
  const now = Date.now();
  return {
    id: newId('char'),
    userId,
    callsign,
    level: 1,
    xp: 0,
    credits: STARTING_CREDITS,
    stats: { strength: STARTING_STAT, defense: STARTING_STAT, speed: STARTING_STAT, dexterity: STARTING_STAT },
    resources: { fuel: 100, resolve: 100, morale: 100, health: 100, updatedAt: now },
    status: 'ok',
    statusUntil: null,
    locationId: HOME_LOCATION_ID,
    travelDestinationId: null,
    equippedWeaponId: null,
    equippedArmorId: null,
    inventory: [],
    factionId: null,
    medicAssistUsedAt: null,
    createdAt: now,
  };
}

authRouter.post('/register', (req, res) => {
  const { email, username, password, callsign } = req.body ?? {};
  if (
    typeof email !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof callsign !== 'string' ||
    !email.trim() ||
    !username.trim() ||
    !callsign.trim() ||
    password.length < 6
  ) {
    res.status(400).json({ error: 'email, username, callsign and a password of 6+ characters are required' });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (users.find((u) => u.email === normalizedEmail)) {
    res.status(409).json({ error: 'An account with that email already exists' });
    return;
  }
  if (characters.find((c) => c.callsign.toLowerCase() === callsign.trim().toLowerCase())) {
    res.status(409).json({ error: 'That callsign is already taken' });
    return;
  }

  const user = {
    id: newId('user'),
    email: normalizedEmail,
    username: username.trim(),
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };
  users.put(user);

  const character = createStarterCharacter(user.id, callsign.trim());
  characters.put(character);

  const token = signToken({ userId: user.id });
  res.status(201).json({ token, character: characterView(character) });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const character = characters.find((c) => c.userId === user.id);
  if (!character) {
    res.status(404).json({ error: 'No character found for this account' });
    return;
  }
  const token = signToken({ userId: user.id });
  res.json({ token, character: characterView(character) });
});
