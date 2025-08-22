import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";

async function getDynamicRoutes() {
  const baseUrl = "https://morph-ecommerce.onrender.com";
  let page = 1;
  let products = [];
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await fetch(
        `${baseUrl}/api/products?page=${page}&pageSize=50`
      );
      if (!res.ok) {
        break;
      }
      const data = await res.json();

      products = [...products, ...(data.products || [])];
      totalPages = data.totalPages || 1;
      page++;
    }

    const productRoutes = products.map((p) => `/products/${p.slug}`);

    const categoriesRes = await fetch(`${baseUrl}/api/products/categories`);
    let categories = [];
    if (categoriesRes.ok) {
      const cats = await categoriesRes.json();
      if (Array.isArray(cats.categories)) {
        categories = cats.categories.map(
          (c) => `/shop?category=${encodeURIComponent(c.slug)}`
        );
      }
    }

    return [...productRoutes, ...categories];
  } catch (err) {
    return [];
  }
}

export default defineConfig(async () => {
  const dynamicRoutes = await getDynamicRoutes();

  const allRoutes = ["/shop", ...dynamicRoutes];

  return {
    plugins: [
      react(),
      tailwindcss(),
      Sitemap({
        hostname: "https://www.morpheg.store",
        dynamicRoutes: allRoutes,
        priority: {
          "/": 1.0, // homepage
          "/shop": 0.9, // shop page
          "products/*": 0.8, // all products
          "category/*": 0.7, // all categories
          "*": 0.6, // default for any other route
        },
      }),
    ],
    server: {
      host: true,
    },
    base: "/",
  };
});
