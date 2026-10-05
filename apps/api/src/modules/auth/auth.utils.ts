import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { getEnvVar } from "../../config/env.js";
import type { AuthTokens } from "./auth.types.js";

const jwtSecret = getEnvVar("JWT_SECRET");

export const generateAuthTokens = (userPublicId: string): AuthTokens => {
  const accessToken = jwt.sign({ sub: userPublicId }, jwtSecret, {
    expiresIn: "15m",
  });

  const refreshToken = crypto.randomBytes(32).toString("base64url");

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("base64url");

  const refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return { accessToken, refreshToken, refreshTokenHash, refreshTokenExpiresAt };
};

export function createResetLink(resetToken: string): string {
  return process.env.NODE_ENV === "production"
    ? `https://accounts.loft.co.ke/forgot-password?token=${resetToken}`
    : `http://localhost:5173/forgot-password?token=${resetToken}`;
}

export function createVerificationLink(verificationToken: string): string {
  return process.env.NODE_ENV === "production"
    ? `https://accounts.loft.co.ke/verify-email?token=${verificationToken}`
    : `http://localhost:5173/verify-email?token=${verificationToken}`;
}

interface GenerateVerificationTokensOutput {
  verificationToken: string;
  verificationTokenHash: string;
  verificationTokenExpiresAt: Date;
}

export const generateVerificationTokens =
  (): GenerateVerificationTokensOutput => {
    const verificationToken = crypto.randomBytes(32).toString("base64url");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("base64url");
    const verificationTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return {
      verificationToken,
      verificationTokenHash,
      verificationTokenExpiresAt,
    };
  };
