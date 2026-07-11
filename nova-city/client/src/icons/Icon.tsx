import type { ReactNode } from 'react';

export type IconName =
  | 'fuel'
  | 'resolve'
  | 'morale'
  | 'health'
  | 'strength'
  | 'defense'
  | 'speed'
  | 'dexterity'
  | 'weapon'
  | 'armor'
  | 'consumable'
  | 'contraband'
  | 'dashboard'
  | 'gym'
  | 'crimes'
  | 'combat'
  | 'jail'
  | 'hospital'
  | 'market'
  | 'inventory'
  | 'travel'
  | 'faction'
  | 'mail'
  | 'leaderboard'
  | 'credits'
  | 'logo';

const PATHS: Record<IconName, ReactNode> = {
  fuel: (
    <>
      <path d="M8 3h6l1 3H7z" />
      <rect x="6" y="6" width="10" height="14" rx="1.5" />
      <path d="M9 6v-2M13 6v-2" />
      <path d="M11.5 10 9 14h3l-1.5 4 4-5h-3z" fill="currentColor" stroke="none" />
    </>
  ),
  resolve: (
    <>
      <circle cx="11" cy="11" r="8" />
      <circle cx="11" cy="11" r="4.2" />
      <path d="M11 2v3M11 17v3M2 11h3M17 11h3" />
    </>
  ),
  morale: (
    <>
      <circle cx="11" cy="11" r="8.5" />
      <circle cx="7.8" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="9" r="1" fill="currentColor" stroke="none" />
      <path d="M7 13.5c1 1.4 2.6 2.2 4 2.2s3-.8 4-2.2" />
    </>
  ),
  health: (
    <>
      <circle cx="11" cy="11" r="8.5" />
      <path d="M11 6.5v9M6.5 11h9" />
    </>
  ),
  strength: (
    <>
      <rect x="2" y="9" width="3" height="4" rx="0.6" />
      <rect x="17" y="9" width="3" height="4" rx="0.6" />
      <path d="M5 11h2M15 11h2" />
      <rect x="7" y="7" width="3" height="8" rx="1" />
      <rect x="12" y="7" width="3" height="8" rx="1" />
    </>
  ),
  defense: (
    <>
      <path d="M11 2l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5z" />
      <path d="M8 11l2 2 4-4.5" />
    </>
  ),
  speed: (
    <>
      <path d="M3 8l6-5v4l6-4v4l4-2-4 9-6 4v-4l-6 4z" />
    </>
  ),
  dexterity: (
    <>
      <circle cx="11" cy="11" r="8.5" />
      <circle cx="11" cy="11" r="4.5" />
      <circle cx="11" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 2.5v2.5M11 17v2.5M19.5 11H17M5 11H2.5" />
    </>
  ),
  weapon: (
    <>
      <path d="M3 19 13 9M11 3l7 7-2.5 2.5L8 5z" />
      <path d="M15 3l3 3M3 15l3 3" />
    </>
  ),
  armor: (
    <>
      <path d="M11 2l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5z" />
      <path d="M11 6v11M8 8.5h6" />
    </>
  ),
  consumable: (
    <>
      <path d="M9 2h4M9.5 2v5L6 15.5A3 3 0 0 0 8.8 20h4.4a3 3 0 0 0 2.8-4.5L12.5 7V2" />
      <path d="M7.5 14h7" />
    </>
  ),
  contraband: (
    <>
      <path d="M3 7l8-4 8 4-8 4z" />
      <path d="M3 7v8l8 4 8-4V7" />
      <path d="M11 11v8" />
      <path d="M11 4v3.2" opacity="0.5" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="12" y="3" width="7" height="4" rx="1" />
      <rect x="12" y="9" width="7" height="10" rx="1" />
      <rect x="3" y="12" width="7" height="7" rx="1" />
    </>
  ),
  gym: (
    <>
      <rect x="1.5" y="9.5" width="2.5" height="3" rx="0.5" />
      <rect x="18" y="9.5" width="2.5" height="3" rx="0.5" />
      <path d="M4 11h1.5M16.5 11H18" />
      <rect x="5.5" y="7.5" width="2.5" height="7" rx="0.8" />
      <rect x="14" y="7.5" width="2.5" height="7" rx="0.8" />
      <path d="M8 11h6" />
    </>
  ),
  crimes: (
    <>
      <path d="M4 10c0-4 3-7 7-7s7 3 7 7v3c0 3.5-3 6-7 6s-7-2.5-7-6z" />
      <circle cx="8.2" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.8" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <path d="M4 10h14" />
    </>
  ),
  combat: (
    <>
      <path d="M3 19 12 10M9 3l8 8-2.5 2.5-8-8z" />
      <path d="M19 3 10 12M13 19l-8-8 2.5-2.5 8 8z" opacity="0.55" />
    </>
  ),
  jail: (
    <>
      <rect x="3" y="3" width="16" height="16" rx="1.5" />
      <path d="M7 3v16M11 3v16M15 3v16" />
    </>
  ),
  hospital: (
    <>
      <rect x="3" y="3" width="16" height="16" rx="2.5" />
      <path d="M11 7.5v7M7.5 11h7" />
    </>
  ),
  market: (
    <>
      <path d="M3 8l1.5-5h13L19 8" />
      <path d="M3 8h16v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17z" />
      <path d="M8 11.5a3 3 0 0 0 6 0" />
    </>
  ),
  inventory: (
    <>
      <path d="M3 7l8-4 8 4-8 4z" />
      <path d="M3 7v8l8 4 8-4V7" />
      <path d="M11 11v8" />
    </>
  ),
  travel: (
    <>
      <path d="M11 2c3 2.8 4.5 6 4.5 9.5S13 19 11 20c-2-1-4.5-4-4.5-8.5S8 4.8 11 2z" />
      <circle cx="11" cy="10" r="1.6" />
      <path d="M7 16l-2.5 4M15 16l2.5 4" />
    </>
  ),
  faction: (
    <>
      <path d="M11 2l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5z" />
      <circle cx="11" cy="9" r="2" />
      <path d="M7.5 15c.6-2 2-3 3.5-3s2.9 1 3.5 3" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="17" height="12" rx="1.5" />
      <path d="M2.5 6.5 11 13l8.5-6.5" />
    </>
  ),
  leaderboard: (
    <>
      <path d="M5 20V11M11 20V4M17 20v-7" />
      <path d="M3 20h16" />
    </>
  ),
  credits: (
    <>
      <circle cx="11" cy="11" r="8.5" />
      <path d="M8.5 8.5h4a1.8 1.8 0 0 1 0 3.6H8.5m0 0h4a1.8 1.8 0 0 1 0 3.6h-4M9.5 6.5v11" />
    </>
  ),
  logo: (
    <>
      <path d="M11 2l2.6 6.4L20 11l-6.4 2.6L11 20l-2.6-6.4L2 11l6.4-2.6z" />
      <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={`icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
