import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ─── 📦 Orders ───────────────────────────────────────────────

export const getOrderById = async (orderId) => {
  const { data } = await axiosInstance.get(`/api/admin/orders/${orderId}`);
  return data;
};

export const getAllOrders = async ({
  page,
  limit,
  status,
  startDate,
  endDate,
}) => {
  const { data } = await axiosInstance.get("/api/admin/orders", {
    params: {
      page,
      limit,
      ...(status && { status }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const { data } = await axiosInstance.put(`/api/admin/orders/${orderId}`, {
    status: newStatus,
  });
  return data;
};

// ─── 🎟️ Coupons ──────────────────────────────────────────────

export const createCoupon = async ({
  code,
  description,
  percentage,
  startDate,
  endDate,
  maxUsage,
  minOrderAmount,
}) => {
  const { data } = await axiosInstance.post("/api/admin/addCoupon", {
    code,
    description,
    percentage,
    startDate,
    endDate,
    maxUsage,
    minOrderAmount,
  });
  return data;
};

export const getCoupons = async () => {
  const { data } = await axiosInstance.get("/api/admin/coupons");
  return data;
};

export const toggleCouponStatus = async (id, isActive) => {
  const { data } = await axiosInstance.put(`/api/admin/coupons/${id}/status`, {
    isActive: !isActive,
  });
  return data;
};

export const deleteCoupon = async (id) => {
  const { data } = await axiosInstance.delete(`/api/admin/coupons/${id}`);
  return data;
};

// ─── 💸 Discounts ─────────────────────────────────────────────

export const getDiscounts = async () => {
  const { data } = await axiosInstance.get("/api/admin/discounts");
  return data;
};

export const createDiscount = async (discountData) => {
  const { data } = await axiosInstance.post(
    "/api/admin/addDiscount",
    discountData
  );
  return data;
};

export const deleteDiscount = async (id) => {
  const { data } = await axiosInstance.delete(`/api/admin/discounts/${id}`);
  return data;
};

export const toggleDiscountStatus = async (id, isActive) => {
  const { data } = await axiosInstance.patch(`/api/admin/discounts/${id}`, {
    isActive: !isActive,
  });
  return data;
};

// ─── 🛍️ Customer ──────────────────────────────────────────────

export const applyCoupon = async (couponCode, cart) => {
  const payload = {
    couponCode,
    items: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };
  const { data } = await axiosInstance.post(
    "/api/customer/couponsApply",
    payload
  );
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post(
    "/api/customer/createOrder",
    payload
  );
  return data;
};

// ─── 🚚 Shipping ──────────────────────────────────────────────

export const getAllCities = async () => {
  const { data } = await axiosInstance.get("/api/shipping/cities");
  return data;
};

export const getShippingPriceByCity = async (city) => {
  const { data } = await axiosInstance.get(`/api/shipping/price/${city}`);
  return data;
};
