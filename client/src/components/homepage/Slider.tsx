import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./css/Slider.css";

import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../../Cloudinary/Cloudinary";
import ProductCard from "../Result/ProductCard";

interface SliderProps {
  header: string;
  products: Array<Product>;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
}

const Slider: React.FC<SliderProps> = ({ header, products }) => {
  const carousel = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragCurrentXRef = useRef<number>(0);
  const speedFactor = 0.018;

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    isDragging.current = true;
    dragStartXRef.current = getCursorPosition(event);
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDragging.current) {
      return;
    }
    const dragCurrentX = getCursorPosition(event);
    const dragOffset = (dragCurrentX - dragStartXRef.current) * speedFactor;
    dragCurrentXRef.current = dragCurrentX;

    const carouselElement = carousel.current;
    if (carouselElement) {
      carouselElement.scrollLeft -= dragOffset;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging.current) {
      return;
    }
    isDragging.current = false;

    const dragDistance = dragCurrentXRef.current - dragStartXRef.current;
    if (Math.abs(dragDistance) < 5) {
      return;
    }

    dragStartXRef.current = 0;
    dragCurrentXRef.current = 0;
  };

  const getCursorPosition = (event: React.MouseEvent | React.TouchEvent) => {
    if ((event as React.TouchEvent).touches) {
      return (event as React.TouchEvent).touches[0].clientX;
    } else {
      return (event as React.MouseEvent).clientX;
    }
  };

  return (
    <div className="sliderContainer">
      <h1 className=" font-bold text-5xl header tracking-wide font-barlow mb-6">
        {header}
      </h1>
      <motion.div
        ref={carousel}
        className="carousel overflow-hidden"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", duration: 2 }}
      >
        <motion.div
          className="inner-carousel flex cursor-grab"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {products.map((product: Product, index: number) => {
            return (
              <Link
                key={index}
                to={`/productDetailsWithReviews/${product.product_id}`}
                className=""
              >
                <motion.div
                  className="item cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slider;
