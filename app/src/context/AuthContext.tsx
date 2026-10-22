import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase, hasSupabase } from '../lib/supabase';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  loading: boolean;
  mode: 'supabase' | 'demo';
  signIn(email: string, password: string): Promise<string | null>;
  signUp(name: string, email: string, password: string): Promise<string | null>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_KEY = 'rappiclone.demo.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();
  const mode: 'supabase' | 'demo' = hasSupabase && supabase ? 'supabase' : 'demo';

  useEffect(() => {
    if (!supabase) {
      // Modo demo: sesión persistida en localStorage
      try {
        const raw = localStorage.getItem(DEMO_KEY);
        if (raw) setUser(JSON.parse(raw) as DemoUser);
      } catch {
        /* ignore */
      }
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (s) setUser(mapSession(s));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? mapSession(session) : null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      mode,
      async signIn(email, password) {
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return error ? translateError(error.message) : null;
        }
        const demo: DemoUser = { id: 'demo-user', email, name: email.split('@')[0] };
        localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
        setUser(demo);
        return null;
      },
      async signUp(name, email, password) {
        if (supabase) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
          });
          return error ? translateError(error.message) : null;
        }
        const demo: DemoUser = { id: 'demo-user', email, name };
        localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
        setUser(demo);
        return null;
      },
      async logout() {
        if (supabase) await supabase.auth.signOut();
        localStorage.removeItem(DEMO_KEY);
        setUser(null);
      },
    }),
    [user, loading, mode, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function mapSession(session: Session): DemoUser {
  const u: User = session.user;
  return {
    id: u.id,
    email: u.email ?? '',
    name: (u.user_metadata?.full_name as string) ?? u.email?.split('@')[0] ?? 'Usuario',
  };
}

function translateError(msg: string) {
  if (/Invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
  if (/already registered/i.test(msg)) return 'Este correo ya está registrado.';
  if (/password/i.test(msg)) return 'La contraseña debe tener al menos 6 caracteres.';
  return msg;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
