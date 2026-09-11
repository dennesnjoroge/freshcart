import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { router } from "./routes.js";

export const app: Express = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-production-app.com"],
    credentials: true,
  }),
);

app.get("/health", (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use("/v1", router);
