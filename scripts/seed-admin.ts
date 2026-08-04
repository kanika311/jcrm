import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "pandey.ashutosh699@gmail.com";
  const password = "Qwerty@12345";
  const passwordHash = await bcrypt.hash(password, 10);

  console.log("Upserting admin user...");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email,
      fullName: "Super Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Successfully upserted admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
