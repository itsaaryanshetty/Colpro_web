import React, { useState } from "react";
import { Link } from "react-router-dom"; // Ensure React Router is set up
import { Menu } from "lucide-react"; // Icon from lucide-react for mobile menu
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Import your auth service

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  const handleClick = () => {
    if (isLoggedIn) {
      // Logout
      authService.logout();
      navigate("/login");
    } else {
      // Login
      navigate("/login");
    }
  };

  return (
    <nav className="bg-transparent bg-gradient-to-r from-emerald-200 to-emerald-900 p-8  ">
      <div className="flex justify-between items-center">
        <h1 className="text-emerald-900 text-4xl font-extrabold ">Colpro</h1>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link
              to="/"
              className="text-teal-200 hover:text-teal-400 border rounded-full px-2 py-1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/member-dashboard"
              className="text-teal-200 hover:text-teal-400 border rounded-full px-2 py-1"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-teal-200 hover:text-teal-400 border rounded-full px-2 py-1"
            >
              About
            </Link>
          </li>

          {/* <li>
            <Link
              to="/login"
              className="text-teal-200 hover:text-teal-400 border rounded-full px-2 py-1"
            >
              Login/Register
            </Link>
          </li> */}
          <li>
            <button
              onClick={handleClick}
              className="text-teal-200 hover:text-teal-400 bg-emerald-950  rounded-full px-2 py-1"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="mt-4 space-y-2 md:hidden">
          <li>
            <Link to="/" className="block text-white">
              Home
            </Link>
          </li>
          <li>
            <Link to="/member-dashboard" className="block text-white">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/about" className="block text-white">
              About
            </Link>
          </li>
          <li>
            <Link to="/login" className="block text-white">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="block text-white">
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Header;
