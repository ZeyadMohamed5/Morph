import { useContext, useEffect, useState } from "react";
import CartContext from "../context/CartContext";
import { getProductById } from "../Api/products";
import ProductCartComponent from "../components/shared/ProductCartComponent";
import { useNavigate } from "react-router-dom";
import { applyCoupon } from "../Api/orders";

const HEADER_HEIGHT = 100;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, dispatch } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");
  const [discountedItems, setDiscountedItems] = useState([]);
  const [couponInfo, setCouponInfo] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyCoupon = async () => {
    setCouponError(null);
    setIsApplyingCoupon(true);

    try {
      const data = await applyCoupon(couponCode, cart);

      setDiscountedItems(data.discountedItems);
      setCouponInfo({
        code: data.couponCode,
        amount: data.couponDiscountAmount,
        total: data.totalAfterDiscount,
      });
    } catch (err) {
      console.error("Coupon apply failed:", err);
      const errorMsg = err.response?.data?.error || "Failed to apply coupon.";
      setCouponError(errorMsg);
      setCouponInfo(null);
      setDiscountedItems([]);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("📦 Cart contents:", cart);

      if (cart.length === 0) {
        console.log("🛒 Cart is empty");
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 Fetching product details for cart items...");

        const items = await Promise.all(
          cart.map(async (item, index) => {
            console.log(
              `📋 Fetching product ${index + 1}/${cart.length}:`,
              item
            );

            try {
              const product = await getProductById(item.id);
              console.log(
                `✅ Successfully fetched product ${item.id}:`,
                product
              );

              return {
                ...product,
                quantity: item.quantity,
                variantId: item.variantId,
                size: item.size,
              };
            } catch (productError) {
              console.error(
                `❌ Failed to fetch product ${item.id}:`,
                productError
              );
              // Return a placeholder or skip this item
              return null;
            }
          })
        );

        // Filter out null items (failed fetches)
        const validItems = items.filter((item) => item !== null);
        console.log("✅ Successfully fetched cart items:", validItems);

        setCartItems(validItems);

        if (validItems.length !== cart.length) {
          console.warn(
            `⚠️ Some products failed to load. Expected: ${cart.length}, Got: ${validItems.length}`
          );
        }
      } catch (error) {
        console.error("❌ Failed to fetch cart product details:", error);
        setError("Failed to load cart items. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [cart]);

  const handleDelete = (id, variantId, size) => {
    console.log("🗑️ Deleting item:", { id, variantId, size });

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id, variantId, size },
    });
  };

  const handleQuantityChange = (id, newQuantity, variantId, size) => {
    if (newQuantity < 1) {
      console.log("⚠️ Invalid quantity:", newQuantity);
      return;
    }

    console.log("🔢 Updating quantity:", { id, newQuantity, variantId, size });

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity: newQuantity, variantId, size },
    });
  };

  const handleCheckout = () => {
    setError(null);
    setIsProcessing(true);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setIsProcessing(false);
      return;
    }

    const discountAmount = couponInfo?.amount || 0;
    const totalAfterDiscount = couponInfo
      ? totalAfterCoupon
      : discountedSubtotal;
    const code = couponInfo?.code || null;

    console.log("🛒 Proceeding to checkout with:", {
      items: cartItems,
      couponCode: code,
      discountAmount,
      totalAfterDiscount,
    });

    navigate("/checkout", {
      state: {
        items: cartItems,
        couponCode: code,
        discountAmount,
        totalAfterDiscount,
      },
    });
  };

  // Calculate subtotal and total
  const subtotal = cartItems.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity;
  }, 0);

  // Discounted subtotal: sum of discounted product prices * quantity
  const discountedSubtotal = cartItems.reduce((acc, product) => {
    const priceToUse = product.discount
      ? Number(product.discount.discountedPrice)
      : Number(product.price);
    return acc + priceToUse * product.quantity;
  }, 0);

  // Coupon discount amount comes from API, but let's calculate coupon discount ratio to scale properly
  // This avoids mismatch if coupon amount is based on original subtotal
  const couponDiscountAmount = couponInfo?.amount || 0;

  // Final total after applying coupon discount on the discounted subtotal
  const totalAfterCoupon = discountedSubtotal - couponDiscountAmount;

  return (
    <section className="wrapper min-h-screen">
      <div style={{ height: HEADER_HEIGHT }} />
      <div className="grid grid-cols-12 gap-4">
        <h2 className="text-7xl uppercase col-span-12 font-playfair">Cart</h2>
        <div className="col-span-12 md:col-span-7 mb-2 md:mb-13">
          {loading ? (
            <div>
              <p className="font-playfair text-4xl text-gray-600">Loading...</p>
              <p className="text-sm text-gray-500 mt-2">
                Fetching {cart.length} items from cart
              </p>
            </div>
          ) : error ? (
            <div>
              <p className="font-playfair text-2xl text-red-600 mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-theme-clr text-white px-4 py-2 text-sm"
              >
                Retry
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div>
              <p className="font-playfair text-4xl text-gray-600">
                Your cart is empty.
              </p>
              {cart.length > 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Note: {cart.length} items in cart but failed to load product
                  details.
                </p>
              )}
            </div>
          ) : (
            <div>
              {cartItems.map((product) => (
                <ProductCartComponent
                  key={`${product.id}-${product.variantId || "default"}-${
                    product.size || "default"
                  }`}
                  product={product}
                  onDelete={handleDelete}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-5 md:px-20 h-fit font-lato mb-8">
          <h3 className="font-semibold text-gray-800 uppercase text-2xl mb-4">
            Shopping info
          </h3>

          {/* Promo Code Input */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                id="promo"
                type="text"
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.trim())}
                className="border border-gray-300 px-3 py-2 flex-1 text-gray-700 focus:outline-none font-lato"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode}
                className="bg-theme-clr text-white px-4 py-2 text-sm font-lato disabled:opacity-50"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm font-lato mt-1">
                {couponError}
              </p>
            )}
            {couponInfo && (
              <p className="text-green-600 text-sm font-lato mt-1">
                Coupon <strong>{couponInfo.code}</strong> applied!
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex justify-between mb-2 text-gray-600 font-lato text-lg">
            <span>Subtotal</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          {discountedSubtotal !== subtotal && (
            <div className="flex justify-between mb-2 text-gray-600 font-lato text-lg">
              <span>Discounted Subtotal</span>
              <span>EGP {discountedSubtotal.toFixed(2)}</span>
            </div>
          )}

          {couponInfo && (
            <>
              <div className="flex justify-between text-green-600 font-lato text-lg mb-2">
                <span>Coupon Discount</span>
                <span>- EGP {couponDiscountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-xl text-gray-800 mb-4">
                <span>Total</span>
                <span>EGP {totalAfterCoupon.toFixed(2)}</span>
              </div>
            </>
          )}

          {/* If no coupon applied, show discounted subtotal or subtotal */}
          {!couponInfo && (
            <div className="flex justify-between font-semibold text-xl text-gray-800 mb-4">
              <span>Total</span>
              <span>EGP {discountedSubtotal.toFixed(2)}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-600 mb-4 font-lato font-semibold">{error}</p>
          )}

          {/* Proceed to checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className="font-lato bg-theme-clr text-sm text-white w-full py-3 uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Proceed to checkout"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
