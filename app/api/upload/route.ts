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

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الملف يجب ألا يتجاوز 10 ميجابايت' }, { status: 400 });
    }

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
