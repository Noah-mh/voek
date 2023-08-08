import "./css/header.css";
import React, { useRef, useState, useEffect } from "react";
import useCustomer from "../../hooks/UseCustomer.js";
import useSeller from "../../hooks/useSeller.js";
import LiveSearch from "../header/LiveSearch.js";
import { Link } from "react-router-dom";
import axios from "../../api/axios.js";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeart,
  faClockRotateLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const ref: any = useRef();

  const { customer } = useCustomer();
  const { seller } = useSeller();

  const { setCustomer } = useCustomer();
  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const navigate = useNavigate();

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
        console.error(err);
      });
  }, []);

  const handleLogOut = async () => {
    try {
      setCustomer({});
      await axiosPrivateCustomer.put("/customer/logout");
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <nav
      ref={ref}
      className="flex items-center justify-center bg-white p-6 px-8 drop-shadow-md"
    >
      <div className={`w-${customer?.customer_id ? 9 : 7}/12 flex`}>
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
            <>
              <Link to="/">
                <p className="text-purpleAccent">Products</p>
              </Link>
              <Link to="/seller/signup">
                <p className="ms-5 text-purpleAccent font-bold">
                  Become a seller today!
                </p>
              </Link>
              <Link to="/claimVouchers" className="ms-6 text-lg font-bold">
                <p className="text-purpleAccent">Claim Vouchers</p>
              </Link>
            </>
          ) : isSeller ? (
            <>
              <h1>Seller Centre</h1>
              <Link to="/">
                <p className="ms-5 text-purpleAccent font-bold">
                  Go back to shopping!
                </p>
              </Link>
            </>
          ) : null}
        </div>
      </div>
      <div className={`block justify-end ${isCustomer && 'w-1/2'}`}>
        <div className="text-sm lg:flex-grow inline-block  px-4  leading-none">
          {isCustomer ? (
            customer?.customer_id ? (
              <div className="flex flex-row justify-center items-center">
                <LiveSearch
                  results={results}
                  searchResults={searchResults}
                  setSearchResults={setSearchResults}
                />
                <div className="ml-5 flex">
                  <Link to="/customer/game" className="mx-2">
                    <p className="text-purpleAccent">Play To Earn!</p>
                  </Link>
                  <div className="mx-2">
                    <p
                      className="text-purpleAccent hover:cursor-pointer"
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      Profile
                    </p>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      className="mt-3"
                    >
                      <MenuItem
                        onClick={handleClose}
                        className="hover:cursor-pointer hover:text-softerPurple flex flex-row items-center space-x-2"
                      >
                        <Link
                          to="/profile"
                          className="flex flex-row items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <h1>Profile</h1>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={handleClose}
                        className="hover:cursor-pointer hover:text-softerPurple"
                      >
                        <Link
                          to="/wishlist"
                          className="flex flex-row items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faHeart} />
                          <h1>Wishlist</h1>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={handleClose}
                        className="hover:cursor-pointer hover:text-softerPurple flex flex-row items-center space-x-2"
                      >
                        <Link
                          to="/lastViewed"
                          className="flex flex-row items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faClockRotateLeft} />
                          <h1>Last Viewed</h1>
                        </Link>
                      </MenuItem>
                      <MenuItem
                        onClick={handleClose}
                        className="hover:cursor-pointer hover:text-pink flex flex-row items-center space-x-2"
                      >
                        <button
                          onClick={handleLogOut}
                          className="flex flex-row items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} />
                          <h1>Log Out</h1>
                        </button>
                      </MenuItem>
                    </Menu>
                  </div>
                  <Link to="/customer/dailyCheckIn" className="mx-2">
                    <p className="text-purpleAccent">Check In</p>
                  </Link>

                  <Link to="/chat" className="mx-2">
                    <p className="text-purpleAccent">Chat</p>
                  </Link>
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
                  <Link to="/signup" className="mx-2">
                    <p className="text-purpleAccent font-bold">
                      Sign up today!
                    </p>
                  </Link>
                  <Link to="/customer/cart" className="mx-2">
                    <p className="text-purpleAccent">Cart</p>
                  </Link>
                </div>
              </div>
            )
          ) : isSeller ? (
            seller?.seller_id ? (
              <div className="ml-5 flex">
                <Link to="/seller/profile" className="mx-2">
                  <p className="text-purpleAccent">Profile</p>
                </Link>
                <Link to="/seller/chat" className="mx-2">
                  <p className="text-purpleAccent">Chat</p>
                </Link>
              </div>
            ) : (
              <Link to="/seller/login">
                <p className="text-purpleAccent">Login</p>
              </Link>
            )
          ) : null}
        </div>
      </div>
      <br />
    </nav>
  );
};
export default Header;
