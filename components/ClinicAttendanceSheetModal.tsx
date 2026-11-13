'use client';

import React from 'react';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface ClinicAttendanceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: any[];
  filterDate?: string;
}

export default function ClinicAttendanceSheetModal({
  isOpen,
  onClose,
  students,
  filterDate,
}: ClinicAttendanceSheetModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateDisplay = filterDate || new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white text-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base">
                كشف الحضور والفحص الطبي الرسمي للعيادة
              </h3>
              <p className="text-xs text-slate-400">
                المعهد الفني الصناعي ببورسعيد - جاهز للطباعة على ورق A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشف الآن (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-6 sm:p-10 overflow-y-auto printable-content">
          
          {/* Official Egyptian Ministerial Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between text-right text-xs sm:text-sm font-bold text-slate-900">
              <div className="space-y-1">
                <p>جمهورية مصر العربية</p>
                <p>وزارة التعليم العالي والبحث العلمي</p>
                <p>الكلية التكنولوجية</p>
                <p className="font-extrabold text-blue-900">المعهد الفني الصناعي ببورسعيد</p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center mx-auto text-[10px] font-bold p-1">
                  خاتم شعار الجمهورية
                </div>
                <p className="text-[11px] font-bold text-slate-700">إدارة شؤون الطلاب واللجنة الطبية</p>
              </div>

              <div className="space-y-1 text-left" dir="ltr">
                <p>تاريخ الكشف: {currentDateDisplay}</p>
                <p>العدد الإجمالي: {students.length} طالب</p>
                <p>العام الجامعي: 2026 / 2027</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <h1 className="text-lg sm:text-xl font-heading font-black text-slate-900 border-2 border-slate-900 inline-block px-6 py-1.5 rounded-xl bg-slate-50">
                كشف توقيع الحضور وقرار اللياقة الطبية للطلاب المستجدين
              </h1>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse border border-slate-900">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                  <th className="border border-slate-900 py-2.5 px-2 text-center w-8">م</th>
                  <th className="border border-slate-900 py-2.5 px-3">اسم الطالب رباعياً</th>
                  <th className="border border-slate-900 py-2.5 px-3 text-center">الرقم القومي (14 رقم)</th>
                  <th className="border border-slate-900 py-2.5 px-3">الشعبة / التخصص</th>
                  <th className="border border-slate-900 py-2.5 px-2 text-center">الساعة</th>
                  <th className="border border-slate-900 py-2.5 px-3 text-center w-28">توقيع الطالب بالحضور</th>
                  <th className="border border-slate-900 py-2.5 px-3 text-center w-32">قرار اللجنة الطبية</th>
                  <th className="border border-slate-900 py-2.5 px-3 text-center w-24">ملاحظات الطبيب</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => (
                  <tr key={st.id || idx} className="border-b border-slate-400">
                    <td className="border border-slate-900 py-2 px-1 text-center font-bold">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-900 py-2 px-3 font-bold text-slate-900">
                      {st.fullName}
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-center font-mono font-bold" dir="ltr">
                      {st.nationalId}
                    </td>
                    <td className="border border-slate-900 py-2 px-3">
                      {st.department || 'الشعبة العامة'}
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-center font-mono">
                      {st.appointment?.timeSlot?.substring(0, 5) || '09:00'}
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-center text-slate-400 text-[10px]">
                      {st.status === 'COMPLETED_FIT' || st.status === 'ATTENDED' ? (
                        <span className="font-bold text-emerald-800">حضر وتم التوقيع</span>
                      ) : (
                        <span className="inline-block w-full border-b border-dotted border-slate-400 h-4"></span>
                      )}
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-center font-bold">
                      {st.status === 'COMPLETED_FIT' ? (
                        <span className="text-emerald-700">لائق طبياً ✓</span>
                      ) : st.status === 'COMPLETED_UNFIT' ? (
                        <span className="text-red-700">غير لائق ✗</span>
                      ) : (
                        <div className="flex items-center justify-around text-[10px]">
                          <span>[ ] لائق</span>
                          <span>[ ] غير لائق</span>
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-center text-[11px]">
                      {st.doctorNotes || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Footer */}
          <div className="mt-10 pt-6 border-t-2 border-slate-900 grid grid-cols-3 text-center text-xs sm:text-sm font-bold text-slate-900">
            <div className="space-y-8">
              <p>طبيب العيادة الكاشف</p>
              <p className="text-slate-400">....................................</p>
            </div>
            <div className="space-y-8">
              <p>مسؤول شؤون الطلاب</p>
              <p className="text-slate-400">....................................</p>
            </div>
            <div className="space-y-8">
              <p>عميد المعهد الفني الصناعي</p>
              <p className="text-slate-400">....................................</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
