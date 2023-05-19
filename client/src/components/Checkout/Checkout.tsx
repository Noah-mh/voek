import { useEffect, useState } from "react";
import useCustomer from "../../hooks/UseCustomer";
import { Link } from "react-router-dom";
import PayPal from "../PayPal/PayPal";
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function cartPage(): JSX.Element {
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

  const axiosPrivateCustomer = useAxiosPrivateCustomer();
  const payment_id = 6;
  const address_id = 4;
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    //first insert order (sequential) after payment id is received
    axiosPrivateCustomer
      .post(
        `/customer/insertOrder`,
        JSON.stringify({
          customer_id: customer_id,
          payment_id: payment_id,
          discount_applied: 0,
          coins_redeemed: 0,
          address_id: 1,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ) // receives order_id
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div>
      {paymentSuccess && (
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Payment Done!
              </h3>
              <p className="text-gray-600 my-2">
                Thank you for completing your secure online payment.
              </p>
              <p> Have a great day! </p>
              <div className="py-10 text-center">
                <a
                  href="#"
                  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                  GO BACK
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {!paymentSuccess && (
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 550 500"
              className="text-red-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
              />
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Payment Failed.
              </h3>
              <p className="text-gray-600 my-2">
                Something went wrong with the payment.
              </p>
              <p> Please try again.</p>
              <div className="py-10 text-center">
                <a
                  href="#"
                  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                  GO BACK
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
