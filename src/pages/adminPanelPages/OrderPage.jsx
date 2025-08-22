import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../Api/orders";
import { useShippingPrice } from "../../hooks/useProducts";

const OrderPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrderDetails(data);

      setLoading(false);
    } catch (err) {
      setError("Error fetching order details");
      setLoading(false);
    }
  };

  // fetch shipping price (only runs if city exists)
  const { data: shippingPrice, isLoading: shippingLoading } = useShippingPrice(
    orderDetails?.city
  );

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  const {
    orderId: id,
    firstName,
    lastName,
    email,
    phone,
    anotherMobile,
    address,
    city,
    anotherAddress,
    status,
    createdAt,
    paymentMethod,
    items,
    coupon,
    totalPrice,
  } = orderDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Order #{id}</h2>

      {/* Customer Info */}
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <p>
            <span className="font-semibold text-gray-700">Name:</span>{" "}
            {firstName} {lastName}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Email:</span> {email}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Phone:</span> {phone}
          </p>
          <p>
            <span className="font-semibold text-gray-700">City:</span> {city}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Another Mobile:</span>{" "}
            {anotherMobile || "-"}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Address:</span>{" "}
            {address}
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Another Address:
            </span>{" "}
            {anotherAddress || "-"}
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Ordered Items
        </h3>
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => {
            const discount = item.discountApplied
              ? Number(item.discountApplied)
              : 0;
            return (
              <li
                key={index}
                className="py-4 flex items-start space-x-4 text-gray-700"
              >
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.name || "Deleted Product"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Color:{" "}
                    <span className="font-medium">{item.variant?.color}</span> |{" "}
                    Size:{" "}
                    <span className="font-medium">{item.variant?.size}</span> |{" "}
                    SKU: <span className="font-mono">{item.variant?.sku}</span>
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ({discount}% off)
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="font-semibold">
                    ${Number(item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Summary Info */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Order Summary
        </h3>
        {coupon ? (
          <div className="flex justify-between text-green-700 font-medium">
            <p>Coupon Used:</p>
            <p>
              {coupon.code} - {coupon.percentage}% off
            </p>
          </div>
        ) : (
          <div className="flex justify-between text-gray-500 italic">
            <p>No coupon used</p>
            <p>—</p>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <p className="font-semibold">Shipping:</p>
          <p>${Number(shippingPrice).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p className="font-semibold">Total Price:</p>
          <p>${Number(totalPrice).toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p className="font-semibold">Status:</p>
          <p>{status}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p className="font-semibold">Payment Method:</p>
          <p>{paymentMethod}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p className="font-semibold">Created At:</p>
          <p>
            {" "}
            {new Date(createdAt).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
