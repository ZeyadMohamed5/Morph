import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const SpecialItem = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="bg-white shadow-md overflow-hidden flex">
        {/* Image skeleton */}
        <Skeleton
          width={160}
          height={"100%"}
          className="flex flex-shrink-0"
          style={{ borderRadius: 0 }}
        />
        {/* Content skeleton */}
        <div className="p-4 flex flex-col justify-between items-start flex-1">
          <Skeleton width={150} height={25} className="mb-2" />
          <Skeleton width={100} height={20} />
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

      {/* Image container */}
      <div className="w-40 sm:w-48 h-full flex-shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between items-start flex-1">
        <div>
          <h4 className="font-light capitalize text-gray-800 mb-2 font-playfair text-xl sm:text-2xl">
            {product.name}
          </h4>

          {/* Price Section with Discount Styling */}
          <div className="text-sm mb-3 font-lato">
            {hasDiscount ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-red-600 font-semibold text-base">
                  {Math.round(discountedPrice)} EGP
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {originalPrice} EGP
                </span>
                <span className="text-green-600 text-xs font-medium">
                  Save {Math.round(originalPrice - discountedPrice)} EGP
                </span>
              </div>
            ) : product.previousPrice &&
              parseFloat(product.previousPrice) > parseFloat(product.price) ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-800 font-semibold text-base">
                  {product.price} EGP
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {product.previousPrice} EGP
                </span>
              </div>
            ) : (
              <p className="text-gray-600">{product.price} EGP</p>
            )}
          </div>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="inline-block font-lato underline text-sm text-center transition-colors text-gray-500 hover:text-gray-700"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default SpecialItem;
