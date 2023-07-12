import loginPhoto from "../../img/login/loginVec.png";
import "./signupBanner.css";
import SignupCustomer from "./SignupCustomer.js";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const SignupBannerCustomer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const referral_id: string | null = searchParams.get("referral_id");

  return (
    <div className="containerZ main w-screen h-screen flex">
      <ToastContainer />
      <div className="cardZ bg-white flex w-2/3 justify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left justify-center items-center flex flex-col w-1/2 ">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        <SignupCustomer referral_id={referral_id} />
      </div>
    </div>
  );
};

export default SignupBannerCustomer;
