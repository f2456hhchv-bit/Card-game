import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
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

  return (
    <div className="screen">
      <h1 className="screen-title">Trade Hub</h1>
      {(Object.keys(TYPE_LABEL) as ItemType[]).map((type) => (
        <div key={type}>
          <h2 className="section-title">{TYPE_LABEL[type]}</h2>
          <div className="grid three-col">
            {byType(type).map((item) => (
              <Card key={item.id} title={item.name}>
                <p className="muted">{item.flavor}</p>
                {item.statBonus && (
                  <p className="small">
                    {Object.entries(item.statBonus)
                      .map(([stat, val]) => `+${val} ${stat}`)
                      .join(', ')}
                  </p>
                )}
                {item.decays && <p className="small warn">Value decays over time.</p>}
                <p>{item.price.toLocaleString()} cr</p>
                <button
                  className="btn-primary"
                  disabled={busy !== null || character.credits < item.price}
                  onClick={() => buy(item.id)}
                >
                  {busy === item.id ? 'Buying…' : 'Buy'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
