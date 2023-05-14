import "./header.css";
import { useRef, useState, useEffect } from "react";
import useCustomer from "../../hooks/UseCustomer";
import useSeller from "../../hooks/useSeller";
import LiveSearch from "./LiveSearch";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

interface Props {
  isCustomer?: boolean;
  isSeller?: boolean;
}

interface Product {
  name: string;
}

const Header = ({ isCustomer, isSeller }: Props) => {
  const [results, setResults] = useState<Array<object>>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const ref: any = useRef();

  const { customer } = useCustomer();
  const { seller } = useSeller();

  useEffect(() => {
    axios
      .get(`/getAllListedProducts`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => response.data)
      .then((data) => {
        setResults(data);
        setSearchResults(data);
      })
      .catch((err: any) => {});
  }, []);

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
              <p className="text-purpleAccent">Products</p>
            </Link>
          ) : isSeller ? (
            <h1>Seller Centre</h1>
          ) : null}
        </div>
      </div>
      <div className="block flex justify-end">
        <LiveSearch
          results={results}
          setSearchResults={setSearchResults}
          searchResults={searchResults}
        />
        <div className="text-sm lg:flex-grow inline-block px-4 leading-none mt-8">
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
                  <p className="text-purpleAccent">Login</p>
                </Link>
                <Link to="/customer/cart">
                  <p className="text-purpleAccent">Cart</p>
                </Link>
              </>
            )
          ) : isSeller ? (
            seller?.seller_id ? (
              <Link to="/seller/profile">
                <p className="text-purpleAccent">Profile</p>
              </Link>
            ) : (
              <Link to="/seller/login">
                <p className="text-purpleAccent">Login</p>
              </Link>
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
};
export default Header;
