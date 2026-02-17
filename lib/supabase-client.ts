import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (anon key, RLS enforced)
// Safe to use in browser - respects Row Level Security policies
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on our schema
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type AgentStatus = 'idle' | 'working' | 'offline' | 'error';

export interface Agent {
  id: string;
  name: string;
  role: string | null;
  capabilities: string[] | null;
  memory_path: string | null;
  status: AgentStatus;
  last_heartbeat: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_agent_id: string | null;
  tags: string[] | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  assigned_agent?: Agent | null;
}

// Fetch all agents
export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

// Fetch all tasks with optional agent join
export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_agent:agents(id, name, role, status)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data || [];
}

// Fetch tasks grouped by status (for Kanban board)
export async function getTasksByStatus() {
  const tasks = await getTasks();
  
  return {
    backlog: tasks.filter(t => t.status === 'backlog'),
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };
}

// Update task status
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const { error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task:', error);
    return false;
  }

  return true;
}

export interface TaskHistory {
  id: string;
  task_id: string | null;
  agent_id: string | null;
  action: string;
  note: string | null;
  created_at: string;
  // Joined data
  agent?: Agent | null;
  task?: Task | null;
}

// Fetch recent activity from task_history
export async function getRecentActivity(limit = 20): Promise<TaskHistory[]> {
  const { data, error } = await supabase
    .from('task_history')
    .select(`
      *,
      agent:agents(name, role),
      task:tasks(title)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity:', error);
    return [];
  }

  return data || [];
}
