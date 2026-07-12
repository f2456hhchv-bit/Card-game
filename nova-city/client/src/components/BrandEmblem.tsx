import { Icon } from '../icons/Icon';

/** The NOVA CITY wordmark's icon, dressed up with a slow-orbiting ring and a satellite dot for the auth screens. */
export function BrandEmblem({ size = 64 }: { size?: number }) {
  return (
    <div className="brand-emblem-orbit" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" className="brand-orbit-ring" aria-hidden="true">
        <ellipse cx="32" cy="32" rx="30" ry="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <circle cx="32" cy="20" r="1.6" fill="currentColor" />
      </svg>
      <Icon name="logo" size={Math.round(size * 0.55)} />
    </div>
  );
}
