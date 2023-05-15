import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import OtpInput from "react-otp-input";
import axios from "../../api/axios";
import useCustomer from "../../hooks/UseCustomer";
import { AdvancedImage } from "@cloudinary/react";
import noImage from "../../img/product/No_Image_Available.jpg";
// import "./OTP.css";
// import useCustomer from "../../hooks/UseCustomer";
import "./UserCart.css";

// { customer_id }: { customer_id: number }
export default function cartPage(): JSX.Element {
  // const customer_id = 2;
  const { customer } = useCustomer();
  const customer_id = customer.customer_id;

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
      // try {
      //   const response = await axios.post(
      //     "/getCart",
      //     JSON.stringify({ customer_id }),
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       //   withCredentials: true,
      //     }
      //   );
      //   // const userCart: userCart = {
      //   //   customer_id: customer_id,
      //   //   role: "customer",
      //   //   cartItems: response.data,
      //   // };
      //   setUserCart(response.data);
      //   console.log(userCart);
      // } catch (err: any) {
      //   if (!err?.response) {
      //     setErrMsg("No Server Response");
      //     console.log("no resp");
      //   } else {
      //     setErrMsg("Server Error");
      //     console.log("server error");
      //   }
      // }
      return axios
        .post("/getCart", JSON.stringify({ customer_id }), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setUserCart(response.data);
          console.log(userCart);
        })
        .catch((err) => {
          if (!err?.response) {
            setErrMsg("No Server Response");
            console.log("no resp");
          } else {
            setErrMsg("Server Error");
            console.log("server error");
          }
        });
    };
    getUserCart();
  }, []);
  return (
    <div className="container flex">
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-2">
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-2 sm:col-span-1"></div>
          <div className="col-span-2 sm:col-span-1">Name</div>
          <div className="col-span-2 sm:col-span-1">Price</div>
          <div className="col-span-2 sm:col-span-1">Variations</div>
          <div className="col-span-4 sm:col-span-1">Quantity</div>
        </div>

        {userCart.map((item: cartItem) => (
          <div className="grid grid-cols-6 gap-4 py-4" key={item.product_id}>
            <div className="col-span-2 sm:col-span-1">
              <img src={noImage} className="productImage" />
            </div>
            <div className="col-span-2 sm:col-span-1">{item.name}</div>
            <div className="col-span-2 sm:col-span-1">${item.price}</div>
            <div className="col-span-2 sm:flex-row sm:col-span-1">
              <div className="mr-4">
                {item.variation_1 ? item.variation_1 : "-"}
              </div>
              <div>{item.variation_2 ? item.variation_2 : null}</div>
            </div>
            <div className="col-span-4 sm:col-span-1">
              <button className="text-sm border px-2 py-1 mx-2">-</button>
              {item.quantity}
              <button className="text-sm border  px-2 py-1 mx-2"> + </button>
            </div>
          </div>
        ))}
      </div>
      <div className="right w-1/3 bg-softerPurple"></div>
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
