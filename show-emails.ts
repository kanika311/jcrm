import { prisma } from './lib/prisma';

async function run() {
  const users = await prisma.user.findMany();
  console.log(users.map(u => ({ email: u.email, role: u.role })));
  process.exit(0);
}
run();
