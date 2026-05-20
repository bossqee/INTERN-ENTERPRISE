import { createClient } from '@supabase/supabase-js';
import type { JournalEntry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Database functionality will not work.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
