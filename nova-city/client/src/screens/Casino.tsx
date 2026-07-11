import { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { api, ApiError } from '../api/client';
import { Card } from '../components/Card';
import { Icon } from '../icons/Icon';
import type { Character, CoinFlipResult, SlotResult } from '../types';

const SYMBOL_GLYPH: Record<string, string> = { void: '◈', ember: '◉', ion: '◆', nova: '★' };

export function Casino() {
  const { character, setCharacter } = useAuth();
  const { pushToast } = useToast();
  const [slotBet, setSlotBet] = useState(50);
  const [flipBet, setFlipBet] = useState(50);
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [slotResult, setSlotResult] = useState<SlotResult | null>(null);
  const [flipResult, setFlipResult] = useState<CoinFlipResult | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  if (!character) return null;

  const spin = async () => {
    setBusy('slots');
    try {
      const data = await api.post<{ character: Character; result: SlotResult }>('/casino/slots', { bet: slotBet });
      setCharacter(data.character);
      setSlotResult(data.result);
      pushToast(
        data.result.payout > 0 ? `The reels pay out ${data.result.payout} credits!` : 'No match — the house keeps it.',
        data.result.payout > 0 ? 'success' : 'info',
      );
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Spin failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  const flip = async () => {
    setBusy('flip');
    try {
      const data = await api.post<{ character: Character; result: CoinFlipResult }>('/casino/coinflip', {
        bet: flipBet,
        choice,
      });
      setCharacter(data.character);
      setFlipResult(data.result);
      pushToast(
        data.result.won ? `It's ${data.result.result} — you win ${data.result.payout} credits!` : `It's ${data.result.result} — you lose.`,
        data.result.won ? 'success' : 'danger',
      );
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : 'Flip failed', 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Casino</h1>
      <p className="muted">
        Burn some credits on a game of chance. Bets are 10–5,000 credits, and losses don't cost anything but the bet.
      </p>

      <div className="grid two-col">
        <Card
          title={
            <span className="card-title-with-icon">
              <Icon name="casino" size={16} />
              Reels of the Hollow
            </span>
          }
        >
          <p className="muted small">Match all three reels for a big payout, two for a small one.</p>
          {slotResult && (
            <div className="slot-reels">
              {slotResult.reels.map((s, i) => (
                <div key={i} className="slot-reel">
                  {SYMBOL_GLYPH[s] ?? s}
                </div>
              ))}
            </div>
          )}
          <div className="bet-row">
            <input
              type="number"
              min={10}
              max={5000}
              value={slotBet}
              onChange={(e) => setSlotBet(Math.max(10, Math.min(5000, Number(e.target.value) || 0)))}
            />
            <span className="small muted">credits</span>
          </div>
          <button
            className="btn-primary"
            disabled={busy !== null || slotBet > character.credits}
            onClick={spin}
          >
            {busy === 'slots' ? 'Spinning…' : 'Spin'}
          </button>
        </Card>

        <Card
          title={
            <span className="card-title-with-icon">
              <Icon name="credits" size={16} />
              Double or Nothing
            </span>
          }
        >
          <p className="muted small">Call the flip. Win pays out 1.9x your bet.</p>
          {flipResult && (
            <p className={flipResult.won ? 'small' : 'small warn'}>
              Result: <strong>{flipResult.result}</strong> — {flipResult.won ? `+${flipResult.payout} cr` : 'no payout'}
            </p>
          )}
          <div className="button-row">
            <button
              className={choice === 'heads' ? 'btn-primary' : 'btn-ghost'}
              onClick={() => setChoice('heads')}
            >
              Heads
            </button>
            <button
              className={choice === 'tails' ? 'btn-primary' : 'btn-ghost'}
              onClick={() => setChoice('tails')}
            >
              Tails
            </button>
          </div>
          <div className="bet-row">
            <input
              type="number"
              min={10}
              max={5000}
              value={flipBet}
              onChange={(e) => setFlipBet(Math.max(10, Math.min(5000, Number(e.target.value) || 0)))}
            />
            <span className="small muted">credits</span>
          </div>
          <button
            className="btn-primary"
            disabled={busy !== null || flipBet > character.credits}
            onClick={flip}
          >
            {busy === 'flip' ? 'Flipping…' : 'Flip'}
          </button>
        </Card>
      </div>
    </div>
  );
}
