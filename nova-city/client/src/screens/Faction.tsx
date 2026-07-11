import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import { FactionCrest } from '../components/FactionCrest';
import type { Character, FactionMessage, FactionSummary } from '../types';

export function Faction() {
  const { character, setCharacter, refresh } = useAuth();
  const { pushToast } = useToast();
  const [factions, setFactions] = useState<FactionSummary[]>([]);
  const [messages, setMessages] = useState<FactionMessage[]>([]);
  const [chatBody, setChatBody] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [depositAmount, setDepositAmount] = useState(100);
  const [warTarget, setWarTarget] = useState('');
  const [busy, setBusy] = useState(false);

  const loadFactions = () => api.get<{ factions: FactionSummary[] }>('/faction').then((d) => setFactions(d.factions));

  useEffect(() => {
    loadFactions();
    const id = setInterval(loadFactions, 10000);
    return () => clearInterval(id);
  }, []);

  const own = factions.find((f) => f.id === character?.factionId);

  useEffect(() => {
    if (!own) {
      setMessages([]);
      return;
    }
    const load = () =>
      api.get<{ messages: FactionMessage[] }>(`/faction/${own.id}/messages`).then((d) => setMessages(d.messages));
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [own?.id]);

  if (!character) return null;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/faction/create', { name, tag });
      await refresh();
      await loadFactions();
      pushToast('Fleet founded.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not create fleet', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const join = async (factionId: string) => {
    setBusy(true);
    try {
      await api.post(`/faction/${factionId}/join`);
      await refresh();
      await loadFactions();
      pushToast('Joined the fleet.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not join fleet', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const leave = async () => {
    if (!own) return;
    setBusy(true);
    try {
      await api.post(`/faction/${own.id}/leave`);
      await refresh();
      await loadFactions();
      pushToast('Left the fleet.', 'info');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not leave fleet', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const deposit = async () => {
    if (!own) return;
    try {
      await api.post(`/faction/${own.id}/bank/deposit`, { amount: depositAmount });
      const data = await api.get<{ character: Character }>('/character/me');
      setCharacter(data.character);
      await loadFactions();
      pushToast('Deposited.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Deposit failed', 'danger');
    }
  };

  const withdraw = async () => {
    if (!own) return;
    try {
      const data = await api.post<{ character: Character }>(`/faction/${own.id}/bank/withdraw`, {
        amount: depositAmount,
      });
      setCharacter(data.character);
      await loadFactions();
      pushToast('Withdrawn.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Withdraw failed', 'danger');
    }
  };

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!own || !chatBody.trim()) return;
    try {
      await api.post(`/faction/${own.id}/messages`, { body: chatBody });
      setChatBody('');
      const data = await api.get<{ messages: FactionMessage[] }>(`/faction/${own.id}/messages`);
      setMessages(data.messages);
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Message failed', 'danger');
    }
  };

  const declareWar = async () => {
    if (!own || !warTarget) return;
    try {
      await api.post(`/faction/${own.id}/war/declare`, { targetFactionId: warTarget });
      await loadFactions();
      pushToast('War declared!', 'danger');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not declare war', 'danger');
    }
  };

  const contribute = async () => {
    if (!own) return;
    try {
      const data = await api.post<{ contributed: number }>(`/faction/${own.id}/war/contribute`, { amount: 15 });
      const me = await api.get<{ character: Character }>('/character/me');
      setCharacter(me.character);
      await loadFactions();
      pushToast(`Contributed ${data.contributed} Fuel to the war effort.`, 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Contribution failed', 'danger');
    }
  };

  if (!own) {
    return (
      <div className="screen">
        <h1 className="screen-title">Fleets</h1>
        <Card title="Found a Fleet">
          <form onSubmit={create} className="stacked-form">
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Tag
              <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={6} required />
            </label>
            <button className="btn-primary" type="submit" disabled={busy}>
              Found Fleet
            </button>
          </form>
        </Card>
        <h2 className="section-title">Browse Fleets</h2>
        <div className="grid two-col">
          {factions.map((f) => (
            <Card key={f.id}>
              <div className="faction-header">
                <FactionCrest seed={f.id} tag={f.tag} />
                <h3 className="card-title">
                  {f.name} [{f.tag}]
                </h3>
              </div>
              <p>{f.memberCount} members</p>
              <button className="btn-primary" disabled={busy} onClick={() => join(f.id)}>
                Join
              </button>
            </Card>
          ))}
          {factions.length === 0 && <p className="muted">No fleets founded yet — be the first.</p>}
        </div>
      </div>
    );
  }

  const isLeader = own.leaderId === character.id;

  return (
    <div className="screen">
      <div className="faction-header faction-header-lg">
        <FactionCrest seed={own.id} tag={own.tag} size={56} />
        <h1 className="screen-title">
          {own.name} [{own.tag}]
        </h1>
      </div>
      <div className="grid two-col">
        <Card title="Fleet">
          <p>{own.memberCount} members</p>
          <p>Bank: {(own.bank ?? 0).toLocaleString()} cr</p>
          <div className="button-row">
            <input
              type="number"
              min={1}
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              style={{ width: '6rem' }}
            />
            <button className="btn-secondary" onClick={deposit}>
              Deposit
            </button>
            {isLeader && (
              <button className="btn-secondary" onClick={withdraw}>
                Withdraw
              </button>
            )}
          </div>
          <button className="btn-ghost" onClick={leave}>
            Leave Fleet
          </button>
        </Card>
        <Card title="War">
          {own.war ? (
            <>
              <p>At war with {factions.find((f) => f.id === own.war!.opponentFactionId)?.name ?? 'unknown fleet'}</p>
              <p>
                Ends in <Timer target={own.war.endsAt} onComplete={loadFactions} />
              </p>
              <button className="btn-primary" onClick={contribute} disabled={character.resources.fuel < 1}>
                Contribute 15 Fuel
              </button>
            </>
          ) : isLeader ? (
            <>
              <select value={warTarget} onChange={(e) => setWarTarget(e.target.value)}>
                <option value="">Choose a target fleet…</option>
                {factions
                  .filter((f) => f.id !== own.id)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
              </select>
              <button className="btn-primary" onClick={declareWar} disabled={!warTarget}>
                Declare War
              </button>
            </>
          ) : (
            <p className="muted">No active war. Only the leader can declare one.</p>
          )}
        </Card>
      </div>
      <Card title="Fleet Chat">
        <div className="chat-log">
          {messages.map((m) => (
            <p key={m.id}>
              <strong>{m.authorCallsign}:</strong> {m.body}
            </p>
          ))}
          {messages.length === 0 && <p className="muted">No messages yet.</p>}
        </div>
        <form onSubmit={sendChat} className="button-row">
          <input value={chatBody} onChange={(e) => setChatBody(e.target.value)} placeholder="Say something…" />
          <button className="btn-primary" type="submit">
            Send
          </button>
        </form>
      </Card>
    </div>
  );
}
