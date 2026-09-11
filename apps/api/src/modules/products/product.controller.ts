import type { Request, Response, NextFunction } from "express";
import {
  getAllProductsService,
  getProductBySlugService,
  getRecommendedProductsService,
  getDealsService,
  getProductsByCategoryService,
} from "./product.service.js";

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

export const getRecommendedProductsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await getRecommendedProductsService();

    res.status(200).json({
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductDealsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await getDealsService();

    res.status(200).json({
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { param } = req.params;

    if (!param || Array.isArray(param)) {
      return res.sendStatus(400);
    }

    const category = param.trim().toLowerCase();

    const products = await getProductsByCategoryService(category);

    res.status(200).json({
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { param } = req.params;

    if (!param || Array.isArray(param)) {
      return res.sendStatus(400);
    }

    const slug = param.trim();

    const product = await getProductBySlugService(slug);

    res.status(200).json({
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
