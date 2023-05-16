import "./css/DropDownProfile.css";
const DropDownProfile = () => {
  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-4 dropDownProfile">
        <li className=" hover:cursor-pointer">Profile</li>
        <li className=" hover:cursor-pointer">Wishlist</li>
        <li className=" hover:cursor-pointer">History</li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
