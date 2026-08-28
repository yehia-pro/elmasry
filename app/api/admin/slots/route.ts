import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();

    const slots = await prisma.appointmentSlot.findMany({
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' },
      ],
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { date, timeSlot, maxCapacity, isActive } = body;

    if (!date || !timeSlot) {
      return NextResponse.json({ error: 'التاريخ والساعة مطلوبان' }, { status: 400 });
    }

    const slot = await prisma.appointmentSlot.upsert({
      where: {
        date_timeSlot: {
          date,
          timeSlot,
        },
      },
      update: {
        maxCapacity: maxCapacity !== undefined ? Number(maxCapacity) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
      create: {
        date,
        timeSlot,
        maxCapacity: maxCapacity ? Number(maxCapacity) : 20,
        bookedCount: 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
