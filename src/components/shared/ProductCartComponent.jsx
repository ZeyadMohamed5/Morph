import { FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProductCartComponent = ({
  product,
  isCheckout = false,
  onDelete,
  onQuantityChange,
}) => {
  const {
    name,
    price,
    id,
    imageUrl,
    quantity,
    discount,
    variantId,
    size,
    slug,
  } = product;

  const selectedVariant = product.variants?.find(
    (v) => v.id === product.variantId
  );
  const variantColor = selectedVariant?.color;

  const increaseQty = () => {
    if (onQuantityChange) {
      onQuantityChange(id, quantity + 1, variantId, size);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1 && onQuantityChange) {
      onQuantityChange(id, quantity - 1, variantId, size);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id, variantId, size);
    }
  };

  return (
    <div
      className={`border-b-2 py-4 flex flex-col md:flex-row gap-4 md:gap-6 ${
        isCheckout ? "border-gray-200" : "border-gray-300"
      }`}
    >
      {/* Image */}
      <Link
        to={`/products/${slug}`}
        className="w-full md:w-40 aspect-[4/3] md:h-50 overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain md:object-cover hover:scale-110 duration-500"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="flex flex-col gap-2">
          <Link to={`/products/${slug}`}>
            <h3 className="text-lg font-lato uppercase hover:underline">
              {name}
            </h3>
          </Link>

          {/* Show variant/size info if available */}
          {(size || variantId) && (
            <div className="text-sm text-gray-500 font-lato">
              {size && <span>Size: {size}</span>}
              {size && variantId && <span> | </span>}
              {variantId && <span>Color: {variantColor}</span>}
            </div>
          )}

          {/* Checkout Price Summary */}
          {isCheckout && (
            <p className="text-sm font-lato text-gray-500">
              {quantity} × EGP {discount ? discount.discountedPrice : price}
            </p>
          )}

          {/* Price Display */}
          {!isCheckout && (
            <>
              {discount ? (
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-sm font-lato text-gray-500 line-through">
                    EGP {price}
                  </span>
                  <span className="font-lato font-semibold text-red-500">
                    EGP {discount.discountedPrice}
                  </span>
                </div>
              ) : (
                <span className="font-lato text-gray-700 font-medium">
                  EGP {price}
                </span>
              )}
            </>
          )}

          {/* Quantity Controls (Cart only) */}
          {!isCheckout && (
            <div className="border px-3 py-1 md:px-4 md:py-2 inline-flex items-center w-fit mt-2">
              <button
                onClick={decreaseQty}
                className="text-2xl font-semibold font-playfair cursor-pointer hover:text-gray-600 transition-colors"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="text-xl px-4 md:px-6">{quantity}</span>
              <button
                onClick={increaseQty}
                className="text-2xl font-playfair font-semibold cursor-pointer hover:text-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Delete Button (Cart only) */}
        {!isCheckout && (
          <button
            onClick={handleDelete}
            className="mt-4 md:mt-0 md:ml-auto self-start md:self-end font-lato capitalize text-gray-500 flex items-center border-b gap-1 cursor-pointer hover:text-gray-400 duration-300"
          >
            <FiTrash2 className="mb-0.5" />
            delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCartComponent;
