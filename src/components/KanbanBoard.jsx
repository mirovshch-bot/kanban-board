import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { STATUSES } from '../data';
import Column from './Column';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onAddTask, onMoveTask }) => {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // чтобы клик по карточке не начинал drag
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const overId = over.id;
    if (taskId === overId) return;

    // Если over — id колонки (статус)
    const isOverColumn = STATUSES.some((s) => s.id === overId);

    if (isOverColumn) {
      const draggedTask = tasks.find((t) => t.id === taskId);
      if (!draggedTask) return;
      if (draggedTask.status === overId) return;
      // Перенос в конец колонки
      onMoveTask({ taskId, newStatus: overId, beforeTaskId: null });
      return;
    }

    // over — id другой карточки
    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    onMoveTask({
      taskId,
      newStatus: overTask.status,
      beforeTaskId: overTask.id,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
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

      {/* Призрак карточки при перетаскивании */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(.2,.7,.2,1)' }}>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;