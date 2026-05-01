import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const TaskBoard = ({ tasks, onUpdateTask, onDeleteTask, onEditTask, isAdmin, members }) => {
  const [columns, setColumns] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  });
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    setColumns({
      'To Do': tasks.filter(t => t.status === 'To Do'),
      'In Progress': tasks.filter(t => t.status === 'In Progress'),
      'Done': tasks.filter(t => t.status === 'Done'),
    });
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    // Complex dnd logic for moving between columns
    // We will simplify and just handle DragEnd to update status
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // Determine the new status based on where it was dropped
    let newStatus = null;
    if (['To Do', 'In Progress', 'Done'].includes(overId)) {
      newStatus = overId;
    } else {
      const overTask = tasks.find(t => t._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      onUpdateTask(taskId, { status: newStatus });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-4">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {Object.keys(columns).map(columnId => (
          <div key={columnId} className="flex-1 min-w-[320px] flex flex-col bg-[#f5f4f1] dark:bg-[#161616] rounded-[32px] p-5 border border-black/5 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-5 px-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center tracking-tight">
                {columnId === 'To Do' && <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 mr-3"></span>}
                {columnId === 'In Progress' && <span className="w-3 h-3 rounded-full bg-primary-400 mr-3 shadow-[0_0_12px_rgba(224,106,83,0.4)]"></span>}
                {columnId === 'Done' && <span className="w-3 h-3 rounded-full bg-emerald-400 mr-3 shadow-[0_0_12px_rgba(52,211,153,0.4)]"></span>}
                {columnId}
              </h3>
              <span className="bg-white dark:bg-[#232323] text-slate-500 dark:text-slate-400 text-sm font-medium px-3 py-1 rounded-full shadow-sm border border-black/5 dark:border-white/5">
                {columns[columnId].length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-2">
              <SortableContext 
                id={columnId}
                items={columns[columnId].map(t => t._id)} 
                strategy={verticalListSortingStrategy}
              >
                {columns[columnId].map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onEdit={onEditTask} 
                    onDelete={onDeleteTask} 
                    isAdmin={isAdmin} 
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        ))}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isAdmin={isAdmin} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TaskBoard;
