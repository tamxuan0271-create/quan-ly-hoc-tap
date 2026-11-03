import React from 'react';
import { StudyTask, Subject } from '../types';
import { formatDateVN, getTypeLabel, getPriorityLabel } from '../utils/storage';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  MoreHorizontal, 
  Play, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft,
  Trash2,
  Edit2
} from 'lucide-react';

interface TaskCardProps {
  task: StudyTask;
  subject?: Subject;
  onEdit: (task: StudyTask) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (task: StudyTask) => void;
  onMoveStatus?: (task: StudyTask, direction: 'prev' | 'next') => void;
  onStartPomodoro?: (task: StudyTask) => void;
  viewMode: 'status' | 'weekday' | 'subject';
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  subject,
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveStatus,
  onStartPomodoro,
  viewMode,
}) => {
  const isCompleted = task.status === 'completed';

  // Check if overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate < todayStr;
  const isDueToday = !isCompleted && task.dueDate === todayStr;

  const checklistTotal = task.checklist ? task.checklist.length : 0;
  const checklistDone = task.checklist ? task.checklist.filter((c) => c.done).length : 0;

  const priorityMeta = getPriorityLabel(task.priority);

  return (
    <div
      style={subject ? { borderTopColor: subject.color, borderTopWidth: '3px' } : undefined}
      className={`group relative rounded-xl border bg-white p-3.5 transition-all hover:shadow-md dark:bg-slate-900 ${
        isCompleted
          ? 'border-slate-200/70 opacity-75 dark:border-slate-800'
          : isOverdue
          ? 'border-rose-300 shadow-rose-500/5 dark:border-rose-900/60'
          : isDueToday
          ? 'border-amber-300 shadow-amber-500/5 dark:border-amber-800/80'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Header: Colored Subject Badge & Priority Tag */}
      <div className="flex items-center justify-between text-xs mb-2.5 gap-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {subject && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors shrink-0"
              style={{
                backgroundColor: `${subject.color}15`,
                color: subject.color,
                borderColor: `${subject.color}35`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: subject.color }}
              />
              <span className="truncate">{subject.name}</span>
            </span>
          )}

          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shrink-0 ${
              task.priority === 'high'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60'
                : task.priority === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60'
                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
          >
            {task.priority === 'high' ? 'Gấp' : task.priority === 'medium' ? 'Vừa' : 'Thấp'}
          </span>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {getTypeLabel(task.type)}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          {onStartPomodoro && !isCompleted && (
            <button
              onClick={() => onStartPomodoro(task)}
              title="Bắt đầu phiên học tập trung Pomodoro cho bài này"
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            title="Chỉnh sửa nhiệm vụ"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Xóa nhiệm vụ "${task.title}"?`)) {
                onDelete(task.id);
              }
            }}
            title="Xóa nhiệm vụ"
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Completion toggle */}
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleComplete(task)}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
          title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/40" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h4
            className={`text-sm font-semibold leading-snug transition-colors ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Checklist mini indicator */}
      {checklistTotal > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
          <span>{checklistDone}/{checklistTotal} mục con</span>
          <div className="ml-1 h-1 w-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Footer: Due Date, Time Spent, Move Column Controls */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        
        {/* Due date with color state */}
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono tabular-nums text-[11px] ${
            isOverdue
              ? 'bg-rose-50 text-rose-700 font-semibold border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60'
              : isDueToday
              ? 'bg-amber-50 text-amber-700 font-semibold border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60'
              : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60'
          }`}
        >
          <Calendar className="h-3 w-3" />
          <span>
            {isDueToday ? 'Hôm nay' : isOverdue ? `Quá hạn (${formatDateVN(task.dueDate)})` : formatDateVN(task.dueDate)}
          </span>
          {task.dueTime && <span className="opacity-75">· {task.dueTime}</span>}
        </div>

        {/* Study time logged */}
        <div className="flex items-center gap-1 font-mono tabular-nums text-slate-500 text-[11px]">
          <Clock className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>{task.actualMinutes}m / {task.estimatedMinutes}m</span>
        </div>
      </div>

      {/* Score badge with emerald aesthetic */}
      {task.score !== undefined && (
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 text-xs font-mono tabular-nums dark:bg-emerald-950/30 dark:border-emerald-900/50">
          <span className="text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">Điểm đạt được:</span>
          <span className="font-bold text-emerald-700 dark:text-emerald-300">{task.score} / 10 điểm</span>
        </div>
      )}

      {/* Quick Move column controls for Status View */}
      {viewMode === 'status' && onMoveStatus && (
        <div className="mt-2 flex items-center justify-between pt-1 text-[11px] text-slate-400">
          {task.status !== 'todo' ? (
            <button
              onClick={() => onMoveStatus(task, 'prev')}
              className="flex items-center gap-0.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Lùi lại cột trước"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>Lùi cột</span>
            </button>
          ) : <span />}

          {task.status !== 'completed' ? (
            <button
              onClick={() => onMoveStatus(task, 'next')}
              className="flex items-center gap-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              title="Chuyển sang cột tiếp theo"
            >
              <span>Chuyển tiếp</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          ) : <span />}
        </div>
      )}
    </div>
  );
};
