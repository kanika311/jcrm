import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hash = await bcrypt.hash("Jaibajrangbali@123", 10);
  
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  
  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { 
        email: "jcrm technology97@gmail.com",
        passwordHash: hash
      }
    });
    console.log("Updated existing admin user!");
  } else {
    await prisma.user.create({
      data: {
        email: "jcrm technology97@gmail.com",
        name: "Admin",
        passwordHash: hash,
        role: "ADMIN"
      }
    });
    console.log("Created new admin user!");
  }
}
main().catch(console.error).finally(() => process.exit(0));
