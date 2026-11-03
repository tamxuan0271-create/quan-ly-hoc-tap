import React from 'react';
import { Plus, Sun, Moon, Sparkles, BookOpen, Clock, BarChart3, RotateCcw } from 'lucide-react';
import { BoardViewMode } from '../types';

interface NavbarProps {
  activeTab: 'board' | 'stats' | 'pomodoro';
  setActiveTab: (tab: 'board' | 'stats' | 'pomodoro') => void;
  boardMode: BoardViewMode;
  setBoardMode: (mode: BoardViewMode) => void;
  onOpenNewTaskModal: () => void;
  onOpenSubjectModal: () => void;
  onResetData: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  boardMode,
  setBoardMode,
  onOpenNewTaskModal,
  onOpenSubjectModal,
  onResetData,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-600/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap dark:text-white">
            EduPlan
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line prose links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('board')}
            className={`whitespace-nowrap transition-colors ${
              activeTab === 'board'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lịch Học & Bài Tập
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap transition-colors ${
              activeTab === 'stats'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Biểu Đồ Thống Kê
          </button>

          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`whitespace-nowrap transition-colors ${
              activeTab === 'pomodoro'
                ? 'text-indigo-600 font-semibold dark:text-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Đồng Hồ Tập Trung
          </button>

          <button
            onClick={onOpenSubjectModal}
            className="whitespace-nowrap hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Môn Học
          </button>

          <button
            onClick={() => {
              if (window.confirm('Khôi phục lại dữ liệu mẫu bài tập và môn học?')) {
                onResetData();
              }
            }}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Mẫu gốc</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            title={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Thêm Nhiệm Vụ</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex border-t border-slate-200 md:hidden bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 overflow-x-auto px-4 py-2 gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('board')}
          className={`whitespace-nowrap py-1 ${
            activeTab === 'board'
              ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Lịch học
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`whitespace-nowrap py-1 ${
            activeTab === 'stats'
              ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Thống kê
        </button>
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`whitespace-nowrap py-1 ${
            activeTab === 'pomodoro'
              ? 'text-indigo-600 font-semibold dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={onOpenSubjectModal}
          className="whitespace-nowrap py-1 text-slate-600 dark:text-slate-400"
        >
          Môn học
        </button>
      </div>
    </header>
  );
};
