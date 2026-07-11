import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/Card';
import type { LeaderboardRow } from '../types';

const SORTS: { key: string; label: string }[] = [
  { key: 'level', label: 'Level' },
  { key: 'netWorth', label: 'Net Worth' },
  { key: 'combatRating', label: 'Combat Rating' },
];

export function Leaderboard() {
  const [by, setBy] = useState('level');
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    api.get<{ leaderboard: LeaderboardRow[] }>(`/leaderboard?by=${by}`).then((d) => setRows(d.leaderboard));
  }, [by]);

  return (
    <div className="screen">
      <h1 className="screen-title">Leaderboard</h1>
      <div className="button-row">
        {SORTS.map((s) => (
          <button key={s.key} className={by === s.key ? 'btn-primary' : 'btn-secondary'} onClick={() => setBy(s.key)}>
            {s.label}
          </button>
        ))}
      </div>
      <Card>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Callsign</th>
              <th>Level</th>
              <th>Net Worth</th>
              <th>Combat Rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id}>
                <td>{i + 1}</td>
                <td>{row.callsign}</td>
                <td>{row.level}</td>
                <td>{row.netWorth.toLocaleString()}</td>
                <td>{row.combatRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
