import type { Request, Response, NextFunction } from "express";
import { getAllProductsService } from "./product.service.js";

export const getAllProductsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await getAllProductsService();

    res.status(200).json({
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlugController = async () => {};

export const getRecommendedProductsController = async () => {};

export const getProductDealsController = async () => {};

export const getProductsByCategoryController = async () => {};
