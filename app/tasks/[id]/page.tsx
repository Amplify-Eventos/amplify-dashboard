import { notFound } from 'next/navigation';
import { TaskDetailClient } from '@/components/TaskDetailClient';
import { supabase } from '@/lib/supabase-client';
import { Task, Agent } from '@/lib/supabase-client';

export const revalidate = 30; // ISR: Revalidate every 30 seconds

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch task with agent info
  const { data: task, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_agent:agents(id, name, role, status)
    `)
    .eq('id', id)
    .single();

  if (error || !task) {
    notFound();
  }

  // Fetch all agents for assignment dropdown
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, role, status')
    .order('name');

  return <TaskDetailClient task={task as Task} agents={agents as Agent[]} />;
}

// Generate static params for known tasks
export async function generateStaticParams() {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id');

  return tasks?.map((task) => ({
    id: task.id,
  })) || [];
}
