import "./css/Homepage.css";
import { useState } from "react";
import Slider from "./Slider";
import { Banner } from "./Banner";
import Category from "./Category";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";

const Homepage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [productImg, setProductImg] = useState<string | undefined>();
  const modalOpenFn = () => {
    setModalOpen(true);
  };

  const modalCloseFn = () => {
    setModalOpen(false);
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
        />
        <div className="w-4/5 h-1 bg-gray-400 mx-auto rounded-md"></div>
        <Slider
          header={"For You"}
          modalOpen={modalOpen}
          modalOpenFn={modalOpenFn}
          modalCloseFn={modalCloseFn}
          setProductImg={setProductImg}
        />
      </div>
      <AnimatePresence initial={false} onExitComplete={() => null}>
        {modalOpen && (
          <Modal handleClose={modalCloseFn} productImg={productImg} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
