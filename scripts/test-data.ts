import { getBoardData } from '../lib/tasks';
import { getAgentsData } from '../lib/agents';

async function run() {
  console.log('--- Testing Board Data ---');
  try {
    const board = await getBoardData();
    console.log('Backlog:', board.backlog.length);
    console.log('In Progress:', board.inProgress.length);
    console.log('Done:', board.done.length);
    if (board.inProgress.length > 0) {
        console.log('Sample In Progress:', board.inProgress[0].title);
    }
  } catch (error) {
    console.error('Error fetching board data:', error);
  }

  console.log('\n--- Testing Agents Data ---');
  try {
    const agents = await getAgentsData();
    console.log('Agents found:', agents.length);
    if (agents.length > 0) {
        console.log('Sample Agent:', agents[0].name, '-', agents[0].role);
    }
  } catch (error) {
    console.error('Error fetching agents data:', error);
  }
}

run();
