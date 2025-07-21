import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-indigo-800 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold mb-4">Project Buddy</h3>
          <p className="text-gray-600">
            Because building alone is boring. Connect, collaborate, and create something amazing together.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-700 cursor-pointer">
            <li><ScrollLink to="home" className="hover:underline" smooth={true} offset={-80} duration={500}>Home</ScrollLink></li>
            <li><ScrollLink to="about" className="hover:underline" smooth={true} offset={-80} duration={500}>About</ScrollLink></li>
            <li><ScrollLink to="features" className="hover:underline" smooth={true} offset={-80} duration={500}>Features</ScrollLink></li>
            <li><ScrollLink to="contact" className="hover:underline" smooth={true} offset={-80} duration={500}>Contact</ScrollLink></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Connect with Us</h4>
          <div className="flex justify-center md:justify-start gap-4 text-indigo-600 text-xl">
            <a href="mailto:projectbuddy@example.com" className="hover:text-indigo-800">
              <FaEnvelope />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
        &copy; {new Date().getFullYear()} Project Buddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
