import Link from 'next/link';
import { getSystemStats } from '@/lib/system';
import LogStream from '@/components/LogStream';

export default async function Home() {
  const stats = await getSystemStats();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-950 text-zinc-100 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent mb-4">
            Amplify OS
          </h1>
          <p className="text-zinc-400 text-xl font-medium">Neural Orchestration & Automated Workflows</p>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatCard title="Uptime" value={stats.uptime} sub={stats.uptimeSub} color="blue" />
          <StatCard title="Active Agents" value={stats.activeAgents.toString()} sub={stats.agentNames} color="emerald" />
          <StatCard title="Tasks Pending" value={stats.pendingTasks.toString()} sub="System Inbox" color="amber" />
          <StatCard title="Memory Load" value={stats.memoryUsage} sub={stats.memorySub} color="purple" />
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/tasks" className="group relative block p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-blue-400 group-hover:text-blue-300">Task Board</h2>
                <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tighter" translate="no">
                  {stats.pendingTasks} Pending
                </span>
              </div>
              <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed mb-6">
                Manage and track autonomous task execution. Direct sync with the system markdown database.
              </p>
              <div className="flex items-center text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                Open Workspace →
              </div>
            </div>
          </Link>

          <Link href="/agents" className="group relative block p-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300">Agent Registry</h2>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-tighter" translate="no">
                  {stats.activeAgents} Active
                </span>
              </div>
              <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed mb-6">
                Monitor agent health, session status, and cognitive load across the distributed network.
              </p>
              <div className="flex items-center text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                View Agents →
              </div>
            </div>
          </Link>
        </div>

        {/* Real-time Logs */}
        <div className="mb-16">
          <LogStream />
        </div>

        {/* Footer */}
        <footer className="text-zinc-600 text-xs flex justify-between items-center border-t border-zinc-900 pt-8 pb-12">
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">System Logs</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">API Keys</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AMPLIFY_OS_v1.0.42_STABLE
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, color }: { title: string, value: string, sub: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    purple: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
  };
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-4 rounded-xl border ${colors} backdrop-blur-sm`}>
      <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">{title}</p>
      <p className="text-2xl font-black mb-0.5" suppressHydrationWarning translate="no">{value}</p>
      <p className="text-xs opacity-50 font-medium" suppressHydrationWarning translate="no">{sub}</p>
    </div>
  );
}
