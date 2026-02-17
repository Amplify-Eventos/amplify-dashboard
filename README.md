# Amplify Dashboard

A consolidated dashboard for monitoring the Amplify Multi-Agent System.

## Features

- **Task Board (Kanban):** Visualizes tasks from `board/TASKS.md` with status columns (Inbox, Assigned, In Progress, Done, etc.).
- **Agent Registry:** Displays agent health and activity from `org/AGENTS_REGISTRY.md`.
- **System Overview:** Uptime, Active Agents, Pending Tasks, and Memory Load mockups.
- **Auto-Refresh:** Client-side polling to keep data in sync with the file system.
- **Responsive Layout:** Global navigation and optimized mobile/desktop views.

## Architecture

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Dark Mode focused)
- **Data Source:** Markdown files in the root workspace (`board/TASKS.md`, etc.).
- **Update Mechanism:** Server-side parsing with ISR (Incremental Static Regeneration).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
  - `tasks/`: Task Board view.
  - `agents/`: Agent Status view.
- `lib/`: Utility functions and data parsers (Markdown to JSON).
- `components/`: Reusable UI components.
- `styles/`: Global styles and Tailwind config.

## Development Notes

- The dashboard reads directly from the workspace files. Ensure the relative paths in `lib/` point correctly to `../board/TASKS.md` etc.
- To refresh data, reload the page. Auto-refresh logic is planned.
