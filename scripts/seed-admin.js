const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 تهيئة حساب المسؤول (Admin Initialization)...');

  const defaultAdminId = '11111111111111';
  const defaultAdminName = 'إدارة المعهد الفني الصناعي - Super Admin';
  const defaultAdminEmail = 'admin@elmasry-institute.edu.eg';
  const defaultAdminPassword = 'AdminPassword123!';

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'SUPERADMIN' },
        { nationalId: defaultAdminId },
      ],
    },
  });

  const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);

  if (existingAdmin) {
    console.log(`ℹ️ تم العثور على حساب مسؤول بالفعل: ${existingAdmin.fullName} (${existingAdmin.nationalId})`);
    console.log('تحديث كلمة المرور للتأكيد على الدخول...');
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash,
        role: 'SUPERADMIN',
      },
    });
    console.log('✅ تم تحديث بيانات المسؤول بنجاح!');
  } else {
    await prisma.user.create({
      data: {
        nationalId: defaultAdminId,
        fullName: defaultAdminName,
        email: defaultAdminEmail,
        passwordHash,
        role: 'SUPERADMIN',
      },
    });
    console.log('✅ تم إنشاء حساب السوبر أدمن الأول بنجاح!');
  }

  console.log('\n=========================================');
  console.log('🔐 بيانات دخول لوحة تحكم الإدارة:');
  console.log(`- الرقم القومي / اسم المستخدم: ${defaultAdminId}`);
  console.log(`- البريد الإلكتروني: ${defaultAdminEmail}`);
  console.log(`- كلمة المرور: ${defaultAdminPassword}`);
  console.log(`- رابط الدخول: http://localhost:3000/admin/login`);
  console.log('=========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ خطأ أثناء تهيئة الأدمن:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
