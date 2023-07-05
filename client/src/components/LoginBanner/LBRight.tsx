import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { AxiosResponse } from 'axios'
import "./LBRight.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface props {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>
  setUserDetails: React.Dispatch<React.SetStateAction<object>>
}

interface ResponseData {
  customer_id: string;
  username: string;
  phone_number: string;
  email: string;
}

const LBRight = ({ setLogin, setUserDetails }: props): JSX.Element => {

  const [inputEmail, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setErrMsg("");
    setDisabled(inputEmail && password ? false : true)
  }, [inputEmail, password])


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response: AxiosResponse<ResponseData> = await axios.post<ResponseData>('/login',
        JSON.stringify({ email: inputEmail, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
      setUserDetails(response.data);
      setLogin(true);
    } catch (err: any) {
      console.log(err)
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err?.response.status === 401) {
        toast.error("Incorrect Username/Password", {
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
        setErrMsg('Login Failed');
      }
    }
  }

  return (
    <div className="right w-1/2  h-full flex-wrap justify-center p-12">
      <h1 className=" text-center font-bold">LOG IN</h1>
      <form className="pt-6" onSubmit={submitHandler}>
        <div className="field-wrapper flex">
          <input
            type="text"
            name="email"
            placeholder="EMAIL"
            className="w-72"
            autoComplete="off"
            value={inputEmail}
            onChange={(e) => { setEmail(e.target.value) }}
          />
        </div>
        <div className="field-wrapper flex">
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            autoComplete="new-password"
            className="w-72"
            onChange={(e) => { setPassword(e.target.value) }}
            value={password}
          />
        </div>
        {/* change to link create route for this */}
        <div className="field-wrapper flex justify-center">
          <Link to='/forgetpassword'>Forget Password?</Link>
        </div>
        <div className="field-wrapper flex justify-center">
          <Link to='/signup'>Sign Up</Link>
        </div>
        <p>{errMsg}</p>
        <input disabled={disabled} type="submit" value="LOG IN" className="submitLogin" />
      </form>
    </div>
  );
};
export default LBRight;
