import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().min(10).max(15),
  password: z.string().min(8).max(128),
});

export type RegisterParams = z.infer<typeof registerSchema>;
