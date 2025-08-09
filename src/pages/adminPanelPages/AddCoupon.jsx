import { useEffect, useState } from "react";
import {
  getCoupons,
  toggleCouponStatus,
  deleteCoupon,
  createCoupon,
} from "../../Api/orders";

const AddCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    percentage: "",
    minOrderAmount: "",
    maxUsage: "",
    startDate: "",
    endDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCoupon({
        ...formData,
        percentage: parseFloat(formData.percentage),
        minOrderAmount: formData.minOrderAmount
          ? parseFloat(formData.minOrderAmount)
          : null,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage, 10) : null,
      });
      console.log(formData);
      setFormData({
        code: "",
        description: "",
        percentage: "",
        minOrderAmount: "",
        maxUsage: "", // reset this too
        startDate: "",
        endDate: "",
      });
      fetchCoupons();
    } catch (err) {
      console.error("Error adding coupon", err);
    }
  };
  const handleToggle = async (id, currentStatus) => {
    try {
      await toggleCouponStatus(id, currentStatus);
      fetchCoupons();
    } catch (err) {
      console.error("Error toggling coupon status", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(Number(id));
      fetchCoupons();
    } catch (err) {
      console.error(
        "Error deleting coupon",
        err?.response?.data || err.message
      );
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add New Coupon
        </h2>
        <form
          onSubmit={handleAddCoupon}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={formData.code}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="percentage"
            placeholder="Discount Percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            required
          />
          <input
            type="number"
            name="minOrderAmount"
            placeholder="Min Order Amount"
            value={formData.minOrderAmount}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
          <input
            type="number"
            name="maxUsage"
            placeholder="Max Usage"
            value={formData.maxUsage}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Coupon
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">All Coupons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                {[
                  "ID",
                  "Code",
                  "Description",
                  "Discount (%)",
                  "Min Order",
                  "Max Usage",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="p-3 border-b text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50 transition text-sm"
                  >
                    <td className="p-3 border-b">{coupon.id}</td>
                    <td className="p-3 border-b">{coupon.code}</td>
                    <td className="p-3 border-b">
                      {coupon.description || "-"}
                    </td>
                    <td className="p-3 border-b">{coupon.percentage}%</td>
                    <td className="p-3 border-b">
                      {coupon.minOrderValue != null
                        ? `$${coupon.minOrderValue}`
                        : "-"}
                    </td>
                    <td className="p-3 border-b">
                      {coupon.maxUsage != null ? coupon.maxUsage : "-"}
                    </td>
                    <td className="p-3 border-b">
                      {new Date(coupon.startDate).toLocaleString()}
                    </td>
                    <td className="p-3 border-b">
                      {new Date(coupon.endDate).toLocaleString()}
                    </td>
                    <td className="p-3 border-b">
                      <button
                        onClick={() => handleToggle(coupon.id, coupon.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3 border-b">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;
