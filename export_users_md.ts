import { prisma } from './lib/prisma';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      name: true,
      phoneNumber: true,
      role: true,
      createdAt: true
    }
  });

  const markdownRows = users.map(u => 
    `| ${u.id} | ${u.email} | ${u.fullName || u.name || '-'} | ${u.phoneNumber || '-'} | ${u.role} | ${u.createdAt.toISOString()} |`
  ).join('\n');

  const markdownTable = `
# List of Users in Database

| ID | Email | Name | Phone | Role | Created At |
|---|---|---|---|---|---|
${markdownRows}
`;

  fs.writeFileSync('C:/Users/gsans/.gemini/antigravity/brain/8736ce5f-00ea-423b-85f5-14c21f24d4d1/users_list.md', markdownTable);
  console.log(`Exported ${users.length} users to users_list.md`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
