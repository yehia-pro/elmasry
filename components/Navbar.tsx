'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LogOut, 
  Menu, 
  X, 
  LogIn, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSessionUser(data.user);
        } else {
          setSessionUser(null);
        }
      })
      .catch(() => setSessionUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSessionUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official Standalone Institute Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <img 
              src="/institute-logo.svg" 
              alt="شعار المعهد الفني الصناعي ببورسعيد" 
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg lg:text-xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  المعهد الفني الصناعي
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-heading font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-700">
                  ببورسعيد
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                الكلية التكنولوجية ببورسعيد - بوابة الكشف الطبي
              </p>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-2 font-medium text-sm text-slate-700 dark:text-slate-300">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl transition-colors ${
                pathname === '/' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الرئيسية والتسجيل
            </Link>

            <a
              href="/#guidelines"
              className="px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              تعليمات الكشف
            </a>
          </nav>

          {/* Action Tools: Theme Toggle (Sun/Moon) + Login */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Theme Toggle Button (Light ☀️ / Dark 🌙) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-90"
              title={theme === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* User Session or Direct Login Button */}
            {sessionUser ? (
              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 py-1.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {sessionUser.fullName.split(' ').slice(0, 2).join(' ')}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    {sessionUser.role === 'STUDENT' ? 'طالب مستجد' : 'المشرف'}
                  </span>
                </div>

                <Link
                  href={sessionUser.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  {sessionUser.role === 'STUDENT' ? 'حسابي' : 'لوحة التحكم'}
                </Link>

                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/student/login"
                data-tour="navbar-auth-btn"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            الرئيسية والتسجيل
          </Link>
          <a
            href="/#guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            تعليمات الكشف الطبي
          </a>
          {sessionUser ? (
            <Link
              href={sessionUser.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-bold text-white bg-blue-600 text-center"
            >
              {sessionUser.role === 'STUDENT' ? 'حسابي والبطاقة' : 'لوحة التحكم'}
            </Link>
          ) : (
            <Link
              href="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-bold text-white bg-blue-600 text-center shadow"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
