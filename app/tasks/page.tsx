import { getTasks, Task, TaskStatus } from '@/lib/supabase-client';
import { AutoRefresh } from '@/components/AutoRefresh';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function TasksPage() {
  const tasks = await getTasks();

  // Group tasks by status
  const columns: Record<TaskStatus, Task[]> = {
    backlog: tasks.filter(t => t.status === 'backlog'),
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans p-8 overflow-x-auto min-h-[calc(100vh-64px)]">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Task Board</h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-semibold">
            Powered by Supabase • {tasks.length} Total Tasks
          </p>
        </div>
        <div className="flex gap-6 items-center">
           <div className="text-right">
             <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Last Sync</p>
             <AutoRefresh intervalMs={60000} />
           </div>
        </div>
      </header>
      
      <div className="flex gap-6 min-w-max pb-4">
        <Column title="Backlog" tasks={columns.backlog} color="zinc" />
        <Column title="To Do" tasks={columns.todo} color="blue" />
        <Column title="In Progress" tasks={columns.in_progress} color="amber" />
        <Column title="Done" tasks={columns.done} color="emerald" />
      </div>
    </div>
  );
}

function Column({ title, tasks, color }: { title: string; tasks: Task[]; color: string }) {
  const colorConfig: Record<string, { border: string; badge: string }> = {
    zinc: { border: 'border-t-zinc-500', badge: 'bg-zinc-800 text-zinc-400' },
    blue: { border: 'border-t-blue-500', badge: 'bg-blue-500/10 text-blue-400' },
    amber: { border: 'border-t-amber-500', badge: 'bg-amber-500/10 text-amber-400' },
    emerald: { border: 'border-t-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400' },
  };

  const config = colorConfig[color] || colorConfig.zinc;

  return (
    <div className={`flex-shrink-0 w-80 flex flex-col rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-xl ${config.border} border-t-4`}>
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h2 className="font-semibold text-zinc-200 tracking-wide text-sm uppercase">{title}</h2>
        <span className={`${config.badge} text-xs px-2 py-0.5 rounded-full font-medium`}>{tasks.length}</span>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-lg">
            <span className="text-zinc-600 text-sm">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const priorityColors: Record<string, string> = {
    low: 'text-zinc-500',
    medium: 'text-blue-400',
    high: 'text-amber-400',
    critical: 'text-red-400',
  };

  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-zinc-100 text-sm leading-tight flex-1">{task.title}</h3>
        <span className={`text-[10px] uppercase font-bold ${priorityColors[task.priority]} ml-2`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      
      {task.assigned_agent && (
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{task.assigned_agent.name}</span>
        </div>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-zinc-700/50 text-zinc-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
