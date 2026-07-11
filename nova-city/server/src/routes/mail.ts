import { Router } from 'express';
import type { AuthedRequest } from '../auth/middleware.js';
import { requireAuth } from '../auth/middleware.js';
import { requireCharacter } from './helpers.js';
import { characters, mail, users } from '../store/collections.js';
import { newId } from '../util/ids.js';
import { sendToUser } from '../ws/manager.js';

export const mailRouter = Router();
mailRouter.use(requireAuth);

mailRouter.get('/', (req: AuthedRequest, res) => {
  const messages = mail
    .filter((m) => m.toUserId === req.userId)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.json({ mail: messages });
});

mailRouter.post('/:messageId/read', (req: AuthedRequest, res) => {
  const message = mail.get(req.params.messageId);
  if (!message || message.toUserId !== req.userId) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  mail.put({ ...message, read: true });
  res.json({ ok: true });
});

mailRouter.post('/', (req: AuthedRequest, res) => {
  const sender = requireCharacter(req.userId!, res);
  if (!sender) return;

  const { toCallsign, subject, body } = req.body ?? {};
  if (typeof toCallsign !== 'string' || typeof subject !== 'string' || typeof body !== 'string' || !body.trim()) {
    res.status(400).json({ error: 'toCallsign, subject and body are required' });
    return;
  }
  const recipient = characters.find((c) => c.callsign.toLowerCase() === toCallsign.trim().toLowerCase());
  if (!recipient) {
    res.status(404).json({ error: 'No pilot with that callsign' });
    return;
  }
  if (!users.get(recipient.userId)) {
    res.status(404).json({ error: 'Recipient account not found' });
    return;
  }
  const message = mail.put({
    id: newId('mail'),
    fromUserId: sender.userId,
    fromCallsign: sender.callsign,
    toUserId: recipient.userId,
    subject: subject.trim().slice(0, 120),
    body: body.trim().slice(0, 2000),
    read: false,
    createdAt: Date.now(),
  });
  sendToUser(recipient.userId, { type: 'mail', fromCallsign: sender.callsign, subject: message.subject });
  res.status(201).json({ message });
});
