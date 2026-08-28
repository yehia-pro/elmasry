import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, HeartPulse, Clock, ExternalLink } from 'lucide-react';
import FacebookQrCard from './FacebookQrCard';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Top Feature: Official Facebook QR Card */}
        <FacebookQrCard variant="full" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          
          {/* Col 1: Institute Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/institute-logo.svg" 
                alt="شعار المعهد الفني الصناعي ببورسعيد" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <span className="font-heading font-extrabold text-slate-900 dark:text-white text-base block">
                  المعهد الفني الصناعي
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">ببورسعيد</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              منظومة الحجز والتسجيل الطبي للطلاب المستجدين - الكلية التكنولوجية ببورسعيد، التابعة لوزارة التعليم العالي والبحث العلمي.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>نظام حجز إلكتروني رسمي ومؤمن 24/7</span>
            </div>
          </div>

          {/* Col 2: Clinic Working Hours */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              مواعيد العمل باللجان الطبية
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>• الأيام: من الأحد إلى الخميس</li>
              <li>• ساعات العمل: من 09:00 صباحاً حتى 03:00 مساءً</li>
              <li>• الحد الأقصى: 20 طالباً لكل ساعة تفادياً للتزاحم</li>
              <li>• الحضور قبل الموعد بـ 15 دقيقة بالاستمارة المطبوعة</li>
            </ul>
          </div>

          {/* Col 3: Required Checklist */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              متطلبات يوم الكشف
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>• استمارة وبطاقة حجز الكشف الطبي المطبوعة من الموقع</li>
              <li>• أصل بطاقة الرقم القومي + صورة ضوئية</li>
              <li>• عدد 2 صورة شخصية حديثة (4×6) بخلفية بيضاء</li>
              <li>• إيصال سداد رسوم الكشف الطبي بالمعهد</li>
            </ul>
          </div>

          {/* Col 4: Contact & Official Page */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
              مقر المعهد والتواصل
            </h4>
            <div className="text-xs space-y-2.5 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>بورسعيد - مبنى المعهد الفني الصناعي - العيادة الطبية</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span dir="ltr">+20 66 322 0000 / 19000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>medical@portsaid-tech.edu.eg</span>
              </div>
              <a 
                href="https://www.facebook.com/share/19YzKftH31/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>صفحة فيسبوك الرسمية</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} المعهد الفني الصناعي ببورسعيد - جميع الحقوق محفوظة.</p>
          <p className="mt-2 sm:mt-0">بوابة التسجيل وحجز الكشف الطبي الإلكتروني 2.0</p>
        </div>
      </div>
    </footer>
  );
}
