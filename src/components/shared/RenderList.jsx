import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../../Api/products";

const RenderList = ({
  data = [],
  ItemComponent,
  limit = 4,
  categoryFilter,
}) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setLoading(true);

      try {
        if (categoryFilter) {
          const result = await getProducts({
            categorySlug: categoryFilter,
            limit,
          });

          if (isMounted) {
            setFetchedData(result.products || []);
          }
        } else {
          // Only process static data if it exists
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
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        if (isMounted) setFetchedData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Only fetch if we have categoryFilter OR if data has items
    if (categoryFilter || (data && data.length > 0)) {
      fetchProducts();
    } else {
      setLoading(false);
      setFetchedData([]);
    }

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, limit]);

  // Update fetchedData when data changes (for non-categoryFilter cases)
  useEffect(() => {
    if (!categoryFilter && data && data.length > 0) {
      setFetchedData(data.slice(0, limit));
    }
  }, [data, limit, categoryFilter]);

  const renderItems = loading
    ? Array.from({ length: limit }).map((_, index) => (
        <ItemComponent key={`loading-${index}`} loading={true} />
      ))
    : fetchedData.map((product) => (
        <ItemComponent key={product.id} product={product} />
      ));

  return <>{renderItems}</>;
};

export default RenderList;
