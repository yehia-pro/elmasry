'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Hourglass, 
  AlertCircle, 
  Calendar, 
  Clock, 
  FileText, 
  UploadCloud, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Printer,
  Sparkles,
  Phone
} from 'lucide-react';
import MedicalTicket from '@/components/MedicalTicket';
import DocumentViewerModal from '@/components/DocumentViewerModal';
import SpotlightTour, { TourStep } from '@/components/SpotlightTour';

const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    target: 'header-card',
    title: 'لوحة متابعة حساب الطالب 🎓',
    description: 'من هنا يمكنك متابعة حالة طلبك وتفاصيل الرقم القومي وموعد الكشف المعتمد.',
    badge: 'ملفك الشخصي',
  },
  {
    target: 'status-box',
    title: 'حالة تدقيق واعتماد الطلب 🔍',
    description: 'توضح هذه الخانة ما إذا كان طلبك قيد مراجعة المستندات أو تم اعتماده رسمياً، أو في حال طُلب منك توضيح مستند.',
    badge: 'متابعة المراجعة',
  },
  {
    target: 'docs-summary',
    title: 'معرض المستندات والشهادات 📑',
    description: 'يمكنك معاينة كافة الصور والشهادات التي قمت برفعها وتكبيرها بدقة عالية.',
    badge: 'المستندات',
  },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

  // Re-upload state for correction
  const [reuploading, setReuploading] = useState(false);
  const [reuploadSuccess, setReuploadSuccess] = useState('');
  const [reuploadError, setReuploadError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.user) {
          router.push('/student/login');
          return;
        }
        if (data.user.studentProfile) {
          setStudent({
            ...data.user.studentProfile,
            fullName: data.user.fullName,
            nationalId: data.user.nationalId,
          });
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReuploading(true);
    setReuploadSuccess('');
    setReuploadError('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('docType', docType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'فشل رفع الملف');

      setReuploadSuccess('تم إعادة رفع المستند بنجاح! جاري إرساله لإعادة التدقيق.');
      
      // Refresh page data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setReuploadError(err.message);
    } finally {
      setReuploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Hourglass className="w-10 h-10 text-institute-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">جاري تحميل بيانات حساب الطالب...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-800">لم يتم العثور على ملف تسجيل مرتبط بهذا الحساب</h2>
        <Link
          href="/"
          className="bg-institute-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow"
        >
          تسجيل طلب جديد الآن
        </Link>
      </div>
    );
  }

  const isApproved = student.status === 'APPROVED' || student.status === 'COMPLETED_FIT' || student.status === 'COMPLETED_UNFIT';
  const isPending = student.status === 'PENDING_REVIEW';
  const isCorrection = student.status === 'NEEDS_CORRECTION';

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Interactive Spotlight Tour */}
      <SpotlightTour steps={DASHBOARD_TOUR_STEPS} tourKey="elmasry_student_tour_done" />

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4" data-tour="header-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-institute-700 mb-1">
            <Building2 className="w-4 h-4" />
            <span>المعهد الفني الصناعي - بوابة شؤون الطلاب الطبية</span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">
            ملف الطالب: {student.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5">
            الرقم القومي: {student.nationalId} | الشعبة: {student.department || 'العامة'}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {isPending && (
            <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold shadow-sm" data-tour="status-box">
              <Hourglass className="w-5 h-5 text-amber-600 animate-spin" />
              <span>قيد المراجعة والتدقيق</span>
            </div>
          )}

          {isApproved && (
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold shadow-sm" data-tour="status-box">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>معتمد ومقبول للكشف الطبي</span>
            </div>
          )}

          {isCorrection && (
            <div className="bg-red-50 border-2 border-red-300 text-red-900 px-5 py-2.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold shadow-sm" data-tour="status-box">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>مطلوب تعديل مستند</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. STATE: PENDING REVIEW */}
      {isPending && (
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 rounded-3xl p-8 border-2 border-amber-200 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-inner">
              <Hourglass className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-bold text-amber-950">
                يتم الآن مراجعة وتدقيق بياناتك وصور المستندات
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                تم استلام طلبك ومقعدك محجوز بنجاح في موعد الكشف المحدد. تقوم لجنة شؤون الطلاب الآن بمطابقة بطاقة الرقم القومي والمستندات المرفوعة. فور اعتماد الطلب ستتمكن من طباعة بطاقة الحجز الرسمية.
              </p>
            </div>
          </div>

          {/* Reserved Appointment Info */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block font-medium">تاريخ الكشف المحجوز:</span>
              <span className="font-bold text-slate-800 text-base flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-institute-600" />
                {student.appointment?.date || 'غير محدد'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">ساعة الكشف المحجوزة:</span>
              <span className="font-bold text-slate-800 text-base flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                {student.appointment?.timeSlot?.substring(0, 5) || 'غير محدد'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-medium">حالة السعة:</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                مقعدك محجوز ومؤمن
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATE: APPROVED -> Show Official Medical Ticket */}
      {isApproved && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-extrabold">
                  تهانينا! تمت الموافقة واعتماد حجز الكشف الطبي رسمياً
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  يرجى طباعة الاستمارة وبطاقة الحجز أدناه واصطحابها معك يوم الكشف الطبي مع أصل بطاقة الرقم القومي.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الاستمارة الآن</span>
            </button>
          </div>

          {/* Render Medical Ticket Component */}
          <MedicalTicket student={student} />
        </div>
      )}

      {/* 3. STATE: NEEDS CORRECTION */}
      {isCorrection && (
        <div className="bg-red-50 rounded-3xl p-8 border-2 border-red-200 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-heading font-bold text-red-950">
                مطلوب إعادة رفع أو توضيح مستند
              </h3>
              <p className="text-xs sm:text-sm text-red-800">
                ملاحظات إدارة المعهد: <strong>{student.reviewNotes || 'يرجى إعادة رفع صورة واضحة للمستند المرفوض.'}</strong>
              </p>
            </div>
          </div>

          {reuploadSuccess && (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold">
              {reuploadSuccess}
            </div>
          )}

          {reuploadError && (
            <div className="p-4 bg-red-100 text-red-800 rounded-xl text-sm font-semibold">
              {reuploadError}
            </div>
          )}

          {/* Quick Re-upload Box */}
          <div className="bg-white p-5 rounded-2xl border border-red-200">
            <h4 className="font-bold text-sm text-slate-800 mb-2">إعادة رفع المستند المطلوب:</h4>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*,application/pdf"
                disabled={reuploading}
                onChange={(e) => handleReupload(e, 'مستند مصحح')}
                className="hidden"
              />
              <div className="py-3 px-4 border-2 border-dashed border-red-300 hover:border-red-500 rounded-xl text-center text-xs font-bold text-red-700 bg-red-50/50 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>{reuploading ? 'جاري الرفع...' : 'اضغط لاختيار المستند الصحيح ورفعه فوراً'}</span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4" data-tour="docs-summary">
        <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-institute-600" />
          المستندات والصور المرفوعة في ملفك
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {student.documents?.map((doc: any, idx: number) => (
            <div
              key={doc.id || idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:border-institute-300 transition-colors"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.fileUrl}
                  alt={doc.docType}
                  className="w-12 h-12 object-cover rounded-xl border border-slate-300 shrink-0"
                />
                <div className="truncate">
                  <span className="font-bold text-xs text-slate-900 block truncate">{doc.docType}</span>
                  <span className="text-[11px] text-slate-500 truncate block">{doc.fileName}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocIndex(idx)}
                className="p-2 text-institute-600 hover:bg-institute-100 rounded-xl transition-colors"
                title="معاينة المستند"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Document Lightbox Modal */}
      {selectedDocIndex !== null && student.documents && (
        <DocumentViewerModal
          documents={student.documents}
          initialIndex={selectedDocIndex}
          isOpen={true}
          onClose={() => setSelectedDocIndex(null)}
        />
      )}

    </div>
  );
}
