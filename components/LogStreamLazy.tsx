'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load LogStream to improve initial page load
// This component uses EventSource which can be deferred
const LogStream = dynamic(() => import('./LogStream'), {
  ssr: false, // Don't render on server (uses EventSource)
  loading: () => <LogStreamPlaceholder />,
});

export default function LazyLogStream() {
  return (
    <Suspense fallback={<LogStreamPlaceholder />}>
      <LogStream />
    </Suspense>
  );
}

function LogStreamPlaceholder() {
  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[400px] animate-pulse">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Loading Activity Stream...</span>
        </div>
      </div>
      <div className="flex-1 p-4 font-mono text-sm">
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3 items-start">
              <div className="h-4 w-20 bg-zinc-800 rounded"></div>
              <div className="h-4 w-24 bg-zinc-800 rounded"></div>
              <div className="h-4 flex-1 bg-zinc-800 rounded max-w-[200px]"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
