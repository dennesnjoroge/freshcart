import { Link } from "react-router";
import { useState } from "react";
//import { useCart } from "../../hooks/useCart";
//import { useFavorites } from "../../hooks/useFavorites";
import { ShoppingCart, Heart, User, MapPin } from "lucide-react";
import { HamburgerMenu } from "./HamburgerMenu";
import { SearchBar } from "./SearchBar";
//import { useAuth } from "../../hooks/useAuth";

export const HeaderBody = () => {
  const [location, setLocation] = useState("Nairobi");
  // const { isAuthenticated, session, logout } = useAuth();
  //const { cart } = useCart();
  //const { favorites } = useFavorites();

  // debug
  const cartTotal = 10;

  /*
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );*/

  //const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  //const favoritesQuantity = favorites.length;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HamburgerMenu />

          <Link
            to="/"
            className="text-2xl font-semibold text-gray-900 sm:text-3xl"
          >
            <span className="text-green-600">Fresh</span>
            Cart
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8 min-w-0">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Delivery location */}
          <div className="hidden max-w-48 items-center gap-2 md:flex">
            <MapPin className="h-4 w-4 shrink-0 text-gray-600" />

            <span className="truncate text-sm text-gray-700">
              Deliver To{" "}
              <strong className="font-semibold text-gray-900">
                {location || "Select location"}
              </strong>
            </span>
          </div>

          {/* Favourites */}
          <Link
            to="/favorites"
            className="flex items-center gap-2 text-gray-700 transition hover:text-green-600"
          >
            <div className="relative">
              <Heart className="h-6 w-6 shrink-0" />
              {/** {favoritesQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {favoritesQuantity}
                </span>
              )}*/}
            </div>
            <span className="hidden md:block">Favourites</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-700 transition hover:text-green-600"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6 shrink-0" />
              {/**
               *  {cartQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartQuantity}
                </span>
              )}
               */}
            </div>

            <span className="hidden whitespace-nowrap font-semibold text-green-600 lg:block">
              KES {cartTotal}
            </span>
          </Link>

          {/**
           * <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="flex items-center gap-2 text-gray-700 transition hover:text-green-600"
          >
            <User className="h-6 w-6 shrink-0" />

            {isAuthenticated ? (
              <span className="hidden max-w-36 truncate font-medium md:block">
                {session.user.profile.firstName} {session.user.profile.lastName}
              </span>
            ) : (
              <span className="hidden md:block">Login / Register</span>
            )}
          </Link>
           */}

          {/* Account */}
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-700 transition hover:text-green-600"
          >
            <User className="h-6 w-6 shrink-0" />

            <span className="hidden md:block">Login / Register</span>
          </Link>

          {/** 
           *  {isAuthenticated && (
            <button
              onClick={logout}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          )}
          */}
        </div>
      </div>
      <div className="flex md:hidden items-center justify-between my-4">
        <div className="flex items-center gap-1 text-gray-900">
          <MapPin className="h-4 w-4 shrink-0 text-gray-600" />

          <span className="truncate text-sm text-gray-700">
            Deliver To{" "}
            <strong className="font-semibold text-gray-900">
              {location || "Select location"}
            </strong>
          </span>
        </div>

        <button className="px-3 py-1 bg-green-600 rounded-lg text-white cursor-pointer">
          Change
        </button>
      </div>
    </div>
  );
};
