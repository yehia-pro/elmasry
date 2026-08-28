'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Hourglass,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId || !password) {
      setError('يرجى إدخال الرقم القومي وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: nationalId, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'SUPERADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-institute-600 to-institute-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-institute-500/20">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900">
            تسجيل دخول الطالب
          </h2>
          <p className="text-xs text-slate-500">
            أدخل الرقم القومي وكلمة المرور لمتابعة حالة المراجعة أو طباعة بطاقة الحجز
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">الرقم القومي (14 رقماً):</label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                placeholder="29901011234567"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-institute-500"
              />
              <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">كلمة المرور:</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-institute-500"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-institute-600 hover:bg-institute-700 text-white rounded-xl font-bold text-sm shadow-md shadow-institute-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Hourglass className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول ومتابعة الطلب</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
          <p>
            لم تسجل بياناتك بعد؟{' '}
            <Link href="/" className="text-institute-600 font-bold hover:underline">
              تسجيل رغبة وحجز موعد جديد
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
