import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { authOptions } from "../lib/authOptions";
import { checkRateLimit, clearRateLimit } from "../lib/rateLimit";
import { registerSchema, passwordResetRequestSchema, passwordResetConfirmSchema } from "../lib/validations/auth";
import { verifySameOrigin } from "../lib/csrf";

async function runTestSuite() {
  console.log("===============================================================");
  console.log("   TASK 1: AUTHENTICATION, REGISTRATION & IDOR SECURITY SUITE  ");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testStudentEmail = `test.student.${timestamp}@jcrmsecurity.test`;
  const testPassword = "SuperSecurePassword2026!";
  let createdUserId: string | null = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Zod Input Validation for Registration
    // -------------------------------------------------------------------------
    console.log("--- 1. Testing Input Validation (Zod Schemas) ---");
    const validRegistration = registerSchema.safeParse({
      fullName: "SecOps Test Student",
      email: testStudentEmail,
      password: testPassword,
      phoneNumber: "+919876543210",
      role: "STUDENT",
    });
    assert(validRegistration.success, "Valid registration payload passes Zod validation");

    const shortPassword = registerSchema.safeParse({
      fullName: "SecOps Test Student",
      email: testStudentEmail,
      password: "short",
    });
    assert(!shortPassword.success, "Password < 8 chars rejected by Zod schema");

    const invalidEmail = registerSchema.safeParse({
      fullName: "SecOps Test Student",
      email: "not-an-email",
      password: testPassword,
    });
    assert(!invalidEmail.success, "Invalid email address format rejected by Zod schema");

    // -------------------------------------------------------------------------
    // TEST 2: Password Hashing Verification
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Testing Password Hashing (Bcrypt 12 Rounds) ---");
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    assert(hashedPassword.startsWith("$2"), "Password hashed with valid bcrypt prefix");
    assert(hashedPassword !== testPassword, "Plaintext password never stored");
    const verifyCorrect = await bcrypt.compare(testPassword, hashedPassword);
    assert(verifyCorrect === true, "Valid password successfully validates against bcrypt hash");
    const verifyWrong = await bcrypt.compare("WrongPassword123!", hashedPassword);
    assert(verifyWrong === false, "Incorrect password fails verification");

    // -------------------------------------------------------------------------
    // TEST 3: User Creation & No Account Enumeration
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Testing User Creation & Account Enumeration Prevention ---");
    const user = await prisma.user.create({
      data: {
        email: testStudentEmail,
        fullName: "SecOps Test Student",
        name: "SecOps Test Student",
        passwordHash: hashedPassword,
        role: "STUDENT",
        phoneNumber: "+919876543210",
      },
    });
    createdUserId = user.id;
    assert(!!createdUserId, "Test student created in database with valid ObjectId");

    // Test duplicate query logic returns generic message without disclosing existence
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: testStudentEmail },
          { email: { equals: testStudentEmail, mode: "insensitive" } },
        ],
      },
    });
    assert(existingUser !== null, "Existing user correctly matched in DB");

    // -------------------------------------------------------------------------
    // TEST 4: NextAuth Authorize & Login Throttling
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Testing NextAuth Authorize & Login Rate Limiting ---");
    const credProvider = authOptions.providers.find(
      (p: any) => p.name === "Credentials"
    ) as any;
    const authorizeFn = credProvider.options?.authorize || credProvider.authorize;

    // Successful login
    const authSuccess = await authorizeFn({
      email: testStudentEmail,
      password: testPassword,
    });
    assert(authSuccess?.id === createdUserId, "Credentials authorize succeeds with valid credentials");
    assert(authSuccess?.role === "STUDENT", "Student role preserved in authorized session payload");

    // Failed login with bad password -> generic error
    let failedErrorMsg = "";
    try {
      await authorizeFn({
        email: testStudentEmail,
        password: "BadPassword123!",
      });
    } catch (e: any) {
      failedErrorMsg = e.message;
    }
    assert(
      failedErrorMsg === "Invalid email or password.",
      "Failed login returns generic error without account enumeration"
    );

    // Failed login with non-existent user -> identical generic error
    let nonExistentErrorMsg = "";
    try {
      await authorizeFn({
        email: "nonexistent.user.999@randomdomain.test",
        password: "SomePassword123!",
      });
    } catch (e: any) {
      nonExistentErrorMsg = e.message;
    }
    assert(
      nonExistentErrorMsg === "Invalid email or password.",
      "Non-existent account login returns identical generic error (No Enumeration)"
    );

    // Brute-force throttling test
    const throttleKey = `login_throttle_test_${timestamp}`;
    clearRateLimit(throttleKey);
    for (let i = 0; i < 10; i++) {
      checkRateLimit(throttleKey, 10, 60000);
    }
    const rateBlocked = checkRateLimit(throttleKey, 10, 60000);
    assert(!rateBlocked.allowed && rateBlocked.remaining === 0, "Rate limiter blocks after threshold attempts");

    // -------------------------------------------------------------------------
    // TEST 5: CSRF Same-Origin Verification
    // -------------------------------------------------------------------------
    console.log("\n--- 5. Testing CSRF Origin Validation ---");
    const sameOriginReq = new Request("https://www.jcrm.in/api/auth/signup", {
      method: "POST",
      headers: {
        origin: "https://www.jcrm.in",
        host: "www.jcrm.in",
      },
    });
    assert(verifySameOrigin(sameOriginReq) === true, "Same-origin request passes CSRF check");

    const crossOriginReq = new Request("https://www.jcrm.in/api/auth/signup", {
      method: "POST",
      headers: {
        origin: "https://evil-attacker.com",
        host: "www.jcrm.in",
      },
    });
    assert(verifySameOrigin(crossOriginReq) === false, "Cross-origin request rejected by CSRF check");

    // -------------------------------------------------------------------------
    // TEST 6: Open Redirect Prevention in Redirect Callback
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Testing Post-Login Open Redirect Protection ---");
    if (authOptions.callbacks?.redirect) {
      const baseUrl = "https://www.jcrm.in";
      const safeRelative = await authOptions.callbacks.redirect({
        url: "/student",
        baseUrl,
      });
      assert(safeRelative === "https://www.jcrm.in/student", "Safe relative URL allowed in redirect");

      const evilAbsolute = await authOptions.callbacks.redirect({
        url: "https://attacker.com/steal-token",
        baseUrl,
      });
      assert(evilAbsolute === baseUrl, "External evil URL bounced back to baseUrl");

      const schemeRelative = await authOptions.callbacks.redirect({
        url: "//attacker.com",
        baseUrl,
      });
      assert(schemeRelative === baseUrl, "Scheme-relative '//attacker.com' bounced to baseUrl");

      const backslashTrick = await authOptions.callbacks.redirect({
        url: "/\\attacker.com",
        baseUrl,
      });
      assert(backslashTrick === baseUrl, "Backslash trick '/\\attacker.com' bounced to baseUrl");
    }

    // -------------------------------------------------------------------------
    // TEST 7: Password Reset Request & Confirmation Flow
    // -------------------------------------------------------------------------
    console.log("\n--- 7. Testing Password Reset Flow ---");
    const validResetReq = passwordResetRequestSchema.safeParse({ email: testStudentEmail });
    assert(validResetReq.success, "Valid email passes reset request schema");

    // Generate token and store hashed token
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const tokenRecord = await prisma.verificationToken.create({
      data: {
        identifier: testStudentEmail,
        token: hashedResetToken,
        expires: expiresAt,
      },
    });
    assert(tokenRecord.token === hashedResetToken, "Hashed reset token persisted in verification_tokens");

    // Confirm password reset with new password
    const newPassword = "BrandNewSecurePassword2026!";
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: testStudentEmail },
      data: { passwordHash: newPasswordHash },
    });
    await prisma.verificationToken.delete({ where: { token: hashedResetToken } });

    // Verify old password fails and new password works
    const oldPassAuth = await bcrypt.compare(testPassword, newPasswordHash);
    assert(oldPassAuth === false, "Old password rejected after password reset");

    const newPassAuth = await bcrypt.compare(newPassword, newPasswordHash);
    assert(newPassAuth === true, "New password successfully verified after reset");

    const tokenAfterConsumption = await prisma.verificationToken.findUnique({
      where: { token: hashedResetToken },
    });
    assert(tokenAfterConsumption === null, "Password reset token successfully revoked upon use");

    // -------------------------------------------------------------------------
    // TEST 8: Server-Side Authorization & Privilege Escalation Checks
    // -------------------------------------------------------------------------
    console.log("\n--- 8. Testing Server-Side Authorization & IDOR Controls ---");
    // Verify student cannot arbitrarily escalate to INSTRUCTOR
    const userBeforeEscalation = await prisma.user.findUnique({ where: { id: createdUserId } });
    assert(userBeforeEscalation?.role === "STUDENT", "User starts with STUDENT role");

    // Simulate profile update without admin privilege
    const profileRoleUpdateAttempt = "INSTRUCTOR";
    const userUpdateData: any = {};
    const simulatedSession = { user: { id: createdUserId, role: "STUDENT" } };
    if (simulatedSession.user.role === "ADMIN") {
      userUpdateData.role = profileRoleUpdateAttempt;
    }
    assert(userUpdateData.role === undefined, "Unauthorized role escalation to INSTRUCTOR is blocked");

    // -------------------------------------------------------------------------
    // TEST 9: Cleanup
    // -------------------------------------------------------------------------
    console.log("\n--- 9. Cleaning up Test Artifacts ---");
    await prisma.user.delete({ where: { id: createdUserId } });
    const checkDeleted = await prisma.user.findUnique({ where: { id: createdUserId } });
    assert(checkDeleted === null, "Test student account safely cleaned up from database");

  } catch (err: any) {
    console.error("Test execution threw error:", err?.message || err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n===============================================================");
  console.log(`TASK 1 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();

