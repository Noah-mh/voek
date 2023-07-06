import { useEffect, useState, React } from "react";
import { Link } from "react-router-dom";
import watchImg from "./assets/watch.png";
import bagImg from "./assets/bagBanner.png";
import shoeImg from "./assets/shoeBanner.png";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./css/Banner.css";
import Fireflies from "./Fireflies.tsx";

const bannerImg = [watchImg, bagImg, shoeImg];

const NavBar: React.FC = () => {
  return (
    <div className="navbar flex p-3 px-16">
      <div>
        <h1 className="voekLogo pl-5 text-2xl font-bold cursor-pointer">
          VOEK
        </h1>
      </div>
      <div className="grow"></div>

      <div className="box">
        <form name="search">
          <input
            type="text"
            className="input"
            name="txt"
            onMouseOut={(e) => {
              e.currentTarget.value = "";
              e.currentTarget.blur();
            }}
          />
        </form>
        <FontAwesomeIcon
          icon={faSearch}
          size="xl"
          style={{ color: "#2f4858" }}
          className="magnifyingGlassIcon"
        />
      </div>

      <div className="flex pr-12 navbarLinks">
        <h1 className="px-6 pr-5 text-2xl font-bold cursor-pointer">Cart</h1>
        <h1 className="px-6 pl-5 text-2xl font-bold cursor-pointer">Profile</h1>
      </div>
    </div>
  );
};

const Banner: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImg.length);
    }, 2000); // Change the duration (in milliseconds) between image transitions as desired

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="backgroundImg">
      {/* <NavBar /> */}
      <Fireflies />
      <div className="scroll-down"></div>
      <div className=" flex justify-center items-center header">
        <div className="headerText col-span flex-row justify-center items-center ">
          <h1 className="text-center text-white text-5xl font-Barlow font-bold">
            Welcome to Voek
          </h1>
          <h2 className="text-center text-white text-xl font-Barlow font-semibold">
            All your products, in one place.
          </h2>
          <Link to="/products">
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-20 mx-auto my-5 rounded">
              Check out our products
            </button>
          </Link>
        </div>

        <motion.img
          src={bannerImg[currentImageIndex]}
          className="w-96 h-96 BannerImg col-span-2"
          // initial={{ opacity: 0, y: -100, x: 40 }}
          // animate={{ opacity: 1 }}
          transition={{ type: "spring", duration: 2 }}
        />
      </div>
      <div className="blob"></div>
    </div>
  );
};

export { Banner, NavBar };
