'use client';

import React, { useEffect, useState, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  agent: string;
  message: string;
  raw: string;
}

export default function LogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/logs');

    eventSource.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        setLogs((prev) => [...prev, newLog].slice(-50)); // Keep last 50
      } catch (err) {
        console.error("Error parsing log event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">System Activity Stream</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">THREADS.md</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {logs.length === 0 && (
          <div className="text-zinc-600 italic">Waiting for incoming logs...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp.split(' ')[1] || log.timestamp}]</span>
            <span className={`shrink-0 font-bold ${
              log.agent === '@TechnicalLead' ? 'text-blue-400' : 
              log.agent === '@FrontendProductAgent' ? 'text-emerald-400' : 
              'text-zinc-400'
            }`}>
              {log.agent}:
            </span>
            <span className="text-zinc-300 break-words">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
