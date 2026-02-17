'use client';

import { Agent, Task, TaskHistory, getRecentActivity, getAgents, getTasks } from '@/lib/supabase-client';
import { useState, useEffect } from 'react';

interface Props {
  agents: Agent[];
  tasks: Task[];
  initialActivities: TaskHistory[];
  stats: {
    activeAgents: number;
    totalAgents: number;
    pendingTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    totalTasks: number;
  };
}

// Dashboard deploy date (2026-02-17)
const DASHBOARD_DEPLOY_DATE = new Date('2026-02-17T10:35:00-03:00');

export default function MissionControlClient({ agents: initialAgents, tasks: initialTasks, initialActivities, stats: initialStats }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // State for live data
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<TaskHistory[]>(initialActivities);
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll for live activity feed and refresh data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newActivities, newAgents, newTasks] = await Promise.all([
          getRecentActivity(20),
          getAgents(),
          getTasks()
        ]);
        
        if (newActivities && newActivities.length > 0) {
          setActivities(newActivities);
        }
        if (newAgents) setAgents(newAgents);
        if (newTasks) {
          setTasks(newTasks);
          // Recalculate stats
          setStats(prev => ({
            ...prev,
            activeAgents: newAgents?.filter(a => a.status === 'working').length || 0,
            totalAgents: newAgents?.length || 0,
            pendingTasks: newTasks.filter(t => t.status !== 'done').length,
            completedTasks: newTasks.filter(t => t.status === 'done').length,
            inProgressTasks: newTasks.filter(t => t.status === 'in_progress').length,
            totalTasks: newTasks.length
          }));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate real uptime
  const formatUptime = () => {
    const now = currentTime;
    const diff = now.getTime() - DASHBOARD_DEPLOY_DATE.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Get current task for an agent
  const getCurrentTask = (agentId: string): Task | undefined => {
    return tasks.find(t => t.assigned_agent_id === agentId && t.status === 'in_progress');
  };

  // Calculate time since last heartbeat
  const getTimeSinceHeartbeat = (lastHeartbeat: string | null): string => {
    if (!lastHeartbeat) return 'N/A';
    
    const last = new Date(lastHeartbeat);
    const diff = currentTime.getTime() - last.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m atrás`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Check if agent is truly active (heartbeat within last 15 minutes)
  const isAgentActive = (agent: Agent): boolean => {
    if (!agent.last_heartbeat) return false;
    const last = new Date(agent.last_heartbeat);
    const diff = currentTime.getTime() - last.getTime();
    return diff < 15 * 60 * 1000; // 15 minutes
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-tighter">
              <span className="text-blue-500">◆</span> MISSION CONTROL
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM OPERATIONAL
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-zinc-400 font-mono" suppressHydrationWarning>
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-zinc-500">
              {currentTime.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Agentes Ativos"
            value={agents.filter(a => isAgentActive(a)).length.toString()}
            subtext={`de ${agents.length} total`}
            icon="🤖"
            color="blue"
          />
          <StatCard
            title="Tasks Pendentes"
            value={stats.pendingTasks.toString()}
            subtext={`${stats.inProgressTasks} em andamento`}
            icon="📋"
            color="amber"
          />
          <StatCard
            title="Completadas"
            value={stats.completedTasks.toString()}
            subtext={`de ${stats.totalTasks} total`}
            icon="✅"
            color="emerald"
          />
          <StatCard
            title="Uptime"
            value={formatUptime()}
            subtext="Sistema Online"
            icon="⚡"
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents Panel - Enhanced */}
          <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-zinc-300">AGENT STATUS</h2>
              <span className="text-xs text-zinc-500 font-mono">
                {agents.filter(a => isAgentActive(a)).length}/{agents.length} ONLINE
              </span>
            </div>
            <div className="divide-y divide-zinc-800">
              {agents.map(agent => {
                const currentTask = getCurrentTask(agent.id);
                const isActive = isAgentActive(agent);
                
                return (
                  <div key={agent.id} className="px-4 py-3 hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`}></span>
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-zinc-500">{agent.role || 'Agent'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'
                        }`}>
                          {isActive ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Current Task */}
                    {currentTask && (
                      <div className="mt-2 ml-5 p-2 rounded bg-blue-500/10 border border-blue-500/20">
                        <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
                          <span className="animate-pulse">▶</span> Executando:
                        </div>
                        <div className="text-xs text-zinc-300 truncate">{currentTask.title}</div>
                      </div>
                    )}
                    
                    {/* Last Heartbeat */}
                    <div className="mt-1 ml-5 text-[10px] text-zinc-600">
                      Último ping: {getTimeSinceHeartbeat(agent.last_heartbeat)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-zinc-300">LIVE ACTIVITY FEED</h2>
              <span className="text-xs text-emerald-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                STREAMING
              </span>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-zinc-500 text-sm italic p-4 text-center">
                  Nenhuma atividade recente. Agentes registrarão ações aqui.
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm font-mono p-2 rounded bg-zinc-800/30"
                  >
                    <span className="text-zinc-500 text-xs whitespace-nowrap">
                      {new Date(activity.created_at).toLocaleTimeString('pt-BR')}
                    </span>
                    <span className="font-medium text-blue-400 whitespace-nowrap">
                      [{activity.agent?.name || 'System'}]
                    </span>
                    <span className="text-zinc-300">
                      <span className={
                        activity.action === 'completed' ? 'text-emerald-400 font-bold' :
                        activity.action === 'started' ? 'text-amber-400 font-bold' :
                        activity.action === 'wake' ? 'text-green-400 font-bold' :
                        activity.action === 'idle' ? 'text-yellow-400 font-bold' :
                        activity.action === 'error' ? 'text-red-400 font-bold' :
                        'text-zinc-400'
                      }>
                        {activity.action.toUpperCase()}
                      </span>
                      {activity.task && (
                        <span className="text-zinc-500 ml-1">
                          "{activity.task.title}"
                        </span>
                      )}
                      {activity.note && (
                        <span className="block text-xs text-zinc-500 mt-0.5 ml-1">
                          {activity.note}
                        </span>
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tasks Pipeline - Enhanced with 4 columns */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-zinc-300">TASK PIPELINE</h2>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-zinc-500/20 text-zinc-400">
                {tasks.filter(t => t.status === 'backlog').length} backlog
              </span>
              <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                {tasks.filter(t => t.status === 'todo').length} todo
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                {stats.inProgressTasks} in progress
              </span>
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                {stats.completedTasks} done
              </span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <PipelineColumn
              title="📥 Backlog"
              tasks={tasks.filter(t => t.status === 'backlog').slice(0, 4)}
              color="zinc"
            />
            <PipelineColumn
              title="📝 Todo"
              tasks={tasks.filter(t => t.status === 'todo').slice(0, 4)}
              color="purple"
            />
            <PipelineColumn
              title="🔄 In Progress"
              tasks={tasks.filter(t => t.status === 'in_progress').slice(0, 4)}
              color="blue"
              highlight
            />
            <PipelineColumn
              title="✅ Done"
              tasks={tasks.filter(t => t.status === 'done').slice(0, 4)}
              color="emerald"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h2 className="font-bold text-zinc-300 mb-4">AÇÕES RÁPIDAS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
              🔄 Atualizar Agentes
            </button>
            <button className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-colors text-sm font-medium">
              ⏸️ Pausar Cron Jobs
            </button>
            <button className="px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium">
              📊 Ver Analytics
            </button>
            <button className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium">
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        AMPLIFY OS v1.0 • Mission Control • Powered by Supabase • Atualiza a cada 5s
      </footer>
    </div>
  );
}

function StatCard({ title, value, subtext, icon, color }: {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
}) {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-zinc-500 font-mono">{title.toUpperCase()}</span>
      </div>
      <div className="text-3xl font-black mb-1" translate="no">{value}</div>
      <div className="text-xs text-zinc-500">{subtext}</div>
    </div>
  );
}

function PipelineColumn({ title, tasks, color, highlight }: {
  title: string;
  tasks: Task[];
  color: 'zinc' | 'blue' | 'emerald' | 'purple';
  highlight?: boolean;
}) {
  const colorClasses = {
    zinc: 'border-zinc-700 bg-zinc-800/30',
    blue: 'border-blue-500/30 bg-blue-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
  };

  return (
    <div className={`rounded-lg border ${colorClasses[color]} p-3 ${highlight ? 'ring-2 ring-blue-500/30' : ''}`}>
      <div className="text-xs font-bold text-zinc-400 mb-2">{title} <span className="text-zinc-500">({tasks.length})</span></div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-xs text-zinc-600 italic py-2 text-center">Vazio</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
              <div className="font-medium text-zinc-300 truncate mb-1">{task.title}</div>
              <div className="flex items-center justify-between">
                {task.assigned_agent ? (
                  <div className="text-zinc-500 text-[10px] flex items-center gap-1">
                    <span>👤</span> {task.assigned_agent.name}
                  </div>
                ) : (
                  <div className="text-zinc-600 text-[10px]">Não atribuído</div>
                )}
                {task.priority === 'high' && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-red-500/20 text-red-400">HIGH</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
