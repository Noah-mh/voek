import { Link } from "react-router-dom";
import "./css/DropDownProfile.css";
import useCustomer from "../../hooks/UseCustomer";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { useNavigate } from "react-router-dom";

const DropDownProfile = () => {

  const { setCustomer } = useCustomer();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      setCustomer({});
      await axiosPrivateCustomer.put("/customer/logout");
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.log(err)
    }
  }


  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-4 dropDownProfile">
        <li className="dropDownProfileText hover:cursor-pointer hover:text-softerPurple">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="dropDownProfileText hover:cursor-pointer hover:text-softerPurple">
          <Link to="/wishlist">Wishlist</Link>
        </li>
        <li className="dropDownProfileText hover:cursor-pointer">
          <Link to="/lastViewed">History</Link>
        </li>
        <li className=" hover:cursor-pointer hover:text-red-500">
          <button onClick={handleLogOut}>Log Out</button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
