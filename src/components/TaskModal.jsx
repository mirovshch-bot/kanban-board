import { useState, useEffect, useRef } from 'react';
import { STATUSES, PRIORITIES, TAGS } from '../data';

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef(null);

  // Автофокус на заголовок при открытии
  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);

  // Esc закрывает, если не открыт подтверждающий режим
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (confirmDelete) {
          setConfirmDelete(false);
        } else {
          save();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  // Сброс подтверждения при любом изменении
  useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => setConfirmDelete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);

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
      if (showSuggestions && suggestions.length > 0) {
        addTag(suggestions[0]);
      } else {
        addTag(tagInput);
      }
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.slice(0, -1).forEach((p) => addTag(p));
      setTagInput(parts[parts.length - 1]);
    } else {
      setTagInput(value);
    }
    setShowSuggestions(value.trim().length > 0);
  };

  const suggestions = TAGS.filter(
    (t) =>
      !tags.includes(t) &&
      t.toLowerCase().includes(tagInput.trim().toLowerCase())
  ).slice(0, 5);

  const save = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    // Дозаливаем «висячий» тег, если он в инпуте
    const finalTags = tagInput.trim()
      ? [...tags, normalizeTag(tagInput)].filter(
          (t, i, arr) => t && arr.indexOf(t) === i
        )
      : tags;

    onUpdate(task.id, {
      title: trimmed,
      description: description.trim(),
      status,
      priority,
      tags: finalTags,
      dueDate: dueDate || null,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      save();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
      <div className="modal glass" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <span className="modal-header-title">Edit task</span>
          <button
            type="button"
            className="modal-close"
            onClick={save}
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">Title</label>
            <input
              ref={titleRef}
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Description</label>
            <textarea
              className="modal-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details…"
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <select
                className="modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Priority</label>
              <select
                className="modal-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Due date</label>
              <input
                type="date"
                className="modal-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Tags</label>
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
                onBlur={() =>
                  setTimeout(() => setShowSuggestions(false), 150)
                }
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
          </div>
        </div>

        <footer className="modal-footer">
          <button
            type="button"
            className={`btn-danger ${confirmDelete ? 'confirming' : ''}`}
            onClick={handleDelete}
          >
            {confirmDelete ? 'Click again to confirm' : 'Delete'}
          </button>
          <div className="modal-footer-right">
            <button type="button" className="btn-ghost" onClick={save}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={save}
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TaskModal;