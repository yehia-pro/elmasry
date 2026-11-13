import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const date = searchParams.get('date') || '';
    const department = searchParams.get('department') || '';
    
    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { nationalId: { contains: q } },
        { studentPhone: { contains: q } },
        { fatherPhone: { contains: q } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    if (date) {
      where.appointment = {
        date: date,
      };
    }

    // Get total count matching current filters
    const totalFiltered = await prisma.studentProfile.count({ where });

    const students = await prisma.studentProfile.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            nationalId: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        appointment: true,
        documents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Summary counts for dashboard badges
    const totalCount = await prisma.studentProfile.count();
    const pendingCount = await prisma.studentProfile.count({ where: { status: 'PENDING_REVIEW' } });
    const approvedCount = await prisma.studentProfile.count({ where: { status: 'APPROVED' } });
    const fitCount = await prisma.studentProfile.count({ where: { status: 'COMPLETED_FIT' } });
    const correctionCount = await prisma.studentProfile.count({ where: { status: 'NEEDS_CORRECTION' } });

    const totalPages = Math.ceil(totalFiltered / limit) || 1;

    return NextResponse.json({
      students,
      pagination: {
        total: totalFiltered,
        totalPages,
        page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        fit: fitCount,
        correction: correctionCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching students list:', error);
    return NextResponse.json(
      { error: error.message || 'غير مصرح أو حدث خطأ أثناء جلب الطلاب' },
      { status: 403 }
    );
  }
}
