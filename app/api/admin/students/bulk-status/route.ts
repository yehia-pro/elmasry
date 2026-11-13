import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { studentIds, status, notes } = body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'يرجى تحديد طالب واحد على الأقل لإجراء التعديل' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'يرجى تحديد الحالة المطلوبة' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      if (status.startsWith('COMPLETED_') || status === 'ATTENDED') {
        updateData.doctorNotes = notes;
      } else {
        updateData.reviewNotes = notes;
      }
    }

    const result = await prisma.studentProfile.updateMany({
      where: {
        id: {
          in: studentIds,
        },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `تم تحديث حالة ${result.count} طالب بنجاح إلى "${status}"`,
    });
  } catch (error: any) {
    console.error('Error in bulk status update:', error);
    if (error.message?.includes('غير مصرح')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'فشل تحديث حالة الطلاب المحددين' },
      { status: 500 }
    );
  }
}

