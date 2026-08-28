import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const where: any = {};
    if (date) {
      where.appointment = { date };
    }
    if (status) {
      where.status = status;
    }

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        appointment: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const statusTranslations: Record<string, string> = {
      PENDING_REVIEW: 'قيد المراجعة والتدقيق',
      APPROVED: 'معتمد ومقبول للكشف',
      NEEDS_CORRECTION: 'مطلوب تعديل مستند',
      COMPLETED_FIT: 'تم الكشف - لائق طبياً',
      COMPLETED_UNFIT: 'تم الكشف - غير لائق طبياً',
    };

    const rows = students.map((s, index) => ({
      'م': index + 1,
      'الاسم رباعي': s.fullName,
      'الرقم القومي': s.nationalId,
      'الجنسية': s.nationality,
      'تاريخ الميلاد': s.dob.toISOString().split('T')[0],
      'المحافظة': s.governorate,
      'المدينة / المركز': s.city,
      'تليفون الطالب': s.studentPhone,
      'تليفون ولي الأمر (الأب)': s.fatherPhone,
      'تليفون الأم': s.motherPhone || '-',
      'البريد الإلكتروني': s.email || '-',
      'القسم / الشعبة': s.department || 'الشعبة العامة',
      'تاريخ الكشف الطبي': s.appointment?.date || 'غير محدد',
      'ساعة الكشف الطبي': s.appointment?.timeSlot ? s.appointment.timeSlot.substring(0, 5) : 'غير محدد',
      'حالة الطلب': statusTranslations[s.status] || s.status,
      'ملاحظات الطبيب': s.doctorNotes || '-',
      'تاريخ التسجيل': s.createdAt.toLocaleDateString('ar-EG'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'كشف المتقدمين للكشف الطبي');

    // Auto-fit column widths
    const wscols = [
      { wch: 5 },
      { wch: 28 },
      { wch: 18 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 14 },
    ];
    worksheet['!cols'] = wscols;

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="medical_students_report_${date || 'all'}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
