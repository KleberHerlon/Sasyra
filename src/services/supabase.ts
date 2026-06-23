import { createClient } from "@supabase/supabase-js";

const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "https://sua-url-supabase.supabase.co";
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "sua-anon-key-aqui";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
