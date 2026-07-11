import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { StatBlock } from '../components/StatBlock';
import { Timer } from '../components/Timer';
import { LocationGlyph } from '../components/LocationGlyph';
import { Icon } from '../icons/Icon';
import type { Character, SalvageEventSummary } from '../types';

function xpToNextLevel(level: number): number {
  return Math.round(50 * Math.pow(level, 1.5));
}

function SalvageEventCard() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [event, setEvent] = useState<SalvageEventSummary | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => api.get<{ event: SalvageEventSummary | null }>('/salvage/current').then((d) => setEvent(d.event));

  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const start = async () => {
    setBusy(true);
    try {
      await api.post('/salvage/start');
      await load();
      pushToast('Derelict Salvage event started!', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not start event', 'danger');
    } finally {
      setBusy(false);
    }
  };

  const contribute = async () => {
    if (!event) return;
    setBusy(true);
    try {
      const data = await api.post<{ character: Character }>(`/salvage/${event.id}/contribute`, { amount: 10 });
      setCharacter(data.character);
      await load();
      pushToast('Committed 10 Fuel to the salvage effort.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Contribution failed', 'danger');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card
      title={
        <span className="card-title-with-icon">
          <Icon name="contraband" size={16} />
          Derelict Salvage
        </span>
      }
    >
      {event ? (
        <>
          <p>
            A derelict is being salvaged — ends in <Timer target={event.endsAt} onComplete={load} />.
          </p>
          <p>Total Fuel committed: {Math.round(event.totalFuel)}</p>
          <button className="btn-primary" disabled={busy} onClick={contribute}>
            Commit 10 Fuel
          </button>
        </>
      ) : (
        <>
          <p className="muted">No derelict currently detected. Anyone can start a salvage run.</p>
          <button className="btn-primary" disabled={busy} onClick={start}>
            Start Salvage Event
          </button>
        </>
      )}
    </Card>
  );
}

export function Dashboard() {
  const { character, refresh } = useAuth();
  const { locationName } = useReferenceData();
  if (!character) return null;

  const need = xpToNextLevel(character.level);
  const pct = Math.min(100, (character.xp / need) * 100);

  return (
    <div className="screen">
      <h1 className="screen-title">Welcome back, {character.callsign}</h1>
      <div className="grid two-col">
        <Card title="Pilot Status">
          <div className="location-header">
            <LocationGlyph seed={character.locationId} size={30} />
            <p>
              Location: <strong>{locationName(character.locationId)}</strong>
            </p>
          </div>
          <p>
            Status: <strong>{character.status}</strong>
            {character.statusUntil && character.status !== 'ok' && (
              <>
                {' '}
                (<Timer target={character.statusUntil} onComplete={refresh} /> remaining)
              </>
            )}
          </p>
          <p>
            Level {character.level} — {character.xp}/{need} XP
          </p>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>
          <p>
            <Icon name="credits" size={15} /> Credits: {character.credits.toLocaleString()}
          </p>
        </Card>
        <Card title="Combat Profile">
          <StatBlock stats={character.effectiveStats} baseStats={character.stats} />
        </Card>
      </div>
      <SalvageEventCard />
      <Card title="What to do next" className="tips">
        <ul>
          <li>Spend Fuel in the Training Bay to raise your stats.</li>
          <li>Run Ops around the sprawl for credits — mind the jail risk.</li>
          <li>Gear up at the Trade Hub, then look for a fight in Combat.</li>
          <li>Travel to unlock location-exclusive Ops and gear.</li>
          <li>Join or found a Fleet for backup, a shared bank, and fleet wars.</li>
        </ul>
      </Card>
    </div>
  );
}
