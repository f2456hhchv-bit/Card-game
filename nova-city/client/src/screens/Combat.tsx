import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import { NpcPortrait } from '../components/NpcPortrait';
import { Icon } from '../icons/Icon';
import type { Bounty, Character, CombatTarget, NpcTarget, PlayerTarget } from '../types';

interface AttackResult {
  character: Character;
  won: boolean;
  hospitalMinutes: number;
  outcome: { log: string[] };
  salvage?: number;
  bountyPayout?: number;
  reward?: number;
  npc?: { name: string };
}

export function Combat() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [targets, setTargets] = useState<CombatTarget[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AttackResult | null>(null);

  const load = () => {
    api.get<{ targets: CombatTarget[] }>('/combat/targets').then((d) => setTargets(d.targets));
    api.get<{ bounties: Bounty[] }>('/bounties').then((d) => setBounties(d.bounties));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [character?.locationId]);

  const bountyOn = (targetCharacterId: string) =>
    bounties.filter((b) => b.targetCharacterId === targetCharacterId).reduce((sum, b) => sum + b.amount, 0);

  if (!character) return null;
  const locked = character.status !== 'ok';

  const attackPlayer = async (target: PlayerTarget) => {
    setBusy(target.id);
    try {
      const data = await api.post<AttackResult>(`/combat/${target.id}/attack`);
      setCharacter(data.character);
      setLastResult(data);
      const bountyNote = data.won && data.bountyPayout ? ` +${data.bountyPayout} credits bounty!` : '';
      pushToast(
        data.won
          ? `You beat ${target.callsign}! +${data.salvage} credits salvage.${bountyNote}`
          : `You lost to ${target.callsign}.`,
        data.won ? 'success' : 'danger',
      );
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Attack failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const attackNpc = async (target: NpcTarget) => {
    setBusy(target.id);
    try {
      const data = await api.post<AttackResult>(`/combat/npc/${target.id}/attack`);
      setCharacter(data.character);
      setLastResult(data);
      pushToast(
        data.won ? `Defeated ${target.name}! +${data.reward} credits.` : `${target.name} put you in the Medbay.`,
        data.won ? 'success' : 'danger',
      );
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Attack failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const npcTargets = targets.filter((t): t is NpcTarget => t.kind === 'npc');
  const playerTargets = targets.filter((t): t is PlayerTarget => t.kind === 'player');

  return (
    <div className="screen">
      <h1 className="screen-title">Combat</h1>
      {locked && <div className="banner banner-warning">You can't attack while {character.status}.</div>}
      <p className="muted">Attacking costs 20 Resolve. Only targets at your current location can be fought.</p>

      <h2 className="section-title">
        <Icon name="enemy" size={14} /> Hostiles
      </h2>
      <div className="grid two-col">
        {npcTargets.map((target) => (
          <Card
            key={target.id}
            title={
              <span className="card-title-with-icon">
                <NpcPortrait seed={target.id} tier={target.tier} size={26} />
                {target.name}
              </span>
            }
          >
            <p className="muted small">{target.flavor}</p>
            <p className="small">Tier {target.tier}</p>
            {target.defeated && target.respawnsAt ? (
              <p className="small muted">
                Recovering — back in <Timer target={target.respawnsAt} onComplete={load} />
              </p>
            ) : (
              <button
                className="btn-primary"
                disabled={locked || busy !== null || character.resources.resolve < 20}
                onClick={() => attackNpc(target)}
              >
                {busy === target.id ? 'Attacking…' : 'Attack'}
              </button>
            )}
          </Card>
        ))}
        {npcTargets.length === 0 && <p className="muted">No hostiles detected here.</p>}
      </div>

      <h2 className="section-title">Pilots</h2>
      <div className="grid two-col">
        {playerTargets.map((target) => (
          <Card key={target.id} title={target.callsign}>
            <p>Level {target.level}</p>
            {bountyOn(target.id) > 0 && (
              <p className="small warn">
                <Icon name="bounty" size={13} /> {bountyOn(target.id).toLocaleString()} cr bounty
              </p>
            )}
            <button
              className="btn-primary"
              disabled={locked || busy !== null || character.resources.resolve < 20}
              onClick={() => attackPlayer(target)}
            >
              {busy === target.id ? 'Attacking…' : 'Attack'}
            </button>
          </Card>
        ))}
        {playerTargets.length === 0 && <p className="muted">No other pilots are here right now.</p>}
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
