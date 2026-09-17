import { STATUS_BY_ID, PRIORITY_BY_ID } from '../data';

const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mode,
  onModeChange,
  filters,
  onClearAll,
  onClearField,
  onToggleStatus,
  onTogglePriority,
  onToggleTag,
}) => {
  // Собираем активные фильтры в один список для отображения
  const activeFilters = [
    ...filters.statuses.map((s) => ({
      type: 'statuses',
      value: s,
      label: STATUS_BY_ID[s]?.title || s,
      color: STATUS_BY_ID[s]?.color,
      onRemove: () => onToggleStatus(s),
    })),
    ...filters.priorities.map((p) => ({
      type: 'priorities',
      value: p,
      label: PRIORITY_BY_ID[p]?.label || p,
      color: PRIORITY_BY_ID[p]?.color,
      onRemove: () => onTogglePriority(p),
    })),
    ...filters.tags.map((t) => ({
      type: 'tags',
      value: t,
      label: `#${t}`,
      onRemove: () => onToggleTag(t),
    })),
  ];

  const hasAnyFilter =
    activeFilters.length > 0 || filters.search.trim().length > 0;

  return (
    <aside className={`sidebar glass ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="brand-logo"></div>
        <div className="brand-text">
          Acme Board
          <small>product team</small>
        </div>
      </div>

      <div className="switch" role="tablist">
        <button
          className={mode === 'kanban' ? 'active' : ''}
          onClick={() => onModeChange('kanban')}
          role="tab"
          aria-selected={mode === 'kanban'}
        >
          <svg
            className="icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="6" height="16" rx="1.5" />
            <rect x="10" y="4" width="6" height="10" rx="1.5" />
            <rect x="17" y="4" width="4" height="14" rx="1.5" />
          </svg>
          <span className="switch-label">Kanban</span>
        </button>

        <button
          className={mode === 'table' ? 'active' : ''}
          onClick={() => onModeChange('table')}
          role="tab"
          aria-selected={mode === 'table'}
        >
          <svg
            className="icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M9 4v16" />
          </svg>
          <span className="switch-label">Table</span>
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-section-title">
            Filters
            {hasAnyFilter && (
              <button
                type="button"
                className="filters-clear-all"
                onClick={onClearAll}
              >
                Clear all
              </button>
            )}
          </div>

          {!hasAnyFilter && (
            <div className="filters-empty">
              No active filters
            </div>
          )}

          {filters.search.trim() && (
            <div className="filter-chip filter-chip-search">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <span className="filter-chip-label">
                {filters.search.trim()}
              </span>
            </div>
          )}

          {activeFilters.map((f, i) => (
            <div className="filter-chip" key={`${f.type}-${f.value}-${i}`}>
              {f.color && (
                <span
                  className="filter-chip-dot"
                  style={{
                    background: f.color,
                    boxShadow: `0 0 8px ${f.color}`,
                  }}
                />
              )}
              <span className="filter-chip-label">{f.label}</span>
              <button
                type="button"
                className="filter-chip-remove"
                onClick={f.onRemove}
                aria-label={`Remove filter ${f.label}`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </>
      )}

      <div className="sidebar-spacer"></div>

      <div className="sidebar-footer">
        <button className="icon-btn" title="Settings">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        <button
          className="icon-btn"
          title="Collapse sidebar"
          onClick={onToggleCollapse}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.35s cubic-bezier(.2,.7,.2,1)',
            }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;