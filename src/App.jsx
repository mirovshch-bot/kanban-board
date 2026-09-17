import { useState, useMemo } from 'react';
import './App.css';
import {
  initialTasks,
  createTask,
  EMPTY_FILTERS,
  applyFilters,
  collectAllTags,
} from './data';
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

  const moveTask = ({ taskId, newStatus, beforeTaskId }) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;

      const without = prev.filter((t) => t.id !== taskId);
      const updated = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      if (beforeTaskId == null) {
        return [...without, updated];
      }

      const idx = without.findIndex((t) => t.id === beforeTaskId);
      if (idx === -1) return [...without, updated];

      return [...without.slice(0, idx), updated, ...without.slice(idx)];
    });
  };

  const toggleFilterValue = (field, value) => {
    setFilters((prev) => {
      const list = prev[field];
      const has = list.includes(value);
      return {
        ...prev,
        [field]: has ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  const toggleTag = (tag) => toggleFilterValue('tags', tag);
  const toggleStatus = (status) => toggleFilterValue('statuses', status);
  const togglePriority = (priority) => toggleFilterValue('priorities', priority);

  const setSearch = (search) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearAllFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  const clearFilterField = (field) => {
    setFilters((prev) => ({ ...prev, [field]: [] }));
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
        filters={filters}
        onClearAll={clearAllFilters}
        onClearField={clearFilterField}
        onToggleStatus={toggleStatus}
        onTogglePriority={togglePriority}
        onToggleTag={toggleTag}
      />

      <main className="main">
        <Topbar search={filters.search} onSearchChange={setSearch} />

        {mode === 'kanban' && (
          <KanbanBoard
            tasks={filteredTasks}
            onAddTask={addTask}
            onMoveTask={moveTask}
          />
        )}

        {mode === 'table' && (
          <TaskTable
            tasks={filteredTasks}
            allTags={allTags}
            filters={filters}
            onToggleStatus={toggleStatus}
            onTogglePriority={togglePriority}
            onToggleTag={toggleTag}
          />
        )}
      </main>
    </div>
  );
};

export default App;