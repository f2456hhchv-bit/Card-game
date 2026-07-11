import { Icon } from '../icons/Icon';

export function ResourceBar({
  label,
  value,
  max,
  variant,
}: {
  label: string;
  value: number;
  max: number;
  variant: 'fuel' | 'resolve' | 'morale' | 'health';
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`resource-bar resource-${variant}`}>
      <div className="resource-bar-label">
        <span className="resource-bar-name">
          <Icon name={variant} size={14} />
          {label}
        </span>
        <span>
          {Math.round(value)}/{max}
        </span>
      </div>
      <div className="resource-bar-track">
        <div className="resource-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
