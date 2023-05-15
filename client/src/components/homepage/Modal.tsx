import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import Loader from "./Loader";
import "./css/Modal.css";

import axios from "../../api/axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCartPlus,
  faHeartCircleXmark,
  faHeartCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  handleClose: () => void;
  productImg: string | undefined;
  viewProduct: () => Promise<object[]>;
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

const Modal: React.FC<Props> = ({ handleClose, productImg, viewProduct }) => {
  const [heart, setHeart] = useState(false);
  const [variation1, setVariation1] = useState("");
  const [data, setData] = useState<any>([]);
  const [customerId, setCustomerId] = useState<number | undefined>(1);

  const variationOne = [
    { color: "Deep Purple" },
    { color: "Gold" },
    { color: "Silver" },
  ];

  useEffect(() => {
    const responseArr: Promise<any> = viewProduct().then((data) => {
      return data;
    });
    responseArr.then((data: any) => {
      setData(data.response);
    });
  }, []);

  useEffect(() => {
    const checkWishlistProductExistence = async () => {
      console.log("testing100");
      console.log(data[0].product_id);
      try {
        console.log("testing300");
        const response = await axios.post(
          `/checkWishlistProductExistence`,
          JSON.stringify({ customerId, productId: data[0].product_id }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("testing200");
        console.log(response.data);
        if (response.data.length > 0) {
          setHeart(true);
        } else {
          setHeart(false);
        }
      } catch (err: any) {
        setHeart(false);
      }
    };
    checkWishlistProductExistence();
  }, [data, heart]);

  const insertToWishlist = async () => {
    try {
      const response = await axios.post(
        `/insertWishlistedProduct`,
        JSON.stringify({ customerId, productId: data[0].product_id }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setHeart(true);
    } catch (err: any) {
      setHeart(false);
    }
  };

  const deleteFromWishlist = async () => {
    console.log("test");
    try {
      const response = await axios.delete(`/deleteWishlistedProduct`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        data: JSON.stringify({ customerId, productId: data[0].product_id }),
      });
      console.log(response.data);
      setHeart(false);
    } catch (err: any) {
      setHeart(true);
    }
  };

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

        {data.length > 0 ? (
          <div className="flex">
            <div className="imgContainer flex justify-center">
              <img
                src={productImg}
                alt="productImage"
                className="w-96 h-96 p-5 pt-0"
              />
            </div>
            <div className="pl-7">
              <h1 className="font-extrabold text-3xl">{data[0].name}</h1>
              <h1 className="">{data[0].rating} stars | Ratings</h1>
              <h1 className="modalPrice mt-8 text-2xl font-bold">
                ${data[0].price}
              </h1>
              <h1 className="modalDescription">{data[0].description}</h1>

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
                      onClick={() => {
                        deleteFromWishlist();
                      }}
                    />
                  )}
                  {!heart && (
                    <FontAwesomeIcon
                      icon={faHeartCircleXmark}
                      size="2xl"
                      style={{ color: "#e05b52" }}
                      className="ml-2 mt-1 hover:cursor-pointer"
                      onClick={() => {
                        insertToWishlist();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-20">
            <Loader />
          </div>
        )}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
