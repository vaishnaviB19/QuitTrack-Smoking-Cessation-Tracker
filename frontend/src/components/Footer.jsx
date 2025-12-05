import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full -mt-12 py-16 relative z-10 rounded-t-3xl shadow-sm bg-gradient-to-t from-gray-50 via-white to-white text-gray-700 py-10">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col gap-6">
        
        {/* Top Row: Logo, Links, Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          
          {/* Left: Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-2 md:w-1/3">
            <h3 className="text-2xl font-bold text-gray-900">QuitTrack</h3>
            <p className="text-gray-600 text-center md:text-left">
              Helping you <span className="text-green-600 font-semibold">quit smoking</span> step by step.
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex gap-6 flex-wrap justify-center md:w-1/3 text-gray-600">
            <a href="/about" className="hover:text-green-600 transition-colors duration-300">About</a>
            <a href="/privacy" className="hover:text-green-600 transition-colors duration-300">Privacy Policy</a>
            <a href="/contact" className="hover:text-green-600 transition-colors duration-300">Contact</a>
            <a href="/terms" className="hover:text-green-600 transition-colors duration-300">Terms</a>
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-4 justify-center md:justify-end md:w-1/3 text-gray-600">
            <a href="#" className="hover:text-green-600 transition-colors duration-300 hover:scale-110"><FaTwitter size={22} /></a>
            <a href="#" className="hover:text-green-600 transition-colors duration-300 hover:scale-110"><FaFacebookF size={22} /></a>
            <a href="#" className="hover:text-green-600 transition-colors duration-300 hover:scale-110"><FaInstagram size={22} /></a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} QuitTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
