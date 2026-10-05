import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DISABLED";
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserParams {
  publicId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
}

export interface RefreshToken extends RowDataPacket {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  last_used_at: Date | null;
  revoked_at: Date | null;
  user_agent: string | null;
  ip_address: string | null;
}

export type CreateRefreshTokenParams = {
  user_id: string;
  token_hash: string;
  expires_at: Date;
  user_agent?: string | null;
  ip_address?: string | null;
};

export interface PasswordResetToken extends RowDataPacket {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  used_at: Date | null;
}

export interface CreatePasswordResetTokenParams {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface VerificationToken extends RowDataPacket {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  used_at: Date | null;
}

export interface CreateVerificationTokenParams {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export interface UpdatePasswordParams {
  userId: string;
  passwordHash: string;
}
