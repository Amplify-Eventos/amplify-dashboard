/**
 * DDL Execution Script: Create Cron Tables
 * 
 * Executes DDL statements from migrations/002_cron_tables.sql
 * Uses direct PostgreSQL connection via pg library.
 * 
 * Usage:
 *   npx tsx scripts/execute-ddl.ts
 * 
 * Author: Backend Architect
 * Created: 2026-02-16
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { readFileSync } from 'fs';
import { Pool } from 'pg';

// Load environment
config({ path: resolve(process.cwd(), '.env.local') });

async function executeDDL() {
  const startTime = Date.now();
  console.log('🔧 DDL Execution: Cron Tables Creation');
  console.log('━'.repeat(50));
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('');

  // Get database URL
  const databaseUrl = process.env.POSTGRES_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: POSTGRES_URL not found in environment');
    process.exit(1);
  }

  // Read DDL file
  const ddlPath = join(process.cwd(), '..', 'migrations', '002_cron_tables.sql');
  let ddl: string;
  
  try {
    ddl = readFileSync(ddlPath, 'utf-8');
    console.log(`📄 DDL file loaded: migrations/002_cron_tables.sql`);
    console.log(`📊 Size: ${ddl.length} bytes`);
    console.log('');
  } catch (error) {
    console.error(`❌ ERROR: Could not read DDL file at ${ddlPath}`);
    process.exit(1);
  }

  // Create connection pool
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  console.log('🔌 Connecting to Supabase PostgreSQL...');

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully');
    console.log('');

    // Execute DDL
    console.log('🚀 Executing DDL statements...');
    console.log('');

    await client.query(ddl);

    console.log('✅ DDL executed successfully!');
    console.log('');

    // Verify tables were created
    console.log('🔍 Verifying tables...');
    
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('cron_jobs', 'cron_runs')
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 2) {
      console.log('   ✅ cron_jobs table created');
      console.log('   ✅ cron_runs table created');
    } else {
      console.log('   ⚠️  Warning: Not all tables found');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // Verify enum type
    const enumResult = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname = 'cron_run_status'
    `);

    if (enumResult.rows.length > 0) {
      console.log('   ✅ cron_run_status enum created');
    }

    // Verify RLS
    const rlsResult = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename IN ('cron_jobs', 'cron_runs')
    `);

    console.log('');
    console.log('🔒 RLS Status:');
    rlsResult.rows.forEach(row => {
      console.log(`   ${row.tablename}: ${row.rowsecurity ? 'ENABLED' : 'DISABLED'}`);
    });

    client.release();

    const duration = Date.now() - startTime;
    console.log('');
    console.log('━'.repeat(50));
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log('🎉 Cron tables setup complete!');
    console.log('');
    console.log('Next step: Run migration script');
    console.log('  cd dashboard && npx tsx scripts/migrate-cron-to-supabase.ts');

  } catch (error) {
    console.error('');
    console.error('❌ DDL Execution Failed:');
    console.error((error as Error).message);
    
    // Check for specific errors
    if ((error as any).code === '42P04') {
      console.log('');
      console.log('ℹ️  Tables may already exist. Checking...');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

executeDDL().catch(console.error);
