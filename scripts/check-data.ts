import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkData() {
  console.log('Checking Supabase data...\n');
  
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('name, status');
  
  console.log('=== AGENTS ===');
  if (agentsError) console.log('Error:', agentsError);
  else console.log(`Total: ${agents?.length || 0}`, agents);
  
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('title, status')
    .order('created_at', { ascending: false })
    .limit(5);
  
  console.log('\n=== TASKS (latest 5) ===');
  if (tasksError) console.log('Error:', tasksError);
  else {
    console.log(`Total in DB: (check full count)`);
    tasks?.forEach(t => console.log(`  [${t.status}] ${t.title?.substring(0, 50)}...`));
  }
  
  // Count total
  const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
  console.log(`\nTotal tasks in Supabase: ${count}`);
}

checkData().catch(console.error);
