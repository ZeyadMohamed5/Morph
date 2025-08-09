import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Utility to build query parameters
const buildParams = (paramsObj) =>
  Object.fromEntries(Object.entries(paramsObj).filter(([_, v]) => !!v));

// Dashboard Summary
export const fetchDashboardSummary = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get("/api/admin/dashboard/summary", {
    params,
  });
  return data;
};

// Monthly Sales (no date filtering)
export const fetchMonthlySales = async () => {
  const { data } = await axiosInstance.get("/api/admin/dashboard/monthlySales");
  return data;
};

// Best Time to Sell
export const fetchBestTimeToSell = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get(
    "/api/admin/dashboard/bestTimeToSell",
    {
      params,
    }
  );
  return data;
};

// Sales by Product
export const fetchSalesByProduct = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get(
    "/api/admin/dashboard/salesByProduct",
    {
      params,
    }
  );
  return data;
};

// Sales by Category
export const fetchSalesByCategory = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get(
    "/api/admin/dashboard/salesByCategory",
    {
      params,
    }
  );
  return data;
};

// Top-Selling Products
export const fetchTopSellingProducts = async (
  startDate,
  endDate,
  limit = 5
) => {
  const params = buildParams({ startDate, endDate, limit });
  const { data } = await axiosInstance.get("/api/admin/dashboard/topProducts", {
    params,
  });
  return data;
};

// Coupon Usage
export const fetchCouponUsage = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get("/api/admin/dashboard/couponUsage", {
    params,
  });
  return data;
};

export const fetchLowStockProducts = async (threshold = 5) => {
  const params = buildParams({ threshold });
  const { data } = await axiosInstance.get(
    "/api/admin/dashboard/lowStockProducts",
    { params }
  );
  return data;
};

export const fetchSalesByVariant = async (startDate, endDate) => {
  const params = buildParams({ startDate, endDate });
  const { data } = await axiosInstance.get(
    "/api/admin/dashboard/salesByVariant",
    {
      params,
    }
  );
  return data;
};
