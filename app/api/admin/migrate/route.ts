import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simplified migration using Supabase client
export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if task_history table exists by trying to query it
    const { error: checkError } = await supabase
      .from('task_history')
      .select('id')
      .limit(1);

    // If table doesn't exist, we need to create it via SQL
    // But Supabase client doesn't support DDL directly
    // So we'll return instructions for manual creation

    if (checkError?.code === '42P01') {
      // Table doesn't exist - return SQL for manual execution
      return NextResponse.json({
        success: false,
        error: 'Tables do not exist. Please run the following SQL in Supabase SQL Editor:',
        sql: `
-- Run this in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  memory_type TEXT,
  key TEXT,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
        `
      });
    }

    // Tables exist - verify structure
    const { data: historySample } = await supabase
      .from('task_history')
      .select('id')
      .limit(1);

    const { data: memorySample } = await supabase
      .from('agent_memory')
      .select('id')
      .limit(1);

    return NextResponse.json({
      success: true,
      tables: {
        task_history: !!historySample || checkError?.code !== '42P01',
        agent_memory: !!memorySample
      }
    });

  } catch (error: any) {
    console.error('Migration check error:', error);
    return NextResponse.json(
      { error: error.message || 'Migration check failed' },
      { status: 500 }
    );
  }
}
