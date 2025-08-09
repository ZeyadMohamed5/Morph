import { useEffect, useState } from "react";
import {
  getDiscounts,
  createDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "../../Api/orders";
import { getProducts } from "../../Api/products";
import { getCategories } from "../../Api/category";

const AddDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    percentage: "",
    startDate: "",
    endDate: "",
    type: "product",
    referenceId: "",
  });

  useEffect(() => {
    fetchDiscounts();

    getProducts().then((res) => {
      setProducts(res.products || []);
    });

    getCategories().then((data) => {
      setCategories(data.categories || []);
      setTags(data.tags || []);
    });
  }, []);

  const fetchDiscounts = async () => {
    const data = await getDiscounts();
    setDiscounts(data || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildDiscountPayload = () => {
    const base = {
      percentage: parseFloat(formData.percentage),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    const referenceId = parseInt(formData.referenceId);

    if (formData.type === "product") {
      return { ...base, productId: referenceId };
    } else if (formData.type === "category") {
      return { ...base, categoryId: referenceId };
    } else if (formData.type === "tag") {
      return { ...base, tagId: referenceId };
    }
    return base;
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      await createDiscount(buildDiscountPayload());

      setFormData({
        percentage: "",
        startDate: "",
        endDate: "",
        type: "product",
        referenceId: "",
      });

      fetchDiscounts();
    } catch (err) {
      console.error("Error adding discount", err);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    await toggleDiscountStatus(id, currentStatus);
    fetchDiscounts();
  };

  const handleDelete = async (id) => {
    await deleteDiscount(id);
    fetchDiscounts();
  };

  const renderReferenceOptions = () => {
    const list =
      formData.type === "product"
        ? products
        : formData.type === "category"
        ? categories
        : tags;

    return Array.isArray(list)
      ? list.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
      : null;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Add Discount Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Add New Discount</h2>
        <form
          onSubmit={handleAddDiscount}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="number"
            name="percentage"
            placeholder="Discount Percentage"
            value={formData.percentage}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            step="0.01"
            required
          />
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="product">Product</option>
            <option value="category">Category</option>
            <option value="tag">Tag</option>
          </select>
          <select
            name="referenceId"
            value={formData.referenceId}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Reference</option>
            {renderReferenceOptions()}
          </select>
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Add Discount
          </button>
        </form>
      </div>

      {/* Discounts Table */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">All Discounts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "ID",
                  "Percentage",
                  "Type",
                  "Reference",
                  "Start",
                  "End",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-3 text-gray-700 font-semibold text-center"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No discounts found.
                  </td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{d.id}</td>
                    <td className="p-3">{d.percentage}%</td>
                    <td className="p-3 capitalize">{d.type}</td>
                    <td className="p-3">
                      {d.reference?.name || `ID: ${d.reference?.id}`}
                    </td>
                    <td className="p-3">
                      {new Date(d.startDate).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {new Date(d.endDate).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggle(d.id, d.isActive)}
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold transition ${
                          d.isActive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddDiscount;
