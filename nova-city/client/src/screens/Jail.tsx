import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import type { Character, PublicCharacter } from '../types';

export function Jail() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [inmates, setInmates] = useState<PublicCharacter[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => api.get<{ inmates: PublicCharacter[] }>('/jail').then((d) => setInmates(d.inmates));

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (!character) return null;

  const spring = async (target: PublicCharacter) => {
    setBusy(target.id);
    try {
      const data = await api.post<{ character: Character }>(`/jail/${target.id}/spring`);
      setCharacter(data.character);
      pushToast(`Sprung ${target.callsign} from the Brig!`, 'success');
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Spring attempt failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const others = inmates.filter((c) => c.id !== character.id);

  return (
    <div className="screen">
      <h1 className="screen-title">The Brig</h1>
      {character.status === 'jail' && character.statusUntil && (
        <div className="banner banner-warning">
          You're locked up — <Timer target={character.statusUntil} /> remaining. A fleet-mate can spring you.
        </div>
      )}
      <p className="muted">Spend Resolve and credits to break another pilot out early.</p>
      <div className="grid two-col">
        {others.map((inmate) => (
          <Card key={inmate.id} title={inmate.callsign}>
            <p>Level {inmate.level}</p>
            {inmate.statusUntil && <p>Released in <Timer target={inmate.statusUntil} onComplete={load} /></p>}
            <button
              className="btn-primary"
              disabled={character.status !== 'ok' || busy !== null}
              onClick={() => spring(inmate)}
            >
              {busy === inmate.id ? 'Springing…' : 'Spring (15 Resolve, 50 cr)'}
            </button>
          </Card>
        ))}
        {others.length === 0 && <p className="muted">The Brig is empty.</p>}
      </div>
    </div>
  );
}
