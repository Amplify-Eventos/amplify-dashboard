'use client';

import { Task, TaskStatus, TaskPriority } from '@/lib/supabase-client';
import { useState } from 'react';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  showStatusMenu?: boolean;
}

const priorityConfig: Record<TaskPriority, { color: string; dot: string }> = {
  low: { color: 'text-zinc-500', dot: 'bg-zinc-500' },
  medium: { color: 'text-blue-400', dot: 'bg-blue-500' },
  high: { color: 'text-amber-400', dot: 'bg-amber-500' },
  critical: { color: 'text-red-400', dot: 'bg-red-500' },
};

export function TaskCard({ task, showStatusMenu = false }: TaskCardProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [localShowStatusMenu, setShowStatusMenu] = useState(false);

  const statuses: { label: string; value: TaskStatus }[] = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Done', value: 'done' },
  ];

  const handleMove = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) {
      setShowStatusMenu(false);
      return;
    }

    setIsMoving(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, newStatus }),
      });

      if (!response.ok) throw new Error('Failed to move task');
      
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error moving task:', error);
      setIsMoving(false);
      setShowStatusMenu(false);
    }
  };

  const displayStatusMenu = showStatusMenu ? localShowStatusMenu : localShowStatusMenu;

  return (
    <Link 
      href={`/tasks/${task.id}`} 
      className={`group block bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-lg p-4 shadow-sm transition-all duration-200 ${isMoving ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
          {task.assigned_agent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {task.assigned_agent.name.replace('@', '')}
            </span>
          )}
        </div>
      </div>

      <h3 className="font-medium text-zinc-200 mb-2 leading-snug hover:text-white transition-colors">{task.title}</h3>
      
      {task.description && (
        <p className="text-xs text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-bold ${priorityConfig[task.priority].color}`}>
            {task.priority}
          </span>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority].dot}`}></span>
        </div>
        
        {displayStatusMenu && (
          <div className="absolute inset-0 bg-zinc-900/95 z-20 p-2 rounded-lg flex flex-col gap-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-1 px-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Move to...</span>
              <button 
                onClick={() => setShowStatusMenu(false)}
                className="text-zinc-500 hover:text-white"
              >
                ×
              </button>
            </div>
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => handleMove(s.value)}
                className={`text-left px-2 py-1.5 rounded text-xs transition-colors ${
                  s.value === task.status 
                    ? 'bg-zinc-800 text-white font-semibold' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
