import express, { type Express, type Request, type Response } from "express";
import { router } from "./routes.js";

export const app: Express = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use("/v1", router);
