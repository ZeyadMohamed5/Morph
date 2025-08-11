import RenderList from "../components/shared/RenderList";
import ProductCard from "../components/shared/ProductCard";
import { useMemo } from "react";
import { IoIosArrowRoundForward, IoIosRocket } from "react-icons/io";
import { FaPhoneAlt, FaThumbsUp } from "react-icons/fa";
import { BsFillCreditCardFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import CategoryGrid from "../components/CategoryGrid";
import SpecialItem from "../components/shared/SpecialItem";
import { Helmet } from "react-helmet";
import { useCategories, useSpecialProducts } from "../hooks/useProducts";

const Home = () => {
  const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL || window.location.origin;

  // Define all featured sections including new arrivals
  const featuredSections = useMemo(
    () => [
      // {
      //   type: "tag", // Special type for tag-based sections
      //   slug: "new",
      //   tag: "new",
      //   heading: "New Arrivals",
      //   limit: 4,
      //   linkPath: "/shop?tag=new",
      //   linkLabel: "View all new arrivals",
      // },
      {
        type: "category", // Category-based sections
        slug: "new-arrivals",
        heading: "The best dress for the best woman",
        limit: 4,
        linkPath: "/shop?category=new-arrivals",
        linkLabel: "View all new arrivals products",
      },
      {
        type: "category", // Category-based sections
        slug: "women",
        heading: "The best dress for the best woman",
        limit: 4,
        linkPath: "/shop?category=women",
        linkLabel: "View all women's products",
      },
      {
        type: "category",
        slug: "summer-vibes",
        heading: "Bring the heat with Summer Vibes",
        limit: 4,
        linkPath: "/shop?category=summer-vibes",
        linkLabel: "View all summer vibes products",
      },
    ],
    []
  );

  // Fetch data using custom hooks
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    data: specialProductsData,
    isLoading: specialLoading,
    error: specialError,
  } = useSpecialProducts("special", 2);

  // Extract data with fallbacks
  const categories = useMemo(
    () => categoriesData?.categories || [],
    [categoriesData]
  );

  const specialProducts = useMemo(
    () => specialProductsData?.products || [],
    [specialProductsData]
  );

  // Filter valid featured sections - category sections need to exist in categories
  const validFeaturedSections = useMemo(
    () =>
      featuredSections.filter((section) => {
        if (section.type === "tag") {
          // Tag-based sections are always valid (like new arrivals)
          return true;
        }
        if (section.type === "category") {
          // Category sections need to exist in the categories list
          return categories.some((cat) => cat.slug === section.slug);
        }
        return false;
      }),
    [featuredSections, categories]
  );

  // Error handling
  if (categoriesError || specialError) {
    console.error("Home page errors:", {
      categoriesError,
      specialError,
    });
  }

  const FeaturedSection = ({ section }) => {
    const sectionId = `${section.slug}-section`;
    const headingId = `${section.slug}-heading`;

    return (
      <section key={sectionId} className="wrapper" aria-labelledby={headingId}>
        <h2
          id={headingId}
          className="font-playfair text-theme-clr uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-5"
        >
          {section.heading}
        </h2>

        <div className="grid grid-cols-12 gap-2">
          <RenderList
            ItemComponent={ProductCard}
            limit={section.limit}
            categoryFilter={
              section.type === "category" ? section.slug : undefined
            }
            tagFilter={section.type === "tag" ? section.tag : undefined}
            loading={categoriesLoading}
          />
        </div>

        <Link
          to={section.linkPath}
          className="font-lato uppercase bg-theme-clr text-white py-2 px-3 inline-flex items-center mt-8 shadow-2xl hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-theme-clr focus:ring-offset-2"
          aria-label={section.linkLabel}
        >
          See more
          <IoIosArrowRoundForward size={32} aria-hidden="true" />
        </Link>
      </section>
    );
  };

  return (
    <main>
      <Helmet>
        <title>Morph - Discover the Art of Dressing Up</title>
        <meta
          name="description"
          content="Discover the latest trends in fashion with Morph. Made in Indonesia, dedicated to Indonesia. Shop our new arrivals and featured collections."
        />
        <link rel="canonical" href={DOMAIN_URL} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Morph - Discover the Art of Dressing Up"
        />
        <meta
          property="og:description"
          content="Discover the latest trends in fashion with Morph. Made in Indonesia, dedicated to Indonesia."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={DOMAIN_URL} />
        <meta property="og:image" content={`${DOMAIN_URL}/assets/-1011.jpg`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Morph - Discover the Art of Dressing Up"
        />
        <meta
          name="twitter:description"
          content="Discover the latest trends in fashion with Morph. Made in Indonesia, dedicated to Indonesia."
        />
        <meta name="twitter:image" content={`${DOMAIN_URL}/assets/-1011.jpg`} />

        {/* Additional SEO */}
        <meta
          name="keywords"
          content="fashion, clothing, dress, women, summer, new arrivals, online shopping , handmade"
        />
        <meta name="author" content="Morph" />
      </Helmet>

      {/* Hero Banner */}
      <section
        className="relative w-full min-h-[100dvh] bg-cover bg-center flex flex-col lg:flex-row items-center justify-between gap-8 px-6 pt-35 lg:pt-0"
        style={{ backgroundImage: 'url("./assets/-1011.jpg")' }}
        role="banner"
      >
        {/* Overlay for better text readability */}
        <div className="relative z-10 flex flex-col lg:items-start items-center">
          <p className="text-white text-shadow-md pb-3 font-playfair lg:text-left text-center text-xl sm:text-2xl max-w-2xl leading-tight uppercase">
            made in Indonesia, dedicated to Indonesia
          </p>
          <h1 className="text-white text-shadow-lg pb-6 font-playfair text-4xl text-center md:text-left sm:text-6xl lg:text-7xl max-w-2xl leading-tight uppercase">
            Discover the Art of Dressing Up
          </h1>
          <Link
            to="/shop"
            className="font-playfair uppercase bg-theme-clr text-white py-3 px-5 sm:py-4 sm:px-6 text-lg sm:text-xl lg:text-2xl inline-block text-center shadow-2xl hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-theme-clr focus:ring-offset-2"
            aria-label="Browse all products in our shop"
          >
            Shop Now!!
          </Link>
        </div>

        <div className="relative z-10 lg:w-auto self-center lg:self-end mb-6 lg:mb-4">
          <div className="flex flex-col gap-3">
            {specialLoading ? (
              Array(2)
                .fill(0)
                .map((_, idx) => (
                  <SpecialItem key={`special-skeleton-${idx}`} loading={true} />
                ))
            ) : specialError ? (
              <div className="text-white text-center p-4 bg-red-500 bg-opacity-75 rounded">
                Failed to load featured products
              </div>
            ) : (
              specialProducts.map((product) => (
                <SpecialItem key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">
          Product Categories
        </h2>
        <CategoryGrid categories={categories} loading={categoriesLoading} />
      </section>

      {/* Featured Sections (including New Arrivals) */}
      {validFeaturedSections.map((section) => (
        <FeaturedSection key={section.slug} section={section} />
      ))}

      {/* Global Error Handling for Featured Sections */}
      {(categoriesError || specialError) && (
        <section className="wrapper py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              Some sections failed to load. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-theme-clr text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="wrapper py-15" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Our Features and Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto gap-4 p-4">
          {/* Satisfaction Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-2 border-10 border-gray-200 text-center p-8">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-theme-clr text-white mx-auto mb-4">
              <FaThumbsUp size={24} aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl mb-2 text-gray-700">
              100% Satisfaction Guaranteed
            </h3>
            <p className="font-lato text-gray-500 text-sm text-left max-w-xl mx-auto md:mx-0">
              We stand behind every product we sell. If you're not completely
              satisfied with your purchase, we'll make it right with our
              hassle-free return policy.
            </p>
          </div>

          {/* 24/7 Service Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-1 border-10 border-gray-200 p-4">
            <div className="flex-col justify-center flex items-center gap-4 p-8 md:p-0 md:flex-row md:items-start">
              <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-14 rounded-full bg-theme-clr text-white">
                <FaPhoneAlt size={24} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl md:text-3xl text-gray-700 mb-1">
                  24/7 Online Service
                </h3>
                <p className="font-lato text-gray-500 text-sm text-left max-w-md">
                  Our customer support team is available around the clock to
                  help you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Security Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-2 border-10 border-gray-200 text-center p-8">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-theme-clr text-white mx-auto mb-4">
              <BsFillCreditCardFill size={24} aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl mb-2 text-gray-700">
              Payment With Secure System
            </h3>
            <p className="font-lato text-gray-500 text-sm text-left max-w-xl mx-auto md:mx-0">
              Your payment information is protected with industry-standard
              encryption. Shop with confidence knowing your data is secure.
            </p>
          </div>

          {/* Fast Delivery Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-1 border-10 border-gray-200 p-4">
            <div className="flex-col justify-center flex items-center gap-4 p-8 md:p-0 md:flex-row md:items-start">
              <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-14 rounded-full bg-theme-clr text-white">
                <IoIosRocket size={24} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl md:text-3xl text-gray-700 mb-1">
                  Fast Delivery
                </h3>
                <p className="font-lato text-gray-500 text-sm text-left max-w-md">
                  Get your orders delivered quickly with our reliable shipping
                  partners across Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
