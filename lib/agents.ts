import { getAgentsRegistry } from './markdown';

export type Agent = {
  role: string;
  name: string;
  sessionKey: string;
  status: string;
  description: string;
};

export async function getAgentsData(): Promise<Agent[]> {
  const { content } = await getAgentsRegistry();
  
  if (!content) return [];

  const lines = content.split('\n').filter(line => line.trim() !== '');
  const agents: Agent[] = [];
  
  let headerFound = false;
  let separatorFound = false;

  for (const line of lines) {
    if (line.startsWith('|')) {
      if (!headerFound) {
        // Skip header line: | Função | Nome | Chave de Sessão | Status | Descrição |
        headerFound = true;
        continue;
      }
      if (!separatorFound) {
        // Skip separator line: | --- | --- | --- | --- | --- |
        separatorFound = true;
        continue;
      }

      // Parse data row
      // | Líder Técnico | Pulse (Main) | agent:main:main | Ativo | Guardião do sistema... |
      const parts = line.split('|').map(p => p.trim());
      // parts[0] is empty string before first pipe
      // parts[1] is Role
      // parts[2] is Name
      // parts[3] is Session Key
      // parts[4] is Status
      // parts[5] is Description
      // parts[6] is empty string after last pipe (if present)

      if (parts.length >= 6) {
        agents.push({
          role: parts[1],
          name: parts[2],
          sessionKey: parts[3],
          status: parts[4],
          description: parts[5]
        });
      }
    }
  }

  return agents;
}

export async function getAgentBySessionKey(key: string): Promise<Agent | undefined> {
  const agents = await getAgentsData();
  return agents.find(agent => agent.sessionKey === key);
}
