'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  GraduationCap, 
  ArrowDown, 
  Stethoscope,
  Compass,
  MapPin,
  ExternalLink
} from 'lucide-react';
import StudentRegistrationWizard from '@/components/StudentRegistrationWizard';
import SpotlightTour, { TourStep } from '@/components/SpotlightTour';

const HOME_TOUR_STEPS: TourStep[] = [
  {
    target: 'hero-banner',
    title: 'أهلاً بك في بوابة الكشف الطبي 🏛️',
    description: 'مكانك الرسمي لتسجيل رغبتك وحجز ميعاد الكشف الطبي بالمعهد الفني الصناعي ببورسعيد للعام الجامعي 2026/2027.',
    badge: 'مرحباً بك',
  },
  {
    target: 'navbar-auth-btn',
    title: 'طالب مستجد ولا سجلت قبل كده؟ 🔑',
    description: 'لو دي أول مرة: مش محتاج تبحث عن "إنشاء حساب"؛ الاستمارة بالأسفل هي اللي بتنشئ لك حسابك تلقائياً مع حجز موعدك! أما زر "تسجيل الدخول" هنا فمخصص للطلاب اللي حجزوا بالفعل وعايزين يطبعوا تذكرتهم أو يتابعوا موافقة المعهد.',
    badge: 'توضيح مهم جداً',
  },
  {
    target: 'stepper',
    title: 'خطوات الحجز وإنشاء الحساب 📝',
    description: 'أربع خطوات بسيطة ومتتالية: إدخال بياناتك واختيار كلمة سر لحسابك، تصوير أوراقك، اختيار الميعاد اللي يناسبك، واستلام تذكرتك مباشرة.',
    badge: 'خطوات بسيطة',
  },
  {
    target: 'personal-details',
    title: '1. بياناتك وكلمة السر لحسابك الجديد 👤',
    description: 'اكتب رقم بطاقتك الـ 14 رقم لتعبئة ميلادك ومحافظتك تلقائياً، واختر كلمة سر لحسابك عشان تسجل دخولك بيها لاحقاً لمتابعة طلبك.',
    badge: 'الخطوة الأولى',
  },
  {
    target: 'docs-upload',
    title: '2. تصوير الأوراق المطلوبة 📸',
    description: 'صور بطاقتك وشهادتك بموبايلك في إضاءة واضحة وارفعهم هنا مباشرة، وسيتم تجهيز الصور ورفعها بسرعة وسلاسة.',
    badge: 'الخطوة الثانية',
  },
  {
    target: 'slots-booking',
    title: '3. اختيار يوم وساعة الكشف ⏰',
    description: 'اختر الميعاد المناسب لك. كل ساعة بتستقبل 20 طالب كحد أقصى عشان تدخل تكشف علطول بدون أي زحام أو طوابير.',
    badge: 'الخطوة الثالثة',
  },
  {
    target: 'guidelines-box',
    title: '4. تعليمات وأوراق يوم الكشف 📋',
    description: 'بعد تأكيد حجزك، اطبع استمارة الكشف الطبي وتأكد من إحضار الأوراق الموضحة هنا معك عند الحضور للمعهد.',
    badge: 'الخطوة الرابعة',
  },
];

export default function HomePage() {
  const triggerTour = () => {
    window.dispatchEvent(new CustomEvent('start-spotlight-tour'));
  };

  return (
    <div className="space-y-16 pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Interactive Spotlight Tour */}
      <SpotlightTour steps={HOME_TOUR_STEPS} tourKey="elmasry_home_tour_v5" />

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
            <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
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
              حجز موعد الكشف الطبي للطلاب الجدد
            </p>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              سجل بياناتك وارفع أوراقك بسهولة، واحجز ميعاد الكشف الطبي اللي يناسبك عشان تحضر للمعهد في ميعادك بدون أي زحمة أو انتظار.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#registration-form"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-heading font-bold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>بدء حجز موعد الكشف الآن</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>

            <Link
              href="/student/login"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-heading font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <FileCheck2 className="w-5 h-5" />
              <span>استرجاع وطباعة التذكرة 📄</span>
            </Link>

            <button
              onClick={triggerTour}
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-4 rounded-2xl font-heading font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>دليل الحجز السريع 🧭</span>
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

      {/* Institute Location & Directions Card */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-900/50 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-700/50">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>عنوان مقر المعهد وإرشادات الوصول</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                المعهد الفني الصناعي ببورسعيد
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                📍 <strong>العنوان:</strong> بورسعيد - حي المناخ - مساكن الكويت - بجوار المجمع التعليمي.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                🚌 <strong>للطلاب المغتربين:</strong> من موقف بورسعيد العمومي الجديد أو محطة قطار بورسعيد، استقل سيارة سرفيس (المناخ - مساكن الكويت) أو تاكسي مباشرة للمعهد الفني الصناعي.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href="https://maps.google.com/?q=المعهد+الفني+الصناعي+ببورسعيد"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>فتح الموقع على خرائط Google</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
