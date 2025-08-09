import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 pt-10 pb-18 bg-theme-clr">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-white">
        <div>
          <h3 className="font-semibold font-playfair  text-5xl mb-2 uppercase">
            Morph
          </h3>
          <p className="text-lg font-playfair">Less effort, More impression</p>
        </div>
        <div>
          <h3 className="font-semibold   text-lg mb-2">Quick Links</h3>
          <ul className="text-sm font-semibold space-y-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="#">Shop</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold  text-lg mb-2">Follow Us</h3>
          <ul className="text-sm font-semibold space-y-1">
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">TikTok</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
