import React from 'react';
import { Search, FileText, User, Building2, BookOpen, ClipboardList } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PortalInterfaceProps {
  onLoginClick: () => void;
}

export const PortalInterface = ({ onLoginClick }: PortalInterfaceProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-700 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2">
            <div className="w-full h-full bg-red-600 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase">ỦY BAN NHÂN DÂN XÃ TÂN AN</h1>
            <h2 className="text-3xl font-bold uppercase">HỆ THỐNG VĂN BẢN XÃ TÂN AN</h2>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-red-600 text-white py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex gap-8 px-6 font-semibold">
          {['Trang chủ', 'Văn bản đến', 'Văn bản đi', 'Tra cứu', 'Thủ tục hành chính', 'Hướng dẫn'].map(item => (
            <a key={item} href="#" className="hover:text-yellow-200">{item}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-100 to-red-50 p-12">
        <div className="max-w-6xl mx-auto flex items-center gap-12">
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-red-900 mb-4">Công khai – Minh bạch – Hiệu quả</h3>
            <p className="text-red-800 mb-8">Hệ thống văn bản giúp tra cứu, quản lý và cập nhật các văn bản của Ủy ban xã Tân An một cách nhanh chóng, chính xác và thuận tiện.</p>
            <div className="flex bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden">
                <input type="text" placeholder="Nhập từ khóa cần tìm..." className="flex-1 p-4 outline-none" />
                <button className="bg-red-700 text-white px-8 font-bold">Tìm kiếm</button>
            </div>
          </div>
          <div className="w-1/3 bg-red-200 h-64 rounded-lg"></div>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-6xl mx-auto p-12 grid grid-cols-4 gap-6">
        {[
            {icon: FileText, title: 'Văn bản đến'},
            {icon: ClipboardList, title: 'Văn bản đi'},
            {icon: Search, title: 'Tra cứu'},
            {icon: Building2, title: 'Thủ tục hành chính'}
        ].map(item => (
            <div key={item.title} className="bg-red-50 p-6 rounded-xl flex flex-col items-center text-center shadow">
                <item.icon className="w-16 h-16 text-red-600 mb-4" />
                <h4 className="font-bold text-red-900 mb-2">{item.title}</h4>
                <p className="text-sm text-red-700">Tra cứu, xem chi tiết các văn bản.</p>
            </div>
        ))}
        
        {/* Login */}
        <div className="col-span-1 bg-red-50 p-6 rounded-xl border border-red-200">
            <button 
              onClick={onLoginClick}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold mb-4 flex items-center justify-center gap-2"
            >
                <User /> ĐĂNG NHẬP
            </button>
            <div className="w-full h-40 bg-white border border-red-200 flex items-center justify-center">
                <QRCodeSVG value="https://hethongvanban.tanan.gov.vn" size={140} />
            </div>
            <p className="text-center text-sm mt-2">Quét mã QR để truy cập hệ thống</p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-red-700 text-white p-6 mt-12">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
              <div className="w-10 h-10 border-2 rounded-full"></div>
              <div>
                  <p className="font-bold">ỦY BAN XÃ TÂN AN</p>
                  <p className="text-sm italic">Vì người dân phục vụ</p>
              </div>
          </div>
      </footer>
    </div>
  );
};
