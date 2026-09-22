import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { TasksApp } from './TasksApp';

let tasksRoot: Root | null = null;

export function mountTasksPage() {
  const section = document.getElementById('tarefas');
  if (!section || tasksRoot) return;

  section.dataset.reactTasks = 'true';
  section.replaceChildren();
  const mount = document.createElement('div');
  mount.className = 'tasks-react-mount';
  section.appendChild(mount);

  tasksRoot = createRoot(mount);
  tasksRoot.render(
    <StrictMode>
      <TasksApp />
    </StrictMode>,
  );
}
