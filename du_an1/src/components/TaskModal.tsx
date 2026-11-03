import React, { useState, useEffect } from 'react';
import { StudyTask, Subject, TaskPriority, TaskStatus, TaskType, ChecklistItem } from '../types';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: StudyTask) => void;
  initialTask?: StudyTask | null;
  defaultValues?: Partial<StudyTask>;
  subjects: Subject[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultValues,
  subjects,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [type, setType] = useState<TaskType>('homework');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('21:00');
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState<string>('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Sync state when opening modal
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setSubjectId(initialTask.subjectId);
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setType(initialTask.type);
      setDueDate(initialTask.dueDate);
      setDueTime(initialTask.dueTime || '21:00');
      setDayOfWeek(initialTask.dayOfWeek || 1);
      setEstimatedMinutes(initialTask.estimatedMinutes || 45);
      setNotes(initialTask.notes || '');
      setScore(initialTask.score !== undefined ? String(initialTask.score) : '');
      setChecklist(initialTask.checklist || []);
    } else {
      // Default new task
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDueDate = tomorrow.toISOString().split('T')[0];
      const todayDay = new Date().getDay() === 0 ? 7 : new Date().getDay();

      setTitle('');
      setDescription('');
      setSubjectId(defaultValues?.subjectId || subjects[0]?.id || '');
      setStatus(defaultValues?.status || 'todo');
      setPriority(defaultValues?.priority || 'medium');
      setType(defaultValues?.type || 'homework');
      setDueDate(defaultValues?.dueDate || defaultDueDate);
      setDueTime(defaultValues?.dueTime || '21:00');
      setDayOfWeek(defaultValues?.dayOfWeek || todayDay);
      setEstimatedMinutes(defaultValues?.estimatedMinutes || 45);
      setNotes('');
      setScore('');
      setChecklist([]);
    }
  }, [initialTask, defaultValues, subjects, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: 'c_' + Date.now(),
        text: newChecklistText.trim(),
        done: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskToSave: StudyTask = {
      id: initialTask?.id || 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      subjectId,
      status,
      priority,
      type,
      dueDate,
      dueTime,
      dayOfWeek: Number(dayOfWeek),
      estimatedMinutes: Number(estimatedMinutes) || 30,
      actualMinutes: initialTask?.actualMinutes || 0,
      checklist,
      notes: notes.trim() || undefined,
      score: score.trim() !== '' ? Number(score) : undefined,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
      completedAt: status === 'completed' ? (initialTask?.completedAt || new Date().toISOString()) : undefined,
    };

    onSave(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialTask ? 'Chỉnh Sửa Nhiệm Vụ Học Tập' : 'Thêm Bài Tập & Lịch Học Mới'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Điền thông tin bài học, hạn nộp và các bước thực hiện
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tiêu đề bài học / nhiệm vụ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Giải bài tập Hình học không gian SGK trang 45..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Row: Subject, Type, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Môn học
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Thể loại bài
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="homework">Bài tập về nhà</option>
                <option value="exam_prep">Ôn thi / Kiểm tra</option>
                <option value="project">Dự án / Thuyết trình</option>
                <option value="reading">Soạn bài / Đọc trước</option>
                <option value="revision">Ôn tập củng cố</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Trạng thái tiến độ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="todo">Cần chuẩn bị</option>
                <option value="in_progress">Đang học & làm bài</option>
                <option value="review">Chờ nộp / Rà soát</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Row: Priority, Day of Week, Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="high">Ưu tiên cao (Gấp)</option>
                <option value="medium">Bình thường</option>
                <option value="low">Ưu tiên thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ngày trong tuần (TKB)
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value={1}>Thứ Hai</option>
                <option value={2}>Thứ Ba</option>
                <option value={3}>Thứ Tư</option>
                <option value={4}>Thứ Năm</option>
                <option value={5}>Thứ Sáu</option>
                <option value={6}>Thứ Bảy</option>
                <option value={7}>Chủ Nhật</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Thời gian dự kiến (phút)
              </label>
              <input
                type="number"
                min="5"
                max="360"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Row: Due Date & Due Time & Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hạn chót nộp bài
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Giờ nộp bài
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Điểm đánh giá (nếu có, thang 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="VD: 9.5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Chi tiết yêu cầu & Hướng dẫn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yêu cầu cụ thể của thầy cô, dạng bài, lưu ý..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Checklist: Các bước thực hiện */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Danh sách việc cần làm (Checklist mục tiêu)
            </label>
            
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0"
                    />
                    <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Thêm bước giải, câu hỏi cần làm..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Thêm mục
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              {initialTask ? 'Lưu Thay Đổi' : 'Tạo Nhiệm Vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
