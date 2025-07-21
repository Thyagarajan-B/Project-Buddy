import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const showMinimalNavbarRoutes = ["/explore-projects", "/my-project", "/apply", "/create-projects", "/applied", "/profile"];
  const hideNavbarRoutes = ["/login", "/register"];

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide navbar if on login or register pages or if loading
  if (loading || hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const isMinimal = showMinimalNavbarRoutes.some((route) => location.pathname.startsWith(route));

  const handleExploreClick = () => {
    setIsMobileMenuOpen(false);
    if (!user) {
      navigate("/register");
    } else {
      navigate("/explore-projects");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-100 text-indigo-800 shadow-md px-6 py-5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link className="text-2xl font-bold tracking-tight cursor-pointer" to="/">Project Buddy</Link>

        {/* Hamburger for small screens */}
        <div className="lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden lg:flex items-center gap-8 font-medium ${isMinimal ? "justify-between" : ""}`}>
          {!isMinimal && (
            <>
              <ScrollLink to="home" smooth={true} offset={-80} duration={500} className="cursor-pointer hover:underline">
                Home
              </ScrollLink>
              <ScrollLink to="about" smooth={true} offset={-80} duration={500} className="cursor-pointer hover:underline">
                About
              </ScrollLink>
              <ScrollLink to="features" smooth={true} offset={-80} duration={500} className="cursor-pointer hover:underline">
                Features
              </ScrollLink>
              <button onClick={handleExploreClick} className="hover:underline cursor-pointer">
                Explore Projects
              </button>
              <ScrollLink to="contact" smooth={true} offset={-80} duration={500} className="cursor-pointer hover:underline">
                Contact
              </ScrollLink>
            </>
          )}

          {/* Desktop Auth Section */}
          {!user ? (
            <div className="hidden lg:flex gap-4">
              <Link to="/register" className="hover:underline">Register</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </div>
          ) : (
            <div className="hidden lg:block relative group cursor-pointer">
              <button className="flex items-center gap-1 cursor-pointer font-bold text-[1.4rem]">
                {user?.name}
                <svg className="w-4 h-4 text-black mt-[2px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-200 min-w-[160px] z-10">
                <Link to="/my-project" className="block px-4 py-2 hover:bg-gray-100">My Projects</Link>
                <Link to="/applied" className="block px-4 py-2 hover:bg-gray-100">Applied</Link>
                <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">Notifications</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-4 text-base font-medium">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Home</Link>
          <ScrollLink to="about" smooth={true} offset={-80} duration={500} onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer hover:underline">
            About
          </ScrollLink>
          <ScrollLink to="features" smooth={true} offset={-80} duration={500} onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer hover:underline">
            Features
          </ScrollLink>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Contact</Link>
          <button onClick={handleExploreClick} className="hover:underline text-left">Explore Projects</button>

          {!user ? (
            <>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Register</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Login</Link>
            </>
          ) : (
            <>
              <Link to="/my-project" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">My Projects</Link>
              <Link to="/applied" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Applied</Link>
              <Link to="/notifications" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Notifications</Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:underline">Profile</Link>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left hover:underline">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
