import React, { useState, useEffect } from 'react'
import loginPhoto from "../../img/login/loginVec.png";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios.js';

const ResetPasswordCustomer = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const forgetPasswordToken = searchParams.get('forgetPasswordToken');

    const [customer_id, setCustomer_id] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>("");

    useEffect(() => {
        if (confirmPassword === password) {
            setDisabled(false)
            setErrMsg("")
        } else {
            setDisabled(true)
            setErrMsg("Passwords do not match")
        }
    }, [password, confirmPassword])

    useEffect(() => {
        const checkForgetPasswordToken = async () => {
            try {
                const result = await axios.post('/customer/verify/reset/password', JSON.stringify({ forgetPasswordToken }), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                setCustomer_id(result.data.customer_id);
            } catch (err) {
                navigate('/unauthorized', { replace: true });
            }
        }
        checkForgetPasswordToken();
    }, [])


    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put('/customer/reset/password', JSON.stringify({ customer_id, password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            navigate('/login', { replace: true });
        } catch (err: any) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg("Server Error");
            }
        }
    }

    return (
        <div className="containerZ main w-screen h-screen flex">
            <div className="cardZ bg-white flex w-2/3 h-3/5 justify-between mx-auto my-20 rounded-md overflow-hidden">
                <div className="left  w-1/2 h-full flex-wrap py-7">
                    <img src={loginPhoto} alt="loginPhoto" className="w-3/5 mx-auto" />
                    <h1 className="text-center pt-4 text-white">
                        Explore a new world with VOEK.
                    </h1>
                </div>
                <div className="right w-1/2 h-full flex-wrap py-7">
                    <form onSubmit={submitHandler}>
                        <div>
                            <div className="field-wrapper flex">
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="email" placeholder="PASSWORD" className="w-72 !outline-none" autoComplete="off" />
                            </div>
                            <div className="field-wrapper flex">
                                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" name="email" placeholder="CONFIRM PASSWORD" className="w-72 !outline-none" autoComplete="off" />
                            </div>
                            <div className="field-wrapper flex">
                                <input disabled={disabled} type="submit" value="RESET PASSWORD" className="submitLogin !outline-none" />
                            </div>
                        </div>
                    </form>
                    <div className="text-red-500 text-center">{errMsg}</div>
                </div>
            </div>
        </div >
    )
}

export default ResetPasswordCustomer
