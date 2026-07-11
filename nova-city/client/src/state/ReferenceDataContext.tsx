import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import type { Item, Location } from '../types';

interface ReferenceDataValue {
  locations: Location[];
  items: Item[];
  locationName: (id: string) => string;
  item: (id: string) => Item | undefined;
}

const ReferenceDataContext = createContext<ReferenceDataValue | null>(null);

export function ReferenceDataProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<{ locations: Location[] }>('/travel').then((d) => setLocations(d.locations));
    api.get<{ items: Item[] }>('/market/items').then((d) => setItems(d.items));
  }, [token]);

  const value: ReferenceDataValue = {
    locations,
    items,
    locationName: (id: string) => locations.find((l) => l.id === id)?.name ?? id,
    item: (id: string) => items.find((i) => i.id === id),
  };

  return <ReferenceDataContext.Provider value={value}>{children}</ReferenceDataContext.Provider>;
}

export function useReferenceData(): ReferenceDataValue {
  const ctx = useContext(ReferenceDataContext);
  if (!ctx) throw new Error('useReferenceData must be used within ReferenceDataProvider');
  return ctx;
}
