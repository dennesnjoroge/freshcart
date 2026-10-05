import { authRepository } from "./auth.repository.js";
import argon2 from "argon2";
import type { AuthTokens } from "./auth.types.js";
import crypto from "node:crypto";
import type {
  ForgotPasswordParams,
  LoginParams,
  RegisterParams,
  ResendVerificationParams,
  ResetPasswordParams,
  VerifyEmailParams,
} from "./auth.schema.js";
import { ApiError } from "../../errors/api-error.js";
import { pool } from "../../config/db.js";
import { mailService } from "../mail/MailService.js";
import {
  generateAuthTokens,
  createResetLink,
  createVerificationLink,
  generateVerificationTokens,
} from "./auth.utils.js";

class AuthService {
  login = async (
    params: LoginParams,
  ): Promise<Pick<AuthTokens, "accessToken" | "refreshToken">> => {
    const { email, password } = params;
    //get user by email
    const user = await authRepository.getUserByemail(email);

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    if (user.status === "PENDING_VERIFICATION") {
      throw ApiError.forbidden(
        "Please verify your email before signing in.",
        "email_not_verified",
      );
    }

    // Verify password
    const isPasswordCorrect = await argon2.verify(user.password_hash, password);

    if (!isPasswordCorrect) {
      throw ApiError.unauthorized("Invalid email or password.");
    }

    const {
      accessToken,
      refreshToken,
      refreshTokenHash,
      refreshTokenExpiresAt,
    } = generateAuthTokens(user.public_id);

    await authRepository.createRefreshToken({
      user_id: user.id,
      token_hash: refreshTokenHash,
      expires_at: refreshTokenExpiresAt,
    });

    return { accessToken, refreshToken };
  };

  logout = async (refreshToken: string) => {
    // hash refresh token
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("base64url");

    await authRepository.revokeRefreshToken(refreshTokenHash);
  };

  register = async (params: RegisterParams) => {
    const { firstName, lastName, email, password } = params;

    // find user by email
    const user = await authRepository.getUserByemail(email);

    if (user) {
      throw ApiError.conflict("An account with this email already exists.");
    }

    // hash password
    const passwordHash = await argon2.hash(password);

    // generate user public id
    const publicId = crypto.randomUUID();

    const {
      verificationToken,
      verificationTokenHash,
      verificationTokenExpiresAt,
    } = generateVerificationTokens();

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const user = await authRepository.createUser(
        { publicId, firstName, lastName, email, passwordHash },
        connection,
      );

      await authRepository.createVerificationToken(
        {
          user_id: user.id,
          token_hash: verificationTokenHash,
          expires_at: verificationTokenExpiresAt,
        },
        connection,
      );

      await connection.commit();

      // send mail here
      //const verificationLink = createVerificationLink(verificationToken);

      mailService.sendVerificationEmail({
        firstName,
        email,
        verificationLink: createVerificationLink(verificationToken),
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  verifyEmail = async (params: VerifyEmailParams) => {
    const { token } = params;

    // hash token
    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("base64url");

    // lookup by token hash
    const tokenData =
      await authRepository.getVerificationTokenByTokenHash(incomingTokenHash);

    if (!tokenData) {
      throw ApiError.badRequest(
        "This verification link is invalid or has expired.",
        "INVALID_OR_EXPIRED_VERIFICATION_LINK",
      );
    }

    if (tokenData.used_at || tokenData.expires_at <= new Date()) {
      throw ApiError.badRequest(
        "This verification link is invalid or has expired.",
        "INVALID_OR_EXPIRED_VERIFICATION_LINK",
      );
    }

    const user = await authRepository.getUserById(tokenData.user_id);

    if (!user) {
      throw new Error(`User id: ${tokenData.user_id} not found.`);
    }

    // mark user as verified tx
    // mark token as used tx

    const connection = await pool.getConnection();

    try {
      await authRepository.markUserAsActive(tokenData.user_id, connection);

      await authRepository.updateVerificationTokenUSedAt(
        tokenData.id,
        connection,
      );

      await connection.commit();

      mailService.sendWelcomeEmail(user.email, user.first_name);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  resendVerification = async (params: ResendVerificationParams) => {
    const { email } = params;

    const user = await authRepository.getUserByemail(email);

    if (!user || user.status !== "PENDING_VERIFICATION") {
      return;
    }

    // generate verification tokens
    const {
      verificationToken,
      verificationTokenHash,
      verificationTokenExpiresAt,
    } = generateVerificationTokens();

    // save verification token
    await authRepository.createVerificationToken({
      user_id: user.id,
      token_hash: verificationTokenHash,
      expires_at: verificationTokenExpiresAt,
    });

    mailService.sendVerificationEmail({
      email: user.email,
      firstName: user.first_name,
      verificationLink: createVerificationLink(verificationToken),
    });
  };

  forgotPassword = async (params: ForgotPasswordParams) => {
    const { email } = params;
    const user = await authRepository.getUserByemail(email);

    if (!user) {
      return;
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("base64url");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("base64url");
    const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // store reset token
    await authRepository.CreatePasswordResetToken({
      user_id: user.id,
      token_hash: resetTokenHash,
      expires_at: resetTokenExpiresAt,
    });

    const resetLink = createResetLink(resetToken);

    // send email
    mailService.sendForgotPasswordEmail({
      firstName: user.first_name,
      email: user.email,
      resetLink,
    });
  };

  resetPassword = async (params: ResetPasswordParams) => {
    const { token, password } = params;
    // hash token
    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("base64url");

    // lookup by token hash
    const tokenData =
      await authRepository.getPasswordResetTokenByTokenHash(incomingTokenHash);

    if (!tokenData) {
      throw ApiError.badRequest(
        "Invalid or expired reset link.",
        "INVALID_OR_EXPIRED_RESET_LINK",
      );
    }

    if (tokenData.used_at || tokenData.expires_at <= new Date()) {
      throw ApiError.badRequest(
        "Invalid or expired reset link.",
        "INVALID_OR_EXPIRED_RESET_LINK",
      );
    }

    const user = await authRepository.getUserById(tokenData.user_id);

    if (!user) {
      throw new Error(`User id: ${tokenData.user_id} not found.`);
    }

    const passwordHash = await argon2.hash(password);

    // update user password tx
    // mark token as used tx

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await authRepository.updatePassword(
        { userId: user.id, passwordHash },
        connection,
      );
      await authRepository.updatePasswordResetTokenUsedAt(
        tokenData.id,
        connection,
      );

      await connection.commit();

      // send mail here
      mailService.sendPasswordResetEmail(user.first_name, user.email);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  getCurrentUser = async (publicId: string) => {
    const user = await authRepository.getUserByPublicId(publicId);

    if (!user) {
      throw ApiError.unauthorized("User account not found.");
    }

    return {
      publicId: user.public_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.email_verified_at,
    };
  };

  refresh = async (refreshToken: string) => {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("base64url");

    const tokenData =
      await authRepository.getRefreshTokenByHash(refreshTokenHash);

    if (!tokenData) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    if (tokenData.revoked_at || tokenData.expires_at <= new Date()) {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const user = await authRepository.getUserById(tokenData.user_id);

    if (!user) {
      throw ApiError.unauthorized("User account not found.");
    }

    const { accessToken } = generateAuthTokens(user.public_id);

    await authRepository.updateRefreshTokenLastUsedAt(tokenData.id);

    return {
      accessToken,
    };
  };
}

export const authService = new AuthService();
