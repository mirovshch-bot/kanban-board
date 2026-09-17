import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_BY_ID } from '../data';

const TaskCard = ({ task, overlay = false }) => {
  const priority = PRIORITY_BY_ID[task.priority];

  // Хук sortable нельзя вызывать условно.
  // Для overlay-версии карточки вызываем тоже, но игнорируем результат.
  const sortable = useSortable({ id: task.id, disabled: overlay });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  const className = [
    'card',
    overlay && 'card-overlay',
    isDragging && !overlay && 'card-dragging',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={className}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
    >
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
        {task.dueDate && <span className="date">due {task.dueDate}</span>}
      </div>
    </article>
  );
};

export default TaskCard;