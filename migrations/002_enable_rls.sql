-- Migration: Enable RLS policies for anon access
-- Purpose: Allow frontend to read agents and tasks with anon key
-- Run this in Supabase SQL Editor

-- ============================================
-- AGENTS TABLE
-- ============================================

-- Enable RLS on agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read all agents
CREATE POLICY "Allow anon read access on agents"
ON agents
FOR SELECT
TO anon
USING (true);

-- Allow authenticated users to read all agents
CREATE POLICY "Allow authenticated read access on agents"
ON agents
FOR SELECT
TO authenticated
USING (true);

-- Allow service role to do everything (already bypasses RLS, but explicit)
CREATE POLICY "Allow service role full access on agents"
ON agents
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- TASKS TABLE
-- ============================================

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow anon users to read all tasks
CREATE POLICY "Allow anon read access on tasks"
ON tasks
FOR SELECT
TO anon
USING (true);

-- Allow authenticated users to read all tasks
CREATE POLICY "Allow authenticated read access on tasks"
ON tasks
FOR SELECT
TO authenticated
USING (true);

-- Allow service role to do everything
CREATE POLICY "Allow service role full access on tasks"
ON tasks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- OPTIONAL: Allow updates from authenticated users
-- ============================================

-- Uncomment if you want authenticated users to update tasks
-- CREATE POLICY "Allow authenticated update on tasks"
-- ON tasks
-- FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);
