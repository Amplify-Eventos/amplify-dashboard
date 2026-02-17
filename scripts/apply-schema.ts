/**
 * apply-schema.ts
 * 
 * Applies the initial schema to Supabase
 * Usage: npx tsx scripts/apply-schema.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase-server';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');

async function applySchema() {
  console.log('========================================');
  console.log('  APPLYING SCHEMA TO SUPABASE');
  console.log('========================================\n');

  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  console.log('Schema file loaded');
  console.log(`Size: ${schemaSQL.length} bytes\n`);

  // Note: Supabase JS client doesn't support raw SQL execution directly
  // You need to use the Supabase SQL Editor or psql
  
  console.log('⚠️  To apply this schema, you have two options:');
  console.log('\n1. SUPABASE DASHBOARD:');
  console.log('   - Go to: https://supabase.com/dashboard/project/fsmychpilofzmahjqwjs/sql');
  console.log('   - Paste the contents of: migrations/001_initial_schema.sql');
  console.log('   - Click "Run"');
  console.log('\n2. PSQL (if you have it installed):');
  console.log('   psql "postgresql://postgres:Sagradafamili-1@db.fsmychpilofzmahjqwjs.supabase.co:5432/postgres" -f migrations/001_initial_schema.sql');
  
  console.log('\n========================================');
  console.log('Schema preview (first 500 chars):');
  console.log('========================================\n');
  console.log(schemaSQL.substring(0, 500) + '...\n');
}

applySchema();
