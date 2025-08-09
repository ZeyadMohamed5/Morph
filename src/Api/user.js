import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginAdmin = async ({ username, password }) => {
  try {
    const { data } = await axiosInstance.post("/api/admin/login", {
      username,
      password,
    });

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials");
  }
};
