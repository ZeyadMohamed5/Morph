import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Aside from "../components/Aside";
import ProductCard from "../components/shared/ProductCard";
import RenderList from "../components/shared/RenderList";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Helmet } from "react-helmet-async";
import { useCategories, useProducts } from "../hooks/useProducts";
import Spinner from "../components/shared/Spinner";

const HEADER_HEIGHT = 100;
const LIMIT = 9;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialized = useRef(false);

  // Initialize state from URL params
  const [categorySlug, setCategorySlug] = useState(
    () => searchParams.get("category") || null
  );
  const [search, setSearch] = useState(() => searchParams.get("q") || "");

  const [page, setPage] = useState(
    () => parseInt(searchParams.get("page")) || 1
  );
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("minPrice") || null
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("maxPrice") || null
  );

  // Fetch products with current filters
  const { data, isLoading, error, isPreviousData } = useProducts({
    page,
    pageSize: LIMIT,
    categorySlug,
    minPrice,
    maxPrice,
    q: search, // Changed from 'search' to 'q' to match useProducts hook
  });

  // Fetch categories
  const { data: categoriesData } = useCategories();

  // Memoize derived values
  const products = useMemo(() => data?.products || [], [data?.products]);
  const totalPages = useMemo(() => data?.totalPages || 1, [data?.totalPages]);

  const categoryName = useMemo(() => {
    if (!categorySlug || !categoriesData?.categories) return null;
    return (
      categoriesData.categories.find((cat) => cat.slug === categorySlug)
        ?.name || null
    );
  }, [categorySlug, categoriesData?.categories]);

  // SEO meta data
  const { pageTitle, pageDescription, canonicalUrl } = useMemo(() => {
    const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL;
    let title = "Morph - Shop";
    let description = "Browse all available products on Morph.";
    let canonical = `https://${DOMAIN_URL}/shop`;

    if (categoryName) {
      title = `Morph - ${categoryName}`;
      description = `Browse our selection of ${categoryName} products.`;
      canonical = `https://${DOMAIN_URL}/shop?category=${categorySlug}`;
    } else if (search) {
      title = `Search results for "${search}" - Morph`;
      description = `Search results for "${search}" on Morph.`;
      canonical = `https://${DOMAIN_URL}/shop?q=${encodeURIComponent(search)}`;
    }

    return {
      pageTitle: title,
      pageDescription: description,
      canonicalUrl: canonical,
    };
  }, [categoryName, search, categorySlug]);

  // Sync state with URL params when they change externally (like from SearchBox navigation)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("q") || "";
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");

    // Only update state if URL params are different from current state
    if (urlCategory !== categorySlug) {
      setCategorySlug(urlCategory);
    }
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
    if (urlPage !== page) {
      setPage(urlPage);
    }
    if (urlMinPrice !== minPrice) {
      setMinPrice(urlMinPrice);
    }
    if (urlMaxPrice !== maxPrice) {
      setMaxPrice(urlMaxPrice);
    }

    isInitialized.current = true;
  }, [searchParams]);

  // Update URL params when state changes (but not during initialization)
  useEffect(() => {
    if (!isInitialized.current) return;

    const newSearchParams = new URLSearchParams();

    if (categorySlug) newSearchParams.set("category", categorySlug);
    if (search) newSearchParams.set("q", search);
    if (page > 1) newSearchParams.set("page", page.toString());
    if (minPrice) newSearchParams.set("minPrice", minPrice);
    if (maxPrice) newSearchParams.set("maxPrice", maxPrice);

    // Only update URL if params actually changed
    const currentParamsString = searchParams.toString();
    const newParamsString = newSearchParams.toString();

    if (currentParamsString !== newParamsString) {
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [categorySlug, search, page, minPrice, maxPrice]);

  // Event handlers
  const handleCategorySelect = useCallback((slug) => {
    setCategorySlug(slug);
    setSearch("");
    setPage(1);
    // Don't reset price filters when selecting category
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: HEADER_HEIGHT, behavior: "smooth" });
  }, []);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  }, [page, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  }, [page, totalPages, handlePageChange]);

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  // Main heading text
  const headingText = useMemo(() => {
    if (search) return `Search results for "${search}"`;
    if (categoryName) return categoryName;
    return "All Products";
  }, [search, categoryName]);

  // Clear all filters handler
  const handleClearAllFilters = useCallback(() => {
    setCategorySlug(null);
    setSearch("");
    setMinPrice(null);
    setMaxPrice(null);
    setPage(1);
  }, []);

  if (error) {
    return (
      <section className="wrapper">
        <div style={{ height: HEADER_HEIGHT }} />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Error Loading Products
            </h2>
            <p className="text-gray-600">
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Prevent indexing of search results and filtered pages */}
        {(search || minPrice || maxPrice || page > 1) && (
          <meta name="robots" content="noindex,follow" />
        )}
      </Helmet>

      <section className="wrapper">
        <div style={{ height: HEADER_HEIGHT }} />
        <div className="grid grid-cols-12 gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase col-span-12 font-playfair py-4 text-theme-clr">
            {headingText}
          </h1>

          <div className="col-span-12 md:col-span-2">
            <Aside
              onCategorySelect={handleCategorySelect}
              selectedCategorySlug={categorySlug}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          <div className="md:col-span-10 col-span-12 min-h-[90vh] flex flex-col pb-6">
            {/* Loading state with previous data */}
            {isLoading && !isPreviousData && <Spinner />}

            {/* No products found */}
            {!isLoading && products.length === 0 && (
              <div className="flex-grow flex justify-center items-center text-xl text-gray-500 ">
                <div className="text-center">
                  <p className="mb-4">No products found.</p>
                  {(search || categorySlug || minPrice || maxPrice) && (
                    <button
                      onClick={handleClearAllFilters}
                      className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products grid */}
            {products.length > 0 && (
              <>
                <div
                  className={`grid grid-cols-12 gap-x-2 gap-y-6 ${
                    isPreviousData ? "opacity-50" : ""
                  }`}
                >
                  <RenderList
                    ItemComponent={(props) => (
                      <ProductCard
                        {...props}
                        className="col-span-6 md:col-span-6 lg:col-span-3"
                      />
                    )}
                    data={products}
                    limit={products.length}
                    loading={isLoading && !isPreviousData}
                  />
                </div>

                <div className="flex-grow" />

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav
                    className="flex justify-center items-center mt-auto py-5"
                    aria-label="Product pagination"
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="px-3 py-2 rounded text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Previous page"
                    >
                      <LuChevronLeft />
                    </button>

                    {/* First page */}
                    {pageNumbers[0] > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          1
                        </button>
                        {pageNumbers[0] > 2 && (
                          <span className="px-2 py-2 text-gray-400">...</span>
                        )}
                      </>
                    )}

                    {/* Page numbers */}
                    {pageNumbers.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-semibold transition-colors ${
                          pageNum === page
                            ? "border border-gray-700 text-gray-700 bg-gray-50"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                        aria-current={pageNum === page ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Last page */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] <
                          totalPages - 1 && (
                          <span className="px-2 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 text-sm font-semibold hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Next page"
                    >
                      <LuChevronRight />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
