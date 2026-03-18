import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./NotFound.css";
import NotFoundContent from "../components/NotFoundContent";

const NotFound: React.FC = () => {
  return (
    <div>
      <div className="p5-background-canvas"></div>
      <div className="overlay-content">
        <NavBar />
        <NotFoundContent />
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;