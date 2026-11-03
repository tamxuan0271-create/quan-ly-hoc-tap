import React, { useState } from 'react';
import { StudyTask, Subject } from '../types';
import { formatDateVN, getTypeLabel } from '../utils/storage';
import { BarChart3, PieChart, TrendingUp, Award, Clock } from 'lucide-react';

interface SimpleChartsProps {
  tasks: StudyTask[];
  subjects: Subject[];
}

export const SimpleCharts: React.FC<SimpleChartsProps> = ({ tasks, subjects }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // 1. Task status counts
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewCount = tasks.filter((t) => t.status === 'review').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // 2. Study time by subject
  const subjectTimeData = subjects.map((subj) => {
    const subjTasks = tasks.filter((t) => t.subjectId === subj.id);
    const actualMinutes = subjTasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
    const targetMinutes = subj.targetWeeklyHours * 60;
    const taskCount = subjTasks.length;
    const completedTasks = subjTasks.filter((t) => t.status === 'completed').length;
    return {
      subject: subj,
      actualHours: Number((actualMinutes / 60).toFixed(1)),
      actualMinutes,
      targetHours: subj.targetWeeklyHours,
      targetMinutes,
      taskCount,
      completedTasks,
      percentOfTarget: targetMinutes > 0 ? Math.min(100, Math.round((actualMinutes / targetMinutes) * 100)) : 0
    };
  }).sort((a, b) => b.actualMinutes - a.actualMinutes);

  const maxHours = Math.max(...subjectTimeData.map((d) => Math.max(d.actualHours, d.targetHours)), 6);

  // 3. 7-Day activity trend (from 6 days ago to today)
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = idx === 6 ? 'Hôm nay' : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];

    const tasksOnDay = tasks.filter((t) => {
      if (t.completedAt && t.completedAt.startsWith(dateStr)) return true;
      if (t.dueDate === dateStr) return true;
      return false;
    });

    const completed = tasks.filter((t) => t.completedAt && t.completedAt.startsWith(dateStr)).length;
    const minutes = tasksOnDay.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);

    return {
      date: dateStr,
      dayName,
      completed,
      minutes,
      hours: Number((minutes / 60).toFixed(1))
    };
  });

  const maxDailyMinutes = Math.max(...last7Days.map((d) => d.minutes), 60);

  // 4. Task type breakdown with domain colors
  const typeBreakdown = [
    { type: 'homework' as const, label: 'Bài tập về nhà', count: tasks.filter((t) => t.type === 'homework').length, color: '#3B82F6', barClass: 'bg-blue-500' },
    { type: 'exam_prep' as const, label: 'Ôn thi / Kiểm tra', count: tasks.filter((t) => t.type === 'exam_prep').length, color: '#EF4444', barClass: 'bg-rose-500' },
    { type: 'project' as const, label: 'Dự án / Thuyết trình', count: tasks.filter((t) => t.type === 'project').length, color: '#8B5CF6', barClass: 'bg-purple-500' },
    { type: 'reading' as const, label: 'Soạn bài / Đọc trước', count: tasks.filter((t) => t.type === 'reading').length, color: '#F59E0B', barClass: 'bg-amber-500' },
    { type: 'revision' as const, label: 'Ôn tập củng cố', count: tasks.filter((t) => t.type === 'revision').length, color: '#10B981', barClass: 'bg-emerald-500' },
  ].filter((item) => item.count > 0);

  // Donut chart stroke math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  
  const completedDash = (completedCount / (totalTasks || 1)) * circumference;
  const inProgressDash = (inProgressCount / (totalTasks || 1)) * circumference;
  const reviewDash = (reviewCount / (totalTasks || 1)) * circumference;
  const todoDash = (todoCount / (totalTasks || 1)) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Thống Kê Tiến Độ Học Tập
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tổng quan hiệu suất hoàn thành bài tập và phân bổ thời gian học tập từng môn
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Cập nhật theo thời gian thực</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{totalTasks} nhiệm vụ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Biểu đồ 1: Tỷ lệ hoàn thành (Donut Chart) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Tỷ Lệ Hoàn Thành Nhiệm Vụ
              </h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {completedCount}/{totalTasks} đã xong
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center">
              <svg width="170" height="170" viewBox="0 0 170 170" className="rotate-[-90deg]">
                <circle
                  cx="85"
                  cy="85"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="14"
                  className="text-slate-100 dark:text-slate-800"
                />
                
                {/* Completed - Emerald */}
                {completedCount > 0 && (
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="14"
                    strokeDasharray={`${completedDash} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}

                {/* In Progress - Blue */}
                {inProgressCount > 0 && (
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="14"
                    strokeDasharray={`${inProgressDash} ${circumference}`}
                    strokeDashoffset={-completedDash}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}

                {/* Review - Purple */}
                {reviewCount > 0 && (
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke="#A855F7"
                    strokeWidth="14"
                    strokeDasharray={`${reviewDash} ${circumference}`}
                    strokeDashoffset={-(completedDash + inProgressDash)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}

                {/* Todo - Amber */}
                {todoCount > 0 && (
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    strokeDasharray={`${todoDash} ${circumference}`}
                    strokeDashoffset={-(completedDash + inProgressDash + reviewDash)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums dark:text-white">
                  {completionPct}%
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Hoàn tất
                </span>
              </div>
            </div>

            {/* Legend with percentages */}
            <div className="w-full sm:w-auto space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">Đã hoàn thành</span>
                </div>
                <span className="font-mono tabular-nums font-bold text-emerald-800 dark:text-emerald-300">
                  {completedCount} ({totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-2xs" />
                  <span className="font-semibold text-blue-900 dark:text-blue-200">Đang học & làm bài</span>
                </div>
                <span className="font-mono tabular-nums font-bold text-blue-800 dark:text-blue-300">
                  {inProgressCount} ({totalTasks ? Math.round((inProgressCount / totalTasks) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-2xs" />
                  <span className="font-semibold text-purple-900 dark:text-purple-200">Chờ nộp / rà soát</span>
                </div>
                <span className="font-mono tabular-nums font-bold text-purple-800 dark:text-purple-300">
                  {reviewCount} ({totalTasks ? Math.round((reviewCount / totalTasks) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-2xs" />
                  <span className="font-semibold text-amber-900 dark:text-amber-200">Cần chuẩn bị</span>
                </div>
                <span className="font-mono tabular-nums font-bold text-amber-800 dark:text-amber-300">
                  {todoCount} ({totalTasks ? Math.round((todoCount / totalTasks) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ 2: Hoạt động 7 ngày gần nhất (Bar / Activity Chart) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Thời Lượng Học 7 Ngày Gần Nhất
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              Phút học mỗi ngày
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {last7Days.map((day, idx) => {
              const heightPercent = Math.max(8, Math.round((day.minutes / maxDailyMinutes) * 100));
              const isToday = idx === 6;

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
                  onMouseEnter={() => setActiveTooltip(`day-${idx}`)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Tooltip on hover */}
                  {activeTooltip === `day-${idx}` && (
                    <div className="absolute bottom-full mb-2 z-20 rounded bg-slate-900 px-2 py-1 text-[11px] text-white shadow-md dark:bg-slate-800 whitespace-nowrap">
                      <p className="font-medium">{day.dayName} ({formatDateVN(day.date)})</p>
                      <p className="text-slate-300 font-mono tabular-nums">
                        {day.minutes} phút · {day.completed} bài xong
                      </p>
                    </div>
                  )}

                  {/* Value on top of bar */}
                  <span className="text-[10px] font-mono tabular-nums text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {day.minutes > 0 ? `${day.minutes}m` : '0'}
                  </span>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-md overflow-hidden flex flex-col justify-end h-28">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday
                          ? 'bg-indigo-600 dark:bg-indigo-500'
                          : 'bg-indigo-400/80 group-hover:bg-indigo-500 dark:bg-indigo-600/70'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day label */}
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isToday
                        ? 'text-indigo-600 font-bold dark:text-indigo-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
            Dữ liệu ghi nhận từ các phiên học Pomodoro và bài tập hoàn thành
          </p>
        </div>

      </div>

      {/* Biểu đồ 3: Phân bổ thời lượng học theo Môn (Horizontal Bar Comparison) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Thời Gian Học So Với Mục Tiêu Tuần Theo Môn
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-blue-600 dark:bg-blue-500" />
              <span>Đã học thực tế</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-slate-700" />
              <span>Mục tiêu tuần</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {subjectTimeData.map((item) => {
            const actualPercent = Math.min(100, Math.round((item.actualHours / maxHours) * 100));
            const targetPercent = Math.min(100, Math.round((item.targetHours / maxHours) * 100));

            return (
              <div key={item.subject.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.subject.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.subject.name}
                    </span>
                    <span className="text-slate-400">({item.taskCount} bài)</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.actualHours}h
                    </span>
                    <span className="text-slate-400">/ {item.targetHours}h mục tiêu</span>
                    <span
                      className={`text-[11px] font-medium ml-1 ${
                        item.percentOfTarget >= 100
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      ({item.percentOfTarget}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar dual layer */}
                <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                  {/* Target line indicator or background */}
                  <div
                    className="absolute top-0 bottom-0 bg-slate-300/70 dark:bg-slate-700 rounded-full"
                    style={{ width: `${targetPercent}%` }}
                  />
                  {/* Actual progress */}
                  <div
                    className="absolute top-0 bottom-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${actualPercent}%`,
                      backgroundColor: item.subject.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biểu đồ 4: Phân bố Loại bài tập & Tóm tắt đánh giá */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loại bài tập */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Cơ Cấu Thể Loại Nhiệm Vụ
          </h3>
          <div className="space-y-3">
            {typeBreakdown.map((item) => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
                      {item.count} bài ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mẹo phân bổ thời gian học hiệu quả */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Gợi Ý Phân Bổ Thời Khóa Biểu
              </h3>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Phương pháp cuốn chiếu:</strong> Giải quyết các bài tập có hạn nộp trong 24h trước khi mở bài tập mới.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Kỹ thuật Pomodoro:</strong> 25 phút giải bài tập trung + 5 phút nghỉ giúp não bộ duy trì khả năng ghi nhớ công thức tốt nhất.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Cân bằng môn tự nhiên & xã hội:</strong> Xen kẽ môn Toán/Lý với Văn/Anh trong cùng buổi tối để tránh mỏi mệt.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Tự giác · Kỷ luật · Hiệu quả</span>
            <span className="font-mono tabular-nums">Phiên bản học sinh 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
