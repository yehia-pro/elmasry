import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const student = await prisma.studentProfile.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        appointment: true,
        documents: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'لم يتم العثور على الطالب' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { status, reviewNotes, doctorNotes } = body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (reviewNotes !== undefined) dataToUpdate.reviewNotes = reviewNotes;
    if (doctorNotes !== undefined) dataToUpdate.doctorNotes = doctorNotes;

    const updatedStudent = await prisma.studentProfile.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: {
        appointment: true,
        documents: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطالب بنجاح',
      student: updatedStudent,
    });
  } catch (error: any) {
    console.error('Error updating student status:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحديث حالة الطالب' },
      { status: 400 }
    );
  }
}
