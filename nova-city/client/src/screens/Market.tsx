import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { ItemTitle } from '../components/ItemTitle';
import { Icon } from '../icons/Icon';
import type { Character, ItemType } from '../types';

const TYPE_LABEL: Record<ItemType, string> = {
  weapon: 'Weapons',
  armor: 'Armor',
  consumable: 'Consumables',
  contraband: 'Contraband',
};

export function Market() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const { items } = useReferenceData();
  const [busy, setBusy] = useState<string | null>(null);

  if (!character) return null;

  const trainedStats =
    character.stats.strength + character.stats.defense + character.stats.speed + character.stats.dexterity;

  const buy = async (itemId: string) => {
    setBusy(itemId);
    try {
      const data = await api.post<{ character: Character }>('/market/buy', { itemId, qty: 1 });
      setCharacter(data.character);
      pushToast('Purchased.', 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Purchase failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const byType = (type: ItemType) => items.filter((i) => i.type === type);

  const contrabandLocked = character.tradeRank !== 'Black Market Contact' && character.tradeRank !== 'Master Trader';

  return (
    <div className="screen">
      <h1 className="screen-title">Trade Hub</h1>
      <p className="muted">
        Trader Rank: <strong>{character.tradeRank}</strong> ({character.tradesCompleted} trades) — higher ranks sell
        for more and unlock contraband.
      </p>
      {(Object.keys(TYPE_LABEL) as ItemType[]).map((type) => (
        <div key={type}>
          <h2 className="section-title">
            <Icon name={type} size={14} /> {TYPE_LABEL[type]}
          </h2>
          <div className="grid three-col">
            {byType(type).map((item) => {
              const statLocked = Boolean(item.requiredTotalStats && trainedStats < item.requiredTotalStats);
              const blackMarketLocked = item.type === 'contraband' && contrabandLocked;
              const locked = statLocked || blackMarketLocked;
              return (
                <Card key={item.id} title={<ItemTitle type={item.type} name={item.name} tier={item.tier} />}>
                  <p className="muted">{item.flavor}</p>
                  {item.statBonus && (
                    <p className="small">
                      {Object.entries(item.statBonus)
                        .map(([stat, val]) => `+${val} ${stat}`)
                        .join(', ')}
                    </p>
                  )}
                  {item.decays && <p className="small warn">Value decays over time.</p>}
                  {item.certification && (
                    <p className={statLocked ? 'small warn' : 'small muted'}>
                      {item.certification} — {item.requiredTotalStats} total stats
                      {statLocked ? ` (you're at ${trainedStats})` : ' ✓'}
                    </p>
                  )}
                  {blackMarketLocked && <p className="small warn">Requires Black Market Contact trade rank</p>}
                  <p>{item.price.toLocaleString()} cr</p>
                  <button
                    className="btn-primary"
                    disabled={busy !== null || locked || character.credits < item.price}
                    onClick={() => buy(item.id)}
                  >
                    {busy === item.id ? 'Buying…' : locked ? 'Locked' : 'Buy'}
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
