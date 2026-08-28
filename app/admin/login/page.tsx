'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Hourglass,
  Building2,
  KeyRound
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('يرجى إدخال اسم المستخدم أو الرقم القومي وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'بيانات الدخول غير صحيحة');
      }

      if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPERADMIN' && data.user.role !== 'DOCTOR') {
        throw new Error('هذا الحساب ليس له صلاحيات الوصول إلى لوحة تحكم الإدارة');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-institute-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-bold">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            بوابة الإدارة والمشرفين
          </h2>
          <p className="text-xs text-slate-400">
            لوحة تدقيق مستندات الطلاب وإدارة مواعيد الكشف الطبي
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-950/70 border border-red-800 rounded-xl text-xs font-semibold text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              اسم المستخدم / الرقم القومي:
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="11111111111111 أو البريد"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <User className="w-5 h-5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              كلمة المرور المشفرة:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Hourglass className="w-4 h-4 animate-spin" />
                <span>جاري التحقق والتشفير...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول إلى لوحة التحكم</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice & First Time Setup */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-amber-400/90 font-medium">
            <KeyRound className="w-3.5 h-3.5" />
            <span>نظام محمي - لا يوجد تسجيل عام للمدراء</span>
          </div>
          <p className="text-[11px] text-slate-500">
            لتهيئة المشرف الأول لأول مرة، يمكنك تشغيل الأمر في الطرفية:{' '}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">npm run seed:admin</code>
          </p>
        </div>

      </div>
    </div>
  );
}
