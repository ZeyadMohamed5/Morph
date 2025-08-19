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

  const DOMAIN_URL = import.meta.env.DOMAIN_URL;

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
        const data = await getProductBySlug(slug);

        setProduct(data);
        setSelectedImage(data?.imageUrl);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        variantId: selectedVariantId,
        size: selectedSizeId,
        quantity,
      },
    });
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 2000);
  };

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading)
    return (
      <>
        <Helmet>
          <title>Morph - Loading product...</title>
          <meta name="description" content="Loading product details" />
        </Helmet>
        <Spinner />
      </>
    );

  if (error)
    return (
      <>
        <Helmet>
          <title>Morph - Product not found</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <NotFound />
      </>
    );

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Morph`}</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`${DOMAIN_URL}/products/${slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`${DOMAIN_URL}/products/${slug}`} />
        <meta property="og:image" content={product.imageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.imageUrl} />
      </Helmet>

      <div className="relative" style={{ height: HEADER_HEIGHT }} />
      <div className="grid grid-cols-12 gap-6 p-4 md:p-8">
        {notification && (
          <div className="fixed left-0 right-0 top-10 mx-auto w-max bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 capitalize">
            {product.name} Added to cart!
          </div>
        )}

        <div className="col-span-12 md:col-span-6">
          <img src={selectedImage} alt={product.name} className="w-full" />

          {product.images &&
            product.images.some((img) => img.url && img.url.trim() !== "") && (
              <div className="flex gap-4 mt-6 overflow-x-auto">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={`Product Image ${img.id}`}
                    className={`w-24 h-24 cursor-pointer border-1 rounded p-1 ${
                      selectedImage === img.url
                        ? "border-theme-clr/50"
                        : "border-theme-clr/25"
                    }`}
                    onClick={() => setSelectedImage(img.url)}
                  />
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

          {/* {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-theme-clr/15 text-gray-600 text-sm px-3 py-1 rounded-full font-medium shadow-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )} */}

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
                      className={`px-4 py-2 border rounded font-lato text-sm cursor-pointer ${
                        selectedSizeId === size.size
                          ? "bg-theme-clr text-white"
                          : "bg-white text-gray-700"
                      } ${
                        size.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {size.size}
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
                  className="text-2xl font-semibold font-playfair cursor-pointer"
                >
                  −
                </button>
                <span className="text-xl px-6">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="text-2xl font-playfair font-semibold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariantId || !selectedSizeId}
              className={`w-full sm:w-auto px-6 sm:px-13 py-4 md:self-end uppercase flex items-center justify-center gap-2 text-base sm:text-sm 
    ${
      !selectedVariantId || !selectedSizeId
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-theme-clr cursor-pointer"
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
