import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import readline from "readline";

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function main() {
  console.log("=========================================");
  console.log("     JCRM Technology - Create Admin      ");
  console.log("=========================================\n");

  // Allow passing arguments: npx tsx scripts/create-admin.ts <email> <password> <fullName>
  let email = process.argv[2];
  let password = process.argv[3];
  let fullName = process.argv[4];

  if (!email) {
    email = await askQuestion("Enter Admin Email: ");
  }

  if (!password) {
    password = await askQuestion("Enter Admin Password (min 6 chars): ");
  }

  if (!fullName) {
    fullName = await askQuestion("Enter Admin Full Name (optional): ");
  }

  if (!email || !password) {
    console.error("\n❌ Error: Email and Password are required!");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("\n❌ Error: Password must be at least 6 characters long!");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`\nProcessing admin account for: ${normalizedEmail}...`);

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    console.log(`User found. Updating role to ADMIN and setting new password...`);
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: "ADMIN",
        passwordHash,
        fullName: fullName || existingUser.fullName || "Admin",
      },
    });

    console.log("\n✅ Admin successfully updated!");
    console.log(`- Email:    ${updated.email}`);
    console.log(`- Role:     ${updated.role}`);
    console.log(`- Name:     ${updated.fullName}`);
  } else {
    console.log(`Creating new user with ADMIN role...`);
    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: fullName || "Admin",
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("\n✅ New Admin successfully created!");
    console.log(`- Email:    ${created.email}`);
    console.log(`- Role:     ${created.role}`);
    console.log(`- Name:     ${created.fullName}`);
  }

  console.log("\n🔗 Login URL: http://localhost:3000/auth");
  console.log("=========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
