'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Hourglass, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  Check, 
  X, 
  Edit3, 
  SlidersHorizontal,
  FileSpreadsheet,
  RefreshCw,
  Phone,
  ShieldCheck,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import DocumentViewerModal from '@/components/DocumentViewerModal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    fit: 0,
    correction: 0,
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Selected Student for Document Lightbox
  const [viewingDocsStudent, setViewingDocsStudent] = useState<any | null>(null);

  // Status Action Modal State
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'CORRECTION' | 'MEDICAL_FIT' | 'MEDICAL_UNFIT' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);
      if (departmentFilter) params.append('department', departmentFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data && data.students) {
        setStudents(data.students);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [statusFilter, dateFilter, departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleUpdateStatus = async () => {
    if (!selectedStudentForAction || !actionType) return;

    setUpdating(true);
    try {
      let targetStatus = 'PENDING_REVIEW';
      if (actionType === 'APPROVE') targetStatus = 'APPROVED';
      if (actionType === 'CORRECTION') targetStatus = 'NEEDS_CORRECTION';
      if (actionType === 'MEDICAL_FIT') targetStatus = 'COMPLETED_FIT';
      if (actionType === 'MEDICAL_UNFIT') targetStatus = 'COMPLETED_UNFIT';

      const res = await fetch(`/api/admin/students/${selectedStudentForAction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          reviewNotes: adminNotes,
          doctorNotes: doctorNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'فشل تحديث الحالة');

      // Close modal and refresh
      setSelectedStudentForAction(null);
      setActionType(null);
      setAdminNotes('');
      setDoctorNotes('');
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleExportExcel = () => {
    const params = new URLSearchParams();
    if (dateFilter) params.append('date', dateFilter);
    if (statusFilter) params.append('status', statusFilter);
    window.open(`/api/admin/export?${params.toString()}`, '_blank');
  };

  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    PENDING_REVIEW: { label: 'قيد المراجعة والتدقيق', bg: 'bg-amber-100', text: 'text-amber-800' },
    APPROVED: { label: 'معتمد ومقبول للكشف', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    NEEDS_CORRECTION: { label: 'مطلوب تعديل مستند', bg: 'bg-red-100', text: 'text-red-800' },
    COMPLETED_FIT: { label: 'تم الكشف - لائق طبياً', bg: 'bg-blue-100', text: 'text-blue-800' },
    COMPLETED_UNFIT: { label: 'تم الكشف - غير لائق', bg: 'bg-slate-200', text: 'text-slate-800' },
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة التحكم الإدارية والطبية الرسمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            إدارة طلبات وحجوزات الكشف الطبي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مراجعة وتدقيق مستندات الطلاب الجدد، واعتماد المواعيد (حد أقصى 20 طالب في الساعة)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/slots"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span>سعة الساعات والمواعيد</span>
          </Link>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير كشف Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'إجمالي المسجلين', count: stats.total, icon: Users, color: 'text-institute-700', bg: 'bg-institute-50', border: 'border-institute-200' },
          { title: 'قيد التدقيق والمراجعة', count: stats.pending, icon: Hourglass, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { title: 'معتمد ومقبول للكشف', count: stats.approved, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { title: 'تم الكشف (لائق طبياً)', count: stats.fit, icon: Stethoscope, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
          { title: 'مطلوب تعديل مستند', count: stats.correction, icon: AlertCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between ${item.border}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 truncate">{item.title}</span>
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-3">
                {item.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="flex-1 min-w-[240px] relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم رباعي، الرقم القومي (14 رقم)، أو الهاتف..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-institute-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-institute-500"
          >
            <option value="">جميع الحالات</option>
            <option value="PENDING_REVIEW">قيد المراجعة والتدقيق</option>
            <option value="APPROVED">معتمد ومقبول</option>
            <option value="NEEDS_CORRECTION">مطلوب تعديل مستند</option>
            <option value="COMPLETED_FIT">تم الكشف (لائق)</option>
            <option value="COMPLETED_UNFIT">تم الكشف (غير لائق)</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          />

          <button
            type="submit"
            className="bg-institute-600 hover:bg-institute-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            بحث
          </button>

          {(search || statusFilter || dateFilter || departmentFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setDateFilter('');
                setDepartmentFilter('');
              }}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold"
              title="إعادة التعيين"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
              <tr>
                <th className="py-4 px-4">م</th>
                <th className="py-4 px-4">بيانات الطالب</th>
                <th className="py-4 px-4">الرقم القومي</th>
                <th className="py-4 px-4">الشعبة والكلية</th>
                <th className="py-4 px-4">موعد وساعة الحجز</th>
                <th className="py-4 px-4">أرقام التواصل</th>
                <th className="py-4 px-4 text-center">المستندات المرفوعة</th>
                <th className="py-4 px-4 text-center">حالة الطلب</th>
                <th className="py-4 px-4 text-center">الإجراءات والقرار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Hourglass className="w-8 h-8 animate-spin text-institute-600 mx-auto mb-2" />
                    <span>جاري تحميل بيانات الطلاب...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">لا توجد طلبات مطابقة لمعايير البحث</p>
                  </td>
                </tr>
              ) : (
                students.map((st, idx) => {
                  const currentStatus = statusMap[st.status] || {
                    label: st.status,
                    bg: 'bg-slate-100',
                    text: 'text-slate-800',
                  };

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{st.fullName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {st.governorate} - {st.city}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-slate-800" dir="ltr">
                        {st.nationalId}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{st.department || 'الشعبة العامة'}</div>
                        <div className="text-[11px] text-slate-500">{st.level}</div>
                      </td>

                      <td className="py-4 px-4">
                        {st.appointment ? (
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-institute-600" />
                              <span>{st.appointment.date}</span>
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>الساعة: {st.appointment.timeSlot?.substring(0, 5)}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">غير محدد</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[11px] font-mono">
                        <div className="text-slate-800 font-bold" dir="ltr">طالب: {st.studentPhone}</div>
                        <div className="text-slate-500" dir="ltr">أب: {st.fatherPhone}</div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {st.documents && st.documents.length > 0 ? (
                          <button
                            onClick={() => setViewingDocsStudent(st)}
                            className="inline-flex items-center gap-1.5 bg-institute-50 hover:bg-institute-100 text-institute-700 px-3 py-1.5 rounded-xl font-bold transition-all border border-institute-200"
                            title="فتح معرض المستندات"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة ({st.documents.length})</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">لا مستندات</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${currentStatus.bg} ${currentStatus.text}`}>
                          {currentStatus.label}
                        </span>
                        {st.reviewNotes && (
                          <p className="text-[10px] text-red-600 mt-1 max-w-[140px] truncate" title={st.reviewNotes}>
                            ملاحظة: {st.reviewNotes}
                          </p>
                        )}
                      </td>

                      {/* Action Dropdown / Buttons */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Approve Button */}
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(st);
                              setActionType('APPROVE');
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition-colors"
                            title="قبول واعتماد الطلب فوراً"
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          {/* Request Correction Button */}
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(st);
                              setActionType('CORRECTION');
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-lg transition-colors"
                            title="طلب تعديل أو إعادة رفع مستند"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Medical Clearance Button */}
                          <button
                            onClick={() => {
                              setSelectedStudentForAction(st);
                              setActionType('MEDICAL_FIT');
                            }}
                            className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition-colors"
                            title="تسجيل نتيجة الكشف الطبي (لائق طبياً)"
                          >
                            <Stethoscope className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Action Modal */}
      {selectedStudentForAction && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                {actionType === 'APPROVE' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                {actionType === 'CORRECTION' && <AlertCircle className="w-6 h-6 text-amber-600" />}
                {actionType === 'MEDICAL_FIT' && <Stethoscope className="w-6 h-6 text-blue-600" />}
                <span>
                  {actionType === 'APPROVE' && 'اعتماد وقبول طلب الطالب'}
                  {actionType === 'CORRECTION' && 'طلب تعديل / إعادة رفع مستند'}
                  {actionType === 'MEDICAL_FIT' && 'تسجيل نتيجة الكشف الطبي (لائق)'}
                </span>
              </h3>
              <button
                onClick={() => setSelectedStudentForAction(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <p>اسم الطالب: <strong>{selectedStudentForAction.fullName}</strong></p>
              <p>الرقم القومي: <span className="font-mono font-bold" dir="ltr">{selectedStudentForAction.nationalId}</span></p>
              <p>الموعد: <strong>{selectedStudentForAction.appointment?.date} (الساعة {selectedStudentForAction.appointment?.timeSlot?.substring(0, 5)})</strong></p>
            </div>

            {actionType === 'APPROVE' && (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 leading-relaxed">
                عند الضغط على تأكيد الاعتماد، ستتحول حالة الطالب إلى <strong>معتمد (APPROVED)</strong> وسيتمكن الطالب فوراً من طباعة بطاقة واستمارة الكشف الطبي الرسمية بـ QR Code.
              </p>
            )}

            {actionType === 'CORRECTION' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  سبب طلب التعديل (سيظهر للطالب في حسابه):
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="مثال: الصورة الشخصية غير واضحة يرجى إعادة رفعها بخلفية بيضاء..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {actionType === 'MEDICAL_FIT' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  ملاحظات الطبيب / تقرير اللجنة الطبية:
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="لائق طبياً لجميع الشعب والأقسام الهندسية..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudentForAction(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={handleUpdateStatus}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all disabled:opacity-50"
              >
                {updating ? 'جاري الحفظ...' : 'تأكيد وحفظ القرار'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocsStudent && viewingDocsStudent.documents && (
        <DocumentViewerModal
          documents={viewingDocsStudent.documents}
          isOpen={true}
          onClose={() => setViewingDocsStudent(null)}
        />
      )}

    </div>
  );
}
