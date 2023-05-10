import { useLocation, Navigate, Outlet } from "react-router-dom";
import useCustomer from "../../hooks/UseCustomer";
import jwt_decode, { JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
    UserInfo: {
        role: string;
        // Add other properties if available
    };
}

const RequireAuthCustomer = () => {
    const { customer } = useCustomer();
    const location = useLocation();
    const decoded = customer?.accessToken ? (jwt_decode(customer.accessToken) as DecodedToken) : undefined;

    return (
        decoded?.UserInfo.role === 'customer'
            ? <Outlet />
            : customer?.username
                ? <Navigate to='unauthorized' state={{ from: location }} replace />
                : <Navigate to='/login' state={{ from: location }} replace />
    )
}

export default RequireAuthCustomer;