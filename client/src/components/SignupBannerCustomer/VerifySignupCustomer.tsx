import { useEffect } from "react";
import "./VerifySignupCustomer.css"
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios.js';

const VerifySignupCustomer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const signupToken = searchParams.get('signupToken');

    useEffect(() => {
        const checkSignUpToken = async () => {
            try {
                 await axios.post('/customer/signup/verify/link', JSON.stringify({ signUpToken: signupToken }), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } catch (err) {
                navigate('/unauthorized', { replace: true });
            }
        }
        checkSignUpToken();
    }, [])


    return (
        <div>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default VerifySignupCustomer