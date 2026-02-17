/**
 * Migration Script: Cron Jobs to Supabase
 * 
 * Migrates cron job definitions from Gateway's in-memory storage to Supabase.
 * Enables persistence across gateway restarts and provides observability via run history.
 * 
 * Usage:
 *   npx tsx scripts/migrate-cron-to-supabase.ts [--dry-run]
 * 
 * Author: Backend Architect
 * Created: 2026-02-16
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load .env.local for script execution
config({ path: resolve(process.cwd(), '.env.local') });

// Types
interface CronJobInput {
  id?: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: 'cron' | 'every' | 'at';
    expr?: string;
    everyMs?: number;
    at?: string;
    tz?: string;
  };
  sessionTarget: 'main' | 'isolated';
  payload: {
    kind: 'agentTurn' | 'systemEvent';
    message?: string;
    text?: string;
  };
  delivery?: {
    mode: 'announce' | 'none';
    channel?: string;
    to?: string;
  };
  agent_id?: string;
}

interface CronJobDb {
  name: string;
  enabled: boolean;
  schedule_kind: string;
  schedule_expr: string;
  timezone: string;
  session_target: string;
  payload: object;
  delivery?: object;
  agent_id?: string;
}

// Current cron jobs from Gateway (extracted 2026-02-16)
const CRON_JOBS: CronJobInput[] = [
  {
    id: '5e25a8f4-1029-40ec-abc7-ec21b77b2933',
    name: 'Pulse Heartbeat',
    enabled: true,
    schedule: {
      kind: 'cron',
      expr: '0,15,30,45 * * * *',
      tz: 'America/Sao_Paulo'
    },
    sessionTarget: 'main',
    payload: {
      kind: 'systemEvent',
      text: 'Check HEARTBEAT.md and perform any necessary tasks. If nothing to do, reply HEARTBEAT_OK.'
    }
  },
  {
    id: '31d4afd6-40dd-4231-bf1d-0edc68fd0a15',
    name: 'Backend Architect Heartbeat',
    enabled: true,
    schedule: {
      kind: 'cron',
      expr: '5,20,35,50 * * * *',
      tz: 'America/Sao_Paulo'
    },
    sessionTarget: 'isolated',
    payload: {
      kind: 'agentTurn',
      message: 'You are the Backend Architect (@BackendArchitect). Check board/TASKS.md for assigned migration tasks (Markdown -> Supabase). Plan and document the architecture in `org/architecture/MIGRATION_PLAN.md`. Follow `org/protocols/DEPLOY_PIPELINE.md`.'
    },
    delivery: {
      mode: 'announce'
    }
  },
  {
    id: 'e4192158-4639-48cb-b6ab-d3054f487e0a',
    name: 'Frontend/Product Heartbeat',
    enabled: true,
    schedule: {
      kind: 'cron',
      expr: '10,25,40,55 * * * *',
      tz: 'America/Sao_Paulo'
    },
    sessionTarget: 'isolated',
    payload: {
      kind: 'agentTurn',
      message: 'You are the Frontend/Product Agent. CURRENT TASK: Implement Frontend Integration with Supabase (ISR). Read org/architecture/MIGRATION_PLAN.md for context. The backend migration is COMPLETE (5 agents + 12 tasks seeded). Your task: Connect the Next.js dashboard to Supabase for ISR (Incremental Static Regeneration). Check board/TASKS.md and memory/WORKING.md for protocols.'
    },
    delivery: {
      mode: 'announce'
    }
  },
  {
    id: '3f9537ff-3545-486f-a81f-b37e6344ef98',
    name: 'System Admin Heartbeat',
    enabled: false,
    schedule: {
      kind: 'every',
      everyMs: 900000, // 15 minutes
      tz: 'America/Sao_Paulo'
    },
    sessionTarget: 'isolated',
    payload: {
      kind: 'agentTurn',
      message: 'You are the System Admin (@SystemAdmin). Check board/TASKS.md for assigned system configuration tasks. Update gateway, install tools, and manage environment. Use tools/exec to run commands. Report status to Pulse.'
    },
    delivery: {
      mode: 'announce'
    }
  },
  {
    id: '8208a00f-7cd4-4b4c-bd22-55233c7e9b73',
    name: 'Growth Agent Daily Audit',
    enabled: false,
    schedule: {
      kind: 'cron',
      expr: '0 9 * * *',
      tz: 'America/Sao_Paulo'
    },
    sessionTarget: 'isolated',
    payload: {
      kind: 'agentTurn',
      message: 'You are the Growth Strategist (@GrowthAgent). Perform your daily check on organic traffic sources for \'amplifyeventos.com.br\'.\n1. Check website uptime/health via browser.\n2. Review any new Google Business Profile insights (if accessible).\n3. Identify one new organic content opportunity based on local trends.\nReport findings to the Technical Lead.'
    },
    delivery: {
      mode: 'announce'
    }
  }
];

// Helper: Convert input to DB format
function toDbFormat(job: CronJobInput): CronJobDb {
  let scheduleExpr = '';
  
  if (job.schedule.kind === 'cron') {
    scheduleExpr = job.schedule.expr || '';
  } else if (job.schedule.kind === 'every') {
    scheduleExpr = String(job.schedule.everyMs || 0);
  } else if (job.schedule.kind === 'at') {
    scheduleExpr = job.schedule.at || '';
  }

  return {
    name: job.name,
    enabled: job.enabled,
    schedule_kind: job.schedule.kind,
    schedule_expr: scheduleExpr,
    timezone: job.schedule.tz || 'America/Sao_Paulo',
    session_target: job.sessionTarget,
    payload: job.payload,
    delivery: job.delivery,
    agent_id: job.agent_id
  };
}

// Main migration function
async function migrateCronJobs(dryRun: boolean = false) {
  const startTime = Date.now();
  console.log('🔄 Cron Jobs Migration to Supabase');
  console.log('━'.repeat(50));
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🔍 Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE MIGRATION'}`);
  console.log('');

  // Validate environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Missing Supabase credentials');
    console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log(`📊 Jobs to migrate: ${CRON_JOBS.length}`);
  console.log('');

  if (dryRun) {
    // Dry run: just show what would be migrated
    console.log('📋 Jobs Preview:');
    console.log('');
    
    for (const job of CRON_JOBS) {
      const dbJob = toDbFormat(job);
      console.log(`   ├─ ${job.name}`);
      console.log(`   │  Enabled: ${job.enabled}`);
      console.log(`   │  Schedule: ${job.schedule.kind} → ${dbJob.schedule_expr}`);
      console.log(`   │  Target: ${job.sessionTarget}`);
      console.log(`   │  Payload: ${job.payload.kind}`);
      console.log('');
    }

    console.log('✅ Dry run complete. No data written to Supabase.');
    return;
  }

  // Live migration
  const results = {
    inserted: 0,
    updated: 0,
    errors: 0
  };

  console.log('🚀 Starting migration...\n');

  for (const job of CRON_JOBS) {
    const dbJob = toDbFormat(job);
    
    try {
      // Check if job already exists
      const { data: existing, error: checkError } = await supabase
        .from('cron_jobs')
        .select('id, name')
        .eq('name', job.name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is fine
        throw checkError;
      }

      if (existing) {
        // Update existing job
        const { error: updateError } = await supabase
          .from('cron_jobs')
          .update(dbJob)
          .eq('id', existing.id);

        if (updateError) throw updateError;
        
        console.log(`   ✏️  Updated: ${job.name}`);
        results.updated++;
      } else {
        // Insert new job
        const { error: insertError } = await supabase
          .from('cron_jobs')
          .insert(dbJob);

        if (insertError) throw insertError;
        
        console.log(`   ✅ Inserted: ${job.name}`);
        results.inserted++;
      }
    } catch (error) {
      console.error(`   ❌ Error: ${job.name} - ${(error as Error).message}`);
      results.errors++;
    }
  }

  const duration = Date.now() - startTime;
  
  console.log('');
  console.log('━'.repeat(50));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Inserted: ${results.inserted}`);
  console.log(`   ✏️  Updated: ${results.updated}`);
  console.log(`   ❌ Errors: ${results.errors}`);
  console.log(`   ⏱️  Duration: ${duration}ms`);
  console.log('');
  
  if (results.errors === 0) {
    console.log('🎉 Migration completed successfully!');
  } else {
    console.log('⚠️  Migration completed with errors.');
    process.exit(1);
  }
}

// Run migration
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

migrateCronJobs(dryRun).catch(console.error);
