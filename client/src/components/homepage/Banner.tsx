import React from "react";
import watchImg from "./assets/watch.png";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./css/Banner.css";

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
  return (
    <div className="backgroundImg">
      {/* <NavBar /> */}
      <div className="flex justify-center items-center">
        <motion.img
          src={watchImg}
          className="w-96 h-96"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 288 }}
          transition={{ type: "spring", duration: 2 }}
        />
      </div>
    </div>
  );
};

export default Banner;
