import { useState, useMemo, useRef, useEffect } from 'react';
import {
  STATUS_BY_ID,
  PRIORITY_BY_ID,
  formatDate,
  sortTasks,
  } from '../data';

const COLUMNS = [
  { key: 'title',     label: 'Title',    className: 'col-title',    sortable: true },
  { key: 'status',    label: 'Status',   className: 'col-status',   sortable: true },
  { key: 'priority',  label: 'Priority', className: 'col-priority', sortable: true },
  { key: 'tags',      label: 'Tags',     className: 'col-tags',     sortable: false, filterable: true },
  { key: 'createdAt', label: 'Created',  className: 'col-date',     sortable: true },
  { key: 'dueDate',   label: 'Due',      className: 'col-date',     sortable: true },
  { key: 'actions',   label: '',         className: 'col-actions',  sortable: false },
];

const SortIcon = ({ state }) => (
  <svg
    className={`sort-icon ${state || ''}`}
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M6 12h12M10 18h4" />
  </svg>
);

const TagsFilterMenu = ({ allTags, selectedTags, onToggleTag, onClose }) => {
  const menuRef = useRef(null);

  // Закрытие по клику мимо и по Esc
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="filter-menu" ref={menuRef}>
      <div className="filter-menu-title">Filter by tag</div>
      {allTags.length === 0 ? (
        <div className="filter-menu-empty">No tags yet</div>
      ) : (
        <div className="filter-menu-list">
          {allTags.map((tag) => {
            const checked = selectedTags.includes(tag);
            return (
              <label key={tag} className="filter-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleTag(tag)}
                />
                <span className="filter-checkbox" aria-hidden="true">
                  {checked && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="filter-label">#{tag}</span>
              </label>
            );
          })}
        </div>
      )}
      {selectedTags.length > 0 && (
        <div className="filter-menu-footer">
          <button
            type="button"
            className="filter-clear"
            onClick={() => selectedTags.forEach((t) => onToggleTag(t))}
          >
            Clear ({selectedTags.length})
          </button>
        </div>
      )}
    </div>
  );
};

const TaskTable = ({ tasks, allTags, filters, onToggleTag }) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir('asc');
      return;
    }
    if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortBy(null);
      setSortDir('asc');
    }
  };

  const sortedTasks = useMemo(
    () => sortTasks(tasks, sortBy, sortDir),
    [tasks, sortBy, sortDir]
  );

  const activeTagsCount = filters.tags.length;

  return (
    <div className="table-wrap glass">
      <table className="task-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isActiveSort = sortBy === col.key;
              const isActiveFilter = col.key === 'tags' && activeTagsCount > 0;

              return (
                <th
                  key={col.key}
                  className={`${col.className} ${col.sortable ? 'sortable' : ''} ${isActiveSort ? 'active' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="th-inner">
                    {col.label}

                    {col.sortable && (
                      <SortIcon state={isActiveSort ? sortDir : null} />
                    )}

                    {col.filterable && (
                      <span className="th-filter-wrap">
                        <button
                          type="button"
                          className={`th-filter ${isActiveFilter ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterOpen((v) => !v);
                          }}
                          title="Filter by tag"
                          aria-label="Filter by tag"
                        >
                          <FilterIcon />
                          {isActiveFilter && (
                            <span className="th-filter-badge">
                              {activeTagsCount}
                            </span>
                          )}
                        </button>
                        {filterOpen && (
                          <TagsFilterMenu
                            allTags={allTags}
                            selectedTags={filters.tags}
                            onToggleTag={onToggleTag}
                            onClose={() => setFilterOpen(false)}
                          />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="table-empty">
                No tasks match the current filter
              </td>
            </tr>
          )}
          {sortedTasks.map((task) => {
            const status = STATUS_BY_ID[task.status];
            const priority = PRIORITY_BY_ID[task.priority];
            return (
              <tr key={task.id} className="task-row">
                <td className="col-title">
                  <span className="task-row-title">{task.title}</span>
                </td>
                <td className="col-status">
                  <span className="status-badge">
                    <span
                      className="column-dot"
                      style={{ color: status.color }}
                    ></span>
                    {status.title}
                  </span>
                </td>
                <td className="col-priority">
                  <span className={`priority ${task.priority}`}>
                    <span className="pdot"></span>
                    {priority.label}
                  </span>
                </td>
                <td className="col-tags">
                  <div className="tag-list">
                    {task.tags.length === 0 && (
                      <span className="muted">—</span>
                    )}
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`tag ${filters.tags.includes(tag) ? 'tag-highlight' : ''}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="col-date">
                  <span className="date">{formatDate(task.createdAt)}</span>
                </td>
                <td className="col-date">
                  <span className="date">{formatDate(task.dueDate)}</span>
                </td>
                <td className="col-actions">
                  <button
                    type="button"
                    className="row-action"
                    title="More"
                    aria-label="More actions"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="5" cy="12" r="1" />
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;