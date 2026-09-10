import { ProductRepository } from "./products.repository.js";

const productRepository = new ProductRepository();

export const getAllProductsService = () => productRepository.getAll();
