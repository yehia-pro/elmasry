import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        studentProfile: {
          include: {
            appointment: true,
            documents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        nationalId: user.nationalId,
        fullName: user.fullName,
        role: user.role,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error: any) {
    console.error('Error fetching current session:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
