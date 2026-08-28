'use client';

import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface DocumentViewerModalProps {
  documents: {
    id: string;
    docType: string;
    fileUrl: string;
    fileName: string;
  }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewerModal({
  documents,
  initialIndex = 0,
  isOpen,
  onClose,
}: DocumentViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !documents || documents.length === 0) return null;

  const currentDoc = documents[currentIndex] || documents[0];
  const isImage = currentDoc.fileUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || currentDoc.fileUrl.includes('res.cloudinary.com') || currentDoc.fileUrl.startsWith('/uploads/');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % documents.length);
    setZoom(1);
    setRotation(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + documents.length) % documents.length);
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-institute-600/30 rounded-xl text-institute-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{currentDoc.docType}</h3>
              <p className="text-xs text-slate-400">
                مستند {currentIndex + 1} من أصل {documents.length} ({currentDoc.fileName})
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200"
                  title="تدوير"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            )}

            <a
              href={currentDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200"
              title="فتح الرابط المباشر / تنزيل"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors mr-2"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Main View Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950/60 relative">
          {documents.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg z-10 transition-transform active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg z-10 transition-transform active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}

          {isImage ? (
            <div
              className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentDoc.fileUrl}
                alt={currentDoc.docType}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          ) : (
            <iframe
              src={currentDoc.fileUrl}
              title={currentDoc.docType}
              className="w-full h-full rounded-xl bg-white"
            />
          )}
        </div>

        {/* Thumbnail Selector Bottom Bar */}
        {documents.length > 1 && (
          <div className="p-3 bg-slate-800/90 border-t border-slate-700 flex items-center justify-center gap-3 overflow-x-auto">
            {documents.map((doc, idx) => (
              <button
                key={doc.id || idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoom(1);
                  setRotation(0);
                }}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  idx === currentIndex
                    ? 'border-institute-400 scale-105 shadow-md shadow-institute-500/20'
                    : 'border-slate-700 opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.fileUrl}
                  alt={doc.docType}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
