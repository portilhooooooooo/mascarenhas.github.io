import {useEffect,useState} from 'react';
import {BackofficeRead,readSource} from '../v3/backoffice';
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
  tasksRoot.render(<TasksReadRouter />);
}

// Execution and command routes keep their existing components and services.
function TasksReadRouter(){
 const [path,setPath]=useState(location.pathname);
 useEffect(()=>{const sync=()=>setPath(location.pathname);window.addEventListener('mba:route-changed',sync);return()=>window.removeEventListener('mba:route-changed',sync);},[]);
 return readSource('tarefas')==='V3'&&/^\/tarefas\/?$/.test(path)?<BackofficeRead module="tarefas"/>:<TasksApp/>;
}
