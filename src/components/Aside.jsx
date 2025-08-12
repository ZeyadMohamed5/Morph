import { useEffect, useState, useRef } from "react";
import { getCategories } from "../Api/category";
import { useNavigate } from "react-router-dom";

const Aside = ({
  onCategorySelect,
  selectedCategorySlug,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  setCategoryName,
}) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Slider UI range constants
  const SLIDER_UI_MIN = 0;
  const SLIDER_UI_MAX = 1000;
  const PRICE_MIN = 0;
  const PRICE_MAX = 50000;

  const [localMin, setLocalMin] = useState(SLIDER_UI_MIN);
  const [localMax, setLocalMax] = useState(SLIDER_UI_MAX);

  const tempMin = useRef(localMin);
  const tempMax = useRef(localMax);

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      if (data) setCategories(data.categories);
    }
    fetchCategories();
  }, []);

  const mapSliderToPrice = (val) =>
    Math.round(
      PRICE_MIN +
        ((val - SLIDER_UI_MIN) * (PRICE_MAX - PRICE_MIN)) /
          (SLIDER_UI_MAX - SLIDER_UI_MIN)
    );

  const mapPriceToSlider = (price) =>
    Math.round(
      SLIDER_UI_MIN +
        ((price - PRICE_MIN) * (SLIDER_UI_MAX - SLIDER_UI_MIN)) /
          (PRICE_MAX - PRICE_MIN)
    );

  const updateParentPrices = () => {
    const min = mapSliderToPrice(tempMin.current);
    const max = mapSliderToPrice(tempMax.current);
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Sync local slider from props (searchParams -> Shop -> Aside)
  useEffect(() => {
    if (minPrice !== null && minPrice !== undefined) {
      const sliderVal = mapPriceToSlider(minPrice);
      setLocalMin(sliderVal);
      tempMin.current = sliderVal;
    }
  }, [minPrice]);

  useEffect(() => {
    if (maxPrice !== null && maxPrice !== undefined) {
      const sliderVal = mapPriceToSlider(maxPrice);
      setLocalMax(sliderVal);
      tempMax.current = sliderVal;
    }
  }, [maxPrice]);

  return (
    <aside className="col-span-2 ">
      {/* Categories */}
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => {
              onCategorySelect(null);
              setCategoryName(null);
              setMinPrice(null);
              setMaxPrice(null);
            }}
            className={`w-full text-left px-2 py-1 rounded ${
              selectedCategorySlug === null
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>
        </li>

        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => {
                // Navigate with completely fresh URL - no search params
                navigate(`/shop?category=${cat.slug}`, { replace: true });
                onCategorySelect(cat.slug);
                setMinPrice(null);
                setMaxPrice(null);
              }}
              className={`w-full text-left px-2 py-1 rounded ${
                selectedCategorySlug === cat.slug
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Price Range */}
      <div className="mt-8">
        <h3 className="mb-3 font-semibold text-lg">Price Range</h3>
        <div className="relative h-8">
          <div className="absolute top-3 left-0 right-0 h-2 bg-gray-300 rounded-full" />
          <div
            className="absolute top-3 h-2 bg-gray-700 rounded-full"
            style={{
              left: `${
                ((localMin - SLIDER_UI_MIN) / (SLIDER_UI_MAX - SLIDER_UI_MIN)) *
                100
              }%`,
              width: `${
                ((localMax - localMin) / (SLIDER_UI_MAX - SLIDER_UI_MIN)) * 100
              }%`,
            }}
          />

          <input
            type="range"
            min={SLIDER_UI_MIN}
            max={SLIDER_UI_MAX}
            value={localMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), localMax - 1);
              setLocalMin(val);
              tempMin.current = val;
            }}
            onMouseUp={updateParentPrices}
            onTouchEnd={updateParentPrices}
            className="absolute top-0 w-full h-8 bg-transparent pointer-events-auto appearance-none"
            style={{ zIndex: 10 }}
          />

          <input
            type="range"
            min={SLIDER_UI_MIN}
            max={SLIDER_UI_MAX}
            value={localMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), localMin + 1);
              setLocalMax(val);
              tempMax.current = val;
            }}
            onMouseUp={updateParentPrices}
            onTouchEnd={updateParentPrices}
            className="absolute top-0 w-full h-8 bg-transparent pointer-events-auto appearance-none"
            style={{ zIndex: 20 }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
          <span>${mapSliderToPrice(localMin)}</span>
          <span>${mapSliderToPrice(localMax)}</span>
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              onCategorySelect(null);
              setCategoryName(null);
              setMinPrice(null);
              setMaxPrice(null);
              setPage(1);
            }}
            className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
