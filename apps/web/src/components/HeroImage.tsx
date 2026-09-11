import heroImage from "../assets/hero.png";

export const HeroImage = () => {
  return (
    <div className="mt-6 overflow-hidden rounded-lg shadow-sm">
      <img
        src={heroImage}
        alt="Fresh groceries and everyday essentials"
        className="h-full w-full object-cover"
      />
    </div>
  );
};
