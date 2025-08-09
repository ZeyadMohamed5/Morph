import { useEffect, useState } from "react";
import {
  deleteProduct,
  getProductByIdSlug,
  getProductsByAdmin,
  toggleProductStatus,
  updateProduct,
} from "../../Api/products";
import EditProductModal from "./components/EditProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState({});

  const fetchProducts = async (page = 1) => {
    try {
      const data = await getProductsByAdmin(page, 10);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const handleEditClick = async (productId) => {
    try {
      const product = await getProductByIdSlug(productId);
      setEditingProduct(product);
      setShowEditModal(true);
    } catch {
      alert("Failed to fetch product details");
    }
  };

  const handleToggleActive = async (slug, currentStatus) => {
    // Set loading state for this specific product
    setLoading((prev) => ({ ...prev, [slug]: true }));

    try {
      await toggleProductStatus(slug, !currentStatus);
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isActive: !currentStatus } : p
        )
      );
    } catch (error) {
      console.error("Toggle failed:", error);
      alert("Status update failed");
    } finally {
      // Remove loading state
      setLoading((prev) => {
        const newLoading = { ...prev };
        delete newLoading[slug];
        return newLoading;
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {products.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Old Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow"
                >
                  <td className="p-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-sm text-gray-600 line-clamp-2 max-w-xs">
                    {product.description}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    EGP{product.price}
                  </td>
                  <td className="p-3 text-red-500 line-through">
                    {product.previousPrice
                      ? `EGP${product.previousPrice}`
                      : "—"}
                  </td>
                  <td className="p-3">
                    <span
                      onClick={() =>
                        handleToggleActive(product.slug, product.isActive)
                      }
                      className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                        product.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(product.slug)}
                        className="px-3 py-1.5 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.slug)}
                        className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onUpdate={() => {
            fetchProducts(currentPage);
            setShowEditModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-1">
          <button
            onClick={() => fetchProducts(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchProducts(i + 1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => fetchProducts(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
