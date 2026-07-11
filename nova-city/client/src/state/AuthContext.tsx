import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, getToken, setToken } from '../api/client';
import type { Character } from '../types';

interface AuthContextValue {
  token: string | null;
  character: Character | null;
  ready: boolean;
  setCharacter: (character: Character) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, callsign: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [character, setCharacterState] = useState<Character | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setCharacterState(null);
      return;
    }
    try {
      const data = await api.get<{ character: Character }>('/character/me');
      setCharacterState(data.character);
    } catch {
      setToken(null);
      setTokenState(null);
      setCharacterState(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<{ token: string; character: Character }>('/auth/login', { email, password });
    setToken(data.token);
    setTokenState(data.token);
    setCharacterState(data.character);
  }, []);

  const register = useCallback(async (email: string, username: string, callsign: string, password: string) => {
    const data = await api.post<{ token: string; character: Character }>('/auth/register', {
      email,
      username,
      callsign,
      password,
    });
    setToken(data.token);
    setTokenState(data.token);
    setCharacterState(data.character);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setCharacterState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, character, ready, setCharacter: setCharacterState, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
