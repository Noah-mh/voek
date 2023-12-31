import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from "./PayPalPayment";
import { useEffect, useState } from "react";

interface Props {
  amount: number;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const PayPal = ({ amount, setSuccess }: Props) => {
  const [paypalAmount, setPaypalAmount] = useState(0);

  useEffect(() => {
    setPaypalAmount(amount);
  }, [amount]);

  const initialOptions = {
    "client-id":
      "ARw2wYulFy7lbbqLNXXLUlJw3yJFkaY7Y4g3yr10Hlq4WpSCpj10JfloLeDeBTN2nL7GibnMJWbrc6Pi",
    currency: "SGD",
    intent: "capture",
    // "data-client-token": "abc123xyz==",
  };

  return (
    <div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalPayment setSuccess={setSuccess} paypalAmount={paypalAmount} />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPal;
