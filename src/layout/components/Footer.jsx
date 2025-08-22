import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 pt-10 pb-6 bg-theme-clr">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 text-center md:text-left text-white">
        {/* Logo & tagline */}
        <div className="col-span-12 md:col-span-3">
          <h3 className="font-semibold font-playfair text-5xl mb-2 uppercase">
            Morph
          </h3>
          <p className="text-lg font-playfair">Less effort, More impression</p>
        </div>

        {/* Quick links */}
        <div className="col-span-4 md:col-span-3">
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="text-sm font-semibold space-y-1">
            <li>
              <Link className="relative group" to="/">
                Home
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </Link>
            </li>
            <li>
              <Link className="relative group" to="/shop">
                Shop
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </Link>
            </li>
            <li>
              <a className="relative group" href="#">
                Contact
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </a>
            </li>
          </ul>
        </div>

        {/* Social links */}
        <div className="col-span-4 md:col-span-3">
          <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
          <ul className="text-sm font-semibold space-y-1">
            <li>
              <a
                className="relative group"
                href="https://www.instagram.com/morphclothing.eg?igsh=MWtlZHY4Mm0weHQ0bw=="
              >
                Instagram
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </a>
            </li>
            <li>
              <a
                className="relative group"
                href="https://www.facebook.com/share/1C8PGFoDfW/?mibextid=wwXIfr"
              >
                Facebook
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </a>
            </li>
            <li>
              <a
                className="relative group"
                href="https://www.tiktok.com/@morphothing.eg?_t=ZS-8yojqBkNWsq&_r=1"
              >
                TikTok
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </a>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="col-span-4 md:col-span-3">
          <h3 className="font-semibold text-lg mb-2">Policies</h3>
          <ul className="text-sm font-semibold space-y-1">
            <li>
              <Link className="relative group" to="/terms">
                Terms & Conditions
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </Link>
            </li>
            <li>
              <Link className="relative group" to="/privacy">
                Privacy Policy
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </Link>
            </li>
            <li>
              <Link className="relative group" to="/returns">
                Return Policy
                <span className="absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-500 group-hover:w-full bg-white"></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-200 pt-4 text-center">
        <p className="text-gray-300 text-sm">
          © 2025 - All rights reserved. Morph
        </p>
      </div>
    </footer>
  );
};

export default Footer;
