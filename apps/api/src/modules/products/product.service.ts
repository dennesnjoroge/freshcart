import { ProductRepository } from "./products.repository.js";

const productRepository = new ProductRepository();

export const getAllProductsService = async () =>
  await productRepository.getAll();

export const getProductBySlugService = async (slug: string) => {
  const product = await productRepository.getBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const getRecommendedProductsService = async () => {
  const products = await productRepository.getRandom();

  return products;
};

export const getDealsService = () => productRepository.getDeals();
