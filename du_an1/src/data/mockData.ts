import { Subject, StudyTask } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-math',
    name: 'Toán học',
    code: 'TOAN',
    color: '#3B82F6', // Blue
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    targetWeeklyHours: 6,
    teacher: 'Thầy Hoàng Văn Minh',
    room: 'Phòng 201'
  },
  {
    id: 'sub-lit',
    name: 'Ngữ văn',
    code: 'VAN',
    color: '#EC4899', // Pink
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    textColor: 'text-pink-700 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-800',
    targetWeeklyHours: 4,
    teacher: 'Cô Trần Thu Trang',
    room: 'Phòng 104'
  },
  {
    id: 'sub-eng',
    name: 'Tiếng Anh',
    code: 'ENG',
    color: '#10B981', // Emerald
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    targetWeeklyHours: 5,
    teacher: 'Ms. Emily Nguyễn',
    room: 'Lab Ngoại Ngữ'
  },
  {
    id: 'sub-phys',
    name: 'Vật lý',
    code: 'LY',
    color: '#8B5CF6', // Violet
    bgLight: 'bg-violet-50 dark:bg-violet-950/40',
    textColor: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-200 dark:border-violet-800',
    targetWeeklyHours: 4,
    teacher: 'Thầy Lê Đức Thắng',
    room: 'Phòng 302'
  },
  {
    id: 'sub-chem',
    name: 'Hóa học',
    code: 'HOA',
    color: '#F59E0B', // Amber
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    targetWeeklyHours: 3.5,
    teacher: 'Cô Vũ Bích Ngọc',
    room: 'Phòng Thí Nghiệm'
  },
  {
    id: 'sub-bio',
    name: 'Sinh học',
    code: 'SINH',
    color: '#06B6D4', // Cyan
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    targetWeeklyHours: 2.5,
    teacher: 'Thầy Đỗ Quang Huy',
    room: 'Phòng 203'
  },
  {
    id: 'sub-info',
    name: 'Tin học',
    code: 'TIN',
    color: '#6366F1', // Indigo
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    targetWeeklyHours: 3,
    teacher: 'Thầy Phạm Duy',
    room: 'Phòng Máy 1'
  },
  {
    id: 'sub-his',
    name: 'Lịch sử & Địa lý',
    code: 'SU-DIA',
    color: '#D97706', // Warm Ochre
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
    targetWeeklyHours: 2.5,
    teacher: 'Cô Mai Lan Anh',
    room: 'Phòng 102'
  }
];

