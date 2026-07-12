import { Icon } from '../icons/Icon';
import type { ItemType } from '../types';

// tier 1 is unadorned; tiers 2-5 get a progressively hotter rarity ring.
const TIER_RING_HUE: Record<number, string> = { 2: '190', 3: '265', 4: '30', 5: '48' };

export function ItemTitle({ type, name, tier = 1 }: { type: ItemType; name: string; tier?: number }) {
  const ringHue = TIER_RING_HUE[Math.min(5, Math.max(1, tier))];
  return (
    <span className="card-title-with-icon">
      <span
        className="item-rarity-ring"
        style={ringHue ? { boxShadow: `0 0 0 1.5px hsl(${ringHue} 80% 62%), 0 0 8px hsl(${ringHue} 80% 55% / 0.6)` } : undefined}
      >
        <Icon name={type} size={16} />
      </span>
      {name}
    </span>
  );
}
