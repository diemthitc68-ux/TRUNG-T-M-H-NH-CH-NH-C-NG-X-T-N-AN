import React from 'react';
import { Member, OfficialDocument } from '../types';
import { X, CheckCircle, Signature } from 'lucide-react';

interface SignDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  document: OfficialDocument;
  onSign: (docId: string, signerName: string) => void;
}

export const SignDocumentModal: React.FC<SignDocumentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  document,
  onSign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
            <Signature className="w-5 h-5" /> Ký số văn bản
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>
        <p className="text-sm text-slate-600 mb-6">Đồng chí xác nhận ký số cho văn bản <strong>{document.number}</strong>?</p>
        <button 
          onClick={() => { onSign(document.id, currentUser.name); onClose(); }}
          className="w-full py-2 bg-red-900 text-white rounded font-bold text-sm hover:bg-red-800 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Xác nhận ký số
        </button>
      </div>
    </div>
  );
};
