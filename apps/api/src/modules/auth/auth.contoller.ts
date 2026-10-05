import type { RequestHandler } from "express";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schema.js";
import { authService } from "./auth.service.js";
import { ApiError } from "../../errors/api-error.js";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const params = loginSchema.parse(req.body);

    const { accessToken, refreshToken } = await authService.login(params);

    res
      .cookie("lf_access", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
      })
      .cookie("lf_refresh", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/v1/auth",
      });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.lf_refresh;

    await authService.logout(refreshToken);

    res
      .clearCookie("lf_access", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      .clearCookie("lf_refresh", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/v1/auth",
      });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  try {
    const params = registerSchema.parse(req.body);

    await authService.register(params);

    return res.status(201).json({
      success: true,
      message:
        "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    const params = verifyEmailSchema.parse(req.body);

    await authService.verifyEmail(params);

    return res.status(200).json({
      success: true,
      message: "Your email address has been verified.",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification: RequestHandler = async (req, res, next) => {
  try {
    const params = resendVerificationSchema.parse(req.body);

    await authService.resendVerification(params);

    return res.status(200).json({
      success: true,
      message:
        "If your account requires verification, a verification email has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const params = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(params);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for that email address, password reset instructions have been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    const params = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(params);

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const { publicId } = req.user;

    const user = await authService.getCurrentUser(publicId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.lf_refresh;

    if (!refreshToken || typeof refreshToken !== "string") {
      throw ApiError.unauthorized("Invalid refresh token.");
    }

    const { accessToken } = await authService.refresh(refreshToken);

    res.cookie("lf_access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
