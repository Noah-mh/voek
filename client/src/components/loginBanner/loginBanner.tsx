import React from "react";
import "./loginBanner.css";
import loginPhoto from "../../img/login/loginVec.png";
const loginBanner = () => {
  return (
    <div className="containerZ main w-screen h-screen flex">
      <div className="card bg-white flex w-2/3 h-3/5 justify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left  w-1/2 h-full flex-wrap py-7">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center pt-4 text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        <div className="right w-1/2  h-full flex-wrap justify-center p-12">
          <h1 className=" text-center font-bold">LOG IN</h1>
          <form className="pt-6">
            <div className="field-wrapper flex">
              <input
                type="text"
                name="username"
                placeholder="USERNAME"
                className="w-72"
              />
            </div>
            <div className="field-wrapper flex">
              <input
                type="password"
                name="password"
                placeholder="PASSWORD"
                autoComplete="new-password"
                className="w-72"
              />
            </div>
            <a href="/">Forgot Password?</a>
            <input type="submit" value="LOG IN" className="submitLogin" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default loginBanner;
