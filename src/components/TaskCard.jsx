import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_BY_ID } from '../data';

const TaskCard = ({ task, overlay = false, onOpen }) => {
  const priority = PRIORITY_BY_ID[task.priority];

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

  const handleClick = (e) => {
    if (overlay || isDragging) return;
    if (!onOpen) return;
    // Не открываем, если был выделен текст
    if (window.getSelection()?.toString()) return;
    e.stopPropagation();
    onOpen(task);
  };

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={className}
      onClick={handleClick}
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