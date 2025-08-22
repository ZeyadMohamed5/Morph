import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryGrid = ({ categories, loading }) => {
  const positions = [
    "col-start-1 col-span-6 row-start-1 row-span-1",
    "col-start-1 col-span-6 row-start-2 row-span-1",
    "col-start-7 col-span-6 row-start-1 row-span-2",
  ];

  return (
    <div className="wrapper grid grid-cols-12 grid-rows-2 gap-2 pt-6 h-[100vh]">
      {loading
        ? positions.map((pos, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-md ${pos}`}
            >
              {/* skeleton image */}
              <Skeleton
                height="100%"
                width="100%"
                className="!h-full !w-full"
              />
            </div>
          ))
        : categories.slice(0, 3).map((category, index) => (
            <Link
              to={`/shop?category=${category.slug}`}
              key={category.id}
              className={`categoryCard ${positions[index]} relative overflow-hidden group`}
            >
              <img
                src={
                  category.imageUrl && category.imageUrl.trim().length > 5
                    ? category.imageUrl
                    : "./assets/-55.jpg"
                }
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end justify-start">
                <p className="text-white text-3xl p-6 font-playfair capitalize">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default CategoryGrid;
