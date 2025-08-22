import { useQuery } from "@tanstack/react-query";
import {
  getSpecialProducts,
  getProducts,
  getProductByIdSlug,
  getProductsByAdmin,
} from "../Api/products";
import { getCategories as fetchCategories, getTags } from "../Api/category";

import { getAllCities, getShippingPriceByCity } from "../Api/orders";

// Query key factories for better organization
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
  special: (tag, limit) => [...productKeys.all, "special", { tag, limit }],
};

export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
};

// Hook for special products
export const useSpecialProducts = (tag, limit) => {
  return useQuery({
    queryKey: productKeys.special(tag, limit),
    queryFn: () => getSpecialProducts(tag, limit),
    select: (data) => {
      // Transform the data to match expected structure
      // If API returns { products: [...] }, use data.products
      // If API returns [...] directly, use data
      return {
        products: Array.isArray(data) ? data : data?.products || [],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: Boolean(tag), // Only run query if tag is provided
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors, but retry on network errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useProducts = ({
  page = 1,
  pageSize = 10, // Changed from 'limit' to match controller
  categorySlug,
  categoryId,
  minPrice,
  maxPrice,
  q, // Changed from 'query' to match controller
  tag,
  tagId,
  discount,
}) => {
  // Clean and normalize parameters
  const normalizedParams = {
    page: Math.max(1, page),
    pageSize: Math.max(1, Math.min(100, pageSize)),
    categorySlug: categorySlug || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    q: q?.trim() || undefined,
    tag: tag?.trim() || undefined,
    tagId: tagId ? Number(tagId) : undefined,
    discount: discount === true || discount === "true" ? true : undefined,
  };

  return useQuery({
    queryKey: productKeys.list(normalizedParams),
    queryFn: () => getProducts(normalizedParams),
    select: (data) => {
      // Minimal processing since controller handles most logic
      const products = data?.products || [];

      return {
        products,
        totalCount: data.totalCount || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.currentPage || 1,
        // Add useful metadata
        hasDiscountFilter: normalizedParams.discount === true,
        discountedProductsCount: products.filter((p) => p.discount).length,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: "online",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    throwOnError: false,
  });
};

export const adminKeys = {
  all: ["admin"],
  products: () => [...adminKeys.all, "products"],
  productsList: (page, limit) => [
    ...adminKeys.products(),
    "list",
    { page, limit },
  ],
  product: (id) => [...adminKeys.products(), "detail", id],
};

export const useAdminProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: adminKeys.productsList(page, limit),
    queryFn: () => getProductsByAdmin(page, limit),
    select: (data) => ({
      products: data?.products || [],
      totalPages: data?.totalPages || 1,
      currentPage: page,
      total: data?.total || 0,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes - admin data should be fresher
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useAdminProduct = (productId) => {
  return useQuery({
    queryKey: adminKeys.product(productId),
    queryFn: () => getProductByIdSlug(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) {
        return failureCount < 1;
      }
      return failureCount < 2;
    },
  });
};

// Hook for categories with better error handling and caching
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: fetchCategories,
    select: (data) => {
      // Transform the data to match expected structure
      return {
        categories: Array.isArray(data) ? data : data?.categories || [],
      };
    },
    staleTime: Infinity, // Categories rarely change
    gcTime: Infinity, // Keep in cache indefinitely
    retry: (failureCount, error) => {
      // Categories are critical, so retry more aggressively
      if (error?.status >= 400 && error?.status < 500) {
        return failureCount < 1; // Only retry once for 4xx errors
      }
      return failureCount < 3; // Retry 3 times for other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // Refetch categories when window regains focus (they might have changed)
    refetchOnWindowFocus: true,
    // Categories should be available offline if cached
    networkMode: "offlineFirst",
  });
};

export const tagKeys = {
  all: ["tags"],
  lists: () => [...tagKeys.all, "list"],
};

export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const response = await getTags();
      return response.tags || response; // Handle different response formats
    },
    select: (data) => {
      // Ensure we always return an array and sort for better UX
      const tags = Array.isArray(data) ? data : [];
      return tags.sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) {
        return failureCount < 1; // Only retry once for 4xx errors
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // Tags should be available offline if cached
    networkMode: "offlineFirst",
    // Don't refetch on window focus unless data is stale
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const shippingKeys = {
  all: ["shipping"],
  cities: () => [...shippingKeys.all, "cities"],
  price: (city) => [...shippingKeys.all, "price", city],
};

// ─── 🚚 Shipping Queries ────────────────────────

// Cities list
export const useCities = () => {
  return useQuery({
    queryKey: shippingKeys.cities(),
    queryFn: getAllCities,
    select: (data) => {
      // Ensure normalized shape

      return Array.isArray(data) ? data : data?.cities || [];
    },
    staleTime: Infinity, // Cities won't change often
    gcTime: Infinity,
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    networkMode: "offlineFirst",
    refetchOnWindowFocus: false,
  });
};

// Shipping price for a city
export const useShippingPrice = (city) => {
  return useQuery({
    queryKey: shippingKeys.price(city),
    queryFn: () => getShippingPriceByCity(city),
    enabled: Boolean(city), // only fetch when city is chosen
    select: (data) => {
      // Normalize response
      return data?.shippingPrice ?? 0;
    },
    staleTime: 10 * 60 * 1000, // cache 10 min
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
