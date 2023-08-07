import { useState } from "react";
// import "./signUP.css";
import loginPhoto from "../../img/login/loginVec.png";
import OTP from "./OTP.tsx";
import "./loginBanner.css";
import LBRight from "./LBRight.tsx";
import { ToastContainer } from "react-toastify";

const LoginBanner = () => {
  const [userDetails, setUserDetails] = useState<object>({});
  const [login, setLogin] = useState<boolean>(false);
  return (
    <div className="containerZ main w-screen h-screen flex">
      <ToastContainer />
      <div className="cardZ bg-white flex w-2/3 h-3/5 flexjustify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left  w-1/2 h-full flex flex-col justify-center items-center py-7">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center pt-4 text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        {login ? (
          <OTP userDetails={userDetails} setLogin={setLogin} />
        ) : (
          <LBRight setLogin={setLogin} setUserDetails={setUserDetails} />
        )}
      </div>
    </div>
  );
};

export default LoginBanner;
