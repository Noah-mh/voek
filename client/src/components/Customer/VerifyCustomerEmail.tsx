import { useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios.js';

const VerifyCustomerEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const changeCustomerEmailToken = searchParams.get('token');

    useEffect(() => {
        const changeCustomerEmail = async () => {
            try {
                await axios.put('/customer/email/verify', JSON.stringify({ changeCustomerEmailToken }), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            } catch (err) {
                navigate('/unauthorized', { replace: true });
            }
        }
        changeCustomerEmail();
    }, [])

    return (
        <div>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default VerifyCustomerEmail