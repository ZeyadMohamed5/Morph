import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../Api/orders";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-green-100 text-green-800",
  delivered: "bg-purple-100 text-purple-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const statusFilter = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const limit = 10;

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders({
        page,
        limit,
        status: statusFilter,
        startDate,
        endDate,
      });
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, startDate, endDate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch {
      alert("Error updating status");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", newPage);
        return params;
      });
    }
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      value ? params.set("status", value) : params.delete("status");
      params.set("page", 1);
      return params;
    });
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      value ? params.set("startDate", value) : params.delete("startDate");
      params.set("page", 1);
      return params;
    });
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      value ? params.set("endDate", value) : params.delete("endDate");
      params.set("page", 1);
      return params;
    });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams({ page: "1" }));
  };

  const handleOrderClick = (orderId) => {
    navigate(`${orderId}`);
  };

  const handleExportCSV = () => {
    if (!orders.length) return;
    const headers = ["Order ID", "Customer", "Total Price", "Date", "Status"];
    const rows = orders.map((o) => [
      `#${o.orderId}`,
      `${o.customerInfo?.firstName} ${o.customerInfo?.lastName}`,
      `$${o.totalPrice}`,
      new Date(o.createdAt).toLocaleDateString(),
      o.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_page_${page}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reset
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Export
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total Price</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Badge</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="bg-white shadow-sm rounded-lg hover:shadow-md transition cursor-pointer"
                    onClick={() => handleOrderClick(order.orderId)}
                  >
                    <td className="p-3 font-medium">#{order.orderId}</td>
                    <td className="p-3">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </td>
                    <td className="p-3 text-sm text-gray-600 relative group">
                      ...
                      <div className="absolute z-10 hidden group-hover:block bg-white border rounded-lg shadow-md p-2 text-xs max-w-xs">
                        {order.items
                          .slice(0, 5)
                          .map(
                            (item) =>
                              `${item.product?.name || "Deleted"} x ${
                                item.quantity
                              }`
                          )
                          .join(", ")}
                        {order.items.length > 5 && " ..."}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      ${order.totalPrice}
                    </td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        className="px-2 py-1 border rounded-lg text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
