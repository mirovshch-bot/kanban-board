import { useState, useRef, useEffect } from 'react';
import { PRIORITIES } from '../data';
import TaskCard from './TaskCard';

const Column = ({ status, tasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('med');
  const inputRef = useRef(null);

  // Автофокус при открытии формы
  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const openForm = () => {
    setTitle('');
    setPriority('med');
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setTitle('');
  };

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddTask({ title: trimmed, status: status.id, priority });
    // Оставляем форму открытой — удобно вводить подряд
    setTitle('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeForm();
    }
  };

  return (
    <section className="column glass">
      <header className="column-header">
        <span className="column-dot" style={{ color: status.color }}></span>
        <span className="column-title">{status.title}</span>
        <span className="column-count">{tasks.length}</span>
      </header>

      <div className="cards">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {isAdding ? (
        <div className="add-form">
          <input
            ref={inputRef}
            className="add-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task title…"
          />
          <div className="add-form-row">
            <select
              className="add-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="add-actions">
              <button className="btn-ghost" onClick={closeForm} type="button">
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={submit}
                type="button"
                disabled={!title.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="add-card" onClick={openForm}>
          + Add task
        </div>
      )}
    </section>
  );
};

export default Column;  