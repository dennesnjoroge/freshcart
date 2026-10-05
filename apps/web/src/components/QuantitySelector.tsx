interface Product {
  id: string | number;
  slug: string;
  image: string;
  name: string;
  stock: number;
  price: number;
  discount: number;
}

interface QuantitySelectorProps {
  product: Product;
  quantity: number;
  setQuantity: (value: number | ((prev: number) => number)) => void;
}

export const QuantitySelector = ({
  product,
  quantity,
  setQuantity,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="hidden md:block text-sm font-semibold text-gray-600">
        Quantity
      </span>

      <div className="flex my-4 items-center border border-gray-300 rounded-lg overflow-hidden h-11 bg-white shadow-sm">
        <button
          disabled={product.stock === 0 || quantity <= 1}
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="px-3 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold transition-colors border-r border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            if (product.stock === 0) return;

            const value = Number(e.target.value);

            if (Number.isNaN(value)) return;

            setQuantity(Math.max(1, Math.min(product.stock, value)));
          }}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12 text-center font-medium text-gray-900 outline-none h-full"
        />
        <button
          disabled={product.stock === 0 || quantity >= product.stock}
          onClick={() => {
            setQuantity((prev) => Math.min(product.stock, prev + 1));
          }}
          className="px-3 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold transition-colors border-l border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  );
};
