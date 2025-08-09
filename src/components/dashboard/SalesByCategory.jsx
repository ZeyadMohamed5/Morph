import { useEffect, useState } from "react";
import { fetchSalesByCategory } from "../../Api/dashboard";
import dayjs from "dayjs";

const SalesByCategory = ({ filters = {} }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultStart = dayjs().subtract(30, "day").format("YYYY-MM-DD");
  const defaultEnd = dayjs().format("YYYY-MM-DD");

  const startDate = filters.startDate || defaultStart;
  const endDate = filters.endDate || defaultEnd;

  useEffect(() => {
    const loadSalesByCategory = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchSalesByCategory(startDate, endDate);

        console.log("Sales by category data:", data);
        setSalesData(data);
      } catch (err) {
        console.error("Error loading sales by category:", err);
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadSalesByCategory();
  }, [startDate, endDate]);

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : salesData.length === 0 ? (
        <p className="text-gray-500">
          No sales data available for selected period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-xs font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3 border">Category</th>
                <th className="px-4 py-3 border">Total Sales (EGP)</th>
                <th className="px-4 py-3 border">Total Quantity</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {item.categoryName}
                  </td>
                  <td className="px-4 py-2 text-green-600 font-semibold">
                    EGP{" "}
                    {parseFloat(item.totalSales).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    {item.totalQuantity.toLocaleString()}
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

export default SalesByCategory;
