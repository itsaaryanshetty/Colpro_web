import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Ensure React Router is set up
import { Menu, X } from "lucide-react"; // Icon from lucide-react
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Import your auth service

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClick = () => {
    if (isLoggedIn) {
      authService.logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/member-dashboard" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Colpro
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                        ? "text-emerald-400"
                        : "text-slate-400 hover:text-emerald-300"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={handleClick}
              className="px-6 py-2 rounded-full bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition-colors focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-2xl">
              <ul className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${location.pathname === link.path
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleClick();
                    }}
                    className="w-full text-center px-5 py-3 rounded-xl bg-emerald-600 text-white text-base font-bold hover:bg-emerald-500 transition-all shadow-lg"
                  >
                    {isLoggedIn ? "Logout" : "Login"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
