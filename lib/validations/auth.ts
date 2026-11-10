import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(255, "Email address is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters"),
  phoneNumber: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .nullable()
    .transform((val) => (val && val.trim() ? val.trim() : null)),
  role: z
    .enum(["STUDENT", "INSTRUCTOR"])
    .default("STUDENT")
    .catch("STUDENT"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email or phone number is required")
    .max(255),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128),
});

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
});

export const passwordResetConfirmSchema = z.object({
  token: z
    .string()
    .trim()
    .min(10, "Invalid or malformed reset token"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;

