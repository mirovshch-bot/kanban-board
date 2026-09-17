import { useState } from 'react';
import './App.css';
import { initialTasks, createTask } from './data';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KanbanBoard from './components/KanbanBoard';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState('kanban');
  const [tasks, setTasks] = useState(initialTasks);

  const addTask = ({ title, status, priority }) => {
    const newTask = createTask({ title, status, priority });
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  return (
    <div className="app">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mode={mode}
        onModeChange={setMode}
      />

      <main className="main">
        <Topbar />
        {mode === 'kanban' && (
          <KanbanBoard tasks={tasks} onAddTask={addTask} />
        )}
      </main>
    </div>
  );
};

export default App;