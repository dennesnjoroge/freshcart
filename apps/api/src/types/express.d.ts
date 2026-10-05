import type { JwtPayload } from "jsonwebtoken";

interface User {
  publicId: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {};
