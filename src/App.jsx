import { useState, useMemo } from 'react';
import './App.css';
import { initialTasks, createTask, EMPTY_FILTERS, applyFilters, collectAllTags } from './data';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KanbanBoard from './components/KanbanBoard';
import TaskTable from './components/TaskTable';

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState('kanban');
  const [tasks, setTasks] = useState(initialTasks);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const addTask = ({ title, status, priority, tags }) => {
    const newTask = createTask({ title, status, priority, tags });
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const toggleTag = (tag) => {
    setFilters((prev) => {
      const has = prev.tags.includes(tag);
      return {
        ...prev,
        tags: has
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };
    });
  };

  const filteredTasks = useMemo(
    () => applyFilters(tasks, filters),
    [tasks, filters]
  );

  const allTags = useMemo(() => collectAllTags(tasks), [tasks]);

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
          <KanbanBoard tasks={filteredTasks} onAddTask={addTask} />
        )}
        {mode === 'table' && (
          <TaskTable
            tasks={filteredTasks}
            allTags={allTags}
            filters={filters}
            onToggleTag={toggleTag}
          />
        )}
      </main>
    </div>
  );
};

export default App;