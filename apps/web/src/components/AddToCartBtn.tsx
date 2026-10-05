import { ShoppingCart } from "lucide-react";
//import { useCart } from "../hooks/useCart";

interface Product {
  id: string | number;
  slug: string;
  image: string;
  name: string;
  stock: number;
  price: number;
  discount: number;
}

interface AddToCartBtnProps {
  product: Product;
  quantity: number;
  //setQuantity: (value: number | ((prev: number) => number)) => void;
}

export const AddToCartBtn = ({ product, quantity }: AddToCartBtnProps) => {
  //const { addToCart } = useCart();

  //debug
  const addToCart = (product: Product, quantity: number) => {
    console.log(product, "Quantity: " + quantity);
  };
  const { stock } = product;

  const isOutOfStock = stock === 0;

  return (
    <div className="mt-3">
      <button
        onClick={() => addToCart(product, quantity)}
        disabled={isOutOfStock}
        className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold tracking-wide shadow-sm transition-all duration-200  ${
          isOutOfStock
            ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
            : "cursor-pointer bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
        }`}
      >
        <ShoppingCart className="hidden h-4 w-4 sm:block" />
        <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
      </button>
    </div>
  );
};
