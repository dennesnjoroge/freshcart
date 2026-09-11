import { Link } from "react-router";
//import { AddToCartBtn } from "../AddToCartBtn";
import { STATIC_ASSETS_URL } from "../config/url";
//import { useState } from "react";
//import { QuantitySelector } from "../QuantitySelector";

interface Product {
  id: string | number;
  slug: string;
  image: string;
  name: string;
  stock: boolean;
  price: number;
  discount: number;
}

export const ProductCard = ({ product }: { product: Product }) => {
  //const [quantity, setQuantity] = useState(1);

  return (
    <div
      key={product.id}
      className="flex h-full flex-col justify-between rounded-md border border-gray-100 p-3 shadow-sm transition-all duration-200 hover:border-green-600 hover:shadow-md sm:p-4"
    >
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={`${STATIC_ASSETS_URL}${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {product.stock ? (
            <span className="inline-flex w-fit items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              In Stock
            </span>
          ) : (
            <span className="inline-flex w-fit items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
              Out of Stock
            </span>
          )}

          <p className="font-medium text-gray-600 line-clamp-2">
            {product.name}
          </p>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-xl text-green-600 sm:text-2xl">
              {product.price.toLocaleString("en-KE", {
                style: "currency",
                currency: "KES",
              })}
            </span>

            {product.discount > 0 && (
              <span className="text-lg text-red-600 line-through">
                {(product.price + product.discount).toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES",
                })}
              </span>
            )}
          </div>

          {product.discount > 0 && (
            <p className="text-sm text-gray-600">
              Save{" "}
              {product.discount.toLocaleString("en-KE", {
                style: "currency",
                currency: "KES",
              })}
            </p>
          )}
        </div>
      </Link>

      {/**
       *  <QuantitySelector
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <AddToCartBtn product={product} quantity={quantity} />
       */}
    </div>
  );
};
