import { prisma } from './lib/prisma';

async function run() { 
  await prisma.user.updateMany({ data: { role: 'ADMIN' } }); 
  console.log('All users are now ADMIN!'); 
} 
run();
