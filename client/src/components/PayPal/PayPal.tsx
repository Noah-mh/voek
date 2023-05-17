import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from './PayPalPayment';

interface CartItem {

}

interface Props {
    cart: CartItem[]
}

const PayPal = () => {

    const initialOptions = {
        "client-id": "ARw2wYulFy7lbbqLNXXLUlJw3yJFkaY7Y4g3yr10Hlq4WpSCpj10JfloLeDeBTN2nL7GibnMJWbrc6Pi",
        currency: "SGD",
        intent: "capture",
        // "data-client-token": "abc123xyz==",
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalPayment />
            </PayPalScriptProvider>
        </div>
    )
}

export default PayPal