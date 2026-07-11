import { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Icon } from '../icons/Icon';
import type { AchievementView, Character } from '../types';

export function Achievements() {
  const { setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [achievements, setAchievements] = useState<AchievementView[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => api.get<{ achievements: AchievementView[] }>('/achievements').then((d) => setAchievements(d.achievements));

  useEffect(() => {
    load();
  }, []);

  const claim = async (id: string) => {
    setBusy(id);
    try {
      const data = await api.post<{ character: Character; reward: number }>(`/achievements/${id}/claim`);
      setCharacter(data.character);
      pushToast(`Claimed +${data.reward} credits.`, 'success');
      load();
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Could not claim', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const claimedCount = achievements.filter((a) => a.claimed).length;

  return (
    <div className="screen">
      <h1 className="screen-title">Achievements</h1>
      <p className="muted">
        {claimedCount}/{achievements.length} claimed. Every one is unlocked by something you actually did — training,
        trading, exploring, building, fighting.
      </p>
      <div className="grid three-col">
        {achievements.map((a) => (
          <Card
            key={a.id}
            title={
              <span className="card-title-with-icon">
                <Icon name="achievement" size={16} />
                {a.name}
              </span>
            }
          >
            <p className="muted small">{a.description}</p>
            <p className="small">
              <Icon name="credits" size={13} /> {a.reward.toLocaleString()} cr
            </p>
            {a.claimed ? (
              <p className="small muted">Claimed ✓</p>
            ) : a.unlocked ? (
              <button className="btn-primary" disabled={busy !== null} onClick={() => claim(a.id)}>
                {busy === a.id ? 'Claiming…' : 'Claim'}
              </button>
            ) : (
              <p className="small warn">Not yet unlocked</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
