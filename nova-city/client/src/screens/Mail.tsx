import { useEffect, useState } from 'react';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import type { MailMessage } from '../types';

export function Mail() {
  const { pushToast } = useToast();
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [toCallsign, setToCallsign] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get<{ mail: MailMessage[] }>('/mail').then((d) => setMessages(d.mail));

  useEffect(() => {
    load();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/mail', { toCallsign, subject, body });
      pushToast('Message sent.', 'success');
      setSubject('');
      setBody('');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Send failed', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const markRead = async (id: string) => {
    await api.post(`/mail/${id}/read`);
    load();
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Mail</h1>
      <Card title="Compose">
        <form onSubmit={send} className="stacked-form">
          <label>
            To (callsign)
            <input value={toCallsign} onChange={(e) => setToCallsign(e.target.value)} required />
          </label>
          <label>
            Subject
            <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </label>
          <label>
            Message
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </label>
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send'}
          </button>
        </form>
      </Card>
      <h2 className="section-title">Inbox</h2>
      <div className="grid two-col">
        {messages.map((m) => (
          <Card key={m.id} title={`${m.subject}${m.read ? '' : ' •'}`}>
            <p className="small muted">From {m.fromCallsign}</p>
            <p>{m.body}</p>
            {!m.read && (
              <button className="btn-ghost" onClick={() => markRead(m.id)}>
                Mark read
              </button>
            )}
          </Card>
        ))}
        {messages.length === 0 && <p className="muted">No mail.</p>}
      </div>
    </div>
  );
}
