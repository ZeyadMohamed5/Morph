import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import ProductCartComponent from "../components/shared/ProductCartComponent";
import { getProductById } from "../Api/products";
import { createOrder } from "../Api/orders";

const HEADER_HEIGHT = 100;

const CheckOut = () => {
  const { cart, dispatch } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [anotherMobile, setAnotherMobile] = useState("");
  const [anotherAddress, setAnotherAddress] = useState("");

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");

  const {
    items: stateItems = [],
    couponCode = null,
    discountAmount = 0,
    totalAfterDiscount = 0,
  } = location.state || {};

  useEffect(() => {
    const fetchDetails = async () => {
      if (stateItems.length > 0) {
        setCartItems(stateItems);
        setLoading(false);
        return;
      }

      if (cart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(
          cart.map(async (item) => {
            const product = await getProductById(item.id);
            return {
              ...product,
              quantity: item.quantity,
              variantId: item.variantId,
              size: item.size,
            };
          })
        );
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [cart, stateItems]);

  // Calculate subtotal properly (considering discounts)
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

  // Calculate total with product discounts (before coupon)
  const totalBeforeCoupon = cartItems.reduce((acc, item) => {
    const priceToUse = item.discount
      ? Number(item.discount.discountedPrice)
      : Number(item.price);
    return acc + priceToUse * item.quantity;
  }, 0);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "CASH_ON_DELIVERY",
      name: "Cash on Delivery",
      description: "Pay when your order is delivered to your doorstep",
      available: true,
      icon: "💵",
      details: "No additional charges • Secure delivery",
    },
    {
      id: "CREDIT_CARD",
      name: "Credit Card",
      description: "Pay securely with your credit card",
      available: false,
      icon: "💳",
      details: "Visa, MasterCard accepted • SSL secured",
    },
    {
      id: "SmartWallet",
      name: "Smart Wallet",
      description: "Pay with your Smart Wallet",
      available: false,
      icon: "💳",
      details: "Fast and secure SmartWallet checkout",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Validate required fields
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !address.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      customerEmail: email.trim(),
      mobileNumber: mobile.trim(),
      address: address.trim(),
      anotherMobile: anotherMobile.trim(),
      anotherAddress: anotherAddress.trim(),
      couponCode,
      paymentMethod, // ✅ Include payment method
      items: cartItems.map((item) => ({
        productId: item.id,
        variantId: item.variantId,
        size: item.size,
        quantity: item.quantity,
      })),
    };

    try {
      setSubmitting(true);
      await createOrder(payload);
      alert("Order placed successfully!");
      dispatch({ type: "CLEAR_CART" });
      navigate("/");
    } catch (error) {
      console.error("Order error:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to place order.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="wrapper min-h-screen">
      <div style={{ height: HEADER_HEIGHT }} />
      <div className="grid grid-cols-12 gap-8 mb-10">
        {/* Left Column: Form */}
        <h2 className="text-7xl uppercase font-playfair mb-6 col-span-12">
          Checkout Form
        </h2>
        <div className="col-span-12 md:col-span-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Contact Information Section */}
            <div>
              <h3 className="text-3xl uppercase font-lato mb-4 text-gray-900">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none resize-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Another Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    value={anotherMobile}
                    onChange={(e) => setAnotherMobile(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none focus:border-theme-clr transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-lato mb-1 text-gray-800">
                    Another Address (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={anotherAddress}
                    onChange={(e) => setAnotherAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 outline-none resize-none focus:border-theme-clr transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div>
              <h3 className="text-3xl uppercase font-lato mb-4 text-gray-900">
                Payment Method
              </h3>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex flex-col sm:flex-row items-start p-4 border cursor-pointer transition-all duration-200 w-full md:w-[48%] lg:w-[100%] ${
                      paymentMethod === method.id
                        ? "border-theme-clr bg-gray-50 shadow-md"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    } ${
                      !method.available
                        ? "opacity-50 cursor-not-allowed bg-gray-100"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={!method.available}
                      className="mt-1 mr-4 w-4 h-4 text-theme-clr focus:ring-theme-clr"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <span className="font-lato font-semibold text-gray-800 text-lg">
                            {method.name}
                          </span>
                          {!method.available && (
                            <span className="ml-2 text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full font-medium">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-lato mb-1">
                        {method.description}
                      </p>
                      <p className="text-xs text-gray-500 font-lato">
                        {method.details}
                      </p>

                      {paymentMethod === method.id && method.available && (
                        <div className="mt-2 flex items-center text-theme-clr">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "CASH_ON_DELIVERY" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-lato text-green-800">
                      You'll pay cash when your order is delivered.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className="px-8 py-3 bg-theme-clr text-white font-lato uppercase tracking-wide hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-span-12 md:col-span-4 md:col-start-8 mb-2 md:mb-13">
          <h3 className="text-3xl uppercase font-lato mb-4">Order Summary</h3>

          {loading ? (
            <div className="text-center py-8">
              <p className="font-lato text-gray-600">
                Loading order details...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-playfair text-2xl text-gray-600">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <ProductCartComponent
                  key={`${item.id}-${item.variantId || "default"}-${
                    item.size || "default"
                  }`}
                  product={item}
                  isCheckout={true}
                />
              ))}
            </div>
          )}

          {/* Order totals */}
          {cartItems.length > 0 && (
            <div className="mt-8 border-t border-gray-300 pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-lato font-medium text-gray-700">
                  Subtotal
                </span>
                <span className="font-lato text-gray-700">
                  EGP {subtotal.toFixed(2)}
                </span>
              </div>

              {/* Show product discounts if any */}
              {totalBeforeCoupon < subtotal && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span className="font-lato text-sm">Product Discounts</span>
                  <span className="font-lato text-sm">
                    -EGP {(subtotal - totalBeforeCoupon).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Show coupon discount if applied */}
              {couponCode && discountAmount > 0 && (
                <div className="flex justify-between mb-2 text-green-700">
                  <span className="font-lato">
                    Coupon <strong>{couponCode}</strong>
                  </span>
                  <span>-EGP {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Shipping info */}
              <div className="flex justify-between mb-2 text-gray-600">
                <span className="font-lato text-sm">Shipping</span>
                <span className="font-lato text-sm">will be calculated</span>
              </div>

              <div className="flex justify-between border-t border-gray-400 pt-3 mt-3">
                <span className="text-xl font-semibold font-lato text-gray-800">
                  Total
                </span>
                <span className="text-xl font-semibold font-lato text-gray-800">
                  EGP{" "}
                  {totalAfterDiscount > 0
                    ? totalAfterDiscount.toFixed(2)
                    : totalBeforeCoupon.toFixed(2)}
                </span>
              </div>

              {/* Payment method summary */}
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-lato">Payment: </span>
                  <span className="font-lato font-medium ml-1">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
