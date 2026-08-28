'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles, 
  ArrowDown, 
  Stethoscope,
  Compass
} from 'lucide-react';
import StudentRegistrationWizard from '@/components/StudentRegistrationWizard';
import SpotlightTour, { TourStep } from '@/components/SpotlightTour';

const HOME_TOUR_STEPS: TourStep[] = [
  {
    target: 'hero-banner',
    title: 'أهلاً بك في بوابة الكشف الطبي!',
    description: 'المنظومة الإلكترونية الرسمية لطلاب المعهد الفني الصناعي ببورسعيد لتسجيل البيانات وحجز موعد الكشف الطبي بكل سهولة.',
    badge: 'خطوة 1 من 4',
  },
  {
    target: 'stepper',
    title: 'خطوات التسجيل الأربعة',
    description: 'ينقسم التسجيل إلى 4 خطوات بسيطة: إدخال البيانات الشخصية، رفع المستندات، حجز الموعد بسعة 20 طالب بالساعة، ثم اعتماد الطلب.',
    badge: 'خطوة 2 من 4',
  },
  {
    target: 'personal-details',
    title: 'الرقم القومي المصري والبيانات',
    description: 'عند كتابة الرقم القومي، يستخرج النظام تلقائياً تاريخ الميلاد والمحافظة والنوع للتحقق الفوري ومنع الأخطاء.',
    badge: 'خطوة 3 من 4',
  },
  {
    target: 'guidelines-box',
    title: 'تعليمات الحضور للعيادة الطبية',
    description: 'تعرف على الأوراق والشهادات المطلوبة إحضارها معك يوم الكشف الطبي بمقر المعهد ببورسعيد.',
    badge: 'خطوة 4 من 4',
  },
];

export default function HomePage() {
  const triggerTour = () => {
    window.dispatchEvent(new CustomEvent('start-spotlight-tour'));
  };

  return (
    <div className="space-y-16 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Interactive Spotlight Tour */}
      <SpotlightTour steps={HOME_TOUR_STEPS} tourKey="elmasry_home_tour_v4" />

      {/* Hero Section with Vibrant Light & Dark Support */}
      <section 
        data-tour="hero-banner"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800"
      >
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Institute Tag Badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-blue-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>بوابة التنسيق وحجز الكشف الطبي للعام الجامعي 2026 / 2027</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                المعهد الفني الصناعي
              </span>
              <span className="bg-blue-600 text-white font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl px-4 py-1 rounded-2xl shadow-lg shadow-blue-600/20 border border-blue-400 inline-block">
                ببورسعيد
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-200 text-lg sm:text-2xl font-heading font-bold mt-2">
              المنظومة الإلكترونية لتسجيل الطلاب المستجدين وحجز اللجان الطبية
            </p>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              خدمة رقمية موحدة للكلية التكنولوجية ببورسعيد تتيح تسجيل البيانات بدقة، رفع المستندات، وحجز موعد الكشف الطبي بحد أقصى (20 طالباً في الساعة) لتوفير أقصى درجات الراحة والانضباط.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#registration-form"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-heading font-bold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>بدء استمارة التسجيل والحجز الآن</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>

            <button
              onClick={triggerTour}
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-4 rounded-2xl font-heading font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>تشغيل الجولة الإرشادية 🧭</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 text-right">
            <div className="bg-white dark:bg-slate-900/90 shadow-sm border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">انضباط المواعيد</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">20 طالباً فقط في الساعة الواحدة</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 shadow-sm border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">مراجعة رسمية للإدارة</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">تدقيق مسبق للشهادات والصور</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 shadow-sm border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">بطاقة حجز معتمدة</h4>
                <p className="text-xs text-slate-400">طباعة فورية بـ QR Code وباركود</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Registration Wizard Section */}
      <section id="registration-form" className="scroll-mt-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            الاستمارة الإلكترونية الموحدة
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            تسجيل بيانات الطالب وحجز موعد الكشف الطبي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            المعهد الفني الصناعي ببورسعيد - قم بتعبئة البيانات ورفع الصور ليتم مراجعتها واعتماد بطاقة حضور الكشف
          </p>
        </div>

        {/* Wizard Component */}
        <StudentRegistrationWizard />
      </section>

      {/* Clinic Guidelines Section */}
      <section id="guidelines" className="max-w-6xl mx-auto px-4 pt-10" data-tour="guidelines-box">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 transition-colors duration-300">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              تعليمات وإرشادات الحضور للجان الكشف الطبي ببورسعيد
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              يرجى قراءة الإرشادات بعناية لضمان إنهاء إجراءات الكشف الطبي بسهولة ويسر.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">المستندات المطلوبة يوم الحضور</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li>• أصل بطاقة الرقم القومي + 2 صورة ضوئية منها.</li>
                <li>• استمارة وبطاقة الكشف الطبي المطبوعة من هذا الموقع.</li>
                <li>• عدد 2 صورة شخصية حديثة مقاس (4×6) بخلفية بيضاء.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">الانضباط في الموعد المحدد</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li>• التواجد بالعيادة الطبية قبل الموعد بـ 15 دقيقة على الأقل.</li>
                <li>• لا يُسمح بدخول العيادة إلا للطلاب المسجلين في الساعة المحددة (20 طالباً فقط).</li>
                <li>• الالتزام بالنظام والهدوء التام داخل لجان الفحص.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">فحوصات اللياقة الطبية بالمعهد</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li>• كشف الباطنة والقلب وقياس ضغط الدم.</li>
                <li>• كشف الرمد والقدرة البصرية وفحص تمييز الألوان للشعب الفنية.</li>
                <li>• كشف الجراحة العامة وسلامة الأطراف.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
