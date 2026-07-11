import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import type { Character, PublicCharacter } from '../types';

interface AttackResult {
  character: Character;
  won: boolean;
  salvage: number;
  hospitalMinutes: number;
  outcome: { log: string[] };
}

export function Combat() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [targets, setTargets] = useState<PublicCharacter[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AttackResult | null>(null);

  const load = () => api.get<{ targets: PublicCharacter[] }>('/combat/targets').then((d) => setTargets(d.targets));

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [character?.locationId]);

  if (!character) return null;
  const locked = character.status !== 'ok';

  const attack = async (target: PublicCharacter) => {
    setBusy(target.id);
    try {
      const data = await api.post<AttackResult>(`/combat/${target.id}/attack`);
      setCharacter(data.character);
      setLastResult(data);
      pushToast(
        data.won ? `You beat ${target.callsign}! +${data.salvage} credits salvage.` : `You lost to ${target.callsign}.`,
        data.won ? 'success' : 'danger',
      );
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Attack failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Combat</h1>
      {locked && <div className="banner banner-warning">You can't attack while {character.status}.</div>}
      <p className="muted">Attacking costs 20 Resolve. Only pilots at your current location can be targeted.</p>
      <div className="grid two-col">
        {targets.map((target) => (
          <Card key={target.id} title={target.callsign}>
            <p>Level {target.level}</p>
            <button
              className="btn-primary"
              disabled={locked || busy !== null || character.resources.resolve < 20}
              onClick={() => attack(target)}
            >
              {busy === target.id ? 'Attacking…' : 'Attack'}
            </button>
          </Card>
        ))}
        {targets.length === 0 && <p className="muted">No one else is here right now.</p>}
      </div>
      {lastResult && (
        <Card title="Last engagement log">
          {lastResult.outcome.log.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </Card>
      )}
    </div>
  );
}
