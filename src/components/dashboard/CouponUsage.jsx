import { useEffect, useState } from "react";
import { fetchCouponUsage } from "../../Api/dashboard";

const CouponUsage = ({ filters = {} }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startDate = filters.startDate;
  const endDate = filters.endDate;

  const loadCouponUsage = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchCouponUsage(startDate, endDate);
      setCoupons(data);
    } catch (err) {
      console.error("Error fetching coupon usage:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCouponUsage();
  }, [startDate, endDate]);

  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-4">
      <h2 className="text-lg font-bold">Coupon Usage</h2>

      {loading ? (
        <p>Loading coupon usage...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : coupons.length === 0 ? (
        <p>No coupon usage found for this period.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 font-medium text-gray-600">Code</th>
                <th className="p-2 font-medium text-gray-600">Description</th>
                <th className="p-2 font-medium text-gray-600">Discount %</th>
                <th className="p-2 font-medium text-gray-600">Used Count</th>
                <th className="p-2 font-medium text-gray-600">Active</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t">
                  <td className="p-2">{coupon.code}</td>
                  <td className="p-2">{coupon.description || "-"}</td>
                  <td className="p-2">{Number(coupon.percentage)}%</td>
                  <td className="p-2">{coupon.usedCount}</td>
                  <td className="p-2">
                    {coupon.isActive ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CouponUsage;
