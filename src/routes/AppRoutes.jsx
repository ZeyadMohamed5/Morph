import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import UserLogin from "../pages/UserLogin";
import AdminLayout from "../layout/AdminLayout";
import AddCategory from "../pages/adminPanelPages/AddCategory";
import Products from "../pages/adminPanelPages/Products";
import Orders from "../pages/adminPanelPages/Orders";
import OrderPage from "../pages/adminPanelPages/OrderPage";
import ProductPage from "../pages/ProductPage";
import ProtectedRoutes from "./ProtectedRoutes";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import AddProduct from "../pages/adminPanelPages/AddProduct";
import Dashboard from "../pages/adminPanelPages/Dashboard";
import AddCoupon from "../pages/adminPanelPages/AddCoupon";
import AddDiscounts from "../pages/adminPanelPages/AddDiscounts";
import NotFound from "../pages/NotFound";
import CheckOut from "../pages/CheckOut";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/login" element={<UserLogin />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/addProduct" element={<AddProduct />} />
            <Route path="/admin/category" element={<AddCategory />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/orders/:orderId" element={<OrderPage />} />
            <Route path="/admin/addcoupon" element={<AddCoupon />} />
            <Route path="/admin/addDiscount" element={<AddDiscounts />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
