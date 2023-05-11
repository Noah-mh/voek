import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import OtpInput from "react-otp-input";
import axios from "../../api/axios";
// import "./OTP.css";
// import useCustomer from "../../hooks/UseCustomer";

// { customer_id }: { customer_id: number }
export default function cartPage(): JSX.Element {
  const customer_id = 2;

  interface userCart {
    customer_id: number;
    role: string;
    cartItems: Array<cartItem>;
  }
  interface cartItem {
    product_id: number;
    name: string;
    quantity: number;
    price: string;
    image_url: string;
    variation_1: string;
    variation_2: string;
    stock: number;
  }
  const [errMsg, setErrMsg] = useState<string>("");
  const [userCart, setUserCart] = useState<cartItem[]>([]);
  //   const [customerId, setCustomerId] = useState<number>(2);
  useEffect(() => {
    const getUserCart = async () => {
      try {
        const response = await axios.post(
          "/getCart",
          JSON.stringify({ customer_id }),
          {
            headers: { "Content-Type": "application/json" },
            //   withCredentials: true,
          }
        );
        // const userCart: userCart = {
        //   customer_id: customer_id,
        //   role: "customer",
        //   cartItems: response.data,
        // };
        setUserCart(response.data);
        console.log(userCart);
      } catch (err: any) {
        if (!err?.response) {
          setErrMsg("No Server Response");
          console.log("no resp");
        } else {
          setErrMsg("Server Error");
          console.log("server error");
        }
      }
    };
    getUserCart();
  }, []);
  return (
    <div>
      <div className="container">
        {userCart.map((item: cartItem) => (
          <div className="cart-item">
            <div className="product-id">{item.product_id}</div>
            <div className="name">{item.name}</div>
            <div className="quantity">{item.quantity}</div>
            <div className="price">{item.price}</div>
            <div className="image-url">{item.image_url}</div>
            <div className="variation-1">{item.variation_1}</div>
            <div className="variation-2">{item.variation_2}</div>
            <div className="stock">{item.stock}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// const smsSentHandler = async (e: React.MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/customer/auth/SMS/OTP",
//         JSON.stringify({ phoneNumber: phone_number, customer_id }),
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true
//         })
//       setModalEmail(false);
//       setModalSMS(true);
//     } catch (err: any) {
//       if (!err?.response) {
//         setErrMsg('No Server Response');
//       } else {
//         setErrMsg("Server Error");
//       }
//     }
//   }
