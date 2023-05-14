import "./signUP.css";
import '../LoginBanner/OTP.css';
import axios from '../../api/axios.js'
import { useEffect, useState } from "react";


const Signup = (): JSX.Element => {

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [alert, setAlert] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(username.length > 0 && email.length > 0 && phoneNumber.length > 0 && password.length > 0 ? false : true)
    setErrMsg("");
    setAlert(false);
  }, [username, email, phoneNumber, password])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post("/customer/signup/link", JSON.stringify({ username, email, phone_number: phoneNumber, password }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setAlert(true);
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response.status === 409) {
        setErrMsg("Email Already Exists, Please Login");
      } else {
        setErrMsg("Server Error");
      }
    }
  }

  return (
    <div className="right w-1/2  h-full flex-wrap justify-center p-12">
      <h1 className=" text-center font-bold">SIGN UP</h1>
      <form onSubmit={submitHandler} className="pt-6">
        <div className="field-wrapper flex">
          <input
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
        {
          alert ?
            <div className="OTPModal w-3/5 mx-auto my-1 p-2 " id="OTPSMS">
              <p className="text-center font-sans">
                Verification Email Has Beeen Sent
              </p>
            </div> : null
        }
        <p>{errMsg}</p>
        <input disabled={disabled} type="submit" value="SIGN UP" className="submitLogin" />
      </form>
    </div>
  );
};
export default Signup;
