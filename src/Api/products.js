import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ─── 📦 Public Products ───────────────────────────────────────

export const getProducts = async ({
  page = 1,
  limit = 12,
  categoryId = null,
  categorySlug = null,
  minPrice = null,
  maxPrice = null,
  searchQuery = null,
  tag = null,
  active = true,
} = {}) => {
  let endpoint = "/api/products";
  let params = {
    page,
    limit,
    ...(minPrice !== null && { minPrice }),
    ...(maxPrice !== null && { maxPrice }),
    ...(searchQuery && { q: searchQuery }), // the key is 'q' to match backend
    ...(tag && { tag }),
    ...(active !== null && { active }),
    ...(categoryId && { categoryId }), // new: needed for search filter
  };

  if (categorySlug) {
    // Use collection route - INCLUDE all filter parameters
    endpoint = `/api/products/collections/${categorySlug}`;
    params = {
      page,
      limit,
      ...(minPrice !== null && { minPrice }),
      ...(maxPrice !== null && { maxPrice }),
      ...(active !== null && { active }),
    };
  } else if (searchQuery) {
    endpoint = "/api/products/search";
  }

  const { data } = await axiosInstance.get(endpoint, { params });
  return data;
};

export const getSpecialProducts = async (tag, limit = 2) => {
  const data = await getProducts({ tag, limit });
  return data.products;
};

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/api/products/id/${id}`);
  console.log("Fetched product by ID:", data);
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await axiosInstance.get(`/api/products/${slug}`);
  return data;
};

// ─── 🔒 Admin Product Operations ──────────────────────────────

export const getProductsByAdmin = async (page = 1, limit = 12) => {
  const { data } = await axiosInstance.get("/api/admin/products", {
    params: { page, limit },
  });
  return data;
};

export const getProductByIdSlug = async (slug) => {
  const { data } = await axiosInstance.get(`/api/products/${slug}`);
  return data;
};

export const addProduct = async (formData) => {
  const { data } = await axiosInstance.post("/api/admin/addProduct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProduct = async (slug, formData) => {
  const { data } = await axiosInstance.put(
    `/api/admin/product/${slug}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const toggleProductStatus = async (slug, isActive) => {
  const { data } = await axiosInstance.patch(
    `/api/admin/product/${slug}/toggle-status`,
    { isActive },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await axiosInstance.delete(`/api/admin/product/${id}`);
  return data;
};

// ─── 🔁 Variant Support ────────────────────────────────────────

export const addVariants = async (formData) => {
  const { data } = await axiosInstance.post(
    "/api/admin/addVariants",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};
