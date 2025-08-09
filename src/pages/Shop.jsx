import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Aside from "../components/Aside";
import ProductCard from "../components/shared/ProductCard";
import { getProducts } from "../Api/products";
import { getCategories } from "../Api/category";
import RenderList from "../components/shared/RenderList";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Helmet } from "react-helmet";

const HEADER_HEIGHT = 100;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategorySlug = searchParams.get("category");
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug || null);

  const initialQuery = searchParams.get("q")?.toLowerCase() || "";
  const initialMinPrice = searchParams.get("minPrice");
  const initialMaxPrice = searchParams.get("maxPrice");

  const [categoryName, setCategoryName] = useState(null);

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(
    initialMinPrice ? Number(initialMinPrice) : null
  );
  const [maxPrice, setMaxPrice] = useState(
    initialMaxPrice ? Number(initialMaxPrice) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const DOMAIN_URL = import.meta.env.DOMAIN_URL;
  const limit = 9;

  useEffect(() => {
    const newCategorySlug = searchParams.get("category");
    const newQuery = searchParams.get("q")?.toLowerCase() || "";
    const newMin = searchParams.get("minPrice");
    const newMax = searchParams.get("maxPrice");

    if (newCategorySlug) {
      setQuery("");
      setCategorySlug(newCategorySlug);
      fetchCategoryName(newCategorySlug);
    } else if (newQuery) {
      setCategorySlug(null);
      setCategoryName(null);
      setQuery(newQuery);
    } else {
      setQuery("");
      setCategorySlug(null);
      setCategoryName(null);
    }

    setMinPrice(newMin ? Number(newMin) : null);
    setMaxPrice(newMax ? Number(newMax) : null);
    setPage(1);
  }, [searchParams]);

  const fetchCategoryName = async (slug) => {
    try {
      const data = await getCategories();
      if (data && data.categories) {
        const category = data.categories.find((cat) => cat.slug === slug);
        if (category) {
          setCategoryName(category.name);
        }
      }
    } catch (error) {
      console.error("Error fetching category name:", error);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const data = await getProducts({
          page,
          limit,
          categorySlug,
          minPrice,
          maxPrice,
          searchQuery: query || null,
        });
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [page, minPrice, maxPrice, query, categorySlug]);

  const onCategorySelect = (slug) => {
    setCategorySlug(slug);
    setQuery("");
    setPage(1);
    const newSearchParams = new URLSearchParams();
    if (slug) {
      newSearchParams.set("category", slug);
    }
    setSearchParams(newSearchParams);
  };

  const updatePriceRange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);

    const newSearchParams = new URLSearchParams(searchParams);
    if (min !== null && min !== "") {
      newSearchParams.set("minPrice", min);
    } else {
      newSearchParams.delete("minPrice");
    }
    if (max !== null && max !== "") {
      newSearchParams.set("maxPrice", max);
    } else {
      newSearchParams.delete("maxPrice");
    }
    setSearchParams(newSearchParams);
  };

  // Dynamically build title and description for SEO
  let pageTitle = "Shop - Morph";
  let pageDescription = "Browse all available products on Morph.";

  if (categoryName) {
    pageTitle = `${categoryName} - Morph`;
    pageDescription = `Browse our selection of ${categoryName} products.`;
  } else if (query) {
    pageTitle = `Search results for "${query}" - Morph`;
    pageDescription = `Search results for "${query}" on Morph.`;
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${DOMAIN_URL}/shop`} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN_URL}/shop`} />
        {/* Add image if you have a relevant image */}
        {/* <meta property="og:image" content={`${DOMAIN_URL}/path-to-image.jpg`} /> */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {/* <meta name="twitter:image" content={`${DOMAIN_URL}/path-to-image.jpg`} /> */}
      </Helmet>

      <section className="wrapper">
        <div style={{ height: HEADER_HEIGHT }} />
        <div className="grid grid-cols-12 gap-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase col-span-12 font-playfair py-4">
            {query
              ? `Search results for "${query}"`
              : categoryName
              ? categoryName
              : "All Products"}
          </h2>

          <div className="col-span-12 md:col-span-2">
            <Aside
              onCategorySelect={onCategorySelect}
              selectedCategorySlug={categorySlug}
              minPrice={minPrice}
              maxPrice={maxPrice}
              updatePriceRange={updatePriceRange}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setCategoryName={setCategoryName}
            />
          </div>

          <div className="md:col-span-10 col-span-12 min-h-[90vh] flex flex-col">
            {products.length === 0 && !isLoading ? (
              <div className="flex-grow flex justify-center items-center text-xl text-gray-500">
                No products found.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-x-2 gap-y-6">
                  <RenderList
                    data={products}
                    ItemComponent={ProductCard}
                    limit={products.length}
                    loading={isLoading}
                  />
                </div>

                <div className="flex-grow" />

                <div className="flex justify-center items-center mt-auto py-5">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-2 py-0.5 rounded text-gray-700 disabled:border-gray-700"
                  >
                    <LuChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-2 py-0.5 text-sm font-semibold ${
                          pageNum === page
                            ? "border border-gray-700 text-gray-700"
                            : "hover:border-gray-200 text-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-2 py-0.5 text-gray-700 disabled:text-gray-400"
                  >
                    <LuChevronRight />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
