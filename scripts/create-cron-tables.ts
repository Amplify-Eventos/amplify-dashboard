/**
 * Script: Create Cron Tables in Supabase
 * 
 * Executes the DDL from migrations/002_cron_tables.sql
 * Creates cron_jobs and cron_runs tables with RLS policies.
 * 
 * Usage:
 *   npx tsx scripts/create-cron-tables.ts
 * 
 * Author: Backend Architect
 * Created: 2026-02-16
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// DDL for cron tables (inline for reliability)
const DDL = `
-- Enable UUID extension (if not already enabled)
create extension if not exists "uuid-ossp";

-- Enum: Cron job status
do $$ begin
  create type cron_run_status as enum ('pending', 'running', 'ok', 'error', 'timeout');
exception
  when duplicate_object then null;
end $$;

-- Table: cron_jobs
create table if not exists cron_jobs (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  enabled boolean default true,
  
  -- Schedule configuration
  schedule_kind text not null check (schedule_kind in ('cron', 'every', 'at')),
  schedule_expr text not null,
  timezone text default 'America/Sao_Paulo',
  
  -- Execution target
  session_target text not null default 'isolated' check (session_target in ('main', 'isolated')),
  agent_id uuid references agents(id),
  
  -- Payload configuration
  payload jsonb not null,
  delivery jsonb,
  
  -- State tracking
  last_run_at timestamptz,
  last_status cron_run_status,
  last_duration_ms integer,
  last_error text,
  consecutive_errors integer default 0,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: cron_runs
create table if not exists cron_runs (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references cron_jobs(id) on delete cascade,
  
  -- Timing
  started_at timestamptz not null,
  completed_at timestamptz,
  
  -- Result
  status cron_run_status not null default 'pending',
  duration_ms integer,
  error_message text,
  result_summary text,
  
  -- Metadata
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_cron_jobs_enabled on cron_jobs(enabled);
create index if not exists idx_cron_jobs_name on cron_jobs(name);
create index if not exists idx_cron_runs_job_id on cron_runs(job_id);
create index if not exists idx_cron_runs_started_at on cron_runs(started_at desc);
create index if not exists idx_cron_runs_status on cron_runs(status);

-- RLS Policies
alter table cron_jobs enable row level security;
alter table cron_runs enable row level security;

-- Drop existing policies if they exist
do $$ begin
  drop policy if exists "Public cron_jobs read access" on cron_jobs;
  drop policy if exists "Public cron_runs read access" on cron_runs;
end $$;

-- Create policies
create policy "Public cron_jobs read access"
on cron_jobs for select
to anon, authenticated
using (true);

create policy "Public cron_runs read access"
on cron_runs for select
to anon, authenticated
using (true);
`;

async function createTables() {
  console.log('🔄 Creating Cron Tables in Supabase');
  console.log('━'.repeat(50));
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Execute SQL via Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql: DDL })
    });

    // If RPC doesn't exist, try direct approach
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`⚠️  RPC method not available, trying alternative approach...`);
      
      // Alternative: Use Supabase client to check if tables exist
      // and provide instructions for manual execution
      console.log('');
      console.log('📋 MANUAL EXECUTION REQUIRED');
      console.log('');
      console.log('The Supabase REST API does not support direct SQL execution.');
      console.log('Please execute the following SQL in the Supabase SQL Editor:');
      console.log('');
      console.log('1. Open Supabase Dashboard → SQL Editor');
      console.log('2. Paste the contents of: migrations/002_cron_tables.sql');
      console.log('3. Click "Run" to execute');
      console.log('');
      console.log('Alternatively, use the Supabase CLI:');
      console.log('  supabase db push');
      console.log('');
      
      // Print the SQL for convenience
      console.log('━'.repeat(50));
      console.log('SQL TO EXECUTE:');
      console.log('━'.repeat(50));
      console.log(DDL);
      console.log('━'.repeat(50));
      
      return { success: false, reason: 'manual_execution_required' };
    }

    const result = await response.json();
    console.log('✅ Tables created successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    return { success: false, error };
  }
}

// Check if tables already exist
async function checkTablesExist(): Promise<boolean> {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Try to query cron_jobs table
  const { error } = await supabase
    .from('cron_jobs')
    .select('id')
    .limit(1);

  return !error || error.code !== '42P01'; // 42P01 = relation does not exist
}

async function main() {
  console.log('🔍 Checking if cron tables exist...');
  const tablesExist = await checkTablesExist();
  
  if (tablesExist) {
    console.log('✅ Cron tables already exist in Supabase.');
    console.log('');
    
    // Verify table structure
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check cron_jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('cron_jobs')
      .select('id, name, enabled')
      .limit(5);

    if (jobsError) {
      console.error('❌ Error querying cron_jobs:', jobsError.message);
    } else {
      console.log(`📊 cron_jobs table: ${jobs?.length || 0} rows`);
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          console.log(`   - ${job.name} (${job.enabled ? 'enabled' : 'disabled'})`);
        });
      }
    }

    // Check cron_runs
    const { count, error: runsError } = await supabase
      .from('cron_runs')
      .select('*', { count: 'exact', head: true });

    if (runsError) {
      console.error('❌ Error querying cron_runs:', runsError.message);
    } else {
      console.log(`📊 cron_runs table: ${count || 0} rows`);
    }
    
    return;
  }

  console.log('⚠️  Cron tables do not exist. Creating...');
  console.log('');
  
  await createTables();
}

main().catch(console.error);
