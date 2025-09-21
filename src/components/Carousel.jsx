import { useRef } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

const Carousel = ({ children }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth, scrollLeft } = scrollRef.current;
    const scrollAmount = clientWidth * 0.9; // slide almost full view
    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full ">
      {/* Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
      >
        <IoChevronBackSharp className="w-6 h-6 text-gray-700" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100"
      >
        <IoChevronForwardSharp className="w-6 h-6 text-gray-700" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory "
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;
