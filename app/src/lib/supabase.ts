import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true cuando hay configuración real de Supabase (.env) */
export const hasSupabase = Boolean(url && anonKey && url.startsWith('https://'));

/**
 * Cliente Supabase perezoso. Si no hay credenciales se crea un cliente dummy
 * válido para que la app funcione en modo demo (datos locales + localStorage).
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase || !url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}
