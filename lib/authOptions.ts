import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { cookies } from "next/headers";
import { checkRateLimit, clearRateLimit } from "@/lib/rateLimit";

const prismaAdapter = PrismaAdapter(prisma) as Adapter;

const isProd = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  adapter: prismaAdapter,
  useSecureCookies: isProd && !process.env.NEXTAUTH_URL?.startsWith("http://localhost"),
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
    callbackUrl: {
      name: isProd ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
    csrfToken: {
      name: isProd ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/auth",
    newUser: "/onboarding",
    error: "/auth",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        let role: "STUDENT" | "INSTRUCTOR" | "ADMIN" = "STUDENT";
        try {
          const jar = await cookies();
          const r = jar.get("oauth_role")?.value;
          if (r === "INSTRUCTOR") role = "INSTRUCTOR";
          if (r === "ADMIN") role = "ADMIN";
        } catch {
          role = "STUDENT";
        }

        const normalizedEmail = (profile.email || "").toLowerCase().trim();
        if (
          normalizedEmail === "aggarwalkanika676@gmail.com" ||
          normalizedEmail === "jcrm technology97@gmail.com" ||
          normalizedEmail === "pandey.ashutosh699@gmail.com"
        ) {
          role = "ADMIN";
        }

        return {
          id: profile.sub,
          name: profile.name,
          fullName: profile.name,
          email: profile.email,
          image: profile.picture,
          role,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password.");
        }

        const rawInput = credentials.email.trim();
        const normalizedEmail = rawInput.toLowerCase();

        // Rate limit failed login attempts per account
        const rateLimitKey = `login_${normalizedEmail}`;
        const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);
        if (!rateCheck.allowed) {
          throw new Error("Too many failed login attempts. Please try again in 15 minutes.");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedEmail },
              { email: { equals: rawInput, mode: "insensitive" } },
              { phoneNumber: rawInput },
            ],
          },
        });

        if (!user || !user.passwordHash || user.isBlocked) {
          throw new Error("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        // Clear rate limit on successful authentication
        clearRateLimit(rateLimitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName || user.name || "User",
          role: user.role || "STUDENT",
        };
      },
    }),
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Invalid or expired OTP code.");
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const rateLimitKey = `otp_auth_${normalizedEmail}`;
        const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);
        if (!rateCheck.allowed) {
          throw new Error("Too many attempts. Please try again in 15 minutes.");
        }

        const otpRecord = await prisma.otpCode.findFirst({
          where: { email: normalizedEmail },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord || otpRecord.code !== credentials.otp || otpRecord.expiresAt < new Date()) {
          throw new Error("Invalid or expired OTP code.");
        }

        // Invalidate used OTP codes
        await prisma.otpCode.deleteMany({ where: { email: normalizedEmail } }).catch(() => null);

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user || user.isBlocked) {
          throw new Error("Invalid or expired OTP code.");
        }

        clearRateLimit(rateLimitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName || user.name || "User",
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) {
          throw new Error("Invalid phone authentication token.");
        }

        try {
          let phoneNumber = null;
          if (credentials.idToken === "mock-token" && process.env.NODE_ENV === "development") {
            phoneNumber = "+919999999999";
          } else {
            await import("@/lib/firebaseAdmin");
            const { getAuth } = await import("firebase-admin/auth");
            const decodedToken = await getAuth().verifyIdToken(credentials.idToken);
            phoneNumber = decodedToken.phone_number;
          }

          if (!phoneNumber) {
            throw new Error("Invalid phone authentication token.");
          }

          let user = await prisma.user.findFirst({
            where: { phoneNumber },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phoneNumber,
                email: `${phoneNumber}@phoneauth.local`,
                role: "STUDENT",
              },
            });
          }

          if (user.isBlocked) {
            throw new Error("Account blocked.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName || phoneNumber,
            role: user.role,
          };
        } catch (error) {
          console.error("Firebase auth error:", error);
          throw new Error("Invalid phone authentication token.");
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Prevent open redirect attacks by ensuring callback is relative or on same origin
      if (url.startsWith("/")) {
        // Disallow scheme-relative "//" or backslash "/\" tricks
        if (url.startsWith("//") || url.startsWith("/\\")) {
          return baseUrl;
        }
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser?.isBlocked) {
          return false;
        }
        const googleName = user.name?.trim();
        if (dbUser && googleName && (!dbUser.fullName || !dbUser.name)) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              name: dbUser.name || googleName,
              fullName: dbUser.fullName || googleName,
              image: dbUser.image || user.image || undefined,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        if (session?.role) token.role = session.role;
        if (session?.onboarded !== undefined) token.onboarded = session.onboarded;
      }

      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        const signedInName = user.name || (user as { fullName?: string }).fullName;
        if (signedInName) token.name = signedInName;
        if (user.image) token.picture = user.image;

        if (user.role === "ADMIN" || token.email === "jcrm technology97@gmail.com") {
          token.onboarded = true;
        } else if (user.id && /^[0-9a-fA-F]{24}$/.test(user.id)) {
          const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } }).catch(() => null);
          token.onboarded = !!profile;
        } else {
          token.onboarded = false;
        }
      }

      // Refresh session role & enforce valid MongoDB ObjectId
      if (token.id || token.email) {
        try {
          const isHexId = typeof token.id === "string" && /^[0-9a-fA-F]{24}$/.test(token.id);
          const dbUser = await prisma.user.findFirst({
            where: isHexId
              ? { id: token.id as string }
              : { email: token.email as string },
            select: { id: true, email: true, role: true, name: true, fullName: true, image: true },
          });
          if (dbUser) {
            token.id = dbUser.id; // Guarantees token.id is the database ObjectId
            token.email = dbUser.email;
            token.role = dbUser.role;
            const displayName = dbUser.fullName || dbUser.name;
            if (displayName) token.name = displayName;
            if (dbUser.image) token.picture = dbUser.image;
          }
        } catch (err) {
          console.error("Failed to refresh session role:", err);
        }
      }

      const superAdminEmails = new Set([
        "jcrm technology97@gmail.com",
        "pandey.ashutosh699@gmail.com",
        "aggarwalkanika676@gmail.com",
      ]);
      if (superAdminEmails.has(String(token.email || "").toLowerCase()) || token.role === "ADMIN") {
        token.role = "ADMIN";
        token.onboarded = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.onboarded = token.onboarded as boolean;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
};
