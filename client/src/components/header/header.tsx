import "./header.css";
import { useRef } from "react";
import useCustomer from "../../hooks/UseCustomer";
import useSeller from "../../hooks/useSeller";
import { Link } from "react-router-dom";

interface Props {
  isCustomer?: boolean;
  isSeller?: boolean;
}

const Header = ({ isCustomer, isSeller }: Props) => {
  const ref: any = useRef();

  const { customer } = useCustomer();
  const { seller } = useSeller();

  return (
    <nav
      ref={ref}
      className="flex items-center justify-center bg-white p-6 px-8 drop-shadow-md"
    >
      <div className=" w-9/12 flex">
        <div className="flex items-center  mr-6">
          <span className="font-bold text-xl tracking-widest">
            <Link to="/">VOEK</Link>
          </span>
        </div>
        <div className="flex items-center px-3 ">
          {isCustomer ? (
            <Link to="/">
              <p>Products</p>
            </Link>
          ) : isSeller ? (
            <h1>Seller Centre</h1>
          ) : null}
        </div>
      </div>
      <div className=" block flex justify-end">
        <div className="text-sm lg:flex-grow inline-block  px-4  leading-none">
          {isCustomer ? (
            customer?.customer_id ? (
              <>
                <Link to="/customer/profile">
                  <p>Profile</p>
                </Link>
                <Link to="/customer/cart">
                  <p>Cart</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <p>Login</p>
                </Link>
                <Link to="/cart">
                  <p>Cart</p>
                </Link>
              </>
            )
          ) : isSeller ? (
            seller?.seller_id ? (
              <Link to="/seller/profile">
                <p>Profile</p>
              </Link>
            ) : (
              <Link to="/seller/login">
                <p>Login</p>
              </Link>
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
};
export default Header;
