/**
 * apply-rls.ts
 * 
 * Applies RLS policies to Supabase tables
 * Usage: npx tsx scripts/apply-rls.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const rlsSQL = `
-- Enable RLS on agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read all agents
CREATE POLICY IF NOT EXISTS "Allow anon read access on agents"
ON agents
FOR SELECT
TO anon
USING (true);

-- Allow authenticated users to read all agents
CREATE POLICY IF NOT EXISTS "Allow authenticated read access on agents"
ON agents
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read all tasks
CREATE POLICY IF NOT EXISTS "Allow anon read access on tasks"
ON tasks
FOR SELECT
TO anon
USING (true);

-- Allow authenticated users to read all tasks
CREATE POLICY IF NOT EXISTS "Allow authenticated read access on tasks"
ON tasks
FOR SELECT
TO authenticated
USING (true);
`;

async function applyRLS() {
  console.log('========================================');
  console.log('  Applying RLS Policies to Supabase');
  console.log('========================================\n');

  // Split SQL into individual statements
  const statements = rlsSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    const fullStatement = statement + ';';
    console.log(`Executing: ${fullStatement.substring(0, 60)}...`);
    
    const { error } = await supabase.rpc('exec_sql', { query: fullStatement });
    
    if (error) {
      // Try direct execution via REST API
      console.log('  Trying alternative method...');
      
      // We can't execute arbitrary SQL via the REST API
      // Let's just output the SQL for manual execution
      console.log('  ⚠️ Cannot execute DDL via REST API');
      console.log('  Please run this SQL in Supabase SQL Editor:\n');
      console.log(fullStatement);
      console.log('');
    } else {
      console.log('  ✅ Success');
    }
  }

  console.log('\n========================================');
  console.log('  RLS POLICY APPLICATION COMPLETE');
  console.log('========================================');
  console.log('\n⚠️ If any statements failed, please run them manually in:');
  console.log('   https://supabase.com/dashboard/project/fsmychpilofzmahjqwjs/sql');
}

applyRLS().catch(console.error);
