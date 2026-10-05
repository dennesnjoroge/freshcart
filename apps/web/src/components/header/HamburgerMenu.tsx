import { useState } from "react";
import { Link } from "react-router";
import { Menu, ChevronDown } from "lucide-react";
import { productCategories } from "../../data/categories";

export const HamburgerMenu = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative max-w-md text-gray-900">
      <button
        onClick={() => {
          setIsNavbarOpen(true);
        }}
        className="flex items-center border border-gray-600 rounded-lg p-1 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isNavbarOpen && (
        <div className="fixed inset-0 bg-black/50">
          <div className="w-full max-w-2/3 h-screen bg-white p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-gray-900 text-2xl font-medium">Menu</h2>
              <button
                onClick={() => setIsNavbarOpen(false)}
                className="flex items-center border border-gray-600 rounded-lg p-1 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto mt-4 pr-2">
              <ul className="space-y-6">
                <li>
                  <Link to="/" className="text-gray-700 text-lg block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-700 text-lg block">
                    Shop
                  </Link>
                </li>

                <div className="relative">
                  <button
                    onClick={() => setIsOpen((next) => !next)}
                    className="flex items-center gap-1 text-gray-700 text-lg hover:text-gray-900 cursor-pointer w-full text-left"
                  >
                    Categories
                    <ChevronDown
                      className={`w-4 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-2 w-full bg-gray-50 border border-gray-200 rounded-md p-2 space-y-1">
                      {productCategories.map((productCategory) => (
                        <Link
                          key={productCategory}
                          to={`/products/categories/${productCategory.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded"
                          onClick={() => {
                            setIsOpen(false);
                            setIsNavbarOpen(false);
                          }}
                        >
                          {productCategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <li>
                  <Link to="/deals" className="text-gray-700 text-lg block">
                    Deals
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-700 text-lg block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-700 text-lg block">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
