import RenderList from "../components/shared/RenderList";
import ProductCard from "../components/shared/ProductCard";
import { useEffect, useState } from "react";
import { getProducts, getSpecialProducts } from "../Api/products";
import { IoIosArrowRoundForward, IoIosRocket } from "react-icons/io";
import { FaPhoneAlt, FaThumbsUp } from "react-icons/fa";
import { BsFillCreditCardFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getCategories } from "../Api/category";
import CategoryGrid from "../components/CategoryGrid";
import SpecialItem from "../components/shared/SpecialItem";
import { Helmet } from "react-helmet";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const DOMAIN_URL = import.meta.env.DOMAIN_URL;

  const featuredSections = [
    {
      slug: "women",
      heading: "The best dress for the best woman",
    },
    {
      slug: "summer-vibes",
      heading: "Bring the heat with Summer Vibes",
    },
  ];

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      try {
        const [specialData, newArrivalsData, categoriesData] =
          await Promise.all([
            getSpecialProducts("special", 2),
            getSpecialProducts("new", 4),
            getCategories(),
          ]);

        if (specialData) setSpecialProducts(specialData);
        if (newArrivalsData) setNewProducts(newArrivalsData);
        if (categoriesData) setCategories(categoriesData.categories);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <main>
      <Helmet>
        <title>Morph</title>
        <meta
          name="description"
          content="Discover the latest trends in fashion with Morph."
        />
        <link rel="canonical" href={`${DOMAIN_URL}`} />

        {/* Open Graph */}
        <meta property="og:title" content="Morph" />
        <meta
          property="og:description"
          content="Discover the latest trends in fashion with Morph."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={DOMAIN_URL} />
        {/* You can add an image URL here if you have a logo or hero image */}
        {/* <meta property="og:image" content={`${DOMAIN_URL}/path-to-image.jpg`} /> */}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Morph" />
        <meta
          name="twitter:description"
          content="Discover the latest trends in fashion with Morph."
        />
        {/* <meta name="twitter:image" content={`${DOMAIN_URL}/path-to-image.jpg`} /> */}
      </Helmet>

      {/* Hero Banner */}
      <section
        className="relative w-full min-h-[100dvh] bg-cover bg-center flex flex-col lg:flex-row items-center justify-between gap-8 px-6 pt-35 lg:pt-0"
        style={{ backgroundImage: 'url("./assets/-1011.jpg")' }}
      >
        <div className="flex flex-col lg:items-start items-center">
          <p className="text-white text-shadow-md pb-3 font-playfair lg:text-left text-center text-xl sm:text-2xl max-w-2xl leading-tight uppercase">
            made in Indonesia, dedicated to Indonesia
          </p>
          <p className="text-white text-shadow-lg pb-6 font-playfair text-4xl text-center md:text-left sm:text-6xl lg:text-7xl max-w-2xl leading-tight uppercase">
            Discover the Art of Dressing Up
          </p>
          <Link
            to="/shop"
            className="font-playfair uppercase bg-theme-clr text-white py-3 px-5 sm:py-4 sm:px-6 text-lg sm:text-xl lg:text-2xl inline-block text-center shadow-2xl hover:scale-105 duration-300"
          >
            Shop Now!!
          </Link>
        </div>

        <div className="lg:w-auto self-center lg:self-end mb-6 lg:mb-4">
          <div className="flex flex-col gap-3">
            {loading
              ? Array(2)
                  .fill(0)
                  .map((_, idx) => <SpecialItem key={idx} loading={true} />)
              : specialProducts.map((product) => (
                  <SpecialItem key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <CategoryGrid categories={categories} />

      {/* NEW ARRIVALS */}
      <section className="wrapper">
        <h3 className="font-playfair text-theme-clr  uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-5">
          New Arrivals
        </h3>
        <div className="grid grid-cols-12 gap-2">
          <RenderList
            data={newProducts}
            ItemComponent={ProductCard}
            limit={4}
          />
        </div>
        <Link
          to="/shop"
          className="font-lato uppercase bg-theme-clr text-white py-2 px-3 inline-flex items-center mt-8 shadow-2xl hover:scale-105 duration-300"
        >
          See more
          <IoIosArrowRoundForward size={32} />
        </Link>
      </section>

      {/* Featured  Section */}

      {featuredSections.map(({ slug, heading }) => {
        const category = categories.find((cat) => cat.slug === slug);
        if (!category) return null;

        return (
          <section key={category.id} className="wrapper">
            <h3 className="font-playfair uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-5">
              {heading}
            </h3>

            <div className="grid grid-cols-12 gap-2">
              <RenderList
                ItemComponent={ProductCard}
                limit={4}
                categoryFilter={slug}
              />
            </div>

            <Link
              to={`/shop?category=${slug}`}
              className="font-lato uppercase bg-theme-clr text-white py-2 px-3 inline-flex items-center mt-8 shadow-2xl hover:scale-105 duration-300"
            >
              See more
              <IoIosArrowRoundForward size={32} />
            </Link>
          </section>
        );
      })}

      {/* Features Section */}
      <section className="wrapper py-15">
        <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto gap-4 p-4">
          {/* Satisfaction Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-2 border-10 border-gray-200 text-center p-8">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-theme-clr text-white mx-auto mb-4">
              <FaThumbsUp size={24} />
            </div>
            <h4 className="font-playfair text-3xl md:text-4xl mb-2 text-gray-700">
              100% Satisfaction Guaranteed
            </h4>
            <p className="font-lato text-gray-500 text-sm text-left max-w-xl mx-auto md:mx-0">
              Lorem ipsum dolor sit amet consectetur. Suspendisse laoreet
              scelerisque morbi vulputate. Quisque bibendum eget id diam
              elementum fringilla duis.
            </p>
          </div>

          {/* 24/7 Service Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-1 border-10 border-gray-200 p-4">
            <div className="flex-col justify-center flex items-center gap-4 p-8 md:p-0 md:flex-row md:items-start">
              <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-14 rounded-full bg-theme-clr text-white">
                <FaPhoneAlt size={24} />
              </div>
              <div>
                <h4 className="font-playfair text-2xl md:text-3xl text-gray-700 mb-1">
                  24/7 Online Service
                </h4>
                <p className="font-lato text-gray-500 text-sm text-left max-w-md">
                  Lorem ipsum dolor sit amet consectetur. Suspendisse laoreet
                </p>
              </div>
            </div>
          </div>

          {/* Payment Security Card */}
          <div className=" col-span-12 row-span-2 md:col-span-4 md:row-span-2 border-10 border-gray-200 text-center p-8">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-theme-clr text-white mx-auto mb-4">
              <BsFillCreditCardFill size={24} />
            </div>
            <h4 className="font-playfair text-3xl md:text-4xl mb-2 text-gray-700">
              Payment With Secure System
            </h4>
            <p className="font-lato text-gray-500 text-sm text-left max-w-xl mx-auto md:mx-0">
              Lorem ipsum dolor sit amet consectetur. Suspendisse laoreet
              scelerisque morbi vulputate. Quisque bibendum eget id diam
              elementum fringilla duis.
            </p>
          </div>

          {/* Fast Delivery Card */}
          <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-1 border-10 border-gray-200 p-4">
            <div className="flex-col justify-center flex items-center gap-4 p-8 md:p-0 md:flex-row md:items-start">
              <div className="flex justify-center items-center w-16 h-16 md:w-20 md:h-14 rounded-full bg-theme-clr text-white">
                <IoIosRocket size={24} />
              </div>
              <div>
                <h4 className="font-playfair text-2xl md:text-3xl text-gray-700 mb-1">
                  Fast Delivery
                </h4>
                <p className="font-lato text-gray-500 text-sm text-left max-w-md">
                  Lorem ipsum dolor sit amet consectetur. Suspendisse laoreet
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
