import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('🔍 SUPABASE MIGRATION VERIFICATION');
  console.log('━'.repeat(60));
  
  // Check agents
  const { data: agents, error: agentErr } = await supabase.from('agents').select('id, name, role, status');
  if (agentErr) {
    console.log('❌ AGENTS ERROR:', agentErr.message);
  } else {
    console.log('📊 AGENTS TABLE: ✅', agents?.length || 0, 'records');
    agents?.forEach(a => console.log(`   • ${a.name} (${a.role}) - ${a.status}`));
  }
  
  // Check tasks
  const { data: tasks, error: taskErr } = await supabase.from('tasks').select('id, title, status, priority');
  if (taskErr) {
    console.log('❌ TASKS ERROR:', taskErr.message);
  } else {
    const statusCounts: Record<string, number> = {};
    tasks?.forEach(t => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });
    console.log('\n📊 TASKS TABLE: ✅', tasks?.length || 0, 'records');
    Object.entries(statusCounts).forEach(([s, c]) => console.log(`   • ${s}: ${c}`));
  }
  
  // Check cron_jobs
  const { data: crons, error: cronErr } = await supabase.from('cron_jobs').select('id, name, enabled');
  if (cronErr) {
    console.log('\n📊 CRON_JOBS TABLE: ⚠️', cronErr.message);
  } else {
    console.log('\n📊 CRON_JOBS TABLE: ✅', crons?.length || 0, 'records');
    crons?.forEach(c => console.log(`   • ${c.name} (${c.enabled ? 'enabled' : 'disabled'})`));
  }
  
  // Test RLS with anon key
  const { data: anonAgents, error: anonErr } = await anonClient.from('agents').select('id');
  const { data: anonTasks, error: anonTaskErr } = await anonClient.from('tasks').select('id');
  const { data: anonCrons, error: anonCronErr } = await anonClient.from('cron_jobs').select('id');
  
  console.log('\n🔒 RLS POLICY CHECK:');
  console.log(anonErr ? '❌ agents: anon CANNOT read' : `✅ agents: anon can read (${anonAgents?.length || 0} records)`);
  console.log(anonTaskErr ? '❌ tasks: anon CANNOT read' : `✅ tasks: anon can read (${anonTasks?.length || 0} records)`);
  console.log(anonCronErr ? '⚠️ cron_jobs: ' + anonCronErr.message : `✅ cron_jobs: anon can read (${anonCrons?.length || 0} records)`);
  
  console.log('\n🎉 Verification complete!');
}

verify().catch(console.error);
