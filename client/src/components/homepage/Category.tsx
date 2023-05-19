import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";
import { images, clothes, book, accessories } from "./images";
import "./css/Category.css";

const Clothes: React.FC = () => {
  const clothesImg = clothes;
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={clothesImg} alt="Clothes" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Clothes
      </div>
    </motion.div>
  );
};

const Shoes: React.FC = () => {
  const shoesImg = images[1];
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={shoesImg} alt="Clothes" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Shoes
      </div>
    </motion.div>
  );
};

const Tech: React.FC = () => {
  const techImg = images[5];
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={techImg} alt="Tech" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Tech
      </div>
    </motion.div>
  );
};

const Books: React.FC = () => {
  const booksImg = book;
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={booksImg} alt="Books" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Books
      </div>
    </motion.div>
  );
};

const Watches: React.FC = () => {
  const watchcesImg = images[0];
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={watchcesImg} alt="Watches" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Watches
      </div>
    </motion.div>
  );
};

const Bags: React.FC = () => {
  const bagsImg = images[2];
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img src={bagsImg} alt="Bags" className="h-full rounded-xl" />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Bags
      </div>
    </motion.div>
  );
};

const Accessories: React.FC = () => {
  const accessoriesImg = accessories;
  return (
    <motion.div
      className="relative hover:cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <img
        src={accessoriesImg}
        alt="Accessories"
        className="h-full rounded-xl"
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end justify-end pb-2 pr-5 text-gray-100 text-5xl font-bold categoryText">
        Accessories
      </div>
    </motion.div>
  );
};

const Category: React.FC = () => {
  return (
    <motion.div
      className="category"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ type: "spring", duration: 2 }}
    >
      <motion.div
        className="categoriesHeader m-3 ml-3 text-3xl font-semibold hover:cursor-pointer tracking-widest"
        whileHover={{ scale: 1.05, x: 8 }}
        whileTap={{ scale: 0.9, x: 0 }}
      >
        Categories &#10093;
      </motion.div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="20px">
          {/* col 1 */}
          <div className="flex flex-col grow gap-y-5">
            <Shoes />
            <Tech />
            <Books />
          </div>

          {/* col 2 */}
          <div className="hover:cursor-pointer flex flex-col grow gap-y-5">
            <Clothes />
          </div>

          {/* col 3 */}
          <div className="flex flex-col grow gap-y-5">
            <Watches />
            <Bags />
            <Accessories />
          </div>
        </Masonry>
      </ResponsiveMasonry>
    </motion.div>
  );
};

export default Category;
