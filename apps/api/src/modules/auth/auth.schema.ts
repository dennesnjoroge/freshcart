import { email, z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string("Password is required.")
    .min(1, "Password is required.")
    .max(64, "Password must be 64 characters or fewer."),
});

export const registerSchema = z.object({
  firstName: z
    .string("First name is required.")
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must be 100 characters or fewer."),

  lastName: z
    .string("Last name is required.")
    .trim()
    .min(1, "Last name is required.")
    .max(100, "Last name must be 100 characters or fewer."),

  email: z.email("Invalid email address.").trim().toLowerCase(),

  password: z
    .string("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(64, "Password must be 64 characters or fewer."),
});

export const resendVerificationSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const verifyEmailSchema = z.object({
  token: z.base64url("Invalid verification token."),
});

export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.base64url("Invalid password reset token."),

  password: z
    .string("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(64, "Password must be 64 characters or fewer."),
});

export type LoginParams = z.infer<typeof loginSchema>;
export type RegisterParams = z.infer<typeof registerSchema>;
export type ResendVerificationParams = z.infer<typeof resendVerificationSchema>;
export type VerifyEmailParams = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
