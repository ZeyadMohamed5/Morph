import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchTopSellingProducts } from "../../Api/dashboard";

// Helper function to get default date range
const getDefaultDates = () => {
  return {
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  };
};

const TopSellingProducts = ({ filters = {}, limit = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDates();

  const startDate = filters.startDate || defaultStart;
  const endDate = filters.endDate || defaultEnd;

  useEffect(() => {
    const loadTopProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTopSellingProducts(startDate, endDate, limit);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
        setError(err.message || "Error loading products.");
      } finally {
        setLoading(false);
      }
    };

    loadTopProducts();
  }, [startDate, endDate, limit]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Top-Selling Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No top-selling products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product, index) => (
            <li
              key={product.productId || `deleted-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-medium">{index + 1}.</span>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName || "Deleted Product"}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                    N/A
                  </div>
                )}
                <span className="text-gray-800 font-medium">
                  {product.productName || "Deleted Product"}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Sold: {product.quantitySold}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSellingProducts;
