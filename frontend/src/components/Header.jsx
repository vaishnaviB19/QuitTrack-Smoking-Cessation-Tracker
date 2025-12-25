import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../assets/logo.svg"; // adjust path according to your project

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove user token
    navigate("/login"); // redirect to login page
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-6 bg-green-50/80 backdrop-blur-md shadow-sm">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img src={Logo} alt="QuitTrack Logo" className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold">
          <span className="text-green-500">Quit</span>
          <span className="text-amber-400">Track</span>
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/logs")}
          className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          + Log
        </button>
        <FaUserCircle
          className="text-4xl text-green-700 cursor-pointer"
          onClick={() => navigate("/profile")}
        />
         <button
        onClick={handleLogout}
        className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500 transition"
      >
        Logout
      </button>
      </div>
    </header>
  );
};

export default Header;
