import React, { useState } from 'react';
import { StudyTask, Subject, BoardViewMode, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { 
  Plus, 
  Search, 
  Filter, 
  Columns3, 
  CalendarDays, 
  BookMarked,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface ColumnBoardProps {
  tasks: StudyTask[];
  subjects: Subject[];
  viewMode: BoardViewMode;
  setViewMode: (mode: BoardViewMode) => void;
  onEditTask: (task: StudyTask) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (task: StudyTask) => void;
  onMoveStatus: (task: StudyTask, direction: 'prev' | 'next') => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenNewTaskModalWithDefaults: (defaults: Partial<StudyTask>) => void;
  onStartPomodoro: (task: StudyTask) => void;
}

export const ColumnBoard: React.FC<ColumnBoardProps> = ({
  tasks,
  subjects,
  viewMode,
  setViewMode,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onMoveStatus,
  onUpdateTaskStatus,
  onOpenNewTaskModalWithDefaults,
  onStartPomodoro,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  // Filter tasks based on search & selectors
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const subj = subjects.find((s) => s.id === t.subjectId);
      const matchSubj = subj?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSubj) return false;
    }
    if (filterSubject !== 'all' && t.subjectId !== filterSubject) {
      return false;
    }
    if (filterPriority !== 'all' && t.priority !== filterPriority) {
      return false;
    }
    return true;
  });

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDropStatus = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumnId(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onUpdateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  // Current day of week for Vietnamese school (1=Thứ 2, 7=Chủ Nhật)
  const currentJsDay = new Date().getDay();
  const currentSchoolDay = currentJsDay === 0 ? 7 : currentJsDay;

  // Status columns definitions with coordinated harmonious colors
  const statusColumns: {
    id: TaskStatus;
    title: string;
    hint: string;
    borderAccent: string;
    headerBg: string;
    badgeBg: string;
    textAccent: string;
    dotColor: string;
  }[] = [
    {
      id: 'todo',
      title: 'Cần Chuẩn Bị',
      hint: 'Bài mới giao, đề cương',
      borderAccent: 'border-t-amber-500',
      headerBg: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/70 dark:border-amber-800/60',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
      textAccent: 'text-amber-900 dark:text-amber-200',
      dotColor: 'bg-amber-500'
    },
    {
      id: 'in_progress',
      title: 'Đang Học & Làm Bài',
      hint: 'Đang giải, đang viết',
      borderAccent: 'border-t-blue-500',
      headerBg: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/70 dark:border-blue-800/60',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
      textAccent: 'text-blue-900 dark:text-blue-200',
      dotColor: 'bg-blue-500'
    },
    {
      id: 'review',
      title: 'Chờ Nộp / Rà Soát',
      hint: 'Kiểm tra lỗi, nộp thầy cô',
      borderAccent: 'border-t-purple-500',
      headerBg: 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200/70 dark:border-purple-800/60',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
      textAccent: 'text-purple-900 dark:text-purple-200',
      dotColor: 'bg-purple-500'
    },
    {
      id: 'completed',
      title: 'Đã Hoàn Thành',
      hint: 'Đã xong & ghi nhận điểm',
      borderAccent: 'border-t-emerald-500',
      headerBg: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-800/60',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
      textAccent: 'text-emerald-900 dark:text-emerald-200',
      dotColor: 'bg-emerald-500'
    },
  ];

  // Weekday columns
  const weekdayColumns = [
    { dayNumber: 1, name: 'Thứ Hai', shortName: 'T2' },
    { dayNumber: 2, name: 'Thứ Ba', shortName: 'T3' },
    { dayNumber: 3, name: 'Thứ Tư', shortName: 'T4' },
    { dayNumber: 4, name: 'Thứ Năm', shortName: 'T5' },
    { dayNumber: 5, name: 'Thứ Sáu', shortName: 'T6' },
    { dayNumber: 6, name: 'Thứ Bảy', shortName: 'T7' },
    { dayNumber: 7, name: 'Chủ Nhật', shortName: 'CN' },
  ];

  return (
    <div className="space-y-4">
      {/* Control bar: View Switcher, Search, Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-white p-3 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        
        {/* Left: View Mode Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg dark:bg-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('status')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'status'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Columns3 className="h-3.5 w-3.5" />
            <span>Cột Tiến Độ</span>
          </button>

          <button
            onClick={() => setViewMode('weekday')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'weekday'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Lịch Tuần (7 Ngày)</span>
          </button>

          <button
            onClick={() => setViewMode('subject')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'subject'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Theo Môn Học</span>
          </button>
        </div>

        {/* Right: Search and Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1 sm:w-56 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên bài, môn, nội dung..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Tất cả môn</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Mọi độ ưu tiên</option>
            <option value="high">Ưu tiên cao</option>
            <option value="medium">Bình thường</option>
            <option value="low">Ưu tiên thấp</option>
          </select>

          {/* Active filtered counter */}
          {(searchQuery || filterSubject !== 'all' || filterPriority !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterSubject('all');
                setFilterPriority('all');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
            >
              Xóa bộ lọc ({filteredTasks.length}/{tasks.length})
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: STATUS KANBAN COLUMNS */}
      {viewMode === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {statusColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const totalEstimated = colTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
            const isDragOver = dragOverColumnId === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropStatus(e, col.id)}
                className={`flex flex-col rounded-xl border bg-slate-50/70 p-3 transition-colors dark:bg-slate-900/50 ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20 ring-2 ring-indigo-400/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Column Header with soft color background */}
                <div className={`flex items-center justify-between p-2.5 mb-3 rounded-lg border ${col.headerBg}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                      <h3 className={`text-xs font-bold uppercase tracking-wide ${col.textAccent}`}>
                        {col.title}
                      </h3>
                      <span className={`flex h-5 px-1.5 items-center justify-center rounded-md text-[11px] font-bold tabular-nums ${col.badgeBg}`}>
                        {colTasks.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums pl-4 block mt-0.5">
                      ~{totalEstimated} phút · {col.hint}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenNewTaskModalWithDefaults({ status: col.id })}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200/80 text-slate-600 shadow-2xs hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                    title={`Thêm bài tập vào cột ${col.title}`}
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Task Cards List */}
                <div className="space-y-2.5 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 px-4 text-center dark:border-slate-800">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Chưa có nhiệm vụ trong cột này
                      </p>
                      <button
                        onClick={() => onOpenNewTaskModalWithDefaults({ status: col.id })}
                        className="mt-2 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        + Thêm bài mới
                      </button>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <TaskCard
                          task={task}
                          subject={subjects.find((s) => s.id === task.subjectId)}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          onToggleComplete={onToggleComplete}
                          onMoveStatus={onMoveStatus}
                          onStartPomodoro={onStartPomodoro}
                          viewMode="status"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: WEEKDAY 7-COLUMN TIMETABLE BOARD */}
      {viewMode === 'weekday' && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kế hoạch học tập tuần phân theo từng ngày từ Thứ Hai đến Chủ Nhật.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 items-start overflow-x-auto pb-4">
            {weekdayColumns.map((day) => {
              const dayTasks = filteredTasks.filter((t) => t.dayOfWeek === day.dayNumber);
              const isToday = day.dayNumber === currentSchoolDay;
              const completedDayTasks = dayTasks.filter((t) => t.status === 'completed').length;

              return (
                <div
                  key={day.dayNumber}
                  className={`flex flex-col rounded-xl border p-2.5 transition-colors min-w-[200px] lg:min-w-0 ${
                    isToday
                      ? 'border-indigo-400 bg-indigo-50/25 dark:border-indigo-500/80 dark:bg-indigo-950/20 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  }`}
                >
                  {/* Day Header with vibrant state */}
                  <div
                    className={`flex items-center justify-between p-2 mb-2.5 rounded-lg ${
                      isToday
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isToday ? 'text-white' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {day.name}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">
                            Hôm nay
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-mono tabular-nums ${
                          isToday ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {completedDayTasks}/{dayTasks.length} hoàn thành
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        onOpenNewTaskModalWithDefaults({ dayOfWeek: day.dayNumber })
                      }
                      className={`p-1 rounded transition-colors ${
                        isToday
                          ? 'text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                      }`}
                      title={`Thêm bài học vào ${day.name}`}
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Day Tasks */}
                  <div className="space-y-2 min-h-[160px]">
                    {dayTasks.length === 0 ? (
                      <div className="py-6 text-center text-[11px] text-slate-400">
                        Trống lịch
                      </div>
                    ) : (
                      dayTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subject={subjects.find((s) => s.id === task.subjectId)}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          onToggleComplete={onToggleComplete}
                          onStartPomodoro={onStartPomodoro}
                          viewMode="weekday"
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: SUBJECT COLUMNS */}
      {viewMode === 'subject' && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Xem toàn bộ bài tập và chuyên đề theo từng môn học độc lập.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {subjects.map((subj) => {
              const subjTasks = filteredTasks.filter((t) => t.subjectId === subj.id);
              const completedTasks = subjTasks.filter((t) => t.status === 'completed').length;
              const pendingTasks = subjTasks.length - completedTasks;

              return (
                <div
                  key={subj.id}
                  style={{ borderTopColor: subj.color, borderTopWidth: '4px' }}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Subject Column Header */}
                  <div
                    className="flex items-start justify-between p-2.5 mb-2.5 rounded-lg border"
                    style={{
                      backgroundColor: `${subj.color}10`,
                      borderColor: `${subj.color}25`,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: subj.color }}
                        />
                        <h3 className="text-sm font-bold text-slate-900 truncate dark:text-white">
                          {subj.name}
                        </h3>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: `${subj.color}20`,
                            color: subj.color,
                          }}
                        >
                          {subj.code}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="truncate">{subj.teacher || 'Chưa gán GV'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{subj.targetWeeklyHours}h/tuần</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onOpenNewTaskModalWithDefaults({ subjectId: subj.id })
                      }
                      className="p-1 rounded bg-white/80 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 hover:text-indigo-600 hover:bg-white dark:text-slate-300 transition-colors shrink-0"
                      title={`Thêm bài cho môn ${subj.name}`}
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Summary progress bar */}
                  <div className="mb-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono tabular-nums text-slate-500">
                      <span>{completedTasks}/{subjTasks.length} đã xong</span>
                      <span className="font-semibold" style={{ color: subj.color }}>
                        {pendingTasks} bài cần làm
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${subjTasks.length > 0 ? (completedTasks / subjTasks.length) * 100 : 0}%`,
                          backgroundColor: subj.color
                        }}
                      />
                    </div>
                  </div>

                  {/* Tasks in this subject */}
                  <div className="space-y-2.5 min-h-[200px]">
                    {subjTasks.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Chưa có bài tập môn này
                      </div>
                    ) : (
                      subjTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subject={subj}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          onToggleComplete={onToggleComplete}
                          onStartPomodoro={onStartPomodoro}
                          viewMode="subject"
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
