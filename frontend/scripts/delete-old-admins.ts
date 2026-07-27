import { prisma } from "../lib/prisma";

async function main() {
  // Delete all users who are ADMINs but not the new one we just set up
  const deletedAdmins = await prisma.user.deleteMany({
    where: {
      role: "ADMIN",
      email: {
        not: "jcrm technology97@gmail.com"
      }
    }
  });
  
  console.log(`Deleted ${deletedAdmins.count} old admin account(s) from the database.`);
}

main().catch(console.error).finally(() => process.exit(0));
