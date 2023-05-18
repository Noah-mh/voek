import { useEffect } from "react";
import "./VerifySignupSeller.css"
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios.js';

const VerifySignupSeller = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const signupToken = searchParams.get('signupToken');

    useEffect(() => {
        const checkSignUpToken = async () => {
            try {
                 await axios.post('/seller/signup/verify/link', JSON.stringify({ signUpToken: signupToken }), {
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
            <Link to="/seller/login">Login</Link>
        </div>
    )
}

export default VerifySignupSeller