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
  Phone,
  Printer,
  CheckCircle2
} from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'password' | 'quick-lookup'>('password');
  
  // Password Mode States
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  
  // Quick Lookup Mode States
  const [lookupNationalId, setLookupNationalId] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalId || !password) {
      setError('يرجى إدخال الرقم القومي وكلمة المرور');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

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

  // 2. Quick Phone Lookup
  const handleQuickLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupNationalId || !lookupPhone) {
      setError('يرجى إدخال الرقم القومي ورقم الهاتف المسجل بالاستمارة');
      return;
    }

    if (lookupNationalId.length !== 14) {
      setError('الرقم القومي يجب أن يتكون من 14 رقماً');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/student/quick-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId: lookupNationalId, phone: lookupPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل استرجاع بيانات الحجز');
      }

      setSuccessMsg(data.message || 'تم التحقق بنجاح! جاري تحويلك للتذكرة...');
      setTimeout(() => {
        router.push(data.redirect || '/student/dashboard');
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
            تسجيل الدخول الموحد
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            المعهد الفني الصناعي ببورسعيد - بوابة الخدمات الإلكترونية
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setError(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'password'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            تسجيل الدخول بكلمة المرور
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('quick-lookup'); setError(''); setSuccessMsg(''); }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'quick-lookup'
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            استرجاع التذكرة برقم الهاتف 📱
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode 1: Standard Password Form */}
        {authMode === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                الرقم القومي (14 رقماً):
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={14}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                  placeholder="29901011234567"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  كلمة المرور:
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('quick-lookup')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
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
        ) : (
          /* Mode 2: Quick Lookup Form (No Password needed) */
          <form onSubmit={handleQuickLookupSubmit} className="space-y-4 animate-fade-in">
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              💡 <strong>استرجاع مباشر:</strong> يمكنك الدخول وطباعة تذكرتك بكتابة رقمك القومي ورقم الموبايل المسجل أثناء الحجز دون الحاجة لكلمة المرور.
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                الرقم القومي (14 رقماً):
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={14}
                  value={lookupNationalId}
                  onChange={(e) => setLookupNationalId(e.target.value.replace(/\D/g, ''))}
                  placeholder="29901011234567"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                رقم المحمول المسجل بالاستمارة:
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={11}
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="01012345678"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Hourglass className="w-4 h-4 animate-spin" />
                  <span>جاري البحث والتأكد...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>استرجاع التذكرة وحالة الحجز فوراً</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Link to Register */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            طالب جديد ولم تسجل بياناتك بعد؟{' '}
            <Link href="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              تسجيل رغبة وحجز موعد جديد
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
