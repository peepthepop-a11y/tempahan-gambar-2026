import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default environment variables if configured
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || envUrl || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_url') || '' : '');
  const key = customKey || envAnonKey || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_anon_key') || '' : '');

  if (!url || !key) {
    return null;
  }

  try {
    if (!clientInstance) {
      clientInstance = createClient(url, key);
    }
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const url = envUrl || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_url') || '' : '');
  const key = envAnonKey || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_anon_key') || '' : '');
  return Boolean(url && key);
}
