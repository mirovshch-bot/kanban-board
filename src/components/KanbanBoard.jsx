import { STATUSES } from '../data';
import Column from './Column';

const KanbanBoard = ({ tasks, onAddTask }) => {
  return (
    <div className="board">
      {STATUSES.map((status) => (
        <Column
          key={status.id}
          status={status}
          tasks={tasks.filter((t) => t.status === status.id)}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;