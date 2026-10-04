import { Member, OfficialDocument } from '../types';

// Cấu hình tài khoản Quản trị viên
export const ADMIN_ACCOUNT = {
  username: "Huỳnh Phú Kính", // Đổi tên đăng nhập tại đây
  password: "admin123",       // Đổi mật khẩu mới tại đây (ví dụ: "TanAn@2026#")
  role: "Giám đốc Trung tâm Hành chính công"
};

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'ADMIN-001',
    name: ADMIN_ACCOUNT.username,
    username: ADMIN_ACCOUNT.username,
    password: ADMIN_ACCOUNT.password,
    role: ADMIN_ACCOUNT.role,
    phone: '0988.999.888',
    email: 'kinhhp.hcc@tanan.gov.vn',
    notes: 'Quản trị viên hệ thống - Giám đốc Trung tâm Hành chính công',
    createdAt: '2026-01-01',
  },
];

export const INITIAL_DOCUMENTS: OfficialDocument[] = [];
