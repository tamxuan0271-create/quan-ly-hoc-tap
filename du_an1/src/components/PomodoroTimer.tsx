import React, { useState, useEffect, useRef } from 'react';
import { StudyTask, Subject } from '../types';
import { playNotificationSound } from '../utils/storage';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Clock, Volume2 } from 'lucide-react';

interface PomodoroTimerProps {
  tasks: StudyTask[];
  subjects: Subject[];
  activeTask?: StudyTask | null;
  onRecordStudyTime: (taskId: string, minutes: number) => void;
  onClose?: () => void;
}

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  subjects,
  activeTask: initialActiveTask,
  onRecordStudyTime,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialActiveTask?.id || '');
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update selected task if prop changes
  useEffect(() => {
    if (initialActiveTask) {
      setSelectedTaskId(initialActiveTask.id);
    }
  }, [initialActiveTask]);

  // Switch mode
  const handleSwitchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playNotificationSound();

            if (mode === 'pomodoro') {
              setCompletedSessions((c) => c + 1);
              // Log 25 minutes of study time to task
              if (selectedTaskId) {
                onRecordStudyTime(selectedTaskId, 25);
              }
              // Switch to short break or long break (every 4th session)
              const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
              setMode(nextMode);
              return MODE_DURATIONS[nextMode];
            } else {
              setMode('pomodoro');
              return MODE_DURATIONS.pomodoro;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedTaskId, completedSessions, onRecordStudyTime]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentDuration = MODE_DURATIONS[mode];
  const progressPercent = ((currentDuration - timeLeft) / currentDuration) * 100;

  const currentTask = tasks.find((t) => t.id === selectedTaskId);
  const currentSubject = currentTask ? subjects.find((s) => s.id === currentTask.subjectId) : null;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-xl dark:bg-slate-800 max-w-md mx-auto mb-6">
        <button
          onClick={() => handleSwitchMode('pomodoro')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'pomodoro'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Học Tập Trung (25p)
        </button>
        <button
          onClick={() => handleSwitchMode('shortBreak')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'shortBreak'
              ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Nghỉ Ngắn (5p)
        </button>
        <button
          onClick={() => handleSwitchMode('longBreak')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === 'longBreak'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Nghỉ Dài (15p)
        </button>
      </div>

      {/* Task Selector for Study Session */}
      <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Gán phiên học vào nhiệm vụ:
        </label>
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">-- Chọn bài tập đang học (để tích lũy giờ học) --</option>
          {tasks
            .filter((t) => t.status !== 'completed')
            .map((t) => {
              const subj = subjects.find((s) => s.id === t.subjectId);
              return (
                <option key={t.id} value={t.id}>
                  [{subj?.name || 'Môn'}] {t.title}
                </option>
              );
            })}
        </select>

        {currentTask && currentSubject && (
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: currentSubject.color }}
              />
              <span className="font-semibold">{currentSubject.name}:</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentTask.title}</span>
            </div>
            <span className="font-mono tabular-nums shrink-0">
              Đã học: {currentTask.actualMinutes}m
            </span>
          </div>
        )}
      </div>

      {/* Center Clock Visual Ring */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center">
          <svg width="220" height="220" className="rotate-[-90deg]">
            <circle
              cx="110"
              cy="110"
              r="94"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="110"
              cy="110"
              r="94"
              fill="transparent"
              stroke={
                mode === 'pomodoro' ? '#6366F1' : mode === 'shortBreak' ? '#10B981' : '#3B82F6'
              }
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 94}
              strokeDashoffset={2 * Math.PI * 94 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
              {formattedTime}
            </span>
            <span className="mt-1 text-xs font-medium text-slate-400">
              {isRunning
                ? mode === 'pomodoro'
                  ? 'Đang tập trung giải bài...'
                  : 'Thời gian thư giãn mắt...'
                : 'Đang tạm dừng'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Đặt lại thời gian"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="h-6 w-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              playNotificationSound();
              if (mode === 'pomodoro') {
                handleSwitchMode('shortBreak');
              } else {
                handleSwitchMode('pomodoro');
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            title="Bỏ qua phiên này"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Completed Sessions Indicator */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>Đã hoàn thành {completedSessions} phiên tập trung hôm nay</span>
        </div>
      </div>
    </div>
  );
};
