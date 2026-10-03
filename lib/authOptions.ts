import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { cookies } from "next/headers";

const prismaAdapter = PrismaAdapter(prisma) as Adapter;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  adapter: {
    ...prismaAdapter,
    linkAccount: (account: AdapterAccount) =>
      prismaAdapter.linkAccount!({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state:
          account.session_state == null ? undefined : String(account.session_state),
      }),
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        let role: "STUDENT" | "INSTRUCTOR" = "STUDENT";
        try {
          const jar = await cookies();
          if (jar.get("oauth_role")?.value === "INSTRUCTOR") role = "INSTRUCTOR";
        } catch {
          role = "STUDENT";
        }
        return {
          id: profile.sub,
          name: profile.name,
          fullName: profile.name,
          email: profile.email,
          image: profile.picture,
          role,
        };
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { phoneNumber: credentials.email }
            ]
          }
        });

        if (!user) {
          throw new Error("User not found with this email or phone number");
        }

        if (!user.passwordHash) {
          throw new Error("Please log in with Google");
        }

        if (user.isBlocked) {
          throw new Error("Your account has been blocked by the admin.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
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
          throw new Error("Missing email or OTP");
        }

        const otpRecord = await prisma.otpCode.findFirst({
          where: { email: credentials.email },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) throw new Error("No OTP requested");
        if (otpRecord.code !== credentials.otp) throw new Error("Invalid OTP");
        if (otpRecord.expiresAt < new Date()) throw new Error("OTP expired");

        // Mark OTP as used by deleting it (or deleting all for this email)
        await prisma.otpCode.deleteMany({ where: { email: credentials.email } });

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }
        if (user.isBlocked) {
          throw new Error("Account blocked");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
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
          throw new Error("Missing ID token");
        }

        try {
          let phoneNumber = null;
          if (credentials.idToken === "mock-token" && process.env.NODE_ENV === "development") {
            console.log("[LOCAL DEV] Mock ID Token detected, bypassing Firebase verification.");
            phoneNumber = "+919999999999";
          } else {
            await import("@/lib/firebaseAdmin");
            const { getAuth } = await import("firebase-admin/auth");
            const decodedToken = await getAuth().verifyIdToken(credentials.idToken);
            phoneNumber = decodedToken.phone_number;
          }

          if (!phoneNumber) {
            throw new Error("Phone number not found in token");
          }

          let user = await prisma.user.findFirst({
            where: { phoneNumber },
          });

          if (!user) {
            // Check if we can link it or create a new user. 
            // Since email is required in our DB, we'll create a placeholder email
            user = await prisma.user.create({
              data: {
                phoneNumber,
                email: `${phoneNumber}@phoneauth.local`,
                role: "STUDENT",
              },
            });
          }

          if (user.isBlocked) {
            throw new Error("Account blocked");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName || phoneNumber,
            role: user.role,
          };
        } catch (error) {
          console.error("Firebase auth error:", error);
          throw new Error("Invalid phone token");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser?.isBlocked) {
          throw new Error("Your account has been blocked by the admin.");
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
      // Allow client-side session updates
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

        // Check if user has completed onboarding (admins are always onboarded)
        if (user.role === "ADMIN" || token.email === "jcrm technology97@gmail.com") {
           token.onboarded = true;
        } else {
           const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
           token.onboarded = !!profile;
        }
      }

      // Role is stored in the JWT at sign-in. Refresh it from the database so
      // an admin promoted after login is not bounced to the public login page.
      if (token.id || token.email) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: token.id
              ? { id: token.id as string }
              : { email: token.email as string },
            select: { id: true, email: true, role: true, name: true, fullName: true, image: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
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
      ]);
      if (superAdminEmails.has(String(token.email || "")) || token.role === "ADMIN") {
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
