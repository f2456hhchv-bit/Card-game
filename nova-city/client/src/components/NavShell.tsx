import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useNovaSocket } from '../api/ws';
import { ResourceBar } from './ResourceBar';
import { Timer } from './Timer';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import type { WsEvent } from '../types';

const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/gym', label: 'Training Bay', icon: 'gym' },
  { to: '/crimes', label: 'Ops', icon: 'crimes' },
  { to: '/combat', label: 'Combat', icon: 'combat' },
  { to: '/jail', label: 'Brig', icon: 'jail' },
  { to: '/hospital', label: 'Medbay', icon: 'hospital' },
  { to: '/market', label: 'Trade Hub', icon: 'market' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/travel', label: 'Travel', icon: 'travel' },
  { to: '/galaxy', label: 'Galaxy', icon: 'galaxy' },
  { to: '/faction', label: 'Faction', icon: 'faction' },
  { to: '/casino', label: 'Casino', icon: 'casino' },
  { to: '/bounties', label: 'Bounties', icon: 'bounty' },
  { to: '/achievements', label: 'Achievements', icon: 'achievement' },
  { to: '/mail', label: 'Mail', icon: 'mail' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
          pushToast(`[Faction] ${event.authorCallsign}: ${event.body}`);
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
        <div className="topbar-row">
          <button
            className="hamburger-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
          <div className="topbar-brand">
            <Icon name="logo" size={22} />
            NOVA CITY
          </div>
        </div>
        <div className="topbar-identity">
          <span className="callsign">{character.callsign}</span>
          <span className="level-badge">Lv {character.level}</span>
          <span className="rank-badge" title={`Alignment: ${character.alignmentLabel}`}>
            {character.commandRank}
          </span>
          <span className="credits">
            <Icon name="credits" size={15} /> {character.credits.toLocaleString()} cr
          </span>
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
        {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}
        <nav className={menuOpen ? 'sidenav open' : 'sidenav'}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Icon name={item.icon} size={17} />
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
