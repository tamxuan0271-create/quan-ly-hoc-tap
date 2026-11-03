import { StudyTask, Subject } from '../types';
import { INITIAL_SUBJECTS, INITIAL_TASKS } from '../data/mockData';

const TASKS_KEY = 'edulan_tasks_v1';
const SUBJECTS_KEY = 'edulan_subjects_v1';
const THEME_KEY = 'edulan_theme_v1';

export const loadTasks = (): StudyTask[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
};

export const saveTasks = (tasks: StudyTask[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
};

export const loadSubjects = (): Subject[] => {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) return INITIAL_SUBJECTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SUBJECTS;
  } catch (err) {
    console.error('Failed to load subjects', err);
    return INITIAL_SUBJECTS;
  }
};

export const saveSubjects = (subjects: Subject[]): void => {
  try {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.error('Failed to save subjects', err);
  }
};

export const loadTheme = (): 'light' | 'dark' => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
};

export const resetToDefaultData = (): { tasks: StudyTask[]; subjects: Subject[] } => {
  saveTasks(INITIAL_TASKS);
  saveSubjects(INITIAL_SUBJECTS);
  return { tasks: INITIAL_TASKS, subjects: INITIAL_SUBJECTS };
};

// Web Audio API gentle notification chime
export const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a friendly harmonic 2-tone chord
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playTone(523.25, 0, 0.35); // C5
    playTone(659.25, 0.15, 0.4); // E5
    playTone(783.99, 0.3, 0.6); // G5
  } catch (e) {
    console.log('Audio not supported or blocked by policy', e);
  }
};

// Formatting helpers
export const formatDateVN = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const getWeekdayVN = (dayNumber?: number): string => {
  switch (dayNumber) {
    case 1: return 'Thứ Hai';
    case 2: return 'Thứ Ba';
    case 3: return 'Thứ Tư';
    case 4: return 'Thứ Năm';
    case 5: return 'Thứ Sáu';
    case 6: return 'Thứ Bảy';
    case 7: return 'Chủ Nhật';
    default: return 'Linh hoạt';
  }
};

export const getStatusLabel = (status: StudyTask['status']): { label: string; textClass: string; bgClass: string } => {
  switch (status) {
    case 'todo':
      return { label: 'Cần làm', textClass: 'text-amber-700 dark:text-amber-300', bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    case 'in_progress':
      return { label: 'Đang học', textClass: 'text-blue-700 dark:text-blue-300', bgClass: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' };
    case 'review':
      return { label: 'Chờ nộp/soát', textClass: 'text-purple-700 dark:text-purple-300', bgClass: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' };
    case 'completed':
      return { label: 'Đã hoàn thành', textClass: 'text-emerald-700 dark:text-emerald-300', bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
  }
};

export const getPriorityLabel = (priority: StudyTask['priority']): { label: string; color: string } => {
  switch (priority) {
    case 'high':
      return { label: 'Ưu tiên cao', color: 'text-rose-600 dark:text-rose-400' };
    case 'medium':
      return { label: 'Bình thường', color: 'text-amber-600 dark:text-amber-400' };
    case 'low':
      return { label: 'Ưu tiên thấp', color: 'text-slate-500 dark:text-slate-400' };
  }
};

export const getTypeLabel = (type: StudyTask['type']): string => {
  switch (type) {
    case 'homework': return 'Bài tập về nhà';
    case 'exam_prep': return 'Ôn thi / Kiểm tra';
    case 'project': return 'Dự án / Thuyết trình';
    case 'reading': return 'Soạn bài / Đọc trước';
    case 'revision': return 'Ôn tập củng cố';
  }
};
