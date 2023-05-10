import React from "react";
import "./signUP.css";

// havent finish any of the routes

const signUP = (): JSX.Element => {
  return (
    <div className="right w-1/2  h-full flex-wrap justify-center p-12">
      <h1 className=" text-center font-bold">SIGN UP</h1>
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
            type="email"
            name="email"
            placeholder="EMAIL"
            autoComplete="new-email"
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
        <input type="submit" value="GET OTP" className="submitLogin" />
      </form>
    </div>
  );
};
export default signUP;
