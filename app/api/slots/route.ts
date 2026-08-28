import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Standard clinic work hours (e.g. 09:00, 10:00, 11:00, 12:00, 13:00, 14:00)
const DEFAULT_HOURLY_SLOTS = [
  '09:00:00',
  '10:00:00',
  '11:00:00',
  '12:00:00',
  '13:00:00',
  '14:00:00',
];

const MAX_CAPACITY_PER_SLOT = parseInt(process.env.MAX_STUDENTS_PER_HOUR || '20', 10);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'تاريخ اليوم مطلوب' }, { status: 400 });
    }

    // Fetch existing recorded slots for this date
    const existingSlots = await prisma.appointmentSlot.findMany({
      where: { date },
    });

    const slotMap = new Map(existingSlots.map((s) => [s.timeSlot, s]));

    // Construct full list of slots with capacity calculation
    const slots = DEFAULT_HOURLY_SLOTS.map((timeSlot) => {
      const recorded = slotMap.get(timeSlot);
      const bookedCount = recorded ? recorded.bookedCount : 0;
      const maxCapacity = recorded ? recorded.maxCapacity : MAX_CAPACITY_PER_SLOT;
      const isActive = recorded ? recorded.isActive : true;
      const availableCount = Math.max(0, maxCapacity - bookedCount);
      const isFull = bookedCount >= maxCapacity;

      return {
        date,
        timeSlot,
        maxCapacity,
        bookedCount,
        availableCount,
        isFull,
        isActive,
      };
    });

    return NextResponse.json({
      date,
      maxCapacityPerSlot: MAX_CAPACITY_PER_SLOT,
      slots,
    });
  } catch (error: any) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب مواعيد الكشف' }, { status: 500 });
  }
}
