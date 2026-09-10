// mysql config
import mysql from "mysql2/promise";

const getEnvVar = (value: string): string => {
  const envVar = process.env[value];
  if (!envVar) {
    throw new Error(`Missing required environment variable: ${value}`);
  }
  return envVar;
};

export const pool = mysql.createPool({
  host: getEnvVar("DB_HOST"),
  port: Number(getEnvVar("DB_PORT")),
  user: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASSWORD"),
  database: getEnvVar("DB_NAME"),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});
