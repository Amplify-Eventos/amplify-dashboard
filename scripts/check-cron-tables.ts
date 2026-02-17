/**
 * Check Cron Tables Status
 * 
 * Verifies if cron_jobs and cron_runs tables exist in Supabase.
 * 
 * Usage:
 *   npx tsx scripts/check-cron-tables.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

config({ path: resolve(process.cwd(), '.env.local') });

async function checkTables() {
  const databaseUrl = process.env.POSTGRES_URL;
  if (!databaseUrl) {
    console.error('❌ POSTGRES_URL not found');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('cron_jobs', 'cron_runs')
      ORDER BY table_name
    `);

    console.log('🔍 Cron Tables Status:');
    console.log('');
    
    const existingTables = tablesResult.rows.map(r => r.table_name);
    
    if (existingTables.includes('cron_jobs')) {
      console.log('   ✅ cron_jobs: EXISTS');
      
      // Get row count
      const countResult = await client.query('SELECT COUNT(*) FROM cron_jobs');
      console.log(`      Rows: ${countResult.rows[0].count}`);
    } else {
      console.log('   ❌ cron_jobs: NOT FOUND');
    }
    
    if (existingTables.includes('cron_runs')) {
      console.log('   ✅ cron_runs: EXISTS');
      
      const countResult = await client.query('SELECT COUNT(*) FROM cron_runs');
      console.log(`      Rows: ${countResult.rows[0].count}`);
    } else {
      console.log('   ❌ cron_runs: NOT FOUND');
    }

    // Check enum
    const enumResult = await client.query(`
      SELECT typname, oid 
      FROM pg_type 
      WHERE typname = 'cron_run_status'
    `);
    
    console.log('');
    if (enumResult.rows.length > 0) {
      console.log('   ✅ cron_run_status enum: EXISTS');
    } else {
      console.log('   ❌ cron_run_status enum: NOT FOUND');
    }

    client.release();
    
    const allExist = existingTables.length === 2;
    console.log('');
    
    if (allExist) {
      console.log('✅ All cron tables ready for migration!');
      console.log('');
      console.log('Next step: Run migration script');
      console.log('  cd dashboard; npx tsx scripts/migrate-cron-to-supabase.ts');
    } else {
      console.log('⚠️  Some tables missing. Need to create them.');
    }
    
    return allExist;
    
  } catch (error) {
    console.error('Error:', (error as Error).message);
    return false;
  } finally {
    await pool.end();
  }
}

checkTables().then(exists => process.exit(exists ? 0 : 1));
