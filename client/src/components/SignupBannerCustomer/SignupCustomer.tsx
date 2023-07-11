import "../LoginBanner/OTP.css";
import axios from "../../api/axios.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  referral_id: string | null;
}

const SignupCustomer = ({ referral_id }: Props): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(
      username.length > 0 &&
        email.length > 0 &&
        phoneNumber.length > 0 &&
        password.length > 0
        ? false
        : true
    );
  }, [username, email, phoneNumber, password]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `/customer/signup/link/${referral_id}`,
        JSON.stringify({
          username,
          email,
          phone_number: phoneNumber,
          password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
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
        setErrMsg("No Server Response");
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
  };

  return (
    <div className="rightSignUp flex flex-col w-1/2 align-middle justify-center items-center">
      <h1 className="font-bold">SIGN UP</h1>
      <form onSubmit={submitHandler} className="pt-6">
        <div className="field-wrapper flex">
          <input
            required
            type="text"
            name="username"
            placeholder="USERNAME"
            className="w-72"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            required
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
            required
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
            required
            type="password"
            name="password"
            placeholder="PASSWORD"
            autoComplete="off"
            className="w-72"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          disabled={disabled}
          type="submit"
          value="SIGN UP"
          className="submitLogin"
        />
      </form>
      <p>{errMsg}</p>
    </div>
  );
};
export default SignupCustomer;
