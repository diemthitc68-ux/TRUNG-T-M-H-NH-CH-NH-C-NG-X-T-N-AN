import React, { useState } from 'react';
import { saveTextFile } from '../utils/fileUtils';
import { toast } from './ToastProvider';
import { Save } from 'lucide-react';

export const TextEditor: React.FC = () => {
  const [fileName, setFileName] = useState('van_ban_moi.txt');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung văn bản!');
      return;
    }
    saveTextFile(fileName, content);
    toast.success('Đã lưu văn bản thành công!');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h3 className="text-lg font-bold text-red-900 mb-4">Soạn thảo và lưu văn bản</h3>
      
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Tên tệp tin:</label>
        <input 
          id="fileName"
          type="text" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none"
          placeholder="van_ban_moi.txt"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung:</label>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8} 
          className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" 
          placeholder="Nhập nội dung văn bản tại đây..."
        />
      </div>
      
      <button 
        onClick={handleSave}
        className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-800 transition-colors"
      >
        <Save className="w-4 h-4"/> Lưu file
      </button>
    </div>
  );
};
