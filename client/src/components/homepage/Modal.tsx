import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import "./css/Modal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCartPlus,
  faHeart,
  faHeartCircleXmark,
  faHeartCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  handleClose: () => void;
  productImg: string | undefined;
}

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    type: "spring",
    damping: 25,
    stiffness: 500,
  },
  exit: {
    opacity: 0,
  },
};

interface Variation {
  color: string;
}

const Modal: React.FC<Props> = ({ handleClose, productImg }) => {
  const [heart, setHeart] = useState(false);
  const [variation1, setVariation1] = useState("");

  useEffect(() => {
    console.log("heart status: ", heart);
  }, [heart]);

  const variationOne = [
    { color: "Deep Purple" },
    { color: "Gold" },
    { color: "Silver" },
  ];

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className="modal modalBackground"
        variants={dropIn}
      >
        <div className="closeButtonContainer">
          <div className="grow"></div>
          <motion.button onClick={handleClose} className="close-button">
            <FontAwesomeIcon
              icon={faXmark}
              size="2xl"
              style={{ color: "#6a0500" }}
            />
          </motion.button>
        </div>

        <div className="flex">
          <div className="imgContainer flex justify-center">
            <img
              src={productImg}
              alt="productImage"
              className="w-96 h-96 p-5 pt-0"
            />
          </div>
          <div className="pl-7">
            <h1 className="font-extrabold text-3xl">Name of Product</h1>
            <h1 className="">4.9 stars | 1.7k Ratings</h1>
            <h1 className="price mt-8 text-2xl font-bold">$1,615.00</h1>
            <h1 className="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum! Provident
              similique accusantium nemo autem. Veritatis obcaecati tenetur iure
              eius earum ut molestias architecto voluptate aliquam nihil,
              eveniet aliquid culpa officia aut!
            </h1>

            <div className="variation1 mt-5 flex items-center">
              {/* <h1>Color: &emsp;</h1> */}
              {variationOne.map((variation: Variation) => {
                const variationStyle = `${
                  variation1 === variation.color
                    ? "variationSelected"
                    : "variation"
                } p-1 mx-1 w-24 h-8 hover:cursor-pointer flex justify-center items-center`;

                return (
                  <div
                    className={variationStyle}
                    onClick={() => setVariation1(variation.color)}
                  >
                    <h1 className="text-sm">{variation.color}</h1>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 flex">
              <motion.button
                className="cartButton flex p-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon
                  icon={faCartPlus}
                  size="xl"
                  style={{ color: "#6a0500" }}
                />
                <h1 className="pl-3">Add To Cart</h1>
              </motion.button>

              <motion.button
                className="buyButton flex p-2 ml-2 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <h1 className="text-gray-100 font-bold">Buy Now</h1>
              </motion.button>

              <div>
                {heart && (
                  <FontAwesomeIcon
                    icon={faHeartCircleCheck}
                    size="2xl"
                    style={{ color: "#F74F7D" }}
                    className="ml-2 mt-1 hover:cursor-pointer"
                    onClick={() => setHeart(!heart)}
                  />
                )}
                {!heart && (
                  <FontAwesomeIcon
                    icon={faHeartCircleXmark}
                    size="2xl"
                    style={{ color: "#e05b52" }}
                    className="ml-2 mt-1 hover:cursor-pointer"
                    onClick={() => setHeart(!heart)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
