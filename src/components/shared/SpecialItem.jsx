import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const SpecialItem = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="bg-white shadow-md overflow-hidden flex ">
        {/* Image skeleton */}
        <Skeleton
          width={160}
          height={160}
          className=" flex flex-1 justify-center items-center"
          style={{ borderRadius: 0 }}
        />
        {/* Content skeleton */}
        <div className="p-4 flex flex-col justify-between items-start flex-1">
          <div>
            {/* Title skeleton */}
            <Skeleton width={150} height={25} className="mb-2" />
            {/* Price skeleton */}
            <Skeleton width={100} height={20} />
          </div>
          {/* Link skeleton */}
          <Skeleton width={80} height={20} style={{ marginTop: "1rem" }} />
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount && product.discount.percentage > 0;
  const discountedPrice = hasDiscount ? product.discount.discountedPrice : null;
  const originalPrice = parseFloat(product.price);

  return (
    <div className="bg-white shadow-md overflow-hidden flex w-full sm:max-w-sm md:max-w-md hover:shadow-lg hover:scale-105 transition duration-300 relative">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          -{product.discount.percentage}%
        </div>
      )}

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-32 h-32 sm:w-40 sm:h-40 object-cover"
      />
      <div className="p-4 flex flex-col justify-between items-start flex-1">
        <div>
          <h4 className="font-light capitalize text-gray-800 mb-1 font-playfair text-xl sm:text-2xl">
            {product.name}
          </h4>

          {/* Price Section with Discount Styling */}
          <div className="text-sm mb-3 font-lato">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Discounted Price */}
                <span className="text-red-600 font-semibold text-base">
                  {Math.round(discountedPrice)} EGP
                </span>
                {/* Original Price - Crossed Out */}
                <span className="text-gray-400 line-through text-sm">
                  {originalPrice} EGP
                </span>
                {/* Savings Amount */}
                <span className="text-green-600 text-xs font-medium">
                  Save {Math.round(originalPrice - discountedPrice)} EGP
                </span>
              </div>
            ) : (
              <p className="text-gray-600">{originalPrice} EGP</p>
            )}
          </div>
        </div>
        <Link
          to={`/products/${product.slug}`}
          className={
            "inline-block font-lato underline text-sm text-center transition-colors text-gray-500 hover:text-gray-700"
          }
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default SpecialItem;
