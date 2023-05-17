import { Link } from "react-router-dom";
import "./css/DropDownProfile.css";
const DropDownProfile = () => {
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-4 dropDownProfile">
        <li className=" hover:cursor-pointer hover:text-softerPurple">
          <Link to="/profile">Profile</Link>
        </li>
        <li className=" hover:cursor-pointer hover:text-softerPurple">
          <Link to="/wishlist">Wishlist</Link>
        </li>
        <li className=" hover:cursor-pointer hover:text-softerPurple">
          <Link to="/lastViewed">History</Link>
        </li>
        <li className=" hover:cursor-pointer hover:text-red-400">
          <button>Log Out</button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
