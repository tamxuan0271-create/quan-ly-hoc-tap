import React from 'react';
import { StudyTask, Subject } from '../types';
import { CheckCircle2, Clock, AlertTriangle, BookOpen } from 'lucide-react';

interface StatsOverviewProps {
  tasks: StudyTask[];
  subjects: Subject[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks, subjects }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalStudyMinutes = tasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);
  const studyMinutesRemaining = totalStudyMinutes % 60;

  // Urgent tasks: due today or tomorrow and not completed
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const dueSoonTasks = tasks.filter(
    (t) => t.status !== 'completed' && (t.dueDate <= tomorrowStr)
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 mb-6">
      {/* Metric 1: Tỷ lệ hoàn thành (Emerald Theme) */}
      <div className="rounded-xl border border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/30 p-4 shadow-xs dark:border-emerald-900/50 dark:from-slate-900 dark:to-emerald-950/20">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Tỷ lệ hoàn thành</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {completionPercentage}%
          </span>
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
            ({completedTasks}/{totalTasks} bài)
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Metric 2: Tổng thời gian học (Indigo / Violet Theme) */}
      <div className="rounded-xl border border-indigo-200/70 bg-gradient-to-br from-white to-indigo-50/30 p-4 shadow-xs dark:border-indigo-900/50 dark:from-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Thời gian đã học</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {studyHours}h {studyMinutesRemaining}m
          </span>
        </div>
        <p className="mt-2 text-xs text-indigo-600/80 dark:text-indigo-400/80">
          Tích lũy từ tự học & Pomodoro
        </p>
      </div>

      {/* Metric 3: Bài tập sắp đến hạn (Amber / Coral Theme) */}
      <div className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-xs dark:border-amber-900/50 dark:from-slate-900 dark:to-amber-950/20">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Hạn nộp 48h tới</span>
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            dueSoonTasks > 0
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}>
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight tabular-nums ${dueSoonTasks > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
            {dueSoonTasks}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">nhiệm vụ cần ưu tiên</span>
        </div>
        <p className="mt-2 text-xs text-amber-700/80 dark:text-amber-400/80 truncate">
          {dueSoonTasks === 0 ? 'Đã hoàn tất các bài gấp!' : 'Cần kiểm tra trước khi lên lớp'}
        </p>
      </div>

      {/* Metric 4: Môn học theo dõi (Sky / Cyan Theme) */}
      <div className="rounded-xl border border-sky-200/70 bg-gradient-to-br from-white to-sky-50/30 p-4 shadow-xs dark:border-sky-900/50 dark:from-slate-900 dark:to-sky-950/20">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold text-sky-800 dark:text-sky-300">Môn học đang theo dõi</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/60 dark:text-sky-400">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {subjects.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">môn chính khóa</span>
        </div>
        <p className="mt-2 text-xs text-sky-700/80 dark:text-sky-400/80">
          Kèm mục tiêu giờ học hàng tuần
        </p>
      </div>
    </div>
  );
};
