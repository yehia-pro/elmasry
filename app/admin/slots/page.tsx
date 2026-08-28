'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Hourglass, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Plus, 
  Settings, 
  Users
} from 'lucide-react';

export default function AdminSlotsPage() {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/slots');
      const data = await res.json();
      if (data && data.slots) {
        setSlots(data.slots);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleUpdateCapacity = async (slot: any, newCap: number, newActive: boolean) => {
    setSavingSlotId(slot.id);
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: slot.date,
          timeSlot: slot.timeSlot,
          maxCapacity: newCap,
          isActive: newActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل التحديث');
      fetchSlots();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSavingSlotId(null);
    }
  };

  const filteredSlots = filterDate
    ? slots.filter((s) => s.date === filterDate)
    : slots;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-institute-600 mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى لوحة التحكم الرئيسية</span>
          </Link>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">
            إدارة سعة الفترات الزمنية ومواعيد الكشف الطبي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            التحكم في الحد الأقصى لكل ساعة (الافتراضي 20 طالباً) وتعطيل أو تفعيل فترات محددة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              عرض الكل
            </button>
          )}
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-institute-600" />
          <span>سجل الساعات المحجوزة والمتاحة بالنظام</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <Hourglass className="w-8 h-8 animate-spin text-institute-600 mx-auto mb-2" />
            <span>جاري جلب بيانات الفترات...</span>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-slate-600">لا توجد فترات مسجلة بعد. تُنشأ تلقائياً فور أول حجز.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSlots.map((slot) => {
              const booked = slot.bookedCount || 0;
              const cap = slot.maxCapacity || 20;
              const percent = Math.min(100, Math.round((booked / cap) * 100));

              return (
                <div
                  key={slot.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    !slot.isActive
                      ? 'border-slate-200 bg-slate-100 opacity-60'
                      : booked >= cap
                      ? 'border-red-200 bg-red-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-institute-600" />
                      {slot.date}
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {slot.timeSlot.substring(0, 5)}
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>محجوز: {booked} من {cap}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          percent >= 100
                            ? 'bg-red-600'
                            : percent > 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={slot.isActive}
                        onChange={(e) =>
                          handleUpdateCapacity(slot, slot.maxCapacity, e.target.checked)
                        }
                        className="w-4 h-4 text-institute-600 rounded"
                      />
                      <span>نشط للحجز</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">السعة:</span>
                      <select
                        value={slot.maxCapacity}
                        onChange={(e) =>
                          handleUpdateCapacity(slot, Number(e.target.value), slot.isActive)
                        }
                        className="px-2 py-1 rounded-lg border border-slate-300 font-bold bg-white text-slate-800"
                      >
                        <option value={15}>15</option>
                        <option value={20}>20 (قياسي)</option>
                        <option value={25}>25</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
