'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, Sparkles, QrCode as QrIcon } from 'lucide-react';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/19YzKftH31/';

interface FacebookQrCardProps {
  variant?: 'compact' | 'full';
}

export default function FacebookQrCard({ variant = 'full' }: FacebookQrCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(FACEBOOK_PAGE_URL, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#1e40af', // Deep official royal blue
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating Facebook QR:', err));
  }, []);

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
        {qrDataUrl && (
          <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 shadow-inner shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR Code لصفحة فيسبوك" className="w-full h-full object-contain" />
          </div>
        )}
        <div className="text-right flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>صفحة المعهد الرسمية</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">امسح الكود بالموبايل أو اضغط هنا</p>
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
          >
            <span>زيارة الصفحة</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-slate-800 shadow-xl relative overflow-hidden text-right">
      
      {/* Background Accent glow */}
      <div className="absolute top-0 -left-10 w-48 h-48 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left / Center Info */}
        <div className="space-y-3 flex-1">
          
          <div className="inline-flex items-center gap-2 bg-blue-100/80 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>الصفحة الرسمية المعتمدة للمعهد على فيسبوك</span>
          </div>

          <h3 className="text-lg sm:text-xl font-heading font-extrabold text-slate-900 dark:text-white">
            المعهد الفني الصناعي ببورسعيد - فيسبوك الرسمي
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            تابع كافة أخبار الكشف الطبي، مواعيد التنسيق، الجداول الدراسية، والتعليمات الصادرة من إدارة المعهد والكلية التكنولوجية ببورسعيد أولاً بأول.
          </p>

          <div className="pt-2">
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>فتح الصفحة الرسمية على Facebook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center text-center shrink-0 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
          {qrDataUrl ? (
            <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR Code لمتابعة صفحة المعهد الفني الصناعي ببورسعيد على فيسبوك"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
              <QrIcon className="w-8 h-8 animate-pulse" />
            </div>
          )}
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2.5 block">
            امسح بكاميرا الهاتف 📱
          </span>
          <span className="text-[10px] text-slate-400">للانتقال السريع للصفحة</span>
        </div>

      </div>

    </div>
  );
}
