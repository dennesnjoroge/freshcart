import { Router } from "express";
import {
  getAllProductsController,
  getProductBySlugController,
  getRecommendedProductsController,
  getProductDealsController,
  getProductsByCategoryController,
} from "./product.controller.js";

export const productRoutes: Router = Router();

productRoutes.get("/", getAllProductsController);
productRoutes.get("/recommended", getRecommendedProductsController);
productRoutes.get("/promotions/deals", getProductDealsController);
productRoutes.get("/categories/:param", getProductsByCategoryController);
productRoutes.get("/:param", getProductBySlugController);
