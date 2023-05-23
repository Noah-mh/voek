import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./css/Slider.css";

import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";

interface SliderProps {
  header: string;
  products: Array<Product>;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  image: string;
}

const Slider: React.FC<SliderProps> = ({ header, products }) => {
  const [width, setWidth] = useState<number>(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    console.log("products: ", products);
  }, [products]);

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
        {products.map((product: Product, index: number) => {
          return (
            <Link
              to={`/productDetailsWithReviews/${product.product_id}`}
              key={index}
            >
              <motion.div
                className="item p-5 px-4 pt-7 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.9 }}
              >
                <AdvancedImage
                  cldImg={cld.image(product.image)}
                  alt="products"
                  draggable={false}
                  className="rounded-xl object-cover homepageSliderImg"
                />
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Slider;
