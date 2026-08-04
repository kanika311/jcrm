const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      createdAt: true
    }
  });

  fs.writeFileSync('users_export.json', JSON.stringify(users, null, 2));
  console.log(`Exported ${users.length} users to users_export.json`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
