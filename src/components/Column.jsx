import { useState, useRef, useEffect } from 'react';
import { PRIORITIES, TAGS } from '../data';
import TaskCard from './TaskCard';

const Column = ({ status, tasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('med');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const openForm = () => {
    setTitle('');
    setPriority('med');
    setTags([]);
    setTagInput('');
    setIsAdding(true);
  };

  const closeForm = () => {
    setIsAdding(false);
    setTitle('');
    setTags([]);
    setTagInput('');
  };

  // ===== Работа с тегами =====
  const normalizeTag = (raw) => raw.trim().toLowerCase().replace(/^#/, '');

  const addTag = (raw) => {
    const tag = normalizeTag(raw);
    if (!tag) return;
    if (tags.includes(tag)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, tag]);
    setTagInput('');
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      // Если есть подсвеченная подсказка — используем её
      if (showSuggestions && suggestions.length > 0) {
        addTag(suggestions[0]);
      } else {
        addTag(tagInput);
      }
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      // Удаляем последний тег
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (showSuggestions) {
        setShowSuggestions(false);
      } else {
        closeForm();
      }
    }
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    // Если вставили строку с запятыми — превращаем в чипсы
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.slice(0, -1).forEach((p) => addTag(p));
      setTagInput(parts[parts.length - 1]);
    } else {
      setTagInput(value);
    }
    setShowSuggestions(value.trim().length > 0);
  };

  // Автокомплит: теги из справочника, которые ещё не выбраны и совпадают с вводом
  const suggestions = TAGS.filter(
    (t) =>
      !tags.includes(t) &&
      t.toLowerCase().includes(tagInput.trim().toLowerCase())
  ).slice(0, 5);

  // ===== Submit =====
  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    // Если в поле тега остался текст — добавим его тоже
    const finalTags = tagInput.trim()
      ? [...tags, normalizeTag(tagInput)].filter(
          (t, i, arr) => t && arr.indexOf(t) === i
        )
      : tags;

    onAddTask({
      title: trimmed,
      status: status.id,
      priority,
      tags: finalTags,
    });

    setTitle('');
    setTags([]);
    setTagInput('');
    inputRef.current?.focus();
  };

  const handleTitleKeyDown = (e) => {
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
            onKeyDown={handleTitleKeyDown}
            placeholder="Task title…"
          />

          {/* Поле тегов */}
          <div className="tag-field">
            {tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
                <button
                  type="button"
                  className="tag-chip-remove"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="tag-input"
              value={tagInput}
              onChange={handleTagChange}
              onKeyDown={handleTagKeyDown}
              onFocus={() => tagInput && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={tags.length === 0 ? 'Add tags…' : ''}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="tag-suggestions">
                {suggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="tag-suggestion"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(s);
                    }}
                  >
                    #{s}
                  </button>
                ))}
              </div>
            )}
          </div>

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