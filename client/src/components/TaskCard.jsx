import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Edit2, Trash2, AlignLeft } from 'lucide-react';
import moment from 'moment';

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    Low: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20',
    High: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-[#232323] border border-black/5 dark:border-white/5 rounded-[24px] shadow-sm p-5 cursor-grab active:cursor-grabbing transition-all duration-300 ${isDragging ? 'opacity-90 shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50 ring-2 ring-primary-500/40 scale-[1.03] rotate-2' : 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:-translate-y-1'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {isAdmin && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
            <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(task._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <h4 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">{task.title}</h4>
      
      {task.description && (
        <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400 mb-4">
          <AlignLeft size={14} className="mt-0.5 shrink-0" />
          <p className="text-sm line-clamp-2">{task.description}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Clock size={14} className={task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500' : ''} />
          <span className={task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' ? 'text-red-500 font-bold' : ''}>
            {task.dueDate ? moment(task.dueDate).format('MMM D') : 'No date'}
          </span>
        </div>

        {task.assignedTo && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={task.assignedTo.name}>
            {task.assignedTo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
