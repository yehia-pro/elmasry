const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.log('⚠️ يرجى تحديد الرقم القومي أو البريد الإلكتروني للمستخدم المراد ترقيته:');
    console.log('مثال: node scripts/promote-admin.js 29901011234567');
    console.log('أو:   node scripts/promote-admin.js user@example.com');
    process.exit(1);
  }

  console.log(`🔍 البحث عن المستخدم: ${target}...`);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { nationalId: target },
        { email: target },
      ],
    },
  });

  if (!user) {
    console.error(`❌ لم يتم العثور على أي مستخدم مسجل بالرقم أو البريد: ${target}`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  console.log(`✅ تمت ترقية المستخدم [${updated.fullName}] بنجاح إلى دور ADMIN!`);
  console.log(`🔐 يمكنه الآن تسجيل الدخول إلى لوحة الإدارة: http://localhost:3000/admin/login`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ أثناء ترقية المستخدم:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
