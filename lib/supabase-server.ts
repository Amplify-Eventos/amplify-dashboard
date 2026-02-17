import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local for scripts (ts-node/tsx execution)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  config({ path: resolve(process.cwd(), '.env.local') });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with admin privileges
// Use this for seeding, migrations, and server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client-side Supabase client (anon key, RLS enforced)
export const supabaseClient = createClient(
  supabaseUrl, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
