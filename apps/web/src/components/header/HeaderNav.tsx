import { NavLinks } from "./NavLinks";

export const HeaderNav = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="hidden md:block ">
        <NavLinks />
      </div>
    </div>
  );
};
