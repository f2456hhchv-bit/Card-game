import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import type { Character } from '../types';

export function Travel() {
  const { character, setCharacter, refresh } = useAuth();
  const { pushToast } = useToast();
  const { locations } = useReferenceData();
  const [busy, setBusy] = useState<string | null>(null);

  if (!character) return null;
  const locked = character.status !== 'ok';

  const travel = async (locationId: string) => {
    setBusy(locationId);
    try {
      const data = await api.post<{ character: Character; travelMinutes: number }>(`/travel/${locationId}/travel`);
      setCharacter(data.character);
      pushToast(`Departed — arriving in ${data.travelMinutes}m.`, 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Travel failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Travel</h1>
      {character.status === 'transit' && character.statusUntil && (
        <div className="banner banner-info">
          In transit — arriving in <Timer target={character.statusUntil} onComplete={refresh} />.
        </div>
      )}
      {locked && character.status !== 'transit' && (
        <div className="banner banner-warning">You can't travel while {character.status}.</div>
      )}
      <div className="grid two-col">
        {locations.map((loc) => {
          const here = loc.id === character.locationId;
          return (
            <Card key={loc.id} title={loc.name}>
              <p className="muted">{loc.flavor}</p>
              {here ? (
                <p className="small">You are here.</p>
              ) : (
                <button className="btn-primary" disabled={locked || busy !== null} onClick={() => travel(loc.id)}>
                  {busy === loc.id ? 'Departing…' : 'Travel'}
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
