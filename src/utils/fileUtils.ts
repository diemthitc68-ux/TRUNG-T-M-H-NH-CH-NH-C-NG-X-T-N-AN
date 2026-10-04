/**
 * Tạo và tải xuống một tệp văn bản từ phía client.
 * Tương đương với logic Python đã cung cấp.
 */
export const saveTextFile = (fileName: string, content: string) => {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Đã bắt đầu tải xuống tệp: '${fileName}'!`);
  } catch (e) {
    console.error(`Đã xảy ra lỗi khi tạo file: ${e}`);
  }
};
