'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Building2, 
  User, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface MedicalTicketProps {
  student: {
    fullName: string;
    nationalId: string;
    nationality?: string;
    dob?: string | Date;
    governorate?: string;
    city?: string;
    studentPhone?: string;
    fatherPhone?: string;
    department?: string;
    institute?: string;
    level?: string;
    status: string;
    appointment?: {
      date: string;
      timeSlot: string;
    } | null;
    documents?: {
      docType: string;
      fileUrl: string;
    }[];
  };
}

export default function MedicalTicket({ student }: MedicalTicketProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  const personalPhoto = student.documents?.find(
    (d) => d.docType.includes('صورة شخصية') || d.docType.includes('شخصية')
  )?.fileUrl;

  useEffect(() => {
    // Generate QR Code
    const verificationPayload = JSON.stringify({
      id: student.nationalId,
      name: student.fullName,
      date: student.appointment?.date || 'N/A',
      time: student.appointment?.timeSlot || 'N/A',
      status: student.status,
    });

    QRCode.toDataURL(verificationPayload, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [student]);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = student.appointment?.date || 'غير محدد';
  const formattedTime = student.appointment?.timeSlot
    ? student.appointment.timeSlot.substring(0, 5)
    : 'غير محدد';

  const birthDateStr = student.dob
    ? new Date(student.dob).toISOString().split('T')[0]
    : '-';

  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-4">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>استمارة وبطاقة حجز الكشف الطبي الرسمية جاهزة للطباعة</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-institute-700 hover:bg-institute-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            طباعة الاستمارة
          </button>
        </div>
      </div>

      {/* Official Medical Slip - Printable Container */}
      <div
        ref={ticketRef}
        className="print-container bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-xl relative overflow-hidden text-slate-900"
      >
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Building2 className="w-96 h-96" />
        </div>

        {/* Header with National Crest & Institute Title */}
        <div className="border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-right space-y-1">
              <h2 className="text-lg font-bold font-heading text-slate-900">جمهورية مصر العربية</h2>
              <h3 className="text-sm font-semibold text-slate-700">وزارة التعليم العالي والبحث العلمي - الكلية التكنولوجية ببورسعيد</h3>
              <h4 className="text-lg font-extrabold text-slate-950">المعهد الفني الصناعي ببورسعيد</h4>
              <p className="text-xs text-slate-500">الإدارة الطبية - لجنة توقيع الكشف الطبي على الطلاب المستجدين</p>
            </div>

            {/* Middle Logo */}
            <div className="text-center">
              <img 
                src="/institute-logo.svg" 
                alt="شعار المعهد" 
                className="h-20 w-auto object-contain mx-auto"
              />
              <span className="text-[11px] font-bold text-slate-850 block mt-1">بطاقة حجز معتمدة</span>
            </div>

            {/* Student Photo or Stamp Box */}
            <div className="text-left">
              {personalPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={personalPhoto}
                  alt={student.fullName}
                  className="w-24 h-28 object-cover rounded-xl border-2 border-slate-400 shadow-sm"
                />
              ) : (
                <div className="w-24 h-28 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs text-center p-1 bg-slate-50">
                  <User className="w-8 h-8 mb-1" />
                  <span>الصورة الشخصية للطلب</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Appointment Banner */}
        <div className="bg-gradient-to-r from-institute-800 to-institute-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-wrap items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-institute-200 font-semibold block">الموعد المحدد لتوقيع الكشف الطبي:</span>
            <div className="flex items-center gap-6 mt-1">
              <div className="flex items-center gap-2 text-xl font-bold">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>يوم: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xl font-bold bg-white/10 px-3 py-1 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-300" />
                <span>الساعة: {formattedTime}</span>
              </div>
            </div>
          </div>

          <div className="text-left bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold">
            <span>الحد الأقصى للساعة: 20 طالباً</span>
            <span className="block text-emerald-300 text-[11px]">مقعدك محجوز ومؤكد بالنظام</span>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">اسم الطالب رباعي:</span>
            <span className="font-bold text-slate-900 text-base">{student.fullName}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">الرقم القومي:</span>
            <span className="font-mono font-bold text-slate-900 text-base" dir="ltr">{student.nationalId}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">تاريخ الميلاد:</span>
            <span className="font-semibold text-slate-800">{birthDateStr}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">المحافظة والمركز:</span>
            <span className="font-semibold text-slate-800">{student.governorate || '-'} - {student.city || '-'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">رقم تليفون الطالب:</span>
            <span className="font-mono font-semibold text-slate-800" dir="ltr">{student.studentPhone || '-'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">رقم تليفون ولي الأمر:</span>
            <span className="font-mono font-semibold text-slate-800" dir="ltr">{student.fatherPhone || '-'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">الكلية / المعهد:</span>
            <span className="font-semibold text-slate-800">{student.institute || 'المعهد الفني الصناعي'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">القسم / الشعبة:</span>
            <span className="font-semibold text-slate-800">{student.department || 'الشعبة العامة'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">حالة الطلب بالنظام:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
              {student.status === 'APPROVED' ? 'معتمد ومؤكد للكشف' : student.status}
            </span>
          </div>
        </div>

        {/* Clinic Examination Fields for Doctors to Fill on Site */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 mb-6">
          <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-institute-700" />
            خانة تقرير اللجنة الطبية بالمعهد (خاصة بالأطباء فقط):
          </h4>
          
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="border border-slate-200 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">الباطنة والقلب:</span>
              <span className="text-slate-400 mt-2 block">..................</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">الرمد وقوة الإبصار:</span>
              <span className="text-slate-400 mt-2 block">..................</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">الجراحة العامة:</span>
              <span className="text-slate-400 mt-2 block">..................</span>
            </div>
            <div className="border border-slate-200 p-2 rounded-lg text-center">
              <span className="text-slate-500 block">القرار النهائي:</span>
              <span className="text-slate-400 mt-2 block">[ ] لائق  [ ] غير لائق</span>
            </div>
          </div>
        </div>

        {/* Footer with QR Code, Barcode & Signatures */}
        <div className="flex items-center justify-between border-t-2 border-slate-200 pt-6">
          {/* QR Verification */}
          <div className="flex items-center gap-3">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 border border-slate-200 rounded-xl" />
            )}
            <div className="text-xs text-slate-500 space-y-1">
              <span className="font-bold text-slate-800 block">رمز التحقق الإلكتروني (QR)</span>
              <p>يتم مسحه بواسطة مسؤول الاستقبال للتحقق من الموعد والهوية.</p>
              <div className="font-mono text-[10px] text-slate-400">ID: {student.nationalId}</div>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="text-left space-y-6 text-xs text-slate-700 pl-4">
            <div>
              <span className="font-semibold block">توقيع مسؤول شؤون الطلاب:</span>
              <span className="text-slate-400">....................................</span>
            </div>
            <div>
              <span className="font-semibold block">خاتم الإدارة الطبية:</span>
              <span className="text-slate-400">....................................</span>
            </div>
          </div>
        </div>

        {/* Urgent Instructions Box */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-600 bg-amber-50/70 p-3 rounded-xl flex items-start gap-2 border border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>تنبيه هام للطلاب:</strong> يرجى التواجد بمقر العيادة الطبية بالمعهد قبل الموعد بـ 15 دقيقة مصطحباً أصل بطاقة الرقم القومي وهذه البطاقة المطبوعة، وفي حال التخلف عن الموعد يلزم مراجعة شؤون الطلاب لإعادة الحجز.
          </p>
        </div>
      </div>
    </div>
  );
}
