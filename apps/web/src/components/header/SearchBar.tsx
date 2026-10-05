import { useState } from "react";

export const SearchBar = () => {
  const [searchItem, setSearchItem] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(searchItem);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-full md:w-full md:max-w-md overflow-hidden rounded-lg border border-green-600 md:flex"
    >
      <input
        type="search"
        placeholder="Search for products"
        className="w-full px-3 py-2 outline-none [&::-webkit-search-cancel-button]:appearance-none"
        value={searchItem}
        onChange={(e) => {
          setSearchItem(e.target.value);
        }}
      />
      <button
        type="submit"
        className="cursor-pointer bg-green-600 px-5 py-2 text-white transition-colors hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
};
