import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { productCategories } from "../../data/categories";

export const NavLinks = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 sm:gap-6 sm:text-base">
      <Link
        to="/"
        className="border-b-2 text-sm border-transparent hover:border-b-green-600 hover:text-gray-900"
      >
        Home
      </Link>
      <Link
        to="/products"
        className="text-sm border-b-green-600 hover:text-gray-900"
      >
        Shop
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen((next) => !next)}
          className="flex items-center text-sm gap-1 border-b-2 border-transparent  hover:border-b-green-600 hover:text-gray-900"
        >
          Categories
          <ChevronDown
            className={`w-4 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
            {productCategories.map((productCategory) => (
              <div key={productCategory}>
                <Link
                  to={`/products/categories/${productCategory}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setIsOpen(false)} // Closes menu when a link is clicked
                >
                  {productCategory}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/deals"
        className="hover:border-b-2 text-sm border-b-green-600 hover:text-gray-900"
      >
        Deals
      </Link>

      <Link
        to="#"
        className="hover:border-b-2 border-b-green-600 text-sm hover:text-gray-900"
      >
        About Us
      </Link>
      <Link
        to="#"
        className="hover:border-b-2 text-sm border-b-green-600 hover:text-gray-900"
      >
        Contact
      </Link>
    </nav>
  );
};
