import type { Stat } from '../types';
import { Icon } from '../icons/Icon';

const LABELS: Record<Stat, string> = {
  strength: 'Strength',
  defense: 'Defense',
  speed: 'Speed',
  dexterity: 'Dexterity',
};

export function StatBlock({ stats, baseStats }: { stats: Record<Stat, number>; baseStats?: Record<Stat, number> }) {
  return (
    <div className="stat-block">
      {(Object.keys(LABELS) as Stat[]).map((stat) => {
        const bonus = baseStats ? stats[stat] - baseStats[stat] : 0;
        return (
          <div key={stat} className="stat-row">
            <span className="stat-name">
              <Icon name={stat} size={15} />
              {LABELS[stat]}
            </span>
            <span className="stat-value">
              {Math.round(stats[stat])}
              {bonus > 0 && <span className="stat-bonus"> (+{Math.round(bonus)})</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
