import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import "./OTP.css";
import { Link } from "react-router-dom";

export default function OTP(): JSX.Element {
  // useEffect = () => {};
  const [otp, setOtp] = useState("");
  const [modalEmail, setModalEmail] = useState<boolean>(false);
  const [modalSMS, setModalSMS] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean>(false);

  return (
    <div className="w-1/2 flex-col justify-center pt-20">
      <div className="wrapper flex-col justify-center ">
        <h1 className="text-center font-bold text-3xl">Enter OTP</h1>
        <div className="text-center mb-3  ">
          Receive OTP through{" "}
          <Link
            to="/"
            onClick={() => {
              setModalEmail(true);
              setModalSMS(false);
            }}
            className="underline text-white"
          >
            Email
          </Link>{" "}
          or{" "}
          <Link
            to="/"
            onClick={() => {
              setModalEmail(false);
              setModalSMS(true);
            }}
            className="underline text-white"
          >
            SMS
          </Link>
        </div>
        {modalEmail && (
          <div className="OTPModal w-3/5 mx-auto my-1 p-2 " id="OTPEmail">
            <p className="text-center font-sans">
              OTP has been sent to your email. Please open your inbox and check.
            </p>
          </div>
        )}
        {modalSMS && (
          <div className="OTPModal w-3/5 mx-auto my-1 p-2 " id="OTPSMS">
            <p className="text-center font-sans">
              OTP has been sent to your phone number. Please open your messages
              and check.
            </p>
          </div>
        )}
        <div className="OTPz justify-center items-center align-middle">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              border: "1px solid transparent",
              borderRadius: "8px",
              width: "3.2em",
              height: "3.8em",
              fontSize: "12px",
              color: "#000",
              fontWeight: "400",
              caretColor: "blue",
            }}
          />
        </div>
        <input
          type="button"
          value="VERIFY OTP"
          className="submitOTP w-4/5 bg-purpleAccent text-white rounded-md p-1 text-sm font-Barlow font-semibold tracking-widest hover:bg-transparent "
        />
      </div>
    </div>
  );
}
