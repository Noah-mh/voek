import loginPhoto from "../../img/login/loginVec.png";
import "./signupBanner.css";
import SignupCustomer from "./SignupCustomer.js";

const SignupBannerCustomer = () => {  
  return (
    <div className="containerZ main w-screen h-screen flex">
      <div className="cardZ bg-white flex w-2/3 h-3/5 justify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left  w-1/2 h-full flex-wrap py-7">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center pt-4 text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        <SignupCustomer />
      </div>
    </div>
  );
};

export default SignupBannerCustomer;

