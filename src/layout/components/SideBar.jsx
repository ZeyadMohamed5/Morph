import { NavLink } from "react-router-dom";

const SideBar = () => {
  const linkClass =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition";

  return (
    <aside className="w-60 min-h-full bg-gray-100 p-4 shadow-lg shadow-black/15 z-1">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/addProduct"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Add Product
        </NavLink>
        <NavLink
          to="/admin/category"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Add Category
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          View Orders
        </NavLink>
        <NavLink
          to="/admin/addCoupon"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Add Coupon
        </NavLink>
        <NavLink
          to="/admin/addDiscount"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? "bg-gray-300 font-semibold" : ""}`
          }
        >
          Add Discount
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;
