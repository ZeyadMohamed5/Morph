import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../../Api/products";

const RenderList = ({
  data = [],
  ItemComponent,
  limit = 4,
  categoryFilter,
  tagFilter,
  loading: externalLoading = false,
}) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine if we need to fetch data from API
  const shouldFetchFromAPI = useMemo(() => {
    return categoryFilter || tagFilter;
  }, [categoryFilter, tagFilter]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setLoading(true);

      try {
        if (shouldFetchFromAPI) {
          // Fetch from API with appropriate filters
          const params = {
            limit,
            ...(categoryFilter && { categorySlug: categoryFilter }),
            ...(tagFilter && { tag: tagFilter }),
          };

          const result = await getProducts(params);

          if (isMounted) {
            setFetchedData(result.products || []);
          }
        } else {
          // Process static data if it exists
          if (data && data.length > 0) {
            // Simulate loading from static data
            await new Promise((r) => setTimeout(r, 300));
            if (isMounted) {
              setFetchedData(data.slice(0, limit));
            }
          } else {
            // No data available
            if (isMounted) {
              setFetchedData([]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        if (isMounted) {
          setFetchedData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Fetch if we need API data OR if we have static data
    if (shouldFetchFromAPI || (data && data.length > 0)) {
      fetchProducts();
    } else {
      setLoading(false);
      setFetchedData([]);
    }

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, tagFilter, limit, shouldFetchFromAPI]);

  // Update fetchedData when static data changes (for non-API cases)
  useEffect(() => {
    if (!shouldFetchFromAPI && data && data.length > 0) {
      setFetchedData(data.slice(0, limit));
      setLoading(false);
    }
  }, [data, limit, shouldFetchFromAPI]);

  // Use external loading state if provided, otherwise use internal loading
  const isLoading = externalLoading || loading;

  const renderItems = isLoading
    ? Array.from({ length: limit }).map((_, index) => (
        <ItemComponent key={`loading-${index}`} loading={true} />
      ))
    : fetchedData.map((product) => (
        <ItemComponent key={product.id} product={product} />
      ));

  return <>{renderItems}</>;
};

export default RenderList;
