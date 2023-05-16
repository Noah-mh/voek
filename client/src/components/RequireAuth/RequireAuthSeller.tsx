import { useLocation, Navigate, Outlet } from "react-router-dom";
import useSeller from "../../hooks/useSeller.js";
import jwt_decode, { JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
    UserInfo: {
        role: string;   
        seller_id: string;
    };
}

const RequireAuthSeller = () => {
    const { seller } = useSeller();
    const location = useLocation();
    const decoded = seller?.accessToken ? (jwt_decode(seller.accessToken) as DecodedToken) : undefined;

    return (
        decoded?.UserInfo.role === 'seller'
            ? <Outlet />
            : seller?.accessToken
                ? <Navigate to='unauthorized' state={{ from: location }} replace />
                : <Navigate to='/seller/login' state={{ from: location }} replace />
    )
}

export default RequireAuthSeller;