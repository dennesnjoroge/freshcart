import type {
  ResultSetHeader,
  RowDataPacket,
  PoolConnection,
} from "mysql2/promise";
import { pool } from "../../config/db.js";

export interface User extends RowDataPacket {
  id: bigint;
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "DISABLED";
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserParams {
  public_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  password_hash: string;
  status?: User["status"];
}

export interface EmailVerificationToken extends RowDataPacket {
  id: number;
  public_id: string;
  user_id: bigint;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface CreateVerificationTokenParams {
  public_id: string;
  user_id: bigint;
  token_hash: string;
  expires_at: Date;
}

const USER_COLUMNS = `
  id,
  public_id,
  first_name,
  last_name,
  email,
  phone,
  password_hash,
  email_verified_at,
  phone_verified_at,
  status,
  created_at,
  updated_at
`;

const VERIFICATION_TOKEN_COLUMNS = `
  id,
  public_id,
  user_id,
  token_hash,
  expires_at,
  used_at,
  created_at
`;

export class AuthRepository {
  // -------------------------
  // Users
  // -------------------------
  async getByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    return rows[0] ?? null;
  }

  async getByPhone(phone: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE phone = ? LIMIT 1`,
      [phone],
    );

    return rows[0] ?? null;
  }

  async createUser(
    params: CreateUserParams,
    connection: PoolConnection,
  ): Promise<User> {
    const {
      public_id,
      first_name,
      last_name,
      email,
      phone = null,
      password_hash,
      status = "PENDING_VERIFICATION",
    } = params;

    const [result] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO users (
          public_id,
          first_name,
          last_name,
          email,
          phone,
          password_hash,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [public_id, first_name, last_name, email, phone, password_hash, status],
    );

    const user = await this.getById(result.insertId);

    if (!user) {
      throw new Error("Failed to retrieve created user");
    }

    return user;
  }

  async getById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS}
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    return rows[0] ?? null;
  }

  // -------------------------
  // Email verification
  // -------------------------

  createVerificationToken = async (
    params: CreateVerificationTokenParams,
    connection: PoolConnection,
  ): Promise<EmailVerificationToken> => {
    const { public_id, user_id, token_hash, expires_at } = params;

    const [result] = await connection.execute<ResultSetHeader>(
      `
        INSERT INTO email_verification_tokens (
          public_id,
          user_id,
          token_hash,
          expires_at
        )
        VALUES (?, ?, ?, ?)
      `,
      [public_id, user_id, token_hash, expires_at],
    );

    const token = await this.getVerificationTokenById(result.insertId);

    if (!token) {
      throw new Error("Failed to retrieve created verification token");
    }

    return token;
  };

  getVerificationTokenById = async (
    id: number,
  ): Promise<EmailVerificationToken | null> => {
    const [rows] = await pool.execute<EmailVerificationToken[]>(
      `
          SELECT ${VERIFICATION_TOKEN_COLUMNS}
          FROM email_verification_tokens
          WHERE id = ?
          LIMIT 1
        `,
      [id],
    );

    return rows[0] ?? null;
  };

  getValidVerificationToken = async (
    publicId: string,
    tokenHash: string,
  ): Promise<EmailVerificationToken | null> => {
    const [rows] = await pool.execute<EmailVerificationToken[]>(
      `
          SELECT ${VERIFICATION_TOKEN_COLUMNS}
          FROM email_verification_tokens
          WHERE public_id = ?
            AND token_hash = ?
            AND used_at IS NULL
            AND expires_at > CURRENT_TIMESTAMP
          LIMIT 1
        `,
      [publicId, tokenHash],
    );

    return rows[0] ?? null;
  };

  markVerificationTokenUsed = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `
        UPDATE email_verification_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND used_at IS NULL
      `,
      [id],
    );

    return result.affectedRows === 1;
  };

  markEmailVerified = async (userId: number): Promise<boolean> => {
    const [result] = await pool.execute<ResultSetHeader>(
      `
        UPDATE users
        SET
          email_verified_at = CURRENT_TIMESTAMP,
          status = 'ACTIVE'
        WHERE id = ?
          AND email_verified_at IS NULL
      `,
      [userId],
    );

    return result.affectedRows === 1;
  };
}
