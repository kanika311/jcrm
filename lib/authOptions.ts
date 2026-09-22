import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
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
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: "STUDENT", 
        }
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
        
        // Check if user has completed onboarding (admins are always onboarded)
        if (user.role === "ADMIN" || token.email === "jcrm technology97@gmail.com") {
           token.onboarded = true;
        } else {
           const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
           token.onboarded = !!profile;
        }
      }
      
      const superAdminEmail = "jcrm technology97@gmail.com"; 
      if (token.email === superAdminEmail || token.role === "ADMIN") {
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
      }
      return session;
    },
  },
};
