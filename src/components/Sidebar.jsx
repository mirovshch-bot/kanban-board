const Sidebar = ({ collapsed, onToggleCollapse, mode, onModeChange }) => {
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

      <div className="sidebar-section-title">Filters</div>

      <div className="nav-item">
        <svg
          className="icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
        <span className="label">All tasks</span>
      </div>

      <div className="nav-item">
        <svg
          className="icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
        <span className="label">Priority</span>
      </div>

      <div className="nav-item">
        <svg
          className="icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3H4v5.59A2 2 0 004.59 10l9.58 9.59a2 2 0 002.83 0l3.59-3.59a2 2 0 000-2.83z" />
          <circle cx="7" cy="7" r="1.2" />
        </svg>
        <span className="label">Tags</span>
      </div>

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