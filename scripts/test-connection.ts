import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function testConnection() {
  console.log('=== Testing Supabase Connection ===\n');
  console.log('URL:', supabaseUrl);
  
  // Test with anon key (RLS enforced)
  console.log('\n--- Testing with ANON key (RLS enforced) ---');
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data: tasksAnon, error: tasksError } = await anonClient
    .from('tasks')
    .select('id, title, status')
    .limit(5);
  
  if (tasksError) {
    console.log('❌ Tasks query FAILED:', tasksError.message);
    console.log('   Code:', tasksError.code);
    console.log('   Details:', tasksError.details);
  } else {
    console.log('✅ Tasks query SUCCESS:', tasksAnon?.length, 'records');
    tasksAnon?.forEach(t => console.log(`   - [${t.status}] ${t.title}`));
  }
  
  const { data: agentsAnon, error: agentsError } = await anonClient
    .from('agents')
    .select('id, name, status')
    .limit(5);
  
  if (agentsError) {
    console.log('❌ Agents query FAILED:', agentsError.message);
  } else {
    console.log('✅ Agents query SUCCESS:', agentsAnon?.length, 'records');
    agentsAnon?.forEach(a => console.log(`   - ${a.name} (${a.status})`));
  }
  
  // Test with service role key (bypasses RLS)
  console.log('\n--- Testing with SERVICE_ROLE key (bypasses RLS) ---');
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  const { data: tasksAdmin, error: tasksAdminError } = await adminClient
    .from('tasks')
    .select('id, title, status')
    .limit(5);
  
  if (tasksAdminError) {
    console.log('❌ Tasks (admin) query FAILED:', tasksAdminError.message);
  } else {
    console.log('✅ Tasks (admin) query SUCCESS:', tasksAdmin?.length, 'records');
  }
  
  const { data: agentsAdmin, error: agentsAdminError } = await adminClient
    .from('agents')
    .select('id, name, status')
    .limit(5);
  
  if (agentsAdminError) {
    console.log('❌ Agents (admin) query FAILED:', agentsAdminError.message);
  } else {
    console.log('✅ Agents (admin) query SUCCESS:', agentsAdmin?.length, 'records');
  }
  
  // Summary
  console.log('\n=== SUMMARY ===');
  const anonWorks = !tasksError && !agentsError;
  if (anonWorks) {
    console.log('✅ RLS policies are configured correctly');
    console.log('✅ Frontend can read data with anon key');
    console.log('✅ ISR integration ready to proceed');
  } else {
    console.log('❌ RLS policies NOT configured');
    console.log('⚠️  Need to apply RLS policies in Supabase SQL Editor');
    console.log('\nRequired SQL:');
    console.log(`
-- Enable RLS on tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public agents read access" ON agents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public tasks read access" ON tasks FOR SELECT TO anon, authenticated USING (true);
`);
  }
}

testConnection().catch(console.error);
