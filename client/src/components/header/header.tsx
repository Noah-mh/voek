import "./header.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const ref: any = useRef();
  const [customerId, setCustomerId] = useState<number>(2);
  // setCustomerId(2);
  return (
    <nav
      ref={ref}
      className="flex items-center justify-center bg-white p-6 px-8 drop-shadow-md"
    >
      <div className=" w-9/12 flex">
        <div className="flex items-center  mr-6">
          <span className="font-bold text-xl tracking-widest">VOEK</span>
        </div>
        <div className="flex items-center px-3 ">
          <a href="./Products.tsx" className=" text-bold">
            Products
          </a>
        </div>
      </div>
      <div className=" block flex justify-end">
        <div className="text-sm lg:flex-grow inline-block  px-4  leading-none">
          <Link
            to={`cart`}
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4"
          >
            Cart
          </Link>
          {/* <a
            href="./Cart.tsx"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4"
          >
            Cart
          </a> */}
          <a
            href="./Profile.tsx"
            className="block mt-4 lg:inline-block lg:mt-0 hover:text-white mr-4"
          >
            Profile
          </a>
        </div>
      </div>
    </nav>
  );
};
export default Header;
