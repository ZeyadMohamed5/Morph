import { useLocation, Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import SearchBox from "../../components/shared/SearchBox";
import { IoMenu, IoClose } from "react-icons/io5";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = totalItems > 99 ? "99+" : totalItems;

  return (
    <header
      className={`absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-transparent z-50 ${
        isHome ? "text-white" : "text-black"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-4xl font-playfair uppercase ">
          <Link to="/">Morph</Link>
        </h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6 font-lato text-xl">
        <Link className="relative group" to="/">
          Home
          <span
            className={`absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full ${
              isHome ? "bg-white" : "bg-black"
            }`}
          ></span>
        </Link>

        <Link className="relative group" to="/shop">
          Shop
          <span
            className={`absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full ${
              isHome ? "bg-white" : "bg-black"
            }`}
          ></span>
        </Link>
      </nav>

      {/* Right Side: Search + Cart */}
      <div className="hidden md:flex items-center gap-4 font-lato text-xl font-extralight">
        <SearchBox />
        <Link to="/cart" className="relative">
          <LuShoppingCart size={28} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 font-lato text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
              {displayCount}
            </span>
          )}
        </Link>
      </div>

      {/* Hamburger Icon */}
      <button
        className="md:hidden text-3xl z-[60]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`
    absolute top-full left-0 w-full bg-white
    ${isHome ? "text-black" : "text-black"}
    flex flex-col items-start p-6 space-y-4 shadow-md z-50 md:hidden
    transform transition-all duration-300 ease-in-out
    ${
      menuOpen
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }
  `}
      >
        <SearchBox />
        <Link
          className="font-bold font-lato"
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          className="font-bold font-lato"
          to="/shop"
          onClick={() => setMenuOpen(false)}
        >
          Shop
        </Link>
        <Link
          to="/cart"
          onClick={() => setMenuOpen(false)}
          className="relative"
        >
          <LuShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
              {displayCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
