import type { RegisterParams } from "./auth.schema.js";
import { AuthRepository, type User } from "./auth.repository.js";
import { MailService } from "../mail/MailService.js";
import argon2 from "argon2";
import { generateVerificationToken, createVerificationLink } from "./utils.js";
import { pool } from "../../config/db.js";

const authRepository = new AuthRepository();
const mailService = new MailService();

export class AuthService {
  async register(params: RegisterParams) {
    const { firstName, lastName, email, phone, password } = params;

    const emailExists = await authRepository.getByEmail(email);
    const phoneExists = await authRepository.getByPhone(phone);

    if (emailExists) {
      // debug, change to custom api error
      throw new Error("A user with that email address already exists.");
    }
    if (phoneExists) {
      // debug, change to custom api error
      throw new Error("A user with that phone address already exists.");
    }

    const passwordHash = await argon2.hash(password);
    const userPublicId = crypto.randomUUID();

    const connection = await pool.getConnection();

    let user: User;

    try {
      await connection.beginTransaction();

      user = await authRepository.createUser(
        {
          public_id: userPublicId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password_hash: passwordHash,
        },
        connection,
      );

      const { verificationTokenPublicId, token, tokenHash, expiresAt } =
        generateVerificationToken();

      await authRepository.createVerificationToken(
        {
          public_id: verificationTokenPublicId,
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
        connection,
      );
      await connection.commit();

      const verificationLink = createVerificationLink({
        token,
        ref: verificationTokenPublicId,
      });

      mailService.sendVerificationEmail({
        to: user.email,
        firstName: user.first_name,
        verificationLink,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
