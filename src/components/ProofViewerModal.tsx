import React from 'react';
import { ProofAttachment } from '../types/kpi';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

interface Props {
  attachment: ProofAttachment;
  onClose: () => void;
}

export const ProofViewerModal: React.FC<Props> = ({ attachment, onClose }) => {
  const isImage = attachment.fileType.startsWith('image/') || attachment.dataUrl.startsWith('data:image');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm truncate max-w-md">{attachment.name}</h3>
              <p className="text-[11px] text-slate-400">
                {attachment.fileSize} • Uploaded on {new Date(attachment.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={attachment.dataUrl}
              download={attachment.name}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </a>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100 min-h-[300px]">
          {isImage ? (
            <img
              src={attachment.dataUrl}
              alt={attachment.name}
              className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-md object-contain"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md">
              <FileText className="w-16 h-16 text-rose-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm mb-1">{attachment.name}</h4>
              <p className="text-xs text-slate-500 mb-4">{attachment.fileType} document preview</p>
              <a
                href={attachment.dataUrl}
                download={attachment.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
