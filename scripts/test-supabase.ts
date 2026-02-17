import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection with anon key...');
  console.log('URL:', supabaseUrl);
  
  // Test agents table
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('*')
    .limit(1);
  
  console.log('\n--- Agents Table ---');
  if (agentsError) {
    console.log('❌ Error:', agentsError.message);
    console.log('   Code:', agentsError.code);
  } else {
    console.log('✅ Success! Found', agents?.length || 0, 'agents');
  }
  
  // Test tasks table
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .limit(1);
  
  console.log('\n--- Tasks Table ---');
  if (tasksError) {
    console.log('❌ Error:', tasksError.message);
    console.log('   Code:', tasksError.code);
  } else {
    console.log('✅ Success! Found', tasks?.length || 0, 'tasks');
  }
}

testConnection();
