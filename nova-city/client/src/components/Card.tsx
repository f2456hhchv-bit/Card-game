import type { ReactNode } from 'react';

export function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`card ${className ?? ''}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
}
