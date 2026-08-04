const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() { 
  await prisma.user.updateMany({ data: { role: 'ADMIN' } }); 
  console.log('All users are now ADMIN!'); 
  await prisma.$disconnect(); 
} 
run();
