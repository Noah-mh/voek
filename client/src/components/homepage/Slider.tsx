import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { images } from "./images";
import "./css/Slider.css";

interface SliderProps {
  header: string;
  modalOpenFn: () => void;
  modalCloseFn: () => void;
  modalOpen: boolean;
  setProductImg: (img: string) => void;
  setProductId: (id: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  header,
  modalOpenFn,
  modalCloseFn,
  modalOpen,
  setProductImg,
  setProductId,
}) => {
  const [width, setWidth] = useState<number>(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      console.log(carousel.current.scrollWidth, carousel.current.offsetWidth);
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  return (
    <motion.div
      ref={carousel}
      className="carousel overflow-hidden"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", duration: 2 }}
    >
      <motion.h1
        className="ml-12 font-bold text-3xl mt-3 header hover:cursor-pointer tracking-widest"
        whileHover={{ scale: 1.05, x: 8 }}
        whileTap={{ scale: 0.9, x: 0 }}
      >
        {header} &#10093;
      </motion.h1>
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className="inner-carousel flex cursor-grab"
      >
        {images.map((image: string) => {
          return (
            <motion.div
              className="item p-5 px-4 pt-7 cursor-pointer"
              key={image}
            >
              <motion.img
                src={image}
                alt="products"
                draggable={false}
                className="rounded-5xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  console.log("testing", modalOpen);
                  modalOpen ? modalCloseFn() : modalOpenFn();
                  setProductImg(image);
                  setProductId(1);
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Slider;
