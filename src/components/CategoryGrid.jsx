import { Link } from "react-router-dom";

const CategoryGrid = ({ categories }) => {
  const positions = [
    "col-start-1 col-span-6 row-start-1 row-span-1",
    "col-start-1 col-span-6 row-start-2 row-span-1",
    "col-start-7 col-span-6 row-start-1 row-span-2",
  ];
  return (
    <section className="wrapper grid grid-cols-12 grid-rows-2 gap-2 py-10 max-h-[100vh]">
      {categories.slice(0, 3).map((category, index) => (
        <Link
          to={`/shop?category=${category.slug}`}
          key={category.id}
          className={`categoryCard ${positions[index]} relative overflow-hidden group`}
        >
          <img
            src={
              category.imageUrl && category.imageUrl.trim().length > 5
                ? category.imageUrl
                : "./assets/-55.png"
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
    </section>
  );
};

export default CategoryGrid;
