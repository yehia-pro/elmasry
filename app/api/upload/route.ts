import { NextResponse } from 'next/server';
import { uploadFileBuffer } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const docType = (formData.get('docType') as string) || 'مستند';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرفاق أي ملف' }, { status: 400 });
    }

    // Security Check 1: Enforce allowed MIME types (Reject executables, scripts, HTML)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يُسمح فقط بالصور (JPG, PNG, WebP) وملفات PDF' },
        { status: 400 }
      );
    }

    // Security Check 2: Enforce safe file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    if (!extension || !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'امتداد الملف غير مسموح به لأسباب أمنية' },
        { status: 400 }
      );
    }

    // Security Check 3: Check size limit (10MB max, although compressed images are ~250KB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الملف يجب ألا يتجاوز 10 ميجابايت' }, { status: 400 });
    }

    // Sanitize file name
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFileBuffer(buffer, file.name, 'institute_medical_docs');

    return NextResponse.json({
      success: true,
      docType,
      url: result.url,
      publicId: result.publicId,
      fileName: result.fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء رفع المستند' }, { status: 500 });
  }
}
