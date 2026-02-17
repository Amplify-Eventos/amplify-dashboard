/**
 * AGENT HELPERS - Funções OBRIGATÓRIAS para todos os agentes
 * 
 * Este arquivo contém as funções que GARANTEM integridade com Supabase.
 * TODOS os agentes DEVEM usar estas funções.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// 1. WAKE FUNCTIONS - Carregar estado
// ============================================

export async function agentWake(agentId: string) {
  console.log(`[AGENT_WAKE] ${agentId} waking up...`);
  
  // Carregar tarefas atribuídas
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('assignee', agentId)
    .neq('status', 'done');
  
  if (tasksError) {
    console.error('[AGENT_WAKE] Error loading tasks:', tasksError);
    return { success: false, error: tasksError };
  }
  
  // Carregar memória recente
  const { data: memory, error: memoryError } = await supabase
    .from('agent_memory')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  // Marcar agente como ativo
  await supabase
    .from('agents')
    .update({ 
      status: 'working', 
      last_heartbeat: new Date().toISOString() 
    })
    .eq('id', agentId);
  
  console.log(`[AGENT_WAKE] ${agentId} loaded ${tasks?.length || 0} tasks`);
  
  return { 
    success: true, 
    tasks: tasks || [], 
    memory: memory || [] 
  };
}

// ============================================
// 2. TASK FUNCTIONS - Gerenciar tarefas
// ============================================

export async function taskStart(agentId: string, taskId: string) {
  // Atualizar tarefa para in_progress
  const { error } = await supabase
    .from('tasks')
    .update({ 
      status: 'in_progress', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('[TASK_START] Error:', error);
    return { success: false, error };
  }
  
  // Registrar no histórico
  await supabase
    .from('task_history')
    .insert({
      task_id: taskId,
      agent_id: agentId,
      action: 'started',
      details: {},
      created_at: new Date().toISOString()
    });
  
  // Atualizar agente
  await supabase
    .from('agents')
    .update({ current_task: taskId })
    .eq('id', agentId);
  
  console.log(`[TASK_START] ${agentId} started task ${taskId}`);
  return { success: true };
}

export async function taskComplete(agentId: string, taskId: string, result?: any) {
  // Atualizar tarefa para done
  const { error } = await supabase
    .from('tasks')
    .update({ 
      status: 'done', 
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('[TASK_COMPLETE] Error:', error);
    return { success: false, error };
  }
  
  // Registrar no histórico
  await supabase
    .from('task_history')
    .insert({
      task_id: taskId,
      agent_id: agentId,
      action: 'completed',
      details: result || {},
      created_at: new Date().toISOString()
    });
  
  console.log(`[TASK_COMPLETE] ${agentId} completed task ${taskId}`);
  return { success: true };
}

export async function taskBlock(agentId: string, taskId: string, reason: string) {
  // Atualizar tarefa para blocked
  const { error } = await supabase
    .from('tasks')
    .update({ 
      status: 'blocked', 
      updated_at: new Date().toISOString(),
      notes: reason
    })
    .eq('id', taskId);
  
  if (error) {
    console.error('[TASK_BLOCK] Error:', error);
    return { success: false, error };
  }
  
  // Registrar no histórico
  await supabase
    .from('task_history')
    .insert({
      task_id: taskId,
      agent_id: agentId,
      action: 'blocked',
      details: { reason },
      created_at: new Date().toISOString()
    });
  
  console.log(`[TASK_BLOCK] ${agentId} blocked task ${taskId}: ${reason}`);
  return { success: true };
}

// ============================================
// 3. MEMORY FUNCTIONS - Persistir memória
// ============================================

export async function saveMemory(agentId: string, content: string, type: string = 'heartbeat') {
  const { error } = await supabase
    .from('agent_memory')
    .insert({
      agent_id: agentId,
      session_type: type,
      content: content,
      created_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('[SAVE_MEMORY] Error:', error);
    return { success: false, error };
  }
  
  console.log(`[SAVE_MEMORY] ${agentId} saved ${type} memory`);
  return { success: true };
}

// ============================================
// 4. REPORT FUNCTIONS - Finalizar sessão
// ============================================

export async function agentReport(agentId: string, summary: string) {
  // Salvar memória da sessão
  await saveMemory(agentId, summary, 'heartbeat');
  
  // Atualizar status do agente
  await supabase
    .from('agents')
    .update({ 
      status: 'idle', 
      last_heartbeat: new Date().toISOString(),
      current_task: null
    })
    .eq('id', agentId);
  
  // Registrar evento do sistema
  await supabase
    .from('system_events')
    .insert({
      type: 'agent_heartbeat',
      agent_id: agentId,
      data: { summary },
      created_at: new Date().toISOString()
    });
  
  console.log(`[AGENT_REPORT] ${agentId} reported: ${summary}`);
  return { success: true };
}

// ============================================
// 5. AUDIT FUNCTIONS - Verificação TechLead
// ============================================

export async function auditAgents() {
  // Verificar agentes que não atualizaram há mais de 30 min
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  
  const { data: stalledAgents, error } = await supabase
    .from('agents')
    .select('*')
    .lt('last_heartbeat', thirtyMinAgo)
    .eq('status', 'working');
  
  if (error) {
    console.error('[AUDIT] Error:', error);
    return [];
  }
  
  return stalledAgents || [];
}

export async function auditTasks() {
  // Verificar tarefas in_progress sem atualização há mais de 1 hora
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data: stalledTasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'in_progress')
    .lt('updated_at', oneHourAgo);
  
  if (error) {
    console.error('[AUDIT_TASKS] Error:', error);
    return [];
  }
  
  return stalledTasks || [];
}
