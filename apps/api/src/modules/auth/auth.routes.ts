import { Router } from "express";
import { register } from "./auth.contoller.js";

export const authRoutes: Router = Router();

authRoutes.post("/register", register);
