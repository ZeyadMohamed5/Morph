import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCard = ({ product, loading = false, className = "" }) => {
  if (loading) {
    return (
      <div className={className}>
        <div className="flex flex-col h-full relative group">
          <div className="w-full aspect-[4/5] overflow-hidden relative">
            <Skeleton
              className="w-full h-full"
              style={{ borderRadius: "unset" }}
            />
          </div>
          <div className="mt-3 flex flex-col justify-between flex-grow">
            <Skeleton width="70%" height={24} className="mb-2" />
            <Skeleton width={70} height={10} className="mb-2" />
            <Skeleton width={60} height={18} />
          </div>
        </div>
      </div>
    );
  }

  const { name, price, imageUrl, discount, previousPrice, slug } = product;
  const hasDiscount = discount && discount.discountedPrice;

  return (
    <div className={className}>
      <Link to={`/products/${slug}`}>
        <div className="flex flex-col h-full relative group">
          <div className="w-full aspect-[4/5] overflow-hidden relative">
            <img
              className="w-full h-full object-cover group-hover:scale-110 duration-500"
              src={imageUrl}
              alt={name}
              loading="lazy"
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {discount.percentage}% OFF
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-col justify-between flex-grow">
            <h4 className="mt-1 font-playfair text-2xl capitalize text-gray-700">
              {name}
            </h4>
            {previousPrice && !hasDiscount && (
              <span className="text-sm line-through mr-2 text-red-400">
                EGP {previousPrice}
              </span>
            )}
            {hasDiscount ? (
              <>
                <span className="text-sm line-through mr-2 text-gray-400">
                  EGP {price}
                </span>
                <span className="text-base font-semibold text-green-600">
                  EGP {discount.discountedPrice}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-gray-700">
                EGP {price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
