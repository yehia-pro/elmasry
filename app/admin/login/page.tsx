'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/student/login');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
      جاري التحويل لصفحة تسجيل الدخول الموحدة...
    </div>
  );
}
