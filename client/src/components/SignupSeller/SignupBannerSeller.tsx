import loginPhoto from "../../img/login/loginVec.png";
import "./signupBanner.css";
import SignupSeller from "./SignupSeller.js";
import { ToastContainer } from "react-toastify";

const SignupBannerSeller = () => {  
  return (
    <div className="containerZ main w-screen h-screen flex">
      <ToastContainer />
      <div className="cardZ bg-white flex w-2/3 justify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left justify-center items-center flex flex-col w-1/2">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center pt-4 text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        <SignupSeller />
      </div>
    </div>
  );
};

export default SignupBannerSeller;

