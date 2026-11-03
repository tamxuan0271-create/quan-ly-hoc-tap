export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'homework' | 'exam_prep' | 'project' | 'reading' | 'revision';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Hex color
  bgLight: string;
  textColor: string;
  borderColor: string;
  targetWeeklyHours: number;
  teacher?: string;
  room?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  dayOfWeek?: number; // 1 (Thứ 2) to 7 (Chủ Nhật)
  estimatedMinutes: number;
  actualMinutes: number;
  checklist: ChecklistItem[];
  score?: number; // e.g., 9.0
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export type BoardViewMode = 'status' | 'weekday' | 'subject';

export interface DayStudyLog {
  date: string; // YYYY-MM-DD
  minutes: number;
  completedTasks: number;
}
