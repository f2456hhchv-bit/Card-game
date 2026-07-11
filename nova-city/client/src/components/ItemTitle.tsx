import { Icon } from '../icons/Icon';
import type { ItemType } from '../types';

export function ItemTitle({ type, name }: { type: ItemType; name: string }) {
  return (
    <span className="card-title-with-icon">
      <Icon name={type} size={16} />
      {name}
    </span>
  );
}
