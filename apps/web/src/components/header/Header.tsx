import { HeaderTop } from "./HeaderTop";
import { HeaderBody } from "./HeaderBody";
import { HeaderNav } from "./HeaderNav";
import { SearchBar } from "./SearchBar";

export const Header = () => {
  return (
    <div className="sticky top-0 z-50 pt-0 pb-4 bg-white shadow-md">
      <HeaderTop />
      <hr className="mb-4 border-gray-300" />
      <HeaderBody />
      <hr className="my-4 border-gray-300" />
      <div className="md:hidden px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>

      <HeaderNav />
    </div>
  );
};
