import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import axios from "../../api/axios.js";
import "./OTP.css";
import useCustomer from "../../hooks/UseCustomer.js";
interface props {
  userDetails: object;
}

export default function OTP({ userDetails }: props): JSX.Element {
  const { setCustomer } = useCustomer();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { customer_id, username, phone_number, email } = userDetails as {
    customer_id: number;
    username: string;
    phone_number: number;
    email: string;
  };

  const [otp, setOtp] = useState("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [modalEmail, setModalEmail] = useState<boolean>(false);
  const [modalSMS, setModalSMS] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    setDisabled(otp.length === 6 ? false : true);
  }, [otp]);

  const emailSentHandler = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/customer/auth/email/OTP",
        JSON.stringify({ customer_id, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setModalEmail(true);
      setModalSMS(false);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Server Error");
      }
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/customer/auth/verify/OTP",
        JSON.stringify({ customer_id, OTP: otp }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { accessToken } = response.data;
      setCustomer({ customer_id, username, accessToken, cart: [] });
      navigate(from);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg("OTP Is Incorrect");
      } else {
        setErrMsg("Server Error");
      }
    }
  };

  const smsSentHandler = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/customer/auth/SMS/OTP",
        JSON.stringify({ phoneNumber: phone_number, customer_id }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setModalEmail(false);
      setModalSMS(true);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Server Error");
      }
    }
  };

  return (
    <div className="w-1/2 flex-col justify-center pt-20">
      <div className="wrapper flex-col justify-center ">
        <h1 className="text-center font-bold text-3xl">Enter OTP</h1>
        <div className="text-center mb-3  ">
          Receive OTP through{" "}
          <span
            onClick={emailSentHandler}
            className="underline text-white hover:cursor-pointer"
          >
            Email
          </span>{" "}
          or{" "}
          <span
            onClick={smsSentHandler}
            className="underline text-white hover:cursor-pointer"
          >
            SMS
          </span>
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
            onChange={(value: string) => setOtp(value)}
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
        <form
          className="wrapper flex-col justify-center"
          onSubmit={submitHandler}
        >
          <input
            disabled={disabled}
            type="submit"
            value="VERIFY OTP"
            className="submitOTP w-4/5 bg-purpleAccent text-white rounded-md p-1 text-sm font-Barlow font-semibold tracking-widest hover:bg-transparent"
          />
        </form>
        <p>{errMsg}</p>
      </div>
    </div>
  );
}
