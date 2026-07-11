import { useEffect, useState } from 'react';

function format(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function Timer({ target, onComplete }: { target: number; onComplete?: () => void }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now >= target) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, target]);

  return <span className="timer">{format(target - now)}</span>;
}
