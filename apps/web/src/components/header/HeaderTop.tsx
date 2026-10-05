import { Link } from "react-router";
import { Package, ShieldCheck } from "lucide-react";

export const HeaderTop = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex text-sm items-center text-gray-600 sm:flex-row sm:items-center justify-between">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
          <span>Quality Guaranteed</span>
        </div>

        <Link to="#" className="flex items-center gap-2">
          <Package className="w-4 h-4" strokeWidth={1.5} />
          <span>Track Order</span>
        </Link>
      </div>
    </div>
  );
};
