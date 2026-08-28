import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'ELMASRY_ADMIN_SECRET_KEY_2026';

export async function POST(request: Request) {
  try {
    const { setupKey, nationalId, fullName, email, password } = await request.json();

    if (setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { error: 'مفتاح الأمان السري غير صحيح!' },
        { status: 403 }
      );
    }

    if (!nationalId || !fullName || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Check if any admin already exists
    const adminCount = await prisma.user.count({
      where: {
        OR: [{ role: 'ADMIN' }, { role: 'SUPERADMIN' }],
      },
    });

    if (adminCount > 0) {
      return NextResponse.json(
        {
          error:
            'تمت تهيئة حساب المسؤول مسبقاً! لإضافة مشرفين جدد، يرجى تسجيل الدخول وإدارتهم من داخل لوحة التحكم.',
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await prisma.user.create({
      data: {
        nationalId: nationalId.trim(),
        fullName: fullName.trim(),
        email: email ? email.trim() : null,
        passwordHash,
        role: 'SUPERADMIN',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حساب المسؤول الرئيسي بنجاح! يمكنك الآن تسجيل الدخول.',
      user: {
        id: newAdmin.id,
        nationalId: newAdmin.nationalId,
        fullName: newAdmin.fullName,
      },
    });
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تهيئة الأدمن' },
      { status: 500 }
    );
  }
}
