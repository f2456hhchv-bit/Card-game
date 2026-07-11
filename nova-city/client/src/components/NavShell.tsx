import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useNovaSocket } from '../api/ws';
import { ResourceBar } from './ResourceBar';
import { Timer } from './Timer';
import type { WsEvent } from '../types';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/gym', label: 'Training Bay' },
  { to: '/crimes', label: 'Ops' },
  { to: '/combat', label: 'Combat' },
  { to: '/jail', label: 'Brig' },
  { to: '/hospital', label: 'Medbay' },
  { to: '/market', label: 'Trade Hub' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/travel', label: 'Travel' },
  { to: '/faction', label: 'Fleet' },
  { to: '/mail', label: 'Mail' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

const STATUS_LABEL: Record<string, string> = {
  ok: 'Active',
  jail: 'In the Brig',
  hospital: 'In the Medbay',
  transit: 'In Transit',
};

export function NavShell() {
  const { character, token, refresh, logout } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const handleEvent = useCallback(
    (event: WsEvent) => {
      switch (event.type) {
        case 'attacked':
          pushToast(
            `${event.attackerCallsign} attacked you — you ${event.won ? 'held them off!' : 'lost and were sent to the Medbay.'}`,
            event.won ? 'success' : 'danger',
          );
          refresh();
          break;
        case 'jail-sprung':
          pushToast(`${event.byCallsign} sprung you from the Brig!`, 'success');
          refresh();
          break;
        case 'jail-released':
        case 'hospital-released':
          pushToast('You are back on your feet.', 'success');
          refresh();
          break;
        case 'medic-assist':
          pushToast(`${event.byCallsign} sped up your recovery by ${event.minutesRemoved}m.`, 'success');
          refresh();
          break;
        case 'mail':
          pushToast(`New mail from ${event.fromCallsign}: ${event.subject}`);
          break;
        case 'faction-message':
          pushToast(`[Fleet] ${event.authorCallsign}: ${event.body}`);
          break;
        case 'faction-war-update':
          pushToast(event.message, 'info');
          break;
        case 'salvage-event-started':
          pushToast('A derelict has been spotted — Salvage event started!', 'info');
          break;
        case 'salvage-event-resolved':
          pushToast('The salvage event concluded and payouts were distributed.', 'success');
          refresh();
          break;
        default:
          break;
      }
    },
    [pushToast, refresh],
  );

  useNovaSocket(token, handleEvent);

  useEffect(() => {
    const id = setInterval(() => refresh(), 15000);
    return () => clearInterval(id);
  }, [refresh]);

  if (!character) return null;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">NOVA CITY</div>
        <div className="topbar-identity">
          <span className="callsign">{character.callsign}</span>
          <span className="level-badge">Lv {character.level}</span>
          <span className="credits">{character.credits.toLocaleString()} cr</span>
          <span className={`status-badge status-${character.status}`}>
            {STATUS_LABEL[character.status]}
            {character.statusUntil && character.status !== 'ok' && (
              <>
                {' '}
                · <Timer target={character.statusUntil} onComplete={refresh} />
              </>
            )}
          </span>
          <button
            className="btn-ghost"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <div className="resource-row">
        <ResourceBar label="Fuel" value={character.resources.fuel} max={100} variant="fuel" />
        <ResourceBar label="Resolve" value={character.resources.resolve} max={100} variant="resolve" />
        <ResourceBar label="Morale" value={character.resources.morale} max={100} variant="morale" />
        <ResourceBar label="Health" value={character.resources.health} max={100} variant="health" />
      </div>
      <div className="app-body">
        <nav className="sidenav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
