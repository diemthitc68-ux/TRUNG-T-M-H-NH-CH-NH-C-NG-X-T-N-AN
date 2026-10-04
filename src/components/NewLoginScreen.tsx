import React, { useState } from 'react';
import { QrCode, Lock, User, ArrowRight } from 'lucide-react';

export const NewLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('ĐĂNG NHẬP');

  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center p-4">
      <div className="bg-[#fffdf0] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-2 border-red-800">
        {/* Header */}
        <div className="bg-red-700 p-6 flex items-center gap-4 border-b-4 border-yellow-500">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-2xl">★</span>
            </div>
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl uppercase tracking-wider">HỆ THỐNG GIÁO DỤC CHÍNH TRỊ</h1>
            <p className="text-yellow-200 font-medium">QUÂN ĐỘI NHÂN DÂN VIỆT NAM</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* QR Section */}
          <div className="flex-1 flex flex-col items-center border-r border-dashed border-slate-300 pr-8">
            <h3 className="text-red-900 font-bold text-sm mb-4">QUÉT MÃ ĐỂ VÀO XEM (KHÁCH)</h3>
            <div className="w-40 h-40 bg-white p-2 border border-slate-200 shadow-inner mb-4">
               {/* QR Placeholder */}
               <div className="w-full h-full bg-slate-900"></div>
            </div>
            <div className="bg-red-50 text-red-900 px-3 py-1 rounded font-mono text-sm border border-red-200">
              http://172.20.10.4:5173
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1">
            <div className="flex gap-2 mb-6">
              {['ĐĂNG NHẬP', 'ĐK CHIẾN SĨ', 'ĐK CÁN BỘ'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-red-900 font-bold text-xs uppercase mb-1 block">Tên đăng nhập</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="text-red-900 font-bold text-xs uppercase mb-1 block">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:border-red-500 outline-none"
                />
              </div>
              <button className="w-full py-4 bg-red-800 text-white font-bold rounded-xl hover:bg-red-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                TRUY CẬP <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
