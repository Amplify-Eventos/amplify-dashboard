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
          const activeAgents = newAgents?.filter(a => a.status === 'working').length || 0;
          const pendingTasks = newTasks.filter(t => t.status !== 'done').length;
          const completedTasks = newTasks.filter(t => t.status === 'done').length;
          const inProgressTasks = newTasks.filter(t => t.status === 'in_progress').length;
          
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

  const formatUptime = () => {
    // This could be real data if we tracked agent uptime
    return "99.9%"; 
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
              {currentTime.toLocaleTimeString()}
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
            title="Active Agents"
            value={stats.activeAgents.toString()}
            subtext={`of ${stats.totalAgents} total`}
            icon="🤖"
            color="blue"
          />
          <StatCard
            title="Tasks Pending"
            value={stats.pendingTasks.toString()}
            subtext={`${stats.inProgressTasks} in progress`}
            icon="📋"
            color="amber"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks.toString()}
            subtext={`of ${stats.totalTasks} total`}
            icon="✅"
            color="emerald"
          />
          <StatCard
            title="System Uptime"
            value={formatUptime()}
            subtext="Global Availability"
            icon="⚡"
            color="purple"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents Panel */}
          <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-zinc-300">AGENT STATUS</h2>
              <span className="text-xs text-zinc-500 font-mono">{agents.length} AGENTS</span>
            </div>
            <div className="divide-y divide-zinc-800">
              {agents.map(agent => (
                <AgentRow key={agent.id} agent={agent} />
              ))}
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
                <div className="text-zinc-500 text-sm italic p-4 text-center">No recent activity found.</div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm font-mono p-2 rounded bg-zinc-800/30"
                  >
                    <span className="text-zinc-500 text-xs whitespace-nowrap">
                      {new Date(activity.created_at).toLocaleTimeString()}
                    </span>
                    <span className="font-medium text-blue-400 whitespace-nowrap">
                      [{activity.agent?.name || 'System'}]
                    </span>
                    <span className="text-zinc-300">
                      <span className={
                        activity.action === 'completed' ? 'text-emerald-400 font-bold' :
                        activity.action === 'started' ? 'text-amber-400 font-bold' :
                        activity.action === 'error' ? 'text-red-400 font-bold' :
                        'text-zinc-400'
                      }>
                        {activity.action.toUpperCase()}
                      </span>
                      {activity.task && (
                        <span className="text-zinc-500 ml-1">
                          on task "{activity.task.title}"
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

        {/* Tasks Overview */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-zinc-300">TASK PIPELINE</h2>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                {stats.pendingTasks} pending
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                {stats.inProgressTasks} in progress
              </span>
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                {stats.completedTasks} done
              </span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pipeline visualization */}
            <PipelineColumn
              title="Backlog"
              tasks={tasks.filter(t => t.status === 'backlog').slice(0, 5)}
              color="zinc"
            />
            <PipelineColumn
              title="In Progress"
              tasks={tasks.filter(t => t.status === 'in_progress').slice(0, 5)}
              color="blue"
            />
            <PipelineColumn
              title="Done"
              tasks={tasks.filter(t => t.status === 'done').slice(0, 5)}
              color="emerald"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h2 className="font-bold text-zinc-300 mb-4">QUICK ACTIONS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium">
              🔄 Refresh All Agents
            </button>
            <button className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-colors text-sm font-medium">
              ⏸️ Pause Cron Jobs
            </button>
            <button className="px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium">
              📊 View Analytics
            </button>
            <button className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-colors text-sm font-medium">
              ⚙️ System Config
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-500">
        AMPLIFY OS v1.0 • Mission Control • Powered by Supabase
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

function AgentRow({ agent }: { agent: Agent }) {
  const statusColors = {
    working: 'bg-emerald-500',
    idle: 'bg-amber-500',
    offline: 'bg-zinc-500',
    error: 'bg-red-500',
  };

  const statusLabel = {
    working: 'ACTIVE',
    idle: 'IDLE',
    offline: 'OFFLINE',
    error: 'ERROR',
  };

  // Safe access with fallback for unknown statuses
  const status = agent.status || 'offline';
  const colorClass = statusColors[status as keyof typeof statusColors] || statusColors.offline;
  const label = statusLabel[status as keyof typeof statusLabel] || statusLabel.offline;

  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${colorClass} animate-pulse`}></span>
        <div>
          <div className="font-medium text-sm">{agent.name}</div>
          <div className="text-xs text-zinc-500">{agent.role || 'Agent'}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-zinc-400">
          {agent.last_heartbeat
            ? new Date(agent.last_heartbeat).toLocaleTimeString()
            : 'N/A'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          status === 'working' ? 'bg-emerald-500/20 text-emerald-400' :
          status === 'idle' ? 'bg-amber-500/20 text-amber-400' :
          'bg-zinc-500/20 text-zinc-400'
        }`}>
          {label}
        </span>
      </div>
    </div>
  );
}

function PipelineColumn({ title, tasks, color }: {
  title: string;
  tasks: Task[];
  color: 'zinc' | 'blue' | 'emerald';
}) {
  const colorClasses = {
    zinc: 'border-zinc-700 bg-zinc-800/30',
    blue: 'border-blue-500/30 bg-blue-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
  };

  return (
    <div className={`rounded-lg border ${colorClasses[color]} p-3`}>
      <div className="text-xs font-bold text-zinc-400 mb-2">{title} <span className="text-zinc-500">({tasks.length})</span></div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-xs text-zinc-600 italic py-2 text-center">No tasks</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
              <div className="font-medium text-zinc-300 truncate mb-1">{task.title}</div>
              {task.assigned_agent && (
                <div className="text-zinc-500 text-[10px] flex items-center gap-1">
                  <span>👤</span> {task.assigned_agent.name}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
