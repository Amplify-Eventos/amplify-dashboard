/**
 * seed-tasks.ts
 * 
 * Description: Seeds Supabase 'tasks' and 'agents' tables from Markdown files.
 * Usage: npx tsx scripts/seed-tasks.ts [--dry-run]
 * 
 * @BackendArchitect
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase-server';
import { getBoardData } from '../lib/tasks';
import { getAgentsData } from '../lib/tasks';

const isDryRun = process.argv.includes('--dry-run');

async function seedAgents() {
  console.log('\n📋 Seeding agents...');
  
  const agents = await getAgentsData();
  console.log(`Found ${agents.length} agents in registry`);

  if (isDryRun) {
    console.log('[DRY RUN] Would insert agents:', agents.map(a => a.name));
    return agents;
  }

  const agentsToInsert = agents.map(agent => ({
    name: agent.name,
    role: agent.role,
    memory_path: `memory/DAILY/`,
    status: agent.status?.toLowerCase().includes('working') || agent.status?.toLowerCase().includes('ativo') ? 'working' : 'idle'
  }));

  const { data, error } = await supabaseAdmin
    .from('agents')
    .upsert(agentsToInsert, { onConflict: 'name' })
    .select();

  if (error) {
    console.error('❌ Error seeding agents:', error);
    return null;
  }

  console.log(`✅ Seeded ${data?.length || 0} agents`);
  return data;
}

async function seedTasks(agentsData: any[]) {
  console.log('\n📋 Seeding tasks...');
  
  const board = await getBoardData();
  
  // Combine all tasks with their status
  const allTasks = [
    ...board.backlog.map(t => ({ ...t, dbStatus: 'backlog' })),
    ...board.inProgress.map(t => ({ ...t, dbStatus: 'in_progress' })),
    ...board.done.map(t => ({ ...t, dbStatus: 'done' })),
  ];

  console.log(`Found ${allTasks.length} tasks across all sections`);

  if (allTasks.length === 0) {
    console.log('⚠️ No tasks found to seed');
    return;
  }

  if (isDryRun) {
    console.log('[DRY RUN] Would insert tasks:');
    allTasks.forEach(t => console.log(`  - [${t.dbStatus}] ${t.title}${t.owner ? ` (${t.owner})` : ''}`));
    return;
  }

  // Build agent name -> id map
  const agentMap = new Map(agentsData?.map(a => [a.name, a.id]) || []);

  const tasksToInsert = allTasks.map(task => {
    const assignedAgentId = task.owner ? agentMap.get(task.owner) : null;
    
    return {
      title: task.title,
      description: task.description || null,
      status: task.dbStatus,
      priority: 'medium' as const,
      assigned_agent_id: assignedAgentId
    };
  });

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .upsert(tasksToInsert, { onConflict: 'title' })
    .select();

  if (error) {
    console.error('❌ Error seeding tasks:', error);
    return;
  }

  console.log(`✅ Seeded ${data?.length || 0} tasks`);
}

async function main() {
  console.log('========================================');
  console.log('  MIGRATION: Markdown → Supabase');
  console.log(`  Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('========================================');

  try {
    const agents = await seedAgents();
    if (agents || isDryRun) {
      await seedTasks(agents);
    }
    
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
