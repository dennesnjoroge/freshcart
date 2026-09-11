//import { Header } from "../components/header/Header";
import { HeroImage } from "../components/HeroImage";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { apiClient } from "../config/api";
import { Footer } from "../components/Footer";
import { ProductCard } from "../components/ProductCard";

interface Product {
  id: string | number;
  slug: string;
  image: string;
  name: string;
  stock: boolean;
  price: number;
  discount: number;
}

export const Home = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await apiClient.get("/v1/products/recommended");
        setRecommendedProducts(
          response.data.data.products.map((product: Product) => ({
            ...product,
            price: Number(product.price),
            discount: Number(product.discount),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  if (loading) {
    return "Loading...";
  }

  if (recommendedProducts.length === 0) {
    return;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <HeroImage />
      </div>

      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="my-8 sm:my-10">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Recommended
            </h2>
            <Link
              to="/products"
              className="text-sm text-green-600 hover:text-green-700"
            >
              See all
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {recommendedProducts.map((recommendedProduct) => (
              <ProductCard
                key={recommendedProduct.id}
                product={recommendedProduct}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
