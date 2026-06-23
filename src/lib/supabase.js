import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const IS_CONFIGURED = supabaseUrl && supabaseUrl !== "https://sua-url-supabase.supabase.co" && supabaseAnonKey && supabaseAnonKey !== "sua-anon-key-aqui";

if (!IS_CONFIGURED) {
  console.info("[supabase] Credenciais não configuradas — operando em modo localStorage. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para ativar.");
}

export const supabase = IS_CONFIGURED ? createClient(supabaseUrl, supabaseAnonKey) : null;
