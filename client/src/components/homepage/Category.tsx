import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";
import { images, clothes } from "./images";
import "./css/Category.css";

const Category: React.FC = () => {
  const clothesImg = clothes;
  const shoesImg = images[1];
  const watchcesImg = images[0];
  const techImg = images[5];
  const bagsImg = images[2];

  return (
    <motion.div
      className="category"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ type: "spring", duration: 2 }}
    >
      <motion.div
        className="categoriesHeader m-3 ml-3 text-3xl font-semibold hover:cursor-pointer"
        whileHover={{ scale: 1.05, x: 8 }}
        whileTap={{ scale: 0.9, x: 0 }}
      >
        Categories &#10093;
      </motion.div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="20px">
          {/* col 1 */}
          <motion.div
            className="relative hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src={clothesImg} alt="Clothes" className="h-full" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
              Clothes
            </div>
          </motion.div>

          {/* col 2 */}
          <div className="flex flex-col grow gap-y-5 relative">
            <img src={shoesImg} alt="Shoes" className="sixty h-full" />
            <div className="absolute top-0 left-0 right-0 bottom-72 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
              Shoes
            </div>
            <img src={techImg} alt="Tech" className="forty" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
              Tech
            </div>
          </div>

          {/* col 3 */}
          <div className="flex flex-col grow gap-y-5 relative">
            <img src={watchcesImg} alt="Watches" className="forty" />
            <div className="absolute top-0 left-0 right-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold watchesText categoryText">
              Watches
            </div>
            <img src={bagsImg} alt="Bags" className="sixty" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
              Bags
            </div>
          </div>
        </Masonry>
      </ResponsiveMasonry>
    </motion.div>
  );
};

export default Category;
