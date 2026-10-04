import { toast } from '../components/ToastProvider';

/**
 * Giả lập dịch vụ gửi email thông báo.
 * Trong thực tế, đây sẽ là một API gọi đến server gửi mail.
 */
export const sendEmailNotification = (
  email: string,
  subject: string,
  content: string
) => {
  console.log(`[Giả lập gửi mail] Đến: ${email} | Tiêu đề: ${subject} | Nội dung: ${content}`);
  
  // Tích hợp với toast để thông báo cho người dùng (hoặc cán bộ đang vận hành hệ thống)
  toast.success(`Đã gửi email thông báo tới: ${email}`);
};
