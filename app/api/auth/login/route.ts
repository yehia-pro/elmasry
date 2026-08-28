import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال الرقم القومي أو اسم المستخدم وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim();

    // Find user by nationalId or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { nationalId: cleanIdentifier },
          { email: cleanIdentifier },
        ],
      },
      include: {
        studentProfile: {
          include: {
            appointment: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة. يرجى التأكد من الرقم القومي وكلمة المرور.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSessionCookie({
      userId: user.id,
      nationalId: user.nationalId,
      role: user.role,
      fullName: user.fullName,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nationalId: user.nationalId,
        fullName: user.fullName,
        role: user.role,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
