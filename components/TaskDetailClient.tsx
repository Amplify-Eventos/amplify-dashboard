'use client';

import { Task, TaskStatus, TaskPriority, Agent } from '@/lib/supabase-client';
import { useState } from 'react';
import Link from 'next/link';

interface TaskDetailClientProps {
  task: Task;
  agents: Agent[];
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  backlog: { label: 'Backlog', color: 'text-zinc-400', bg: 'bg-zinc-800 text-zinc-300' },
  todo: { label: 'To Do', color: 'text-blue-400', bg: 'bg-blue-500/10 text-blue-400' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/10 text-amber-400' },
  done: { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10 text-emerald-400' },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; dot: string }> = {
  low: { label: 'Low', color: 'text-zinc-500', dot: 'bg-zinc-500' },
  medium: { label: 'Medium', color: 'text-blue-400', dot: 'bg-blue-500' },
  high: { label: 'High', color: 'text-amber-400', dot: 'bg-amber-500' },
  critical: { label: 'Critical', color: 'text-red-400', dot: 'bg-red-500' },
};

export function TaskDetailClient({ task: initialTask, agents }: TaskDetailClientProps) {
  const [task, setTask] = useState(initialTask);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const updateTask = async (updates: Partial<Task>) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, ...updates }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      // Optimistic update
      setTask(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
      
      // Trigger on-demand revalidation for ISR cache
      fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          path: '/tasks', 
          secret: 'amplify-revalidate-2026' 
        }),
      }).catch(err => console.warn('Revalidation failed:', err));
      
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateTask({ status });
    setShowStatusMenu(false);
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    updateTask({ priority });
    setShowPriorityMenu(false);
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    updateTask({ assigned_agent_id: assigneeId });
    setShowAssigneeMenu(false);
  };

  const handleDescriptionSave = async () => {
    await updateTask({ description: editedDescription });
    setIsEditing(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/tasks" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Tasks
        </Link>

        {/* Main card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{task.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-zinc-500">ID: <span className="text-zinc-400 font-mono text-xs">{task.id.slice(0, 8)}...</span></span>
                </div>
              </div>

              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${statusConfig[task.status].bg} hover:opacity-80 transition-opacity`}
                >
                  {statusConfig[task.status].label}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showStatusMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 min-w-[140px]">
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status as TaskStatus)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg ${status === task.status ? 'text-white font-medium' : 'text-zinc-400'}`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${config.bg.split(' ')[0]}`}></span>
                        {config.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata row */}
          <div className="p-6 bg-zinc-900/50 border-b border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assignee */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">
                  Assignee
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowAssigneeMenu(!showAssigneeMenu)}
                    disabled={isUpdating}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition-colors"
                  >
                    {task.assigned_agent ? (
                      <>
                        <span className={`w-2 h-2 rounded-full ${task.assigned_agent.status === 'working' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
                        <span className="text-zinc-200">{task.assigned_agent.name}</span>
                      </>
                    ) : (
                      <span className="text-zinc-500">Unassigned</span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showAssigneeMenu && (
                    <div className="absolute left-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 min-w-[200px] max-h-60 overflow-y-auto">
                      <button
                        onClick={() => handleAssigneeChange(null)}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                      >
                        Unassigned
                      </button>
                      {agents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => handleAssigneeChange(agent.id)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 ${task.assigned_agent_id === agent.id ? 'text-white font-medium bg-zinc-700/50' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${agent.status === 'working' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
                          {agent.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-2">
                  Priority
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                    disabled={isUpdating}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:border-zinc-600 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${priorityConfig[task.priority].dot}`}></span>
                    <span className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showPriorityMenu && (
                    <div className="absolute left-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 min-w-[140px]">
                      {Object.entries(priorityConfig).map(([priority, config]) => (
                        <button
                          key={priority}
                          onClick={() => handlePriorityChange(priority as TaskPriority)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-700 first:rounded-t-lg last:rounded-b-lg ${priority === task.priority ? 'text-white font-medium' : 'text-zinc-400'}`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
                          {config.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Created/Updated */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">
                    Created
                  </label>
                  <span className="text-sm text-zinc-400">{formatDate(task.created_at)}</span>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase font-semibold tracking-wider mb-1">
                    Updated
                  </label>
                  <span className="text-sm text-zinc-400">{formatDate(task.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-zinc-500 uppercase font-semibold tracking-wider">Description</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-200 resize-none focus:outline-none focus:border-zinc-600"
                  placeholder="Enter task description..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { setIsEditing(false); setEditedDescription(task.description || ''); }}
                    className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDescriptionSave}
                    disabled={isUpdating}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-sm text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                {task.description ? (
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{task.description}</p>
                ) : (
                  <p className="text-sm text-zinc-600 italic">No description provided</p>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="px-6 pb-6">
              <h2 className="text-sm text-zinc-500 uppercase font-semibold tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md border border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Update indicator */}
        {isUpdating && (
          <div className="fixed bottom-4 right-4 bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}