// Helper to get formatted date string offset from today
const getOffsetDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Giải bài tập Hình học không gian (Bài 1, 2, 3 SGK)',
    description: 'Tính khoảng cách từ điểm đến mặt phẳng và góc giữa hai đường thẳng chéo nhau.',
    subjectId: 'sub-math',
    status: 'in_progress',
    priority: 'high',
    type: 'homework',
    dueDate: getOffsetDate(1),
    dueTime: '21:00',
    dayOfWeek: 2,
    estimatedMinutes: 60,
    actualMinutes: 45,
    checklist: [
      { id: 'c1', text: 'Vẽ hình chóp tứ giác đều chuẩn', done: true },
      { id: 'c2', text: 'Chứng minh vuông góc theo định lý 3 đường vuông góc', done: true },
      { id: 'c3', text: 'Tính tỷ số lượng giác góc nhị diện', done: false }
    ],
    notes: 'Xem lại ví dụ trang 45 sách giáo khoa',
    createdAt: getOffsetDate(-2)
  },
  {
    id: 'task-2',
    title: 'Soạn bài Văn bản: Phân tích tâm trạng Thúy Kiều',
    description: 'Đọc kỹ đoạn trích Kiều ở lầu Ngưng Bích, trả lời các câu hỏi đọc hiểu phần Hướng dẫn học bài.',
    subjectId: 'sub-lit',
    status: 'todo',
    priority: 'medium',
    type: 'reading',
    dueDate: getOffsetDate(2),
    dueTime: '20:00',
    dayOfWeek: 3,
    estimatedMinutes: 50,
    actualMinutes: 0,
    checklist: [
      { id: 'c4', text: 'Đọc diễn cảm 2 lần đoạn trích', done: false },
      { id: 'c5', text: 'Ghi chép biện pháp tả cảnh ngụ tình', done: false },
      { id: 'c6', text: 'Viết đoạn văn ngắn cảm nhận 8 câu cuối', done: false }
    ],
    notes: 'Chuẩn bị để phát biểu xây dựng bài trên lớp',
    createdAt: getOffsetDate(-1)
  },
  {
    id: 'task-3',
    title: 'Luyện 50 câu trắc nghiệm Thì Hiện tại hoàn thành & Quá khứ đơn',
    description: 'Unit 4 Grammar Exercise: Phân biệt Present Perfect và Past Simple trong các ngữ cảnh nâng cao.',
    subjectId: 'sub-eng',
    status: 'completed',
    priority: 'high',
    type: 'homework',
    dueDate: getOffsetDate(0),
    dueTime: '17:00',
    dayOfWeek: 1,
    estimatedMinutes: 45,
    actualMinutes: 50,
    checklist: [
      { id: 'c7', text: 'Làm câu 1 đến 25', done: true },
      { id: 'c8', text: 'Làm câu 26 đến 50', done: true },
      { id: 'c9', text: 'Check đáp án và ghi chú câu sai vào sổ tay', done: true }
    ],
    score: 9.2,
    notes: 'Sai 4 câu phần trạng từ chỉ thời gian yet/already',
    createdAt: getOffsetDate(-3),
    completedAt: getOffsetDate(0)
  },
  {
    id: 'task-4',
    title: 'Ôn tập chương Dao động điều hòa & Con lắc lò xo',
    description: 'Hệ thống hóa công thức chu kỳ, tần số góc, vận tốc, gia tốc và phương trình li độ.',
    subjectId: 'sub-phys',
    status: 'review',
    priority: 'high',
    type: 'exam_prep',
    dueDate: getOffsetDate(3),
    dueTime: '19:30',
    dayOfWeek: 4,
    estimatedMinutes: 90,
    actualMinutes: 75,
    checklist: [
      { id: 'c10', text: 'Vẽ sơ đồ tư duy Mindmap chương 1', done: true },
      { id: 'c11', text: 'Giải đề thi thử 30 câu trường Chuyên', done: true },
      { id: 'c12', text: 'Nhờ thầy chữa câu 38 về đồ thị lực đàn hồi', done: false }
    ],
    notes: 'Lịch kiểm tra 1 tiết vào thứ 6 tuần này!',
    createdAt: getOffsetDate(-4)
  },
  {
    id: 'task-5',
    title: 'Cân bằng phản ứng Oxi hóa - Khử phương pháp thăng bằng electron',
    description: '15 phương trình phản ứng có môi trường axit HNO3 và H2SO4 đặc nóng.',
    subjectId: 'sub-chem',
    status: 'in_progress',
    priority: 'medium',
    type: 'homework',
    dueDate: getOffsetDate(2),
    dueTime: '21:30',
    dayOfWeek: 3,
    estimatedMinutes: 60,
    actualMinutes: 30,
    checklist: [
      { id: 'c13', text: 'Xác định số oxi hóa biến đổi', done: true },
      { id: 'c14', text: 'Viết quá trình khử và quá trình oxi hóa', done: false },
      { id: 'c15', text: 'Nhân hệ số chéo và đếm nguyên tử', done: false }
    ],
    createdAt: getOffsetDate(-1)
  },
  {
    id: 'task-6',
    title: 'Viết chương trình Python tính chu vi & diện tích đa giác',
    description: 'Thực hành lập trình cấu trúc rẽ nhánh if-else và vòng lặp for trong Python.',
    subjectId: 'sub-info',
    status: 'completed',
    priority: 'low',
    type: 'project',
    dueDate: getOffsetDate(-1),
    dueTime: '18:00',
    dayOfWeek: 7,
    estimatedMinutes: 40,
    actualMinutes: 40,
    checklist: [
      { id: 'c16', text: 'Thiết kế thuật toán lưu tọa độ đỉnh', done: true },
      { id: 'c17', text: 'Viết hàm tính khoảng cách Euclid', done: true },
      { id: 'c18', text: 'Chạy thử nghiệm với 5 bộ test', done: true }
    ],
    score: 10,
    createdAt: getOffsetDate(-5),
    completedAt: getOffsetDate(-1)
  },
  {
    id: 'task-7',
    title: 'Ôn tập cơ chế nguyên phân, giảm phân và đột biến nhiễm sắc thể',
    description: 'So sánh sự khác nhau giữa giảm phân I và giảm phân II, ý nghĩa di truyền học.',
    subjectId: 'sub-bio',
    status: 'todo',
    priority: 'medium',
    type: 'revision',
    dueDate: getOffsetDate(4),
    dueTime: '20:30',
    dayOfWeek: 5,
    estimatedMinutes: 45,
    actualMinutes: 0,
    checklist: [
      { id: 'c19', text: 'Xem lại sơ đồ các kỳ phân bào', done: false },
      { id: 'c20', text: 'Làm bảng đối chiếu NST đơn và kép', done: false }
    ],
    createdAt: getOffsetDate(0)
  },
  {
    id: 'task-8',
    title: 'Chuẩn bị bài thuyết trình Lịch sử phong trào Cần Vương',
    description: 'Làm slide PowerPoint về diễn biến, lãnh tụ tiêu biểu (Phan Đình Phùng) và nguyên nhân thất bại.',
    subjectId: 'sub-his',
    status: 'todo',
    priority: 'low',
    type: 'project',
    dueDate: getOffsetDate(5),
    dueTime: '22:00',
    dayOfWeek: 6,
    estimatedMinutes: 80,
    actualMinutes: 20,
    checklist: [
      { id: 'c21', text: 'Tìm tư liệu tranh ảnh khởi nghĩa Hương Khê', done: true },
      { id: 'c22', text: 'Thiết kế bố cục 10 slide chính', done: false },
      { id: 'c23', text: 'Phân công bạn Thảo phần mở đầu', done: false }
    ],
    createdAt: getOffsetDate(-1)
  }
];
