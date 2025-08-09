import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const SpecialItem = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="bg-white shadow-md overflow-hidden flex w-full sm:max-w-sm md:max-w-md ">
        {/* Image skeleton */}
        <Skeleton
          width={160}
          height={160}
          className="flex-shrink-0"
          style={{ borderRadius: 0 }}
        />
        {/* Content skeleton */}
        <div className="p-4 flex flex-col justify-between items-start flex-1">
          <div>
            {/* Title skeleton */}
            <Skeleton width={180} height={25} className="mb-2" />
            {/* Price skeleton */}
            <Skeleton width={100} height={20} />
          </div>
          {/* Link skeleton */}
          <Skeleton width={80} height={20} style={{ marginTop: "1rem" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md overflow-hidden flex w-full sm:max-w-sm md:max-w-md hover:shadow-lg hover:scale-105 transition duration-300">
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
          <p className="text-gray-600 text-sm mb-3 font-lato">
            {product.price} EGP
          </p>
        </div>
        <Link
          to={`/products/${product.slug}`}
          className="inline-block font-lato text-gray-500 underline text-sm text-center"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default SpecialItem;
