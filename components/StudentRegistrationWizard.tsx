'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  UploadCloud, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Hourglass, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Trash2, 
  Eye, 
  ArrowRight
} from 'lucide-react';
import { parseEgyptianNationalId } from '@/lib/egyptian-national-id';
import { SlotAvailability } from '@/lib/types';

const EGYPTIAN_GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'بورسعيد', 'السويس', 'الإسماعيلية',
  'دمياط', 'الدقهلية', 'الشرقية', 'القليوبية', 'كفر الشيخ', 'الغربية',
  'المنوفية', 'البحيرة', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
  'مطروح', 'شمال سيناء', 'جنوب سيناء'
];

const DEPARTMENTS = [
  'الشعبة العامة',
  'شعبة الكهرباء والإلكترونيات',
  'شعبة الميكانيكا والتشغيل',
  'شعبة تكنولوجيا التبريد والتكييف',
  'شعبة صيانة الحاسبات ونظم التحكم',
  'شعبة السيارات والمحركات'
];

interface UploadedDoc {
  docType: string;
  fileUrl: string;
  publicId?: string;
  fileName: string;
}

export default function StudentRegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: 'مصري',
    nationalId: '',
    dob: '',
    governorate: 'بورسعيد',
    city: '',
    studentPhone: '',
    fatherPhone: '',
    motherPhone: '',
    email: '',
    height: '',
    weight: '',
    institute: 'المعهد الفني الصناعي ببورسعيد',
    level: 'الفرقة الأولى / المستجدين',
    department: 'الشعبة العامة',
    qualificationSource: 'من مصر',
    examType: 'الكشف الطبي للطلاب المستجدين',
    specialCategory: 'لا شيء مما سبق',
    password: '',
    confirmPassword: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  // National ID Validation Feedback
  const [nationalIdFeedback, setNationalIdFeedback] = useState<{
    valid?: boolean;
    gender?: string;
    gov?: string;
    dob?: string;
    msg?: string;
  }>({});

  // Document Uploads State
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

  // Appointment Slots State
  const [availableSlots, setAvailableSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Initialize Default Appointment Date (Next business day)
  useEffect(() => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 2);
    if (nextDate.getDay() === 5) nextDate.setDate(nextDate.getDate() + 2);
    if (nextDate.getDay() === 6) nextDate.setDate(nextDate.getDate() + 1);

    const dateStr = nextDate.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, appointmentDate: dateStr }));
  }, []);

  // Fetch Slots when appointmentDate changes
  useEffect(() => {
    if (!formData.appointmentDate) return;
    setLoadingSlots(true);
    fetch(`/api/slots?date=${formData.appointmentDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.slots) {
          setAvailableSlots(data.slots);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [formData.appointmentDate]);

  // Real-time National ID detection
  const handleNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 14);
    setFormData((prev) => ({ ...prev, nationalId: val }));

    if (val.length === 14 && formData.nationality === 'مصري') {
      const parsed = parseEgyptianNationalId(val);
      if (parsed.isValid && parsed.birthDate) {
        setNationalIdFeedback({
          valid: true,
          gender: parsed.gender,
          gov: parsed.governorate,
          dob: parsed.birthDate,
          msg: `تم التحقق: ${parsed.gender} - مواليد ${parsed.birthDate} - محافظة ${parsed.governorate}`,
        });
        setFormData((prev) => ({
          ...prev,
          dob: parsed.birthDate || prev.dob,
          governorate: parsed.governorate || prev.governorate,
        }));
      } else {
        setNationalIdFeedback({
          valid: false,
          msg: parsed.error || 'الرقم القومي غير مطابق للمواصفات المصرية',
        });
      }
    } else {
      setNationalIdFeedback({ valid: false });
    }
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocType(docType);
    setErrorMessage('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('docType', docType);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'فشل رفع الملف، يرجى المحاولة مرة أخرى');
      }

      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.docType !== docType);
        return [
          ...filtered,
          {
            docType,
            fileUrl: json.url,
            publicId: json.publicId,
            fileName: file.name,
          },
        ];
      });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setUploadingDocType(null);
    }
  };

  const removeDoc = (docType: string) => {
    setDocuments((prev) => prev.filter((d) => d.docType !== docType));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().split(/\s+/).length < 3) {
      setErrorMessage('يرجى إدخال اسم الطالب رباعياً على الأقل.');
      return false;
    }
    if (!formData.nationalId || formData.nationalId.length < 10) {
      setErrorMessage('يرجى إدخال الرقم القومي / جواز السفر بشكل صحيح.');
      return false;
    }
    if (formData.nationality === 'مصري' && !nationalIdFeedback.valid && formData.nationalId.length === 14) {
      const parsed = parseEgyptianNationalId(formData.nationalId);
      if (!parsed.isValid) {
        setErrorMessage(parsed.error || 'الرقم القومي غير صالح.');
        return false;
      }
    }
    if (!formData.studentPhone || formData.studentPhone.length < 10) {
      setErrorMessage('يرجى إدخال رقم تليفون الطالب بشكل صحيح.');
      return false;
    }
    if (!formData.fatherPhone || formData.fatherPhone.length < 10) {
      setErrorMessage('يرجى إدخال رقم تليفون ولي الأمر (الأب) بشكل صحيح.');
      return false;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMessage('كلمة المرور يجب ألا تقل عن 4 خانات.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const requiredTypes = [
      'بطاقة الرقم القومي (الوجه الأمامي)',
      'شهادة المؤهل الدراسي (الثانوية/الدبلوم)',
      'شهادة الميلاد المميكنة',
      'صورة شخصية حديثة (4×6)',
    ];

    for (const req of requiredTypes) {
      const exists = documents.some((d) => d.docType === req);
      if (!exists) {
        setErrorMessage(`يرجى رفع (${req}) قبل المتابعة.`);
        return false;
      }
    }
    return true;
  };

  // Step Navigation
  const handleNextStep = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Submit and Reserve Slot (ACID Transaction via API)
  const handleSubmit = async () => {
    setErrorMessage('');
    if (!formData.appointmentDate || !formData.appointmentTime) {
      setErrorMessage('يرجى تحديد موعد وساعة الكشف الطبي قبل التأكيد.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          documents,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشلت عملية الحجز والتسجيل.');
      }

      const confirmedData = data.student || data.profile || {
        fullName: formData.fullName,
        nationalId: formData.nationalId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      };

      setSuccessData(confirmedData);
      setCurrentStep(4);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      
      {/* Wizard Progress Stepper */}
      <div className="mb-10" data-tour="stepper">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {[
            { num: 1, title: 'البيانات الأساسية', desc: 'البيانات الشخصية والأكاديمية' },
            { num: 2, title: 'رفع المستندات', desc: 'الشهادات والصور المطلوبة' },
            { num: 3, title: 'حجز موعد الكشف', desc: 'أقصى سعة 20 طالب/الساعة' },
            { num: 4, title: 'تأكيد الحجز', desc: 'حالة الطلب والبطاقة الرسمية' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`p-3.5 rounded-2xl border text-center sm:text-right ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-500/20'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-white text-blue-800'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </span>
                  <span className="hidden sm:inline text-[10px] font-semibold opacity-80">
                    الخطوة {s.num}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm truncate">
                  {s.title}
                </h4>
                <p className="hidden md:block text-[11px] opacity-75 truncate">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="flex-1">{errorMessage}</p>
        </div>
      )}

      {/* STEP 1: Basic & Academic Details Form */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8" data-tour="personal-details">
          
          {/* Header Banner */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              بيانات الالتحاق والتسجيل - المعهد الفني الصناعي ببورسعيد
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              يرجى إدخال البيانات بدقة وفقاً لشهادة الميلاد وبطاقة الرقم القومي المصرية.
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                اسم الطالب رباعي (وفقاً لشهادة الميلاد) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="مثال: أحمد محمد علي حسن"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Nationality */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                الجنسية <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="مصري">مصري</option>
                <option value="وافد / أخرى">وافد / أخرى</option>
              </select>
            </div>

            {/* National ID */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>الرقم القومي (14 رقماً) / جواز السفر <span className="text-red-500">*</span></span>
                {nationalIdFeedback.valid && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم التحقق الآلي
                  </span>
                )}
              </label>
              <input
                type="text"
                dir="ltr"
                maxLength={14}
                value={formData.nationalId}
                onChange={handleNationalIdChange}
                placeholder="29901011234567"
                className={`w-full px-4 py-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 ${
                  nationalIdFeedback.valid
                    ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 text-slate-900 dark:text-white focus:ring-emerald-500'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-blue-500'
                }`}
              />
              {nationalIdFeedback.msg && (
                <p className={`text-xs ${nationalIdFeedback.valid ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-red-600 dark:text-red-400'}`}>
                  {nationalIdFeedback.msg}
                </p>
              )}
            </div>

            {/* Auto Detected info */}
            {nationalIdFeedback.valid && nationalIdFeedback.dob && (
              <div className="md:col-span-2 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">تاريخ الميلاد:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{nationalIdFeedback.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">المحافظة:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{nationalIdFeedback.gov}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">النوع:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{nationalIdFeedback.gender}</span>
                </div>
              </div>
            )}

            {/* Student Phone */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                رقم تليفون الطالب (محمول) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                dir="ltr"
                value={formData.studentPhone}
                onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                placeholder="01012345678"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Father Phone */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                رقم تليفون ولي الأمر (الأب) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                dir="ltr"
                value={formData.fatherPhone}
                onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                placeholder="01112345678"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mother Phone */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                رقم تليفون الأم (للتواصل في الحالات الطارئة)
              </label>
              <input
                type="tel"
                dir="ltr"
                value={formData.motherPhone}
                onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                placeholder="01212345678"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                dir="ltr"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">الطول (سم)</label>
                <input
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">الوزن (كجم)</label>
                <input
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Institute & Division */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">الكلية / المعهد</label>
              <input
                type="text"
                disabled
                value={formData.institute}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                القسم / الشعبة المقيد بها <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Qualification Source Radio */}
            <div className="space-y-2 md:col-span-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                حاصل على المؤهل (الثانوية / الدبلوم):
              </span>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
                  <input
                    type="radio"
                    name="qualificationSource"
                    value="من مصر"
                    checked={formData.qualificationSource === 'من مصر'}
                    onChange={(e) => setFormData({ ...formData, qualificationSource: e.target.value })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  من داخل جمهورية مصر العربية
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
                  <input
                    type="radio"
                    name="qualificationSource"
                    value="من خارج مصر"
                    checked={formData.qualificationSource === 'من خارج مصر'}
                    onChange={(e) => setFormData({ ...formData, qualificationSource: e.target.value })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  من خارج مصر (شهادة معادلة)
                </label>
              </div>
            </div>

            {/* Special Category Radios */}
            <div className="space-y-2 md:col-span-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                الفئات الخاصة وبرامج الرعاية والدعم:
              </span>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-800 dark:text-slate-200">
                {['لا شيء مما سبق', 'دمج', 'ذوي الاحتياجات الخاصة', 'تكافل وكرامة'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="specialCategory"
                      value={cat}
                      checked={formData.specialCategory === cat}
                      onChange={(e) => setFormData({ ...formData, specialCategory: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                كلمة السر للحساب <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">ستستخدمها للدخول لمتابعة طلبك وطباعة البطاقة</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                تأكيد كلمة السر <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>المتابعة إلى رفع المستندات</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Document & Image Uploads */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8" data-tour="docs-upload">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              رفع المرفقات والمستندات الرسمية (Cloud Storage)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              يرجى رفع صور واضحة للمستندات (بصيغة JPG أو PNG أو PDF - بحد أقصى 10 ميجابايت للملف).
            </p>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'بطاقة الرقم القومي (الوجه الأمامي)', required: true, desc: 'صورة واضحة للوجه الأمامي للبطاقة' },
              { type: 'بطاقة الرقم القومي (الوجه الخلفي)', required: false, desc: 'صورة الوجه الخلفي للبطاقة' },
              { type: 'شهادة المؤهل الدراسي (الثانوية/الدبلوم)', required: true, desc: 'أصل أو صورة طبق الأصل من الشهادة' },
              { type: 'شهادة الميلاد المميكنة', required: true, desc: 'شهادة ميلاد كمبيوتر حديثة' },
              { type: 'صورة شخصية حديثة (4×6)', required: true, desc: 'صورة واضحة بخلفية بيضاء للبطاقة الطبية' },
              { type: 'مستند إثبات حالة خاصة (إن وجد)', required: false, desc: 'كارت تكافل وكرامة أو تقرير الدمج' },
            ].map((item) => {
              const uploaded = documents.find((d) => d.docType === item.type);
              const isUploading = uploadingDocType === item.type;

              return (
                <div
                  key={item.type}
                  className={`p-5 rounded-2xl border transition-all ${
                    uploaded
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        {item.type}
                        {item.required && <span className="text-red-500 text-xs">*</span>}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>

                    {uploaded ? (
                      <span className="p-1.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        تم الرفع
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">مطلوب</span>
                    )}
                  </div>

                  {uploaded ? (
                    <div className="mt-3 flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploaded.fileUrl}
                          alt={uploaded.fileName}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                          {uploaded.fileName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <a
                          href={uploaded.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => removeDoc(item.type)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="حذف وإعادة الرفع"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(e, item.type)}
                          className="hidden"
                        />
                        <div className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-950 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                          {isUploading ? (
                            <>
                              <Hourglass className="w-4 h-4 animate-spin text-blue-600" />
                              <span>جاري رفع المستند وحفظه...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>اختر ملفاً من جهازك لرفعه</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              <span>السابق (البيانات)</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>المتابعة إلى حجز موعد الكشف</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Slot Booking with Strict 20/Hour Capacity Rule */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8" data-tour="slots-booking">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                تحديد موعد الكشف الطبي وسعة الحجز
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                الحد الأقصى المسموح به هو <strong>20 طالباً فقط في الساعة الواحدة</strong> لمنع التكدس بالعيادة الطبية.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>مواعيد العمل: من 09:00 ص إلى 03:00 م</span>
            </div>
          </div>

          {/* Date Selector */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              اختر يوم الحضور لتوقيع الكشف الطبي:
            </label>
            <input
              type="date"
              value={formData.appointmentDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value, appointmentTime: '' })}
              className="w-full sm:w-72 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hourly Slots Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                الفترات الزمنية المتاحة ليوم ({formData.appointmentDate}):
              </label>
              {loadingSlots && (
                <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
                  <Hourglass className="w-3.5 h-3.5 animate-spin" />
                  جاري جلب السعة المتبقية...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableSlots.map((slot) => {
                const isSelected = formData.appointmentTime === slot.timeSlot;
                const isFull = slot.isFull || slot.bookedCount >= 20;
                const percentBooked = Math.min(100, Math.round((slot.bookedCount / slot.maxCapacity) * 100));

                return (
                  <button
                    key={slot.timeSlot}
                    type="button"
                    disabled={isFull}
                    onClick={() => setFormData({ ...formData, appointmentTime: slot.timeSlot })}
                    className={`p-4 rounded-2xl border text-right relative overflow-hidden transition-all ${
                      isFull
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 shadow-md shadow-blue-500/20 scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {/* Time Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                        <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                          {slot.timeSlot.substring(0, 5)}
                        </span>
                      </div>

                      {isFull ? (
                        <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                          مكتمل بالكامل (20/20)
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slot.availableCount <= 5
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          متبقي {slot.availableCount} مقعد
                        </span>
                      )}
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full ${
                          isFull
                            ? 'bg-red-500'
                            : percentBooked > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentBooked}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      <span>محجوز: {slot.bookedCount} / 20</span>
                      <span>{percentBooked}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
              <span>السابق (المستندات)</span>
            </button>

            <button
              type="button"
              disabled={loading || !formData.appointmentTime}
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <>
                  <Hourglass className="w-5 h-5 animate-spin" />
                  <span>جاري حجز المقعد وقفل الساعة...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تأكيد الحجز وإرسال الطلب للإدارة</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success & Pending Review Notice Screen */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-8 max-w-3xl mx-auto">
          
          {/* Celebratory Icon */}
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
              تم استلام طلبك ومقعدك محجوز بنجاح!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
              أهلاً بك يا <strong>{successData?.fullName || formData.fullName}</strong>. تم تسجيل بياناتك وحجز موعدك للكشف الطبي في الموعد المحدد.
            </p>
          </div>

          {/* Pending Verification Notice Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-6 text-right space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-base">
              <Hourglass className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
              <span>الحالة الحالية: جاري مراجعة وتدقيق بياناتك وصور المستندات من قبل إدارة المعهد</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              تقوم إدارة شؤون الطلاب الآن بمراجعة بطاقة الرقم القومي والشهادات المرفوعة. بمجرد اعتماد الطلب من الإدارة، ستتمكن من طباعة <strong>استمارة وبطاقة الكشف الطبي الرسمية</strong>.
            </p>
          </div>

          {/* Appointment Reserved Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-right text-xs bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block">الرقم القومي:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white text-sm">{successData?.nationalId || formData.nationalId}</span>
            </div>
            <div>
              <span className="text-slate-400 block">تاريخ الكشف المحجوز:</span>
              <span className="font-bold text-slate-800 dark:text-white text-sm">{successData?.appointmentDate || formData.appointmentDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block">ساعة الكشف المحجوزة:</span>
              <span className="font-bold text-slate-800 dark:text-white text-sm">{(successData?.appointmentTime || formData.appointmentTime)?.substring(0, 5)}</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/student/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              <span>الانتقال إلى لوحة متابعة الطلب</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-6 py-3.5 rounded-2xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
