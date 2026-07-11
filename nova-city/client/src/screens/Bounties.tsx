import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Icon } from '../icons/Icon';
import type { Bounty, Character, LeaderboardRow } from '../types';

export function Bounties() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [pilots, setPilots] = useState<LeaderboardRow[]>([]);
  const [targetId, setTargetId] = useState('');
  const [amount, setAmount] = useState(100);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.get<{ bounties: Bounty[] }>('/bounties').then((d) => setBounties(d.bounties));
    api.get<{ leaderboard: LeaderboardRow[] }>('/leaderboard').then((d) => setPilots(d.leaderboard));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  if (!character) return null;
  const otherPilots = pilots.filter((p) => p.id !== character.id);

  const placeBounty = async () => {
    if (!targetId) {
      pushToast('Choose a pilot first', 'danger');
      return;
    }
    setBusy(true);
    try {
      const data = await api.post<{ character: Character }>('/bounties', { targetCharacterId: targetId, amount });
      setCharacter(data.character);
      pushToast('Bounty placed.', 'success');
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not place bounty', 'danger');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Bounty Board</h1>
      <p className="muted">
        Place a credit bounty on any pilot. Whoever beats them in Combat collects every active bounty on that target
        automatically.
      </p>

      <Card
        title={
          <span className="card-title-with-icon">
            <Icon name="bounty" size={16} />
            Place a Bounty
          </span>
        }
      >
        <div className="bet-row">
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
            <option value="">Choose a pilot…</option>
            {otherPilots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.callsign} (Lv {p.level})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={50}
            value={amount}
            onChange={(e) => setAmount(Math.max(50, Number(e.target.value) || 0))}
          />
          <span className="small muted">credits</span>
        </div>
        <button className="btn-primary" disabled={busy || amount > character.credits} onClick={placeBounty}>
          {busy ? 'Placing…' : 'Place Bounty'}
        </button>
      </Card>

      <h2 className="section-title">
        <Icon name="bounty" size={14} /> Active Bounties
      </h2>
      <div className="grid three-col">
        {bounties.map((b) => (
          <Card key={b.id} title={b.targetCallsign}>
            <p className="small">
              <Icon name="credits" size={13} /> {b.amount.toLocaleString()} cr
            </p>
            <p className="small muted">Placed by {b.placedByCallsign}</p>
          </Card>
        ))}
        {bounties.length === 0 && <p className="muted">No active bounties. Be the first to put one up.</p>}
      </div>
    </div>
  );
}
