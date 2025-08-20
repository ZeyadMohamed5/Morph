import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ─── 📦 Public Products ───────────────────────────────────────

export const getProducts = async ({
  page = 1,
  pageSize = 12,
  categoryId = null,
  categorySlug = null,
  minPrice = null,
  maxPrice = null,
  q = null, // Changed from 'search' to 'q' to match useProducts
  tag = null,
  tagId = null,
  discount = null,
} = {}) => {
  try {
    let endpoint = "/api/products";

    // Base parameters
    let params = {
      page,
      pageSize,
      ...(minPrice !== null && { minPrice }),
      ...(maxPrice !== null && { maxPrice }),
      ...(tag && { tag }),
      ...(tagId && { tagId }),
      ...(categoryId && { categoryId }),
      ...(discount === true && { discount: "true" }),
    };

    // Handle different endpoints
    if (q) {
      // If there's a search term, use search endpoint
      endpoint = "/api/products/search";
      params.q = q; // Pass q parameter to API
      console.log("Using search endpoint with params:", params);
    } else if (categorySlug) {
      // If no search but has category, use collection endpoint
      endpoint = `/api/products/collections/${categorySlug}`;
      console.log("Using collection endpoint with params:", params);
    } else {
      // Default products endpoint
      console.log("Using default products endpoint with params:", params);
    }

    const { data } = await axiosInstance.get(endpoint, { params });

    return {
      products: data.products || [],
      totalCount: data.totalCount || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.currentPage || page,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const getSpecialProducts = async (tag, limit = 2) => {
  try {
    const data = await getProducts({ tag, limit });
    return data.products;
  } catch (error) {
    console.error("Error fetching special products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/products/id/${id}`);
    console.log("Fetched product by ID:", data);
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const { data } = await axiosInstance.get(`/api/products/${slug}`);
    return data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

// ─── 🔒 Admin Product Operations ──────────────────────────────

export const getProductsByAdmin = async (page = 1, limit = 12) => {
  try {
    const { data } = await axiosInstance.get("/api/admin/products", {
      params: { page, limit },
    });
    return data;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw error;
  }
};

export const getProductByIdSlug = async (identifier) => {
  try {
    // Try to determine if it's an ID (number) or slug (string)
    const isId = !isNaN(identifier) && !isNaN(parseFloat(identifier));

    if (isId) {
      return await getProductById(identifier);
    } else {
      return await getProductBySlug(identifier);
    }
  } catch (error) {
    console.error("Error fetching product by ID/slug:", error);
    throw error;
  }
};

export const addProduct = async (formData) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/addProduct",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (identifier, formData) => {
  try {
    // Backend expects ID in the URL path, but we might have slug
    // If identifier is a slug, we need to convert it to ID first
    const isId = !isNaN(identifier) && !isNaN(parseFloat(identifier));

    let productId = identifier;
    if (!isId) {
      // If it's a slug, fetch the product first to get the ID
      const product = await getProductBySlug(identifier);
      productId = product.id;
    }

    const { data } = await axiosInstance.put(
      `/api/admin/product/${productId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const toggleProductStatus = async (slug, isActive) => {
  try {
    const { data } = await axiosInstance.patch(
      `/api/admin/product/${slug}/toggle-status`,
      { isActive },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw error;
  }
};

export const deleteProduct = async (identifier) => {
  try {
    // Backend deleteProduct expects ID, so convert if needed
    const isId = !isNaN(identifier) && !isNaN(parseFloat(identifier));

    let productId = identifier;
    if (!isId) {
      // If it's a slug, fetch the product first to get the ID
      const product = await getProductBySlug(identifier);
      productId = product.id;
    }

    const { data } = await axiosInstance.delete(
      `/api/admin/product/${productId}`
    );
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ─── 🔁 Variant Support ────────────────────────────────────────

export const addVariants = async (formData) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/addVariants",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error) {
    console.error("Error adding variants:", error);
    throw error;
  }
};
