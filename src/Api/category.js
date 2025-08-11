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

// ✅ Get active categories (public)
export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get("/api/products/categories", {
      params: { active: true },
    });
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ✅ Get all categories (admin) - Fixed route
export const getCategoriesByAdmin = async () => {
  try {
    const { data } = await axiosInstance.get("/api/products/categories"); // Removed admin path, using products route
    return data;
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    throw error;
  }
};

// ✅ Get all tags (admin)
export const getTagsByAdmin = async () => {
  try {
    const { data } = await axiosInstance.get("/api/products/tags");
    return data;
  } catch (error) {
    console.error("Error fetching admin tags:", error);
    throw error;
  }
};

// ✅ Get active tags (public)
export const getTags = async () => {
  try {
    const { data } = await axiosInstance.get("/api/products/tags", {
      params: { active: true },
    });
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// ✅ Add a new category (using FormData)
export const addCategoryOrTag = async (formData) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/addCategory",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error adding category/tag:", error);
    throw error;
  }
};

// ✅ Update a category or tag
export const updateCategoryOrTag = async (id, updateData, type) => {
  try {
    const { data } = await axiosInstance.put(`/api/admin/category/${id}`, {
      ...updateData,
      type, // Include type in the request body
    });
    return data;
  } catch (error) {
    console.error("Error updating category/tag:", error);
    throw error;
  }
};

// ✅ Delete a category or tag (by type and id)
export const deleteCategoryOrTag = async (id, type) => {
  try {
    const { data } = await axiosInstance.delete(`/api/admin/${type}/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting category/tag:", error);
    throw error;
  }
};

// ✅ Toggle category or tag active status
export const toggleCategoryOrTagStatus = async (id, currentStatus, type) => {
  try {
    const { data } = await axiosInstance.put(`/api/admin/category/${id}`, {
      isActive: !currentStatus,
      type,
    });
    return data;
  } catch (error) {
    console.error("Error toggling category/tag status:", error);
    throw error;
  }
};
