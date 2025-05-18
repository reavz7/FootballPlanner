import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import ButtonSecondary from "./ButtonSecondary";
import ButtonPrimary from "./ButtonPrimary";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to determine if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-violet-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 h-30 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-black">
                FootballPlanner
              </span>
              <span className="text-xs text-gray-400 ml-1 hidden sm:block">
                zagrajmy, razem.
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-10">
            <Link
              to="/"
              className={`text-base font-medium ${
                isActive("/")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Strona główna
            </Link>
            <Link
              to="/create-match"
              className={`text-base font-medium ${
                isActive("/create-match")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Stwórz mecz
            </Link>
            <Link
              to="/match-history"
              className={`text-base font-medium ${
                isActive("/match-history")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Historia meczy
            </Link>
            <Link
              to="/search-match"
              className={`text-base font-medium ${
                isActive("/search-match")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-800 hover:text-gray-900"
              }`}
            >
              Wyszukaj mecz
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 gap-2">
            <Link
              to="/profile"
              className="ml-4 whitespace-nowrap text-gray-500 hover:text-gray-900"
            >
              <div className="flex justify-center items-center gap-1.5">
                <p className="text-gray-800">Profil</p>
                <User size={20} className="text-gray-800" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "text-black bg-gray-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Strona główna
          </Link>
          <Link
            to="/create-match"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/create-match")
                ? "text-black bg-gray-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Stwórz mecz
          </Link>
          <Link
            to="/match-history"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/match-history")
                ? "text-black bg-gray-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Historia meczy
          </Link>
          <Link
            to="/search-match"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/search-match")
                ? "text-black bg-gray-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Wyszukaj mecz
          </Link>
          
          <Link
            to="/profile"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/profile")
                ? "text-black bg-gray-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Profil
          </Link>

        </div>
      </div>
    </header>
  );
}
