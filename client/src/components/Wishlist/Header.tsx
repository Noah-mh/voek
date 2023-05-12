import "./css/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <div className="mb-5">
      <div>
        <h1 className="heading text-3xl font-bold text-center mt-10">
          Your Wishlist{" "}
          <FontAwesomeIcon
            icon={faHeartCircleCheck}
            size="lg"
            style={{ color: "#F74F7D" }}
            className="ml-2 mt-1 hover:cursor-pointer"
          />
        </h1>
      </div>
    </div>
  );
};

export default Header;
