import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Prevent app crash if user hasn't added their URL yet
if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder-project.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
