import { createClient } from "@supabase/supabase-js";

let supabase;

if (import.meta.env.VITE_APP_MODE != "docker") {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  supabase = createClient(supabaseUrl, supabaseKey);
}
export default supabase as ReturnType<typeof createClient>;
