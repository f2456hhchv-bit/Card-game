import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Icon } from '../icons/Icon';
import { SectorGlyph } from '../components/SectorGlyph';
import type { Character, FleetSummary, OwnedStation, SectorAttackOutcome, SectorView, Ship, ShipClass } from '../types';

export function Galaxy() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [ships, setShips] = useState<Ship[]>([]);
  const [catalog, setCatalog] = useState<ShipClass[]>([]);
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [sectors, setSectors] = useState<SectorView[]>([]);
  const [stations, setStations] = useState<OwnedStation[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastOutcome, setLastOutcome] = useState<{ sectorName: string; outcome: SectorAttackOutcome } | null>(null);

  const loadFleet = () =>
    api
      .get<{ ships: Ship[]; summary: FleetSummary; catalog: ShipClass[] }>('/fleet')
      .then((d) => {
        setShips(d.ships);
        setSummary(d.summary);
        setCatalog(d.catalog);
      });
  const loadSectors = () => api.get<{ sectors: SectorView[] }>('/galaxy').then((d) => setSectors(d.sectors));
  const loadStations = () => api.get<{ stations: OwnedStation[] }>('/stations').then((d) => setStations(d.stations));

  useEffect(() => {
    loadFleet();
    loadSectors();
    loadStations();
    const id = setInterval(() => {
      loadSectors();
      loadStations();
    }, 15000);
    return () => clearInterval(id);
  }, []);

  if (!character) return null;

  const run = async <T,>(key: string, action: () => Promise<T>) => {
    setBusy(key);
    try {
      return await action();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Action failed', 'danger');
      return null;
    } finally {
      setBusy(null);
    }
  };

  const buyShip = (shipClass: ShipClass) =>
    run(`buy-${shipClass.id}`, async () => {
      const data = await api.post<{ character: Character }>('/fleet/ships', { shipClassId: shipClass.id });
      setCharacter(data.character);
      pushToast(`${shipClass.name} added to your fleet.`, 'success');
      await loadFleet();
    });

  const scout = (sector: SectorView) =>
    run(`scout-${sector.id}`, async () => {
      const data = await api.post<{ character: Character }>(`/galaxy/${sector.id}/scout`);
      setCharacter(data.character);
      pushToast(`Scouted ${sector.name}.`, 'success');
      await loadSectors();
    });

  const attack = (sector: SectorView) =>
    run(`attack-${sector.id}`, async () => {
      const data = await api.post<{ character: Character; outcome: SectorAttackOutcome }>(`/galaxy/${sector.id}/attack`);
      setCharacter(data.character);
      setLastOutcome({ sectorName: sector.name, outcome: data.outcome });
      pushToast(
        data.outcome.cleared
          ? `${sector.name} cleared! You can build or plunder now.`
          : data.outcome.outmatched
            ? `Outmatched at ${sector.name} — took damage.`
            : `Dealt ${Math.round(data.outcome.damageDealt)} damage at ${sector.name}.`,
        data.outcome.cleared ? 'success' : data.outcome.outmatched ? 'danger' : 'info',
      );
      await loadSectors();
    });

  const buildStation = (sector: SectorView) =>
    run(`build-${sector.id}`, async () => {
      const data = await api.post<{ character: Character }>(`/galaxy/${sector.id}/build-station`);
      setCharacter(data.character);
      pushToast(`Station built at ${sector.name}.`, 'success');
      await Promise.all([loadSectors(), loadStations()]);
    });

  const plunder = (sector: SectorView) =>
    run(`plunder-${sector.id}`, async () => {
      const data = await api.post<{ character: Character; payout: number }>(`/galaxy/${sector.id}/plunder`);
      setCharacter(data.character);
      pushToast(`Plundered ${sector.name} for ${data.payout} credits.`, 'danger');
      await loadSectors();
    });

  const collectStation = (station: OwnedStation) =>
    run(`collect-${station.id}`, async () => {
      const data = await api.post<{ character: Character; collected: number }>(`/stations/${station.id}/collect`);
      setCharacter(data.character);
      pushToast(`Collected ${data.collected} credits.`, 'success');
      await loadStations();
    });

  return (
    <div className="screen">
      <h1 className="screen-title">Galaxy Command</h1>

      <div className="grid two-col">
        <Card
          title={
            <span className="card-title-with-icon">
              <Icon name="ship" size={16} />
              Fleet
            </span>
          }
        >
          {summary && (
            <div className="fleet-stats">
              <span>{summary.shipCount} ships</span>
              <span>{summary.firepower} firepower</span>
              <span>{summary.shieldHP} shields</span>
              <span>{summary.crewCapacity} crew capacity</span>
            </div>
          )}
          <div className="ship-roster">
            {ships.map((s) => (
              <div key={s.id} className="ship-row">
                <strong>{s.name}</strong>
                <span className="muted small">
                  {s.shipClass?.name} · {s.shipClass?.firepower} fp
                </span>
              </div>
            ))}
            {ships.length === 0 && <p className="muted">No ships yet.</p>}
          </div>
        </Card>
        <Card
          title={
            <span className="card-title-with-icon">
              <Icon name="alignment" size={16} />
              Command Profile
            </span>
          }
        >
          <p>
            Rank: <strong>{character.commandRank}</strong>
          </p>
          <p>
            Alignment: <strong>{character.alignmentLabel}</strong> ({character.alignment})
          </p>
          <div className="alignment-track">
            <div className="alignment-marker" style={{ left: `${((character.alignment + 100) / 200) * 100}%` }} />
          </div>
          <p className="small muted">
            {character.stationCount} stations · {character.sectorsControlled} sectors controlled
          </p>
        </Card>
      </div>

      <h2 className="section-title">
        <Icon name="ship" size={14} /> Shipyard
      </h2>
      <div className="grid three-col">
        {catalog.map((cls) => (
          <Card key={cls.id} title={cls.name}>
            <p className="muted small">{cls.flavor}</p>
            <p className="small">
              {cls.firepower} firepower · {cls.shieldHP} shields · {cls.crewCapacity} crew
            </p>
            <p>{cls.price.toLocaleString()} cr</p>
            <button
              className="btn-primary"
              disabled={busy !== null || character.credits < cls.price}
              onClick={() => buyShip(cls)}
            >
              {busy === `buy-${cls.id}` ? 'Building…' : 'Build'}
            </button>
          </Card>
        ))}
      </div>

      {stations.length > 0 && (
        <>
          <h2 className="section-title">
            <Icon name="station" size={14} /> My Stations
          </h2>
          <div className="grid three-col">
            {stations.map((st) => (
              <Card key={st.id} title={st.sector?.name ?? 'Station'}>
                <p className="small">Tier {st.tier}</p>
                <p>{Math.round(st.credits).toLocaleString()} cr accrued</p>
                <button className="btn-primary" disabled={busy !== null} onClick={() => collectStation(st)}>
                  {busy === `collect-${st.id}` ? 'Collecting…' : 'Collect'}
                </button>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">
        <Icon name="galaxy" size={14} /> Sector Map
      </h2>
      <p className="muted">
        The Hollow's grip grows the longer a sector goes unchecked. Clear one, then choose: build a station
        (steady income, raises your standing) or plunder it (a quick payout that costs you standing).
      </p>
      <div className="grid two-col">
        {sectors.map((sector) => {
          const presence =
            sector.explored && sector.maxAlienStrength ? (sector.alienStrength ?? 0) / sector.maxAlienStrength : null;
          return (
            <Card key={sector.id} className="sector-card">
              <div className="location-header">
                <SectorGlyph seed={sector.id} presence={presence} />
                <h3 className="card-title">{sector.name}</h3>
              </div>
              <p className="muted small">{sector.flavor}</p>
              {sector.explored ? (
                <>
                  {!sector.cleared && sector.maxAlienStrength && (
                    <div className="resource-bar-track sector-strength-track">
                      <div
                        className="resource-bar-fill sector-strength-fill"
                        style={{ width: `${((sector.alienStrength ?? 0) / sector.maxAlienStrength) * 100}%` }}
                      />
                    </div>
                  )}
                  <p className="small">
                    {sector.plundered
                      ? 'Plundered — no station possible here.'
                      : sector.hasStation
                        ? sector.controlledByMe
                          ? 'You control this sector.'
                          : 'Claimed by another commander.'
                        : sector.cleared
                          ? 'Cleared — ready to build or plunder.'
                          : `Hollow presence: ${Math.round(sector.alienStrength ?? 0)}/${sector.maxAlienStrength}`}
                  </p>
                  <div className="button-row">
                    {!sector.cleared && (
                      <button
                        className="btn-primary"
                        disabled={busy !== null || character.status !== 'ok' || character.resources.fuel < 15}
                        onClick={() => attack(sector)}
                      >
                        {busy === `attack-${sector.id}` ? 'Attacking…' : 'Attack (15 Fuel)'}
                      </button>
                    )}
                    {sector.cleared && !sector.hasStation && !sector.plundered && (
                      <>
                        <button
                          className="btn-primary"
                          disabled={busy !== null || character.credits < sector.stationPrice}
                          onClick={() => buildStation(sector)}
                        >
                          Build ({sector.stationPrice.toLocaleString()} cr)
                        </button>
                        <button className="btn-ghost" disabled={busy !== null} onClick={() => plunder(sector)}>
                          Plunder
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <button
                  className="btn-secondary"
                  disabled={busy !== null || character.resources.fuel < sector.scoutFuelCost}
                  onClick={() => scout(sector)}
                >
                  {busy === `scout-${sector.id}` ? 'Scouting…' : `Scout (${sector.scoutFuelCost} Fuel)`}
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {lastOutcome && (
        <Card title="Last engagement">
          <p>
            {lastOutcome.sectorName}: dealt {Math.round(lastOutcome.outcome.damageDealt)} damage
            {lastOutcome.outcome.outmatched && ' — outmatched, took Health damage'}
            {lastOutcome.outcome.cleared && ' — sector cleared!'}
          </p>
        </Card>
      )}
    </div>
  );
}
