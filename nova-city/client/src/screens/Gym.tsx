import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Icon } from '../icons/Icon';
import type { Character, Stat } from '../types';

const STATS: { key: Stat; label: string; blurb: string }[] = [
  { key: 'strength', label: 'Strength', blurb: 'Melee damage and boarding actions.' },
  { key: 'defense', label: 'Defense', blurb: 'Damage reduction when you take a hit.' },
  { key: 'speed', label: 'Speed', blurb: 'Evasion and getaway odds.' },
  { key: 'dexterity', label: 'Dexterity', blurb: 'Ranged accuracy and finesse crimes.' },
];

export function Gym() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [fuel, setFuel] = useState(20);
  const [busy, setBusy] = useState<Stat | null>(null);

  if (!character) return null;
  const locked = character.status !== 'ok';

  const train = async (stat: Stat) => {
    setBusy(stat);
    try {
      const data = await api.post<{ character: Character; gain: number }>('/gym/train', { stat, fuel });
      setCharacter(data.character);
      pushToast(`+${data.gain} ${stat}`, 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Training failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Training Bay</h1>
      {locked && <div className="banner banner-warning">You can't train while {character.status}.</div>}
      <Card>
        <label className="fuel-slider">
          Fuel to spend: {fuel}
          <input
            type="range"
            min={1}
            max={Math.min(50, Math.floor(character.resources.fuel))}
            value={fuel}
            onChange={(e) => setFuel(Number(e.target.value))}
          />
        </label>
      </Card>
      <div className="grid two-col">
        {STATS.map((s) => (
          <Card
            key={s.key}
            title={
              <span className="card-title-with-icon">
                <Icon name={s.key} size={16} />
                {s.label}
              </span>
            }
          >
            <p className="muted">{s.blurb}</p>
            <p>Current: {Math.round(character.stats[s.key])}</p>
            <button className="btn-primary" disabled={locked || busy !== null} onClick={() => train(s.key)}>
              {busy === s.key ? 'Training…' : `Train (${fuel} Fuel)`}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
