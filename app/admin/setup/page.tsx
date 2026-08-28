'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, Key, AlertCircle, CheckCircle2, Hourglass } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const [setupKey, setSetupKey] = useState('');
  const [nationalId, setNationalId] = useState('11111111111111');
  const [fullName, setFullName] = useState('مسؤول النظام العام');
  const [email, setEmail] = useState('admin@elmasry-institute.edu.eg');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupKey || !nationalId || !fullName || !password) {
      setError('يرجى ملء جميع الحقول الإلزامية ومفتاح الأمان');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupKey, nationalId, fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشلت التهيئة');

      setSuccess('تم إنشاء حساب المسؤول بنجاح! جاري تحويلك لصفحة الدخول...');
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900">
            التهيئة الأولى لحساب المسؤول (Setup)
          </h2>
          <p className="text-xs text-slate-500">
            تُستخدم هذه الصفحة لمرة واحدة فقط لإنشاء حساب السوبر أدمن الأول بواسطة رمز الأمان السري.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              رمز الأمان السري (Master Setup Key) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                placeholder="الموجود في ملف .env"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <Key className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
            </div>
            <span className="text-[11px] text-slate-400">القيمة الافتراضية: ELMASRY_ADMIN_SECRET_KEY_2026</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">اسم المسؤول الكامل</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">الرقم القومي / اسم المستخدم للدخول</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Hourglass className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>إنشاء وتفعيل الحساب</span>
          </button>
        </form>

      </div>
    </div>
  );
}
