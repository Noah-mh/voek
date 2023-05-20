import { useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios.js';

const VerifySellerEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const changeSellerEmailToken = searchParams.get('token');

    useEffect(() => {
        const changeSellerEmail = async () => {
            try {
                await axios.put('/seller/email/verify', JSON.stringify({ changeSellerEmailToken }), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } catch (err) {
                navigate('/unauthorized', { replace: true });
            }
        }
        changeSellerEmail();
    }, [])

    return (
        <div>
            <Link to="/seller/login">Login</Link>
        </div>
    )
}

export default VerifySellerEmail