import { getAgents, getTasks } from './supabase-client';

export async function getSystemStats() {
  const [agents, tasks] = await Promise.all([
    getAgents(),
    getTasks()
  ]);

  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const workingAgents = agents.filter(a => a.status === 'working').length;

  // Default values (for cloud environment)
  let memoryUsage = "N/A";
  let memorySub = "Cloud";
  let uptime = "99.9%";
  let uptimeSub = "Cloud Deploy";

  try {
    // Check if running locally (Windows) or in cloud (Linux)
    const isWindows = process.platform === 'win32';

    if (isWindows) {
      // Windows: Use PowerShell (local development only)
      const { execSync } = await import('child_process');
      
      try {
        const memInfo = execSync('powershell "Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory,TotalVisibleMemorySize | ConvertTo-Json"', { encoding: 'utf8' });
        const memData = JSON.parse(memInfo);
        const totalMemGB = memData.TotalVisibleMemorySize / 1024 / 1024;
        const freeMemGB = memData.FreePhysicalMemory / 1024 / 1024;
        const usedMemGB = totalMemGB - freeMemGB;
        const memPercent = Math.round((usedMemGB / totalMemGB) * 100);
        
        memoryUsage = `${memPercent}%`;
        memorySub = `${usedMemGB.toFixed(1)} GB / ${Math.round(totalMemGB)} GB`;

        const uptimeInfo = execSync('powershell "(Get-Date) - (gcim Win32_OperatingSystem).LastBootUpTime | Select-Object Days,Hours,Minutes | ConvertTo-Json"', { encoding: 'utf8' });
        const uptimeData = JSON.parse(uptimeInfo);
        uptime = "Online";
        uptimeSub = `${uptimeData.Days}d ${uptimeData.Hours}h ${uptimeData.Minutes}m`;
      } catch {
        // PowerShell failed, use defaults
      }
    } else {
      // Linux/Vercel: Use /proc/meminfo for memory stats
      const { execSync } = await import('child_process');
      
      try {
        const memInfo = execSync('cat /proc/meminfo | head -2', { encoding: 'utf8' });
        const lines = memInfo.split('\n');
        const totalMatch = lines[0].match(/(\d+)/);
        const freeMatch = lines[1].match(/(\d+)/);
        
        if (totalMatch && freeMatch) {
          const totalKB = parseInt(totalMatch[1]);
          const freeKB = parseInt(freeMatch[1]);
          const usedKB = totalKB - freeKB;
          const memPercent = Math.round((usedKB / totalKB) * 100);
          
          memoryUsage = `${memPercent}%`;
          memorySub = `${Math.round(usedKB / 1024 / 1024)} GB / ${Math.round(totalKB / 1024 / 1024)} GB`;
        }

        // Uptime on Linux
        const uptimeInfo = execSync('cat /proc/uptime', { encoding: 'utf8' });
        const uptimeSeconds = parseFloat(uptimeInfo.split(' ')[0]);
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        
        uptime = "Online";
        uptimeSub = `${days}d ${hours}h ${minutes}m`;
      } catch {
        // Linux commands failed, use defaults
      }
    }
  } catch {
    // Any error, use defaults
  }

  return {
    uptime,
    uptimeSub,
    activeAgents: workingAgents,
    pendingTasks,
    memoryUsage,
    memorySub,
    agentNames: agents.slice(0, 3).map(a => a.name.split(' ')[0]).join(', ')
  };
}
