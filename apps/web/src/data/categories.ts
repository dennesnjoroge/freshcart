import { products } from "./products";

export const productCategories = [
  ...new Set(products.map((product) => product.category)),
].sort();
