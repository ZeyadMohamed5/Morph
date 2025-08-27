import { useLocation, Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { useContext, useState } from "react";
import CartContext from "../../context/CartContext";
import SearchBox from "../../components/shared/SearchBox";
import { IoMenu } from "react-icons/io5";

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = totalItems > 99 ? "99+" : totalItems;

  return (
    <header
      className={`absolute top-0 left-0 w-full px-6 py-4 bg-transparent z-50 ${
        isHome ? "text-white" : "text-black"
      }`}
    >
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-4xl font-playfair uppercase text-shadow-lg">
          <Link to="/">Morph</Link>
        </h1>

        {/* Desktop Nav */}
        <nav className="flex items-center space-x-6 font-lato text-xl">
          <Link className="relative group text-shadow-lg" to="/">
            Home
            <span
              className={`absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full ${
                isHome ? "bg-white" : "bg-black"
              }`}
            ></span>
          </Link>

          <Link className="relative group text-shadow-lg" to="/shop">
            Shop
            <span
              className={`absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full ${
                isHome ? "bg-white" : "bg-black"
              }`}
            ></span>
          </Link>
        </nav>

        {/* Search + Cart */}
        <div className="flex items-center gap-4 font-lato text-xl font-extralight">
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
      </div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden relative">
        {/* Left: Hamburger */}
        <button
          className="text-3xl z-[60]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "" : <IoMenu />}
        </button>

        {/* Center: Logo */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-playfair uppercase text-shadow-lg">
          <Link to="/">Morph</Link>
        </h1>

        {/* Right: Cart */}
        <Link to="/cart" className="relative ">
          <LuShoppingCart size={28} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
              {displayCount}
            </span>
          )}
        </Link>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out
        ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full w-3/4 bg-white
          text-black flex flex-col items-start p-6  space-y-6 shadow-lg z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
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
      </div>
    </header>
  );
};

export default Header;
