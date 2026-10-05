// mysql config
import mysql from "mysql2/promise";
import { getEnvVar } from "./env.js";

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
