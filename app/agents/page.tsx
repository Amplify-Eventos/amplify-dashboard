import { getAgents, Agent } from '@/lib/supabase-client';
import Link from 'next/link';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans p-8 min-h-[calc(100vh-64px)]">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Agent Registry</h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-semibold">
            Powered by Supabase • Neural Unit Status & Deployment
          </p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-zinc-900 rounded-lg text-xs font-bold text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
             {agents.length} ACTIVE UNITS
           </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
        
        {agents.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
            No agents found in registry.
          </div>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
    working: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    idle: { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' },
    offline: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  };

  const config = statusConfig[agent.status] || statusConfig.idle;

  return (
    <div className="group block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {agent.status}
        </span>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {agent.role || agent.name}
        </h2>
        <p className="text-sm text-zinc-500 font-mono mt-1">{agent.name}</p>
      </div>
      
      <div className="space-y-3">
        <div className="bg-zinc-950/50 rounded p-2 border border-zinc-800/50">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Agent ID</p>
          <code className="text-xs text-blue-400 font-mono break-all block">{agent.id.slice(0, 8)}...{agent.id.slice(-4)}</code>
        </div>
        
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Capabilities</p>
            <div className="flex gap-1 flex-wrap">
              {agent.capabilities.slice(0, 3).map((cap, idx) => (
                <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-zinc-700/50 text-zinc-400 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        )}

        {agent.last_heartbeat && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Last Heartbeat</p>
            <p className="text-xs text-zinc-400">
              {new Date(agent.last_heartbeat).toLocaleString('pt-BR', { 
                timeZone: 'America/Sao_Paulo',
                dateStyle: 'short',
                timeStyle: 'short'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
