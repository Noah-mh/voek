import React, { useState } from "react";
import OtpInput from "react-otp-input";
import "./OTP.css";

export default function OTP(): JSX.Element {
  const [otp, setOtp] = useState("");
  return (
    <div className="w-1/2 flexs hell">
      <div className="flex justify-center items-center align-middle">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            border: "1px solid transparent",
            borderRadius: "8px",
            width: "54px",
            height: "54px",
            fontSize: "12px",
            color: "#000",
            fontWeight: "400",
            caretColor: "blue",
          }}
        />
      </div>
    </div>
  );
}
