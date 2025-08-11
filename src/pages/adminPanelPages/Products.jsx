import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, toggleProductStatus } from "../../Api/products";
import {
  useAdminProducts,
  useAdminProduct,
  adminKeys,
  productKeys,
} from "../../hooks/useProducts"; // Adjust path
import EditProductModal from "./components/EditProductModal";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const queryClient = useQueryClient();

  // Use React Query for products list
  const {
    data: productsData = {},
    isLoading,
    error,
    refetch,
  } = useAdminProducts(currentPage, 10);

  const { products = [], totalPages = 1 } = productsData;

  // Use React Query for individual product details (for editing)
  const { data: editingProduct, isLoading: isLoadingProduct } =
    useAdminProduct(editingProductId);

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: adminKeys.productsList(currentPage, 10),
      });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(
        adminKeys.productsList(currentPage, 10)
      );

      // Optimistically update - remove the product immediately
      queryClient.setQueryData(
        adminKeys.productsList(currentPage, 10),
        (old) => ({
          ...old,
          products:
            old?.products?.filter(
              (p) => p.id !== productId && p.slug !== productId
            ) || [],
        })
      );

      return { previousProducts };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(
          adminKeys.productsList(currentPage, 10),
          context.previousProducts
        );
      }
      console.error("Delete failed:", err);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  // Toggle status mutation with optimistic updates
  const toggleStatusMutation = useMutation({
    mutationFn: ({ slug, newStatus }) => toggleProductStatus(slug, newStatus),
    onMutate: async ({ slug, newStatus }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: adminKeys.productsList(currentPage, 10),
      });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(
        adminKeys.productsList(currentPage, 10)
      );

      // Optimistically update - change status immediately
      queryClient.setQueryData(
        adminKeys.productsList(currentPage, 10),
        (old) => ({
          ...old,
          products:
            old?.products?.map((p) =>
              p.slug === slug ? { ...p, isActive: newStatus } : p
            ) || [],
        })
      );

      return { previousProducts, slug };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(
          adminKeys.productsList(currentPage, 10),
          context.previousProducts
        );
      }
      console.error("Toggle failed:", err);
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  const handleDelete = (productId) => {
    if (!window.confirm("Delete this product?")) return;
    deleteMutation.mutate(productId);
  };

  const handleEditClick = (productSlug) => {
    setEditingProductId(productSlug);
    setShowEditModal(true);
  };

  const handleToggleActive = (slug, currentStatus) => {
    toggleStatusMutation.mutate({
      slug,
      newStatus: !currentStatus,
    });
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProductId(null);
  };

  const handleUpdateSuccess = () => {
    // Invalidate queries to refetch fresh data
    queryClient.invalidateQueries({ queryKey: adminKeys.products() });
    queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    handleCloseModal();
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || "Failed to fetch products. Please try again."}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  onClick={() => refetch()}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {/* Mutation error messages */}
      {deleteMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">
            Failed to delete product. Please try again.
          </p>
        </div>
      )}

      {toggleStatusMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">
            Status update failed. Please try again.
          </p>
        </div>
      )}

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
              {products.map((product) => {
                const isTogglingStatus =
                  toggleStatusMutation.isPending &&
                  toggleStatusMutation.variables?.slug === product.slug;
                const isDeletingProduct =
                  deleteMutation.isPending &&
                  (deleteMutation.variables === product.id ||
                    deleteMutation.variables === product.slug);

                return (
                  <tr
                    key={product.id}
                    className={`bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow ${
                      isDeletingProduct ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-14 w-14 rounded object-cover"
                          loading="lazy"
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
                          !isTogglingStatus &&
                          handleToggleActive(product.slug, product.isActive)
                        }
                        className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                          isTogglingStatus
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : product.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {isTogglingStatus
                          ? "Updating..."
                          : product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(product.slug)}
                          disabled={isDeletingProduct}
                          className="px-3 py-1.5 text-xs bg-yellow-400 text-white rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeletingProduct}
                          className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeletingProduct ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && !isLoadingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {/* Loading modal for product details */}
      {showEditModal && isLoadingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-center text-gray-600">
              Loading product details...
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentPage === pageNum
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
