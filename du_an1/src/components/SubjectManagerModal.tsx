import React, { useState } from 'react';
import { Subject, StudyTask } from '../types';
import { X, Plus, Trash2, Edit2, BookOpen } from 'lucide-react';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  tasks: StudyTask[];
  onSaveSubjects: (subjects: Subject[]) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#D97706', // Orange
  '#14B8A6', // Teal
  '#EF4444', // Red
];

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  tasks,
  onSaveSubjects,
}) => {
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [targetWeeklyHours, setTargetWeeklyHours] = useState(4);
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingSubjectId('new');
    setName('');
    setCode('');
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setTargetWeeklyHours(4);
    setTeacher('');
    setRoom('');
  };

  const handleStartEdit = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setName(subj.name);
    setCode(subj.code);
    setColor(subj.color);
    setTargetWeeklyHours(subj.targetWeeklyHours);
    setTeacher(subj.teacher || '');
    setRoom(subj.room || '');
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubjectId === 'new') {
      const newSubject: Subject = {
        id: 'sub-' + Date.now(),
        name: name.trim(),
        code: code.trim().toUpperCase() || name.substring(0, 4).toUpperCase(),
        color,
        bgLight: 'bg-slate-50 dark:bg-slate-800',
        textColor: 'text-slate-800 dark:text-slate-200',
        borderColor: 'border-slate-200 dark:border-slate-800',
        targetWeeklyHours: Number(targetWeeklyHours) || 3,
        teacher: teacher.trim() || undefined,
        room: room.trim() || undefined,
      };
      onSaveSubjects([...subjects, newSubject]);
    } else if (editingSubjectId) {
      const updated = subjects.map((s) => {
        if (s.id === editingSubjectId) {
          return {
            ...s,
            name: name.trim(),
            code: code.trim().toUpperCase() || s.code,
            color,
            targetWeeklyHours: Number(targetWeeklyHours) || 3,
            teacher: teacher.trim() || undefined,
            room: room.trim() || undefined,
          };
        }
        return s;
      });
      onSaveSubjects(updated);
    }

    setEditingSubjectId(null);
  };

  const handleDeleteSubject = (subjId: string) => {
    const taskCount = tasks.filter((t) => t.subjectId === subjId).length;
    if (taskCount > 0) {
      if (!window.confirm(`Môn này đang có ${taskCount} nhiệm vụ học tập. Bạn vẫn muốn xóa chứ?`)) {
        return;
      }
    }
    onSaveSubjects(subjects.filter((s) => s.id !== subjId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quản Lý Danh Sách Môn Học
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thiết lập mục tiêu giờ học hàng tuần và thông tin giáo viên bộ môn
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Add / Edit Form if active */}
        {editingSubjectId && (
          <form onSubmit={handleSaveForm} className="mt-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {editingSubjectId === 'new' ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tên môn học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Toán học nâng cao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mã môn viết tắt
                </label>
                <input
                  type="text"
                  placeholder="VD: TOAN-NC"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mục tiêu giờ học/tuần
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="40"
                  step="0.5"
                  value={targetWeeklyHours}
                  onChange={(e) => setTargetWeeklyHours(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Giáo viên phụ trách
                </label>
                <input
                  type="text"
                  placeholder="VD: Thầy Nguyễn Văn A"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phòng học / Địa điểm
                </label>
                <input
                  type="text"
                  placeholder="VD: Phòng 204"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Màu đại diện
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                      color === c ? 'scale-110 border-slate-900 dark:border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Lưu môn học
              </button>
            </div>
          </form>
        )}

        {/* Subjects List Table */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Danh sách hiện có ({subjects.length} môn)
            </span>
            {!editingSubjectId && (
              <button
                onClick={handleStartAdd}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm môn mới</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800 overflow-hidden">
            {subjects.map((subj) => {
              const taskCount = tasks.filter((t) => t.subjectId === subj.id).length;
              return (
                <div
                  key={subj.id}
                  className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: subj.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {subj.name}
                        </span>
                        <span className="text-slate-400 font-mono">({subj.code})</span>
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {subj.teacher || 'Chưa có GV'} · {subj.room || 'Phòng học chính'} · {subj.targetWeeklyHours}h/tuần · {taskCount} bài tập
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(subj)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      title="Xóa môn"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
