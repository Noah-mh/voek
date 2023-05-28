import "./css/header.css";
import { useRef, useState, useEffect } from "react";
import useCustomer from "../../hooks/UseCustomer.js";
import useSeller from "../../hooks/useSeller.js";
import LiveSearch from "../header/LiveSearch.js";
import DropDownProfile from "../header/DropDownProfile.js";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import { useLocation } from "react-router-dom";

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
  const [openProfile, setOpenProfile] = useState<boolean>(false);

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
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const location = useLocation();
  useEffect(() => {
    setOpenProfile(false);
  }, [location])


  return (
    <nav
      ref={ref}
      className="flex items-center justify-center bg-white p-6 px-8 drop-shadow-md"
    >
      <div className=" w-9/12 flex">
        <div className="flex items-center  mr-6">
          <span className="font-bold text-xl tracking-widest">
            {seller?.seller_id ? (
              <Link to="/seller/home">VOEK</Link>
            ) : (
              <Link to="/">VOEK</Link>
            )}
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
      <div className="block justify-end">
        <div className="text-sm lg:flex-grow inline-block  px-4  leading-none">
          {isCustomer ? (
            customer?.customer_id ? (
              <div className="flex flex-row justify-center items-center">
                <LiveSearch
                  results={results}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                />
                <div className="ml-5 flex flex-row">
                  <div className="mx-2">
                    <p
                      className="text-purpleAccent hover:cursor-pointer"
                      onClick={() => setOpenProfile(!openProfile)}
                    >
                      Profile
                    </p>
                  </div>
                  <Link to="/customer/cart" className="mx-2">
                    <p className="text-purpleAccent">Cart</p>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center">
                <LiveSearch
                  results={results}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                />
                <div className="ml-5 flex flex-row">
                  <Link to="/login" className="mx-2">
                    <p className="text-purpleAccent">Login</p>
                  </Link>
                  <Link to="/customer/cart" className="mx-2">
                    <p className="text-purpleAccent">Cart</p>
                  </Link>
                </div>
              </div>
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
      {openProfile && <DropDownProfile />}
    </nav>
  );
};
export default Header;
