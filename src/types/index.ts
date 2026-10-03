export type MemberRole =
  | 'Giám đốc Trung tâm Hành chính công'
  | 'Lãnh đạo UBND'
  | 'Bộ phận Một cửa'
  | 'Công chức Tư pháp - Hộ tịch'
  | 'Công chức Địa chính - Xây dựng'
  | 'Công chức Văn phòng - Thống kê'
  | 'Công chức Văn hóa - Xã hội'
  | 'Công chức Tài chính - Kế toán'
  | 'Chỉ huy trưởng Quân sự'
  | 'Trưởng Công an xã'
  | string;

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  notes?: string;
  createdAt: string;
}

export type DocumentStatus = 'Mới tiếp nhận' | 'Đang xử lý' | 'Chờ phê duyệt' | 'Đã hoàn thành';

export type PriorityLevel = 'Thường' | 'Khẩn' | 'Thượng khẩn' | 'Hỏa tốc';

export type DocumentType =
  | 'Công văn'
  | 'Quyết định'
  | 'Thông báo'
  | 'Tờ trình'
  | 'Kế hoạch'
  | 'Báo cáo'
  | 'Giấy mời'
  | 'Đơn kiến nghị / Phản ánh';

export type DocumentKind = 'Văn bản đến' | 'Văn bản đi';

export interface NoteLog {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
}

export interface OfficialDocument {
  id: string;
  number: string; // Số/Ký hiệu, e.g. 142/UBND-VP
  kind: DocumentKind;
  docType: DocumentType;
  summary: string; // Trích yếu
  sender: string; // Cơ quan gửi hoặc người nộp
  receiver?: string; // Nơi nhận / Người ký
  assignee: string; // Cán bộ thụ lý (tên)
  assigneeRole?: string;
  receivedDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  priority: PriorityLevel;
  status: DocumentStatus;
  notes: string;
  history: NoteLog[];
  completedAt?: string;
}
