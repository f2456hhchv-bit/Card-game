import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useReferenceData } from '../state/ReferenceDataContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { ItemTitle } from '../components/ItemTitle';
import { Icon } from '../icons/Icon';
import type { Character } from '../types';

export function Inventory() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const { item } = useReferenceData();
  const [busy, setBusy] = useState<string | null>(null);

  if (!character) return null;

  const run = async (key: string, path: string, body: unknown, successMsg: string) => {
    setBusy(key);
    try {
      const data = await api.post<{ character: Character; proceeds?: number }>(path, body);
      setCharacter(data.character);
      pushToast(data.proceeds ? `${successMsg} (+${data.proceeds} cr)` : successMsg, 'success');
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Action failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const stacks = character.inventory.filter((s) => s.qty > 0);

  return (
    <div className="screen">
      <h1 className="screen-title">Inventory</h1>
      <Card title="Equipped">
        <p>
          <Icon name="weapon" size={15} /> Weapon: {character.equippedWeaponId ? item(character.equippedWeaponId)?.name : 'None'}
        </p>
        <p>
          <Icon name="armor" size={15} /> Armor: {character.equippedArmorId ? item(character.equippedArmorId)?.name : 'None'}
        </p>
      </Card>
      <div className="grid three-col">
        {stacks.map((stack) => {
          const meta = item(stack.itemId);
          if (!meta) return null;
          const key = `${stack.itemId}-${stack.acquiredAt}`;
          return (
            <Card key={key} title={<ItemTitle type={meta.type} name={`${meta.name} ×${stack.qty}`} tier={meta.tier} />}>
              <p className="muted">{meta.flavor}</p>
              {meta.decays && <p className="small warn">Contraband — value decays over time.</p>}
              <div className="button-row">
                {(meta.type === 'weapon' || meta.type === 'armor') && (
                  <button
                    className="btn-secondary"
                    disabled={busy !== null}
                    onClick={() => run(key + '-equip', '/market/equip', { itemId: stack.itemId }, `Equipped ${meta.name}`)}
                  >
                    Equip
                  </button>
                )}
                {meta.type === 'consumable' && (
                  <button
                    className="btn-secondary"
                    disabled={busy !== null}
                    onClick={() => run(key + '-use', '/market/use', { itemId: stack.itemId }, `Used ${meta.name}`)}
                  >
                    Use
                  </button>
                )}
                <button
                  className="btn-ghost"
                  disabled={busy !== null}
                  onClick={() => run(key + '-sell', '/market/sell', { itemId: stack.itemId, qty: 1 }, `Sold ${meta.name}`)}
                >
                  Sell 1
                </button>
              </div>
            </Card>
          );
        })}
        {stacks.length === 0 && <p className="muted">Your hold is empty. Visit the Trade Hub.</p>}
      </div>
    </div>
  );
}
