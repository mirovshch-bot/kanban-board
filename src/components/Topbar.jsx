const Topbar = () => {
  return (
    <div className="topbar glass">
      <h1>Kanban Board</h1>
      <div className="sep"></div>
      <div className="search">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input placeholder="Search tasks…" />
      </div>
    </div>
  );
};

export default Topbar;