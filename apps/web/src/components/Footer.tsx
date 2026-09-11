import { useState } from "react";
import { Link } from "react-router";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CopyrightIcon,
  ShieldCheck,
} from "lucide-react";

export const Footer = () => {
  const [emailAddress, setEmailAddress] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(emailAddress);
  };
  return (
    <footer className="border-t border-t-gray-300 bg-gray-100">
      <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <h2 className="mb-4 text-center text-xl text-gray-900 sm:text-2xl">
            Subscribe to our Newsletter
          </h2>

          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="flex w-full shadow-lg border border-green-600 overflow-hidden rounded-md"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-transparent bg-white px-3 py-2.5 text-gray-700 outline-none"
                value={emailAddress}
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
                required
              />
              <button
                type="submit"
                className="w-auto max-w-28 cursor-pointer bg-green-600 px-4 py-2.5 text-white transition-colors hover:bg-green-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div>
            <Link to="/" className="text-2xl text-gray-900 sm:text-3xl">
              <span className="text-green-600">Fresh</span>
              Cart
            </Link>

            <div className="mt-6">
              <p className="text-gray-600">
                Enjoy convenient shopping — one order away.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-2 text-gray-600">
                  <div className="flex items-center gap-1 text-gray-700">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    <span className="">Address:</span>
                  </div>
                  <span className="font-normal">Nairobi, Kenya</span>
                </div>

                <div className="flex gap-2 text-gray-600">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                    <span className="">Contact:</span>
                  </div>
                  <span className="font-normal">0712345678</span>
                </div>

                <div className="flex gap-2 text-gray-600">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                    <span className="">Email:</span>
                  </div>
                  <span className="font-normal">hello@example.com</span>
                </div>

                <div className="flex gap-2 text-gray-600">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Clock className="h-4 w-4" strokeWidth={1.5} />
                    <span className="">Hours:</span>
                  </div>
                  <span className="font-normal">Always open</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Company</h2>
            <div className="mt-4 flex flex-col gap-2 text-gray-600">
              <Link to="#">About Us</Link>
              <Link to="#">Contact</Link>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Account</h2>
            <div className="mt-4 flex flex-col gap-2 text-gray-600">
              <Link to="/account/login">Login/Signup</Link>
              <Link to="/cart">Cart</Link>
              <Link to="#">Track package</Link>
              <Link to="/favorites">Favourites</Link>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Shop</h2>
            <div className="mt-4 flex flex-col gap-2 text-gray-600">
              <Link to="/products">All Products</Link>
              <Link to="/products">Categories</Link>
              <Link to="/deals">Deals/Discounts</Link>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Socials</h2>
            <div className="mt-4 flex flex-col gap-2 text-gray-600">
              <Link to="#">Facebook</Link>
              <Link to="#">X (Twitter)</Link>
              <Link to="#">Instagram</Link>
              <Link to="#">YouTube</Link>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-600 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1">
            <CopyrightIcon className="h-4 w-4" strokeWidth={1.5} />
            <span>
              {new Date().getFullYear()} FreshCart. All rights reserved.
            </span>
          </div>

          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            <span>Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
