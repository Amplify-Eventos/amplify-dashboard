import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  // Absolute path based on the environment structure seen in previous steps
  const filePath = 'C:\\Users\\ampli\\.openclaw\\workspace\\board\\THREADS.md';

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastSize = 0;

      const readNewContent = () => {
        try {
          const stats = fs.statSync(filePath);
          if (stats.size > lastSize) {
            const buffer = Buffer.alloc(stats.size - lastSize);
            const fd = fs.openSync(filePath, 'r');
            fs.readSync(fd, buffer, 0, stats.size - lastSize, lastSize);
            fs.closeSync(fd);
            
            const newText = buffer.toString('utf8');
            const lines = newText.split('\n').map(l => l.trim()).filter(l => l);
            lines.forEach(line => {
              // Basic parsing of the log format [YYYY-MM-DD HH:MM] @Agent: ...
              const match = line.match(/^\[(.*?)\]\s+(@\w+):\s+(.*)$/);
              if (match) {
                send({
                  timestamp: match[1],
                  agent: match[2],
                  message: match[3],
                  raw: line
                });
              } else {
                send({
                  timestamp: new Date().toISOString(),
                  agent: '@System',
                  message: line,
                  raw: line
                });
              }
            });
            lastSize = stats.size;
          }
        } catch (err) {
          console.error("Error reading logs:", err);
        }
      };

      // Initial read
      try {
        const stats = fs.statSync(filePath);
        lastSize = Math.max(0, stats.size - 5000); // Start from last ~5KB
        readNewContent();
      } catch (err) {
        send({ agent: '@System', message: 'Log file not found or inaccessible.' });
      }

      const watcher = fs.watch(filePath, (event) => {
        if (event === 'change') {
          readNewContent();
        }
      });

      req.signal.addEventListener('abort', () => {
        watcher.close();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
