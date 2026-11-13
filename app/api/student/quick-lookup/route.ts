import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { nationalId, phone } = await request.json();

    if (!nationalId || !phone) {
      return NextResponse.json(
        { error: 'يرجى إدخال الرقم القومي ورقم الهاتف المسجل' },
        { status: 400 }
      );
    }

    const cleanNationalId = nationalId.trim().replace(/\D/g, '');
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (cleanNationalId.length !== 14) {
      return NextResponse.json(
        { error: 'الرقم القومي يجب أن يتكون من 14 رقماً' },
        { status: 400 }
      );
    }

    // Find student profile by National ID
    const student = await prisma.studentProfile.findUnique({
      where: { nationalId: cleanNationalId },
      include: {
        user: true,
        appointment: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'لم يتم العثور على طالب مسجل بهذا الرقم القومي. يرجى التأكد من البيانات أو التسجيل كمستجد.' },
        { status: 404 }
      );
    }

    // Verify phone against studentPhone or fatherPhone
    const cleanStudentPhone = (student.studentPhone || '').replace(/\D/g, '');
    const cleanFatherPhone = (student.fatherPhone || '').replace(/\D/g, '');

    // Allow match if the last 9 digits match (handles 01xxxxxxxxx vs 201xxxxxxxxx)
    const matchPhone = (stored: string, input: string) => {
      if (!stored || !input) return false;
      const subStored = stored.slice(-9);
      const subInput = input.slice(-9);
      return subStored === subInput;
    };

    const isPhoneValid = matchPhone(cleanStudentPhone, cleanPhone) || matchPhone(cleanFatherPhone, cleanPhone);

    if (!isPhoneValid) {
      return NextResponse.json(
        { error: 'رقم الهاتف المدخل لا يتطابق مع الرقم المسجل في استمارة هذا الطالب. يرجى إدخال رقم المحمول المسجل بالاستمارة.' },
        { status: 401 }
      );
    }

    // Set authenticated session cookie
    await setSessionCookie({
      userId: student.userId,
      nationalId: student.nationalId,
      role: 'STUDENT',
      fullName: student.fullName,
    });

    return NextResponse.json({
      success: true,
      message: 'تم التحقق بنجاح، جاري نقلك لبطاقة حجز الكشف...',
      redirect: '/student/dashboard',
      student: {
        fullName: student.fullName,
        nationalId: student.nationalId,
        status: student.status,
      },
    });
  } catch (error: any) {
    console.error('Error in quick lookup:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء التحقق، يرجى المحاولة لاحقاً' },
      { status: 500 }
    );
  }
}
