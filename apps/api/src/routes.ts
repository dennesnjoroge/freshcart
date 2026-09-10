import { Router } from "express";
import { productRoutes } from "./modules/products/product.routes.js";

export const router: Router = Router();

//router.use("/auth", authRoutes);
router.use("/products", productRoutes);
//router.use("/cart", cartRoutes);
