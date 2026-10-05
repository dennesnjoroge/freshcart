import type { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/api-error.js";
import { getEnvVar } from "../config/env.js";

const JWT_SECRET = getEnvVar("JWT_SECRET");

// Helper function to extract the token from Authorization header or cookies
const getAuthToken = (req: Request): string | undefined => {
  const bearer = req.headers.authorization?.split(" ");

  if (bearer?.[0] === "Bearer" && bearer[1]) {
    return bearer[1];
  }

  return req.cookies?.lf_access;
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const token = getAuthToken(req);

    if (!token) {
      throw ApiError.unauthorized();
    }

    const payload = jwt.verify(token, JWT_SECRET);

    if (
      !payload ||
      typeof payload !== "object" ||
      typeof payload.sub !== "string"
    ) {
      throw ApiError.unauthorized("Invalid token payload.");
    }

    // Attach decoded user data to the request object
    // (Requires global Request type augmentation if using TypeScript)
    //req.user.publicId = decoded.sub;

    req.user = {
      publicId: payload.sub,
    };
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(ApiError.unauthorized("Invalid or expired access token."));
  }
};
