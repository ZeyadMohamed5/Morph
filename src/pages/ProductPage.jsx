import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../Api/products";
import Spinner from "../components/shared/Spinner";
import useCart from "../hooks/useCart";
import { IoCart } from "react-icons/io5";
import NotFound from "./NotFound";
import { Helmet } from "react-helmet-async";

const HEADER_HEIGHT = 100;

const ProductPage = () => {
  const { slug } = useParams();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  const [notification, setNotification] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductBySlug(slug);

        if (!data) {
          setError("Product not found");
          return;
        }

        setProduct(data);
        setSelectedImage(data?.imageUrl);

        // Reset selections when product changes
        setSelectedVariantId(null);
        setSelectedSizeId(null);

        // ✅ Fire Meta Pixel ViewContent event
        if (window.fbq) {
          window.fbq("track", "ViewContent", {
            content_ids: [data.id],
            content_name: data.name,
            value: data.discount?.discountedPrice || data.price,
            currency: "EGP",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariantId || !selectedSizeId) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        variantId: selectedVariantId,
        size: selectedSizeId,
        quantity,
      },
    });

    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        value: (product.discount?.discountedPrice || product.price) * quantity,
        currency: "EGP",
        quantity,
        variant: selectedVariantId,
        size: selectedSizeId,
      });
    }
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 2000);
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... - Morph</title>
          <meta name="description" content="Loading product details" />
          <meta name="robots" content="noindex" />
        </Helmet>
        <Spinner />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found - Morph</title>
          <meta
            name="description"
            content="The requested product could not be found"
          />
          <meta name="robots" content="noindex" />
        </Helmet>
        <NotFound />
      </>
    );
  }

  // Generate structured data for the product
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    url: `${DOMAIN_URL}/products/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Morph",
    },
    offers: {
      "@type": "Offer",
      price: product.discount?.discountedPrice || product.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: `${DOMAIN_URL}/products/${slug}`,
    },
  };

  const currentPrice = product.discount?.discountedPrice || product.price;

  const originalPrice = product.discount
    ? product.price
    : product.previousPrice;

  return (
    <>
      <Helmet>
        <title>{`Morph - ${product.name}`}</title>
        <meta
          name="description"
          content={
            product.description ||
            `Shop ${product.name} at Morph - luxury women's fashion`
          }
        />
        <link rel="canonical" href={`${DOMAIN_URL}/products/${slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} - Morph`} />
        <meta
          property="og:description"
          content={product.description || `Shop ${product.name} at Morph`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`${DOMAIN_URL}/products/${slug}`} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:site_name" content="Morph" />

        {/* Product specific Open Graph */}
        <meta property="product:price:amount" content={currentPrice} />
        <meta property="product:price:currency" content="EGP" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Morph`} />
        <meta
          name="twitter:description"
          content={product.description || `Shop ${product.name} at Morph`}
        />
        <meta name="twitter:image" content={product.imageUrl} />

        {/* Additional SEO */}
        <meta
          name="keywords"
          content={`${product.name}, fashion, women's clothing, Morph, ${slug}`}
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      </Helmet>

      <div className="relative" style={{ height: HEADER_HEIGHT }} />
      <div className="grid grid-cols-12 gap-6 p-4 md:p-8">
        {notification && (
          <div className="fixed left-0 right-0 top-10 mx-auto w-max bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 capitalize">
            {product.name} Added to cart!
          </div>
        )}

        <div className="col-span-12 md:col-span-6">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full"
            onError={(e) => {
              e.target.src = "/assets/-1011.jpg"; // Add a fallback image
            }}
          />

          {(product.imageUrl ||
            (product.images && product.images.length > 0)) && (
            <div className="flex gap-4 mt-6 overflow-x-auto">
              {/* Main image first */}
              {product.imageUrl && (
                <div
                  key="main-image"
                  className={`w-24 h-24 border overflow-hidden cursor-pointer flex-shrink-0 ${
                    selectedImage === product.imageUrl
                      ? "border-theme-clr/70"
                      : "border-theme-clr/30"
                  }`}
                  onClick={() => setSelectedImage(product.imageUrl)}
                >
                  <img
                    src={product.imageUrl}
                    alt={`${product.name} main`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Other images */}
              {product.images &&
                product.images
                  .filter((img) => img.url && img.url.trim() !== "")
                  .map((img) => (
                    <div
                      key={img.id}
                      className={`w-24 h-24 border overflow-hidden cursor-pointer flex-shrink-0 ${
                        selectedImage === img.url
                          ? "border-theme-clr/70"
                          : "border-theme-clr/30"
                      }`}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <img
                        src={img.url}
                        alt={`Product Image ${img.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-6 md:px-10">
          <h1 className="text-5xl md:text-7xl font-playfair uppercase mb-4 text-theme-clr">
            {product.name}
          </h1>

          {/* Price and discount display */}
          {product.discount ? (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-sm font-lato text-gray-400 line-through">
                EGP {product.price}
              </span>
              <span className="text-2xl font-lato font-semibold text-red-600">
                EGP {product.discount.discountedPrice}
              </span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold uppercase">
                {product.discount.percentage}% OFF
              </span>
            </div>
          ) : product.previousPrice ? (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-sm font-lato text-red-400 line-through">
                EGP {product.previousPrice}
              </span>
              <span className="text-xl font-lato font-semibold text-gray-900">
                EGP {product.price}
              </span>
            </div>
          ) : (
            <span className="text-lg font-lato text-gray-800">
              EGP {product.price}
            </span>
          )}

          <p className="text-gray-400 mb-2 font-lato pt-4">
            {product.description}
          </p>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-lato text-gray-500 mb-2">Select Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setSelectedSizeId(null);
                      setSelectedImage(variant.imageUrl || product.imageUrl);
                    }}
                    className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                      selectedVariantId === variant.id
                        ? "border-theme-clr"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    aria-label={`Select ${variant.color} color`}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedVariantId && (
            <div className="mt-4">
              <h3 className="font-lato text-gray-500 mb-2">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants
                  .find((v) => v.id === selectedVariantId)
                  ?.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() =>
                        size.stock > 0 && setSelectedSizeId(size.size)
                      }
                      disabled={size.stock === 0}
                      className={`px-4 py-2 border rounded font-lato text-sm cursor-pointer transition-colors ${
                        selectedSizeId === size.size
                          ? "bg-theme-clr text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } ${
                        size.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {size.size}
                      {size.stock === 0 && " (Out of Stock)"}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center mt-6">
            <div className="flex flex-col">
              <span className="text-lg font-lato text-gray-400 mb-1">
                Quantity
              </span>
              <div className="border px-4 py-3 flex items-center justify-between w-full sm:w-auto">
                <button
                  onClick={decreaseQty}
                  className="text-2xl font-semibold font-playfair cursor-pointer hover:text-theme-clr transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-xl px-6">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="text-2xl font-playfair font-semibold cursor-pointer hover:text-theme-clr transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId || !selectedSizeId}
              className={`w-full sm:w-auto px-6 sm:px-13 py-4 md:self-end uppercase flex items-center justify-center gap-2 text-base sm:text-sm transition-all duration-200
    ${
      !selectedVariantId || !selectedSizeId
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-theme-clr cursor-pointer hover:bg-opacity-90"
    } text-white`}
            >
              Add to Cart
              <IoCart className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
