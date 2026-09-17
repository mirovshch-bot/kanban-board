import { PRIORITY_BY_ID } from '../data';

const TaskCard = ({ task }) => {
  const priority = PRIORITY_BY_ID[task.priority];

  return (
    <article className="card">
      <div className="card-title">{task.title}</div>
      <div className="card-meta">
        <span className={`priority ${task.priority}`}>
          <span className="pdot"></span>
          {priority.label}
        </span>
        {task.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        {task.dueDate && (
          <span className="date">due {task.dueDate}</span>
        )}
      </div>
    </article>
  );
};

export default TaskCard;