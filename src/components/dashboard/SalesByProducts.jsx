import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchSalesByProduct } from "../../Api/dashboard";

const SalesByProduct = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultStart = dayjs().subtract(30, "day").format("YYYY-MM-DD");
  const defaultEnd = dayjs().format("YYYY-MM-DD");

  const startDate = filters.startDate || defaultStart;
  const endDate = filters.endDate || defaultEnd;

  useEffect(() => {
    const loadSalesByProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchSalesByProduct(startDate, endDate);
        setData(result);
      } catch (err) {
        console.error("Error fetching sales by product:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadSalesByProduct();
  }, [startDate, endDate]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Sales by Product
        </h3>
        <p className="text-sm text-gray-600">
          Product performance from {dayjs(startDate).format("MMM DD")} to{" "}
          {dayjs(endDate).format("MMM DD, YYYY")}
        </p>
      </div>

      {error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Data
            </h4>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13h2m-6 0h2m0 0V9a2 2 0 00-2-2H8a2 2 0 00-2 2v4h4z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              No Data Available
            </h4>
            <p className="text-gray-500 text-sm">
              No sales data found for the selected date range.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Avg. Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => {
                  const avgPrice = item.totalSales / item.totalQuantity;
                  const isTopPerformer = index < 3; // Highlight top 3 products

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isTopPerformer
                          ? "bg-gradient-to-r from-blue-50 to-transparent"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isTopPerformer && (
                            <div className="flex-shrink-0 mr-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : "bg-orange-500"
                                }`}
                              >
                                {index + 1}
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.productName}
                            </div>
                            {isTopPerformer && (
                              <div className="text-xs text-blue-600 font-medium">
                                Top Performer
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(item.totalQuantity)}
                        </div>
                        <div className="text-xs text-gray-500">units</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.totalSales)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-700">
                          {formatCurrency(avgPrice)}
                        </div>
                        <div className="text-xs text-gray-500">per unit</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data.length > 10 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center">
                Showing {data.length} products
              </div>
            </div>
          )}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              Total Products
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {data.length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              Total Quantity
            </div>
            <div className="text-2xl font-bold text-green-900">
              {formatNumber(
                data.reduce((sum, item) => sum + item.totalQuantity, 0)
              )}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-800">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.totalSales, 0)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesByProduct;
