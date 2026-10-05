import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  me,
  refresh,
} from "./auth.contoller.js";
import { requireAuth } from "../../middlewares/auth.js";

export const authRoutes: Router = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/register", register);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/resend-verification", resendVerification);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/refresh", refresh);
