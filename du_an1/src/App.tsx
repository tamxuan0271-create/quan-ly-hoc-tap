import React, { useState, useEffect } from 'react';
import { StudyTask, Subject, BoardViewMode, TaskStatus } from './types';
import { 
  loadTasks, 
  saveTasks, 
  loadSubjects, 
  saveSubjects, 
  loadTheme, 
  saveTheme, 
  resetToDefaultData 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ColumnBoard } from './components/ColumnBoard';
import { SimpleCharts } from './components/SimpleCharts';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskModal } from './components/TaskModal';
import { SubjectManagerModal } from './components/SubjectManagerModal';
import { Printer, Download, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<StudyTask[]>(loadTasks);
  const [subjects, setSubjects] = useState<Subject[]>(loadSubjects);
  const [darkMode, setDarkMode] = useState<boolean>(() => loadTheme() === 'dark');
  
  // Navigation tabs: 'board' | 'stats' | 'pomodoro'
  const [activeTab, setActiveTab] = useState<'board' | 'stats' | 'pomodoro'>('board');
  const [boardMode, setBoardMode] = useState<BoardViewMode>('status');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [taskModalDefaults, setTaskModalDefaults] = useState<Partial<StudyTask>>({});
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Active task currently tracked in Pomodoro
  const [pomodoroTask, setPomodoroTask] = useState<StudyTask | null>(null);

  // Apply dark mode class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      saveTheme('light');
    }
  }, [darkMode]);

  // Persist tasks & subjects
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  // Task actions
  const handleSaveTask = (taskToSave: StudyTask) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === taskToSave.id ? taskToSave : t)));
    } else {
      setTasks((prev) => [taskToSave, ...prev]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (pomodoroTask?.id === taskId) {
      setPomodoroTask(null);
    }
  };

  const handleToggleComplete = (task: StudyTask) => {
    const isNowCompleted = task.status !== 'completed';
    const updatedStatus: TaskStatus = isNowCompleted ? 'completed' : 'in_progress';
    const updatedTask: StudyTask = {
      ...task,
      status: updatedStatus,
      completedAt: isNowCompleted ? new Date().toISOString() : undefined,
    };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  const handleMoveStatus = (task: StudyTask, direction: 'prev' | 'next') => {
    const flow: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed'];
    const currentIndex = flow.indexOf(task.status);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= flow.length) nextIndex = flow.length - 1;

    const newStatus = flow[nextIndex];
    const updatedTask: StudyTask = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Record completed study minutes to task
  const handleRecordStudyTime = (taskId: string, minutes: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            actualMinutes: (t.actualMinutes || 0) + minutes,
            status: t.status === 'todo' ? 'in_progress' : t.status,
          };
        }
        return t;
      })
    );
  };

  const handleStartPomodoroOnTask = (task: StudyTask) => {
    setPomodoroTask(task);
    setActiveTab('pomodoro');
  };

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setTaskModalDefaults({});
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskWithDefaults = (defaults: Partial<StudyTask>) => {
    setEditingTask(null);
    setTaskModalDefaults(defaults);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleResetData = () => {
    const { tasks: defaultTasks, subjects: defaultSubjects } = resetToDefaultData();
    setTasks(defaultTasks);
    setSubjects(defaultSubjects);
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tasks,
      subjects,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduPlan_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print schedule
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        boardMode={boardMode}
        setBoardMode={setBoardMode}
        onOpenNewTaskModal={handleOpenNewTask}
        onOpenSubjectModal={() => setIsSubjectModalOpen(true)}
        onResetData={handleResetData}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Học kỳ I</span>
              <span aria-hidden="true">·</span>
              <span>Năm học 2026 - 2027</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Lớp 11 Chuyên
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              {activeTab === 'board'
                ? 'Lịch Học & Quản Lý Nhiệm Vụ'
                : activeTab === 'stats'
                ? 'Báo Cáo & Biểu Đồ Thống Kê'
                : 'Đồng Hồ Tập Trung Pomodoro'}
            </h1>
          </div>

          {/* Quick utility buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="In thời khóa biểu và danh sách bài tập"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">In Lịch Học</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Xuất sao lưu dữ liệu file JSON"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Xuất JSON</span>
            </button>
          </div>
        </div>

        {/* Global KPI Summary */}
        <StatsOverview tasks={tasks} subjects={subjects} />

        {/* Dynamic Main View */}
        {activeTab === 'board' && (
          <ColumnBoard
            tasks={tasks}
            subjects={subjects}
            viewMode={boardMode}
            setViewMode={setBoardMode}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onMoveStatus={handleMoveStatus}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenNewTaskModalWithDefaults={handleOpenNewTaskWithDefaults}
            onStartPomodoro={handleStartPomodoroOnTask}
          />
        )}

        {activeTab === 'stats' && (
          <SimpleCharts tasks={tasks} subjects={subjects} />
        )}

        {activeTab === 'pomodoro' && (
          <div className="py-4 space-y-6">
            <div className="text-center max-w-md mx-auto mb-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Rèn Luyện Khả Năng Tập Trung
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                25 phút tập trung cao độ giải bài tập, sau đó nghỉ 5 phút. Thời gian học sẽ được tự động cộng dồn vào biểu đồ thống kê môn học.
              </p>
            </div>

            <PomodoroTimer
              tasks={tasks}
              subjects={subjects}
              activeTask={pomodoroTask}
              onRecordStudyTime={handleRecordStudyTime}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 mt-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 EduPlan - Ứng dụng theo dõi học tập và lịch học cho học sinh phổ thông</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dữ liệu lưu an toàn trên trình duyệt</span>
            <span aria-hidden="true">·</span>
            <span>Không quảng cáo</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultValues={taskModalDefaults}
        subjects={subjects}
      />

      <SubjectManagerModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjects={subjects}
        tasks={tasks}
        onSaveSubjects={setSubjects}
      />
    </div>
  );
}
