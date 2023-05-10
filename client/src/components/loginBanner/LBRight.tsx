import React from "react";
import "./LBRight.css";

const loginBannerRight = (): JSX.Element => {
  return (
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
  );
};
export default loginBannerRight;
