import React from "react";
import WishlistCard from "./WishlistCard";
import Header from "./Header";

const Wishlist = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <WishlistCard />
    </div>
  );
};

export default Wishlist;
