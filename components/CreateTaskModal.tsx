'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, owner, description }),
      });

      if (res.ok) {
        setIsOpen(false);
        setTitle('');
        setOwner('');
        setDescription('');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
      >
        + New Task
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="System Hardening..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Owner (Optional)</label>
            <input 
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="@TechnicalLead"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
              placeholder="Detailed task description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
