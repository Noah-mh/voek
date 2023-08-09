import { useState, useEffect } from "react";
import loginPhoto from "../../img/login/loginVec.png";
import axios from "../../api/axios";
import { ToastContainer, toast, Id } from "react-toastify";

const ForgetPasswordCustomer = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [toastId, setToastId] = useState<Id | undefined>(undefined);

  useEffect(() => {
    setDisabled(email.length === 0);
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [email]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/customer/forget/password", JSON.stringify({ email }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      toast.dismiss(toastId);

      const id = toast.success(
        "If the email exists, you will receive a password reset link",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setToastId(id);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Server Error");
      }
      toast.dismiss(toastId);

      const id = toast.error(errMsg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setToastId(id);
    }
  };

  return (
    <div className="containerZ main w-screen h-screen flex">
      <ToastContainer />
      <div className="cardZ bg-white flex w-2/3 h-3/5 justify-between mx-auto my-20 rounded-md overflow-hidden">
        <div className="left  w-1/2 h-full flex-wrap py-7">
          <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
          <h1 className="text-center pt-4 text-white">
            Explore a new world with VOEK.
          </h1>
        </div>
        <div className="right w-1/2 h-full justify-center items-center  align-middle py-7">
          <p className="">Please enter your email.</p>
          <form onSubmit={submitHandler}>
            <div className="field-wrapper flex">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                name="email"
                placeholder="EMAIL"
                className="w-72"
                autoComplete="off"
              />
            </div>
            <div className="field-wrapper flex">
              <input
                disabled={disabled}
                type="submit"
                value="SEND RESET LINK"
                className="submitLogin"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordCustomer;
