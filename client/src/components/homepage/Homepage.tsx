import "./css/Homepage.css";
import { useState } from "react";
import Slider from "./Slider.js";
import { Banner } from "./Banner.js";
import Category from "./Category";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";

import axios from "../../api/axios";

const Homepage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [productImg, setProductImg] = useState<string | undefined>();
  const [productId, setProductId] = useState<number | undefined>();
  const modalOpenFn = () => {
    setModalOpen(true);
  };

  const modalCloseFn = () => {
    setModalOpen(false);
  };

  const viewProduct = async () => {
    const response = await axios.post(
      `/productDetails`,
      JSON.stringify({ productId }),
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data;
  };

  return (
    <div className="Homepage">
      <Banner />
      <Category />
      <div className="sliders">
        <Slider
          header={"Top Picks"}
          modalOpen={modalOpen}
          modalOpenFn={modalOpenFn}
          modalCloseFn={modalCloseFn}
          setProductImg={setProductImg}
          setProductId={setProductId}
        />
        <div className="w-4/5 h-1 bg-gray-400 mx-auto rounded-md"></div>
        <Slider
          header={"For You"}
          modalOpen={modalOpen}
          modalOpenFn={modalOpenFn}
          modalCloseFn={modalCloseFn}
          setProductImg={setProductImg}
          setProductId={setProductId}
        />
      </div>
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {modalOpen && (
          <Modal
            handleClose={modalCloseFn}
            productImg={productImg}
            viewProduct={viewProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
