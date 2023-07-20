import '../LoginBanner/OTP.css';
import axios from '../../api/axios.js'
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from 'react-toastify';


const SignupSeller = (): JSX.Element => {

  const captchaRef = useRef<ReCAPTCHA>(null);
  const [shopName, setShopName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

  const [errMsg, setErrMsg] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);

  // useEffect(() => {
  //   setDisabled(shopName.length > 0 && email.length > 0 && phoneNumber.length > 0 && password.length > 0 ? false : true)
  //   setErrMsg("");
  // }, [shopName, email, phoneNumber, password])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (shopName.length == 0 || email.length == 0 || phoneNumber.length == 0 || password.length == 0 || confirmedPassword.length == 0) {
      toast.error("Please fill in all the fields", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else if (password !== confirmedPassword) {
      toast.error("Please make sure the passwords are the same", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else if (!captchaRef.current?.getValue()) {
      toast.error("Please verify yourself :)", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      await axios.post("/seller/signup/link", JSON.stringify({ shopName, email, phone_number: phoneNumber, password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      toast.success("Verification link has been sent", {
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
      } else if (err.response.status === 409) {
        toast.error("Email already exists. Please Login", {
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

  return (
    <div className="rightSignUp flex flex-col w-1/2 align-middle justify-center items-center py-4">
      <h1 className=" text-center font-bold">SIGN UP</h1>
      <form onSubmit={submitHandler} className="pt-6">
        <div className="field-wrapper flex">
          <input
            type="text"
            name="shopName"
            placeholder="SHOP NAME"
            className="w-72"
            autoComplete="off"
            onChange={(e) => setShopName(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            autoComplete="off"
            className="w-72"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="number"
            name="phoneNumber"
            placeholder="PHONE NUMBER"
            autoComplete="off"
            className="w-72"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            autoComplete="off"
            className="w-72"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="password"
            name="password"
            placeholder="CONFIRM PASSWORD"
            autoComplete="off"
            className="w-72"
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <ReCAPTCHA
            sitekey={import.meta.env.RECAPTCHA || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
            ref={captchaRef}
          />
        </div>
        <input type="submit" value="SIGN UP" className="submitLogin" />
      </form>
      <p>{errMsg}</p>
    </div>
  );
};
export default SignupSeller;
