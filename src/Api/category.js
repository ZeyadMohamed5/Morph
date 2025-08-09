import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ Get active categories
export const getCategories = async () => {
  const { data } = await axiosInstance.get("/api/products/categories", {
    params: { active: true },
  });
  return data;
};
export const getCategoriesByAdmin = async () => {
  const { data } = await axiosInstance.get("/api/admin/category");
  return data;
};

export const getTagsByAdmin = async () => {
  const { data } = await axiosInstance.get("/api/admin/tags", {});
  return data;
};
export const getTags = async () => {
  const { data } = await axiosInstance.get("/api/products/tags", {
    params: { active: true },
  });
  return data;
};

// ✅ Add a new category or tag (using FormData)
export const addCategoryOrTag = async (formData) => {
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
};

// ✅ Delete a category or tag (by type and id)
export const deleteCategoryOrTag = async (id, type) => {
  const { data } = await axiosInstance.delete(`/api/admin/${type}/${id}`);
  return data;
};

// ✅ Toggle category or tag active status
export const toggleCategoryOrTagStatus = async (id, currentStatus, type) => {
  const { data } = await axiosInstance.put(`/api/admin/${type}/${id}`, {
    isActive: !currentStatus,
    type,
  });
  return data;
};
