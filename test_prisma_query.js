const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Running test prisma query...");
  try {
    const dbCourses = await prisma.course.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Query succeeded! Total courses found:", dbCourses.length);
    if (dbCourses.length > 0) {
      console.log("First course:", JSON.stringify(dbCourses[0], null, 2));

      const serializedCourses = dbCourses.map((c) => ({
        ...c,
        price: c.price.toString(),
        createdAt: c.createdAt.toISOString(),
      }));
      console.log("Serialization succeeded!");
    } else {
      console.log("No courses found.");
    }
  } catch (error) {
    console.error("Prisma query failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
