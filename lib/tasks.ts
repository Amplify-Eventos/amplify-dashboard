import fs from 'fs';
import path from 'path';

const WORKSPACE_ROOT = process.cwd().endsWith('dashboard') ? path.join(process.cwd(), '../') : process.cwd(); 
const BOARD_PATH = path.join(WORKSPACE_ROOT, 'board/TASKS.md');

export type TaskStatus = 'backlog' | 'in_progress' | 'done';

export interface Task {
  title: string;
  owner?: string;
  description?: string;
  status: TaskStatus;
}

export interface BoardData {
  backlog: Task[];
  inProgress: Task[];
  done: Task[];
}

// Simple parser for current TASKS.md format
export async function getBoardData(): Promise<BoardData> {
  if (!fs.existsSync(BOARD_PATH)) {
    console.error(`Board file not found at ${BOARD_PATH}`);
    return { backlog: [], inProgress: [], done: [] };
  }

  const content = fs.readFileSync(BOARD_PATH, 'utf8');
  const lines = content.split('\n');
  
  const board: BoardData = {
    backlog: [],
    inProgress: [],
    done: []
  };

  let currentSection: 'backlog' | 'inProgress' | 'done' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect sections (case-insensitive)
    if (trimmed.match(/^##\s*backlog/i)) {
      currentSection = 'backlog';
      continue;
    } else if (trimmed.match(/^##\s*in[\s-]?progress/i)) {
      currentSection = 'inProgress';
      continue;
    } else if (trimmed.match(/^##\s*done/i)) {
      currentSection = 'done';
      continue;
    }

    // Parse tasks
    const taskMatch = trimmed.match(/^- \[([ x])\]\s+(.+)$/);
    if (taskMatch && currentSection) {
      const isDone = taskMatch[1] === 'x';
      const title = taskMatch[2].trim();
      
      // Extract owner from title if present (e.g., "Task Name (Owner)")
      const ownerMatch = title.match(/\(([^)]+)\)\s*$/);
      const owner = ownerMatch ? ownerMatch[1] : undefined;
      const cleanTitle = ownerMatch ? title.replace(/\s*\([^)]+\)\s*$/, '') : title;

      board[currentSection].push({
        title: cleanTitle,
        owner,
        status: currentSection === 'done' ? 'done' : currentSection === 'inProgress' ? 'in_progress' : 'backlog'
      });
    }
  }

  return board;
}

export async function getAgentsData(): Promise<{ name: string; role: string; status: string }[]> {
  // Return current agents
  return [
    { name: 'Pulse (Main)', role: 'Technical Lead', status: 'working' },
    { name: 'Backend Architect', role: 'Backend Developer', status: 'working' },
    { name: 'System Admin', role: 'DevOps', status: 'working' },
    { name: 'Frontend', role: 'Frontend Developer', status: 'idle' },
    { name: 'Growth', role: 'SEO/Marketing', status: 'idle' }
  ];
}

// Supabase-backed task operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NewTask {
  title: string;
  owner?: string;
  description?: string;
  deliverables?: string[];
}

export async function addTask(task: NewTask): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description || null,
      status: 'backlog',
      priority: 'medium',
      // Note: owner assignment would require looking up agent by name
    });

  if (error) {
    throw new Error(`Failed to add task: ${error.message}`);
  }
}

export async function moveTask(title: string, newStatus: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('title', title);

  if (error) {
    throw new Error(`Failed to move task: ${error.message}`);
  }
}
