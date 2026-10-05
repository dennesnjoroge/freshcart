import type { ResultSetHeader, Pool, PoolConnection } from "mysql2/promise";
import type {
  User,
  CreateUserParams,
  CreateRefreshTokenParams,
  CreatePasswordResetTokenParams,
  PasswordResetToken,
  CreateVerificationTokenParams,
  VerificationToken,
  UpdatePasswordParams,
  RefreshToken,
} from "./auth.types.js";
import { pool } from "../../config/db.js";

const USER_COLUMNS = `id, public_id, first_name, last_name, email, password_hash, status, email_verified_at, created_at, updated_at`;

class AuthRepository {
  async getUserById(userId: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = ? LIMIT 1`,
      [userId],
    );

    return rows[0] ?? null;
  }

  async getUserByPublicId(publicId: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE public_id = ? LIMIT 1`,
      [publicId],
    );

    return rows[0] ?? null;
  }

  async getUserByemail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    return rows[0] ?? null;
  }

  async createUser(
    params: CreateUserParams,
    connection: PoolConnection | Pool = pool,
  ): Promise<User> {
    const { publicId, firstName, lastName, email, passwordHash } = params;

    const [result] = await connection.execute<ResultSetHeader>(
      `
      INSERT INTO users (
        public_id,
        first_name,
        last_name,
        email,
        password_hash
      )
      VALUES (?, ?, ?, ?, ?)
    `,
      [publicId, firstName, lastName, email, passwordHash],
    );

    const [rows] = await connection.execute<User[]>(
      `
      SELECT
        id,
        public_id,
        first_name,
        last_name,
        email,
        password_hash
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
      [result.insertId],
    );

    const user = rows[0];

    if (!user) {
      throw new Error("Failed to retrieve created user.");
    }

    return user;
  }

  async markUserAsActive(
    userId: string,
    connection: PoolConnection,
  ): Promise<void> {
    await connection.execute(
      `UPDATE users
     SET status = 'ACTIVE',
         email_verified_at = NOW()
     WHERE id = ?
       AND status = 'PENDING_VERIFICATION'
       AND email_verified_at IS NULL`,
      [userId],
    );
  }

  async updatePassword(
    params: UpdatePasswordParams,
    connection: PoolConnection,
  ) {
    const { userId, passwordHash } = params;

    await connection.execute(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [passwordHash, userId],
    );
  }

  async createRefreshToken(
    params: CreateRefreshTokenParams,
    connection: PoolConnection | Pool = pool,
  ): Promise<void> {
    const { user_id, token_hash, expires_at, user_agent, ip_address } = params;

    await connection.execute(
      `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at,
        user_agent,
        ip_address
      )
      VALUES (?, ?, ?, ?, ?)
    `,
      [user_id, token_hash, expires_at, user_agent ?? null, ip_address ?? null],
    );

    /*const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT
        id,
        user_id,
        token_hash,
        expires_at,
        created_at,
        last_used_at,
        revoked_at,
        user_agent,
        ip_address
      FROM refresh_tokens
      WHERE id = ?
      LIMIT 1
    `,
      [result.insertId],
    );
    */
  }

  async getRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    const [rows] = await pool.execute<RefreshToken[]>(
      `SELECT id, user_id, token_hash, expires_at, created_at, last_used_at, revoked_at, user_agent, ip_address FROM refresh_tokens WHERE token_hash = ?`,
      [tokenHash],
    );

    return rows[0] ?? null;
  }

  revokeRefreshToken = async (
    refreshTokenHash: string,
    connection: Pool | PoolConnection = pool,
  ): Promise<void> => {
    await connection.execute(
      `UPDATE refresh_tokens
   SET revoked_at = ?
   WHERE token_hash = ?
     AND revoked_at IS NULL`,
      [new Date(), refreshTokenHash],
    );
  };

  async updateRefreshTokenLastUsedAt(tokenId: string) {
    await pool.execute(
      `UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = ?`,
      [tokenId],
    );
  }

  async CreatePasswordResetToken(
    params: CreatePasswordResetTokenParams,
    connection: Pool | PoolConnection = pool,
  ): Promise<void> {
    const { user_id, token_hash, expires_at } = params;
    await connection.execute(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
      [user_id, token_hash, expires_at],
    );
  }

  async getPasswordResetTokenByTokenHash(
    tokenHash: string,
    connection: Pool | PoolConnection = pool,
  ): Promise<PasswordResetToken | null> {
    const [rows] = await connection.execute<PasswordResetToken[]>(
      `SELECT id, user_id, token_hash, expires_at, created_at, used_at FROM password_reset_tokens WHERE token_hash = ?`,
      [tokenHash],
    );

    return rows[0] ?? null;
  }

  async updatePasswordResetTokenUsedAt(
    tokenId: string,
    connection: Pool | PoolConnection = pool,
  ): Promise<void> {
    await connection.execute(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ? AND used_at IS NULL`,
      [tokenId],
    );
  }

  async createVerificationToken(
    params: CreateVerificationTokenParams,
    connection: Pool | PoolConnection = pool,
  ): Promise<void> {
    const { user_id, token_hash, expires_at } = params;

    await connection.execute(
      `
      INSERT INTO verification_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        token_hash = VALUES(token_hash),
        expires_at = VALUES(expires_at),
        used_at = NULL
    `,
      [user_id, token_hash, expires_at],
    );
  }

  async getVerificationTokenByTokenHash(
    tokenHash: string,
    connection: Pool | PoolConnection = pool,
  ): Promise<VerificationToken | null> {
    const [rows] = await connection.execute<PasswordResetToken[]>(
      `SELECT id, user_id, token_hash, expires_at, created_at, used_at FROM verification_tokens WHERE token_hash = ?`,
      [tokenHash],
    );

    return rows[0] ?? null;
  }

  async updateVerificationTokenUSedAt(
    tokenId: string,
    connection: PoolConnection,
  ) {
    await connection.execute(
      `UPDATE verification_tokens SET used_at = NOW() WHERE id = ?`,
      [tokenId],
    );
  }
}

export const authRepository = new AuthRepository();
