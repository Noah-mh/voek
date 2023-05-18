import WishlistCard from "./WishlistCard";
import Header from "./Header";
import "./css/Wishlist.css";

const Wishlist = () => {
  return (
    <div className="wishlist flex flex-col justify-center items-center">
      <Header />
      <div>
        <WishlistCard />
      </div>
    </div>
  );
};

export default Wishlist;
