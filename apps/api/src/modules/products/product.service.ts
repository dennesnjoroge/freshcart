import { ProductRepository } from "./products.repository.js";

const productRepository = new ProductRepository();

// all products
export const getAllProductsService = async () =>
  await productRepository.getAll();

// recommended products
export const getRecommendedProductsService = async () => {
  const products = await productRepository.getRandom();

  return products;
};

// deals
export const getDealsService = () => productRepository.getDeals();

// get by category
export const getProductsByCategoryService = async (category: string) => {
  const products = await productRepository.getByCategory(category);

  if (products.length === 0) {
    throw new Error(`No products found in category: ${category}`);
  }

  return products;
};

// get by slug
export const getProductBySlugService = async (slug: string) => {
  const product = await productRepository.getBySlug(slug);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
