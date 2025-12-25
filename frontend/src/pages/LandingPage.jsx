import React from "react";
import Hero from "../components/Hero"
import Footer from "../components/Footer";
import LandHeader from "../components/LandHeader";
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <LandHeader />
      <Hero/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
