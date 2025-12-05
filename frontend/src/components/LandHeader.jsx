import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const LandHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 w-full bg-green-50/80 backdrop-blur-md shadow-sm py-2 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + App Name */}
        <div className="flex items-center gap-3">
          <img src={Logo} alt="QuitTrack Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-3xl font-bold">
             <span className="text-green-500">Quit</span>
             <span className="text-amber-400">Track</span>
          </h1>
        </div>

        {/* Right: Buttons */}
        <nav aria-label="Primary navigation">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md text-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-amber-500
              bg-amber-400 hover:bg-amber-500 hover:shadow-md">
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-md bg-green-500 text-white text-sm shadow-sm hover:bg-green-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-500">
              Sign up
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LandHeader;
