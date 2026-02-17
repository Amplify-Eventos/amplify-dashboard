'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(intervalMs / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          router.refresh();
          return intervalMs / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalMs, router]);

  return (
    <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400 border border-zinc-700 tabular-nums">
      Auto-sync: {timeLeft}s
    </span>
  );
}
