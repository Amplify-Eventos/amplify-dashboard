// Load environment variables first
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

// Verify variables are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('✅ Environment loaded');
console.log('   SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
