import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OtpInput from "react-otp-input";
import axios from "../../api/axios.js";
import "./OTP.css";
import useCustomer from "../../hooks/UseCustomer.js";
import { toast } from "react-toastify";
interface props {
  userDetails: object;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OTP({ userDetails, setLogin }: props): JSX.Element {

  const { setCustomer } = useCustomer();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { customer_id, username, phone_number, email } = userDetails as {
    customer_id: number;
    username: string;
    phone_number: number;
    email: string;
  };

  const [otp, setOtp] = useState("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    setDisabled(otp.length === 6 ? false : true)
  }, [otp])

  useEffect(() => {
    emailSentHandler();
  }, [])

  const emailSentHandler = async () => {
    try {
      await axios.post(
        "/customer/auth/email/OTP",
        JSON.stringify({ customer_id, email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      toast.success("Email OTP has been sent", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg("Server Error");
      }
    }
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/customer/auth/verify/OTP",
        JSON.stringify({ customer_id, OTP: otp }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      const { accessToken } = response.data;
      setCustomer({ customer_id, username, accessToken, checkOut: {} })
      navigate(from);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response.status === 400) {
        toast.error("OTP is incorrect", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setErrMsg("Server Error");
      }
    }
  }

  const smsSentHandler = async () => {
    try {
      await axios.post(
        "/customer/auth/SMS/OTP",
        JSON.stringify({ phoneNumber: phone_number, customer_id }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      toast.success("SMS OTP has been sent", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg("Server Error");
      }
    }
  }

  return (
    <div className="w-1/2 flex-col justify-center pt-20">
      <div className="wrapper flex-col justify-center ">
        <h1 className="w-4/12 text-center mb-5 text-white cursor-pointer" onClick={() => { setLogin(false) }}>Go Back</h1>
        <h1 className="text-center font-bold text-3xl">Enter OTP</h1>
        <div className="text-center mb-3  ">
          Receive OTP through{" "}
          <span
            onClick={emailSentHandler}
            className="underline text-white hover:cursor-pointer font-bold text-xl"
          >
            Email
          </span>{" "}
          or{" "}
          <span
            onClick={smsSentHandler}
            className="underline text-white hover:cursor-pointer font-bold text-xl"
          >
            SMS
          </span>
        </div>
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
        <form className="wrapper flex-col justify-center" onSubmit={submitHandler}>
          <input
            disabled={disabled}
            type="submit"
            value="VERIFY OTP"
            className="!outline-none submitOTP w-4/5 bg-purpleAccent text-white rounded-md p-1 text-sm font-Barlow font-semibold tracking-widest hover:bg-transparent"
          />
        </form>
        <p>{errMsg}</p>
      </div>
    </div>
  );
}
