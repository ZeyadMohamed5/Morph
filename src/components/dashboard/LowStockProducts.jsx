import { useEffect, useState } from "react";
import { fetchLowStockProducts } from "../../Api/dashboard";

const LowStockProducts = ({ threshold = 5 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLowStock = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchLowStockProducts(threshold);
        setProducts(data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    loadLowStock();
  }, [threshold]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          ⚠️ Low Stock Products
        </h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          ⚠️ Low Stock Products
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          ⚠️ Low Stock Products
        </h3>
        <p className="text-green-600">All products have sufficient stock.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-red-600">
        ⚠️ Low Stock Products
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-red-50 border border-gray-300 rounded-lg p-4 shadow-sm max-w-xs w-full aspect-[1/1] flex flex-col"
          >
            <p className="text-lg font-bold mb-2">{product.name}</p>

            <div
              className="overflow-y-auto pr-1 space-y-2 text-sm scroll-hide"
              style={{ maxHeight: "calc(100% - 2rem)" }}
            >
              {product.variants.map((variant, i) => (
                <div key={i}>
                  <p className="font-semibold text-gray-800">
                    Color: {variant.color}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Total stock:{" "}
                    <span className="text-blue-600 font-medium">
                      {variant.totalStock}
                    </span>
                  </p>
                  <ul className="list-disc list-inside ml-2 text-gray-700">
                    {variant.sizes.map((size, j) => (
                      <li key={j}>
                        Size: {size.size} —{" "}
                        <span className="text-red-600 font-medium">
                          {size.stock} left
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockProducts;
