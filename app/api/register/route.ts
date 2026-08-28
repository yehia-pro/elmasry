import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { parseEgyptianNationalId } from '@/lib/egyptian-national-id';
import { StudentRegistrationData } from '@/lib/types';

const MAX_CAPACITY_PER_SLOT = parseInt(process.env.MAX_STUDENTS_PER_HOUR || '20', 10);

export async function POST(request: Request) {
  try {
    const body: StudentRegistrationData = await request.json();

    // 1. Mandatory validations
    if (!body.fullName || body.fullName.trim().split(/\s+/).length < 3) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم الطالب رباعي على الأقل' },
        { status: 400 }
      );
    }

    if (!body.nationalId || body.nationalId.trim().length < 10) {
      return NextResponse.json(
        { error: 'الرقم القومي / رقم جواز السفر مطلوب' },
        { status: 400 }
      );
    }

    if (body.nationality === 'مصري') {
      const parsed = parseEgyptianNationalId(body.nationalId);
      if (!parsed.isValid) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
    }

    if (!body.studentPhone || !body.fatherPhone) {
      return NextResponse.json(
        { error: 'رقم تليفون الطالب ورقم تليفون ولي الأمر مطلوبان' },
        { status: 400 }
      );
    }

    if (!body.password || body.password.length < 4) {
      return NextResponse.json(
        { error: 'يرجى إدخال كلمة سر صالحة لا تقل عن 4 خانات' },
        { status: 400 }
      );
    }

    if (!body.appointmentDate || !body.appointmentTime) {
      return NextResponse.json(
        { error: 'يرجى تحديد تاريخ وساعة الكشف الطبي' },
        { status: 400 }
      );
    }

    const nationalId = body.nationalId.trim();

    // Check if user already registered
    const existingUser = await prisma.user.findUnique({
      where: { nationalId },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            'هذا الرقم القومي مسجل مسبقاً في النظام! يمكنك تسجيل الدخول مباشرة لمتابعة طلبك أو طباعة الاستمارة.',
          alreadyRegistered: true,
        },
        { status: 409 }
      );
    }

    // 2. Perform Atomic Database Transaction for Capacity Lock & Registration
    const result = await prisma.$transaction(async (tx) => {
      // Find or create the appointment slot
      let slot = await tx.appointmentSlot.findUnique({
        where: {
          date_timeSlot: {
            date: body.appointmentDate,
            timeSlot: body.appointmentTime,
          },
        },
      });

      if (!slot) {
        slot = await tx.appointmentSlot.create({
          data: {
            date: body.appointmentDate,
            timeSlot: body.appointmentTime,
            maxCapacity: MAX_CAPACITY_PER_SLOT,
            bookedCount: 0,
            isActive: true,
          },
        });
      }

      // STRICT 20-CAPACITY ENFORCEMENT
      if (slot.bookedCount >= slot.maxCapacity) {
        throw new Error(
          `عذراً، هذه الساعة (${body.appointmentTime.substring(0, 5)}) اكتملت بالكامل بالحد الأقصى المسموح (${slot.maxCapacity} طالباً). يرجى اختيار ساعة أخرى.`
        );
      }

      // Hash password
      const passwordHash = await hashPassword(body.password);

      // Create User
      const user = await tx.user.create({
        data: {
          nationalId,
          fullName: body.fullName.trim(),
          email: body.email || null,
          passwordHash,
          role: 'STUDENT',
        },
      });

      // Prepare Date of Birth
      let dob = new Date(body.dob || '2005-01-01');
      if (isNaN(dob.getTime())) {
        dob = new Date('2005-01-01');
      }

      // Create StudentProfile with initial status PENDING_REVIEW
      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          nationalId,
          fullName: body.fullName.trim(),
          nationality: body.nationality || 'مصري',
          dob,
          governorate: body.governorate || 'القاهرة',
          city: body.city || 'المركز',
          studentPhone: body.studentPhone.trim(),
          fatherPhone: body.fatherPhone.trim(),
          motherPhone: body.motherPhone?.trim() || '',
          email: body.email || null,
          height: body.height ? Number(body.height) : null,
          weight: body.weight ? Number(body.weight) : null,
          institute: body.institute || 'المعهد الفني الصناعي',
          level: body.level || 'الفرقة الأولى / المستجدين',
          department: body.department || 'الشعبة العامة',
          qualificationSource: body.qualificationSource || 'من مصر',
          examType: body.examType || 'الكشف الطبي للطلاب المستجدين',
          specialCategory: body.specialCategory || 'لا شيء مما سبق',
          status: 'PENDING_REVIEW', // Initial status awaiting admin verification
          appointmentId: slot.id,
        },
      });

      // Insert uploaded documents
      if (body.documents && Array.isArray(body.documents) && body.documents.length > 0) {
        for (const doc of body.documents) {
          if (doc.fileUrl) {
            await tx.document.create({
              data: {
                studentId: profile.id,
                docType: doc.docType || 'مستند مرفق',
                fileUrl: doc.fileUrl,
                publicId: doc.publicId || null,
                fileName: doc.fileName || 'document.jpg',
              },
            });
          }
        }
      }

      // Increment bookedCount atomically in the slot
      const updatedSlot = await tx.appointmentSlot.update({
        where: { id: slot.id },
        data: {
          bookedCount: {
            increment: 1,
          },
        },
      });

      return { user, profile, updatedSlot };
    });

    // Automatically set session cookie for seamless login
    await setSessionCookie({
      userId: result.user.id,
      nationalId: result.user.nationalId,
      role: 'STUDENT',
      fullName: result.user.fullName,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل بياناتك وحجز مقعدك بنجاح! طلبك الآن قيد المراجعة والتدقيق من قبل إدارة المعهد.',
      student: {
        id: result.profile.id,
        nationalId: result.profile.nationalId,
        fullName: result.profile.fullName,
        status: result.profile.status,
        appointmentDate: result.updatedSlot.date,
        appointmentTime: result.updatedSlot.timeSlot,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء حفظ البيانات وحجز الموعد' },
      { status: 400 }
    );
  }
}
