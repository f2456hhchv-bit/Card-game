import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import type { PublicCharacter } from '../types';

export function Hospital() {
  const { character, refresh } = useAuth();
  const { pushToast } = useToast();
  const [patients, setPatients] = useState<PublicCharacter[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => api.get<{ patients: PublicCharacter[] }>('/hospital').then((d) => setPatients(d.patients));

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (!character) return null;

  const assist = async (target: PublicCharacter) => {
    setBusy(target.id);
    try {
      const data = await api.post<{ released: boolean }>(`/hospital/${target.id}/medic-assist`);
      pushToast(
        data.released ? `${target.callsign} is back on their feet!` : `Sped up ${target.callsign}'s recovery.`,
        'success',
      );
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Medic assist failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const others = patients.filter((c) => c.id !== character.id);

  return (
    <div className="screen">
      <h1 className="screen-title">Medbay</h1>
      {character.status === 'hospital' && character.statusUntil && (
        <div className="banner banner-warning">
          You're recovering — <Timer target={character.statusUntil} onComplete={refresh} /> remaining. A fleet-mate can
          speed this up.
        </div>
      )}
      <p className="muted">Fleet-mates can spend a Medic Assist (cooldown-limited) to speed a member's recovery.</p>
      <div className="grid two-col">
        {others.map((patient) => (
          <Card key={patient.id} title={patient.callsign}>
            <p>Level {patient.level}</p>
            {patient.statusUntil && <p>Discharged in <Timer target={patient.statusUntil} onComplete={load} /></p>}
            <button
              className="btn-primary"
              disabled={!character.factionId || character.factionId !== patient.factionId || busy !== null}
              onClick={() => assist(patient)}
            >
              {busy === patient.id ? 'Assisting…' : 'Medic Assist'}
            </button>
            {(!character.factionId || character.factionId !== patient.factionId) && (
              <p className="muted small">Only fleet-mates can assist.</p>
            )}
          </Card>
        ))}
        {others.length === 0 && <p className="muted">The Medbay is empty.</p>}
      </div>
    </div>
  );
}
