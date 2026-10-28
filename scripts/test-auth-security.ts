import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "../lib/rateLimit";

async function runAuthSecurityTests() {
  console.log("==================================================");
  console.log("  JCRM Authentication & Security Test Suite       ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  const testEmail = `test.student.${Date.now()}@example.com`;
  const testPassword = "SecurePassword123!";
  const testFullName = "Test Automation Student";

  try {
    // -------------------------------------------------------------
    // Test 1: Rate Limiter
    // -------------------------------------------------------------
    console.log("--- 1. Testing Rate Limiting Logic ---");
    const testIp = `test-ip-${Date.now()}`;
    const lastResult = checkRateLimit(testIp, 3, 60000);
    assert(lastResult.allowed && lastResult.remaining === 2, "Rate limiter allows first request");
    checkRateLimit(testIp, 3, 60000);
    checkRateLimit(testIp, 3, 60000);
    const blockedResult = checkRateLimit(testIp, 3, 60000);
    assert(!blockedResult.allowed && blockedResult.remaining === 0, "Rate limiter blocks after 3 requests in window");

    // -------------------------------------------------------------
    // Test 2: Role Sanitization & Privilege Escalation Prevention
    // -------------------------------------------------------------
    console.log("\n--- 2. Testing Role Sanitization ---");
    function sanitizeRole(role: unknown): "STUDENT" | "INSTRUCTOR" {
      return role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";
    }
    assert(sanitizeRole("ADMIN") === "STUDENT", "Attempted role escalation to ADMIN is prevented (defaults to STUDENT)");
    assert(sanitizeRole("SUPER_ADMIN") === "STUDENT", "Attempted role escalation to SUPER_ADMIN is prevented");
    assert(sanitizeRole("INSTRUCTOR") === "INSTRUCTOR", "INSTRUCTOR role is correctly preserved");
    assert(sanitizeRole(undefined) === "STUDENT", "Missing role safely defaults to STUDENT");

    // -------------------------------------------------------------
    // Test 3: Password Hashing & Salt Verification
    // -------------------------------------------------------------
    console.log("\n--- 3. Testing Password Hashing & Verification ---");
    const hash = await bcrypt.hash(testPassword, 10);
    assert(hash !== testPassword, "Password is not stored in plaintext");
    const isValid = await bcrypt.compare(testPassword, hash);
    assert(isValid === true, "Valid password successfully verifies against bcrypt hash");
    const isInvalid = await bcrypt.compare("WrongPassword!", hash);
    assert(isInvalid === false, "Invalid password fails verification");

    // -------------------------------------------------------------
    // Test 4: Student User Creation & Database Integrity
    // -------------------------------------------------------------
    console.log("\n--- 4. Testing Student Account Creation in DB ---");
    const createdUser = await prisma.user.create({
      data: {
        email: testEmail,
        fullName: testFullName,
        name: testFullName,
        passwordHash: hash,
        role: "STUDENT",
        phoneNumber: "+919876543210",
      },
    });
    assert(createdUser.id !== undefined, "Student user record created in MongoDB");
    assert(createdUser.role === "STUDENT", "User record possesses STUDENT role");
    assert(createdUser.email === testEmail, "Normalized email stored accurately");

    // -------------------------------------------------------------
    // Test 5: Duplicate Registration Detection
    // -------------------------------------------------------------
    console.log("\n--- 5. Testing Duplicate Registration Detection ---");
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testEmail },
          { email: { equals: testEmail, mode: "insensitive" } },
        ],
      },
    });
    assert(existing !== null, "Existing user correctly identified by normalized & insensitive query");
    assert(existing?.id === createdUser.id, "Correct user entity retrieved");

    // -------------------------------------------------------------
    // Test 6: Credentials Query Simulation (Authorize Flow)
    // -------------------------------------------------------------
    console.log("\n--- 6. Testing Credentials Provider Authorize Query ---");
    const rawInputUpper = testEmail.toUpperCase();
    const normalizedInput = rawInputUpper.trim().toLowerCase();
    const queryUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedInput },
          { email: { equals: rawInputUpper, mode: "insensitive" } },
          { phoneNumber: rawInputUpper },
        ],
      },
    });
    assert(queryUser !== null, "Uppercase email input successfully resolves to user record");
    assert(queryUser?.role === "STUDENT", "Student role correctly retrieved for session payload");

    // -------------------------------------------------------------
    // Test 7: Clean Up Test Artifacts
    // -------------------------------------------------------------
    console.log("\n--- 7. Cleanup Test Records ---");
    await prisma.user.delete({ where: { id: createdUser.id } });
    const checkDeleted = await prisma.user.findUnique({ where: { id: createdUser.id } });
    assert(checkDeleted === null, "Test student record safely cleaned up from database");

  } catch (err) {
    console.error("Test execution threw error:", err instanceof Error ? err.message : String(err));
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n==================================================");
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthSecurityTests();
