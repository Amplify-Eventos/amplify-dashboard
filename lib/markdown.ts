import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const WORKSPACE_ROOT = process.cwd().endsWith('dashboard') ? path.join(process.cwd(), '../') : process.cwd();
const BOARD_PATH = path.join(WORKSPACE_ROOT, 'board/TASKS.md');
const MEMORY_PATH = path.join(WORKSPACE_ROOT, 'memory/WORKING.md');
const AGENTS_PATH = path.join(WORKSPACE_ROOT, 'org/AGENTS_REGISTRY.md');

export async function getTasks() {
  if (!fs.existsSync(BOARD_PATH)) return { content: 'No tasks file found.' };
  const fileContent = fs.readFileSync(BOARD_PATH, 'utf8');
  // Assuming gray-matter is available, if not, we might need a simpler parser or install it.
  // For now, let's just return raw content if matter fails or isn't installed in the environment yet.
  try {
    const { data, content } = matter(fileContent);
    return { data, content };
  } catch (e) {
    return { content: fileContent, error: 'Failed to parse frontmatter' };
  }
}

export async function getWorkingMemory() {
  if (!fs.existsSync(MEMORY_PATH)) return { content: 'No working memory file found.' };
  const fileContent = fs.readFileSync(MEMORY_PATH, 'utf8');
  try {
    const { data, content } = matter(fileContent);
    return { data, content };
  } catch (e) {
    return { content: fileContent, error: 'Failed to parse frontmatter' };
  }
}

export async function getAgentsRegistry() {
  if (!fs.existsSync(AGENTS_PATH)) return { content: 'No agents registry found.' };
  const fileContent = fs.readFileSync(AGENTS_PATH, 'utf8');
  try {
    const { data, content } = matter(fileContent);
    return { data, content };
  } catch (e) {
    return { content: fileContent, error: 'Failed to parse frontmatter' };
  }
}
