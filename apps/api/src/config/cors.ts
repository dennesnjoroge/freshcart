import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://freshcart-rose-delta.vercel.app",
];

export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
});
