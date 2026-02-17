import { getAgentBySessionKey } from '@/lib/agents';
import { getBoardData, Task } from '@/lib/tasks';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const sessionKey = decodeURIComponent(params.id);
  const agent = await getAgentBySessionKey(sessionKey);

  if (!agent) {
    notFound();
  }

  const boardData = await getBoardData();
  const allTasks = [
    ...boardData.backlog,
    ...boardData.inProgress,
    ...boardData.done
  ];

  // Filter tasks for this agent
  // Owner field might be "@Role" or "Name" or "Name (Role)"
  // We'll try to match loosely
  const agentTasks = allTasks.filter(task => {
    if (!task.owner) return false;
    const owner = task.owner.toLowerCase();
    const role = agent.role.toLowerCase();
    const name = agent.name.toLowerCase();
    
    return owner.includes(role) || owner.includes(name) || owner.includes(agent.sessionKey);
  });

  const activeTasks = agentTasks.filter(t => t.status === 'backlog' || t.status === 'in_progress');
  const completedTasks = agentTasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/agents" className="text-blue-400 hover:underline">
            ← Back to Agents
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
              <p className="text-xl text-blue-400">{agent.role}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              agent.status === 'Ativo' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
            }`}>
              {agent.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-uppercase text-gray-500 mb-2">Session Key</h3>
              <code className="bg-gray-950 px-3 py-1 rounded text-sm font-mono text-purple-300">
                {agent.sessionKey}
              </code>
            </div>
            
            <div>
              <h3 className="text-sm font-uppercase text-gray-500 mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {agent.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Active Tasks
            </h2>
            {activeTasks.length === 0 ? (
              <p className="text-gray-500 italic">No active tasks found.</p>
            ) : (
              <ul className="space-y-4">
                {activeTasks.map((task, idx) => (
                  <li key={idx} className="bg-gray-750 p-4 rounded border border-gray-600">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-white">{task.title}</span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200">
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Completed Tasks
            </h2>
            {completedTasks.length === 0 ? (
              <p className="text-gray-500 italic">No completed tasks found.</p>
            ) : (
              <ul className="space-y-4">
                {completedTasks.map((task, idx) => (
                  <li key={idx} className="bg-gray-750 p-4 rounded border border-gray-600 opacity-75">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-200 line-through">{task.title}</span>
                      <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-200">
                        {task.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
