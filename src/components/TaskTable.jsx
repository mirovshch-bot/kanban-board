import { useState, useMemo, useRef, useEffect } from 'react';
import {
  STATUSES,
  PRIORITIES,
  STATUS_BY_ID,
  PRIORITY_BY_ID,
  formatDate,
  sortTasks,
} from '../data';

const COLUMNS = [
  { key: 'title',     label: 'Title',    className: 'col-title',    sortable: true },
  { key: 'status',    label: 'Status',   className: 'col-status',   sortable: true, filterable: 'status' },
  { key: 'priority',  label: 'Priority', className: 'col-priority', sortable: true, filterable: 'priority' },
  { key: 'tags',      label: 'Tags',     className: 'col-tags',     sortable: false, filterable: 'tag' },
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

/**
 * Универсальное меню фильтра.
 * options: [{ value, label, color? }]
 */
const FilterMenu = ({ title, options, selected, onToggle, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
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
      <div className="filter-menu-title">{title}</div>
      {options.length === 0 ? (
        <div className="filter-menu-empty">No options</div>
      ) : (
        <div className="filter-menu-list">
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label key={opt.value} className="filter-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.value)}
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
                {opt.color && (
                  <span
                    className="filter-dot"
                    style={{ background: opt.color, boxShadow: `0 0 8px ${opt.color}` }}
                  />
                )}
                <span className="filter-label">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
      {selected.length > 0 && (
        <div className="filter-menu-footer">
          <button
            type="button"
            className="filter-clear"
            onClick={() => selected.forEach((v) => onToggle(v))}
          >
            Clear ({selected.length})
          </button>
        </div>
      )}
    </div>
  );
};

const TaskTable = ({
  tasks,
  allTags,
  filters,
  onToggleStatus,
  onTogglePriority,
  onToggleTag,
  onOpenTask,
}) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [openFilter, setOpenFilter] = useState(null); // 'status' | 'priority' | 'tag' | null

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

  // Готовим опции для каждого меню
  const tagOptions = useMemo(
    () => allTags.map((t) => ({ value: t, label: `#${t}` })),
    [allTags]
  );

  const getFilterConfig = (type) => {
    switch (type) {
      case 'status':
        return {
          title: 'Filter by status',
          options: STATUSES.map((s) => ({ value: s.id, label: s.title, color: s.color })),
          selected: filters.statuses,
          onToggle: onToggleStatus,
          count: filters.statuses.length,
        };
      case 'priority':
        return {
          title: 'Filter by priority',
          options: PRIORITIES.map((p) => ({ value: p.id, label: p.label, color: p.color })),
          selected: filters.priorities,
          onToggle: onTogglePriority,
          count: filters.priorities.length,
        };
      case 'tag':
        return {
          title: 'Filter by tag',
          options: tagOptions,
          selected: filters.tags,
          onToggle: onToggleTag,
          count: filters.tags.length,
        };
      default:
        return null;
    }
  };

  return (
    <div className="table-wrap glass">
      <table className="task-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isActiveSort = sortBy === col.key;
              const cfg = col.filterable ? getFilterConfig(col.filterable) : null;
              const isActiveFilter = cfg && cfg.count > 0;

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
                            setOpenFilter((v) =>
                              v === col.filterable ? null : col.filterable
                            );
                          }}
                          title={cfg.title}
                          aria-label={cfg.title}
                        >
                          <FilterIcon />
                          {isActiveFilter && (
                            <span className="th-filter-badge">{cfg.count}</span>
                          )}
                        </button>
                        {openFilter === col.filterable && (
                          <FilterMenu
                            title={cfg.title}
                            options={cfg.options}
                            selected={cfg.selected}
                            onToggle={cfg.onToggle}
                            onClose={() => setOpenFilter(null)}
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
              <tr
                key={task.id}
                className="task-row task-row-clickable"
                onClick={() => onOpenTask?.(task)}
              >
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