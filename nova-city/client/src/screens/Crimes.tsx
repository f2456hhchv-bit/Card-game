import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import type { Character, Crime } from '../types';

export function Crimes() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ crimes: Crime[] }>('/crimes').then((d) => setCrimes(d.crimes));
  }, [character?.locationId]);

  if (!character) return null;
  const locked = character.status !== 'ok';

  const attempt = async (crime: Crime) => {
    setBusy(crime.id);
    try {
      const data = await api.post<{ character: Character; result: { success: boolean; reward: number; jailMinutes: number } }>(
        `/crimes/${crime.id}/attempt`,
      );
      setCharacter(data.character);
      if (data.result.success) {
        pushToast(`${crime.name}: success! +${data.result.reward} credits`, 'success');
      } else {
        pushToast(
          data.result.jailMinutes > 0
            ? `${crime.name}: caught! ${data.result.jailMinutes}m in the Brig.`
            : `${crime.name}: failed.`,
          'danger',
        );
      }
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Crime attempt failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Ops</h1>
      {locked && <div className="banner banner-warning">You can't run Ops while {character.status}.</div>}
      <div className="grid two-col">
        {crimes.map((crime) => (
          <Card key={crime.id} title={crime.name}>
            <p className="muted">{crime.flavor}</p>
            <p>Success chance: {Math.round(crime.chance * 100)}%</p>
            <p>
              Reward: {crime.minReward}–{crime.maxReward} credits · Fuel: {crime.fuelCost} · Jail risk:{' '}
              {crime.jailMinutes}m
            </p>
            <button
              className="btn-primary"
              disabled={locked || busy !== null || character.resources.fuel < crime.fuelCost}
              onClick={() => attempt(crime)}
            >
              {busy === crime.id ? 'Running…' : 'Attempt'}
            </button>
          </Card>
        ))}
        {crimes.length === 0 && <p className="muted">No Ops available here right now.</p>}
      </div>
    </div>
  );
}
